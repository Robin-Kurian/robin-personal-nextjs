import AutoplayCarousel from "@/components/common/AutoplayCarousel";
import ContentWrapper from "@/components/common/layouts/ContentWrapper";
import HomeComponent from "@/components/HomeComponent";
import CAROUSEL_API from "@/utilities/api/carousel.api";
import BLOG_API from "@/utilities/api/blog.api";
export default async function Home() {
  const [carouselResponse, blogsResponse] = await Promise.all([
    CAROUSEL_API.getCarousel(),
    BLOG_API.getBlogs(),
  ]);

  const { data: CAROUSEL } = carouselResponse;
  const { data: BLOGS } = blogsResponse;
  const INITIAL_DATA = { BLOGS };

  return (
    <ContentWrapper className="p-1 gap-4">
      {/* CAROUSEL SECTION */}
      {CAROUSEL.length > 0 && <AutoplayCarousel items={CAROUSEL} />}
      <HomeComponent initialData={INITIAL_DATA} />
    </ContentWrapper>
  );
}
