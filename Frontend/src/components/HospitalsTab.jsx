import { useState } from "react";

const hospitalLabels = {
  English: {
    title: "Nearby Hospitals",
    searchPlaceholder: "Enter your location",
    useCurrentLocation: "📍 Use Current Location",
    openMaps: "Shortest Walking Route",
    mapPreview: "Directions Preview",
    liveNotice: "Live hospital results open in Google Maps (no API key required).",
    distance: "Distance",
    phone: "Phone",
    address: "Address",
    emergency: "24/7 Emergency",
    rating: "Rating",
    call: "📞 Call",
    directions: "Get Directions",
    noResults: "No hospitals found nearby. Please check your location.",
  },
  Hindi: {
    title: "पास के अस्पताल",
    searchPlaceholder: "अपना स्थान दर्ज करें",
    useCurrentLocation: "📍 वर्तमान स्थान का उपयोग करें",
    openMaps: "सबसे छोटा पैदल मार्ग",
    mapPreview: "दिशा पूर्वावलोकन",
    liveNotice: "लाइव अस्पताल परिणाम Google Maps में खुलेंगे (API कुंजी आवश्यक नहीं)।",
    distance: "दूरी",
    phone: "फोन",
    address: "पता",
    emergency: "24/7 आपातकालीन",
    rating: "रेटिंग",
    call: "📞 कॉल करें",
    directions: "दिशा प्राप्त करें",
    noResults: "आपके पास कोई अस्पताल नहीं मिला। कृपया अपना स्थान जांचें।",
  },
  Telugu: {
    title: "సమీపంలో ఉన్న ఆసుపత్రులు",
    searchPlaceholder: "మీ స్థానాన్ని నమోదు చేయండి",
    useCurrentLocation: "📍 ప్రస్తుత స్థానాన్ని ఉపయోగించండి",
    openMaps: "అత్యల్ప నడక మార్గం",
    mapPreview: "దిశల ప్రివ్యూ",
    liveNotice: "లైవ్ ఆసుపత్రుల ఫలితాలు Google Maps‌లో తెరుచుకుంటాయి (API కీ అవసరం లేదు).",
    distance: "దూరం",
    phone: "ఫోన్",
    address: "చిరునామా",
    emergency: "24/7 ఎమర్జెన్సీ",
    rating: "రేటింగ్",
    call: "📞 కాల్ చేయండి",
    directions: "దిశలు పొందండి",
    noResults: "సమీపంలో ఆసుపత్రులు కనపడలేదు। దయచేసి మీ స్థానాన్ని చెక్ చేయండి.",
  },
};

const parseCoordinates = (value) => {
  const match = String(value || "").match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (!match) return null;
  return { lat: Number(match[1]), lng: Number(match[2]) };
};

const buildGoogleMapsUrl = (locationValue, coords) => {
  const base = "https://www.google.com/maps/dir/?api=1";
  const trimmed = String(locationValue || "").trim();

  if (coords) {
    const origin = `${coords.lat},${coords.lng}`;
    const destination = trimmed ? `hospitals near ${trimmed}` : "hospital";
    return `${base}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
  }

  if (!trimmed) {
    return `${base}&destination=hospital&travelmode=walking`;
  }

  return `${base}&origin=${encodeURIComponent(trimmed)}&destination=hospital&travelmode=walking`;
};

const buildGoogleMapsEmbedUrl = (locationValue, coords) => {
  const trimmed = String(locationValue || "").trim();

  if (coords) {
    const origin = `${coords.lat},${coords.lng}`;
    const destination = trimmed ? `hospitals near ${trimmed}` : "hospital";
    return `https://www.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&dirflg=w&output=embed`;
  }

  if (!trimmed) {
    return "https://www.google.com/maps?q=hospitals&output=embed";
  }

  const destination = `hospitals near ${trimmed}`;
  return `https://www.google.com/maps?saddr=${encodeURIComponent(trimmed)}&daddr=${encodeURIComponent(destination)}&dirflg=w&output=embed`;
};

export function HospitalsTab({ language = "English" }) {
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const labels = hospitalLabels[language];
  const mapsUrl = buildGoogleMapsUrl(location, coords);
  const mapsEmbedUrl = buildGoogleMapsEmbedUrl(location, coords);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setCoords({ lat: latitude, lng: longitude });
      });
    }
  };

  return (
    <div className="hospitals-container">
      <h1 className="tab-title">{labels.title}</h1>

      <div className="location-search">
        <input
          type="text"
          placeholder={labels.searchPlaceholder}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="location-input"
        />
        <button className="location-button" onClick={handleGetLocation}>
          {labels.useCurrentLocation}
        </button>
      </div>

      <div className="hospitals-grid">
        <div className="hospital-card">
          <div className="hospital-header">
            <h3 className="hospital-name">{labels.title}</h3>
            <span className="emergency-badge">{labels.emergency}</span>
          </div>
          <div className="hospital-info">
            <p className="info-value address-text">{labels.liveNotice}</p>
          </div>
          <div className="hospital-actions">
            <button
              className="action-button directions"
              onClick={() => window.open(mapsUrl, "_blank")}
            >
              {labels.openMaps}
            </button>
          </div>
        </div>

        <div className="hospital-card map-preview-card">
          <div className="hospital-header">
            <h3 className="hospital-name">{labels.mapPreview}</h3>
          </div>
          <div className="hospital-info">
            <iframe
              title="Nearby hospitals map"
              src={mapsEmbedUrl}
              className="map-preview-frame"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
