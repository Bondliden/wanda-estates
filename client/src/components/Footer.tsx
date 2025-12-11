import { Link } from "wouter";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <a className="text-2xl font-serif font-bold tracking-widest uppercase block mb-6">
                Wanda<span className="text-secondary">Estates</span>
              </a>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Wanda Estate Property Group is a dynamic real estate agency with a refreshing approach to luxury investments in Marbella and the Costa del Sol.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-white hover:text-secondary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-white hover:text-secondary transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-secondary">Discover</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Property Search</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Developments</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investment Opportunities</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Commercial Real Estate</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-secondary">Company</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog & News</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-secondary">Contact</h4>
            <address className="not-italic text-sm text-gray-300 space-y-4">
              <p>Marbella, Spain</p>
              <p>info@wandaestates.com</p>
              <p>+34 952 000 000</p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} Wanda Estates. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
