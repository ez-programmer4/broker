import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { MapPin, DollarSign, Home, Users, Shield, Star, ArrowRight, CheckCircle, TrendingUp } from "lucide-react";

export default async function HomePage() {
  // Get featured properties
  const properties = await prisma.property.findMany({
    where: { status: "ACTIVE" },
    include: {
      images: true,
      broker: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  // Get platform stats
  const stats = {
    totalProperties: await prisma.property.count({ where: { status: "ACTIVE" } }),
    totalBrokers: await prisma.user.count({ where: { role: "BROKER" } }),
    totalUsers: await prisma.user.count(),
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Ethiopia&apos;s #1 Real Estate Platform</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Find Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Dream Property
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-blue-100/90 leading-relaxed font-light">
            Connect with Ethiopia&apos;s most trusted real estate brokers and discover premium properties 
            across Addis Ababa, Dire Dawa, and beyond
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/properties">
              <Button size="lg" className="group bg-white text-slate-900 hover:bg-blue-50 text-lg px-10 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 text-lg px-10 py-4 rounded-2xl font-semibold backdrop-blur-sm transition-all duration-300">
                Join as Broker
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">Verified Brokers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">Secure Transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Thousands Across Ethiopia
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join Ethiopia&apos;s fastest-growing real estate community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-3xl p-8 text-center group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <div className="relative">
                  <h3 className="text-5xl font-black text-slate-900 mb-2">
                    {stats.totalProperties}
                    <span className="text-2xl text-blue-600">+</span>
                  </h3>
                  <p className="text-slate-600 font-semibold text-lg">Premium Properties</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Growing daily</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-3xl p-8 text-center group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="relative">
                  <h3 className="text-5xl font-black text-slate-900 mb-2">
                    {stats.totalBrokers}
                    <span className="text-2xl text-green-600">+</span>
                  </h3>
                  <p className="text-slate-600 font-semibold text-lg">Verified Brokers</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">100% Verified</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-3xl p-8 text-center group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="relative">
                  <h3 className="text-5xl font-black text-slate-900 mb-2">
                    {stats.totalUsers}
                    <span className="text-2xl text-purple-600">+</span>
                  </h3>
                  <p className="text-slate-600 font-semibold text-lg">Happy Customers</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-slate-600 font-medium">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Star className="h-4 w-4" />
              <span>Premium Collection</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Featured Properties
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Handpicked premium properties from Ethiopia&apos;s most trusted real estate professionals. 
              Each property is verified and comes with our quality guarantee.
            </p>
          </div>
          
          {properties.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-gray-500">
                <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No properties available yet.</p>
                <p className="text-sm mt-2">Be the first broker to list a property!</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer border-0 shadow-lg bg-white rounded-3xl">
                    <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                      {property.images[0] ? (
                        <Image 
                          src={property.images[0].url} 
                          alt={property.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-125"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                          <Home className="h-20 w-20 text-blue-300" />
                        </div>
                      )}
                      
                      {/* Property Type Badge */}
                      <div className="absolute top-6 right-6">
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-xl backdrop-blur-sm">
                          {property.type}
                        </span>
                      </div>
                      
                      {/* Featured Badge */}
                      {index < 3 && (
                        <div className="absolute top-6 left-6">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            <Star className="h-3 w-3 fill-current" />
                            <span>FEATURED</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-4 left-4 right-4">
                          <Button className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all duration-300">
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-8">
                      <h3 className="font-black text-2xl mb-4 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        {property.title}
                      </h3>
                      <p className="text-slate-600 mb-6 leading-relaxed line-clamp-2">
                        {property.description}
                      </p>
                      
                      {/* Price */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <span className="font-black text-3xl text-slate-900">
                            {formatPrice(Number(property.price), property.currency)}
                          </span>
                          <p className="text-sm text-slate-500 font-medium">Total Price</p>
                        </div>
                      </div>
                      
                      {/* Location & Broker */}
                      <div className="space-y-3 border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-3 text-slate-600">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold">{property.city}, {property.state}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Listed by {property.broker.name}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          {properties.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/properties">
                <Button variant="outline" size="lg">
                  View All Properties
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm font-semibold">Join 10,000+ Users</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Ready to Get Started?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-16 text-blue-100/90 max-w-4xl mx-auto leading-relaxed font-light">
            Join Ethiopia&apos;s most trusted real estate platform. Whether you&apos;re buying your dream home 
            or growing your brokerage business, we&apos;re here to help you succeed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
            <Link href="/register">
              <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-12 py-6 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                Start as Broker
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/properties">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 text-lg px-12 py-6 rounded-2xl font-bold backdrop-blur-sm transition-all duration-300">
                Explore Properties
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-lg mb-1">Verified Listings</h4>
                <p className="text-blue-200/80 text-sm">Every property is verified by our team</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-lg mb-1">Secure Transactions</h4>
                <p className="text-blue-200/80 text-sm">Bank-grade security for all payments</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-lg mb-1">Expert Support</h4>
                <p className="text-blue-200/80 text-sm">24/7 customer support in Amharic & English</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}