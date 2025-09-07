import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { InquiryForm } from "./inquiry-form";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { MapPin, DollarSign, Home, Calendar, User, Phone, Mail } from "lucide-react";

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id: parseInt(id) },
    include: {
      images: true,
      broker: {
        select: {
          name: true,
          email: true,
          brokerProfile: { select: { phone: true, companyName: true } },
        },
      },
    },
  });

  if (!property) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-6">
              {property.images.length > 0 ? (
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={property.images[0].url}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <Home className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{property.address || `${property.city}, ${property.state}`}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                    {property.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <span className="text-3xl font-bold">
                    {formatPrice(Number(property.price), property.currency)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Listed {formatDate(property.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Status:</span>
                      <span className="capitalize">{property.status.toLowerCase()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Broker Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Broker Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{property.broker.name}</p>
                    {property.broker.brokerProfile?.companyName && (
                      <p className="text-sm text-gray-600">
                        {property.broker.brokerProfile.companyName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{property.broker.email}</span>
                  </div>
                  {property.broker.brokerProfile?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{property.broker.brokerProfile.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Inquiry Form */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Broker</CardTitle>
              </CardHeader>
              <CardContent>
                <InquiryForm propertyId={property.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}