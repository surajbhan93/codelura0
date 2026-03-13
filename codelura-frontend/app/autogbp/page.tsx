// "use client";

// import { useState } from "react";
// import api from "@/lib/api";
// import toast from "react-hot-toast";

// type Account = {
//   name: string;
//   accountName: string;
// };

// type Location = {
//   name: string;
//   title: string;
// };

// export default function AutoGBP() {

//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [locations, setLocations] = useState<Location[]>([]);

//   const [selectedAccount, setSelectedAccount] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState("");

//   const [topic, setTopic] = useState("");
//   const [post, setPost] = useState("");



//   // Connect Google
//   const connectGoogle = () => {

//     alert("Redirecting to Google Login...");

//     window.location.href =
//       "http://localhost:3000/api/google/auth";

//   };



//   // Fetch Accounts
//   const fetchAccounts = async () => {

//     try {

//       const res = await api.get("/google/accounts");

//       if (!res.data.data || res.data.data.length === 0) {

//         alert("No Google Business accounts found for this Gmail");

//         return;

//       }

//       setAccounts(res.data.data);

//       alert("Google Business accounts fetched successfully");

//     } catch (err) {

//       console.log(err);

//       alert("Failed to fetch accounts. Make sure Google is connected.");

//     }

//   };



//   // Fetch Locations
//   const fetchLocations = async (accountId: string) => {

//     try {

//       const res = await api.get(`/google/locations/${accountId}`);

//       if (!res.data.data || res.data.data.length === 0) {

//         alert("No locations found in this account");

//         return;

//       }

//       setLocations(res.data.data);

//       alert("Locations fetched successfully");

//     } catch (err) {

//       console.log(err);

//       alert("Failed to fetch locations");

//     }

//   };



//   // Save Settings
//   const saveSettings = async () => {

//     if (!selectedAccount || !selectedLocation) {

//       alert("Please select account and location");

//       return;

//     }

//     try {

//       await api.post("/autogbp/settings", {

//         accountId: selectedAccount.replace("accounts/", ""),

//         locations: [
//           {
//             city: "Selected Location",
//             locationId: selectedLocation.replace("locations/", "")
//           }
//         ]

//       });

//       alert("Settings saved successfully");

//     } catch {

//       alert("Failed to save settings");

//     }

//   };



//   // Generate AI Post
//   const generatePost = async () => {

//     if (!topic) {

//       alert("Enter a topic first");

//       return;

//     }

//     try {

//       const res = await api.post("/autogbp/generate", {
//         topic
//       });

//       setPost(res.data.data.postContent);

//       alert("AI Post generated successfully");

//     } catch {

//       alert("Failed to generate post");

//     }

//   };



//   // Run Auto Post
//   const runAutoPost = async () => {

//     try {

//       await api.get("/autogbp/run");

//       alert("Auto post executed successfully");

//     } catch {

//       alert("Auto post failed");

//     }

//   };



//   return (

//     <div className="max-w-3xl mx-auto p-8">

//       <h1 className="text-3xl font-bold mb-6">
//         AutoGBP AI
//       </h1>


//       {/* Connect Google */}

//       <button
//         onClick={connectGoogle}
//         className="bg-red-600 text-white px-6 py-2 rounded mb-6"
//       >
//         Connect Google Business
//       </button>


//       <button
//         onClick={fetchAccounts}
//         className="bg-blue-600 text-white px-6 py-2 rounded mb-6 ml-3"
//       >
//         Fetch Accounts
//       </button>



//       {/* Accounts */}

//       {accounts.length > 0 && (

//         <select
//           className="border p-3 w-full mb-4"
//           onChange={(e) => {

//             setSelectedAccount(e.target.value);

//             fetchLocations(e.target.value.replace("accounts/", ""));

//           }}
//         >

//           <option>Select Business Account</option>

//           {accounts.map((acc) => (

//             <option key={acc.name} value={acc.name}>
//               {acc.accountName}
//             </option>

//           ))}

//         </select>

//       )}



//       {/* Locations */}

//       {locations.length > 0 && (

//         <select
//           className="border p-3 w-full mb-6"
//           onChange={(e) => setSelectedLocation(e.target.value)}
//         >

//           <option>Select Location</option>

//           {locations.map((loc) => (

//             <option key={loc.name} value={loc.name}>
//               {loc.title}
//             </option>

//           ))}

//         </select>

//       )}



//       <button
//         onClick={saveSettings}
//         className="bg-green-600 text-white px-6 py-2 rounded mb-8"
//       >
//         Save Settings
//       </button>



//       {/* Generate Post */}

//       <div className="mb-6">

//         <input
//           value={topic}
//           onChange={(e) => setTopic(e.target.value)}
//           placeholder="Post topic"
//           className="border p-3 rounded w-full mb-3"
//         />

//         <button
//           onClick={generatePost}
//           className="bg-purple-600 text-white px-6 py-2 rounded"
//         >
//           Generate AI Post
//         </button>

//       </div>



//       {post && (

//         <div className="border p-4 rounded mb-6">

//           <h3 className="font-semibold mb-2">
//             Generated Post
//           </h3>

//           <p>{post}</p>

//         </div>

//       )}



//       <button
//         onClick={runAutoPost}
//         className="bg-orange-600 text-white px-6 py-2 rounded"
//       >
//         Run Auto Post
//       </button>

//     </div>

//   );

// }









"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

type Account = {
  name: string;
  accountName: string;
};

type Location = {
  name: string;
  title: string;
};

export default function AutoGBP() {

  const [connected, setConnected] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [topic, setTopic] = useState("");
  const [post, setPost] = useState("");
  const [loading,setLoading]=useState(false)


  // check if google already connected
  useEffect(() => {

  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const googleStatus = params.get("google");

  if (googleStatus === "connected") {

    setConnected(true);

    localStorage.setItem("googleConnected", "true");

  } else {

    const stored = localStorage.getItem("googleConnected");

    if (stored === "true") {
      setConnected(true);
    }

  }

}, []);


  // Connect Google
  const connectGoogle = () => {

    localStorage.setItem("googleConnected", "true");

    window.location.href =
      "http://localhost:3002/api/google/auth";

  };



  // Fetch Accounts
//  const [loading,setLoading]=useState(false)

const fetchAccounts = async () => {

  if(loading) return

  setLoading(true)

  try{

    const res = await api.get("/google/accounts")

    setAccounts(res.data.data)

  }catch(err){

    toast.error("Failed to fetch accounts")

  }

  setLoading(false)

}



  // Fetch Locations
  const fetchLocations = async (accountId: string) => {

    try {

      const res = await api.get(`/google/locations/${accountId}`);

      if (!res.data.data || res.data.data.length === 0) {

        toast.error("No locations found");

        return;

      }

      setLocations(res.data.data);

    } catch (err) {

      console.log(err);

      toast.error("Failed to fetch locations");

    }

  };



  // Save Settings
  const saveSettings = async () => {

    if (!selectedAccount || !selectedLocation) {

      toast.error("Select account and location");

      return;

    }

    try {

      await api.post("/autogbp/settings", {

        accountId: selectedAccount.replace("accounts/", ""),

        locations: [
          {
            city: "Selected Location",
            locationId: selectedLocation.replace("locations/", "")
          }
        ]

      });

      toast.success("Settings saved");

    } catch {

      toast.error("Failed to save settings");

    }

  };



  // Generate AI Post
  const generatePost = async () => {

    if (!topic) {

      toast.error("Enter topic");

      return;

    }

    try {

      const res = await api.post("/autogbp/generate", {
        topic
      });

      setPost(res.data.data.postContent);

      toast.success("AI Post generated");

    } catch {

      toast.error("Failed to generate post");

    }

  };



  // Run Auto Post
  const runAutoPost = async () => {

    try {

      await api.get("/autogbp/run");

      toast.success("Auto post executed");

    } catch {

      toast.error("Auto post failed");

    }

  };



  return (

    <div className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        AutoGBP AI
      </h1>


      {/* Google Connection */}

      {!connected ? (

        <button
          onClick={connectGoogle}
          className="bg-red-600 text-white px-6 py-2 rounded mb-6"
        >
          Connect Google Business
        </button>

      ) : (

        <div className="mb-6 text-green-600 font-semibold">
          Google Connected ✅
        </div>

      )}



      {/* Fetch Accounts */}

      {connected && (

        <button
          onClick={fetchAccounts}
          className="bg-blue-600 text-white px-6 py-2 rounded mb-6"
        >
          Fetch Accounts
        </button>

      )}



      {/* Accounts */}

      {accounts.length > 0 && (

        <select
          className="border p-3 w-full mb-4"
          onChange={(e) => {

            setSelectedAccount(e.target.value);

            fetchLocations(e.target.value.replace("accounts/", ""));

          }}
        >

          <option>Select Business Account</option>

          {accounts.map((acc) => (

            <option key={acc.name} value={acc.name}>
              {acc.accountName}
            </option>

          ))}

        </select>

      )}



      {/* Locations */}

      {locations.length > 0 && (

        <select
          className="border p-3 w-full mb-6"
          onChange={(e) => setSelectedLocation(e.target.value)}
        >

          <option>Select Location</option>

          {locations.map((loc) => (

            <option key={loc.name} value={loc.name}>
              {loc.title}
            </option>

          ))}

        </select>

      )}



      {locations.length > 0 && (

        <button
          onClick={saveSettings}
          className="bg-green-600 text-white px-6 py-2 rounded mb-8"
        >
          Save Settings
        </button>

      )}



      {/* Generate Post */}

      <div className="mb-6">

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Post topic"
          className="border p-3 rounded w-full mb-3"
        />

        <button
          onClick={generatePost}
          className="bg-purple-600 text-white px-6 py-2 rounded"
        >
          Generate AI Post
        </button>

      </div>



      {post && (

        <div className="border p-4 rounded mb-6">

          <h3 className="font-semibold mb-2">
            Generated Post
          </h3>

          <p>{post}</p>

        </div>

      )}



      <button
        onClick={runAutoPost}
        className="bg-orange-600 text-white px-6 py-2 rounded"
      >
        Run Auto Post
      </button>

    </div>

  );

}