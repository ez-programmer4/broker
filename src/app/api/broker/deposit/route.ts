import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "BROKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brokerId = parseInt((session.user as any).id);
    
    // Check if broker already has a pending or paid deposit
    const existingDeposit = await prisma.deposit.findFirst({
      where: {
        brokerId,
        status: { in: ["PENDING", "PAID"] }
      }
    });

    if (existingDeposit) {
      return NextResponse.json(
        { error: "You already have a pending or completed deposit" },
        { status: 400 }
      );
    }

    const {
      amount,
      currency,
      bankName,
      accountNumber,
      transactionId,
      bankReference,
      receiptUrl
    } = await req.json();

    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        brokerId,
        amount: parseFloat(amount),
        currency,
        bankName,
        accountNumber,
        transactionId,
        bankReference,
        receiptUrl,
        paymentMethod: "BANK_TRANSFER",
        status: "PENDING",
      },
    });

    return NextResponse.json({ 
      message: "Deposit submitted successfully",
      depositId: deposit.id 
    });

  } catch (error) {
    console.error("Deposit creation error:", error);
    return NextResponse.json(
      { error: "Failed to submit deposit" },
      { status: 500 }
    );
  }
}