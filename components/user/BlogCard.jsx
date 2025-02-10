import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@heroui/react";

const BlogCard = ({ blog, onClick, className }) => {
  return (
    <Card
      className={`max-w-[400px] ${className}`}
      onPress={onClick}
      isPressable
    >
      <CardHeader className="flex gap-3">
        <Image
          alt="heroui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col ">
          <p className="text-md left-0">{blog?.name}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{blog?.description}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal showAnchorIcon href={blog?.url}>
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
