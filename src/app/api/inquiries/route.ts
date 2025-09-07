import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { propertyId, customerId, name, email, phone, message } = await req.json();

    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId: parseInt(propertyId),
        customerId: customerId ? parseInt(customerId) : null,
        name,
        email,
        phone,
        message,
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 });
  }
}