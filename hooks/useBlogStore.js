import { create } from "zustand";

const useBlogStore = create((set) => ({
  blogs: [], // To store blogs
  setBlogs: (blogs) => {
    localStorage.setItem("blogs", JSON.stringify(blogs));
    set({ blogs });
  }, // To set the list of blogs and save to localStorage
  getBlogs: () => JSON.parse(localStorage.getItem("blogs")) || [], // To return blogs from localStorage
  blogDetails: null,
  setBlogDetails: (blog) => set({ blogDetails: blog }),
}));

export default useBlogStore;
