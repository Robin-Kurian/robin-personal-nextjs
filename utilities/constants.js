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
    title: "About me",
    url: "#about",
    icon: User,
    isActive: false,
  },
  {
    title: "Experience",
    url: "#experience",
    icon: Briefcase,
    isActive: false,
  },

  {
    title: "Skills",
    url: "#skills",
    icon: Code,
    isActive: false,
  },
  {
    title: "Works",
    url: "#works",
    icon: Package,
    isActive: false,
  },
  {
    title: "Gallery",
    url: "#gallery",
    icon: Image,
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
  PLACEHOLDER,
  HTTP_METHODS,
  SIDEBAR_ITEMS,
  LOGGED_IN_MENU_ITEMS,
  ABOUT_MENU_ITEMS,
};
