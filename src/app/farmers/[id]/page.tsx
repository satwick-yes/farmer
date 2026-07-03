import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function FarmerProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const farmer = await prisma.user.findUnique({
    where: { id, role: 'FARMER' },
    include: {
      products: {
        include: { reviews: true }
      },
      reviewsReceived: true
    }
  });

  if (!farmer) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h1 className="text-2xl text-agri-earth-500 font-bold">Farmer not found</h1>
      </div>
    );
  }

  const avgRating = farmer.reviewsReceived.length > 0 
    ? (farmer.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / farmer.reviewsReceived.length).toFixed(1) 
    : 'New';

  return (
    <div className="bg-agri-earth-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-agri-earth-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-agri-green-500 to-green-700 opacity-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 bg-agri-green-100 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-lg">
              🧑‍🌾
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-agri-earth-900">{farmer.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-agri-earth-600 font-medium">
                <span className="flex items-center gap-1">📍 {farmer.location}</span>
                <span className="flex items-center gap-1 bg-agri-green-50 text-agri-green-800 px-2 py-0.5 rounded border border-agri-green-200">{farmer.farmingMethod}</span>
                <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200">⭐ {avgRating} Rating</span>
              </div>
              {farmer.cropTypes && (
                <p className="mt-4 text-agri-earth-700 font-medium bg-agri-earth-50 inline-block px-4 py-2 rounded-lg border border-agri-earth-200">
                  <span className="text-agri-earth-500 mr-2">Growing:</span>
                  {farmer.cropTypes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Farmer's Products */}
        <div>
          <h2 className="text-2xl font-bold text-agri-earth-900 mb-6">Products by {farmer.name}</h2>
          
          {farmer.products.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-agri-earth-100 text-center text-agri-earth-500">
              No products currently available from this farm.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {farmer.products.map(product => {
                const prodRating = product.reviews.length > 0 ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1) : 'New';
                return (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-agri-earth-100 group flex flex-col">
                    <div className="h-48 bg-agri-green-100 relative flex items-center justify-center overflow-hidden">
                      <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {product.category === 'Vegetables' ? '🥦' : product.category === 'Fruits' ? '🍎' : product.category === 'Dairy' ? '🥛' : '🌾'}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-agri-earth-900">{product.name}</h3>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">⭐ {prodRating}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4 mt-auto pt-4">
                        <span className="text-2xl font-black text-agri-green-600">₹{product.price.toFixed(2)}</span>
                        <span className="text-sm text-agri-earth-500">{product.availability} in stock</span>
                      </div>
                      
                      <form action="/api/orders" method="POST" className="space-y-2 mt-auto">
                        <input type="hidden" name="productId" value={product.id} />
                        <input type="hidden" name="price" value={product.price} />
                        <select name="deliverySlot" className="w-full text-sm border border-agri-earth-200 rounded px-2 py-1.5 focus:outline-none focus:border-agri-green-500" required>
                          <option value="">Select Delivery Slot</option>
                          <option value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</option>
                          <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                          <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                        </select>
                        <button type="submit" className="w-full bg-agri-green-100 text-agri-green-700 hover:bg-agri-green-600 hover:text-white font-semibold py-2 rounded-lg transition-colors">
                          Buy Now
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
