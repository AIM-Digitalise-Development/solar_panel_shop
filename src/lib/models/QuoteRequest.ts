import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuoteItem {
  productId?: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  wattage?: number;
  price?: number;
  notes?: string;
}

export interface ICustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
}

export interface IQuoteRequest extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  items: IQuoteItem[];
  customerDetails: ICustomerDetails;
  status: 'Pending' | 'Quoted' | 'Accepted' | 'Rejected';
  quotationId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema = new Schema<IQuoteRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        wattage: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        notes: { type: String, default: '' },
      },
    ],
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      message: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['Pending', 'Quoted', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', default: null },
  },
  { timestamps: true }
);

export const QuoteRequest: Model<IQuoteRequest> =
  mongoose.models.QuoteRequest || mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);
