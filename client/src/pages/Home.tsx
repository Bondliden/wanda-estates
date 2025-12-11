import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

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
                    <h2 className="text-3xl font-serif text-[#2c3e50] mb-2 uppercase">Luxury Apartments</h2>
                    <h3 className="text-xl font-light text-gray-500 mb-4">Within a private estate</h3>
                    <p className="text-[#e09900] font-semibold">Prices from €299,000</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    <div className="col-span-1 md:col-span-1">
                        <img 
                            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop" 
                            alt="Luxury Apartments Exterior" 
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
      
      <Footer />
    </div>
  );
}
