export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-50 py-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌿</span>
              </div>
              <span className="font-bold text-lg">Foliage</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Modern e-commerce platform for sustainable products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li>
                <a href="/" className="hover:text-sage-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-sage-400 transition">
                  About
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-sage-400 transition">
                  Browse Greens
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
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
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded-l text-sm focus:outline-none"
              />
              <button className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-r text-sm transition font-medium">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-neutral-400 text-sm">
            <p>&copy; 2024 Foliage. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
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
