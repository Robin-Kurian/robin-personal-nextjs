import Image from "next/image";

const GallerySection = () => {
    return (
        <section id="gallery" className="min-h-screen py-20">
            <h2 className="text-4xl font-bold mb-8">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Image
                    src="/images/about/introduction.jpg"
                    alt="Gallery Image"
                    className="rounded-lg object-cover"
                    width={400}
                    height={300}
                />
                <Image
                    src="/images/about/work-experience.jpg"
                    alt="Gallery Image"
                    className="rounded-lg object-cover"
                    width={400}
                    height={300}
                />
                {/* Add more images */}
            </div>
        </section>
    );
};

export default GallerySection; 