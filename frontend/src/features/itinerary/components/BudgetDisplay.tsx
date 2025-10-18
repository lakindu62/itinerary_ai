import { ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const BudgetDisplay = ({ itinerary }: { itinerary: ItineraryDto }) => {
    // Calculate totals
    const totalBudgeted = itinerary.days.reduce((total, day) => {
        return total + day.activities.reduce((dayTotal, activity) => {
            return dayTotal + (activity.budgetedAmount || 0);
        }, 0);
    }, 0);

    const totalActual = itinerary.days.reduce((total, day) => {
        return total + day.activities.reduce((dayTotal, activity) => {
            return dayTotal + (activity.actualSpend || 0);
        }, 0);
    }, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getActivityTypeColor = (type: string) => {
        switch (type) {
            case 'hotel':
                return 'bg-blue-100 text-blue-800';
            case 'restaurant':
                return 'bg-green-100 text-green-800';
            case 'attraction':
                return 'bg-purple-100 text-purple-800';
            case 'event':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getBudgetStatus = (budgeted: number, actual: number) => {
        if (actual === 0) return { status: 'pending', color: 'text-gray-600' };
        if (actual <= budgeted) return { status: 'under', color: 'text-green-600' };
        return { status: 'over', color: 'text-red-600' };
    };

    return (
        <ScrollArea className="flex-1 h-[calc(100vh-110px)] relative">
            <div className="h-full flex flex-col bg-background border-none">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Budgeted</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatCurrency(totalBudgeted)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(totalActual)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Remaining</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${totalBudgeted - totalActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(totalBudgeted - totalActual)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Day-by-Day Breakdown */}
                <div className="space-y-4 p-4">
                    <h3 className="text-lg font-semibold">Daily Budget Breakdown</h3>

                    {itinerary.days.map((day, dayIndex) => {
                        const dayBudgeted = day.activities.reduce((total, activity) => total + (activity?.budgetedAmount || 0), 0);
                        const dayActual = day.activities.reduce((total, activity) => total + (activity?.actualSpend || 0), 0);

                        return (
                            <Card key={dayIndex}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">
                                            Day {day.dayNumber} - {day.date}
                                        </CardTitle>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Day Total</div>
                                            <div className="font-semibold">
                                                {formatCurrency(dayBudgeted)} / {formatCurrency(dayActual)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">{day.destination}</div>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-3">
                                        {day.activities.map((activity, activityIndex) => {
                                            const budgetStatus = getBudgetStatus(activity.budgetedAmount || 0, activity.actualSpend || 0);


                                            return (
                                                <div key={activityIndex} className="border rounded-lg p-4 space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-medium">{activity.name}</h4>
                                                                <Badge className={getActivityTypeColor(activity.type)}>
                                                                    {activity.type}
                                                                </Badge>
                                                            </div>


                                                        </div>

                                                        <div className="text-right ml-4">
                                                            <div className="space-y-1">
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">Budget: </span>
                                                                    <span className="font-medium">{formatCurrency(activity.budgetedAmount || 0)}</span>
                                                                </div>
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">Actual: </span>
                                                                    <span className={`font-medium ${budgetStatus.color}`}>
                                                                        {formatCurrency(activity.actualSpend || 0)}
                                                                    </span>
                                                                </div>
                                                                {activity.actualSpend && activity.budgetedAmount && (
                                                                    <div className="text-xs">
                                                                        <span className={budgetStatus.color}>
                                                                            {activity.actualSpend <= activity.budgetedAmount ? 'Under' : 'Over'} by{' '}
                                                                            {formatCurrency(Math.abs((activity.actualSpend || 0) - (activity.budgetedAmount || 0)))}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {activity.time && (
                                                        <div className="text-xs text-gray-500">
                                                            Time: {activity.time}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium">Day {day.dayNumber} Total:</span>
                                        <div className="text-right">
                                            <div className="font-semibold">
                                                {formatCurrency(dayBudgeted)} / {formatCurrency(dayActual)}
                                            </div>
                                            <div className={`text-xs ${dayActual <= dayBudgeted ? 'text-green-600' : 'text-red-600'}`}>
                                                {dayActual <= dayBudgeted ? 'Under budget' : 'Over budget'} by{' '}
                                                {formatCurrency(Math.abs(dayActual - dayBudgeted))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
          );
        })}
        </div>
      </div>
    </ScrollArea>
  );
};

export default BudgetDisplay;