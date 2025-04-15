const SHOP_DETAILS = {
  SHOP_ADMIN_NAME: "Edwin",
  SHOP_NAME: "Baby Paradise",
  SHOP_ADMIN_CONTACT: "9995058761",
  SHOP_ADMIN_EMAIL: "chakkappanedwin@gmail.com",
  SHOP_SUPPORT_EMAIL: "support@babyparadise.in",
  SHOP_SITE_URL: "https://babyparadiseweb.netlify.app/",
  SHOP_LOCATION: "https://maps.google.com/maps?q=Baby%20Paradise%20mission%20Hospital%20road%2C%20opposite%20to%20Sacred%20heart%20mission%20Hospital%2C%20Pullur%2C%20Kerala%20680683&output=embed",
  SHOP_INSTAGRAM: "https://www.instagram.com/babyparadise.in",
  SHOP_FACEBOOK: "https://www.facebook.com/babyparadise.in",
}
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

const LOGGED_IN_MENU_ITEMS = [
  { key: "profile", label: "Profile", href: "/profile" },
  { key: "cart", label: "Cart", href: "/cart" },
  { key: "about", label: "About", href: "/about" },
  { key: "help", label: "Help & Feedback", href: "/help" },
  { key: "orders", label: "Orders", href: "/orders" },
];

const DEFAULT_BUTTON_STYLES = {
  variant: "bordered",
  // color: "primary",
  // rounded-2xl border-color-secondary-s90 
  classNames: `font-normal rounded-none border border-color-secondary-s30 sm:hover:bg-color-primary-p50 hover:font-semibold`,
  iconClassNames: "font-extralight text-color-secondary-s30"
}

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
  DEFAULT_BUTTON_STYLES
};

export {
  SYMBOLS,
  PLACEHOLDER,
  HTTP_METHODS,
  // SIDEBAR_ITEMS,
  LOGGED_IN_MENU_ITEMS,
  // ABOUT_MENU_ITEMS,
  EXPERIENCE_DATA
};
