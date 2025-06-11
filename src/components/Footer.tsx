import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MailCheck } from "lucide-react";

function FooterLink({ to, name }: { to: string; name: string }) {
  return (
    <Link
      to={to}
      title={name}
      className="hover:font-semibold transition after:content-[attr(title)] after:font-semibold after:h-0 after:block after:invisible after:overflow-hidden"
      resetScroll
    >
      {name}
    </Link>
  );
}

const EmailButton = ({ email }: { email: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy email: ", err);
    }
  };

  return (
    <button
      onClick={() => {
        void copyToClipboard();
      }}
      className="py-1 flex items-center gap-2 hover:semi-bold transition-colors group cursor-pointer"
      title={`Copy ${email} to clipboard`}
      aria-label={`Copy ${email} to clipboard`}
    >
      <span className="relative flex items-center justify-center">
        <Mail
          className={`absolute transition-opacity duration-200 ${copied ? "opacity-0" : "opacity-100"}`}
          size={20}
        />
        <MailCheck
          className={`transition-opacity duration-200 ${copied ? "opacity-100 text-green-500" : "opacity-0"}`}
          size={20}
        />
      </span>
      <span
        title={email}
        className="text-md group-hover:font-semibold after:content-[attr(title)] after:font-semibold after:h-0 after:block after:invisible after:overflow-hidden"
      >
        {email}
        {/* {copied && (
          <span className="ml-2 text-xs text-green-500">(Copied!)</span>
        )} */}
      </span>
    </button>
  );
};

export function Footer({ pathname }: { pathname: string }) {
  // General links
  const generalLinks = [
    { name: "About This Site", path: "/about-site" },
    { name: "Privacy Policy", path: "/privacy" },
  ];
  return (
    <footer
      className={`py-8 overflow-x-hidden ${pathname === "/" ? "bg-ocean-700 text-dawn-pink-100" : ""}`}
    >
      <div className="mx-auto px-10 max-w-7xl flex flex-col justify-center">
        <div
          className={`mt-8 pt-6 border-t ${pathname === "/" ? "border-dawn-pink-100" : "border-night-sky-950 dark:border-dawn-pink-100"}`}
        ></div>
        <div className="flex flex-col md:flex-row md:justify-around px-0 md:px-5 w-full">
          <div className="my-auto">
            <p className={`text-lg text-center space-y-2 pb-2 text-pretty`}>
              Hey there! Thanks for making it this far down.
            </p>
            <p className="text-lg text-center space-y-2 pb-2 text-pretty">
              Get in touch if you want to connect:
            </p>
            <div className="flex justify-around">
              <div className="">
                <EmailButton email="andrew@sourcedepth.com" />
                <EmailButton email="scherand@oregonstate.edu" />
                <EmailButton email="ascherer97@gmail.com" />
              </div>
            </div>
          </div>
          <div className="">
            <h3 className="text-lg font-bold py-4 text-center md:text-right">
              Other Things
            </h3>
            <ul className="space-y-2 text-center md:text-right">
              {generalLinks.map((link, index) => (
                <li key={index}>
                  <FooterLink to={link.path} name={link.name} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className={`mt-8 pt-6 border-t ${pathname === "/" ? "border-dawn-pink-100 text-gray-300" : "border-night-sky-950 dark:border-dawn-pink-100 text-gray-600"}`}
        >
          <div className="flex justify-center">
            <p className="text-sm space-y-2">
              &copy; 2024-{new Date().getFullYear()} Andrew Scherer. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
