import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AboutSection = () => {
  const defaultDescription = (
    <span className="mr-2 text-gray-900 dark:text-gray-400">
      Hi, I am a software engineer with over four years of experience in web
      development, And always dedicated to creating intuitive user experiences
      and delivering impactful projects.
    </span>
  );

  const readMoreOrLess = (
    <span className="text-sm bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text ">
      {" "}
      Read more..
    </span>
  );

  const expandedDescription = (
    <span className="text-left text-base">
      <br />
      <br />
      Over the past few years, I have specialized in both Frontend & Backend Web
      technologies such as Next.js, ReactJs, Javascript, Django, Python,
      PostgreSQL and REST APIs etc.
      <br />
      <br /> My prior role at{" "}
      <a
        href="https://www.mobiux.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 font-bold rounded-md"
      >
        Mobiux Labs
      </a>{" "}
      immensely helped me in developing and delivering products that clients
      valued, which greatly enhanced my professional growth and development.
      <br />
      <br />
      While at{" "}
      <a
        href="https://www.cybrosys.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 font-bold rounded-md"
      >
        Cybrosys technologies{" "}
      </a>{" "}
      , I made important contributions to ERP software development in Python,
      Javascript, Odoo and other web frameworks. Meanwhile working on Django and
      React for personal Projects.
      <br />
      <br />
      In addition to my core skills, I spent time programming Flutter mobile
      apps, Electron.js applications, and browser extensions for the Edge Store.
      <br />I thrive on leveraging technology to solve real-world challenges and
      am always on the lookout for new opportunities to grow.
    </span>
  );

  return (
    <section className="min-h-full flex flex-col">
      <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 ">
        <div className="flex-1 text-center md:text-left ">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-red-700 text-transparent bg-clip-text">
            Robin K
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Full Stack Developer
          </h2>

          <div>
            {defaultDescription}
            <Dialog>
              <DialogTrigger> {readMoreOrLess}</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle hidden></DialogTitle>
                  <DialogDescription>{expandedDescription}</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex-shrink-0 mb-8 md:mb-0">
          <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gray-200 shadow-xl ">
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
