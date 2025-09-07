import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const city = searchParams.get("city");

  const where: any = { status: "ACTIVE" };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type && type !== "all") where.type = type;
  if (city) where.city = { contains: city, mode: "insensitive" };

  const properties = await prisma.property.findMany({
    where,
    include: {
      images: true,
      broker: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(properties);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "BROKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const brokerId = parseInt((session.user as any).id);

  const property = await prisma.property.create({
    data: {
      ...data,
      brokerId,
      price: parseFloat(data.price),
    },
  });

  return NextResponse.json(property);
}