"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

interface ReceiptData {
  receiptNumber: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  projectDescription?: string;
  paymentAmount: number;
  paymentMethod: string;
  utrNumber: string;
  paymentDate: string;
  verifiedAt: string;
  verifiedBy: string;
  relatedEmis: Array<{
    emiNumber: number;
    emiAmount: number;
  }>;
  previousBalance: number;
  amountPaid: number;
  remainingBalance: number;
  status: string;
  receiptGeneratedAt: string;
}

export default function PaymentReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.paymentId as string;

  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paymentId) {
      fetchReceipt();
    }
  }, [paymentId]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/payments/receipt/${paymentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReceipt(response.data.receipt);
    } catch (error: any) {
      console.error("Error fetching receipt:", error);
      toast.error(error.response?.data?.message || "Failed to load receipt");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable version
    const printWindow = window.open("", "_blank");
    if (printWindow && receipt) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt ${receipt.receiptNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              .receipt { max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 40px; }
              .logo { font-size: 32px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
              .receipt-number { font-size: 18px; color: #666; }
              .section { margin-bottom: 30px; }
              .section-title { font-size: 14px; color: #666; margin-bottom: 10px; text-transform: uppercase; }
              .detail { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .label { color: #666; }
              .value { font-weight: bold; }
              .amount-box { background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .amount-label { color: #666; font-size: 14px; margin-bottom: 5px; }
              .amount-value { font-size: 36px; font-weight: bold; color: #10b981; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
              @media print {
                body { padding: 20px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="logo">CODELURA</div>
                <div class="receipt-number">Payment Receipt #${receipt.receiptNumber}</div>
              </div>

              <div class="section">
                <div class="section-title">Client Information</div>
                <div class="detail">
                  <span class="label">Name:</span>
                  <span class="value">${receipt.clientName}</span>
                </div>
                <div class="detail">
                  <span class="label">Email:</span>
                  <span class="value">${receipt.clientEmail}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Project Information</div>
                <div class="detail">
                  <span class="label">Project:</span>
                  <span class="value">${receipt.projectName}</span>
                </div>
                ${receipt.projectDescription ? `<div class="detail"><span class="label">Description:</span><span class="value">${receipt.projectDescription}</span></div>` : ""}
              </div>

              <div class="amount-box">
                <div class="amount-label">Amount Paid</div>
                <div class="amount-value">${formatCurrency(receipt.paymentAmount)}</div>
              </div>

              <div class="section">
                <div class="section-title">Payment Details</div>
                <div class="detail">
                  <span class="label">Payment Method:</span>
                  <span class="value">${receipt.paymentMethod}</span>
                </div>
                <div class="detail">
                  <span class="label">UTR/Transaction ID:</span>
                  <span class="value">${receipt.utrNumber}</span>
                </div>
                <div class="detail">
                  <span class="label">Payment Date:</span>
                  <span class="value">${formatDateTime(receipt.paymentDate)}</span>
                </div>
                <div class="detail">
                  <span class="label">Verified Date:</span>
                  <span class="value">${formatDateTime(receipt.verifiedAt)}</span>
                </div>
              </div>

              ${receipt.relatedEmis && receipt.relatedEmis.length > 0 ? `
              <div class="section">
                <div class="section-title">Allocated to EMIs</div>
                ${receipt.relatedEmis.map((emi) => `
                  <div class="detail">
                    <span class="label">EMI #${emi.emiNumber}:</span>
                    <span class="value">${formatCurrency(emi.emiAmount)}</span>
                  </div>
                `).join("")}
              </div>
              ` : ""}

              <div class="section">
                <div class="section-title">Payment Summary</div>
                <div class="detail">
                  <span class="label">Previous Balance:</span>
                  <span class="value">${formatCurrency(receipt.previousBalance)}</span>
                </div>
                <div class="detail">
                  <span class="label">Amount Paid:</span>
                  <span class="value" style="color: #10b981;">${formatCurrency(receipt.amountPaid)}</span>
                </div>
                <div class="detail">
                  <span class="label">Remaining Balance:</span>
                  <span class="value" style="color: #f59e0b;">${formatCurrency(receipt.remainingBalance)}</span>
                </div>
              </div>

              <div class="footer">
                <p>This is a computer-generated receipt and does not require a signature.</p>
                <p>Generated on ${formatDateTime(receipt.receiptGeneratedAt)}</p>
                <p>Thank you for your payment!</p>
                <p style="margin-top: 20px; font-weight: bold;">CODELURA Technologies</p>
                <p>Email: contact@codelura.com | Website: www.codelura.com</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Receipt Not Found</h2>
          <p className="text-gray-600 mb-6">The requested receipt could not be found.</p>
          <button
            onClick={() => router.push("/payment-portal")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Payment Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons - Hidden on Print */}
        <div className="flex justify-between items-center mb-8 no-print">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>

        {/* Receipt */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-12 pb-8 border-b-2 border-gray-200">
            <div className="text-5xl font-bold text-blue-600 mb-3">CODELURA</div>
            <p className="text-gray-600 text-lg">Payment Receipt</p>
            <p className="text-3xl font-bold text-gray-900 mt-4">{receipt.receiptNumber}</p>
            <div className="mt-4 inline-block">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                ✓ PAID
              </span>
            </div>
          </div>

          {/* Client Information */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Client Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-semibold text-gray-900">{receipt.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-semibold text-gray-900">{receipt.clientEmail}</span>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Project Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Project</span>
                <span className="font-semibold text-gray-900">{receipt.projectName}</span>
              </div>
              {receipt.projectDescription && (
                <div>
                  <span className="text-gray-600 block mb-1">Description</span>
                  <p className="text-sm text-gray-700">{receipt.projectDescription}</p>
                </div>
              )}
            </div>
          </div>

          {/* Amount Paid - Highlighted */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 text-center mb-8">
            <p className="text-gray-600 mb-2">Amount Paid</p>
            <p className="text-5xl font-bold text-green-600">{formatCurrency(receipt.paymentAmount)}</p>
          </div>

          {/* Payment Details */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900">{receipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UTR/Transaction ID</span>
                <span className="font-mono font-semibold text-gray-900">{receipt.utrNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Date</span>
                <span className="font-semibold text-gray-900">{formatDateTime(receipt.paymentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verified Date</span>
                <span className="font-semibold text-gray-900">{formatDateTime(receipt.verifiedAt)}</span>
              </div>
            </div>
          </div>

          {/* Related EMIs */}
          {receipt.relatedEmis && receipt.relatedEmis.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Allocated to EMIs</h3>
              <div className="space-y-2">
                {receipt.relatedEmis.map((emi, index) => (
                  <div key={index} className="flex justify-between py-2 px-4 bg-blue-50 rounded-lg">
                    <span className="font-semibold text-blue-600">EMI #{emi.emiNumber}</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(emi.emiAmount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Previous Balance</span>
                <span className="font-semibold text-gray-900">{formatCurrency(receipt.previousBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-semibold text-green-600">{formatCurrency(receipt.amountPaid)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-gray-200">
                <span className="font-bold text-gray-900">Remaining Balance</span>
                <span className="font-bold text-orange-600">{formatCurrency(receipt.remainingBalance)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t-2 border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-2">
              This is a computer-generated receipt and does not require a signature.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Generated on {formatDateTime(receipt.receiptGeneratedAt)}
            </p>
            <p className="text-gray-600 mb-1">Thank you for your payment!</p>
            <div className="mt-6">
              <p className="font-bold text-gray-900 text-lg">CODELURA Technologies</p>
              <p className="text-sm text-gray-600 mt-2">
                Email: contact@codelura.com | Website: www.codelura.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
