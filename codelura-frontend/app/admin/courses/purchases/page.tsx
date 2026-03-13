"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Purchase = {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  course: {
    title: string;
    price: number;
  };
  amount: number;
  razorpay_payment_id: string;
  createdAt: string;
};

export default function AdminPurchasesPage() {

  const [purchases,setPurchases] = useState<Purchase[]>([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    api.get("/payment/purchases")
    .then(res=>{
      setPurchases(res.data.purchases);
    })
    .finally(()=>{
      setLoading(false);
    })

  },[]);

  if(loading){
    return (
      <div className="p-10 text-center text-gray-500">
        Loading purchases...
      </div>
    )
  }

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Course Purchases
      </h1>

      <div className="overflow-x-auto border rounded-lg">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">

            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Course</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment ID</th>
              <th className="p-3">Date</th>
            </tr>

          </thead>

          <tbody>

            {purchases.map((p)=>(
              <tr key={p._id} className="border-t">

                <td className="p-3 font-medium">
                  {p.user?.name}
                </td>

                <td className="p-3 text-gray-600">
                  {p.user?.email}
                </td>

                <td className="p-3">
                  {p.course?.title}
                </td>

                <td className="p-3 font-semibold text-green-600">
                  ₹{p.amount}
                </td>

                <td className="p-3 text-xs text-gray-500">
                  {p.razorpay_payment_id}
                </td>

                <td className="p-3 text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}