import Image from "next/image";

const AboutSection = () => {
    return (
        <section className="min-h-full flex flex-col justify-between">
            <div className="flex items-center gap-12">
                <div className="flex-1">
                    <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text">
                        Robin K
                    </h1>
                    <h2 className="text-4xl font-semibold mb-4">Full Stack Developer</h2>
                    <p className="text-xl text-gray-500 max-w-2xl">
                        I&apos;m Robin, a software developer based in Bengaluru, who crafts intuitive user
                        experiences and loves building impactful projects.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-gray-200 shadow-xl">
                        <Image
                            src="/images/profile.png"
                            alt="Robin K"
                            className="w-full h-full object-cover"
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection; 