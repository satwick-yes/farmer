import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-agri-earth-900 text-agri-earth-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            🌱 AgriMarket
          </h3>
          <p className="text-agri-earth-300">
            Connecting local farmers directly with consumers for fresher produce and fairer prices.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/market" className="hover:text-white transition-colors">Marketplace</Link></li>
            <li><Link href="/farmers" className="hover:text-white transition-colors">Farmers</Link></li>
            <li><Link href="/register?role=farmer" className="hover:text-white transition-colors">Sell with us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
          <p className="text-agri-earth-300">Email: support@agrimarket.local</p>
          <p className="text-agri-earth-300">Phone: +1 (555) 123-4567</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-agri-earth-800 text-center text-sm text-agri-earth-400">
        &copy; {new Date().getFullYear()} AgriMarket. All rights reserved.
      </div>
    </footer>
  );
}
