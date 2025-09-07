import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id: parseInt(id) },
    include: {
      images: true,
      broker: { select: { name: true, email: true, brokerProfile: true } },
    },
  });

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  return NextResponse.json(property);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { id } = await params;
  const propertyId = parseInt(id);
  const userId = parseInt((session.user as any).id);

  // Check ownership
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property || (property.brokerId !== userId && (session.user as any).role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.property.update({
    where: { id: propertyId },
    data: {
      ...data,
      price: data.price ? parseFloat(data.price) : undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const propertyId = parseInt(id);
  const userId = parseInt((session.user as any).id);

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property || (property.brokerId !== userId && (session.user as any).role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.property.delete({
    where: { id: propertyId },
  });

  return NextResponse.json({ message: "Property deleted" });
}