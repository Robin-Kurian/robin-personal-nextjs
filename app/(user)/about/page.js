"use client";
import Image from "next/image";
import { ABOUT_MENU_ITEMS } from "@/utilities/constants";
import Link from "next/link";
const AboutPage = () => {
  return (
    <div className="flex h-[calc(100vh-90px)] gap-4">
      {/* SIDEBAR */}
      <nav className="w-1/4 sticky mt-[16%] overflow-y-auto">
        <ul className="space-y-8 ml-6">
          {ABOUT_MENU_ITEMS.map((item) => (
            <li key={item.title}>
              <Link
                href={item.url}
                className="text-teal-500 hover:underline transition duration-300"
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  {item.title}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* MAIN CONTENT */}
      <main className="flex-1 w-2/3 overflow-y-auto scroll-smooth">
        <section id="introduction" className="transition duration-300">
          <h2 className="text-9xl font-bold">Robin K</h2>
          <p className="text-3xl text-gray-500 ml-1">Software engineer</p>
          <Image
            src="/images/about/introduction.jpg"
            alt="Introduction"
            className="my-4 rounded shadow"
            width={250}
            height={250}
          />
          <p>
            Selene is a Jakarta-based design engineer with a passion for
            transforming complex challenges into simple, elegant design
            solutions...
          </p>
        </section>
        <section id="work-experience" className="transition duration-300">
          <h2 className="text-2xl font-bold">Work Experience</h2>
          <Image
            src="/images/about/work-experience.jpg"
            alt="Work Experience"
            className="my-4 rounded shadow"
            width={250}
            height={250}
          />
          <p>Details about work experience...</p>
        </section>
        <section id="technical-skills" className="transition duration-300">
          <h2 className="text-2xl font-bold">Technical Skills</h2>
          <Image
            src="/images/about/technical-skills.jpg"
            alt="Technical Skills"
            className="my-4 rounded shadow"
            width={250}
            height={250}
          />
          <p>Details about technical skills...</p>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
