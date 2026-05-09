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
    id: 'organic-spinach',
    name: 'Fresh Spinach',
    price: 1.5,
    image: '/images/spinach.jpeg',
    slug: 'organic-spinach',
    description: 'Tender leafy spinach—great for salads and smoothies.',
  },
  {
    id: 'fresh-basil',
    name: 'Organic Basil',
    price: 1.5,
    image: '/images/basil.jpg',
    slug: 'fresh-basil',
    description: 'Aromatic basil perfect for pesto and garnishes.',
  },
  {
    id: 'butter-lettuce',
    name: 'Crisp Lettuce',
    price: 1.5,
    image: '/images/lettuce.jpg',
    slug: 'butter-lettuce',
    description: 'Crisp, fresh lettuce heads grown hydroponically.',
  },
];
