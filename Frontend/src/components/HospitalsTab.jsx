import { useState } from "react";

const hospitalLabels = {
  English: {
    title: "Nearby Hospitals",
    searchPlaceholder: "Enter your location",
    distance: "Distance",
    phone: "Phone",
    address: "Address",
    emergency: "24/7 Emergency",
    rating: "Rating",
    directions: "Get Directions",
    noResults: "No hospitals found nearby. Please check your location.",
  },
  Hindi: {
    title: "पास के अस्पताल",
    searchPlaceholder: "अपना स्थान दर्ज करें",
    distance: "दूरी",
    phone: "फोन",
    address: "पता",
    emergency: "24/7 आपातकालीन",
    rating: "रेटिंग",
    directions: "दिशा प्राप्त करें",
    noResults: "आपके पास कोई अस्पताल नहीं मिला। कृपया अपना स्थान जांचें।",
  },
  Telugu: {
    title: "సమీపంలో ఉన్న ఆసుపత్రులు",
    searchPlaceholder: "మీ స్థానాన్ని నమోదు చేయండి",
    distance: "దూరం",
    phone: "ఫోన్",
    address: "చిరునామా",
    emergency: "24/7 ఎమర్జెన్సీ",
    rating: "రేటింగ్",
    directions: "దిశలు పొందండి",
    noResults: "సమీపంలో ఆసుపత్రులు కనపడలేదు। దయచేసి మీ స్థానాన్ని చెక్ చేయండి.",
  },
};

// Mock hospital data - in production, fetch from real API with geolocation
const mockHospitals = [
  {
    id: 1,
    name: "City Medical Center",
    distance: "0.5 km",
    phone: "+91-11-2345-6789",
    address: "123 Main St, Delhi",
    emergency: true,
    rating: 4.8,
    beds: 500,
  },
  {
    id: 2,
    name: "Apollo Hospital",
    distance: "1.2 km",
    phone: "+91-11-9876-5432",
    address: "456 Park Ave, Delhi",
    emergency: true,
    rating: 4.9,
    beds: 750,
  },
  {
    id: 3,
    name: "Prime Care Clinic",
    distance: "2.1 km",
    phone: "+91-11-5555-1111",
    address: "789 Health Ln, Delhi",
    emergency: false,
    rating: 4.5,
    beds: 100,
  },
  {
    id: 4,
    name: "Metro Hospital",
    distance: "2.8 km",
    phone: "+91-11-4444-2222",
    address: "321 Medical Blvd, Delhi",
    emergency: true,
    rating: 4.7,
    beds: 600,
  },
];

export function HospitalsTab({ language = "English" }) {
  const [location, setLocation] = useState("");
  const [hospitals] = useState(mockHospitals);
  const labels = hospitalLabels[language];

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
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
          📍 Use Current Location
        </button>
      </div>

      <div className="hospitals-grid">
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <div key={hospital.id} className="hospital-card">
              <div className="hospital-header">
                <h3 className="hospital-name">{hospital.name}</h3>
                {hospital.emergency && <span className="emergency-badge">{labels.emergency}</span>}
              </div>

              <div className="hospital-info">
                <div className="info-row">
                  <span className="info-label">{labels.distance}:</span>
                  <span className="info-value">{hospital.distance}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{labels.rating}:</span>
                  <span className="info-value">⭐ {hospital.rating}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{labels.address}:</span>
                  <span className="info-value address-text">{hospital.address}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{labels.phone}:</span>
                  <a href={`tel:${hospital.phone}`} className="phone-link">
                    {hospital.phone}
                  </a>
                </div>
              </div>

              <div className="hospital-actions">
                <button
                  className="action-button call"
                  onClick={() => window.location.href = `tel:${hospital.phone}`}
                >
                  📞 Call
                </button>
                <button
                  className="action-button directions"
                  onClick={() => {
                    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(hospital.address)}`;
                    window.open(mapsUrl, "_blank");
                  }}
                >
                  {labels.directions}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">{labels.noResults}</p>
        )}
      </div>
    </div>
  );
}
