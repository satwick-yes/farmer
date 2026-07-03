import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function Marketplace({ searchParams }: { searchParams: Promise<{ category?: string, location?: string, farmerId?: string, method?: string }> }) {
  const params = await searchParams;
  const category = params.category;
  const location = params.location;
  const farmerId = params.farmerId;
  const method = params.method;
  
  // Fetch filter options
  const dbCategories = await prisma.category.findMany();
  const farmers = await prisma.user.findMany({ where: { role: 'FARMER', isVerified: true } });
  
  // Extract unique locations
  const locations = Array.from(new Set(farmers.map(f => f.location).filter(Boolean)));

  // Build prisma query
  const whereClause: any = {};
  if (category) whereClause.category = category;
  
  // Nested farmer filters
  const farmerFilters: any = {};
  if (location) farmerFilters.location = location;
  if (farmerId) farmerFilters.id = farmerId;
  if (method) farmerFilters.farmingMethod = method;
  
  if (Object.keys(farmerFilters).length > 0) {
    whereClause.farmer = farmerFilters;
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: { farmer: true, reviews: true }
  });

  return (
    <div className="bg-agri-earth-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-8 gap-4">
          <h1 className="text-3xl font-bold text-agri-earth-900">Fresh Marketplace</h1>
          
          <form className="bg-white p-4 rounded-xl shadow-sm border border-agri-earth-200 flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-agri-earth-500 mb-1 uppercase tracking-wider">Category</label>
              <select name="category" defaultValue={category || ''} className="border border-agri-earth-300 rounded-lg px-3 py-2 bg-white text-sm text-agri-earth-700 w-full sm:w-auto">
                <option value="">All Categories</option>
                {dbCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-agri-earth-500 mb-1 uppercase tracking-wider">Location</label>
              <select name="location" defaultValue={location || ''} className="border border-agri-earth-300 rounded-lg px-3 py-2 bg-white text-sm text-agri-earth-700 w-full sm:w-auto">
                <option value="">Any Location</option>
                {locations.map((loc: any) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-agri-earth-500 mb-1 uppercase tracking-wider">Farmer</label>
              <select name="farmerId" defaultValue={farmerId || ''} className="border border-agri-earth-300 rounded-lg px-3 py-2 bg-white text-sm text-agri-earth-700 w-full sm:w-auto">
                <option value="">Any Farmer</option>
                {farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-agri-earth-500 mb-1 uppercase tracking-wider">Method</label>
              <select name="method" defaultValue={method || ''} className="border border-agri-earth-300 rounded-lg px-3 py-2 bg-white text-sm text-agri-earth-700 w-full sm:w-auto">
                <option value="">Any Method</option>
                <option value="Organic">Organic</option>
                <option value="Conventional">Conventional</option>
              </select>
            </div>

            <button type="submit" className="bg-agri-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-agri-green-700 transition-colors">Apply Filters</button>
            <Link href="/market" className="bg-agri-earth-100 text-agri-earth-700 font-semibold px-4 py-2 rounded-lg hover:bg-agri-earth-200 transition-colors">Clear</Link>
          </form>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-agri-earth-100">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-xl font-medium text-agri-earth-700">No products available.</h2>
            <p className="text-agri-earth-500 mt-2">Try different filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const avgRating = product.reviews.length > 0 ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1) : 'New';
              
              return (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-agri-earth-100 group flex flex-col">
                  <div className="h-48 bg-agri-green-100 relative flex items-center justify-center overflow-hidden">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {product.category === 'Vegetables' ? '🥦' : product.category === 'Fruits' ? '🍎' : product.category === 'Dairy' ? '🥛' : '🌾'}
                    </div>
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold text-agri-green-700 shadow">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-agri-earth-900">{product.name}</h3>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">⭐ {avgRating}</span>
                    </div>
                    <Link href={`/farmers/${product.farmerId}`} className="text-sm text-agri-green-600 hover:underline mb-2 block font-semibold">By {product.farmer?.name}</Link>
                    <div className="flex items-center gap-2 mb-4 text-xs text-agri-earth-500">
                      <span className="bg-agri-green-50 text-agri-green-700 px-2 py-0.5 rounded border border-agri-green-200">{product.farmer?.farmingMethod || 'Standard'}</span>
                      <span>{product.farmer?.location}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 mt-auto">
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
  );
}
