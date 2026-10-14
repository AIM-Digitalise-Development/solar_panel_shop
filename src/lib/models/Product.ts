import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISpec {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: 'Panel' | 'Inverter' | 'Battery' | 'Kit' | 'Accessory';
  wattage?: number;
  price?: number;
  images: string[];
  specs: ISpec[];
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Panel', 'Inverter', 'Battery', 'Kit', 'Accessory'],
      required: true,
      default: 'Panel',
    },
    wattage: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    specs: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
