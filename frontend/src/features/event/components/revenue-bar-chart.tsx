'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DownloadIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PdfDownloadButton } from '@/components/pdf';
import { RevenueReportTemplate } from '../pdf/RevenueReportTemplate';

interface RevenueData {
  eventName: string;
  expectedRevenue: number;
  actualRevenue: number;
}

interface RevenueBarChartProps {
  data: RevenueData[];
}

export function RevenueBarChart({ data }: RevenueBarChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Expected vs. Actual Revenue</CardTitle>
          <CardDescription>A comparison of revenue for each event.</CardDescription>
        </div>
        <PdfDownloadButton
          document={<RevenueReportTemplate data={data} />}
          fileName={`Revenue_Report_${new Date().toISOString().split('T')[0]}`}
          buttonDisplay={<DownloadIcon className="h-4 w-4" />}
          variant="outline"
          size="sm"
        />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="eventName" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `Rs${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ccc' }}
              cursor={{ fill: 'transparent' }}
            />
            <Legend />
            <Bar dataKey="expectedRevenue" fill="#8884d8" name="Expected Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actualRevenue" fill="#82ca9d" name="Actual Revenue" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}