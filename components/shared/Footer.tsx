import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-50 py-8 sm:py-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-sage-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌿</span>
              </div>
              <span className="font-bold text-sm">Foliage</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Modern e-commerce platform for sustainable products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Quick Links</h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li>
                <Link href="/" className="hover:text-sage-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sage-400 transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-sage-400 transition">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Support</h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li>
                <a href="#" className="hover:text-sage-400 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage-400 transition">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage-400 transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage-400 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Newsletter</h3>
            <p className="text-neutral-400 text-sm mb-3">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-2 py-2 bg-neutral-800 text-white rounded-l text-sm focus:outline-none"
              />
              <button className="px-3 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-r text-sm transition font-medium">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-neutral-400 text-sm">
            <p className="text-xs">&copy; 2024 Foliage. All rights reserved.</p>
            <div className="flex gap-4 mt-3 sm:mt-0 text-xs">
              <a href="#" className="hover:text-sage-400 transition">
                Privacy
              </a>
              <a href="#" className="hover:text-sage-400 transition">
                Terms
              </a>
              <a href="#" className="hover:text-sage-400 transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
