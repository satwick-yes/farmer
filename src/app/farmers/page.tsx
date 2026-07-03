import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function FarmersPage() {
  const farmers = await prisma.user.findMany({
    where: { role: 'FARMER', isVerified: true },
    include: { products: true }
  });

  return (
    <div className="bg-agri-earth-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-agri-earth-900 mb-4">Meet Our Farmers</h1>
          <p className="text-lg text-agri-earth-600 max-w-2xl mx-auto">
            These are the dedicated individuals growing fresh, sustainable produce for our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {farmers.map(farmer => (
            <div key={farmer.id} className="bg-white rounded-2xl p-8 shadow-sm border border-agri-earth-100 hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-agri-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                👨‍🌾
              </div>
              <h2 className="text-2xl font-bold text-agri-earth-900 text-center mb-2">{farmer.name}</h2>
              <div className="flex items-center justify-center gap-2 text-sm text-agri-earth-500 mb-6">
                <span>📍 {farmer.location || 'Local Farm'}</span>
                <span>•</span>
                <span className="bg-agri-green-100 text-agri-green-800 px-2 py-0.5 rounded-full font-medium">{farmer.farmingMethod || 'Conventional'}</span>
              </div>
              
              <div className="border-t border-agri-earth-100 pt-4">
                <h3 className="text-sm font-semibold text-agri-earth-900 mb-2">Available Products</h3>
                <div className="flex flex-wrap gap-2">
                  {farmer.products.slice(0, 3).map(product => (
                    <span key={product.id} className="bg-agri-earth-100 text-agri-earth-700 px-3 py-1 rounded-full text-xs font-medium">
                      {product.name}
                    </span>
                  ))}
                  {farmer.products.length > 3 && (
                    <span className="bg-agri-earth-100 text-agri-earth-700 px-3 py-1 rounded-full text-xs font-medium">
                      +{farmer.products.length - 3} more
                    </span>
                  )}
                  {farmer.products.length === 0 && (
                    <span className="text-agri-earth-400 text-xs italic">Coming soon...</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
