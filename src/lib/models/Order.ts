import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId?: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  quotationId: mongoose.Types.ObjectId;
  quoteRequestId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  totalAmount: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingLink?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', required: true },
    quoteRequestId: { type: Schema.Types.ObjectId, ref: 'QuoteRequest', default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    trackingLink: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
