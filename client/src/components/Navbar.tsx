import { Link } from "wouter";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Exclusive Listings", href: "/listings" },
    { name: "Investments", href: "/investments" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
        isScrolled
          ? "bg-white/90 backdrop-blur-md py-4 shadow-sm border-white/20 text-primary"
          : "bg-transparent py-6 text-white"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="text-2xl font-serif font-bold tracking-widest uppercase">
            Wanda<span className={cn("text-secondary", isScrolled ? "text-secondary" : "text-white/80")}>Estates</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <a className="text-sm font-medium uppercase tracking-wider hover:text-secondary transition-colors">
                {link.name}
              </a>
            </Link>
          ))}
          <Button 
            variant="outline" 
            className={cn(
              "rounded-none border-secondary text-secondary hover:bg-secondary hover:text-white uppercase tracking-wider text-xs px-6 py-5",
              !isScrolled && "bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
            )}
          >
            <Phone className="w-3 h-3 mr-2" />
            +34 952 000 000
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-6 flex flex-col space-y-4 shadow-xl md:hidden text-primary">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <a 
                className="text-lg font-serif font-medium hover:text-secondary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
