import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirm password do not match." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from your current password." },
        { status: 400 }
      );
    }

    await connectDB();

    const adminUser = await User.findById(session.user.id);
    if (!adminUser || !adminUser.password) {
      return NextResponse.json(
        { error: "Admin account not found in database." },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect. Please check and try again." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    adminUser.password = hashedPassword;
    await adminUser.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully! Please use your new password on your next sign-in.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while updating the password." },
      { status: 500 }
    );
  }
}
