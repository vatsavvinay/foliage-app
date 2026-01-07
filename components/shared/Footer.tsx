import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[var(--paper-light)] text-neutral-800 py-12 border-t-2 border-[var(--ink)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-sage-600 rounded-full border-2 border-[var(--ink)] flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌿</span>
              </div>
              <span className="font-heading text-lg">Foliage</span>
            </div>
            <p className="text-neutral-600 text-sm">
              Modern e-commerce platform for sustainable products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li>
                <Link href="/#home" className="hover:text-sage-700 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#meet-foliage" className="hover:text-sage-700 transition">
                  Meet Foliage
                </Link>
              </li>
              <li>
                <Link href="/#browse-greens" className="hover:text-sage-700 transition">
                  Browse Greens
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li>
                <a href="#" className="hover:text-sage-700 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage-700 transition">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage-700 transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage-700 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Newsletter</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-2 bg-[var(--paper)] text-neutral-800 rounded-l text-sm border-2 border-[var(--ink)] border-r-0 focus:outline-none"
              />
              <button className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-r text-sm transition font-medium border-2 border-[var(--ink)] border-l-0">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t-2 border-[var(--ink)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-neutral-600 text-sm">
            <p>&copy; 2024 Foliage. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-sage-700 transition">
                Privacy
              </a>
              <a href="#" className="hover:text-sage-700 transition">
                Terms
              </a>
              <a href="#" className="hover:text-sage-700 transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
