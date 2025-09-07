"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Building, AlertCircle } from "lucide-react";

export default function BrokerDepositPage() {
  const [formData, setFormData] = useState({
    amount: "500",
    currency: "ETB",
    bankName: "",
    accountNumber: "",
    transactionId: "",
    bankReference: "",
    receiptUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/broker/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Failed to submit deposit");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Card className="text-center p-8">
            <div className="text-green-600 mb-4">
              <DollarSign className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Deposit Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your bank transfer details have been submitted for verification. 
              You will be notified once the payment is confirmed.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/broker")}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => setSuccess(false)}>
                Submit Another
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Broker Activation Deposit</h1>
          <p className="text-gray-600">Submit your bank transfer details for account activation</p>
        </div>

        {/* Bank Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Ethiopian Bank Transfer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Commercial Bank of Ethiopia (CBE)</h4>
                <p className="text-sm text-gray-600">Account Number: 1000123456789</p>
                <p className="text-sm text-gray-600">Account Name: BrokerPlatform Ltd</p>
                <p className="text-sm text-gray-600">Branch: Addis Ababa Main Branch</p>
                <p className="text-sm text-gray-600">Swift Code: CBETETAA</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Dashen Bank</h4>
                <p className="text-sm text-gray-600">Account Number: 0987654321012</p>
                <p className="text-sm text-gray-600">Account Name: BrokerPlatform Ltd</p>
                <p className="text-sm text-gray-600">Branch: Bole Branch</p>
                <p className="text-sm text-gray-600">Swift Code: DASHETTA</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Important Instructions:</p>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Transfer exactly 500 ETB to activate your broker account</li>
                    <li>• Keep your bank receipt/transaction confirmation</li>
                    <li>• Fill out the form below with accurate transfer details</li>
                    <li>• Verification typically takes 1-2 business days</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deposit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled
                  >
                    <option value="ETB">Ethiopian Birr (ETB)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Name *</label>
                  <select
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Bank</option>
                    <option value="Commercial Bank of Ethiopia">Commercial Bank of Ethiopia</option>
                    <option value="Dashen Bank">Dashen Bank</option>
                    <option value="Bank of Abyssinia">Bank of Abyssinia</option>
                    <option value="Awash Bank">Awash Bank</option>
                    <option value="United Bank">United Bank</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Account Number</label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="Your bank account number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Transaction ID *</label>
                  <Input
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    placeholder="Bank transaction reference"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Reference</label>
                  <Input
                    value={formData.bankReference}
                    onChange={(e) => setFormData({ ...formData, bankReference: e.target.value })}
                    placeholder="Additional reference number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Receipt/Proof (Optional)</label>
                <Input
                  value={formData.receiptUrl}
                  onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                  placeholder="Upload receipt image URL or file path"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can upload your receipt image to a cloud service and paste the link here
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Deposit Details"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}