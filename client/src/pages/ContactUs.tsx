import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#2c3e50] text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-4">Contact Us</h1>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            Get in touch with our team to discuss your property requirements.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-serif text-[#2c3e50] uppercase mb-8">Get In Touch</h2>
              <p className="text-gray-600 mb-10 leading-relaxed">
                Whether you're looking to buy, sell, or invest in Marbella real estate, our team is here to assist you. 
                Visit our office or contact us via phone or email.
              </p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#f0f9ff] text-[#2ea3f2] flex items-center justify-center mr-6 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[#2c3e50] font-bold uppercase tracking-wider mb-2">Visit Us</h4>
                    <p className="text-gray-600">
                      El Rodeo Alto Nº4<br />
                      Nueva Andalucía, 29660<br />
                      Marbella, Málaga, Spain
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#f0f9ff] text-[#2ea3f2] flex items-center justify-center mr-6 flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[#2c3e50] font-bold uppercase tracking-wider mb-2">Call Us</h4>
                    <p className="text-gray-600">
                      +34 952 000 000
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#f0f9ff] text-[#2ea3f2] flex items-center justify-center mr-6 flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[#2c3e50] font-bold uppercase tracking-wider mb-2">Email Us</h4>
                    <p className="text-gray-600">
                      info@wandaestates.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#f0f9ff] text-[#2ea3f2] flex items-center justify-center mr-6 flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[#2c3e50] font-bold uppercase tracking-wider mb-2">Opening Hours</h4>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 - 18:00<br />
                      Saturday: By Appointment<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#f9f9f9] p-10 border border-gray-100">
              <h2 className="text-2xl font-serif text-[#2c3e50] uppercase mb-8">Send a Message</h2>
              <form className="space-y-6">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Name</label>
                    <input type="text" className="w-full bg-white border border-gray-200 p-4 text-gray-700 focus:outline-none focus:border-[#2ea3f2]" placeholder="Your Name" />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Email Address</label>
                    <input type="email" className="w-full bg-white border border-gray-200 p-4 text-gray-700 focus:outline-none focus:border-[#2ea3f2]" placeholder="Your Email" />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Phone</label>
                    <input type="tel" className="w-full bg-white border border-gray-200 p-4 text-gray-700 focus:outline-none focus:border-[#2ea3f2]" placeholder="Your Phone Number" />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Message</label>
                    <textarea className="w-full bg-white border border-gray-200 p-4 text-gray-700 focus:outline-none focus:border-[#2ea3f2] h-32" placeholder="How can we help you?"></textarea>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                    <div className="text-gray-600 text-sm">
                        <span className="font-bold">10 + 4 = </span>
                        <input type="text" className="w-16 border border-gray-300 ml-2 p-1 bg-white" />
                    </div>
                    <Button className="bg-[#2ea3f2] hover:bg-[#2ea3f2]/90 text-white rounded-none uppercase tracking-wider font-bold px-10 py-6">
                        Send Message
                    </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="h-[400px] w-full bg-gray-200">
         {/* Placeholder for Map */}
         <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500 font-bold uppercase tracking-widest">Google Map Placeholder</span>
         </div>
      </section>

      <Footer />
    </div>
  );
}
