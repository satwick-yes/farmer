import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function Navbar() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  const userRole = cookieStore.get('userRole')?.value;
  
  const isLoggedIn = !!userId;

  return (
    <nav className="bg-agri-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
              <span className="text-2xl">🌱</span> AgriMarket
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/market" className="hover:text-agri-green-200 transition-colors">Marketplace</Link>
            <Link href="/farmers" className="hover:text-agri-green-200 transition-colors">Our Farmers</Link>
            {userRole === 'ADMIN' && (
              <Link href="/dashboard/admin" className="hover:text-agri-green-200 transition-colors font-semibold">Admin Panel</Link>
            )}
            {userRole === 'FARMER' && (
              <Link href="/dashboard/farmer" className="hover:text-agri-green-200 transition-colors">My Dashboard</Link>
            )}
            {userRole === 'CONSUMER' && (
              <Link href="/dashboard/consumer" className="hover:text-agri-green-200 transition-colors">My Orders</Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <a href="/api/auth/logout" className="text-sm font-medium hover:text-agri-green-200 transition-colors">Log out</a>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-agri-green-200 transition-colors">Log in</Link>
                <Link href="/register" className="bg-white text-agri-green-700 hover:bg-agri-green-50 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
