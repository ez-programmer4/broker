import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { MapPin, DollarSign, Home, Search, Filter, Building, User, Calendar } from "lucide-react";

interface SearchParams {
  search?: string;
  type?: string;
  city?: string;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { search, type, city } = searchParams;

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
      broker: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
              <Building className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Properties
              </h1>
              <p className="text-gray-600 text-lg">
                {properties.length} properties found
                {search && ` for "${search}"`}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Search */}
        <Card className="mb-12 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Search Properties</h2>
            </div>
            <form method="GET" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="search"
                    placeholder="Search properties..."
                    defaultValue={search}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="type"
                    defaultValue={type}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white appearance-none"
                  >
                    <option value="">All Property Types</option>
                    <option value="HOUSE">🏠 House</option>
                    <option value="APARTMENT">🏢 Apartment</option>
                    <option value="LAND">🌍 Land</option>
                    <option value="COMMERCIAL">🏪 Commercial</option>
                  </select>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="city"
                    placeholder="Enter city name..."
                    defaultValue={city}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  <Search className="h-4 w-4 mr-2 inline" />
                  Search Properties
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {properties.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Home className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 text-lg mb-6">Try adjusting your search criteria or browse all properties</p>
              <Link 
                href="/properties" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                <Building className="h-4 w-4 mr-2" />
                View All Properties
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <Card className="group overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {property.images[0] ? (
                      <img
                        src={property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Home className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                        property.type === 'HOUSE' ? 'bg-emerald-500 text-white' :
                        property.type === 'APARTMENT' ? 'bg-blue-500 text-white' :
                        property.type === 'LAND' ? 'bg-amber-500 text-white' :
                        'bg-purple-500 text-white'
                      }`}>
                        {property.type === 'HOUSE' ? '🏠 House' :
                         property.type === 'APARTMENT' ? '🏢 Apartment' :
                         property.type === 'LAND' ? '🌍 Land' :
                         '🏪 Commercial'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1 bg-emerald-100 rounded-lg">
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="font-bold text-2xl text-gray-900">
                        {formatPrice(Number(property.price), property.currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{property.city}, {property.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <User className="h-3 w-3" />
                      <span>Listed by: {property.broker.name || "Broker"}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}