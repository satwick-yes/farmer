import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-agri-earth-50 font-sans">
      
      {/* Hero Section */}
      <section className="w-full relative bg-agri-green-900 text-white overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-agri-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-agri-earth-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Fresh From Farm <span className="text-agri-green-400">To Your Table</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-agri-green-100 mb-10">
            Skip the middleman. Connect directly with local farmers to get the freshest produce at fair prices, while supporting sustainable agriculture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/market" 
              className="bg-agri-green-500 hover:bg-agri-green-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              Shop Fresh Produce
            </Link>
            <Link 
              href="/register?role=farmer" 
              className="bg-white text-agri-green-900 hover:bg-agri-green-50 border-2 border-transparent px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              I'm a Farmer
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-agri-earth-900 mb-4">Why Choose AgriMarket?</h2>
          <div className="w-24 h-1 bg-agri-green-500 mx-auto rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-agri-earth-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer">
            <div className="w-16 h-16 bg-agri-green-100 text-agri-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              🚜
            </div>
            <h3 className="text-xl font-bold text-agri-earth-900 mb-3">Direct from Farmers</h3>
            <p className="text-agri-earth-600">
              No intermediaries. You buy directly from the people who grow your food, ensuring maximum freshness and traceability.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-agri-earth-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer">
            <div className="w-16 h-16 bg-agri-earth-100 text-agri-earth-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              💰
            </div>
            <h3 className="text-xl font-bold text-agri-earth-900 mb-3">Fair Prices for All</h3>
            <p className="text-agri-earth-600">
              Farmers earn more for their hard work, and you pay less than supermarket prices. A true win-win ecosystem.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-agri-earth-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer">
            <div className="w-16 h-16 bg-agri-green-100 text-agri-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              🌿
            </div>
            <h3 className="text-xl font-bold text-agri-earth-900 mb-3">Organic & Sustainable</h3>
            <p className="text-agri-earth-600">
              Easily discover local organic farms and support sustainable agricultural practices in your community.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full bg-agri-earth-200 py-20 mt-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-agri-earth-900 mb-6">Ready to taste the difference?</h2>
          <p className="text-lg text-agri-earth-700 mb-10">Join thousands of consumers who have already made the switch to locally sourced, fresh agricultural products.</p>
          <Link href="/register" className="inline-block bg-agri-green-600 hover:bg-agri-green-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow hover:shadow-lg hover:scale-105">
            Create Your Free Account
          </Link>
        </div>
      </section>

    </div>
  );
}
