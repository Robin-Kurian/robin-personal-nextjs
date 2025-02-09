import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    const carouselCollection = collection(db, "carousel");
    const carouselSnapshot = await getDocs(carouselCollection);
    const carouselList = carouselSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify({ data: carouselList || [] }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching carousel:", error);
    return new Response(JSON.stringify({ data: [] }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, immutable",
      },
    });
  }
}
