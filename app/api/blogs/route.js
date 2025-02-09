import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(req) {
  const category = req.nextUrl.searchParams.get("category"); // Optionally filter by category

  try {
    const blogsCollection = collection(db, "blogs");
    let q = query(blogsCollection); 

    // Apply category filter if provided
    if (category) {
      q = query(q, where("category", "==", category));
    }

    const blogSnapshot = await getDocs(q);
    const blogList = blogSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify({ data: blogList }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
