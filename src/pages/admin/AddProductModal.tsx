// src/pages/admin/AddProductModal.tsx
import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { addProduct } from '../../lib/firestore';
import type { ProductCollection, ProductCategory } from '../../data/products';

interface Props {
  onClose: () => void;
  onAdded: () => void;
}

export default function AddProductModal({ onClose, onAdded }: Props) {
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    price: '',
    wood: '',
    collection: 'classique' as ProductCollection,
    category: 'bow-tie' as ProductCategory,
    image: '',
    careNote: '',
  });
  const [details, setDetails] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateDetail = (i: number, val: string) => {
    setDetails((prev) => prev.map((d, idx) => (idx === i ? val : d)));
  };

  const addDetail = () => setDetails((prev) => [...prev, '']);
  const removeDetail = (i: number) => setDetails((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setError('Name and price are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await addProduct({
        name: form.name,
        slug: form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        tagline: form.tagline,
        description: form.description,
        price: parseInt(form.price, 10),
        wood: form.wood,
        collection: form.collection,
        category: form.category,
        image: form.image || '/placeholder-bowTie.png',
        heroImage: form.image || '/placeholder-bowTie.png',
        details: details.filter(Boolean),
        careNote: form.careNote,
        isSoldOut: false,
      });
      onAdded();
    } catch {
      setError('Failed to save product. Please try again.');
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="bg-gray-900 border border-gray-700 rounded w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900">
          <h2 className="text-sm text-gray-200 font-medium">Λdd New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name & Price */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Name *" name="name" value={form.name} onChange={handleChange} placeholder="New Bow Tie Name" />
            <Field label="Price (EGP) *" name="price" type="number" value={form.price} onChange={handleChange} placeholder="2500" />
          </div>

          {/* Collection & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-1.5">Collection</label>
              <select
                name="collection"
                value={form.collection}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-3 py-3 focus:outline-none focus:border-amber-500/40 rounded-sm"
              >
                <option value="signature">La Signature Privée</option>
                <option value="classique">La Maison Classique</option>
                <option value="heritage">Les Héritiers du Nil</option>
                <option value="watches">Watches</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-1.5">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-3 py-3 focus:outline-none focus:border-amber-500/40 rounded-sm"
              >
                <option value="bow-tie">Bow Tie</option>
                <option value="watch">Watch</option>
              </select>
            </div>
          </div>

          {/* Tagline & Wood */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} placeholder="Short tagline…" />
            <Field label="Material / Wood" name="wood" value={form.wood} onChange={handleChange} placeholder="Walnut & Brass" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Product description…"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-3 py-3 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 resize-none rounded-sm"
            />
          </div>

          {/* Image URL */}
          <Field label="Image URL" name="image" value={form.image} onChange={handleChange} placeholder="https://… or /public/image.png" />

          {/* Details */}
          <div>
            <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-2">Product Details</label>
            <div className="space-y-2">
              {details.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={d}
                    onChange={(e) => updateDetail(i, e.target.value)}
                    placeholder={`Detail ${i + 1}…`}
                    className="flex-1 bg-gray-800 border border-gray-700 text-gray-200 text-xs px-3 py-3 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 rounded-sm"
                  />
                  {details.length > 1 && (
                    <button type="button" onClick={() => removeDetail(i)} className="text-gray-600 hover:text-red-400 transition-colors p-2">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDetail}
                className="text-amber-500/60 hover:text-amber-400 text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors py-2"
              >
                <Plus size={11} /> Add Detail
              </button>
            </div>
          </div>

          {/* Care Note */}
          <div>
            <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-1.5">Care Note</label>
            <textarea
              name="careNote"
              value={form.careNote}
              onChange={handleChange}
              rows={2}
              placeholder="Care instructions…"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-3 py-3 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 resize-none rounded-sm"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-700 text-gray-500 text-xs hover:text-gray-300 hover:border-gray-600 transition-colors rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-semibold transition-colors disabled:opacity-50 rounded"
            >
              {saving ? 'Saving…' : 'Add Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Field({
  label, name, value, onChange, placeholder, type = 'text',
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-3 py-3 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 rounded-sm"
      />
    </div>
  );
}
