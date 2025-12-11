import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        
        {/* Featured Property Section */}
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center mb-12">
                    <div className="w-full md:w-1/4">
                        <div className="bg-[#2c3e50] text-white py-3 px-6 text-center uppercase tracking-wider text-sm font-semibold">
                            Featured Property
                        </div>
                    </div>
                    <div className="w-full md:w-3/4 pl-0 md:pl-4 mt-4 md:mt-0">
                         <div className="h-px bg-gray-200 w-full"></div>
                    </div>
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif text-[#2c3e50] mb-2 uppercase">The Oakhill</h2>
                    <h3 className="text-xl font-light text-gray-500 mb-4">Luxury apartments within a private estate</h3>
                    <p className="text-[#e09900] font-semibold">Prices from €299,000</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    <div className="col-span-1 md:col-span-1">
                        <img 
                            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop" 
                            alt="The Oakhill Exterior" 
                            className="w-full h-64 object-cover"
                        />
                        <div className="text-center mt-4">
                            <Button variant="outline" className="rounded-none border-gray-300 text-gray-500 hover:bg-[#2ea3f2] hover:text-white uppercase text-xs tracking-wider px-6">
                                View Property
                            </Button>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-1">
                         {/* Grid of smaller images as seen in the HTML snippet */}
                         <img src="https://images.unsplash.com/photo-1600596542815-2495db98dada?q=80&w=2070&auto=format&fit=crop" className="w-full h-40 object-cover" />
                         <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" className="w-full h-40 object-cover" />
                         <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop" className="w-full h-40 object-cover" />
                         
                         <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop" className="w-full h-40 object-cover" />
                         <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" className="w-full h-40 object-cover" />
                         <img src="https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=2070&auto=format&fit=crop" className="w-full h-40 object-cover" />
                    </div>
                </div>
            </div>
        </section>

        {/* Our Services Section */}
        <section className="py-16 bg-[#f9f9f9]">
          <div className="container mx-auto px-4">
             <div className="flex flex-wrap items-center mb-12">
                    <div className="w-full md:w-1/4">
                        <div className="bg-[#2c3e50] text-white py-3 px-6 text-center uppercase tracking-wider text-sm font-semibold">
                            Our Services
                        </div>
                    </div>
                    <div className="w-full md:w-3/4 pl-0 md:pl-4 mt-4 md:mt-0">
                         <div className="h-px bg-gray-200 w-full"></div>
                    </div>
                </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="text-gray-600 space-y-6 text-justify">
                   <p>
                     Wanda Estate Property Group is a dynamic new real estate agency with a refreshing approach. Established by José Maria Esquerdo, Wanda Estate Property Group combines expertise from the real estate and financial sectors to help you make wise investments in real estate in Marbella and achieve maximum value from the property market.
                   </p>
                   <p>
                     We have a track record for delivering ambitious luxury resorts around the world for more than 20 years in hotel and real estate development, and significant experience tailoring investments to generate rapid profits for clients.
                   </p>
                </div>
                <div className="flex justify-center items-center">
                    {/* Placeholder for logo image seen in HTML */}
                    <div className="p-8 border border-gray-200 bg-white shadow-sm">
                        <h2 className="text-3xl font-serif text-primary uppercase tracking-widest font-bold">Wanda<span className="text-secondary">Estates</span></h2>
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div></div> {/* Empty left column */}
                    <div>
                        <h2 className="text-3xl font-serif text-[#2c3e50] mb-8 uppercase">Wanda Real Estate</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Name</label>
                                <input type="text" className="w-full bg-[#f8f8f8] border border-gray-200 p-3 text-gray-700 focus:outline-none focus:border-[#2ea3f2]" placeholder="Name" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Email Address</label>
                                <input type="email" className="w-full bg-[#f8f8f8] border border-gray-200 p-3 text-gray-700 focus:outline-none focus:border-[#2ea3f2]" placeholder="Email Address" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Phone</label>
                                <input type="tel" className="w-full bg-[#f8f8f8] border border-gray-200 p-3 text-gray-700 focus:outline-none focus:border-[#2ea3f2]" placeholder="Phone" />
                            </div>
                            
                            <div className="flex justify-between items-center pt-4">
                                <div className="text-gray-600">
                                    <span className="font-bold">10 + 4 = </span>
                                    <input type="text" className="w-16 border border-gray-300 ml-2 p-1" />
                                </div>
                                <Button className="bg-[#2ea3f2] hover:bg-[#2ea3f2]/90 text-white rounded-none uppercase tracking-wider font-bold px-8">
                                    Send
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>

      </main>
      
      {/* Footer from HTML */}
      <footer className="bg-[#f8f8f8] py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex justify-center md:justify-start">
                     <h2 className="text-2xl font-serif text-primary uppercase tracking-widest font-bold opacity-80">Wanda<span className="text-secondary">Estates</span></h2>
                </div>
                
                <div className="text-center">
                    <div className="flex justify-center space-x-4 mb-6">
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:border-[#2ea3f2] hover:text-[#2ea3f2] transition-colors">
                            <span className="sr-only">Facebook</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:border-[#2ea3f2] hover:text-[#2ea3f2] transition-colors">
                             <span className="sr-only">YouTube</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:border-[#2ea3f2] hover:text-[#2ea3f2] transition-colors">
                             <span className="sr-only">Instagram</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs uppercase text-gray-500 font-semibold">
                        <div className="space-y-2">
                             <a href="#" className="block hover:text-[#2ea3f2]">home</a>
                             <a href="#" className="block hover:text-[#2ea3f2]">properties for sale</a>
                             <a href="#" className="block hover:text-[#2ea3f2]">areas</a>
                        </div>
                        <div className="space-y-2">
                             <a href="#" className="block hover:text-[#2ea3f2]">about us</a>
                             <a href="#" className="block hover:text-[#2ea3f2]">new developments</a>
                             <a href="#" className="block hover:text-[#2ea3f2]">contact us</a>
                        </div>
                    </div>
                </div>

                <div className="text-gray-500 text-sm space-y-4">
                     <div className="flex items-start">
                        <span className="w-8 flex-shrink-0 text-center text-[#2ea3f2]"><svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></span>
                        <p>El Rodeo Alto Nº4, Nueva Andalucía, 29660, Marbella, Málaga</p>
                     </div>
                     <div className="flex items-center">
                        <span className="w-8 flex-shrink-0 text-center text-[#2ea3f2]"><svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></span>
                        <p>info@wandaestates.com</p>
                     </div>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
