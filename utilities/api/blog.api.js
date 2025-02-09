import URLS from "@/utilities/urls.js";

const getBlogs = async (category = null, url = URLS.BLOG.READ_MANY) => {
  console.log(url);
  try {
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
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

const getBlog = async (id, url = URLS.BLOG.READ_ONE(id)) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data: data.data };
  } catch (error) {
    // TODO: Remove log
    console.error("Error fetching blog:", error);
    throw error;
  }
};

const BLOG_API = {
  getBlogs,
  getBlog,
};


export default BLOG_API;
