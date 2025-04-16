import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Robin",
  lastName: "K",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Software Developer",
  avatar: "/images/profile.png",
  location: "Bengaluru, India", // Location to display
  timeZone: "Asia/Kolkata", // IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Hindi", "Malayalam"], // optional: Leave the array empty if you don't want to display languages
  contact: "8848824751",
  email: "dev.robinkurian@gmail.com",
  googleMapLocation: "https://maps.google.com/maps?q=Baby%20Paradise%20mission%20Hospital%20road%2C%20opposite%20to%20Sacred%20heart%20mission%20Hospital%2C%20Pullur%2C%20Kerala%20680683&output=embed",
  instagram: "https://www.instagram.com/the_cipher_head",
  linkedin: "https://www.linkedin.com/in/developer-robin-kurian/",
  github: "https://github.com/Robin-Kurian/",
};

const newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about design, technology, and share thoughts on the intersection of
      creativity and engineering.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Robin-Kurian/",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/developer-robin-kurian/",
  },
  {
    name: "X",
    icon: "x",
    link: "",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:dev.robinkurian@gmail.com",
  },
];

const home = {
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Full-Stack Developer </>,
  subline: (
    <>
      I'm {person.firstName}, a web developer dedicated to creating modern digital experiences. I have a proven track record of delivering impactful solutions at <InlineCode>MOBIUX</InlineCode>, <InlineCode>CYBROSYS</InlineCode> etc., as well as personal projects I pursue in my spare time.
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/robin-kurian",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Robin is a Bengaluru-based software engineer, specializing in simplifying complex challenges through elegant design solutions across digital interfaces and interactive experiences.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Mobiux Labs",
        timeframe: "May 2023 – Dec 2024",
        role: "Senior Software Engineer, Full Stack",
        achievements: [
          <>
            Executed full development of a non-profit organization's website, implementing advanced features resulting in 10% increase in online donations from 240+ donors
          </>,
          <>
            Contributed to Wakefield Trinity - Fixtures Flutter app development, creating reusable components and optimizing performance, reducing code redundancy by 15%
          </>,
          <>
            Led Phase 2 development of UrjaDrishti project (Ministry of Power) using Django and Next.js, improving report generation efficiency by 10% and code quality by 15%
          </>,
          <>
            Developed real estate management web app frontend using NextJS13, implementing multilingual support and improving application efficiency by 50%
          </>,
          <>
            Collaborated on headless CMS development using monorepo architecture, TypeScript, and Next.js 14, reducing project delivery times by 25%
          </>,
          <>
            Enhanced Perfios WordPress development with optimized templates, increasing development speed by 50%
          </>
        ],
        images: [
          // {
          //   src: "/images/projects/project-01/cover-01.jpg",
          //   alt: "Once UI Project",
          //   width: 16,
          //   height: 9,
          // },
        ]
      },
      {
        company: "Cybrosys Technologies",
        timeframe: "Mar 2022 – Mar 2023",
        role: "Software Developer, Python Odoo JS",
        achievements: [
          <>
            Built dynamic Odoo dashboard application with customizable layouts, achieving 9,600+ downloads and active users
          </>,
          <>
            Developed and deployed 20+ applications to Odoo Store including Odoo-Jira Connector, Website Helpdesk Dashboard, and Salon Management app
          </>
        ],
        images: []
      },
      {
        company: "Strokx Technologies",
        timeframe: "Nov 2019 – Nov 2020",
        role: "Web Developer [Python-Django]",
        achievements: [
          <>
            Enhanced user experience by 25% through feature development in Django projects
          </>,
          <>
            Developed 3+ websites including a movie streaming platform
          </>
        ],
        images: []
      },
      {
        company: "Cybrosys Technologies",
        timeframe: "",
        role: "Intern, Python – JavaScript - Odoo",
        achievements: [
          <>
            Developed 5+ applications using Core Python, JavaScript, jQuery, HTML, CSS, Bootstrap5 and SQL
          </>
        ],
        images: []
      },
      {
        company: "Avodha Edutech",
        timeframe: "",
        role: "Intern, Android Development",
        achievements: [
          <>
            Developed Task Tracker app using Android, XML, Java, and Kotlin
          </>
        ],
        images: []
      },
      {
        company: "Strokx Technologies",
        timeframe: "June 2019 – Nov 2019",
        role: "Intern, Web Development",
        achievements: [
          <>
            Gained practical experience in web development fundamentals through collaborative projects
          </>
        ],
        images: []
      }
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University of Calicut",
        description: <> Bachelor of Computer Application (BCA)
          (June 2016 - March 2019)
          Modules: Web programming, Data Structures, RDBMS, Object Oriented
          Programming. </>,
      }
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Frontend Development",
        description: <>Proficient in modern frontend technologies including Next.js, React, TypeScript, and Flutter for cross-platform development. Experienced in creating responsive, multilingual applications with optimized performance.</>,
        images: [
          {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
            alt: "Next.js logo",
            width: 5,
            height: 5,
          },
          {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
            alt: "React logo",
            width: 5,
            height: 5,
          },
          {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
            alt: "TypeScript logo",
            width: 5,
            height: 5,
          }
        ],
      },
      {
        title: "Backend Development",
        description: <>Strong foundation in Python with Django framework, experienced in building RESTful APIs, and developing custom Odoo applications. Skilled in database management and system architecture.</>,
        images: [
          {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
            alt: "Python logo",
            width: 5,
            height: 5,
          },
          {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
            alt: "Django logo",
            width: 5,
            height: 5,
          },
          {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
            alt: "PostgreSQL logo",
            width: 5,
            height: 5,
          }
        ],
      },
      {
        title: "Tools & Technologies",
        description: <>Experienced with modern development tools and practices including WordPress, headless CMS, monorepo architecture, and version control systems. Skilled in optimizing development workflows and improving code quality.</>,
        images: [
          {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
            alt: "WordPress logo",
            width: 5,
            height: 5,
          },
          {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
            alt: "Docker logo",
            width: 5,
            height: 5,
          },
          {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
            alt: "Git logo",
            width: 5,
            height: 5,
          }
        ],
      }
    ],
  },
};

const blog = {
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Work",
  title: "My projects",
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  description: `A photo collection by ${person.name}`,
  // Images from https://pexels.com
  images: [
    {
      src: "/images/gallery/img-01.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-03.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-04.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-05.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-06.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-07.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-08.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-09.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-10.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-11.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-12.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-13.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-14.jpg",
      alt: "image",
      orientation: "horizontal",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
