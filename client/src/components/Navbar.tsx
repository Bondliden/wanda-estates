import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Properties for sale", href: "/properties-for-sale" },
    { name: "New developments", href: "/new-developments" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-[#013b7a]/50 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Area */}
        <div className="w-[200px] md:w-[274px]">
          <Link href="/">
            <a className="block text-2xl font-serif font-bold tracking-widest uppercase">
              {/* Replacing missing image with text for now, or using a placeholder if preferred */}
              Wanda<span className="text-[#c5a059]">Estates</span>
            </a>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6 items-center">
          {links.map((link) => (
            <Link key={link.name} href={link.href}>
              <a className="text-sm font-bold uppercase hover:text-[#e09900] transition-colors">
                {link.name}
              </a>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#013b7a] p-4 absolute top-full left-0 right-0 border-t border-white/10 z-50">
          <div className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link key={link.name} href={link.href}>
                <a 
                  className="text-sm font-bold uppercase text-white hover:text-[#e09900]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
