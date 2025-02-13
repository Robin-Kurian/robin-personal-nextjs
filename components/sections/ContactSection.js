import { Button } from "@heroui/react";
import React from "react";
import { BsWhatsapp } from "react-icons/bs";
const ContactSection = () => {
  return (
    <section
      id="contact"
      className="min-h-full w-full flex justify-center pb-20"
    >
      <div className="rounded-lg sm:w-1/3">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Let&apos;s talk..
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the default form submission
            const name = e.target.name.value;
            const email = e.target.email.value;
            const message = e.target.message.value;

            // Construct the WhatsApp URL
            const whatsappMessage = `Hi,\nI am ${name}\nEmail: ${email}\nQuery: ${message}`;
            const whatsappUrl = `https://wa.me/918848824751?text=${encodeURIComponent(
              whatsappMessage
            )}`;

            // Redirect to WhatsApp
            window.open(whatsappUrl, "_blank");
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-normal text-foreground"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full border p-2 rounded-2xl"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-normal text-foreground"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full border border-gray-300  rounded-2xl p-2"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-normal text-foreground"
            >
              Share your ideas or issues here..
            </label>
            <textarea
              id="message"
              name="message"
              required
              className="mt-1 block w-full border border-gray-300 rounded-2xl p-2 h-32"
            ></textarea>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-2xl hover:bg-blue-600 transition duration-200"
          >
            Chat via <BsWhatsapp />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
