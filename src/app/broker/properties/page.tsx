import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Building, Plus, Edit, Trash2 } from "lucide-react";

export default async function BrokerPropertiesPage() {
  const session = await getServerSession(authOptions);
  const brokerId = parseInt((session?.user as any)?.id);

  const properties = await prisma.property.findMany({
    where: { brokerId },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Properties</h1>
            <p className="text-gray-600">{properties.length} properties</p>
          </div>
          <Link href="/broker/properties/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <Card className="p-12 text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No properties yet</p>
            <p className="text-gray-600 mb-4">Start by adding your first property listing</p>
            <Link href="/broker/properties/new">
              <Button>Add Your First Property</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  {property.images[0] ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      property.status === "ACTIVE" 
                        ? "bg-green-600 text-white" 
                        : property.status === "PENDING"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {property.description}
                  </p>
                  <p className="font-bold text-lg mb-3">
                    {formatPrice(Number(property.price), property.currency)}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {property.city}, {property.state}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/broker/properties/${property.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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