import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function FarmerDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  const userRole = cookieStore.get('userRole')?.value;

  if (!userId || userRole !== 'FARMER') {
    redirect('/login');
  }

  // Fetch products
  const products = await prisma.product.findMany({
    where: { farmerId: userId }
  });

  // Fetch order items belonging to this farmer
  const orderItems = await prisma.orderItem.findMany({
    where: { product: { farmerId: userId } },
    include: {
      order: { include: { consumer: true } },
      product: true
    },
    orderBy: { order: { createdAt: 'desc' } }
  });

  // Group order items by order ID for better display
  const ordersMap = new Map();
  orderItems.forEach(item => {
    if (!ordersMap.has(item.orderId)) {
      ordersMap.set(item.orderId, {
        id: item.orderId,
        order: item.order,
        items: []
      });
    }
    ordersMap.get(item.orderId).items.push(item);
  });
  const farmerOrders = Array.from(ordersMap.values());

  // Calculate Sales Summary
  const totalRevenue = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const platformCommission = totalRevenue * 0.05; // 5% fee
  const netEarnings = totalRevenue - platformCommission;

  return (
    <div className="bg-agri-earth-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-agri-earth-900">Farmer Dashboard</h1>
          <span className="bg-agri-green-100 text-agri-green-800 px-4 py-1 rounded-full text-sm font-semibold">Verified Farmer</span>
        </div>

        {/* Sales Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100">
            <h3 className="text-sm font-medium text-agri-earth-500">Gross Revenue</h3>
            <p className="text-3xl font-black text-agri-green-600 mt-2">₹{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100">
            <h3 className="text-sm font-medium text-agri-earth-500">Platform Commission (5%)</h3>
            <p className="text-3xl font-black text-red-500 mt-2">-₹{platformCommission.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100">
            <h3 className="text-sm font-medium text-agri-earth-500">Net Earnings</h3>
            <p className="text-3xl font-black text-agri-earth-900 mt-2">₹{netEarnings.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100">
            <h2 className="text-xl font-bold text-agri-earth-900 mb-6">List New Produce</h2>
            <form action="/api/products" method="POST" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-agri-earth-700">Product Name</label>
                <input name="name" type="text" required className="mt-1 block w-full rounded-lg border border-agri-earth-300 px-3 py-2 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="e.g. Organic Tomatoes" />
              </div>
              <div>
                <label className="block text-sm font-medium text-agri-earth-700">Category</label>
                <select name="category" className="mt-1 block w-full rounded-lg border border-agri-earth-300 px-3 py-2 focus:ring-agri-green-500 focus:border-agri-green-500">
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Dairy</option>
                  <option>Grains</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-agri-earth-700">Price (₹)</label>
                  <input name="price" type="number" step="0.01" required className="mt-1 block w-full rounded-lg border border-agri-earth-300 px-3 py-2 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-agri-earth-700">Quantity</label>
                  <input name="availability" type="number" required className="mt-1 block w-full rounded-lg border border-agri-earth-300 px-3 py-2 focus:ring-agri-green-500 focus:border-agri-green-500" placeholder="100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-agri-earth-700">Harvest Date</label>
                <input name="harvestDate" type="date" required className="mt-1 block w-full rounded-lg border border-agri-earth-300 px-3 py-2 focus:ring-agri-green-500 focus:border-agri-green-500" />
              </div>
              <button type="submit" className="w-full bg-agri-green-600 text-white font-bold py-3 rounded-lg hover:bg-agri-green-700 transition-colors shadow">
                List Product
              </button>
            </form>
          </div>

          {/* Product & Order Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Products */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100">
              <h2 className="text-xl font-bold text-agri-earth-900 mb-6">My Products</h2>
              {products.length === 0 ? (
                <div className="text-center py-10 bg-agri-earth-50 rounded-xl border border-dashed border-agri-earth-300">
                  <p className="text-agri-earth-500">You haven't listed any products yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-agri-earth-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-agri-earth-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-agri-earth-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-agri-earth-500 uppercase tracking-wider">Harvested</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-agri-earth-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-agri-earth-500 uppercase tracking-wider">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-agri-earth-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-agri-earth-900">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-agri-earth-500">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-agri-earth-500">{product.harvestDate ? product.harvestDate.toLocaleDateString() : 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-agri-green-600 font-bold">₹{product.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-agri-earth-500">{product.availability}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Order Management */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100">
              <h2 className="text-xl font-bold text-agri-earth-900 mb-6">Customer Orders</h2>
              {farmerOrders.length === 0 ? (
                <div className="text-center py-10 bg-agri-earth-50 rounded-xl border border-dashed border-agri-earth-300">
                  <p className="text-agri-earth-500">No orders received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {farmerOrders.map(group => (
                    <div key={group.id} className="border border-agri-earth-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-4 border-b pb-4">
                        <div>
                          <p className="text-sm text-agri-earth-500">Order #{group.id.slice(0,8)} • {group.order.createdAt.toLocaleDateString()}</p>
                          <p className="font-semibold text-agri-earth-900 mt-1">Buyer: {group.order.consumer.name}</p>
                          <p className="text-sm text-agri-earth-500">Slot: {group.order.deliverySlot || 'Standard'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            group.order.status === 'DELIVERED' ? 'bg-agri-green-100 text-agri-green-800' :
                            group.order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {group.order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <ul className="space-y-2">
                          {group.items.map((item: any) => (
                            <li key={item.id} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.product.name}</span>
                              <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {group.order.status !== 'DELIVERED' && (
                        <form action="/api/orders/update" method="POST" className="flex gap-2 justify-end mt-4 pt-4 border-t border-agri-earth-100">
                          <input type="hidden" name="orderId" value={group.id} />
                          <select name="status" className="border border-agri-earth-300 rounded-lg px-3 py-1.5 text-sm" defaultValue={group.order.status}>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed (Processing)</option>
                            <option value="DELIVERED">Delivered</option>
                          </select>
                          <button type="submit" className="bg-agri-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-agri-green-700">Update</button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
