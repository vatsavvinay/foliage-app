export type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
  description?: string;
};

export const products: Product[] = [
  {
    id: 'spinach',
    name: 'Fresh Spinach',
    price: 3.5,
    image: '/images/spinach.jpg',
    slug: 'spinach',
    description: 'Tender leafy spinach—great for salads and smoothies.',
  },
  {
    id: 'basil',
    name: 'Organic Basil',
    price: 2.75,
    image: '/images/basil.jpg',
    slug: 'basil',
    description: 'Aromatic basil perfect for pesto and garnishes.',
  },
  {
    id: 'lettuce',
    name: 'Crisp Lettuce',
    price: 4.0,
    image: '/images/lettuce.jpg',
    slug: 'lettuce',
    description: 'Crisp, fresh lettuce heads grown hydroponically.',
  },
];
