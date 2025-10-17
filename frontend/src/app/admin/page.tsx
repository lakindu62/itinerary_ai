'use client';

import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <p className="text-muted-foreground">
        This is the main dashboard for business owners. You can add analytics, summaries, and quick actions here.
      </p>
      {/* Placeholder for future content */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">Quick Stats</h3>
          <p className="text-sm text-muted-foreground">Analytics widgets will be displayed here.</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">A feed of recent activities will be shown here.</p>
        </div>
      </div>
    </div>
  );
}
