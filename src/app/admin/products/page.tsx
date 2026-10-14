"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Upload,
  CheckCircle2,
  X,
  Search,
  Zap,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Panel");
  const [wattage, setWattage] = useState<number | string>("");
  const [price, setPrice] = useState<number | string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "Warranty", value: "25-Year Performance" },
    { key: "Efficiency", value: "21.3%" },
  ]);
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setName("");
    setSlug("");
    setDescription("");
    setCategory("Panel");
    setWattage("");
    setPrice("");
    setImageUrl("");
    setSpecs([
      { key: "Warranty", value: "25-Year Performance" },
      { key: "Efficiency", value: "21.3%" },
    ]);
    setInStock(true);
    setFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditId(p._id);
    setName(p.name);
    setSlug(p.slug);
    setDescription(p.description);
    setCategory(p.category);
    setWattage(p.wattage || "");
    setPrice(p.price || "");
    setImageUrl(p.images?.[0] || "");
    setSpecs(p.specs && p.specs.length ? p.specs : [{ key: "Warranty", value: "25 Years" }]);
    setInStock(p.inStock);
    setFeatured(p.featured);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "solar_shop/products");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.error || "Upload failed. You can paste an image URL directly instead.");
      }
    } catch (err: any) {
      alert("Upload error. You can paste an image URL directly instead.");
    } finally {
      setUploading(false);
    }
  };

  const addSpecRow = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpecRow = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const updateSpecRow = (idx: number, field: "key" | "value", val: string) => {
    const updated = [...specs];
    updated[idx][field] = val;
    setSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        category,
        wattage: Number(wattage) || 0,
        price: Number(price) || 0,
        images: imageUrl ? [imageUrl] : [],
        specs: specs.filter((s) => s.key && s.value),
        inStock,
        featured,
      };

      const url = editId ? `/api/products/${editId}` : "/api/products";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save product.");
      } else {
        setModalOpen(false);
        loadProducts();
      }
    } catch (err: any) {
      alert(err.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!confirm(`Are you sure you want to delete "${prodName}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Solar Equipment Inventory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add, update, and manage product specifications, pricing, and category filters.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add New Equipment
          </button>
        </div>

        {/* Products Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-sm text-slate-500">Loading catalog...</div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center text-sm text-slate-500">No products found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Wattage</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {p.images?.[0] ? (
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                            ) : (
                              <Package className="w-6 h-6 text-slate-400 m-auto" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-snug">{p.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">slug: {p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{p.category}</td>
                      <td className="p-4 font-bold text-slate-900">
                        {p.wattage ? `${p.wattage}W` : "-"}
                      </td>
                      <td className="p-4 font-bold text-sky-700">
                        {p.price ? `₹${p.price.toLocaleString("en-IN")}` : "Quote Only"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            p.inStock
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {p.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      {/* Product Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editId ? "Edit Solar Equipment" : "Add New Solar Equipment"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Equipment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 545W Mono PERC Half-Cut Panel"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Panel">Solar Panel</option>
                    <option value="Inverter">Solar Inverter</option>
                    <option value="Battery">Battery Storage</option>
                    <option value="Kit">Complete Kit</option>
                    <option value="Accessory">Accessory &amp; Cable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wattage (W)
                  </label>
                  <input
                    type="number"
                    value={wattage}
                    onChange={(e) => setWattage(e.target.value)}
                    placeholder="e.g. 545"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display / Indicative Price (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 13999"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive technical summary, cell composition, temperature coefficients..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Image Input & Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Image (Cloudinary or Web URL)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or Cloudinary URL"
                    className="grow px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shrink-0 border border-slate-300 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {imageUrl && (
                  <div className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Key Specs Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Specifications Table (Key / Value)
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="text-xs text-sky-600 hover:underline font-bold"
                  >
                    + Add Spec Row
                  </button>
                </div>
                <div className="space-y-2">
                  {specs.map((sp, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Key (e.g. Warranty)"
                        value={sp.key}
                        onChange={(e) => updateSpecRow(idx, "key", e.target.value)}
                        className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 25-Year Linear)"
                        value={sp.value}
                        onChange={(e) => updateSpecRow(idx, "value", e.target.value)}
                        className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded-sm text-sky-600 focus:ring-sky-500"
                  />
                  Mark as In Stock
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded-sm text-sky-600 focus:ring-sky-500"
                  />
                  Feature on Homepage
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {submitting ? "Saving..." : editId ? "Update Equipment" : "Create Equipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
