
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type OrderSummaryCardProps = {
  ticketPrice: number;
};

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ ticketPrice }) => {
  const [ticketCount, setTicketCount] = useState(1);

  const handleIncrement = () => {
    setTicketCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    setTicketCount(prev => (prev > 1 ? prev - 1 : 1));
  };

  const total = ticketPrice * ticketCount;

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
          <Button variant="outline" size="icon" onClick={handleDecrement} className="h-8 w-8">
            -
          </Button>
          <span className="mx-4">{ticketCount}</span>
          <Button variant="outline" size="icon" onClick={handleIncrement} className="h-8 w-8">
            +
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center font-bold text-lg mb-6">
        <span>Total:</span>
        <span>Rs. {total}</span>
      </div>
      <Button className="w-full bg-[#5B30D6] hover:bg-[#4a26b3] text-white font-bold rounded-lg">
        Get Ticket
      </Button>
    </div>
  );
};

export default OrderSummaryCard;
