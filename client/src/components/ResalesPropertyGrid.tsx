import { useState, useEffect } from "react";
import { Bed, Bath, Maximize, MapPin, Search, MessageCircle, ArrowUpDown, Map as MapIcon, Grid } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import PropertyMap from "./PropertyMap";
import { Link } from "wouter";

interface ResalesProperty {
    Id: string;
    Reference: string;
    Price: number;
    Currency: string;
    Beds: number;
    Baths: number;
    BuiltArea: number;
    PlotArea?: number;
    TerraceArea?: number;
    Location: string;
    MainImage: string;
    TypeName: string;
    Description: string;
    GpsX?: string;
    GpsY?: string;
}

export default function ResalesPropertyGrid() {
    const { t, i18n } = useTranslation();
    const isSpanish = i18n.language === "es";

    const [properties, setProperties] = useState<ResalesProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

    // Search parameters state based on User Requirements
    const [filters, setFilters] = useState({
        minPrice: "750000",
        maxPrice: "50000000",
        p_location: "",
        p_beds: "",
        p_baths: "",
        p_minTerrace: "",
        p_minPlot: "",
        p_sort: "2", // Default to Date Desc (Latest)
        shuffle: "false"
    });

    const fetchProperties = async (searchFilters = filters) => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                p_min: searchFilters.minPrice,
                p_max: searchFilters.maxPrice,
                p_sort: searchFilters.p_sort,
            };

            if (searchFilters.p_location) params.p_location = searchFilters.p_location;
            if (searchFilters.p_beds) params.p_beds = searchFilters.p_beds;
            if (searchFilters.p_baths) params.p_baths = searchFilters.p_baths;
            // Note: Terrace and Plot might need specific API parameter names from V6 docs.
            // Using common naming conventions if not explicit.
            if (searchFilters.p_minTerrace) params.p_minTerrace = searchFilters.p_minTerrace;
            if (searchFilters.p_minPlot) params.p_minPlot = searchFilters.p_minPlot;
            if (searchFilters.shuffle === "true") params.shuffle = "true";

            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`/api/properties?${queryParams}`);
            const data = await response.json();

            if (data.success && data.data) {
                const propsArray = data.data.Property || [];
                setProperties(Array.isArray(propsArray) ? propsArray : [propsArray]);
            } else {
                setProperties([]);
            }
        } catch (err) {
            console.error("Failed to load properties:", err);
            setError("Unable to load properties. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProperties(filters);
    };

    const getWhatsAppUrl = (ref: string) => {
        const phone = "34600000000"; // Placeholder - Wanda Estates Phone
        const message = encodeURIComponent(`Hola Wanda Estates, me interesa la propiedad con referencia ${ref}. ¿Podrían darme más información?`);
        return `https://wa.me/${phone}?text=${message}`;
    };

    return (
        <div className="w-full">
            {/* Advanced Search Bar */}
            <div className="bg-white p-8 shadow-xl border border-gray-100 mb-8 rounded-sm">
                <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#2B5F8C] mb-2">Municipio</label>
                            <select
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.p_location}
                                onChange={(e) => setFilters({ ...filters, p_location: e.target.value })}
                            >
                                <option value="">Todos los Municipios</option>
                                <option value="Marbella">Marbella</option>
                                <option value="Benahavis">Benahavís</option>
                                <option value="Estepona">Estepona</option>
                                <option value="Sotogrande">Sotogrande</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#2B5F8C] mb-2">Precio Mín (€)</label>
                            <input
                                type="number"
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.minPrice}
                                step="50000"
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#2B5F8C] mb-2">Dormitorios</label>
                            <select
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.p_beds}
                                onChange={(e) => setFilters({ ...filters, p_beds: e.target.value })}
                            >
                                <option value="">Cualquiera</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#2B5F8C] mb-2">Ordenación</label>
                            <select
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.p_sort}
                                onChange={(e) => setFilters({ ...filters, p_sort: e.target.value })}
                            >
                                <option value="2">Más Recientes</option>
                                <option value="0">Precio: Menor a Mayor</option>
                                <option value="1">Precio: Mayor a Menor</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-50 pt-6">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all ${viewMode === 'grid' ? 'bg-[#2B5F8C] text-white' : 'text-gray-400 hover:text-[#2B5F8C]'}`}
                            >
                                <Grid className="w-4 h-4" /> {isSpanish ? 'Cuadrícula' : 'Grid'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('map')}
                                className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all ${viewMode === 'map' ? 'bg-[#2B5F8C] text-white' : 'text-gray-400 hover:text-[#2B5F8C]'}`}
                            >
                                <MapIcon className="w-4 h-4" /> {isSpanish ? 'Mapa' : 'Map'}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="bg-[#C9A961] hover:bg-[#a88d51] text-white rounded-none uppercase text-xs tracking-widest font-bold h-12 px-10 shadow-lg"
                        >
                            <Search className="w-4 h-4 mr-2" /> Buscar Propiedades
                        </Button>
                    </div>
                </form>
            </div>

            {viewMode === 'map' ? (
                <div className="mb-16">
                    <PropertyMap properties={properties} />
                </div>
            ) : null}

            {error ? (
                <div className="text-center p-12 bg-red-50 text-red-600 border border-red-100 font-serif">
                    <p>{error}</p>
                    <Button onClick={() => fetchProperties()} variant="outline" className="mt-4 rounded-none border-[#2B5F8C] text-[#2B5F8C]">Reintentar</Button>
                </div>
            ) : loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse bg-white border border-gray-100 h-[550px]">
                            <div className="bg-gray-100 h-[300px] w-full" />
                            <div className="p-8">
                                <div className="bg-gray-100 h-6 w-1/4 mb-4" />
                                <div className="bg-gray-100 h-10 w-3/4 mb-4" />
                                <div className="bg-gray-100 h-4 w-full mb-2" />
                                <div className="bg-gray-100 h-4 w-2/3 mb-8" />
                                <div className="flex gap-2">
                                    <div className="bg-gray-100 h-10 flex-grow" />
                                    <div className="bg-gray-100 h-10 w-12" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center p-20 bg-gray-50 border border-gray-100 rounded-sm">
                    <p className="text-gray-400 text-xl font-serif italic">No se encontraron propiedades de lujo con estos criterios.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {properties.map((property) => (
                        <div key={property.Id} className="group border border-gray-100 hover:shadow-2xl transition-all duration-500 bg-white flex flex-col h-full overflow-hidden">
                            <Link href={`/properties/${property.Id}`}>
                                <div className="relative overflow-hidden aspect-[4/3] cursor-pointer">
                                    <img
                                        src={property.MainImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"}
                                        alt={property.TypeName}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-[#2B5F8C]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2">
                                            {property.Reference}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <p className="text-white text-xs uppercase tracking-widest font-bold">Ver Detalles</p>
                                    </div>
                                </div>
                            </Link>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[#2B5F8C] font-serif text-2xl font-light">
                                        €{property.Price?.toLocaleString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-serif text-[#1a1a1a] mb-2 uppercase tracking-wide group-hover:text-[#C9A961] transition-colors">{property.TypeName}</h3>
                                <div className="flex items-center text-gray-400 text-xs mb-6 uppercase tracking-widest">
                                    <MapPin className="w-3 h-3 mr-2 text-[#C9A961]" />
                                    {property.Location}
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Bed className="w-4 h-4 text-[#C9A961]" />
                                        <span>{property.Beds || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Bath className="w-4 h-4 text-[#C9A961]" />
                                        <span>{property.Baths || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Maximize className="w-4 h-4 text-[#C9A961]" />
                                        <span>{property.BuiltArea || 0} m²</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <Link href={`/properties/${property.Id}`} className="flex-grow">
                                        <Button className="w-full bg-transparent border border-[#2B5F8C] text-[#2B5F8C] hover:bg-[#2B5F8C] hover:text-white rounded-none uppercase text-[10px] tracking-[0.2em] font-bold h-12 transition-all">
                                            Ver Ficha
                                        </Button>
                                    </Link>
                                    <a
                                        href={getWhatsAppUrl(property.Reference)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 flex items-center justify-center transition-colors"
                                        title="Contactar por WhatsApp"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
