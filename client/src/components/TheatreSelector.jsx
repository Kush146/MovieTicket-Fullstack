import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- CONFIG: API base ---------------- */
const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://movie-ticket-fullstack.vercel.app";

/* ---------------- DATA: States & Cities ---------------- */
const STATES = {
  maharashtra: [
    { label: "Mumbai", value: "mumbai" },
    { label: "Navi Mumbai", value: "navi mumbai" },
    { label: "Pune", value: "pune" },
    { label: "Thane", value: "thane" },
  ],
  madhya_pradesh: [
    { label: "Indore", value: "indore" },
    { label: "Bhopal", value: "bhopal" },
    { label: "Jabalpur", value: "jabalpur" },
    { label: "Balaghat", value: "balaghat" },
  ],
  gujarat: [
    { label: "Ahmedabad", value: "ahmedabad" },
    { label: "Surat", value: "surat" },
    { label: "Vadodara", value: "vadodara" },
    { label: "Rajkot", value: "rajkot" },
  ],
  goa: [
    { label: "Panaji", value: "panaji" },
    { label: "Margao", value: "margao" },
    { label: "Mapusa", value: "mapusa" },
  ],
  haryana: [
    { label: "Gurugram", value: "gurugram" },
    { label: "Faridabad", value: "faridabad" },
    { label: "Panipat", value: "panipat" },
  ],
  karnataka: [
    { label: "Bengaluru", value: "bengaluru" },
    { label: "Mysuru", value: "mysuru" },
    { label: "Mangaluru", value: "mangaluru" },
  ],
  delhi: [{ label: "New Delhi", value: "new delhi" }],
  telangana: [
    { label: "Hyderabad", value: "hyderabad" },
    { label: "Secunderabad", value: "secunderabad" },
  ],
  rajasthan: [
    { label: "Jaipur", value: "jaipur" },
    { label: "Udaipur", value: "udaipur" },
    { label: "Jodhpur", value: "jodhpur" },
  ],
  uttar_pradesh: [
    { label: "Lucknow", value: "lucknow" },
    { label: "Noida", value: "noida" },
    { label: "Ghaziabad", value: "ghaziabad" },
    { label: "Varanasi", value: "varanasi" },
  ],
  west_bengal: [
    { label: "Kolkata", value: "kolkata" },
    { label: "Howrah", value: "howrah" },
    { label: "Durgapur", value: "durgapur" },
  ],
  tamil_nadu: [
    { label: "Chennai", value: "chennai" },
    { label: "Coimbatore", value: "coimbatore" },
    { label: "Madurai", value: "madurai" },
  ],
};

const STATE_LABELS = {
  maharashtra: "Maharashtra",
  madhya_pradesh: "Madhya Pradesh",
  gujarat: "Gujarat",
  goa: "Goa",
  haryana: "Haryana",
  karnataka: "Karnataka",
  delhi: "Delhi",
  telangana: "Telangana",
  rajasthan: "Rajasthan",
  uttar_pradesh: "Uttar Pradesh",
  west_bengal: "West Bengal",
  tamil_nadu: "Tamil Nadu",
};

/* --------- Fallback theatres if API returns empty --------- */
const POPULAR_THEATRES = {
  "mumbai": [
    { name: "PVR Phoenix Palladium", address: "Lower Parel" },
    { name: "INOX R-City", address: "Ghatkopar" },
  ],
  "navi mumbai": [
    { name: "INOX Raghuleela", address: "Vashi" },
    { name: "Cinemax Seawoods", address: "Seawoods Grand Central" },
  ],
  "pune": [
    { name: "PVR Phoenix Marketcity", address: "Viman Nagar" },
    { name: "City Pride Kothrud", address: "Kothrud" },
  ],
  "thane": [
    { name: "Cinepolis Viviana", address: "Viviana Mall" },
    { name: "INOX Korum", address: "Korum Mall" },
  ],
  "indore": [
    { name: "INOX Sapna Sangeeta", address: "Sapna Sangeeta Rd" },
    { name: "Carnival Treasure Island", address: "TI Mall" },
  ],
  "bhopal": [
    { name: "Cinepolis DB Mall", address: "DB City Mall" },
    { name: "PVR Aura Mall", address: "Aura Mall" },
  ],
  "jabalpur": [{ name: "PVR Samdariya Mall", address: "Samdariya Mall" }],
  "balaghat": [{ name: "Balaghat Talkies", address: "Gandhi Ward" }],
  "ahmedabad": [
    { name: "PVR Acropolis", address: "Thaltej" },
    { name: "Cinepolis Ahmedabad One", address: "Vastrapur" },
  ],
  "surat": [
    { name: "INOX VR Surat", address: "VR Mall" },
    { name: "Cinepolis Imperial", address: "Piplod" },
  ],
  "vadodara": [
    { name: "Inox Inorbit", address: "Inorbit Mall" },
    { name: "Cinepolis Eva", address: "Manjalpur" },
  ],
  "panaji": [{ name: "INOX Panaji", address: "Panaji" }],
  "margao": [{ name: "OSIA Multiplex", address: "Margao" }],
  "mapusa": [{ name: "Cine Vishant", address: "Mapusa" }],
  "gurugram": [
    { name: "PVR Ambience", address: "Ambience Mall" },
    { name: "DT Star", address: "Sector 29" },
  ],
  "faridabad": [{ name: "Cinepolis", address: "Crown Interiorz Mall" }],
  "panipat": [{ name: "INOX Panipat", address: "Panipat Mall" }],
  "bengaluru": [
    { name: "PVR Orion", address: "Orion Mall" },
    { name: "INOX Garuda", address: "Garuda Mall" },
  ],
  "mysuru": [{ name: "INOX Mall of Mysore", address: "Chamundi Hills Rd" }],
  "mangaluru": [{ name: "PVR Fiza by Nexus", address: "Pandeshwar" }],
  "new delhi": [
    { name: "PVR Select Citywalk", address: "Saket" },
    { name: "INOX Nehru Place", address: "Nehru Place" },
  ],
  "hyderabad": [
    { name: "PVR Forum Sujana", address: "Kukatpally" },
    { name: "INOX GVK One", address: "Banjara Hills" },
  ],
  "secunderabad": [{ name: "Cinepolis CCPL", address: "Trimulgherry" }],
  "jaipur": [
    { name: "Cinepolis WTP", address: "World Trade Park" },
    { name: "INOX Crystal Palm", address: "C-Scheme" },
  ],
  "udaipur": [{ name: "INOX Celebration", address: "Mald area" }],
  "jodhpur": [{ name: "Carnival Cinema", address: "Ratanada" }],
  "lucknow": [
    { name: "PVR Phoenix Palassio", address: "Amar Shaheed Path" },
    { name: "INOX Riverside", address: "Gomti Nagar" },
  ],
  "noida": [
    { name: "PVR DLF Mall of India", address: "Sector 18" },
    { name: "INOX Logix City Center", address: "Sector 32" },
  ],
  "ghaziabad": [{ name: "PVR Opulent", address: "Opulent Mall" }],
  "varanasi": [{ name: "INOX JHV", address: "JHV Mall" }],
  "kolkata": [
    { name: "PVR Mani Square", address: "EM Bypass" },
    { name: "INOX South City", address: "Prince Anwar Shah Rd" },
  ],
  "howrah": [{ name: "INOX Forum Rangoli", address: "Rangoli Mall" }],
  "durgapur": [{ name: "Bioscope", address: "Junction Mall" }],
  "chennai": [
    { name: "PVR Skywalk", address: "Aminjikarai" },
    { name: "SPI Sathyam", address: "Royapettah" },
    { name: "INOX The Marina Mall", address: "OMR" },
  ],
  "coimbatore": [{ name: "INOX Prozone", address: "Sathy Rd" }],
  "madurai": [{ name: "Cinepolis Vishaal De Mall", address: "Goripalayam" }],
};

/* ---------------- Small UI helpers ---------------- */
const Card = ({ title, children }) => (
  <section className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 mb-6">
    <h3 className="text-base md:text-lg font-semibold text-white mb-3">{title}</h3>
    {children}
  </section>
);

const Chip = ({ active, children, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-full border transition text-sm md:text-base
      ${active ? "bg-white text-black border-white"
               : "bg-transparent text-white border-white/30 hover:border-white/60"}`}
  >
    {children}
  </button>
);

/* ---------------- Component ---------------- */
export default function TheatreSelector() {
  const navigate = useNavigate();

  // default/persisted selection
  const initialState = localStorage.getItem("ks_state") || "maharashtra";
  const initialCity =
    localStorage.getItem("ks_city") || STATES[initialState]?.[0]?.value || "mumbai";

  const [stateKey, setStateKey] = useState(initialState);
  const [city, setCity] = useState(initialCity);
  const [loading, setLoading] = useState(false);
  const [theatres, setTheatres] = useState([]);

  useEffect(() => localStorage.setItem("ks_state", stateKey), [stateKey]);
  useEffect(() => localStorage.setItem("ks_city", city), [city]);

  // ensure city follows state
  useEffect(() => {
    const first = STATES[stateKey]?.[0]?.value;
    if (first && first !== city) setCity(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey]);

  // fetch theatres
  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/theatres?city=${encodeURIComponent(city)}`);
        const data = await res.json();
        if (!ignore) {
          const list = (Array.isArray(data) && data.length ? data : (POPULAR_THEATRES[city] || []));
          setTheatres(list);
        }
      } catch {
        if (!ignore) setTheatres(POPULAR_THEATRES[city] || []);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (city) load();
    return () => { ignore = true; };
  }, [city]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Choose your location</h2>

      {/* STEP 1: Select State */}
      <Card title="Select State">
        <div className="flex flex-wrap gap-3">
          {Object.keys(STATES).map((k) => (
            <Chip
              key={k}
              active={k === stateKey}
              onClick={() => setStateKey(k)}
              aria-pressed={k === stateKey}
            >
              {STATE_LABELS[k] || k}
            </Chip>
          ))}
        </div>
      </Card>

      {/* STEP 2: Select City */}
      <Card title="Select City">
        <div className="flex flex-wrap gap-3">
          {(STATES[stateKey] || []).map((c) => (
            <Chip
              key={c.value}
              active={c.value === city}
              onClick={() => setCity(c.value)}
              aria-pressed={c.value === city}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </Card>

      {/* STEP 3: Theatres */}
      <Card title="Theatres">
        {loading ? (
          <p className="text-white/70">Loading theatres…</p>
        ) : theatres.length === 0 ? (
          <p className="text-white/70">No theatres found.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {theatres.map((t, idx) => (
              <li
                key={t._id || `${city}-${idx}`}
                onClick={() => {
                  localStorage.setItem("ks_city", city);
                  localStorage.setItem("ks_theatre", t.name || "");
                  navigate("/movies");
                }}
                className="border border-white/15 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition"
              >
                <div className="font-medium">{t.name}</div>
                {t.address && <div className="text-white/60 text-sm">{t.address}</div>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
