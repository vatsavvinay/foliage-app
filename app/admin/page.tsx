import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Foliage',
};

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-sage-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stats Cards */}
        {[
          { label: 'Total Products', value: '0' },
          { label: 'Total Orders', value: '0' },
          { label: 'Total Customers', value: '0' },
          { label: 'Revenue', value: '$0' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-neutral-200 p-6">
            <p className="text-neutral-600 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-sage-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
