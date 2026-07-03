import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-agri-earth-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-agri-earth-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-agri-earth-900">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-agri-earth-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-agri-green-600 hover:text-agri-green-500">
              Sign up today
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action="/api/auth/login" method="POST">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-agri-earth-700">Email address</label>
              <input id="email" name="email" type="email" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-agri-earth-300 placeholder-agri-earth-400 text-agri-earth-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm mt-1" placeholder="jane@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-agri-earth-700">Password</label>
              <input id="password" name="password" type="password" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-agri-earth-300 placeholder-agri-earth-400 text-agri-earth-900 focus:outline-none focus:ring-agri-green-500 focus:border-agri-green-500 focus:z-10 sm:text-sm mt-1" placeholder="••••••••" />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-agri-green-600 hover:bg-agri-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-green-500 transition-colors shadow">
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
