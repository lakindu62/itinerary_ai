export interface EventPerformanceDto {
  id: string | null;
  eventName: string;
  expectedRevenue: number;
  actualRevenue: number;
  capacity: number;
  booked: number;
  sellThrough: number; // sell-through rate as a percentage
}

export interface RevenueOverTimeDto {
  date: string; // e.g., '2025-10-01'
  revenue: number;
}

export interface AnalyticsDto {
  totalRevenue: number;
  totalGuests: number;
  eventCount: number;
  averageSellThrough: number;
  eventPerformance: EventPerformanceDto[];
  revenueOverTime: RevenueOverTimeDto[];
}