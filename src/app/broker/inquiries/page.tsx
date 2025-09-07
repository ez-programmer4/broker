import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Mail, Phone, User } from "lucide-react";

export default async function BrokerInquiriesPage() {
  const session = await getServerSession(authOptions);
  const brokerId = parseInt((session?.user as any)?.id);

  const inquiries = await prisma.inquiry.findMany({
    where: { property: { brokerId } },
    include: { 
      property: { select: { title: true, id: true } },
      customer: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Inquiries</h1>
          <p className="text-gray-600">{inquiries.length} total inquiries</p>
        </div>

        {inquiries.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No inquiries yet</p>
            <p className="text-gray-600">Inquiries from customers will appear here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Inquiry for: {inquiry.property.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded ${
                        inquiry.status === "OPEN" 
                          ? "bg-red-100 text-red-800" 
                          : inquiry.status === "RESPONDED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {inquiry.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Message:</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">
                        {inquiry.message}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{inquiry.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a 
                          href={`mailto:${inquiry.email}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {inquiry.email}
                        </a>
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a 
                            href={`tel:${inquiry.phone}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {inquiry.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}