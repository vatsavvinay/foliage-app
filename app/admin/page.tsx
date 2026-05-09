import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Foliage',
};

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-sage-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stats Cards */}
        {[
          { label: 'Total Products', value: '0' },
          { label: 'Total Orders', value: '0' },
          { label: 'Total Customers', value: '0' },
          { label: 'Revenue', value: '$0' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4">
            <p className="text-neutral-600 text-sm mb-2">{stat.label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-sage-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
