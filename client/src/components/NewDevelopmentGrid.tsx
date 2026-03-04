import { useState, useEffect, useCallback } from "react";
import { MapPin, Search, ChevronLeft, ChevronRight, CalendarDays, Home, Euro } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const WHATSAPP_PHONE = "34641113518";

interface NewDevelopment {
    Id: string;
    Reference: string;
    Name: string;
    Location: string;
    Area: string;
    MainImage: string;
    Description: string;
    PriceFrom?: number;
    PriceTo?: number;
    Price?: number;
    CompletionDate?: string;
    DeliveryDate?: string;
    Beds?: string;
    Baths?: string;
    BuiltAreaFrom?: number;
    BuiltAreaTo?: number;
    BuiltArea?: number;
    TypeName?: string;
    Units?: number;
    Pictures?: {
        Picture: any[];
    };
}

interface PaginationInfo {
    CurrentPage: number;
    PageSize: number;
    TotalProperties: number;
    TotalPages: number;
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
                    {/* New Development Badge */}
                    <span className="bg-[#e09900] ml-2 text-white text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 shadow-lg">
                        {property.Id ? 'Obra Nueva' : 'New Development'}
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

export default function NewDevelopmentGrid() {
    const { t, i18n } = useTranslation();
    const isSpanish = i18n.language === "es";

    const [developments, setDevelopments] = useState<NewDevelopment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        CurrentPage: 1, PageSize: 18, TotalProperties: 0, TotalPages: 1
    });

    const [filters, setFilters] = useState({
        p_location: "",
        p_min: "450000",
        p_max: "",
    });

    const fetchDevelopments = useCallback(async (searchFilters = filters, page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {
                p_PageSize: '18',
                p_PageIndex: String(page),
            };

            if (searchFilters.p_location) params.p_location = searchFilters.p_location;
            if (searchFilters.p_min) params.p_min = searchFilters.p_min;
            if (searchFilters.p_max) params.p_max = searchFilters.p_max;

            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`/api/new-developments?${queryParams}`);
            const data = await response.json();

            if (data.success && data.data) {
                const devsArray = data.data.NewDevelopment || data.data.Property || [];
                setDevelopments(Array.isArray(devsArray) ? devsArray : [devsArray]);
                if (data.data.Pagination) {
                    setPagination(data.data.Pagination);
                }
            } else {
                setDevelopments([]);
            }
        } catch (err) {
            console.error("Failed to load new developments:", err);
            setError(isSpanish ? "No se pudieron cargar las promociones." : "Unable to load developments.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDevelopments(filters, 1);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchDevelopments(filters, 1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.TotalPages) return;
        fetchDevelopments(filters, newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatPrice = (dev: NewDevelopment): string => {
        if (dev.PriceFrom && dev.PriceTo) {
            return `€${dev.PriceFrom.toLocaleString()} - €${dev.PriceTo.toLocaleString()}`;
        }
        if (dev.PriceFrom) return `${isSpanish ? 'Desde' : 'From'} €${dev.PriceFrom.toLocaleString()}`;
        if (dev.Price) return `€${dev.Price.toLocaleString()}`;
        return isSpanish ? 'Consultar precio' : 'Price on request';
    };

    const getDeliveryDate = (dev: NewDevelopment): string | null => {
        const date = dev.CompletionDate || dev.DeliveryDate;
        if (!date) return null;
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) return date;
            return d.toLocaleDateString(isSpanish ? 'es-ES' : 'en-GB', { year: 'numeric', month: 'long' });
        } catch {
            return date;
        }
    };

    const getMainImage = (dev: NewDevelopment): string | null => {
        if (dev.MainImage) return dev.MainImage;
        const pics = dev.Pictures?.Picture;
        if (Array.isArray(pics) && pics.length > 0) return pics[0].PictureURL || pics[0].HighResURL;
        return null;
    };

    return (
        <div className="w-full">
            {/* Search Filters */}
            <div className="bg-white p-8 shadow-xl border border-gray-100 mb-8 rounded-sm">
                <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                value={filters.p_min}
                                step="50000"
                                placeholder="€ Min"
                                onChange={(e) => setFilters({ ...filters, p_min: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#2B5F8C] mb-2">{t("grid.max_price", "Max Price")}</label>
                            <input
                                type="number"
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C9A961] bg-transparent text-sm"
                                value={filters.p_max}
                                step="100000"
                                placeholder="€ Max"
                                onChange={(e) => setFilters({ ...filters, p_max: e.target.value })}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="submit"
                                className="w-full bg-[#C9A961] hover:bg-[#a88d51] text-white rounded-none uppercase text-xs tracking-widest font-bold h-12 shadow-lg"
                            >
                                <Search className="w-4 h-4 mr-2" /> {t("grid.search")}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {error ? (
                <div className="text-center p-12 bg-red-50 text-red-600 border border-red-100 font-serif">
                    <p>{error}</p>
                    <Button onClick={() => fetchDevelopments(filters)} variant="outline" className="mt-4 rounded-none border-[#2B5F8C] text-[#2B5F8C]">{t("grid.retry")}</Button>
                </div>
            ) : loading ? (
                <div className="flex flex-col items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A961] mb-4"></div>
                    <p className="text-[#2B5F8C] font-serif italic">{t("grid.loading")}</p>
                </div>
            ) : developments.length === 0 ? (
                <div className="text-center p-20 bg-gray-50 border border-gray-100 rounded-sm">
                    <p className="text-gray-400 text-xl font-serif italic">
                        {isSpanish ? 'No se encontraron promociones con esos filtros.' : 'No developments found matching your criteria.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-gray-500">
                            {t("grid.showing", "Showing")} <span className="font-bold text-[#2B5F8C]">{developments.length}</span> {t("grid.developments_label", "developments")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {developments.map((dev) => {



                            return (
                                <div key={dev.Id || dev.Reference} className="group border border-gray-100 hover:shadow-2xl transition-all duration-500 bg-white flex flex-col h-full overflow-hidden">
                                    <PropertyCardCarousel property={dev} t={t} />

                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-lg font-serif text-[#1a1a1a] mb-3 uppercase tracking-wide group-hover:text-[#C9A961] transition-colors leading-tight">
                                            {dev.Name || dev.TypeName || 'New Development'}
                                        </h3>

                                        <div className="flex items-center text-[#fd7e14] text-xs mb-4 uppercase tracking-widest font-semibold">
                                            <MapPin className="w-3 h-3 mr-2" />
                                            {dev.Location || dev.Area}
                                        </div>

                                        {/* Price Range */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <Euro className="w-4 h-4 text-[#28a745]" />
                                            <span className="text-[#28a745] font-bold text-lg font-serif">
                                                {formatPrice(dev)}
                                            </span>
                                        </div>

                                        {/* Delivery Date */}
                                        {getDeliveryDate(dev) && (
                                            <div className="flex items-center gap-2 mb-4">
                                                <CalendarDays className="w-4 h-4 text-[#2B5F8C]" />
                                                <span className="text-xs text-gray-500 uppercase tracking-widest">
                                                    {isSpanish ? 'Entrega' : 'Delivery'}: <span className="font-bold text-[#2B5F8C]">{getDeliveryDate(dev)}</span>
                                                </span>
                                            </div>
                                        )}

                                        {/* Sizes */}
                                        {(dev.BuiltAreaFrom || dev.BuiltArea) && (
                                            <div className="flex items-center gap-2 mb-4">
                                                <Home className="w-4 h-4 text-[#C9A961]" />
                                                <span className="text-xs text-gray-500">
                                                    {dev.BuiltAreaFrom && dev.BuiltAreaTo
                                                        ? `${dev.BuiltAreaFrom} - ${dev.BuiltAreaTo} m²`
                                                        : `${dev.BuiltArea || dev.BuiltAreaFrom} m²`
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-6">
                                            <Link href={`/properties/${dev.Id}`}>
                                                <Button className="w-full bg-[#2B5F8C] hover:bg-[#1a4a6e] text-white rounded-none uppercase text-[10px] tracking-[0.2em] font-bold h-12 transition-all">
                                                    {isSpanish ? 'Ver Promoción' : 'View Development'}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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

                            <span className="text-sm text-gray-500 font-semibold">
                                {pagination.CurrentPage} / {pagination.TotalPages}
                            </span>

                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.CurrentPage + 1)}
                                disabled={pagination.CurrentPage >= pagination.TotalPages}
                                className="rounded-none border-[#2B5F8C] text-[#2B5F8C] hover:bg-[#2B5F8C] hover:text-white disabled:opacity-30 h-12 px-6"
                            >
                                {t("grid.next", "Next")} <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
