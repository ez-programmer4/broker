import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role, phone, companyName } = await req.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name,
        role: role || "CUSTOMER",
      },
    });

    // Create broker profile if role is BROKER
    if (role === "BROKER") {
      await prisma.brokerProfile.create({
        data: {
          userId: user.id,
          phone,
          companyName,
        },
      });
    }

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}