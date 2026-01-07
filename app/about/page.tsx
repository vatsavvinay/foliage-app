import Image from 'next/image';
import { Heart, Leaf, Sprout, Trees, Earth } from 'lucide-react';

export const metadata = {
  title: 'Meet Foliage | Foliage Greens',
  description: 'Learn how we grow fresher, cleaner hydroponic greens for our community.',
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hydroponic_sketch_bg.png"
          alt="Hydroponic rows of greens"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f6f2eb]/80 via-[#f6f2eb]/85 to-[#f6f2eb]" />
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <span className="sketch-tag">Meet Foliage</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-heading font-semibold text-neutral-900 leading-tight">
          Fresh greens, grown with intention.
        </h1>
        <p className="mt-4 text-lg text-neutral-700 max-w-3xl">
          We’re a small urban farm dedicated to lettuce, basil, and baby spinach—grown hydroponically for consistency,
          cleanliness, and peak flavor all year long.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 pb-12">
        <div className="sketch-card p-8 space-y-4">
          <p className="text-sm font-semibold tracking-wide text-sage-700">Mission</p>
          <h2 className="text-2xl font-heading font-semibold text-neutral-900">
            Grow fresher, cleaner greens close to home.
          </h2>
          <p className="text-neutral-700 leading-relaxed">
            Our mission is simple: to grow fresher, cleaner, and more nutritious greens right here at home, and deliver
            them to families who care about quality, health, and sustainability.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            We use hydroponic farming to raise lettuce, basil, and spinach in a controlled, soil-free environment. This
            means consistent quality, reduced water waste, year-round availability, and produce harvested at its peak—so
            every bite tastes like it should.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            We’re here to bring truly fresh food closer to people while proving that small local farms can create big
            positive change.
          </p>
        </div>

        <div className="sketch-card p-8 space-y-4">
          <p className="text-sm font-semibold tracking-wide text-sage-700">Vision</p>
          <h2 className="text-2xl font-heading font-semibold text-neutral-900">A future built on local freshness.</h2>
          <p className="text-neutral-700 leading-relaxed">
            We imagine a future where communities don’t depend on produce shipped thousands of miles—a future where
            fresh food is grown locally, sustainably, and thoughtfully.
          </p>
          <ul className="space-y-3 text-neutral-700 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-sage-700 font-semibold">•</span>
              Inspires healthier eating
            </li>
            <li className="flex gap-2">
              <span className="text-sage-700 font-semibold">•</span>
              Supports local living
            </li>
            <li className="flex gap-2">
              <span className="text-sage-700 font-semibold">•</span>
              Reduces environmental impact
            </li>
            <li className="flex gap-2">
              <span className="text-sage-700 font-semibold">•</span>
              Makes fresh greens accessible year-round
            </li>
          </ul>
          <p className="text-neutral-700 leading-relaxed">
            We’re not just growing plants. We’re growing connection, responsibility, and a better way to eat.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="sketch-panel p-8">
          <span className="sketch-tag">Values</span>
          <h2 className="mt-2 text-2xl font-heading font-semibold text-neutral-900">What guides us</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Freshness First',
                body: 'Harvested at the right time, handled with care, and delivered while it’s vibrant.',
                icon: Leaf,
              },
              {
                title: 'Honest Quality',
                body: 'No shortcuts. Just clean, controlled, carefully grown greens.',
                icon: Sprout,
              },
              {
                title: 'Sustainability',
                body: 'Hydroponics uses less water, reduces waste, and grows smarter.',
                icon: Earth,
              },
              {
                title: 'Community Matters',
                body: 'For families, neighbors, chefs—anyone who believes fresh food should truly be fresh.',
                icon: Trees,
              },
              {
                title: 'Heart in Every Leaf',
                body: 'Every seed represents passion and hope; supporting us supports a dream.',
                icon: Heart,
              },
            ].map((val) => (
              <div key={val.title} className="sketch-outline bg-[var(--paper-light)] p-5 flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 text-sage-700">
                  {val.icon ? <val.icon className="w-5 h-5" /> : null}
                  <h3 className="font-heading font-semibold text-neutral-900">{val.title}</h3>
                </div>
                <p className="text-neutral-700 text-sm leading-relaxed">{val.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
