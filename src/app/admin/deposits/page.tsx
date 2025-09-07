import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { DollarSign, CheckCircle, XCircle, Eye, FileText, Clock, AlertCircle, TrendingUp, Building, Calendar, Hash, CreditCard } from "lucide-react";

export default async function AdminDepositsPage() {
  const deposits = await prisma.deposit.findMany({
    include: { 
      broker: { select: { name: true, email: true } },
      verifier: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    pending: deposits.filter(d => d.status === "PENDING").length,
    paid: deposits.filter(d => d.status === "PAID").length,
    failed: deposits.filter(d => d.status === "FAILED").length,
    totalAmount: deposits
      .filter(d => d.status === "PAID")
      .reduce((sum, d) => sum + Number(d.amount), 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Bank Transfer Management
              </h1>
              <p className="text-gray-600 text-lg">Ethiopian Banking System Integration</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
                  <p className="text-xs text-amber-600 mt-1">Awaiting verification</p>
                </div>
                <div className="p-3 bg-amber-600 rounded-xl shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 mb-1">Verified</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.paid}</p>
                  <p className="text-xs text-emerald-600 mt-1">Successfully processed</p>
                </div>
                <div className="p-3 bg-emerald-600 rounded-xl shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-700 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-rose-900">{stats.failed}</p>
                  <p className="text-xs text-rose-600 mt-1">Failed verification</p>
                </div>
                <div className="p-3 bg-rose-600 rounded-xl shadow-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">ETB processed</p>
                </div>
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bank Transfer Instructions */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Building className="h-6 w-6 text-white" />
              </div>
              Ethiopian Bank Transfer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-white">Commercial Bank of Ethiopia</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-indigo-200" />
                    <span className="text-indigo-100 text-sm">Account:</span>
                    <span className="font-semibold">1000123456789</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-200" />
                    <span className="text-indigo-100 text-sm">Name:</span>
                    <span className="font-semibold">BrokerPlatform Ltd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-indigo-200" />
                    <span className="text-indigo-100 text-sm">Branch:</span>
                    <span className="font-semibold">Addis Ababa Main</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-white">Dashen Bank</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-indigo-200" />
                    <span className="text-indigo-100 text-sm">Account:</span>
                    <span className="font-semibold">0987654321012</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-200" />
                    <span className="text-indigo-100 text-sm">Name:</span>
                    <span className="font-semibold">BrokerPlatform Ltd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-indigo-200" />
                    <span className="text-indigo-100 text-sm">Branch:</span>
                    <span className="font-semibold">Bole Branch</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deposits List */}
        {deposits.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <DollarSign className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No deposits yet</h3>
              <p className="text-gray-600 text-lg">Bank transfer submissions will appear here when brokers make deposits</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {deposits.map((deposit) => (
              <Card key={deposit.id} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                          <DollarSign className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-1">{deposit.broker.name}</h3>
                              <p className="text-gray-600">{deposit.broker.email}</p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-3xl font-bold text-gray-900 mb-2">
                                {Number(deposit.amount).toLocaleString()} {deposit.currency}
                              </p>
                              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                                deposit.status === "PAID" 
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : deposit.status === "PENDING"
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : "bg-rose-100 text-rose-700 border border-rose-200"
                              }`}>
                                {deposit.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Submitted</span>
                          </div>
                          <p className="font-semibold text-gray-900">{formatDate(deposit.createdAt)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium text-gray-700">Bank</span>
                          </div>
                          <p className="font-semibold text-gray-900">{deposit.bankName || "Not specified"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Hash className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Reference</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{deposit.bankReference || "Not provided"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">Transaction ID</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{deposit.transactionId || "Not provided"}</p>
                        </div>
                      </div>

                      {deposit.adminNotes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-semibold text-blue-900 mb-1">Admin Notes</p>
                              <p className="text-blue-800">{deposit.adminNotes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 lg:w-48">
                      {deposit.receiptUrl && (
                        <Button variant="outline" className="h-12 border-2 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200">
                          <FileText className="h-4 w-4 mr-2" />
                          View Receipt
                        </Button>
                      )}
                      
                      {deposit.status === "PENDING" && (
                        <>
                          <Button className="h-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verify Payment
                          </Button>
                          <Button variant="destructive" className="h-12 shadow-lg hover:shadow-xl transition-all duration-200">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
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