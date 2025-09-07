import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building, MessageSquare, Plus, AlertCircle, DollarSign } from "lucide-react";

export default async function BrokerDashboard() {
  const session = await getServerSession(authOptions);
  const brokerId = parseInt((session?.user as any)?.id);

  const brokerProfile = await prisma.brokerProfile.findUnique({
    where: { userId: brokerId },
  });

  const stats = {
    totalProperties: await prisma.property.count({ where: { brokerId } }),
    activeProperties: await prisma.property.count({ 
      where: { brokerId, status: "ACTIVE" } 
    }),
    totalInquiries: await prisma.inquiry.count({
      where: { property: { brokerId } }
    }),
    unreadInquiries: await prisma.inquiry.count({
      where: { 
        property: { brokerId },
        status: "OPEN"
      }
    }),
  };

  const recentProperties = await prisma.property.findMany({
    where: { brokerId },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { images: true },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Broker Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
        </div>

        {/* Account Status */}
        {!brokerProfile?.approvedByAdmin && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Account Pending Approval</p>
                  <p className="text-sm text-yellow-700">
                    Your account is pending admin approval. Properties won't be visible until approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold">{stats.totalProperties}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeProperties}</p>
                </div>
                <Building className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Inquiries</p>
                  <p className="text-3xl font-bold">{stats.totalInquiries}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Inquiries</p>
                  <p className="text-3xl font-bold text-red-600">{stats.unreadInquiries}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/broker/properties/new">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Property
                  </Button>
                </Link>
                <Link href="/broker/properties">
                  <Button variant="outline" className="w-full justify-start">
                    <Building className="h-4 w-4 mr-2" />
                    Manage Properties
                  </Button>
                </Link>
                <Link href="/broker/inquiries">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Inquiries
                  </Button>
                </Link>
                {brokerProfile?.depositStatus !== "PAID" && (
                  <Link href="/broker/deposit">
                    <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Submit Deposit
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Properties */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Properties</CardTitle>
                <Link href="/broker/properties">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentProperties.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No properties yet</p>
                  <Link href="/broker/properties/new" className="mt-2 inline-block">
                    <Button size="sm">Add Your First Property</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProperties.map((property) => (
                    <div key={property.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{property.title}</h4>
                        <p className="text-sm text-gray-600">{property.city}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        property.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}