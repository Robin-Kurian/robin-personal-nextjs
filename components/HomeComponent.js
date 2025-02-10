"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import ContentWrapper from "@/components/common/layouts/ContentWrapper";
import Gridlayout from "@/components/common/layouts/Gridlayout";
import BlogCard from "@/components/user/BlogCard";
import useBlogStore from "@/hooks/useBlogStore";

const HomeComponent = ({ initialData }) => {
  const { blogs, setBlogs } = useBlogStore();
  const [isLoading, setIsLoading] = useState(true);
  const setBlogDetails = useBlogStore((state) => state.setBlogDetails);

  useEffect(() => {
    setBlogs(initialData.BLOGS);
    setIsLoading(false);
  }, [initialData.BLOGS, setBlogs]);

  const handleBlogClick = (blog) => {
    console.log("clicked");
    setBlogDetails(blog);
    // router.push(`/blogs/${blog?.id}`);
  };

  if (isLoading) return <Loader />;
  return (
    <ContentWrapper className="gap-4">
      {/* BLOGS SECTION */}
      <h1 className="text-2xl font-bold">Blogs</h1>
      <Gridlayout>
        {blogs.map((blog) => (
          <BlogCard
            key={blog?.id}
            onClick={() => handleBlogClick(blog)}
            blog={blog}
            className="w-full"
          />
        ))}
      </Gridlayout>
    </ContentWrapper>
  );
};

export default HomeComponent;
