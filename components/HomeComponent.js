"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import ContentWrapper from "@/components/common/layouts/ContentWrapper";
import useBlogStore from "@/hooks/useBlogStore";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import WorksSection from "@/components/sections/WorksSection";
import GallerySection from "@/components/sections/GallerySection";
import BlogsSection from "@/components/sections/BlogsSection";
import ContactSection from "@/components/sections/ContactSection";
import { Button } from "@heroui/react";
import { FiArrowUp } from "react-icons/fi";

const HomeComponent = ({ initialData }) => {
  const { blogs, setBlogs } = useBlogStore();
  const [isLoading, setIsLoading] = useState(true);
  const setBlogDetails = useBlogStore((state) => state.setBlogDetails);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    setBlogs(initialData.BLOGS);
    setIsLoading(false);
  }, [initialData.BLOGS, setBlogs]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show button when scrolled down to 30% of the page
      if (scrollPosition > (documentHeight - windowHeight) * 0.3) {
        setIsButtonVisible(true);
      } else {
        setIsButtonVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBlogClick = (blog) => {
    console.log("clicked");
    setBlogDetails(blog);
    // router.push(`/blogs/${blog?.id}`);
  };

  if (isLoading) return <Loader />;

  return (
    <ContentWrapper className="mx-auto px-4 py-8">
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <WorksSection />
      <BlogsSection blogs={blogs} onBlogClick={handleBlogClick} />
      {/* <GallerySection /> */}
      <ContactSection />
      {isButtonVisible && (
        <div className="flex justify-end fixed bottom-10 right-8">
          <Button
            radius="full"
            isIconOnly
            onPress={() => {
              document
                .getElementById("home")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            <FiArrowUp />{" "}
          </Button>
        </div>
      )}
    </ContentWrapper>
  );
};

export default HomeComponent;
