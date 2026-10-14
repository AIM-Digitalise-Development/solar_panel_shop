import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User, Product, QuoteRequest, Quotation } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // Check if products already exist
    const count = await Product.countDocuments();
    let admin = await User.findOne({ email: "admin@solarshop.in" });

    if (!admin) {
      const hashedAdminPassword = await bcrypt.hash("Admin@123456", 10);
      admin = await User.create({
        name: "SolarShop System Admin",
        email: "admin@solarshop.in",
        password: hashedAdminPassword,
        role: "admin",
        phone: "+91 9876543210",
        address: "Solar Business Tower, Bandra Kurla Complex, Mumbai, MH",
      });
    }

    let customer = await User.findOne({ email: "customer@example.com" });
    if (!customer) {
      const hashedCustomerPassword = await bcrypt.hash("Customer@123456", 10);
      customer = await User.create({
        name: "Rajesh Kumar",
        email: "customer@example.com",
        password: hashedCustomerPassword,
        role: "customer",
        phone: "+91 9820011223",
        address: "Flat 402, Green Meadows, Sector 18, Noida, UP",
      });
    }

    if (count > 0) {
      return NextResponse.json({
        message: "Database already seeded with products.",
        productsCount: count,
        adminLogin: { email: "admin@solarshop.in", password: "Admin@123456" },
        customerLogin: { email: "customer@example.com", password: "Customer@123456" },
      });
    }

    const sampleProducts = [
      {
        name: "HeliosPro 545W Monocrystalline PERC Module",
        slug: "heliospro-545w-mono-perc",
        description:
          "High-efficiency 144 half-cut cells solar photovoltaic module engineered for residential and commercial rooftop deployments. Boasts superior temperature coefficient and multi-busbar technology delivering peak yield even under low irradiance conditions.",
        category: "Panel",
        wattage: 545,
        price: 13999,
        images: [
          "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
        ],
        specs: [
          { key: "Max Power (Pmax)", value: "545 Watts" },
          { key: "Cell Type", value: "Mono PERC 144 Half-Cut" },
          { key: "Module Efficiency", value: "21.3%" },
          { key: "Dimensions", value: "2278 x 1134 x 35 mm" },
          { key: "Weight", value: "27.5 kg" },
          { key: "Warranty", value: "12-Year Product, 25-Year Linear Power" },
          { key: "Certification", value: "ALMM & BIS Approved, IEC 61215" },
        ],
        inStock: true,
        featured: true,
      },
      {
        name: "AuraDual 550W Bifacial Dual-Glass Solar Panel",
        slug: "auradual-550w-bifacial-dual-glass",
        description:
          "Next-generation bifacial photovoltaic module capturing sunlight from both front and rear surfaces. Dual glass construction guarantees extreme resistance to moisture degradation, PID, and harsh weather.",
        category: "Panel",
        wattage: 550,
        price: 15499,
        images: [
          "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80",
        ],
        specs: [
          { key: "Max Power (Pmax)", value: "550 Watts (+up to 25% rear gain)" },
          { key: "Bifaciality Factor", value: "70 ± 5%" },
          { key: "Module Efficiency", value: "21.5%" },
          { key: "Glass", value: "2.0 mm Semi-tempered Dual Glass" },
          { key: "Warranty", value: "30-Year Performance Warranty" },
          { key: "Approval", value: "MNRE & ALMM Enlisted" },
        ],
        inStock: true,
        featured: true,
      },
      {
        name: "HomeVolt 3kW Smart On-Grid String Inverter",
        slug: "homevolt-3kw-smart-on-grid-inverter",
        description:
          "Lightweight, fanless IP65 on-grid inverter tailored for residential PM Surya Ghar rooftop systems. Features integrated Wi-Fi monitoring, dual MPPT tracker, and 98.4% maximum conversion efficiency.",
        category: "Inverter",
        wattage: 3000,
        price: 28500,
        images: [
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        ],
        specs: [
          { key: "Nominal AC Power", value: "3000 Watts (Single Phase)" },
          { key: "Max DC Input Voltage", value: "600 V" },
          { key: "MPPT Trackers", value: "2 Independent Trackers" },
          { key: "Monitoring", value: "Cloud App & Real-Time Wi-Fi" },
          { key: "Protection", value: "IP65 Weatherproof Enclosure" },
          { key: "Warranty", value: "5-Year Full Replacement Guarantee" },
        ],
        inStock: true,
        featured: true,
      },
      {
        name: "SolarMax 5kW Hybrid Inverter with Battery Storage",
        slug: "solarmax-5kw-hybrid-inverter",
        description:
          "Versatile hybrid inverter seamlessly managing rooftop solar generation, battery storage, and grid export. Delivers sub-10ms automatic switchover for zero power interruptions during outages.",
        category: "Inverter",
        wattage: 5000,
        price: 52000,
        images: [
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        ],
        specs: [
          { key: "Rated Output", value: "5000W Pure Sine Wave" },
          { key: "Battery Voltage Compatibility", value: "48V Lithium / Lead Acid" },
          { key: "Switching Time", value: "< 10 milliseconds" },
          { key: "Max PV Input", value: "6500W" },
          { key: "Warranty", value: "5 Years Extendable to 10" },
        ],
        inStock: true,
        featured: true,
      },
      {
        name: "TitanBank 5.12kWh LiFePO4 Lithium Solar Battery",
        slug: "titanbank-5-12kwh-lifepo4-battery",
        description:
          "High-capacity Lithium Iron Phosphate energy storage unit with smart intelligent battery management system (BMS). Offers 6000+ deep cycles at 90% Depth of Discharge with zero maintenance.",
        category: "Battery",
        wattage: 5120,
        price: 84000,
        images: [
          "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80",
        ],
        specs: [
          { key: "Nominal Capacity", value: "5.12 kWh / 100Ah" },
          { key: "Nominal Voltage", value: "51.2 V" },
          { key: "Cycle Life", value: "6,000+ cycles @ 90% DoD" },
          { key: "BMS Features", value: "Over-voltage, Thermal & Short Circuit Protection" },
          { key: "Mounting", value: "Wall-Mount or Floor Stacking" },
          { key: "Warranty", value: "10-Year Manufacturer Warranty" },
        ],
        inStock: true,
        featured: true,
      },
      {
        name: "PM Surya Ghar 3kW Complete Home Solar Kit",
        slug: "pm-surya-ghar-3kw-complete-home-solar-kit",
        description:
          "Turnkey 3kW rooftop system tailored for Indian homes aiming for zero monthly electricity bills under PM Surya Ghar Yojana. Eligible for maximum central government capital subsidy of ₹78,000.",
        category: "Kit",
        wattage: 3000,
        price: 165000,
        images: [
          "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
        ],
        specs: [
          { key: "Recommended Roof Area", value: "300 sq. ft. shade-free" },
          { key: "Monthly Generation", value: "360 - 420 Units (kWh)" },
          { key: "Panels Included", value: "6x 545W Mono PERC Tier-1 Modules" },
          { key: "Inverter", value: "3kW Dual-MPPT Grid-Tied Smart Inverter" },
          { key: "Structure", value: "Pre-galvanized HDG Module Mounting Structure" },
          { key: "Govt Subsidy Eligibility", value: "₹78,000 Direct DBT to Bank Account" },
          { key: "Net Metering", value: "Full Assistance Included" },
        ],
        inStock: true,
        featured: true,
      },
      {
        name: "Enterprise 10kW Commercial Rooftop Solar Kit",
        slug: "enterprise-10kw-commercial-solar-kit",
        description:
          "Heavy-duty commercial three-phase rooftop solar package designed for small manufacturing factories, hospitals, schools, and offices. Slashes peak tariff bills by up to 80%.",
        category: "Kit",
        wattage: 10000,
        price: 475000,
        images: [
          "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
        ],
        specs: [
          { key: "System Capacity", value: "10 kWp Three-Phase" },
          { key: "Panels Included", value: "18x 550W High-Efficiency Modules" },
          { key: "Inverter", value: "10kW Three-Phase IP65 On-Grid Inverter" },
          { key: "Estimated Savings", value: "₹1,20,000 to ₹1,50,000 Annually" },
          { key: "Payback Period", value: "3.2 to 3.8 Years" },
        ],
        inStock: true,
        featured: false,
      },
      {
        name: "SolarPro Anodized Aluminum Elevated Mounting Structure",
        slug: "solarpro-aluminum-elevated-mounting-structure",
        description:
          "Corrosion-proof, wind-tunnel tested structural mounting frames constructed from high-tensile 6063-T6 aluminum alloy. Designed to withstand wind speeds up to 170 km/h with zero roof puncture options.",
        category: "Accessory",
        price: 8500,
        images: [
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        ],
        specs: [
          { key: "Material", value: "Anodized Aluminum 6063-T6" },
          { key: "Wind Resistance", value: "Up to 170 km/h" },
          { key: "Tilt Angle", value: "Adjustable 15° to 30°" },
          { key: "Hardware", value: "SS304 Stainless Steel Bolts" },
          { key: "Warranty", value: "25-Year Corrosion Guarantee" },
        ],
        inStock: true,
        featured: false,
      },
      {
        name: "Dual-Core 4mm² UV & Weather Resistant Solar DC Cable (50m)",
        slug: "solar-dc-cable-4mm-50m",
        description:
          "Halogen-free, double-insulated tinned copper solar cable rated for 1500V DC. Built to withstand extreme solar UV rays and sub-zero to 90°C ambient temperatures.",
        category: "Accessory",
        price: 3800,
        images: [
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        ],
        specs: [
          { key: "Conductor", value: "Electrolytic Tinned Copper (Class 5)" },
          { key: "Voltage Rating", value: "1.5kV DC" },
          { key: "Length", value: "50 Metres Coil" },
          { key: "Certification", value: "EN 50618 (TUV Approved)" },
        ],
        inStock: true,
        featured: false,
      },
    ];

    const insertedProducts = await Product.insertMany(sampleProducts);

    // Create a sample QuoteRequest and Quotation for Rajesh Kumar
    const sampleQuoteRequest = await QuoteRequest.create({
      userId: customer._id,
      items: [
        {
          productId: insertedProducts[0]._id,
          name: insertedProducts[0].name,
          quantity: 6,
          wattage: 545,
          price: 13999,
          notes: "Need rooftop installation on RCC flat roof.",
        },
        {
          productId: insertedProducts[2]._id,
          name: insertedProducts[2].name,
          quantity: 1,
          wattage: 3000,
          price: 28500,
          notes: "Need net-metering liaison support.",
        },
      ],
      customerDetails: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        message: "Interested in claiming the ₹78,000 PM Surya Ghar subsidy.",
      },
      status: "Quoted",
    });

    const sampleQuotation = await Quotation.create({
      quoteRequestId: sampleQuoteRequest._id,
      userId: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      items: [
        {
          productId: insertedProducts[0]._id,
          name: "6x HeliosPro 545W Monocrystalline PERC Modules (3.27 kWp)",
          quantity: 6,
          unitPrice: 13200,
          total: 79200,
        },
        {
          productId: insertedProducts[2]._id,
          name: "HomeVolt 3kW Smart On-Grid String Inverter",
          quantity: 1,
          unitPrice: 27500,
          total: 27500,
        },
        {
          productId: insertedProducts[6]._id,
          name: "Complete Mounting Hardware, Lightning Arrester & Discom Liaisoning",
          quantity: 1,
          unitPrice: 22000,
          total: 22000,
        },
      ],
      subtotal: 128700,
      tax: 15444, // 12% GST
      totalAmount: 144144,
      terms:
        "Quotation valid for 30 days. Estimated PM Surya Ghar Direct Benefit Transfer subsidy eligibility is ₹78,000, reducing net investment to ~₹66,144. Payment strictly via offline bank RTGS upon site clearance.",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "Sent",
      sentAt: new Date(),
    });

    sampleQuoteRequest.quotationId = sampleQuotation._id;
    await sampleQuoteRequest.save();

    return NextResponse.json({
      message: "Database seeded successfully with solar catalog, demo users, and sample quote flow.",
      productsCreated: insertedProducts.length,
      demoAccounts: {
        admin: { email: "admin@solarshop.in", password: "Admin@123456" },
        customer: { email: "customer@example.com", password: "Customer@123456" },
      },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
