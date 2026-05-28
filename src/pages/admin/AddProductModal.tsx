// src/pages/admin/AddProductModal.tsx
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2, Upload, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { addProduct } from '../../lib/firestore';
import type { ProductCollection, ProductCategory } from '../../data/products';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

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
    originalPrice: '',
    wood: '',
    collection: 'classique' as ProductCollection,
    category: 'bow-tie' as ProductCategory,
    image: '',
    careNote: '',
    measurements: '',
    isSoldOut: false,
  });
  const [details, setDetails] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5MB.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadProgress(0);

    const storageRef = ref(storage, `gamen_products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (err) => {
        console.error('Upload failed:', err);
        setUploadError('Upload failed. Note: paste a link below if Firebase Storage is inactive.');
        setUploading(false);
        setUploadProgress(null);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setForm((prev) => ({ ...prev, image: downloadUrl }));
          setUploading(false);
          setUploadProgress(null);
        } catch (err) {
          console.error('Failed to get download URL:', err);
          setUploadError('Failed to retrieve image URL. Please paste it manually below.');
          setUploading(false);
          setUploadProgress(null);
        }
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const insertText = (fieldName: 'description' | 'careNote' | 'measurements', textToInsert: string) => {
    const textarea = document.getElementsByName(fieldName)[0] as HTMLTextAreaElement;
    if (!textarea) {
      setForm((prev) => ({ ...prev, [fieldName]: prev[fieldName] + textToInsert }));
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = form[fieldName];
    const newVal = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);
    setForm((prev) => ({ ...prev, [fieldName]: newVal }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
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
        originalPrice: form.originalPrice ? parseInt(form.originalPrice, 10) : undefined,
        wood: form.wood,
        collection: form.collection,
        category: form.category,
        image: form.image || '/placeholder-bowTie.png',
        heroImage: form.image || '/placeholder-bowTie.png',
        details: details.filter(Boolean),
        careNote: form.careNote,
        measurements: form.measurements,
        isSoldOut: form.isSoldOut,
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
          {/* Name */}
          <Field label="Product Name *" name="name" value={form.name} onChange={handleChange} placeholder="New Product Name" />

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (EGP) *" name="price" type="number" value={form.price} onChange={handleChange} placeholder="2500" />
            <Field label="Original Price (EGP) - Optional" name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="Compare-at price (e.g. 3500)" />
          </div>

          {/* Collection, Category & Stock Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-1.5">Collection</label>
              <select
                name="collection"
                value={form.collection}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-3 py-3 focus:outline-none focus:border-amber-500/40 rounded-sm"
              >
                <option value="classique">I. GΛMÉN Classiques</option>
                <option value="heritage">II. GΛMÉN Héritage</option>
                <option value="signature">III. GΛMÉN Signature</option>
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
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-1.5">Stock Status</label>
              <select
                name="isSoldOut"
                value={form.isSoldOut ? 'true' : 'false'}
                onChange={(e) => setForm((prev) => ({ ...prev, isSoldOut: e.target.value === 'true' }))}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-3 py-3 focus:outline-none focus:border-amber-500/40 rounded-sm"
              >
                <option value="false">In Stock</option>
                <option value="true">Sold Out</option>
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em]">Description</label>
              <div className="flex items-center gap-1.5 bg-gray-950 px-2 py-0.5 border border-gray-800 rounded-sm">
                <button
                  type="button"
                  onClick={() => insertText('description', '• ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-1 rounded transition-colors font-accent"
                  title="Insert Bullet Point"
                >
                  • Bullet
                </button>
                <span className="text-gray-800 text-[9px]">|</span>
                <button
                  type="button"
                  onClick={() => insertText('description', '⚜️ ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Fleur ⚜️"
                >
                  ⚜️
                </button>
                <button
                  type="button"
                  onClick={() => insertText('description', '✨ ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Sparkle ✨"
                >
                  ✨
                </button>
                <button
                  type="button"
                  onClick={() => insertText('description', '🪵 ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Wood 🪵"
                >
                  🪵
                </button>
                <button
                  type="button"
                  onClick={() => insertText('description', '⌚ ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Watch ⌚"
                >
                  ⌚
                </button>
                <button
                  type="button"
                  onClick={() => insertText('description', '📐 ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Ruler 📐"
                >
                  📐
                </button>
              </div>
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Product description…"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-3 py-3 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 resize-none rounded-sm"
            />
          </div>

          {/* Image Upload Assistant */}
          <div>
            <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-1.5">Product Image</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (uploading) return;
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className={`border border-dashed rounded-sm p-5 flex flex-col items-center justify-center text-center transition-all duration-200 ${
                uploading
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : 'border-gray-700 bg-gray-950 hover:bg-gray-900 hover:border-gray-600'
              } cursor-pointer`}
            >
              {uploading ? (
                <div className="flex flex-col items-center py-2">
                  <Loader2 className="animate-spin text-amber-500 mb-3" size={24} />
                  <span className="text-xs text-gray-300 font-medium">Uploading image...</span>
                  <div className="w-40 bg-gray-800 h-1.5 rounded-full overflow-hidden mt-3 border border-gray-700">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress ?? 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 mt-2 font-accent uppercase tracking-wider">
                    {uploadProgress}% Complete
                  </span>
                </div>
              ) : form.image && form.image.startsWith('http') ? (
                <div className="flex items-center gap-4 py-1">
                  <div className="w-16 h-16 rounded border border-gray-700 bg-gray-900 overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                    <img src={form.image} alt="Uploaded preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                      <Check size={14} /> Image Ready
                    </div>
                    <span className="text-[10px] text-gray-400 block hover:text-amber-400 transition-colors uppercase tracking-wider font-accent">
                      Click to choose different image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <Upload className="text-gray-500 mb-3" size={24} />
                  <span className="text-xs text-gray-300 font-medium mb-1">Drag &amp; drop image here or click to upload</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-accent">
                    Accepts JPG, PNG, WEBP (Max 5MB)
                  </span>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="flex items-start gap-2 bg-red-950/20 border border-red-900/50 rounded-sm p-3 mt-2 text-left">
                <AlertTriangle className="text-red-400 mt-0.5 flex-shrink-0" size={14} />
                <div className="flex-1">
                  <p className="text-red-400 text-xs font-medium mb-1">Upload Issue</p>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    {uploadError}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-3">
              <Field
                label="Direct Image URL (Alternative / Fallback)"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://imgbb.com/..."
              />
              <p className="text-[9px] text-gray-500 mt-1 leading-normal">
                * Note: You can paste a direct URL here if you prefer using free hosts like <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-amber-500/70 hover:underline">ImgBB</a> or <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="text-amber-500/70 hover:underline">Postimages</a>.
              </p>
            </div>
          </div>

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

          {/* Measurements */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em]">Measurements</label>
              <div className="flex items-center gap-1.5 bg-gray-955 px-2 py-0.5 border border-gray-800 rounded-sm">
                <button
                  type="button"
                  onClick={() => insertText('measurements', '• ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-1 rounded transition-colors font-accent"
                  title="Insert Bullet Point"
                >
                  • Bullet
                </button>
                <span className="text-gray-800 text-[9px]">|</span>
                <button
                  type="button"
                  onClick={() => insertText('measurements', '⚜️ ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Fleur ⚜️"
                >
                  ⚜️
                </button>
                <button
                  type="button"
                  onClick={() => insertText('measurements', '📐 ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Ruler 📐"
                >
                  📐
                </button>
              </div>
            </div>
            <textarea
              name="measurements"
              value={form.measurements}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. Width: 11.5 cm × Height: 6 cm × Edge Thickness: 0.51 cm"
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-xs px-3 py-3 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 resize-none rounded-sm"
            />
          </div>

          {/* Care Note */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-gray-500 text-[10px] uppercase tracking-[0.15em]">Care Note</label>
              <div className="flex items-center gap-1.5 bg-gray-955 px-2 py-0.5 border border-gray-800 rounded-sm">
                <button
                  type="button"
                  onClick={() => insertText('careNote', '• ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-1 rounded transition-colors font-accent"
                  title="Insert Bullet Point"
                >
                  • Bullet
                </button>
                <span className="text-gray-800 text-[9px]">|</span>
                <button
                  type="button"
                  onClick={() => insertText('careNote', '⚜️ ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Fleur ⚜️"
                >
                  ⚜️
                </button>
                <button
                  type="button"
                  onClick={() => insertText('careNote', '✨ ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Sparkle ✨"
                >
                  ✨
                </button>
                <button
                  type="button"
                  onClick={() => insertText('careNote', '🪵 ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Wood 🪵"
                >
                  🪵
                </button>
                <button
                  type="button"
                  onClick={() => insertText('careNote', '⌚ ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Watch ⌚"
                >
                  ⌚
                </button>
                <button
                  type="button"
                  onClick={() => insertText('careNote', '📐 ')}
                  className="text-[9px] text-amber-500/70 hover:text-amber-400 px-0.5 rounded transition-colors"
                  title="Insert Ruler 📐"
                >
                  📐
                </button>
              </div>
            </div>
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
