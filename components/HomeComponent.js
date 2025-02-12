"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import ContentWrapper from "@/components/common/layouts/ContentWrapper";
import useBlogStore from "@/hooks/useBlogStore";

// Import sections
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import WorksSection from "@/components/sections/WorksSection";
import GallerySection from "@/components/sections/GallerySection";
import BlogsSection from "@/components/sections/BlogsSection";

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
    <ContentWrapper className="max-w-6xl  mx-auto px-4 py-8">
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <WorksSection />
      <BlogsSection blogs={blogs} onBlogClick={handleBlogClick} />
      <GallerySection />
    </ContentWrapper>
  );
};

export default HomeComponent;
