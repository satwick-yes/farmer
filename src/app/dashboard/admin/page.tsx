import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  const userRole = cookieStore.get('userRole')?.value;

  if (!userId || userRole !== 'ADMIN') {
    redirect('/login');
  }

  const unverifiedFarmers = await prisma.user.findMany({
    where: { role: 'FARMER', isVerified: false }
  });

  const allOrders = await prisma.order.findMany({
    include: { consumer: true },
    orderBy: { createdAt: 'desc' }
  });
  
  const categories = await prisma.category.findMany();

  const totalSales = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalCommissions = totalSales * 0.05;

  const disputedOrders = allOrders.filter(order => order.disputeStatus === 'DISPUTED');

  return (
    <div className="bg-agri-earth-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-agri-earth-900">Admin Dashboard</h1>
          <span className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-semibold">Super Admin</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100 text-center">
            <h3 className="text-lg font-semibold text-agri-earth-700">Total Sales</h3>
            <p className="text-3xl font-black text-agri-earth-900 mt-2">₹{totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100 text-center">
            <h3 className="text-lg font-semibold text-agri-earth-700">Platform Fees (5%)</h3>
            <p className="text-3xl font-black text-agri-green-600 mt-2">₹{totalCommissions.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100 text-center">
            <h3 className="text-lg font-semibold text-agri-earth-700">Total Orders</h3>
            <p className="text-3xl font-black text-agri-earth-900 mt-2">{allOrders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 text-center bg-red-50">
            <h3 className="text-lg font-semibold text-red-700">Active Disputes</h3>
            <p className="text-3xl font-black text-red-700 mt-2">{disputedOrders.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Manage Categories */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100 lg:col-span-2">
            <h2 className="text-xl font-bold text-agri-earth-900 mb-6">Manage Product Categories</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <form action="/api/categories" method="POST" className="flex-1 space-y-4">
                <input type="hidden" name="action" value="create" />
                <div>
                  <label className="block text-sm font-medium text-agri-earth-700">New Category Name</label>
                  <input name="name" type="text" required className="mt-1 block w-full rounded-lg border border-agri-earth-300 px-3 py-2 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="e.g. Exotic Fruits" />
                </div>
                <button type="submit" className="bg-agri-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-agri-green-700 transition-colors">
                  Add Category
                </button>
              </form>
              <div className="flex-1 flex flex-wrap gap-2 items-start">
                {categories.map(cat => (
                  <form key={cat.id} action="/api/categories" method="POST" className="inline-flex items-center bg-agri-green-50 border border-agri-green-200 text-agri-green-800 px-3 py-1.5 rounded-full text-sm">
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="categoryId" value={cat.id} />
                    <span className="font-semibold mr-2">{cat.name}</span>
                    <button type="submit" className="text-red-500 hover:text-red-700 font-bold">&times;</button>
                  </form>
                ))}
              </div>
            </div>
          </div>

          {/* Unverified Farmers */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100">
            <h2 className="text-xl font-bold text-agri-earth-900 mb-6">Pending Farmer Approvals</h2>
            {unverifiedFarmers.length === 0 ? (
              <p className="text-agri-earth-500 text-center py-4">All farmers are verified!</p>
            ) : (
              <ul className="space-y-4">
                {unverifiedFarmers.map(farmer => (
                  <li key={farmer.id} className="flex justify-between items-center p-4 border border-agri-earth-200 rounded-lg">
                    <div>
                      <p className="font-bold text-agri-earth-900">{farmer.name}</p>
                      <p className="text-sm text-agri-earth-500">{farmer.email} - {farmer.location}</p>
                    </div>
                    <form action={`/api/admin/verify`} method="POST">
                      <input type="hidden" name="farmerId" value={farmer.id} />
                      <button type="submit" className="bg-agri-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-agri-green-700 transition-colors">
                        Approve
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Active Disputes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
            <h2 className="text-xl font-bold text-red-800 mb-6">Order Disputes</h2>
            {disputedOrders.length === 0 ? (
              <p className="text-agri-earth-500 text-center py-4">No active disputes.</p>
            ) : (
              <ul className="space-y-4">
                {disputedOrders.map(order => (
                  <li key={order.id} className="flex justify-between items-start p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-bold text-red-900">Order from {order.consumer.name}</p>
                      <p className="text-sm text-red-700 mt-1">ID: {order.id}</p>
                      <p className="text-sm text-red-700">Amount: ₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <form action={`/api/orders/update`} method="POST">
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="hidden" name="disputeStatus" value="RESOLVED" />
                      <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                        Resolve
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100">
            <h2 className="text-xl font-bold text-agri-earth-900 mb-6">Recent Orders</h2>
            {allOrders.length === 0 ? (
              <p className="text-agri-earth-500 text-center py-4">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-agri-earth-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-agri-earth-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-agri-earth-500 uppercase">Consumer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-agri-earth-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-agri-earth-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-agri-earth-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-agri-earth-200">
                    {allOrders.slice(0, 10).map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-agri-earth-900">{order.id.slice(0, 8)}...</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-agri-earth-900">{order.consumer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-agri-earth-500">{order.status} {order.disputeStatus === 'DISPUTED' ? '(Disputed)' : ''}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-agri-earth-500">{order.createdAt.toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-agri-green-700">₹{order.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
