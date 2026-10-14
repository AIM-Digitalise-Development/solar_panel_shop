import nodemailer from 'nodemailer';

const host = process.env.MAIL_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.MAIL_PORT || '587', 10);
const user = process.env.MAIL_USERNAME || '';
const pass = process.env.MAIL_PASSWORD || '';
const fromEmail = process.env.MAIL_FROM_ADDRESS || 'dr.ti@gmail.com';
const fromName = process.env.MAIL_FROM_NAME || 'SolarShop India';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user,
    pass,
  },
});

export async function sendQuoteRequestToAdmin(data: {
  quoteRequestId: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    message?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    wattage?: number;
    price?: number;
    notes?: string;
  }>;
}) {
  try {
    const itemsListHtml = data.items
      .map(
        (i, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; font-weight: 500;">${idx + 1}. ${i.name}</td>
          <td style="padding: 10px; text-align: center;">${i.quantity}</td>
          <td style="padding: 10px; text-align: right;">${i.wattage ? i.wattage + ' W' : 'N/A'}</td>
          <td style="padding: 10px; text-align: right;">${i.price ? '₹' + i.price.toLocaleString('en-IN') : 'Quote Required'}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #0f172a, #0369a1); padding: 20px; border-radius: 8px; color: #ffffff; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">⚡ New Solar Quotation Request</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Request ID: ${data.quoteRequestId}</p>
        </div>

        <div style="padding: 20px 0;">
          <h3 style="color: #0f172a; margin-bottom: 12px;">Customer Details:</h3>
          <table style="width: 100%; font-size: 14px; color: #334155; line-height: 1.6;">
            <tr><td style="width: 130px; font-weight: bold;">Name:</td><td>${data.customerDetails.name}</td></tr>
            <tr><td style="font-weight: bold;">Email:</td><td><a href="mailto:${data.customerDetails.email}">${data.customerDetails.email}</a></td></tr>
            <tr><td style="font-weight: bold;">Phone:</td><td>${data.customerDetails.phone}</td></tr>
            <tr><td style="font-weight: bold;">Address:</td><td>${data.customerDetails.address}</td></tr>
            ${data.customerDetails.message ? `<tr><td style="font-weight: bold;">Requirement Notes:</td><td>${data.customerDetails.message}</td></tr>` : ''}
          </table>

          <h3 style="color: #0f172a; margin: 24px 0 12px 0;">Requested Equipment:</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Wattage</th>
                <th style="padding: 10px; text-align: right;">Estimated Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <div style="margin-top: 30px; text-align: center;">
            <a href="${appUrl}/admin/quotes/${data.quoteRequestId}" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              View Request & Prepare Quotation &rarr;
            </a>
          </div>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: fromEmail,
      subject: `[New Solar Quote Request] from ${data.customerDetails.name} (#${data.quoteRequestId.slice(-6)})`,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('Email error in sendQuoteRequestToAdmin:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendQuoteRequestConfirmationToCustomer(data: {
  customerEmail: string;
  customerName: string;
  quoteRequestId: string;
  items: Array<{
    name: string;
    quantity: number;
    wattage?: number;
  }>;
}) {
  try {
    const itemsHtml = data.items
      .map(
        (i) => `<li style="margin-bottom: 6px;"><strong>${i.name}</strong> &times; ${i.quantity} ${i.wattage ? `(${i.wattage}W)` : ''}</li>`
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #0284c7, #0d9488); padding: 24px; border-radius: 8px; color: #ffffff; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">☀️ We Have Received Your Solar Quote Request!</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">Thank you for taking a step towards clean, sustainable solar energy.</p>
        </div>

        <div style="padding: 24px 0; font-size: 15px; color: #334155; line-height: 1.6;">
          <p>Dear <strong>${data.customerName}</strong>,</p>
          <p>We have successfully received your quotation request (Reference: <code>#${data.quoteRequestId}</code>).</p>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #166534;">Your Requested Configuration:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              ${itemsHtml}
            </ul>
          </div>

          <h4 style="color: #0f172a; margin-top: 20px;">What happens next?</h4>
          <ol style="padding-left: 20px; margin-top: 8px;">
            <li>Our certified solar engineering consultant will review your rooftop and load requirements.</li>
            <li>We will factor in current <strong>PM Surya Ghar: Muft Bijli Yojana</strong> government subsidy benefits (up to ₹78,000 for 3kW).</li>
            <li>You will receive an itemized, formal quotation directly to this email within 24–48 hours.</li>
          </ol>

          <p style="margin-top: 24px;">You can track the progress of your quote anytime by signing in to your SolarShop account.</p>

          <div style="margin: 28px 0; text-align: center;">
            <a href="${appUrl}/my-quotes" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              View My Quotes &rarr;
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 13px; color: #64748b; text-align: center; margin: 0;">
            SolarShop India &bull; Renewable Energy Solutions &bull; Helpline: +91 1800-2121-SUN
          </p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: data.customerEmail,
      subject: `Quotation Request Received (#${data.quoteRequestId.slice(-6)}) - SolarShop`,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('Email error in sendQuoteRequestConfirmationToCustomer:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendQuotationToCustomer(data: {
  customerEmail: string;
  customerName: string;
  quotationId: string;
  quoteRequestId: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  validUntil: Date;
  pdfUrl?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  terms: string;
}) {
  try {
    const formattedValidDate = new Date(data.validUntil).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const itemsRows = data.items
      .map(
        (item, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px;">${idx + 1}. ${item.name}</td>
          <td style="padding: 10px; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; text-align: right;">₹${item.unitPrice.toLocaleString('en-IN')}</td>
          <td style="padding: 10px; text-align: right; font-weight: bold;">₹${item.total.toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #0f766e, #0284c7); padding: 24px; border-radius: 8px; color: #ffffff; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">📜 Your Formal Solar Quotation is Ready</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">Quotation Ref: #${data.quotationId}</p>
        </div>

        <div style="padding: 24px 0; font-size: 15px; color: #334155; line-height: 1.6;">
          <p>Dear <strong>${data.customerName}</strong>,</p>
          <p>We are pleased to provide your customized solar solution quotation prepared by our engineering team.</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <thead>
              <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Unit Rate</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: 600;">Subtotal:</td>
                <td style="padding: 10px; text-align: right; font-weight: 600;">₹${data.subtotal.toLocaleString('en-IN')}</td>
              </tr>
              ${
                data.tax > 0
                  ? `<tr>
                      <td colspan="3" style="padding: 8px 10px; text-align: right; color: #64748b;">GST / Taxes:</td>
                      <td style="padding: 8px 10px; text-align: right; color: #64748b;">₹${data.tax.toLocaleString('en-IN')}</td>
                    </tr>`
                  : ''
              }
              <tr style="border-top: 2px solid #0f172a; font-size: 16px;">
                <td colspan="3" style="padding: 12px 10px; text-align: right; font-weight: bold; color: #0f172a;">Total Investment:</td>
                <td style="padding: 12px 10px; text-align: right; font-weight: bold; color: #0284c7;">₹${data.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 12px; margin: 16px 0; font-size: 13px;">
            <strong>Validity:</strong> This quotation is locked in until <strong>${formattedValidDate}</strong>.
          </div>

          <div style="margin: 16px 0; font-size: 13px; color: #64748b;">
            <strong>Commercial Terms:</strong><br />
            ${data.terms}
          </div>

          <div style="margin: 28px 0; text-align: center;">
            <a href="${appUrl}/my-quotes/${data.quoteRequestId}" style="background-color: #16a34a; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 8px;">
              Review & Accept Quotation &rarr;
            </a>
            ${
              data.pdfUrl
                ? `<a href="${data.pdfUrl}" target="_blank" style="background-color: #0284c7; color: #ffffff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                    Download PDF Document
                  </a>`
                : ''
            }
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Note: Payment is executed strictly offline via bank transfer upon technical site inspection and agreement signing.
          </p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: data.customerEmail,
      subject: `Your Solar Solution Quotation is Ready (#${data.quotationId.slice(-6)}) - SolarShop`,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('Email error in sendQuotationToCustomer:', err.message);
    return { success: false, error: err.message };
  }
}
