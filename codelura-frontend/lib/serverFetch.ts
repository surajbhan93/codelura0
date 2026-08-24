export async function serverFetch(path: string) {

  const base =
    process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
      ? process.env.NEXT_PUBLIC_API_URL
      : `http://localhost:3002`;

  const url = `${base}${path}`;

  console.log("FETCHING:", url);

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.log("STATUS:", res.status);
    throw new Error("Failed to fetch");
  }

  return res.json();
}