"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

interface Project {
  _id: string;
  projectName: string;
  projectDescription: string;
  totalProjectAmount: number;
  emiAmount: number;
  numberOfEmis: number;
  emiStartDate: string;
  emiFrequency: string;
  createdAt: string;
  userId?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface EMI {
  emiNumber: number;
  emiAmount: number;
  dueDate: string;
  status: string;
}

interface Client {
  name: string;
  email: string;
  phone: string;
}

export default function EMIAgreementPage() {
  const params = useParams();
  const router = useRouter();
  const agreementRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [emis, setEmis] = useState<EMI[]>([]);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchAgreementData();
  }, []);

  const downloadPDF = async () => {
    if (!agreementRef.current || !project) return;

    setDownloading(true);
    try {
      // Scroll to top
      window.scrollTo(0, 0);
      
      // Wait for fonts and images to load
      await document.fonts.ready;
      
      // Create a style element with PDF-safe color overrides
      const pdfStylesheet = document.createElement('style');
      pdfStylesheet.id = 'pdf-safe-colors';
      pdfStylesheet.textContent = `
        .pdf-rendering,
        .pdf-rendering * {
          /* Override all CSS variables with actual RGB values */
          background-image: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        
        /* Force solid colors for common background classes */
        .pdf-rendering .bg-blue-600,
        .pdf-rendering .bg-gradient-to-r,
        .pdf-rendering .bg-gradient-to-br,
        .pdf-rendering .pdf-header { background-color: rgb(37, 99, 235) !important; background-image: none !important; }
        .pdf-rendering .bg-green-600 { background-color: rgb(22, 163, 74) !important; }
        .pdf-rendering .bg-purple-600 { background-color: rgb(147, 51, 234) !important; }
        .pdf-rendering .bg-orange-600 { background-color: rgb(234, 88, 12) !important; }
        .pdf-rendering .bg-blue-50 { background-color: rgb(239, 246, 255) !important; }
        .pdf-rendering .bg-purple-50 { background-color: rgb(250, 245, 255) !important; }
        .pdf-rendering .bg-yellow-50 { background-color: rgb(254, 252, 232) !important; }
        .pdf-rendering .bg-gray-50 { background-color: rgb(249, 250, 251) !important; }
        .pdf-rendering .bg-red-50 { background-color: rgb(254, 242, 242) !important; }
        .pdf-rendering .bg-green-50 { background-color: rgb(240, 253, 244) !important; }
        .pdf-rendering .bg-orange-50 { background-color: rgb(255, 247, 237) !important; }
        .pdf-rendering .bg-indigo-50 { background-color: rgb(238, 242, 255) !important; }
        .pdf-rendering .bg-white { background-color: rgb(255, 255, 255) !important; }
        .pdf-rendering .bg-green-100 { background-color: rgb(220, 252, 231) !important; }
        .pdf-rendering .bg-green-800 { background-color: rgb(22, 101, 52) !important; }
        .pdf-rendering .bg-yellow-100 { background-color: rgb(254, 249, 195) !important; }
        .pdf-rendering .bg-yellow-800 { background-color: rgb(133, 77, 14) !important; }
        .pdf-rendering .bg-gray-100 { background-color: rgb(243, 244, 246) !important; }
        .pdf-rendering .bg-gray-700 { background-color: rgb(55, 65, 81) !important; }
        .pdf-rendering .bg-blue-100 { background-color: rgb(219, 234, 254) !important; }
        .pdf-rendering .bg-purple-100 { background-color: rgb(243, 232, 255) !important; }
        
        /* Text colors */
        .pdf-rendering .text-white { color: rgb(255, 255, 255) !important; }
        .pdf-rendering .text-blue-600 { color: rgb(37, 99, 235) !important; }
        .pdf-rendering .text-blue-900 { color: rgb(30, 58, 138) !important; }
        .pdf-rendering .text-gray-900 { color: rgb(17, 24, 39) !important; }
        .pdf-rendering .text-gray-800 { color: rgb(31, 41, 55) !important; }
        .pdf-rendering .text-gray-700 { color: rgb(55, 65, 81) !important; }
        .pdf-rendering .text-gray-600 { color: rgb(75, 85, 99) !important; }
        .pdf-rendering .text-gray-500 { color: rgb(107, 114, 128) !important; }
        .pdf-rendering .text-purple-900 { color: rgb(88, 28, 135) !important; }
        .pdf-rendering .text-green-900 { color: rgb(20, 83, 45) !important; }
        .pdf-rendering .text-green-800 { color: rgb(22, 101, 52) !important; }
        .pdf-rendering .text-red-900 { color: rgb(127, 29, 29) !important; }
        .pdf-rendering .text-red-800 { color: rgb(153, 27, 27) !important; }
        .pdf-rendering .text-orange-900 { color: rgb(124, 45, 18) !important; }
        .pdf-rendering .text-indigo-900 { color: rgb(49, 46, 129) !important; }
        .pdf-rendering .text-blue-100 { color: rgb(219, 234, 254) !important; }
        .pdf-rendering .text-yellow-800 { color: rgb(133, 77, 14) !important; }
        
        /* Border colors */
        .pdf-rendering .border-blue-200 { border-color: rgb(191, 219, 254) !important; }
        .pdf-rendering .border-purple-200 { border-color: rgb(233, 213, 255) !important; }
        .pdf-rendering .border-yellow-400 { border-color: rgb(250, 204, 21) !important; }
        .pdf-rendering .border-gray-200 { border-color: rgb(229, 231, 235) !important; }
        .pdf-rendering .border-gray-300 { border-color: rgb(209, 213, 219) !important; }
        .pdf-rendering .border-gray-400 { border-color: rgb(156, 163, 175) !important; }
        .pdf-rendering .border-blue-100 { border-color: rgb(219, 234, 254) !important; }
        .pdf-rendering .border-blue-300 { border-color: rgb(147, 197, 253) !important; }
        .pdf-rendering .border-purple-300 { border-color: rgb(216, 180, 254) !important; }
        .pdf-rendering .border-blue-500 { border-color: rgb(59, 130, 246) !important; }
        .pdf-rendering .border-red-600 { border-color: rgb(220, 38, 38) !important; }
        .pdf-rendering .border-purple-500 { border-color: rgb(168, 85, 247) !important; }
        .pdf-rendering .border-green-500 { border-color: rgb(34, 197, 94) !important; }
        .pdf-rendering .border-green-300 { border-color: rgb(134, 239, 172) !important; }
        .pdf-rendering .border-orange-500 { border-color: rgb(249, 115, 22) !important; }
        .pdf-rendering .border-indigo-500 { border-color: rgb(99, 102, 241) !important; }
        .pdf-rendering .border-gray-500 { border-color: rgb(107, 114, 128) !important; }
        
        /* Watermark - ensure it stays visible */
        .pdf-rendering .watermark-text {
          color: rgba(59, 130, 246, 0.06) !important;
        }
      `;
      document.head.appendChild(pdfStylesheet);
      
      // Clone the agreement element
      const clonedElement = agreementRef.current.cloneNode(true) as HTMLElement;
      
      // Add PDF rendering class
      clonedElement.classList.add('pdf-rendering');
      
      // Append clone to body (hidden but rendered)
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = agreementRef.current.offsetWidth + 'px';
      document.body.appendChild(clonedElement);
      
      // Hide no-print elements
      const noPrintElements = clonedElement.querySelectorAll('.no-print');
      noPrintElements.forEach((el: any) => {
        el.style.setProperty('display', 'none', 'important');
      });
      
      // Wait for styles to be applied
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Create canvas
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        removeContainer: false,
      });

      // Cleanup
      document.body.removeChild(clonedElement);
      document.head.removeChild(pdfStylesheet);

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate PDF dimensions (A4)
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add additional pages if content is longer
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      // Generate filename
      const projectName = project.projectName.replace(/[^a-zA-Z0-9]/g, '_');
      const date = new Date().toISOString().split('T')[0];
      const fileName = `Codelura_EMI_Agreement_${projectName}_${date}.pdf`;
      
      // Download
      pdf.save(fileName);
      
    } catch (error: any) {
      console.error('PDF Generation Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert(`Failed to generate PDF: ${error.message || 'Unknown error'}\n\nPlease try again or contact support if the issue persists.`);
    } finally {
      setDownloading(false);
    }
  };

  const fetchAgreementData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      console.log("Fetching agreement for project:", params.projectId);
      
      const response = await axios.get(
        `${API_BASE_URL}/api/payments/project/${params.projectId}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );

      console.log("Agreement data received:", response.data);

      const projectData = response.data.projectPayment;
      setProject(projectData);
      setEmis(response.data.emis || []);
      
      // Extract client info from populated userId
      if (projectData?.userId) {
        setClient({
          name: projectData.userId.name || "N/A",
          email: projectData.userId.email || "N/A",
          phone: projectData.userId.phone || "N/A",
        });
      } else {
        // Fallback if userId not populated
        setClient({
          name: "Client Name",
          email: "email@example.com",
          phone: "+91-XXXXXXXXXX",
        });
      }
    } catch (error: any) {
      console.error("Error fetching agreement data:", error);
      if (error.code === 'ECONNABORTED') {
        alert("Request timeout - Server is taking too long to respond");
      } else if (error.response) {
        alert(`Error: ${error.response.data?.message || "Failed to load agreement"}`);
      } else {
        alert("Network error - Please check your connection");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-2">Loading EMI Agreement...</p>
          <p className="text-sm text-gray-600">Fetching project and payment details</p>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-2">Agreement Not Found</p>
          <p className="text-sm text-gray-600 mb-6">Unable to load agreement details. Please try again.</p>
          <button
            onClick={() => router.push("/payment-portal")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Payment Portal
          </button>
        </div>
      </div>
    );
  }

  const agreementDate = new Date().toLocaleDateString("en-IN");
  const agreementNumber = `CL-AGR-${project._id.slice(-6).toUpperCase()}`;

  return (
    <>
      {/* Download Button - Fixed position */}
      <div className="no-print fixed top-6 right-6 z-50">
        <button
          onClick={downloadPDF}
          disabled={downloading || loading}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Agreement Document */}
      <div ref={agreementRef} className="max-w-5xl mx-auto bg-white p-8 md:p-12 my-8 shadow-2xl rounded-lg relative overflow-hidden">
        {/* Watermark */}
        <div className="watermark-text">CODELURA</div>

        {/* Header with gradient background */}
        <div className="pdf-header bg-blue-600 rounded-t-lg -mx-8 -mt-8 md:-mx-12 md:-mt-12 px-8 md:px-12 py-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-3 tracking-tight">CODELURA</h1>
              <p className="text-blue-100 font-medium mb-1">Software Development & IT Solutions</p>
              <p className="text-blue-100 text-sm mb-1">MSME Registered | PAN: FEAPB0562K</p>
              <p className="text-blue-100 text-sm mb-1">📍 Sector 62, Noida, Uttar Pradesh</p>
              <p className="text-blue-100 text-sm">📧 finance@codelura.com | 📞 +91-9336289192</p>
            </div>
            <div className="text-right">
              <div className="bg-white px-6 py-3 rounded-xl shadow-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Agreement No.</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{agreementNumber}</p>
              </div>
              <p className="text-xs text-blue-100 mt-3 font-medium">Date: {agreementDate}</p>
            </div>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center mb-10">
          <div className="inline-block">
            <h2 className="text-4xl font-bold text-blue-600 mb-3">
              EMI PAYMENT AGREEMENT
            </h2>
            <div className="h-1 bg-blue-600 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600 mt-4 font-medium">
            📋 This agreement is made under RBI Guidelines for Digital Lending
          </p>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="border-2 border-blue-200 bg-blue-50/50 rounded-xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-blue-900 mb-4 uppercase border-b-2 border-blue-300 pb-3 flex items-center gap-2">
              <span className="text-lg">🏢</span> Service Provider (First Party)
            </h3>
            <p className="text-lg font-bold text-gray-900">Codelura Inc.</p>
            <div className="mt-3 space-y-1.5 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">📍 Address:</span>
                <span>Sector 62, Noida, UP</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">🆔 PAN:</span>
                <span className="font-mono">FEAPB0562K</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">🏭 MSME:</span>
                <span>Registered under MSME Act</span>
              </p>
            </div>
          </div>

          <div className="border-2 border-purple-200 bg-purple-50/50 rounded-xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-purple-900 mb-4 uppercase border-b-2 border-purple-300 pb-3 flex items-center gap-2">
              <span className="text-lg">👤</span> Client (Second Party)
            </h3>
            <p className="text-lg font-bold text-gray-900">{client?.name}</p>
            <div className="mt-3 space-y-1.5 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">📧 Email:</span>
                <span>{client?.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">📞 Phone:</span>
                <span>{client?.phone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="text-blue-600">📁</span>
            PROJECT DETAILS
          </h3>
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-100 rounded-xl p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Project Name</p>
                <p className="text-lg font-bold text-gray-900">{project.projectName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Project Start Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(project.createdAt)}</p>
              </div>
              {project.projectDescription && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{project.projectDescription}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="text-green-600">💰</span>
            FINANCIAL DETAILS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-600 rounded-xl p-5 shadow-lg">
              <p className="text-xs text-blue-100 mb-2 uppercase tracking-wide font-semibold">Total Amount</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(project.totalProjectAmount)}</p>
            </div>
            <div className="bg-green-600 rounded-xl p-5 shadow-lg">
              <p className="text-xs text-green-100 mb-2 uppercase tracking-wide font-semibold">EMI Amount</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(project.emiAmount)}</p>
            </div>
            <div className="bg-purple-600 rounded-xl p-5 shadow-lg">
              <p className="text-xs text-purple-100 mb-2 uppercase tracking-wide font-semibold">Number of EMIs</p>
              <p className="text-2xl font-bold text-white">{project.numberOfEmis}</p>
            </div>
            <div className="bg-orange-600 rounded-xl p-5 shadow-lg">
              <p className="text-xs text-orange-100 mb-2 uppercase tracking-wide font-semibold">Frequency</p>
              <p className="text-2xl font-bold text-white capitalize">{project.emiFrequency}</p>
            </div>
          </div>
        </div>

        {/* EMI Schedule */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="text-purple-600">📅</span>
            EMI PAYMENT SCHEDULE
          </h3>
          <div className="overflow-x-auto rounded-xl border-2 border-gray-200 shadow-md">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">EMI No.</th>
                  <th className="px-6 py-4 text-left font-bold">Due Date</th>
                  <th className="px-6 py-4 text-right font-bold">Amount</th>
                  <th className="px-6 py-4 text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {emis.map((emi, index) => (
                  <tr key={emi.emiNumber} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="px-6 py-4 font-bold text-gray-900">EMI #{emi.emiNumber}</td>
                    <td className="px-6 py-4 text-gray-700">{formatDate(emi.dueDate)}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(emi.emiAmount)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        emi.status === 'PAID' ? 'bg-green-100 text-green-800 border border-green-300' :
                        emi.status === 'PARTIALLY_PAID' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                        'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}>
                        {emi.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="text-orange-600">📋</span>
            TERMS & CONDITIONS
          </h3>
          <div className="space-y-5 text-sm text-gray-800">
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-5 shadow-sm">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-base">
                💳 1. Payment Terms
              </h4>
              <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-blue-900">
                <li>EMIs must be paid on or before the due date mentioned in the schedule above.</li>
                <li>Payment can be made via UPI, Bank Transfer, or QR Code scan.</li>
                <li>Each payment must include UTR/Transaction ID and proof of payment.</li>
                <li>All payments are subject to verification by Codelura admin team.</li>
              </ul>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 rounded-r-lg p-5 shadow-md">
              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-base">
                ⚠️ 2. Late Payment Penalty (RBI Guidelines Compliant)
              </h4>
              <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-red-800">
                <li><strong className="text-red-900">₹150 penalty</strong> will be charged for each EMI paid after the due date.</li>
                <li>Penalty will be automatically added to the next EMI or final payment.</li>
                <li>Consistent late payments may affect your credit eligibility for future projects.</li>
                <li>After 30 days of non-payment, legal action may be initiated as per Indian Contract Act, 1872.</li>
              </ul>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-lg p-5 shadow-sm">
              <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2 text-base">
                📊 3. Credit Score Impact
              </h4>
              <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-purple-900">
                <li>This is a financial agreement and may impact your credit score with Codelura.</li>
                <li>Timely payments will improve your credit standing for future projects.</li>
                <li>Defaults or consistent late payments will be recorded in our internal credit system.</li>
                <li>Good credit history may qualify you for better terms in future engagements.</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-5 shadow-sm">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-base">
                ✅ 4. Prepayment & Closure
              </h4>
              <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-green-900">
                <li>You may pay multiple EMIs or the full remaining amount at any time without penalty.</li>
                <li>No prepayment charges applicable as per RBI guidelines.</li>
                <li>Upon full payment, a completion certificate will be issued.</li>
              </ul>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-5 shadow-sm">
              <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2 text-base">
                ⚖️ 5. Default & Legal Action
              </h4>
              <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-orange-900">
                <li>Non-payment beyond 60 days will be treated as willful default.</li>
                <li>Legal proceedings under Indian Contract Act, 1872 may be initiated.</li>
                <li>Recovery costs and legal fees will be borne by the defaulting party.</li>
                <li>Jurisdiction: All disputes subject to Noida/Delhi NCR jurisdiction only.</li>
              </ul>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 shadow-sm">
              <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2 text-base">
                🏛️ 6. MSME & RBI Compliance
              </h4>
              <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-indigo-900">
                <li>This agreement complies with MSME Development Act, 2006.</li>
                <li>Interest on delayed payments as per MSME Act: 1.5% per month (if applicable).</li>
                <li>Digital lending guidelines as per RBI circular DOR.STR.REC.52/21.04.048/2022-23.</li>
                <li>All digital transactions are secure and RBI-compliant.</li>
              </ul>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-500 rounded-r-lg p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
                🤝 7. Dispute Resolution
              </h4>
              <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-gray-800">
                <li>Any disputes will first be resolved through mutual discussion.</li>
                <li>If unresolved, matter will be referred to arbitration under Arbitration Act, 1996.</li>
                <li>Arbitration will be conducted in Noida, Uttar Pradesh.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="mb-10 bg-yellow-50 border-3 border-yellow-400 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">✍️</span> DECLARATION
          </h3>
          <p className="text-sm text-gray-800 mb-6 leading-relaxed font-medium">
            I, <strong className="text-gray-900 text-base">{client?.name}</strong>, hereby acknowledge and agree to the above terms and conditions. 
            I understand that failure to comply with the EMI schedule may result in penalties and legal action. 
            I have read and understood all clauses mentioned in this agreement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-6 border-t-2 border-yellow-400">
            <div className="bg-white rounded-lg p-5 shadow-md">
              <p className="text-xs text-gray-600 mb-3 uppercase tracking-wide font-semibold">Client Signature</p>
              <div className="border-b-2 border-gray-400 h-16 mb-3"></div>
              <p className="text-sm font-bold text-gray-900">{client?.name}</p>
              <p className="text-xs text-gray-500">Client</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-md">
              <p className="text-xs text-gray-600 mb-3 uppercase tracking-wide font-semibold">Codelura Authorized Signatory</p>
              <div className="h-16 mb-3 flex items-center justify-start border-b-2 border-gray-200">
                {/* SVG-based handwritten signature */}
                <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <style>{`
                      @import url('https://fonts.googleapis.com/css2?family=Allura&display=swap');
                    `}</style>
                  </defs>
                  <text 
                    x="10" 
                    y="40" 
                    fill="#1e40af" 
                    fontSize="32" 
                    fontFamily="'Allura', cursive"
                    fontWeight="400"
                    style={{
                      transform: 'rotate(-2deg)',
                      transformOrigin: 'center',
                      filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))'
                    }}
                  >
                    Suraj Bhan
                  </text>
                  {/* Underline flourish */}
                  <path 
                    d="M 15 45 Q 80 50, 150 43" 
                    stroke="#1e40af" 
                    strokeWidth="1.5" 
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900">Suraj Bhan</p>
              <p className="text-xs text-gray-500">Director, Codelura Inc.</p>
              <p className="text-xs text-blue-600 mt-1 font-semibold">Digitally Signed</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm border-t-4 border-gradient-to-r from-blue-600 to-purple-600 pt-6 bg-gradient-to-br from-gray-50 to-blue-50 -mx-8 -mb-8 md:-mx-12 md:-mb-12 px-8 md:px-12 py-8 rounded-b-lg print:rounded-none print:-mx-8 print:-mb-8">
          <p className="font-bold text-gray-900 text-lg mb-2">CODELURA INC.</p>
          <p className="text-gray-700 font-medium mb-1">Software Development & IT Solutions | MSME Registered</p>
          <p className="text-gray-600 mb-1">📍 Sector 62, Noida, Uttar Pradesh | 🆔 PAN: FEAPB0562K</p>
          <p className="text-gray-600 mb-1">📧 finance@codelura.com | 📞 +91-9336289192</p>
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-500 mb-3">
              This is a digitally generated agreement. For any queries, please contact our finance team.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <p className="text-sm font-bold text-blue-900 bg-blue-100 px-4 py-2 rounded-lg">
                Agreement ID: {agreementNumber}
              </p>
              <p className="text-sm font-bold text-purple-900 bg-purple-100 px-4 py-2 rounded-lg">
                Generated: {agreementDate}
              </p>
              <p className="text-sm font-bold text-green-900 bg-green-100 px-4 py-2 rounded-lg flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Digitally Signed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Allura&display=swap');
        
        .no-print {
          display: block;
        }
        
        .watermark-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 140px;
          font-weight: 900;
          color: rgba(59, 130, 246, 0.06);
          z-index: 0;
          pointer-events: none;
          white-space: nowrap;
          letter-spacing: 0.1em;
          user-select: none;
        }
        
        /* Add gradient effect for screen only */
        .pdf-header {
          background: linear-gradient(to right, #2563EB, #7C3AED);
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .watermark-text {
            font-size: 180px;
            color: rgba(59, 130, 246, 0.08);
          }
          
          .pdf-header {
            background: #2563EB !important;
          }
          
          /* Page margins for PDF */
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>
    </>
  );
}
