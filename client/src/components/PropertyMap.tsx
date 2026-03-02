import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProperty {
    Id: string;
    Price: number;
    Currency: string;
    Location: string;
    MainImage: string;
    TypeName: string;
    GpsX?: string; // Latitude
    GpsY?: string; // Longitude
}

interface PropertyMapProps {
    properties: MapProperty[];
    center?: [number, number];
    zoom?: number;
}

export default function PropertyMap({ properties, center = [36.51, -4.88], zoom = 11 }: PropertyMapProps) {
    const { i18n } = useTranslation();
    const isSpanish = i18n.language === 'es';

    return (
        <div className="h-[500px] w-full shadow-inner border border-gray-100 relative z-0">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {properties.map((prop) => {
                    // Resales Online V6 often provides GpsX and GpsY
                    const lat = parseFloat(prop.GpsX || "0");
                    const lng = parseFloat(prop.GpsY || "0");

                    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null;

                    return (
                        <Marker key={prop.Id} position={[lat, lng]}>
                            <Popup className="property-popup">
                                <div className="w-48 overflow-hidden rounded-sm">
                                    <img
                                        src={prop.MainImage}
                                        alt={prop.TypeName}
                                        className="w-full h-32 object-cover mb-2"
                                    />
                                    <h4 className="font-serif text-[#2B5F8C] text-sm mb-1">{prop.TypeName}</h4>
                                    <p className="text-[#C9A961] font-bold text-sm mb-2">
                                        €{prop.Price.toLocaleString()}
                                    </p>
                                    <Link href={`/properties/${prop.Id}`}>
                                        <a className="text-xs uppercase tracking-wider text-[#2B5F8C] border-b border-[#2B5F8C] hover:text-[#C9A961] hover:border-[#C9A961]">
                                            {isSpanish ? 'Ver Propiedad' : 'View Property'}
                                        </a>
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Main Municipalities Labels (Approximate coordinates) */}
                <Marker position={[36.51, -4.88]} opacity={0}>
                    <Tooltip permanent>Marbella</Tooltip>
                </Marker>
                <Marker position={[36.52, -5.04]} opacity={0}>
                    <Tooltip permanent>Benahavís</Tooltip>
                </Marker>
                <Marker position={[36.43, -5.14]} opacity={0}>
                    <Tooltip permanent>Estepona</Tooltip>
                </Marker>
                <Marker position={[36.29, -5.28]} opacity={0}>
                    <Tooltip permanent>Sotogrande</Tooltip>
                </Marker>
            </MapContainer>
        </div>
    );
}
