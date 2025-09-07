import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, adminNotes } = await req.json();
    const depositId = parseInt(params.id);
    const adminId = parseInt((session.user as any).id);

    if (!["verify", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const deposit = await prisma.deposit.update({
      where: { id: depositId },
      data: {
        status: action === "verify" ? "PAID" : "FAILED",
        adminNotes,
        verifiedAt: new Date(),
        verifiedBy: adminId,
      },
    });

    // If verified, update broker profile
    if (action === "verify") {
      await prisma.brokerProfile.update({
        where: { userId: deposit.brokerId },
        data: {
          depositStatus: "PAID",
          active: true,
        },
      });
    }

    return NextResponse.json({ 
      message: `Deposit ${action === "verify" ? "verified" : "rejected"} successfully`,
      deposit 
    });

  } catch (error) {
    console.error("Deposit verification error:", error);
    return NextResponse.json(
      { error: "Failed to process deposit" },
      { status: 500 }
    );
  }
}