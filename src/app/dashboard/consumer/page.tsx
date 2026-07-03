import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function ConsumerDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  const userRole = cookieStore.get('userRole')?.value;

  if (!userId || userRole !== 'CONSUMER') {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: { consumerId: userId },
    include: {
      orderItems: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-agri-earth-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-agri-earth-900">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-agri-earth-100 shadow-sm">
            <p className="text-agri-earth-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-agri-earth-100">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-agri-earth-500">Order ID: {order.id.slice(0,8)}...</p>
                    <p className="text-sm text-agri-earth-500">Placed on: {order.createdAt.toLocaleDateString()}</p>
                    {order.deliverySlot && <p className="text-sm font-semibold text-agri-green-700 mt-1">Slot: {order.deliverySlot}</p>}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === 'DELIVERED' ? 'bg-agri-green-100 text-agri-green-800' :
                      order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                    {order.disputeStatus === 'DISPUTED' && <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-100 text-red-800">Disputed</span>}
                    <p className="text-lg font-bold text-agri-green-700 mt-2">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-agri-earth-900 mb-2">Items</h4>
                  <ul className="space-y-2">
                    {order.orderItems.map(item => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="font-medium">₹{item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Actions for Delivered Orders */}
                {order.status === 'DELIVERED' && (
                  <div className="mt-6 pt-4 border-t border-agri-earth-100 flex gap-4">
                    <form action="/api/reviews" method="POST" className="flex-1 flex gap-2">
                      <input type="hidden" name="productId" value={order.orderItems[0]?.productId} />
                      <select name="rating" className="border border-agri-earth-300 rounded-lg px-3 py-1.5 text-sm" required>
                        <option value="">Rate Product</option>
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                        <option value="2">⭐⭐ (2/5)</option>
                        <option value="1">⭐ (1/5)</option>
                      </select>
                      <button type="submit" className="bg-agri-earth-100 text-agri-earth-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-agri-earth-200">Submit Review</button>
                    </form>
                    
                    {!order.disputeStatus && (
                      <form action="/api/orders/update" method="POST">
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="disputeStatus" value="DISPUTED" />
                        <button type="submit" className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-100 border border-red-200">Report Issue</button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
