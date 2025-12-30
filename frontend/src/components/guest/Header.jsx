import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LogoIcon,
  SearchIconPro,
  UserAccountIcon,
  HeartIcon,
  ShoppingBagIcon,
  MenuIconPro,
  CloseIconPro
} from '../Icons'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  // Detect scroll to hide/show header sections
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        {/* Top Navigation Bar - Hidden on mobile and when scrolled */}
        <div className={`hidden md:block bg-slate-900 text-white transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-8 opacity-100'
          }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-8 text-xs">
              <div className="flex items-center gap-6">
                <span className="hidden md:inline">Free shipping on orders over $50</span>
                <span className="hidden lg:inline text-gray-400">|</span>
                <span className="hidden lg:inline">24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="hover:text-gray-300 transition-colors">
                  Track Order
                </button>
                <span className="hidden sm:inline text-gray-400">|</span>
                <button className="hidden sm:inline hover:text-gray-300 transition-colors">
                  Help
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <LogoIcon className="h-8 w-8 text-slate-900 group-hover:text-slate-700 transition-colors" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  ShopWise
                </h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">Premium Quality</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-xl mx-6">
              <form className="relative">
                <label htmlFor="search" className="sr-only">Search products</label>
                <input
                  id="search"
                  type="search"
                  placeholder="Search for products, brands..."
                  className="w-full h-9 pl-10 pr-20 text-sm text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
                <div className="absolute left-0 top-0 h-9 w-10 flex items-center justify-center pointer-events-none">
                  <SearchIconPro className="h-4 w-4 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-0.5 lg:gap-1">

              {/* Account */}
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <UserAccountIcon className="h-5 w-5 text-gray-700 group-hover:text-slate-900 transition-colors" />
                <div className="hidden lg:block text-left">
                  <p className="text-[10px] text-gray-500">Hello, Sign in</p>
                  <p className="text-xs font-semibold text-gray-900 -mt-0.5">Account</p>
                </div>
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <HeartIcon className="h-5 w-5 text-gray-700 group-hover:text-red-500 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[16px] h-[16px] text-[9px] font-bold text-white bg-red-500 rounded-full">
                    {wishlistCount}
                  </span>
                )}
                <span className="hidden xl:inline text-xs font-medium text-gray-900">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <ShoppingBagIcon className="h-5 w-5 text-gray-700 group-hover:text-slate-900 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[16px] h-[16px] text-[9px] font-bold text-white bg-slate-900 rounded-full">
                    {cartCount}
                  </span>
                )}
                <span className="hidden xl:inline text-xs font-medium text-gray-900">Cart</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden ml-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <CloseIconPro className="h-6 w-6 text-gray-700" />
                ) : (
                  <MenuIconPro className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden pb-2">
            <form className="relative">
              <label htmlFor="mobile-search" className="sr-only">Search products</label>
              <input
                id="mobile-search"
                type="search"
                placeholder="Search..."
                className="w-full h-9 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
              />
              <div className="absolute left-0 top-0 h-9 w-9 flex items-center justify-center pointer-events-none">
                <SearchIconPro className="h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>
        </div>

        {/* Navigation Menu - Desktop - Hidden when scrolled */}
        <nav className={`hidden md:block bg-gray-50 border-t border-gray-200 transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
          }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center gap-6 h-10 text-sm font-medium text-gray-700">
              <li>
                <Link to="/categories" className="hover:text-slate-900 transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-slate-900 transition-colors">
                  Today's Deals
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-slate-900 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/best-sellers" className="hover:text-slate-900 transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-slate-900 transition-colors">
                  Collections
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel - Full screen sidebar */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto z-[70]">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <CloseIconPro className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                <Link
                  to="/categories"
                  className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Categories
                </Link>
                <Link
                  to="/deals"
                  className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Today's Deals
                </Link>
                <Link
                  to="/new-arrivals"
                  className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  New Arrivals
                </Link>
                <Link
                  to="/best-sellers"
                  className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Best Sellers
                </Link>
                <Link
                  to="/collections"
                  className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Collections
                </Link>
              </nav>

              {/* Divider */}
              <div className="my-6 border-t border-gray-200" />

              {/* Additional Links */}
              <div className="space-y-1">
                <Link
                  to="/track-order"
                  className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Track Order
                </Link>
                <Link
                  to="/help"
                  className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Help & Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
