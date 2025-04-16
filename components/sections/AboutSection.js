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
import { HyperText } from "../magicui/hyper-text";
import { MorphingText } from "../magicui/morphing-text";
import { useState } from "react";
import { TextAnimate } from "../magicui/text-animate";

const AboutSection = () => {
  const [showHyperText, setShowHyperText] = useState(false);

  const defaultDescription = (
    <span className="text-gray-900 dark:text-gray-400 text-pretty">
      Hi, I am an SDE with over four years of proven experience in web
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
          </DialogClose>
        </span>
      </div>
    </>
  );

  return (
    <section className="min-h-full flex flex-col justify-center items-center">
      <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 ">
        <div className="flex-1 text-left justify-start">
          <MorphingText
            once={true}
            texts={["", "Hi!", "I'm", "Robin K."]}
            onComplete={() => setShowHyperText(true)}
          />
          <h2 className="text-xl md:text-4xl font-semibold mb-6">
            {showHyperText && (
              <HyperText
                className="text-left  w-full max-w-screen-md"
                duration={3000}
                delay={0}
                startOnView={false}
              >
                Web Developer
              </HyperText>
            )}
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
