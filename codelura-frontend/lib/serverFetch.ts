import axios from "axios";

export async function serverFetch(path: string) {
  const base =
    process.env.API_URL?.startsWith("http")
      ? process.env.API_URL
      : process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:3002";

  const url = `${base}${path}`;

  console.log("FETCHING:", url);

  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

    throw error;
  }
}