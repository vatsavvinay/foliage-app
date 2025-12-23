import { ArrowRight, Leaf, Package, Zap } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="min-h-[600px] bg-gradient-to-br from-sage-50 via-white to-cream-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cream-100 rounded-full opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium">
              <Leaf className="w-4 h-4" />
              Welcome to Foliage
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-sage-900 mb-6 leading-tight">
            Discover Sustainable Living
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
            Handpicked eco-friendly products for a better tomorrow. From home essentials to sustainable fashion, find everything you need to live responsibly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition font-semibold"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-neutral-300 text-sage-900 rounded-lg hover:bg-neutral-50 transition font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-sage-100 rounded-lg">
                <Package className="w-6 h-6 text-sage-600" />
              </div>
            </div>
            <h3 className="font-semibold text-lg text-sage-900 mb-2">Curated Selection</h3>
            <p className="text-neutral-600">
              Carefully selected eco-friendly products that meet our sustainability standards.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-cream-100 rounded-lg">
                <Zap className="w-6 h-6 text-cream-600" />
              </div>
            </div>
            <h3 className="font-semibold text-lg text-sage-900 mb-2">Fast Shipping</h3>
            <p className="text-neutral-600">
              Quick and reliable delivery to your doorstep with eco-conscious packaging.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-sage-100 rounded-lg">
                <Leaf className="w-6 h-6 text-sage-600" />
              </div>
            </div>
            <h3 className="font-semibold text-lg text-sage-900 mb-2">Sustainable Impact</h3>
            <p className="text-neutral-600">
              Every purchase contributes to environmental conservation and sustainability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
