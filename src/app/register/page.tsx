import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-agri-earth-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-agri-earth-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-agri-earth-900">
            Join AgriMarket
          </h2>
          <p className="mt-2 text-center text-sm text-agri-earth-600">
            Or{' '}
            <Link href="/login" className="font-medium text-agri-green-600 hover:text-agri-green-500">
              log in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action="/api/auth/register" method="POST">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-agri-earth-700">Full Name</label>
              <input id="name" name="name" type="text" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-agri-earth-300 placeholder-agri-earth-400 text-agri-earth-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm mt-1" placeholder="Jane Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-agri-earth-700">Email address</label>
              <input id="email" name="email" type="email" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-agri-earth-300 placeholder-agri-earth-400 text-agri-earth-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm mt-1" placeholder="jane@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-agri-earth-700">Password</label>
              <input id="password" name="password" type="password" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-agri-earth-300 placeholder-agri-earth-400 text-agri-earth-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm mt-1" placeholder="••••••••" />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-agri-earth-700">I want to...</label>
              <select id="role" name="role" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-agri-earth-300 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 sm:text-sm rounded-lg">
                <option value="CONSUMER">Buy fresh produce</option>
                <option value="FARMER">Sell my produce</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-agri-earth-700">Location</label>
              <input id="location" name="location" type="text" className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-agri-earth-300 placeholder-agri-earth-400 text-agri-earth-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm mt-1" placeholder="City, State" />
            </div>
            <div>
              <label htmlFor="cropTypes" className="block text-sm font-medium text-agri-earth-700">Primary Crop Types (Farmer Only)</label>
              <input id="cropTypes" name="cropTypes" type="text" className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-agri-earth-300 placeholder-agri-earth-400 text-agri-earth-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm mt-1" placeholder="e.g. Tomatoes, Carrots" />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-agri-green-600 hover:bg-agri-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-green-500 transition-colors shadow">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
