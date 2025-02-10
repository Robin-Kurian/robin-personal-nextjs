import {
  Calendar,
  Home,
  Search,
  Settings,
  User,
  Briefcase,
  Code,
} from "lucide-react";

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
    title: "Introduction",
    url: "#introduction",
    icon: User,
    isActive: false,
  },
  {
    title: "Work Experience",
    url: "#work-experience",
    icon: Briefcase,
    isActive: false,
  },

  {
    title: "Technical Skills",
    url: "#technical-skills",
    icon: Code,
    isActive: false,
  },
];

const CONSTANTS = {
  PLACEHOLDER,
  LOGGED_IN_MENU_ITEMS,
  SYMBOLS,
  SIDEBAR_ITEMS,
};

export {
  SYMBOLS,
  HTTP_METHODS,
  LOGGED_IN_MENU_ITEMS,
  SIDEBAR_ITEMS,
  ABOUT_MENU_ITEMS,
};

export default CONSTANTS;
