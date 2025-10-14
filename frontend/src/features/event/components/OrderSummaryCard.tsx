'use client';

import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { createRsvp } from '../lib/event-api';
import { toast } from 'sonner';

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

  const handleIncrement = () => {
    setTicketCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    setTicketCount(prev => (prev > 1 ? prev - 1 : 1));
  };

  const total = ticketPrice * ticketCount;

  const handleGetTicket = async () => {
    if (!user || !user.id || !getToken) {
      toast.error("You must be logged in to get tickets.");
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
      toast.success(`Successfully booked ${ticketCount} ticket(s)!`);
      // Optionally, refresh event data or redirect
    } catch (error: any) {
      console.error("Failed to create RSVP:", error);
      toast.error(error.message || "Failed to book tickets. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#EBE6FF] rounded-lg p-6">
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
        className="w-full bg-[#5B30D6] hover:bg-[#4a26b3] text-white font-bold rounded-lg"
        onClick={handleGetTicket}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Booking..." : "Get Ticket"}
      </Button>
    </div>
  );
};

export default OrderSummaryCard;