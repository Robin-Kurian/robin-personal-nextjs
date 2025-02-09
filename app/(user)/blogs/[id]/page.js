"use client";

import PageWrapper from "@/components/common/layouts/PageWrapper";
import BlogDetails from "@/components/user/BlogDetails";
import useBlogStore from "@/hooks/useBlogStore";

export default function BlogDetailPage() {
  const blog = useBlogStore((state) => state.blogDetails);

  return (
    <>
      {blog ? (
        <PageWrapper breadcrumbItems={[{ label: blog?.name, href: `#` }]}>
          <BlogDetails blog={blog} />
        </PageWrapper>
      ) : (
        <div>
          <h2 className="title flex justify-center text-heading-4 pb-2">
            No details to show!
          </h2>
        </div>
      )}
    </>
  );
}
