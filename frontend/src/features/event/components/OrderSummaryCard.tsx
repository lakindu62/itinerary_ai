'use client';

import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { createRsvp } from '../lib/event-api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

type OrderSummaryCardProps = {
  eventId: string;
  ticketPrice: number;
  maxAttendees: number;
};

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ eventId, ticketPrice, maxAttendees }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [ticketCount, setTicketCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleIncrement = () => {
    setTicketCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    setTicketCount(prev => (prev > 1 ? prev - 1 : 1));
  };

  const total = ticketPrice * ticketCount;

  const handleGetTicket = async () => {
    if (!user || !user.id || !getToken) {
      setErrorMessage("You must be logged in to get tickets.");
      setShowErrorDialog(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const rsvpData = {
        eventId: eventId,
        userId: user.id, // Clerk user ID
        rsvpStatus: "confirmed", // Or "pending", depending on your flow
        guestCount: ticketCount,
      };
      await createRsvp(rsvpData, getToken);
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Failed to create RSVP:", error);
      setErrorMessage(error.message || "Failed to book tickets. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#EBE6FF] dark:bg-muted/40 rounded-lg p-6 text-foreground">
      <h3 className="text-lg font-bold text-center mb-4">Order Summary</h3>
      <div className="flex justify-between items-center mb-4">
        <span>Per Ticket:</span>
        <span>Rs. {ticketPrice}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span>No of Ticket:</span>
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={handleDecrement} className="h-8 w-8" disabled={isSubmitting || ticketCount <= 1}>
            -
          </Button>
          <span className="mx-4">{ticketCount}</span>
          <Button variant="outline" size="icon" onClick={handleIncrement} className="h-8 w-8" disabled={isSubmitting || ticketCount >= maxAttendees}>
            +
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center font-bold text-lg mb-6">
        <span>Total:</span>
        <span>Rs. {total}</span>
      </div>
      <Button
        className="w-full bg-[#5B30D6] hover:bg-[#4a26b3] dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-bold rounded-lg"
        onClick={handleGetTicket}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Booking..." : "Get Ticket"}
      </Button>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className='items-center'>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <DialogTitle className="text-2xl font-bold">Booking Confirmed!</DialogTitle>
            <DialogDescription>
              You have successfully booked {ticketCount} ticket(s) for this event.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Booking Failed</DialogTitle>
            <DialogDescription>
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderSummaryCard;
