import { IS_DEVELOPMENT_MODE } from "@/utilities/functions.js";


const DEFAULT_HOST = IS_DEVELOPMENT_MODE
  ? process.env.NEXT_PUBLIC_API_HOST
  : process.env.NEXT_PUBLIC_API_HOST_PROD;
const getProducts = async (category = null, host = DEFAULT_HOST, timestamp = Date.now()) => {
  try {
    const url = new URL(`${host}/api/products?ts=${timestamp}`);
    // Optionally filter by category
    if (category) url.searchParams.append("category", category);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data: data.data };
  } catch (error) {
    // TODO: Remove log
    console.error("Error fetching products:", error);
    throw error;
  }
};

// New function to get product by ID
const getProductById = async (productId, host = DEFAULT_HOST) => {
  try {
    const url = new URL(`${host}/api/products/${productId}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data: data.data };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

const PRODUCT_API = {
  getProducts,
  getProductById,
};

export default PRODUCT_API;
