import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Users, Eye, CheckCircle, XCircle, Building, Calendar, Phone, Mail, Activity } from "lucide-react";

export default async function AdminBrokersPage() {
  const brokers = await prisma.user.findMany({
    where: { role: "BROKER" },
    include: { 
      brokerProfile: true,
      properties: { select: { id: true } },
      deposits: { select: { id: true, status: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Broker Management
              </h1>
              <p className="text-gray-600 text-lg">{brokers.length} total brokers registered</p>
            </div>
          </div>
        </div>

        {brokers.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No brokers registered</h3>
              <p className="text-gray-600 text-lg">Broker applications will appear here when users register</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {brokers.map((broker) => (
              <Card key={broker.id} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-xl">
                            {broker.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{broker.name}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{broker.email}</span>
                            </div>
                            {broker.brokerProfile?.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{broker.brokerProfile.phone}</span>
                              </div>
                            )}
                            {broker.brokerProfile?.companyName && (
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                <span className="font-medium">{broker.brokerProfile.companyName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Registered</span>
                          </div>
                          <p className="font-semibold text-gray-900">{formatDate(broker.createdAt)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium text-gray-700">Properties</span>
                          </div>
                          <p className="font-semibold text-gray-900">{broker.properties.length}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-medium text-gray-700">Deposit Status</span>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            broker.brokerProfile?.depositStatus === "PAID" 
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                              : "bg-amber-100 text-amber-700 border border-amber-200"
                          }`}>
                            {broker.brokerProfile?.depositStatus || "PENDING"}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">Account Status</span>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            broker.brokerProfile?.approvedByAdmin 
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                              : "bg-amber-100 text-amber-700 border border-amber-200"
                          }`}>
                            {broker.brokerProfile?.approvedByAdmin ? "Approved" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:flex-col lg:w-48">
                      <Link href={`/admin/brokers/${broker.id}`} className="w-full">
                        <Button variant="outline" className="w-full h-12 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      
                      {!broker.brokerProfile?.approvedByAdmin && (
                        <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      )}
                      
                      {broker.brokerProfile?.active && (
                        <Button variant="destructive" className="w-full h-12 shadow-lg hover:shadow-xl transition-all duration-200">
                          <XCircle className="h-4 w-4 mr-2" />
                          Deactivate
                        </Button>
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