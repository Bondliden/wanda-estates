import { Link } from "wouter";
import { useState } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
    { code: 'pl', label: 'Polski', flag: '🇵🇱' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const links = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.properties"), href: "/properties-for-sale" },
    { name: t("nav.developments"), href: "/new-developments" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.about"), href: "/about-us" },
    { name: t("nav.contact"), href: "/contact-us" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-[#013b7a]/50 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Area */}
        <div className="w-[200px] md:w-[274px]">
          <Link href="/" className="block">
              <img 
                src="/wanda_logo_horizontal.png" 
                alt="Wanda Estates" 
                className="w-full h-auto object-contain"
              />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6 items-center">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-bold uppercase hover:text-[#e09900] transition-colors">
                {link.name}
            </Link>
          ))}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-[#e09900] hover:bg-white/10 ml-4 font-bold uppercase flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {currentLang.code.toUpperCase()}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white text-[#2c3e50]">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                >
                  <span className="text-lg">{lang.flag}</span>
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:text-[#e09900] hover:bg-white/10 font-bold uppercase p-0 h-auto flex items-center gap-1"
                >
                  {currentLang.code.toUpperCase()}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white text-[#2c3e50]">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span className="text-lg">{lang.flag}</span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <button 
              className="text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#013b7a] p-4 absolute top-full left-0 right-0 border-t border-white/10 z-50">
          <div className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-sm font-bold uppercase text-white hover:text-[#e09900]"
                onClick={() => setIsOpen(false)}
              >
                  {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
