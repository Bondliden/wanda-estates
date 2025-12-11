import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PropertiesForSale() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#2c3e50] text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-4">Properties for Sale</h1>
          <p className="text-lg font-light text-gray-300 max-w-2xl mx-auto">
            Discover our exclusive portfolio of luxury properties in Marbella and the Costa del Sol.
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="group border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#e09900] text-white text-xs font-bold uppercase tracking-widest px-3 py-1">
                      For Sale
                    </span>
                  </div>
                </div>
                
                <div className="p-6 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[#2c3e50] font-bold text-xl">{property.price}</span>
                  </div>
                  <h3 className="text-lg font-serif text-[#2c3e50] mb-2 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-[#e09900]" />
                    {property.location}
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-100 pt-4 text-gray-500 text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.beds} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.baths} Baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      <span>{property.sqm} m²</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline" className="w-full rounded-none border-gray-300 text-gray-500 hover:bg-[#2ea3f2] hover:text-white uppercase text-xs tracking-wider">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
