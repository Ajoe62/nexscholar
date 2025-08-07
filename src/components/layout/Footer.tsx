import Link from "next/link";
import { GraduationCap } from "lucide-react";

const navigation = {
  main: [
    { name: "Scholarships", href: "/scholarships" },
    { name: "Consultation", href: "/consultation" },
    { name: "Documents", href: "/documents" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start">
            <GraduationCap className="h-6 w-6 text-primary-400" />
            <span className="ml-2 text-white font-display font-bold">
              Nexscholar
            </span>
          </div>
          <p className="text-center text-xs leading-5 text-gray-400 md:text-left mt-2">
            &copy; 2025 Nexscholar. Empowering global education access.
          </p>
        </div>
      </div>
    </footer>
  );
}
