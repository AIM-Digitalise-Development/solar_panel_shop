import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, address, role, adminSecret } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required fields." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check current users count
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });

    let assignedRole: "customer" | "admin" = "customer";

    // First-Time Setup Rule:
    // If the users table is completely empty (or no administrator exists yet),
    // automatically grant full Administrator privileges to this user!
    const isFirstAdmin = totalUsers === 0 || adminCount === 0;

    if (isFirstAdmin) {
      assignedRole = "admin";
    } else if (role === "admin") {
      const systemSecret = process.env.SETUP_SECRET || "Q3xT7mN1vR2kL6pW8yF1dS5h6nP8qX";
      if (adminSecret && adminSecret === systemSecret) {
        assignedRole = "admin";
      } else {
        return NextResponse.json(
          { error: "Invalid admin setup key. Access denied." },
          { status: 403 }
        );
      }
    }

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: assignedRole,
      phone: phone?.trim() || "",
      address: address?.trim() || "",
    });

    return NextResponse.json(
      {
        message: isFirstAdmin
          ? "First-time administrator account created successfully! You now have full operational privileges."
          : "Account created successfully.",
        isFirstAdmin,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          address: newUser.address,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register account." },
      { status: 500 }
    );
  }
}
