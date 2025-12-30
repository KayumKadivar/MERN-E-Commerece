import heroBg from '../assets/hero-bg.png'

export default function HeroSection() {
  return (
    <section className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[550px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      ></div>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-blue-950/60"></div>

      {/* Content Container - positioned to left side */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 h-full">
        <div className="flex items-center h-full py-16 lg:py-20">

          {/* Left Content - Text */}
          <div className="max-w-xl lg:max-w-2xl">
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-amber-500/25">
                New Season Collection
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl xl:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Discover Premium
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                Quality Products
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
              Shop the latest trends with exclusive deals up to 50% off. Free shipping on orders over $50.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {/* Primary Button - Shop Now */}
              <button className="group bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-md transition-all flex items-center gap-3">
                <span>Shop Now</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              {/* Secondary Button - View Deals */}
              <button className="bg-white/20 border border-gray-500 hover:border-gray-300 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-md transition-all">
                View Deals
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
