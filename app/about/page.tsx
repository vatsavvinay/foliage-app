import Image from 'next/image';
import { Heart, Leaf, Sprout, Trees, Earth } from 'lucide-react';

export const metadata = {
  title: 'About Us | Foliage Greens',
  description: 'Learn how we grow fresher, cleaner hydroponic greens for our community.',
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hydroponic-bg.jpg"
          alt="Hydroponic rows of greens"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/85 to-white" />
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <p className="text-sm font-semibold tracking-wide text-sage-700">About Us</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight font-heading">
          Fresh greens, grown with intention.
        </h1>
        <p className="mt-4 text-lg text-neutral-700 max-w-3xl">
          We’re a small urban farm dedicated to lettuce, basil, and baby spinach—grown hydroponically for consistency,
          cleanliness, and peak flavor all year long.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 pb-12">
        <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur p-8 shadow-sm">
          <p className="text-sm font-semibold tracking-wide text-sage-700">Mission</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900 font-heading">Grow fresher, cleaner greens close to home.</h2>
          <p className="mt-4 text-neutral-700 leading-relaxed" style={{ lineHeight: 1.6 }}>
            Our mission is simple: to grow fresher, cleaner, and more nutritious greens right here at home, and deliver
            them to families who care about quality, health, and sustainability.
          </p>
          <p className="mt-3 text-neutral-700 leading-relaxed" style={{ lineHeight: 1.6 }}>
            We use hydroponic farming to raise lettuce, basil, and spinach in a controlled, soil-free environment. This
            means consistent quality, reduced water waste, year-round availability, and produce harvested at its peak—so
            every bite tastes like it should.
          </p>
          <p className="mt-3 text-neutral-700 leading-relaxed" style={{ lineHeight: 1.6 }}>
            We’re here to bring truly fresh food closer to people while proving that small local farms can create big
            positive change.
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur p-8 shadow-sm">
          <p className="text-sm font-semibold tracking-wide text-sage-700">Vision</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900 font-heading">A future built on local freshness.</h2>
          <p className="mt-4 text-neutral-700 leading-relaxed" style={{ lineHeight: 1.6 }}>
            We imagine a future where communities don’t depend on produce shipped thousands of miles—a future where
            fresh food is grown locally, sustainably, and thoughtfully.
          </p>
          <ul className="mt-4 space-y-3 text-neutral-700 leading-relaxed">
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
          <p className="mt-4 text-neutral-700 leading-relaxed" style={{ lineHeight: 1.6 }}>
            We’re not just growing plants. We’re growing connection, responsibility, and a better way to eat.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl border border-neutral-200 bg-white/90 backdrop-blur p-8 shadow-sm">
          <p className="text-sm font-semibold tracking-wide text-sage-700">Values</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900 font-heading">What guides us</h2>
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
              <div key={val.title} className="rounded-2xl border border-neutral-100 bg-white/80 p-5 shadow-xs flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 text-sage-700">
                  {val.icon ? <val.icon className="w-5 h-5" /> : null}
                  <h3 className="font-semibold text-neutral-900">{val.title}</h3>
                </div>
                <p className="mt-2 text-neutral-700 text-sm leading-relaxed">{val.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
