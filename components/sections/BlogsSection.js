import Gridlayout from "@/components/common/layouts/Gridlayout";
import BlogCard from "@/components/user/BlogCard";

const BlogsSection = ({ blogs, onBlogClick }) => {
  return (
    <section id="blogs" className="min-h-full py-20">
      <h2 className="text-4xl font-bold mb-8">Blogs</h2>
      <Gridlayout>
        {blogs.map((blog) => (
          <BlogCard
            key={blog?.id}
            onClick={() => onBlogClick(blog)}
            blog={blog}
            className="w-full"
          />
        ))}
      </Gridlayout>
    </section>
  );
};

export default BlogsSection;
