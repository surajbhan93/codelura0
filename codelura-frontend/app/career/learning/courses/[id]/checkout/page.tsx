"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {

  const { id } = useParams();
  const router = useRouter();

  const [course,setCourse] = useState<any>(null);
  const [loading,setLoading] = useState(false);

  /* load course */
  useEffect(()=>{

    api.get(`/courses/${id}`)
    .then(res=>{
      setCourse(res.data.course);
    });

  },[id]);



  /* PAYMENT */
  const handlePayment = async () => {

    try{

      setLoading(true);

      const {data} = await api.post("/payment/course/create-order",{
        courseId:id
      });

      const order = data.order;

      const options = {

        key:data.key,
        amount:order.amount,
        currency:order.currency,
        name:"Codelura",
        description:course.title,
        order_id:order.id,

        handler: async function(response:any){

          try{

            await api.post("/payment/course/verify-payment",{

              razorpay_order_id:response.razorpay_order_id,
              razorpay_payment_id:response.razorpay_payment_id,
              razorpay_signature:response.razorpay_signature,
              courseId:id

            });

            toast.success("Payment successful 🎉");

            router.push(`/courses/${id}?purchased=true`);

          }catch(err){

            console.error(err);
            toast.error("Payment verification failed");

          }

        },

        theme:{
          color:"#f59e0b"
        }

      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    }catch(err){

      toast.error("Payment initialization failed");

    }finally{

      setLoading(false);

    }

  };



  if(!course){

    return <div className="text-white p-10">Loading...</div>

  }



  return (

    <div className="flex min-h-screen items-center justify-center bg-[#0c0b09] text-white">

      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 text-center">

        <h1 className="mb-3 text-xl font-bold">
          {course.title}
        </h1>

        <p className="mb-6 text-zinc-400">
          One-time purchase • Lifetime access
        </p>

        <div className="mb-6 text-3xl font-bold text-amber-400">
          ₹{course.price}
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full rounded-full bg-amber-500 py-3 font-bold text-black"
        >
          {loading ? "Processing..." : `Pay ₹${course.price}`}
        </button>

      </div>

    </div>

  );

}