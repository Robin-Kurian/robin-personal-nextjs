import { create } from "zustand";
import CAROUSEL_API from "@/utilities/api/carousel.api"; // Import the carousel API

const useCarouselStore = create((set) => ({
  carousel: [],
  loading: true,
  setCarousel: (carousel) => {
    localStorage.setItem("carousel", JSON.stringify(carousel));
    set({ carousel, loading: false });
  },
  fetchCarousel: async () => {
    try {
      const response = await CAROUSEL_API.getCarousel(); // Fetch carousel data
      set({ carousel: response.data, loading: false });
      localStorage.setItem("carousel", JSON.stringify(response.data)); // Store in localStorage
    } catch (error) {
      console.error("Error fetching carousel:", error);
      set({ loading: false });
    }
  },
  getCarousel: () => JSON.parse(localStorage.getItem("carousel")) || [],
}));

export default useCarouselStore;
