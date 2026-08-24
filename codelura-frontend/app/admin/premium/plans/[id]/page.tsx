// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import api from "@/lib/api";
// import toast from "react-hot-toast";
// import PlanForm from "@/components/admin/premium/PlanForm";

// export default function EditPlanPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPlan = async () => {
//       try {
//         const res = await api.get(`/premium/admin/plan/${id}`);
//         setPlan(res.data.plan);
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Failed to load plan");
//         router.push("/admin/premium/plans");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchPlan();
//   }, [id, router]);

//   const handleUpdate = async (formData) => {
//     try {
//       await api.put(`/premium/admin/plan/${id}`, formData);
//       toast.success("Plan updated successfully!");
//       router.push("/admin/premium/plans");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//       throw err;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading plan...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!plan) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-600">Plan not found</p>
//         <button
//           onClick={() => router.push("/admin/premium/plans")}
//           className="mt-4 text-indigo-600 hover:text-indigo-800"
//         >
//           ← Back to Plans
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="flex items-center gap-4 mb-6">
//           <button
//             onClick={() => router.push("/admin/premium/plans")}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             ← Back
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900">Edit Plan</h1>
//           <span className="ml-auto text-sm text-gray-500">ID: {plan._id}</span>
//         </div>
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//           <PlanForm 
//             initialData={plan} 
//             planId={plan._id}  // ✅ Pass planId for auto-save
//             onSubmit={handleUpdate} 
//             submitLabel="Update Plan" 
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import PlanForm from "@/components/admin/premium/PlanForm";

interface Plan {
  _id: string;
  title: string;
  shortDescription?: string;
  description: string;
  price: number;
  discountedPrice?: number;
  durationInMonths?: number;
  isActive: boolean;
  // Add other fields as needed
}

export default function EditPlanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/premium/admin/plan/${id}`);
        setPlan(res.data.plan);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load plan");
        router.push("/admin/premium/plans");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPlan();
  }, [id, router]);

  const handleUpdate = async (formData: any) => {
    try {
      await api.put(`/premium/admin/plan/${id}`, formData);
      toast.success("Plan updated successfully!");
      router.push("/admin/premium/plans");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Plan not found</p>
        <button
          onClick={() => router.push("/admin/premium/plans")}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Plans
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/admin/premium/plans")}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Plan</h1>
          <span className="ml-auto text-sm text-gray-500">ID: {plan._id}</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <PlanForm 
            initialData={plan} 
            planId={plan._id}
            onSubmit={handleUpdate} 
            submitLabel="Update Plan" 
          />
        </div>
      </div>
    </div>
  );
}