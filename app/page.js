import ContentWrapper from "@/components/common/layouts/ContentWrapper";
import HomeComponent from "@/components/HomeComponent";
import BLOG_API from "@/utilities/api/blog.api";
export default async function Home() {
  const [blogsResponse] = await Promise.all([BLOG_API.getBlogs()]);

  const { data: BLOGS } = blogsResponse;
  const INITIAL_DATA = { BLOGS };

  return (
    <ContentWrapper className="p-1 gap-4">
      <HomeComponent initialData={INITIAL_DATA} />
    </ContentWrapper>
  );
}
