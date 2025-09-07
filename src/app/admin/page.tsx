import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Building, DollarSign, AlertCircle, CheckCircle, Clock, TrendingUp, Activity } from "lucide-react";

export default async function AdminDashboard() {
  const stats = {
    totalBrokers: await prisma.user.count({ where: { role: "BROKER" } }),
    pendingBrokers: await prisma.brokerProfile.count({ where: { approvedByAdmin: false } }),
    activeBrokers: await prisma.brokerProfile.count({ where: { approvedByAdmin: true, active: true } }),
    totalProperties: await prisma.property.count(),
    activeProperties: await prisma.property.count({ where: { status: "ACTIVE" } }),
    pendingDeposits: await prisma.deposit.count({ where: { status: "PENDING" } }),
    totalDeposits: await prisma.deposit.count(),
    totalRevenue: await prisma.deposit.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true }
    }),
  };

  const recentBrokers = await prisma.user.findMany({
    where: { role: "BROKER" },
    include: { brokerProfile: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const pendingDeposits = await prisma.deposit.findMany({
    where: { status: "PENDING" },
    include: { broker: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Platform management and oversight</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Brokers</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalBrokers}</p>
                  <p className="text-xs text-blue-600 mt-1">Registered users</p>
                </div>
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 mb-1">Pending Approval</p>
                  <p className="text-3xl font-bold text-amber-900">{stats.pendingBrokers}</p>
                  <p className="text-xs text-amber-600 mt-1">Awaiting review</p>
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
                  <p className="text-sm font-medium text-emerald-700 mb-1">Active Properties</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.activeProperties}</p>
                  <p className="text-xs text-emerald-600 mt-1">Listed properties</p>
                </div>
                <div className="p-3 bg-emerald-600 rounded-xl shadow-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-rose-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-700 mb-1">Pending Deposits</p>
                  <p className="text-3xl font-bold text-rose-900">{stats.pendingDeposits}</p>
                  <p className="text-xs text-rose-600 mt-1">Needs verification</p>
                </div>
                <div className="p-3 bg-rose-600 rounded-xl shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Card */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium mb-2">Total Revenue</p>
                <p className="text-4xl font-bold">
                  ${stats.totalRevenue._sum.amount?.toLocaleString() || '0'}
                </p>
                <p className="text-indigo-200 text-sm mt-2">From {stats.totalDeposits} deposits</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Brokers */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Recent Broker Applications</CardTitle>
                </div>
                <Link href="/admin/brokers">
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentBrokers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No broker applications</p>
                  <p className="text-gray-400 text-sm">New applications will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBrokers.map((broker) => (
                    <div key={broker.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {broker.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{broker.name}</p>
                          <p className="text-sm text-gray-600">{broker.email}</p>
                          {broker.brokerProfile?.companyName && (
                            <p className="text-xs text-gray-500 font-medium">{broker.brokerProfile.companyName}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          broker.brokerProfile?.approvedByAdmin 
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}>
                          {broker.brokerProfile?.approvedByAdmin ? "Approved" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Deposits */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Pending Bank Transfers</CardTitle>
                </div>
                <Link href="/admin/deposits">
                  <Button variant="outline" size="sm" className="hover:bg-amber-50 hover:border-amber-300 transition-colors">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {pendingDeposits.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No pending deposits</p>
                  <p className="text-gray-400 text-sm">New transfers will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingDeposits.map((deposit) => (
                    <div key={deposit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{deposit.broker.name}</p>
                          <p className="text-sm font-medium text-gray-700">${Number(deposit.amount)} {deposit.currency}</p>
                          {deposit.bankName && (
                            <p className="text-xs text-gray-500 font-medium">{deposit.bankName}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          {new Date(deposit.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Activity className="h-5 w-5 text-indigo-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/brokers" className="group">
                <Button variant="outline" className="w-full justify-start h-16 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group-hover:shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Manage Brokers</p>
                      <p className="text-xs text-gray-500">Review applications</p>
                    </div>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/deposits" className="group">
                <Button variant="outline" className="w-full justify-start h-16 border-2 hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 group-hover:shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Review Deposits</p>
                      <p className="text-xs text-gray-500">Verify transfers</p>
                    </div>
                  </div>
                </Button>
              </Link>
              <Link href="/properties" className="group">
                <Button variant="outline" className="w-full justify-start h-16 border-2 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group-hover:shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <Building className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">View Properties</p>
                      <p className="text-xs text-gray-500">Browse listings</p>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}