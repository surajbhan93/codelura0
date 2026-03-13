// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import api from "@/lib/api";
// import toast from "react-hot-toast";

// interface Hackathon {
//   id: string;
//   registrationClosed: boolean;
//   isRegistered: boolean;
//   currentUser?: any;
// }

// export default function ParticipateButton({ hackathon }: { hackathon: Hackathon }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//    // IMPORTANT FIX
//   if (!hackathon) {
//     return null;
//   }
//   // Note: currentUser is passed for consistency with listing page requirements
// //   const user = hackathon.currentUser; 
// const user = hackathon?.currentUser;

//   const handleJoin = async () => {
//     // Prevent multiple clicks immediately
//     if (loading) return;
    
//     // If user is null, redirect to login
//     if (!user) {
//       toast.error("Please login to participate");
//       router.push("/auth/login");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await api.post("/participation/join", { hackathonId: hackathon.id });
      
//       if (res.data.success) {
//         toast.success("Successfully registered for the hackathon!");
//         router.refresh();
//         // Option: Smooth transition without full reload if supported by parent
//         // For now, reload ensures all components see the 'Registered' state
//         setTimeout(() => window.location.reload(), 1500); 
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to join");
//       setLoading(false);
//     }
//   };

//   if (hackathon.registrationClosed)
//     return (
//       <Button className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg" disabled>
//         Registration Closed
//       </Button>
//     );

//   if (hackathon.isRegistered)
//     return (
//       <Button className="w-full bg-green-100 text-green-600 py-2 rounded-lg hover:bg-green-100 cursor-default" disabled>
//         Registered
//       </Button>
//     );

//   return (
//     <Button
//       onClick={handleJoin}
//       disabled={loading}
//       className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
//     >
//       {loading ? "Joining..." : "Participate"}
//     </Button>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Hackathon {
  id: string;
  registrationClosed: boolean;
  isRegistered: boolean;
}

export default function ParticipateButton({ hackathon }: { hackathon: Hackathon }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!hackathon) return null;

  const handleJoin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await api.post("/participation/join", {
        hackathonId: hackathon.id,
      });

      if (res.data.success) {
        toast.success("Successfully registered for the hackathon!");
        router.refresh();
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please login first");
        router.push("/auth/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to join");
      }

      setLoading(false);
    }
  };

  if (hackathon.registrationClosed)
    return (
      <Button className="w-full bg-gray-300 text-gray-600" disabled>
        Registration Closed
      </Button>
    );

  if (hackathon.isRegistered)
    return (
      <Button className="w-full bg-green-100 text-green-600 cursor-default" disabled>
        Registered
      </Button>
    );

  return (
    <Button
      onClick={handleJoin}
      disabled={loading}
      className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
    >
      {loading ? "Joining..." : "Participate"}
    </Button>
  );
}