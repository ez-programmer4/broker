"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InquiryForm({ propertyId }: { propertyId: number }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          propertyId,
          customerId: session?.user ? parseInt((session.user as any).id) : null,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ ...formData, message: "" });
      }
    } catch (error) {
      console.error("Failed to send inquiry");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 font-medium">Inquiry sent successfully!</p>
        <p className="text-sm text-gray-600 mt-1">The broker will contact you soon.</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => setSuccess(false)}
        >
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <textarea
        placeholder="Your message..."
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md resize-none"
        rows={4}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}