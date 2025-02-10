"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import ContentWrapper from "@/components/common/layouts/ContentWrapper";
import Gridlayout from "@/components/common/layouts/Gridlayout";
import BlogCard from "@/components/user/BlogCard";
import useBlogStore from "@/hooks/useBlogStore";
import { Link } from "@heroui/react";

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
      {/*  */}
      <div className="flex flex-col w-3/4 gap-4">
        <h2 className="text-7xl font-bold mt-4">Full Stack Developer</h2>
        <p className="text-2xl text-gray-500 ml-1">
          I&apos;m Robin, a software developer, who crafts intuitive user
          experiences. And who love to build my own projects.
        </p>
      </div>
      <Link
        href="/about"
        className="text-2xl text-foreground w-fit bg-slate-700 px-4 py-2 rounded-3xl"
      >
        About me
      </Link>

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
