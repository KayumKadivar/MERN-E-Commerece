import { useState, useEffect } from 'react'
import { StarIcon, ShippingIcon, PaymentIcon, ReturnIcon, NotificationIcon } from '../components/Icons'
import HeroSection from '../components/HeroSection'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Hero slider images
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&h=600&fit=crop',
      title: 'Summer Collection 2025',
      description: 'Discover the latest trends this season with up to 40% off',
      buttonText: 'Shop Now'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=1400&h=600&fit=crop',
      title: 'Exclusive Deals',
      description: 'Limited time offers - Up to 50% off on selected items',
      buttonText: 'Grab Now'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1441984904556-0ac8ce9feafd?w=1400&h=600&fit=crop',
      title: 'New Arrivals',
      description: 'Check out our freshly stocked products',
      buttonText: 'Explore'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1525966222134-fccd7d440be0?w=1400&h=600&fit=crop',
      title: 'Premium Quality',
      description: 'Best products at unbeatable prices',
      buttonText: 'Browse'
    }
  ]

  // Featured products
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones Pro',
      price: '$89.99',
      originalPrice: '$129.99',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=350&h=350&fit=crop',
      discount: '30%',
      rating: 4.5,
      reviews: 234
    },
    {
      id: 2,
      name: 'Smart Watch Ultra',
      price: '$199.99',
      originalPrice: '$299.99',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=350&h=350&fit=crop',
      discount: '33%',
      rating: 4.8,
      reviews: 456
    },
    {
      id: 3,
      name: 'Camera Pro 4K',
      price: '$449.99',
      originalPrice: '$649.99',
      image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=350&h=350&fit=crop',
      discount: '30%',
      rating: 4.7,
      reviews: 189
    },
    {
      id: 4,
      name: 'Travel Backpack',
      price: '$59.99',
      originalPrice: '$89.99',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=350&h=350&fit=crop',
      discount: '33%',
      rating: 4.6,
      reviews: 312
    },
    {
      id: 5,
      name: 'Running Shoes Max',
      price: '$79.99',
      originalPrice: '$119.99',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=350&h=350&fit=crop',
      discount: '33%',
      rating: 4.4,
      reviews: 523
    },
    {
      id: 6,
      name: 'Designer Sunglasses',
      price: '$49.99',
      originalPrice: '$99.99',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=350&h=350&fit=crop',
      discount: '50%',
      rating: 4.9,
      reviews: 678
    },
    {
      id: 7,
      name: 'Laptop Stand Pro',
      price: '$39.99',
      originalPrice: '$69.99',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=350&h=350&fit=crop',
      discount: '43%',
      rating: 4.5,
      reviews: 145
    },
    {
      id: 8,
      name: 'LED Desk Lamp',
      price: '$34.99',
      originalPrice: '$59.99',
      image: 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=350&h=350&fit=crop',
      discount: '42%',
      rating: 4.6,
      reviews: 267
    }
  ]

  // Categories
  const categories = [
    { name: 'Electronics', icon: '📱', color: 'from-blue-400 to-blue-600' },
    { name: 'Fashion', icon: '👕', color: 'from-pink-400 to-pink-600' },
    { name: 'Home', icon: '🏠', color: 'from-yellow-400 to-yellow-600' },
    { name: 'Sports', icon: '⚽', color: 'from-green-400 to-green-600' },
    { name: 'Books', icon: '📚', color: 'from-purple-400 to-purple-600' },
    { name: 'Beauty', icon: '💄', color: 'from-red-400 to-red-600' }
  ]

  // Best deals
  const deals = [
    {
      id: 1,
      title: 'Flash Sale',
      description: 'Up to 60% off on Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=300&fit=crop',
      badge: '⚡'
    },
    {
      id: 2,
      title: 'Weekend Special',
      description: 'Buy 2 Get 1 Free on Fashion',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
      badge: '🎉'
    },
    {
      id: 3,
      title: 'Mega Clearance',
      description: 'Up to 80% off on Selected Items',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop',
      badge: '🔥'
    }
  ]

  // Why choose us features
  const features = [
    {
      icon: ShippingIcon,
      title: 'Free Delivery',
      description: 'On orders above $50'
    },
    {
      icon: PaymentIcon,
      title: 'Secure Payments',
      description: '100% safe transactions'
    },
    {
      icon: ReturnIcon,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: NotificationIcon,
      title: '24/7 Support',
      description: 'Dedicated customer service'
    }
  ]

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const renderRating = (rating) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-600">({rating})</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <HeroSection />

      {/* CATEGORIES SECTION */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg">Explore our wide range of products</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`group relative h-40 sm:h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-5xl md:text-6xl mb-3">{category.icon}</span>
                  <span className="font-bold text-center text-sm md:text-base px-2">
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BEST DEALS SECTION */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Best Deals & Offers
            </h2>
            <p className="text-gray-600 text-lg">Limited time promotions you don't want to miss</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="group relative h-64 md:h-72 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col justify-end p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                        {deal.title}
                      </h3>
                      <p className="text-gray-100 text-sm md:text-base">
                        {deal.description}
                      </p>
                    </div>
                    <span className="text-3xl md:text-4xl">{deal.badge}</span>
                  </div>
                  <button className="mt-4 bg-white text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">Handpicked items just for you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative h-56 sm:h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold">
                    -{product.discount}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 line-clamp-2 min-h-14">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="mb-3">
                    {renderRating(product.rating)}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl md:text-2xl font-bold text-indigo-600">
                      {product.price}
                    </span>
                    <span className="text-sm md:text-base text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 md:py-3 rounded-lg font-bold transition-all transform hover:scale-105 text-sm md:text-base">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-10">
            <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-3 rounded-lg font-bold transition-all text-base md:text-lg">
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose ShopWise?
            </h2>
            <p className="text-gray-600 text-lg">Trusted by millions of customers worldwide</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white p-6 md:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
                >
                  <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Subscribe to Our Newsletter
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-blue-50 mb-10">
              Get exclusive offers, new arrivals, and special deals delivered to your inbox
            </p>

            {/* Subscription Form */}
            <form className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 max-w-md mx-auto mb-8 border border-white/20 hover:border-white/40 transition-all">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-5 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white transition-all text-base"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-gray-100 text-indigo-600 font-bold px-7 py-4 rounded-lg transition-all transform hover:scale-105 whitespace-nowrap text-base md:text-lg shadow-lg hover:shadow-2xl"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {/* Privacy Notice */}
            <p className="text-sm sm:text-base text-blue-100">
              We respect your privacy. Unsubscribe at any time.
            </p>

            {/* Trust Badges */}
            <div className="flex justify-center gap-6 mt-10 pt-10 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl mb-2">✉️</div>
                <p className="text-xs sm:text-sm text-blue-100">Weekly Deals</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎁</div>
                <p className="text-xs sm:text-sm text-blue-100">Exclusive Offers</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-xs sm:text-sm text-blue-100">Early Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">About ShopWise</h3>
              <p className="text-sm leading-relaxed">
                Your ultimate destination for quality products and exceptional shopping experience. We bring the best brands to your doorstep.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Special Offers</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <a href="mailto:support@shopwise.com" className="hover:text-white transition-colors">
                    support@shopwise.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📱</span>
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span>
                  <span>123 Shopping Street, City</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <p>&copy; 2025 ShopWise. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Sitemap</a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors">
                <span className="text-lg">f</span>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors">
                <span className="text-lg">𝕏</span>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors">
                <span className="text-lg">📷</span>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors">
                <span className="text-lg">▶</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

