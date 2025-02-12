import Image from "next/image";

const AboutSection = () => {
    return (
        <section className="min-h-full flex flex-col ">
            <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text">
                        Robin K
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-semibold mb-4">Full Stack Developer</h2>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto md:mx-0">
                        Hi, I&apos;m Robin, a Bengaluru-based software developer dedicated to creating intuitive user experiences and impactful projects.
                    </p>
                </div>
                <div className="flex-shrink-0 mb-8 md:mb-0">
                    <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gray-200 shadow-xl">
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