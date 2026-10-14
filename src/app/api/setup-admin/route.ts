import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { secret, email, name, password } = await req.json();

    const expectedSecret = process.env.SETUP_SECRET || "Q3xT7mN1vR2kL6pW8yF1dS5h6nP8qX";
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid setup secret key." }, { status: 403 });
    }

    await connectDB();

    const targetEmail = (email || "admin@solarshop.in").toLowerCase().trim();
    let user = await User.findOne({ email: targetEmail });

    if (user) {
      user.role = "admin";
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      if (name) {
        user.name = name;
      }
      await user.save();
      return NextResponse.json({
        message: "Existing user successfully elevated to administrator.",
        user: { id: user._id, email: user.email, role: user.role, name: user.name },
      });
    } else {
      const hashedPassword = await bcrypt.hash(password || "Admin@123456", 10);
      user = await User.create({
        name: name || "SolarShop Administrator",
        email: targetEmail,
        password: hashedPassword,
        role: "admin",
        phone: "+91 9876543210",
        address: "Headquarters, Solar Innovation Park, Mumbai, India",
      });
      return NextResponse.json({
        message: "New administrator account created.",
        user: { id: user._id, email: user.email, role: user.role, name: user.name },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
