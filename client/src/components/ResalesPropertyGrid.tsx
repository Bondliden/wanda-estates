import { useState, useEffect, useCallback } from "react";
import { Bed, Bath, Maximize, MapPin, Search, MessageCircle, ChevronLeft, ChevronRight as ChevronRightIcon, Grid, Map as MapIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import PropertyMap from "./PropertyMap";
import { Link } from "wouter";
import { RESALES_LOCATIONS, RESALES_FEATURES } from "@/lib/resales-metadata";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const WHATSAPP_PHONE = "34641113518";

// Simple placeholder image
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='16' fill='%23666' text-anchor='middle' dominant-baseline='middle'%3EProperty Image%3C/text%3E%3C/svg%3E";

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
    Images?: string[];
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


// Extracted Carousel Component to manage its own state
function PropertyCardCarousel({ property, t }: { property: any, t: any }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Normalize images whether coming from new developments or resales
    let images: string[] = [];
    if (property.Images && property.Images.length > 0) {
        images = property.Images;
    } else if (property.Pictures && property.Pictures.Picture && Array.isArray(property.Pictures.Picture)) {
        images = property.Pictures.Picture.map((p: any) => p.HighResURL || p.PictureURL);
        if (property.MainImage && !images.includes(property.MainImage)) {
            images.unshift(property.MainImage);
        }
    } else {
        images = property.MainImage ? [property.MainImage] : [PLACEHOLDER_IMAGE];
    }

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev: number) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev: number) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative border-b overflow-hidden aspect-[16/9] cursor-pointer group/carousel">
            <Link href={`/properties/${property.Id || property.Reference}`}>
                <img
                    src={images[currentIndex] || PLACEHOLDER_IMAGE}
                    alt={property.TypeName || property.Name || 'Property'}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = PLACEHOLDER_IMAGE;
                    }}
                />
            </Link>
            {property.Reference && (
                <div className="absolute top-6 left-6 pointer-events-none z-20">
                    <span className="bg-[#2B5F8C]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 shadow-lg">
                        {property.Reference}
                    </span>
                </div>
            )}

            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
                        {images.slice(0, 15).map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`}
                            />
                        ))}
                    </div>
                </>
            )}

            <Link href={`/properties/${property.Id || property.Reference}`}>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                    <p className="text-white text-xs uppercase tracking-widest font-bold text-shadow-md">{t("grid.view_details") || 'Ver detalles'}</p>
                </div>
            </Link>
        </div>
    );
}

export default function ResalesPropertyGrid({ isNewDevelopment = false, initialLocation = "" }: ResalesPropertyGridProps) {
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
        shuffle: "false",
        p_MustHaveFeatures: [] as string[],
        p_NiceToHaveFeatures: [] as string[],
        p_RefId: "",
        searchMode: "sale" // sale, rent_long, rent_short
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

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
            if (searchFilters.p_RefId) params.p_RefId = searchFilters.p_RefId;
            if (searchFilters.p_MustHaveFeatures.length > 0) params.p_MustHaveFeatures = searchFilters.p_MustHaveFeatures.join(",");
            if (searchFilters.p_NiceToHaveFeatures.length > 0) params.p_NiceToHaveFeatures = searchFilters.p_NiceToHaveFeatures.join(",");

            // Adjust categories for rent if needed
            if (searchFilters.searchMode === "rent_long") params.p_RentalType = "LongTerm";
            if (searchFilters.searchMode === "rent_short") params.p_RentalType = "ShortTerm";

            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`/api/properties?${queryParams}`);
            const data = await response.json();

            if (data.success && data.data) {
                const propsArray = data.data.Property || [];
                const propertiesToSet = Array.isArray(propsArray) ? propsArray : [propsArray];
                console.log("[ResalesPropertyGrid] API Response:", {
                    totalProperties: propertiesToSet.length,
                    firstProperty: propertiesToSet[0],
                    hasImages: propertiesToSet.filter(p => p.MainImage).length
                });
                setProperties(propertiesToSet);
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
            {/* Final Advanced Search Bar */}
            <div className="bg-white p-6 shadow-2xl border border-gray-100 mb-8 rounded-sm">
                <form onSubmit={handleSearch} className="space-y-8">
                    {/* Search Mode Toggles */}
                    <div className="flex flex-wrap gap-8 pb-4 border-b border-gray-50">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="searchMode"
                                checked={filters.searchMode === "sale"}
                                onChange={() => setFilters({ ...filters, searchMode: "sale", p_newBuild: "" })}
                                className="w-4 h-4 accent-[#2B5F8C]"
                            />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-[#2B5F8C] transition-colors">En Venta</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="searchMode"
                                checked={filters.searchMode === "rent_long"}
                                onChange={() => setFilters({ ...filters, searchMode: "rent_long", p_newBuild: "" })}
                                className="w-4 h-4 accent-[#2B5F8C]"
                            />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-[#2B5F8C] transition-colors">Alquiler Larga Temporada</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {/* Ref ID */}
                        <div className="md:col-span-1 lg:col-span-1">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#2B5F8C] mb-3">Ref ID</label>
                            <input
                                type="text"
                                placeholder="Ej: R1234..."
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm placeholder:text-gray-300"
                                value={filters.p_RefId}
                                onChange={(e) => setFilters({ ...filters, p_RefId: e.target.value })}
                            />
                        </div>

                        {/* Location Popover */}
                        <div className="md:col-span-1 lg:col-span-1">
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#2B5F8C] mb-3">{t("grid.municipality")}</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start border-b border-gray-200 rounded-none px-0 py-2 text-sm font-normal text-gray-600 hover:bg-transparent hover:border-[#C9A961]">
                                        {filters.p_location || "Todas las áreas"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-4 bg-white shadow-2xl border-gray-100 max-h-[400px] overflow-y-auto">
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setFilters({ ...filters, p_location: "" })}
                                            className="w-full text-left p-2 hover:bg-gray-50 text-sm transition-colors"
                                        >
                                            Todas las áreas
                                        </button>
                                        {RESALES_LOCATIONS.map(loc => (
                                            <button
                                                key={loc}
                                                onClick={() => setFilters({ ...filters, p_location: loc })}
                                                className={`w-full text-left p-2 hover:bg-gray-50 text-sm transition-colors ${filters.p_location === loc ? 'text-[#C9A961] font-bold' : ''}`}
                                            >
                                                {loc}
                                            </button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Price Range */}
                        <div className="md:col-span-2 lg:col-span-2 lg:flex gap-4">
                            <div className="flex-grow">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#2B5F8C] mb-3">{t("grid.min_price")}</label>
                                <input
                                    type="number"
                                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                    value={filters.minPrice}
                                    step="100000"
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                />
                            </div>
                            <div className="flex-grow">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#2B5F8C] mb-3">{t("grid.max_price")}</label>
                                <input
                                    type="number"
                                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                    value={filters.maxPrice}
                                    step="200000"
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Type & Beds */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#2B5F8C] mb-3">Tipo</label>
                            <select
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.p_PropertyTypes}
                                onChange={(e) => setFilters({ ...filters, p_PropertyTypes: e.target.value })}
                            >
                                <option value="">Cualquiera</option>
                                <option value="Villa">Villa</option>
                                <option value="Apartment">Apartamento</option>
                                <option value="Penthouse">Ático</option>
                                <option value="Townhouse">Adosado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#2B5F8C] mb-3">Dorm.</label>
                            <select
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.p_beds}
                                onChange={(e) => setFilters({ ...filters, p_beds: e.target.value })}
                            >
                                <option value="">Elegir</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Filters Sections (Must have / Preferable) */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50 items-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="rounded-none border-gray-200 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-[#2B5F8C] transition-all">
                                    Debe Tener (+{filters.p_MustHaveFeatures.length})
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[800px] p-8 bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-gray-100 max-h-[600px] overflow-y-auto">
                                <h3 className="text-lg font-serif mb-6 border-b pb-4 text-[#2B5F8C]">Características Imprescindibles</h3>
                                <div className="grid grid-cols-3 gap-10">
                                    {Object.entries(RESALES_FEATURES).map(([category, features]) => (
                                        <div key={category} className="space-y-4">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A961]">{category}</h4>
                                            <div className="space-y-2">
                                                {features.map(feat => (
                                                    <label key={feat} className="flex items-center gap-3 cursor-pointer group">
                                                        <Checkbox
                                                            checked={filters.p_MustHaveFeatures.includes(feat)}
                                                            onCheckedChange={(checked) => {
                                                                const newFeats = checked
                                                                    ? [...filters.p_MustHaveFeatures, feat]
                                                                    : filters.p_MustHaveFeatures.filter(f => f !== feat);
                                                                setFilters({ ...filters, p_MustHaveFeatures: newFeats });
                                                            }}
                                                        />
                                                        <span className="text-[11px] text-gray-600 group-hover:text-[#2B5F8C] transition-colors">{feat}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="rounded-none border-gray-200 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-[#2B5F8C] transition-all">
                                    Características Opcionales (+{filters.p_NiceToHaveFeatures.length})
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[800px] p-8 bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-gray-100 max-h-[600px] overflow-y-auto">
                                <h3 className="text-lg font-serif mb-6 border-b pb-4 text-[#2B5F8C]">Gusto Preferente</h3>
                                <div className="grid grid-cols-3 gap-10">
                                    {Object.entries(RESALES_FEATURES).map(([category, features]) => (
                                        <div key={category} className="space-y-4">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A961]">{category}</h4>
                                            <div className="space-y-2">
                                                {features.map(feat => (
                                                    <label key={feat} className="flex items-center gap-3 cursor-pointer group">
                                                        <Checkbox
                                                            checked={filters.p_NiceToHaveFeatures.includes(feat)}
                                                            onCheckedChange={(checked) => {
                                                                const newFeats = checked
                                                                    ? [...filters.p_NiceToHaveFeatures, feat]
                                                                    : filters.p_NiceToHaveFeatures.filter(f => f !== feat);
                                                                setFilters({ ...filters, p_NiceToHaveFeatures: newFeats });
                                                            }}
                                                        />
                                                        <span className="text-[11px] text-gray-600 group-hover:text-[#2B5F8C] transition-colors">{feat}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <div className="ml-auto flex gap-6 items-center">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 transition-all ${viewMode === 'grid' ? 'text-[#2B5F8C]' : 'text-gray-300 hover:text-gray-400'}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('map')}
                                    className={`p-2 transition-all ${viewMode === 'map' ? 'text-[#2B5F8C]' : 'text-gray-300 hover:text-gray-400'}`}
                                >
                                    <MapIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <Button
                                type="submit"
                                className="bg-[#2B5F8C] hover:bg-[#1e4363] text-white rounded-none uppercase text-xs tracking-widest font-bold h-12 px-12 shadow-xl"
                            >
                                <Search className="w-4 h-4 mr-2" /> Buscar Propiedades
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {viewMode === 'map' ? (
                <div className="mb-16">
                    <PropertyMap properties={properties as any} />
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
                        {properties.map((property) => (
                            <div key={property.Id} className="group border border-gray-100 hover:shadow-2xl transition-all duration-500 bg-white flex flex-col h-full overflow-hidden">
                                <PropertyCardCarousel property={property} t={t} />

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
