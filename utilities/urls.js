import FUNCTIONS from "@/utilities/functions.js";
const DEFAULT_HOST = FUNCTIONS.IS_DEVELOPMENT_MODE()
  ? process.env.NEXT_PUBLIC_API_HOST
  : process.env.NEXT_PUBLIC_API_HOST_PROD;

const createUrl = (path) => `${DEFAULT_HOST}${path}`;

const URLS = {
  CATEGORY: {
    READ_MANY: createUrl("/api/categories"),
    READ_ONE: (id) => createUrl(`/api/categories/${id}`),
  },
  BLOG: {
    READ_MANY: createUrl("/api/blogs"),
    READ_ONE: (id) => createUrl(`/api/blogs/${id}`),
  },
  CAROUSEL: {
    READ_MANY: createUrl("/api/carousel"),
  },
};

export default URLS;
