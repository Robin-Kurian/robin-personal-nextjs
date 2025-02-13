import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

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
      Know me more..
    </span>
  );

  const expandedDescription = (
    <>
      <span className="text-lg font-semibold fade-in">
        Thanks for your time!🤠
      </span>
      <br />
      <div className="text-left text-[15px] ">
        <span className="fade-in delay-1">
          Over the past few years, I have worked exclusively with frontend and
          backend web technologies, primarily Next.js, React.js, JavaScript,
          Django, Python, PostgreSQL, and REST APIs
        </span>
        <br />
        <span className="fade-in delay-2">
          <br /> My role at{" "}
          <a
            href="https://www.mobiux.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-300 to-gray-300 text-transparent bg-clip-text  font-bold rounded-md"
          >
            Mobiux Labs
          </a>{" "}
          was instrumental in refining my ability to develop and deliver
          products that clients valued, greatly enhancing my professional
          growth. <br /> I worked on multiple projects utilizing Django, React,
          and Flutter.
        </span>
        <br />
        <span className="fade-in delay-3">
          <br />
          During my time at{" "}
          <a
            href="https://www.cybrosys.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-red-300 to-gray-400 text-transparent bg-clip-text font-bold rounded-md"
          >
            Cybrosys technologies,
          </a>
          {"  "}I was deeply involved in ERP development using Python,
          JavaScript, and various web frameworks.
        </span>
        <br />
        <span className="fade-in delay-4">
          <br />
          Beyond my core skills, I have worked on developing Flutter mobile
          apps, Electron.js applications, and browser extensions for the Edge
          Store.
        </span>
        <br />
        <span className="fade-in delay-5">
          <br />
          Always dedicated to solving challenges with technology and refining my
          expertise!!
        </span>
        <span className="fade-in delay-6">
          <br />
          <br />
          {/* <a
            href="#contact"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-300 to-green-700 text-transparent bg-clip-text font-bold rounded-md"
          >
            So, How can I help you?{" "}
          </a> */}
          <DialogClose asChild>
            <Button
              type="button"
              variant="none"
              onClick={() => {
                document
                  .getElementById("contact")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              So, How can I help you?
            </Button>
            {/* <a
              href="#contact"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-300 to-green-700 text-transparent bg-clip-text font-bold rounded-md"
            >
              So, How can I help you?{" "}
            </a> */}
          </DialogClose>
        </span>
      </div>
    </>
  );

  return (
    <section className="min-h-full flex flex-col">
      <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 ">
        <div className="flex-1 text-center md:text-left ">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-blue-100 text-transparent bg-clip-text">
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
                  <DialogTitle hidden />
                  <div className="text-gray-900 dark:text-gray-400">
                    {expandedDescription}
                  </div>
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
