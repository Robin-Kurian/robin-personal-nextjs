import URLS from "@/utilities/urls.js";

const getCarousel = async (url = URLS.CAROUSEL.READ_MANY) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return { data: data.data || [] };
  } catch (error) {
    console.error("Error fetching carousel:", error);
    // Return empty array instead of throwing error
    return { data: [] };
  }
};

const CAROUSEL_API = {
  getCarousel,
};

export default CAROUSEL_API;
