import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuotationItem {
  productId?: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IQuotation extends Document {
  _id: mongoose.Types.ObjectId;
  quoteRequestId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  items: IQuotationItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  terms: string;
  validUntil: Date;
  pdfUrl?: string;
  sentAt?: Date;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const QuotationSchema = new Schema<IQuotation>(
  {
    quoteRequestId: { type: Schema.Types.ObjectId, ref: 'QuoteRequest', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: '' },
    customerAddress: { type: String, default: '' },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    terms: {
      type: String,
      default:
        'Quotation valid for 30 days. Payment is offline via official RTGS/NEFT/Cheque after quotation acceptance. Includes standard 25-year solar module performance warranty and 5-year comprehensive inverter warranty.',
    },
    validUntil: { type: Date, required: true },
    pdfUrl: { type: String, default: '' },
    sentAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Accepted', 'Rejected'],
      default: 'Draft',
    },
  },
  { timestamps: true }
);

export const Quotation: Model<IQuotation> =
  mongoose.models.Quotation || mongoose.model<IQuotation>('Quotation', QuotationSchema);
