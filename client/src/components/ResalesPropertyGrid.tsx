import { useState, useEffect, useCallback } from "react";
import { Bed, Bath, Maximize, MapPin, Search, MessageCircle, ChevronLeft, ChevronRight as ChevronRightIcon, Grid, Map as MapIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
// import PropertyMap from "./PropertyMap";
import { Link } from "wouter";

const WHATSAPP_PHONE = "34641113518";

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

interface PaginationInfo {
    CurrentPage: number;
    PageSize: number;
    TotalProperties: number;
    TotalPages: number;
}

interface ResalesPropertyGridProps {
    isNewDevelopment?: boolean;
    initialLocation?: string;
}

export default function ResalesPropertyGrid({ isNewDevelopment = false, initialLocation = "" }: ResalesPropertyGridProps) {
    console.log("[ResalesPropertyGrid] Rendering start", { isNewDevelopment, initialLocation });
    const { t } = useTranslation();

    const [properties, setProperties] = useState<ResalesProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [pagination, setPagination] = useState<PaginationInfo>({
        CurrentPage: 1, PageSize: 18, TotalProperties: 0, TotalPages: 1
    });

    const [filters, setFilters] = useState({
        minPrice: "1500000",
        maxPrice: "50000000",
        p_location: initialLocation,
        p_beds: "",
        p_baths: "",
        p_PropertyTypes: "",
        p_sort: "commission",
        p_newBuild: isNewDevelopment ? "1" : "",
        shuffle: "false"
    });

    useEffect(() => {
        if (initialLocation) {
            setFilters(prev => ({ ...prev, p_location: initialLocation }));
        }
    }, [initialLocation]);

    const fetchProperties = useCallback(async (searchFilters = filters, page = 1) => {
        console.log("[ResalesPropertyGrid] fetchProperties start", { searchFilters, page });
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                p_min: searchFilters.minPrice,
                p_max: searchFilters.maxPrice,
                p_sort: searchFilters.p_sort,
                p_PageSize: '18',
                p_PageIndex: String(page),
            };

            if (searchFilters.p_location) params.p_location = searchFilters.p_location;
            if (searchFilters.p_beds) params.p_beds = searchFilters.p_beds;
            if (searchFilters.p_baths) params.p_baths = searchFilters.p_baths;
            if (searchFilters.p_PropertyTypes) params.p_PropertyTypes = searchFilters.p_PropertyTypes;
            if (searchFilters.p_newBuild) params.p_newBuild = searchFilters.p_newBuild;
            if (searchFilters.shuffle === "true") params.shuffle = "true";

            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`/api/properties?${queryParams}`);
            const data = await response.json();

            if (data.success && data.data) {
                const propsArray = data.data.Property || [];
                setProperties(Array.isArray(propsArray) ? propsArray : [propsArray]);
                if (data.data.Pagination) {
                    setPagination(data.data.Pagination);
                }
            } else {
                setProperties([]);
                setError(data.error || "No properties found matching your criteria.");
            }
        } catch (err: any) {
            console.error("Failed to load properties:", err);
            setError(err.message || "Unable to load properties. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties(filters, 1);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProperties(filters, 1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.TotalPages) return;
        fetchProperties(filters, newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getWhatsAppUrl = (ref: string) => {
        const message = encodeURIComponent(`Hola Wanda Estates, me interesa la propiedad con referencia ${ref}. ¿Podrían darme más información?`);
        return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
    };

    return (
        <div className="w-full">
            {/* Advanced Search Bar */}
            <div className="bg-white p-8 shadow-xl border border-gray-100 mb-8 rounded-sm">
                <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#2B5F8C] mb-2">{t("grid.municipality")}</label>
                            <select
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.p_location}
                                onChange={(e) => setFilters({ ...filters, p_location: e.target.value })}
                            >
                                <option value="">{t("grid.all_municipalities")}</option>
                                <option value="Marbella">Marbella</option>
                                <option value="Benahavis">Benahavís</option>
                                <option value="Estepona">Estepona</option>
                                <option value="Sotogrande">Sotogrande</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#2B5F8C] mb-2">{t("grid.min_price")}</label>
                            <input
                                type="number"
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.minPrice}
                                step="50000"
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#2B5F8C] mb-2">{t("grid.max_price", "Max Price")}</label>
                            <input
                                type="number"
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.maxPrice}
                                step="100000"
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#2B5F8C] mb-2">{t("grid.property_type", "Type")}</label>
                            <select
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.p_PropertyTypes}
                                onChange={(e) => setFilters({ ...filters, p_PropertyTypes: e.target.value })}
                            >
                                <option value="">{t("grid.any")}</option>
                                <option value="Villa">Villa</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Penthouse">Penthouse</option>
                                <option value="Townhouse">Townhouse</option>
                                <option value="Finca">Finca / Country House</option>
                                <option value="Plot">Plot / Land</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#2B5F8C] mb-2">{t("grid.bedrooms")}</label>
                            <select
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.p_beds}
                                onChange={(e) => setFilters({ ...filters, p_beds: e.target.value })}
                            >
                                <option value="">{t("grid.any")}</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
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
                                <Grid className="w-4 h-4" /> {t("grid.view_grid")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('map')}
                                className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all ${viewMode === 'map' ? 'bg-[#2B5F8C] text-white' : 'text-gray-400 hover:text-[#2B5F8C]'}`}
                            >
                                <MapIcon className="w-4 h-4" /> {t("grid.view_map")}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="bg-[#C9A961] hover:bg-[#a88d51] text-white rounded-none uppercase text-xs tracking-widest font-bold h-12 px-10 shadow-lg"
                        >
                            <Search className="w-4 h-4 mr-2" /> {t("grid.search")}
                        </Button>
                    </div>
                </form>
            </div>

            {viewMode === 'map' ? (
                <div className="mb-16">
                    {/* Assuming PropertyMap is available and accepts properties */}
                    {/* <PropertyMap properties={properties} /> */}
                    {/* If you intended to render ResalesPropertyGrid recursively, ensure it's handled correctly to avoid infinite loops or unexpected behavior. */}
                    {/* <ResalesPropertyGrid initialLocation={selectedNeighborhood || ""} /> */}
                    <div className="text-center p-12 bg-gray-50 text-gray-600 border border-gray-100 font-serif">
                        <p>Map view is under development.</p>
                    </div>
                </div>
            ) : null}

            {error ? (
                <div className="text-center p-12 bg-red-50 text-red-600 border border-red-100 font-serif">
                    <p>{error}</p>
                    <Button onClick={() => fetchProperties(filters)} variant="outline" className="mt-4 rounded-none border-[#2B5F8C] text-[#2B5F8C]">{t("grid.retry")}</Button>
                </div>
            ) : loading ? (
                <div className="flex flex-col items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A961] mb-4"></div>
                    <p className="text-[#2B5F8C] font-serif italic">{t("grid.loading")}</p>
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center p-20 bg-gray-50 border border-gray-100 rounded-sm">
                    <p className="text-gray-400 text-xl font-serif italic">{t("grid.no_results")}</p>
                </div>
            ) : (
                <>
                    {/* Results count */}
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-gray-500">
                            {t("grid.showing", "Showing")} <span className="font-bold text-[#2B5F8C]">{properties.length}</span> {t("grid.of", "of")} <span className="font-bold text-[#2B5F8C]">{pagination.TotalProperties}</span> {t("grid.properties_label", "properties")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {properties.filter(p => p.MainImage).map((property) => (
                            <div key={property.Id} className="group border border-gray-100 hover:shadow-2xl transition-all duration-500 bg-white flex flex-col h-full overflow-hidden">
                                <Link href={`/properties/${property.Id}`}>
                                    <div className="relative overflow-hidden aspect-[16/9] cursor-pointer">
                                        <img
                                            src={property.MainImage}
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
                                            <p className="text-white text-xs uppercase tracking-widest font-bold">{t("grid.view_details")}</p>
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[#28a745] font-bold text-2xl font-serif">
                                            €{property.Price?.toLocaleString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-serif text-[#1a1a1a] mb-2 uppercase tracking-wide group-hover:text-[#C9A961] transition-colors">{property.TypeName}</h3>
                                    <div className="flex items-center text-[#fd7e14] text-xs mb-6 uppercase tracking-widest font-semibold">
                                        <MapPin className="w-3 h-3 mr-2" />
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
                                                {t("grid.view_details")}
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

                    {/* Pagination */}
                    {pagination.TotalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-16 pb-4">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.CurrentPage - 1)}
                                disabled={pagination.CurrentPage <= 1}
                                className="rounded-none border-[#2B5F8C] text-[#2B5F8C] hover:bg-[#2B5F8C] hover:text-white disabled:opacity-30 h-12 px-6"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" /> {t("grid.prev", "Previous")}
                            </Button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(pagination.TotalPages, 7) }, (_, i) => {
                                    let pageNum: number;
                                    if (pagination.TotalPages <= 7) {
                                        pageNum = i + 1;
                                    } else if (pagination.CurrentPage <= 4) {
                                        pageNum = i + 1;
                                    } else if (pagination.CurrentPage >= pagination.TotalPages - 3) {
                                        pageNum = pagination.TotalPages - 6 + i;
                                    } else {
                                        pageNum = pagination.CurrentPage - 3 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 text-sm font-bold transition-all ${pageNum === pagination.CurrentPage
                                                ? 'bg-[#2B5F8C] text-white'
                                                : 'text-[#2B5F8C] hover:bg-gray-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.CurrentPage + 1)}
                                disabled={pagination.CurrentPage >= pagination.TotalPages}
                                className="rounded-none border-[#2B5F8C] text-[#2B5F8C] hover:bg-[#2B5F8C] hover:text-white disabled:opacity-30 h-12 px-6"
                            >
                                {t("grid.next", "Next")} <ChevronRightIcon className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
