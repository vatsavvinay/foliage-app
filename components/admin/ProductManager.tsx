'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { slugify } from '@/lib/utils';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: any;
  image?: string | null;
  published: boolean;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
};

export function ProductManager({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '1.50',
    image: '',
    categoryId: categories[0]?.id ?? '',
    published: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save product');
      }
      setForm({
        name: '',
        description: '',
        price: '1.50',
        image: '',
        categoryId: categories[0]?.id ?? '',
        published: true,
      });
      startTransition(() => router.refresh());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published }),
    });
    startTransition(() => router.refresh());
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    startTransition(() => router.refresh());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 border border-neutral-200 rounded-2xl p-6 bg-white shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sage-700 font-semibold">
          <ShoppingBag className="w-4 h-4" />
          Add Product
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-700 mb-1">Name</label>
            <input
              className="w-full rounded border border-neutral-200 px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-1">Description</label>
            <textarea
              className="w-full rounded border border-neutral-200 px-3 py-2"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-neutral-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="w-full rounded border border-neutral-200 px-3 py-2"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-700 mb-1">Category</label>
              <select
                className="w-full rounded border border-neutral-200 px-3 py-2"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-1">Image URL</label>
            <input
              className="w-full rounded border border-neutral-200 px-3 py-2"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/images/lettuce.jpg"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            <label htmlFor="published" className="text-sm text-neutral-700">
              Published
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-sage-600 text-white py-2 font-semibold hover:bg-sage-700 transition"
          >
            {saving ? 'Saving…' : 'Save Product'}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 border border-neutral-200 rounded-2xl p-6 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-neutral-900">Current Products</h3>
          {pending && <span className="text-xs text-neutral-500">Refreshing…</span>}
        </div>
        <div className="space-y-4">
          {products.length === 0 && <p className="text-neutral-600">No products yet.</p>}
          {products.map((p) => (
            <div key={p.id} className="border border-neutral-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Slug: {slugify(p.name)}</p>
                  <h4 className="text-xl font-heading font-semibold text-neutral-900">{p.name}</h4>
                  <p className="text-neutral-700 text-sm line-clamp-2">{p.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sage-700">${Number(p.price).toFixed(2)}</p>
                  <p className="text-xs text-neutral-500">{p.published ? 'Published' : 'Unpublished'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublish(p.id, !p.published)}
                  className="rounded-full border border-neutral-200 px-3 py-1 text-sm hover:bg-neutral-100"
                >
                  {p.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
