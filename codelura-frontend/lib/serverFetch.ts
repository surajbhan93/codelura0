export async function serverFetch(path: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  console.log("FETCHING:", url); // 🔥 DEBUG

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.log("STATUS:", res.status);
    throw new Error("Failed to fetch");
  }

  return res.json();
}
