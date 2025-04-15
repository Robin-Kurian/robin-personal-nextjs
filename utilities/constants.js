import {
  Calendar,
  Home,
  Search,
  Settings,
  User,
  Briefcase,
  Code,
  Package,
  Image,
  ContactIcon,
} from "lucide-react";
import { LuFilePenLine } from "react-icons/lu";

const SET_VALUE_CONFIG = {
  shouldValidate: true,
};

const HTTP_METHODS = {
  HEAD: "HEAD",
  GET: "GET",
  PUT: "PUT",
  PATCH: "PATCH",
  POST: "POST",
  DELETE: "DELETE",
};

const SYMBOLS = {
  CURRENCY: "₹",
};

const PLACEHOLDER = {
  DATA: "--",
  DATE: "----/----/----",
  CURRENCY: "₹__",
};

const menuItems = [
  { label: "Login", href: "/login" },
  { label: "About", href: "/about" },
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Help & Feedback", href: "/help" },
];

const LOGGED_IN_MENU_ITEMS = [
  { key: "profile", label: "Profile", href: "/profile" },
  { key: "about", label: "About", href: "/about" },
  { key: "help", label: "Help & Feedback", href: "/help" },
];

const SIDEBAR_ITEMS = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    isActive: false,
  },
  {
    title: "About",
    url: "/about",
    icon: User,
    isActive: false,
  },
  {
    title: "Works",
    url: "/works",
    icon: Calendar,
    isActive: false,
  },
  {
    title: "Gallery",
    url: "/gallery",
    icon: Search,
    isActive: false,
  },
  {
    title: "Contact",
    url: "/contact",
    icon: Settings,
    isActive: false,
  },
];

const ABOUT_MENU_ITEMS = [
  {
    title: "About me",
    url: "#home",
    icon: User,
    isActive: false,
  },
  {
    title: "Skills",
    url: "#skills",
    icon: Code,
    isActive: false,
  },
  {
    title: "Experience",
    url: "#experience",
    icon: Briefcase,
    isActive: false,
  },
  {
    title: "Works",
    url: "#works",
    icon: Package,
    isActive: false,
  },
  {
    title: "Blogs",
    url: "#blogs",
    icon: LuFilePenLine,
    isActive: false,
  },
  {
    title: "Contact",
    url: "#contact",
    icon: ContactIcon,
    isActive: false,
  },
  // {
  //   title: "Gallery",
  //   url: "#gallery",
  //   icon: Image,
  //   isActive: false,
  // },
];

const EXPERIENCE_DATA = [
  {
    company: "Mobiux Labs",
    position: "Senior Software Engineer, Full Stack",
    duration: "May 2023 – Dec 2024",
    achievements: [
      "Executed full development of a non-profit organization's website, implementing advanced features resulting in 10% increase in online donations from 240+ donors",
      "Contributed to Wakefield Trinity - Fixtures Flutter app development, creating reusable components and optimizing performance, reducing code redundancy by 15%",
      "Led Phase 2 development of UrjaDrishti project (Ministry of Power) using Django and Next.js, improving report generation efficiency by 10% and code quality by 15%",
      "Developed real estate management web app frontend using NextJS13, implementing multilingual support and improving application efficiency by 50%",
      "Collaborated on headless CMS development using monorepo architecture, TypeScript, and Next.js 14, reducing project delivery times by 25%",
      "Enhanced Perfios WordPress development with optimized templates, increasing development speed by 50%"
    ]
  },
  {
    company: "Cybrosys Technologies",
    position: "Software Developer, Python Odoo JS",
    duration: "Mar 2022 – Mar 2023",
    achievements: [
      "Built dynamic Odoo dashboard application with customizable layouts, achieving 9,600+ downloads and active users",
      "Developed and deployed 20+ applications to Odoo Store including Odoo-Jira Connector, Website Helpdesk Dashboard, and Salon Management app"
    ]
  },
  {
    company: "Strokx Technologies",
    position: "Web Developer [Python-Django]",
    duration: "Nov 2019 – Nov 2020",
    achievements: [
      "Enhanced user experience by 25% through feature development in Django projects",
      "Developed 3+ websites including a movie streaming platform"
    ]
  },
  {
    company: "Cybrosys Technologies",
    position: "Intern, Python – JavaScript - Odoo",
    duration: "",
    achievements: [
      "Developed 5+ applications using Core Python, JavaScript, jQuery, HTML, CSS, Bootstrap5 and SQL"
    ]
  },
  {
    company: "Avodha Edutech",
    position: "Intern, Android Development",
    duration: "",
    achievements: [
      "Developed Task Tracker app using Android, XML, Java, and Kotlin"
    ]
  },
  {
    company: "Strokx Technologies",
    position: "Intern, Web Development",
    duration: "June 2019 – Nov 2019",
    achievements: [
      "Gained practical experience in web development fundamentals through collaborative projects"
    ]
  }
];

const CONSTANTS = {
  PLACEHOLDER,
  LOGGED_IN_MENU_ITEMS,
  SYMBOLS,
  SIDEBAR_ITEMS,
};

export {
  SYMBOLS,
  PLACEHOLDER,
  HTTP_METHODS,
  SIDEBAR_ITEMS,
  LOGGED_IN_MENU_ITEMS,
  ABOUT_MENU_ITEMS,
  EXPERIENCE_DATA
};
