import { Link } from 'react-router-dom'
import { LogoIcon, SearchIcon, LoginIcon, WishlistIcon, CartIcon, LanguageIcon } from './Icons'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <LogoIcon className="h-8 w-8 text-indigo-600" />
              <span className="hidden sm:inline font-semibold text-lg text-gray-800">ShopWise</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 mx-4">
            <form className="w-full">
              <label htmlFor="site-search" className="sr-only">Search products</label>
              <div className="relative">
                <input
                  id="site-search"
                  name="q"
                  type="search"
                  placeholder="Search for products, brands and more"
                  className="w-full bg-gray-100 text-sm placeholder-gray-500 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  aria-label="Search for products, brands and more"
                />
                <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 transition-colors">
                  <SearchIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 py-1 transition-colors">
              <LoginIcon className="h-6 w-6" />
              <span className="hidden sm:inline font-medium">Login</span>
            </Link>

            <button type="button" aria-label="Wishlist" className="relative text-gray-700 hover:text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
              <WishlistIcon className="h-6 w-6" />
            </button>

            <button type="button" aria-label="Cart" className="relative text-gray-700 hover:text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
              <CartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-indigo-600 rounded-full">0</span>
            </button>

            <button type="button" aria-label="Change language" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ml-2 border-l pl-4 transition-colors">
              <LanguageIcon className="h-6 w-6" />
              <span className="hidden sm:inline font-medium">EN</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
