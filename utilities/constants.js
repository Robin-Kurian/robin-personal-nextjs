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

const CONSTANTS = {
  PLACEHOLDER,
  LOGGED_IN_MENU_ITEMS,
  SYMBOLS,
};

export { HTTP_METHODS, LOGGED_IN_MENU_ITEMS, SYMBOLS };
export default CONSTANTS;
