import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Building2, Film, Loader2, ChevronDown, X } from "lucide-react";

/* ---------------- CONFIG: API base ---------------- */
const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://movie-ticket-fullstack.vercel.app";

/* ---------------- DATA: States & Cities ---------------- */
const STATES = {
  maharashtra: [
    { label: "Mumbai", value: "mumbai" },
    { label: "Pune", value: "pune" },
    { label: "Nashik", value: "nashik" },
    { label: "Nagpur", value: "nagpur" },
    { label: "Aurangabad", value: "aurangabad" },
    { label: "Thane", value: "thane" },
  ],
  delhi: [
    { label: "New Delhi", value: "new delhi" },
    { label: "Dwarka", value: "dwarka" },
    { label: "Rohini", value: "rohini" },
  ],
  karnataka: [
    { label: "Bengaluru", value: "bengaluru" },
    { label: "Mysuru", value: "mysuru" },
    { label: "Mangaluru", value: "mangaluru" },
    { label: "Hubli", value: "hubli" },
    { label: "Belagavi", value: "belagavi" },
  ],
  tamil_nadu: [
    { label: "Chennai", value: "chennai" },
    { label: "Coimbatore", value: "coimbatore" },
    { label: "Madurai", value: "madurai" },
    { label: "Tiruchirappalli", value: "tiruchirappalli" },
    { label: "Salem", value: "salem" },
  ],
  west_bengal: [
    { label: "Kolkata", value: "kolkata" },
    { label: "Howrah", value: "howrah" },
    { label: "Durgapur", value: "durgapur" },
    { label: "Asansol", value: "asansol" },
    { label: "Siliguri", value: "siliguri" },
  ],
  gujarat: [
    { label: "Ahmedabad", value: "ahmedabad" },
    { label: "Surat", value: "surat" },
    { label: "Vadodara", value: "vadodara" },
    { label: "Rajkot", value: "rajkot" },
    { label: "Gandhinagar", value: "gandhinagar" },
  ],
  rajasthan: [
    { label: "Jaipur", value: "jaipur" },
    { label: "Jodhpur", value: "jodhpur" },
    { label: "Udaipur", value: "udaipur" },
    { label: "Kota", value: "kota" },
    { label: "Ajmer", value: "ajmer" },
  ],
  uttar_pradesh: [
    { label: "Lucknow", value: "lucknow" },
    { label: "Noida", value: "noida" },
    { label: "Ghaziabad", value: "ghaziabad" },
    { label: "Kanpur", value: "kanpur" },
    { label: "Varanasi", value: "varanasi" },
    { label: "Agra", value: "agra" },
  ],
  telangana: [
    { label: "Hyderabad", value: "hyderabad" },
    { label: "Warangal", value: "warangal" },
    { label: "Nizamabad", value: "nizamabad" },
    { label: "Karimnagar", value: "karimnagar" },
  ],
  andhra_pradesh: [
    { label: "Visakhapatnam", value: "visakhapatnam" },
    { label: "Vijayawada", value: "vijayawada" },
    { label: "Guntur", value: "guntur" },
    { label: "Tirupati", value: "tirupati" },
  ],
  kerala: [
    { label: "Kochi", value: "kochi" },
    { label: "Thiruvananthapuram", value: "thiruvananthapuram" },
    { label: "Kozhikode", value: "kozhikode" },
    { label: "Thrissur", value: "thrissur" },
  ],
  punjab: [
    { label: "Ludhiana", value: "ludhiana" },
    { label: "Amritsar", value: "amritsar" },
    { label: "Jalandhar", value: "jalandhar" },
    { label: "Patiala", value: "patiala" },
  ],
  haryana: [
    { label: "Gurugram", value: "gurugram" },
    { label: "Faridabad", value: "faridabad" },
    { label: "Panipat", value: "panipat" },
    { label: "Ambala", value: "ambala" },
  ],
  madhya_pradesh: [
    { label: "Indore", value: "indore" },
    { label: "Bhopal", value: "bhopal" },
    { label: "Gwalior", value: "gwalior" },
    { label: "Jabalpur", value: "jabalpur" },
  ],
  bihar: [
    { label: "Patna", value: "patna" },
    { label: "Gaya", value: "gaya" },
    { label: "Bhagalpur", value: "bhagalpur" },
    { label: "Muzaffarpur", value: "muzaffarpur" },
  ],
  odisha: [
    { label: "Bhubaneswar", value: "bhubaneswar" },
    { label: "Cuttack", value: "cuttack" },
    { label: "Rourkela", value: "rourkela" },
    { label: "Berhampur", value: "berhampur" },
  ],
  assam: [
    { label: "Guwahati", value: "guwahati" },
    { label: "Silchar", value: "silchar" },
    { label: "Dibrugarh", value: "dibrugarh" },
    { label: "Jorhat", value: "jorhat" },
  ],
  jharkhand: [
    { label: "Ranchi", value: "ranchi" },
    { label: "Jamshedpur", value: "jamshedpur" },
    { label: "Dhanbad", value: "dhanbad" },
    { label: "Bokaro", value: "bokaro" },
  ],
  chhattisgarh: [
    { label: "Raipur", value: "raipur" },
    { label: "Bhilai", value: "bhilai" },
    { label: "Bilaspur", value: "bilaspur" },
    { label: "Durg", value: "durg" },
  ],
  goa: [
    { label: "Panaji", value: "panaji" },
    { label: "Margao", value: "margao" },
    { label: "Vasco da Gama", value: "vasco da gama" },
  ],
};

const STATE_LABELS = {
  maharashtra: "Maharashtra",
  delhi: "Delhi",
  karnataka: "Karnataka",
  tamil_nadu: "Tamil Nadu",
  west_bengal: "West Bengal",
  gujarat: "Gujarat",
  rajasthan: "Rajasthan",
  uttar_pradesh: "Uttar Pradesh",
  telangana: "Telangana",
  andhra_pradesh: "Andhra Pradesh",
  kerala: "Kerala",
  punjab: "Punjab",
  haryana: "Haryana",
  madhya_pradesh: "Madhya Pradesh",
  bihar: "Bihar",
  odisha: "Odisha",
  assam: "Assam",
  jharkhand: "Jharkhand",
  chhattisgarh: "Chhattisgarh",
  goa: "Goa",
};

/* --------- Fallback theatres if API returns empty --------- */
const POPULAR_THEATRES = {
  "mumbai": [
    { name: "PVR Phoenix Palladium", address: "Lower Parel" },
    { name: "INOX R-City", address: "Ghatkopar" },
    { name: "Cinepolis Andheri", address: "Andheri West" },
    { name: "PVR Icon Infiniti", address: "Andheri West" },
    { name: "INOX Megaplex", address: "Inorbit Mall, Malad" },
  ],
  "pune": [
    { name: "PVR Phoenix Marketcity", address: "Viman Nagar" },
    { name: "City Pride Kothrud", address: "Kothrud" },
    { name: "INOX Bund Garden", address: "Bund Garden Road" },
    { name: "Cinepolis Seasons Mall", address: "Magarpatta" },
  ],
  "nashik": [
    { name: "INOX City Centre", address: "City Centre Mall" },
    { name: "PVR Cinemas", address: "Nashik Road" },
    { name: "Cinepolis", address: "Nashik East" },
  ],
  "nagpur": [
    { name: "PVR Empress Mall", address: "Empress Mall" },
    { name: "INOX Jaswant Tuli Mall", address: "Sitabuldi" },
    { name: "Cinepolis", address: "Wardha Road" },
  ],
  "aurangabad": [
    { name: "PVR Cinemas", address: "Aurangabad" },
    { name: "INOX Prozone", address: "Prozone Mall" },
  ],
  "thane": [
    { name: "Cinepolis Viviana", address: "Viviana Mall" },
    { name: "INOX Korum", address: "Korum Mall" },
    { name: "PVR Cinemas", address: "Thane West" },
  ],
  "new delhi": [
    { name: "PVR Select Citywalk", address: "Saket" },
    { name: "INOX Nehru Place", address: "Nehru Place" },
    { name: "PVR Plaza", address: "Connaught Place" },
    { name: "Cinepolis DLF Avenue", address: "Saket" },
  ],
  "dwarka": [
    { name: "PVR Cinemas", address: "Dwarka Sector 10" },
    { name: "INOX Dwarka", address: "Dwarka Sector 18" },
  ],
  "rohini": [
    { name: "PVR Cinemas", address: "Rohini Sector 18" },
    { name: "INOX Rohini", address: "Rohini Sector 3" },
  ],
  "bengaluru": [
    { name: "PVR Orion", address: "Orion Mall" },
    { name: "INOX Garuda", address: "Garuda Mall" },
    { name: "Cinepolis Forum", address: "Koramangala" },
    { name: "PVR Forum", address: "Whitefield" },
  ],
  "mysuru": [
    { name: "INOX Mall of Mysore", address: "Chamundi Hills Rd" },
    { name: "PVR Cinemas", address: "Mysuru" },
  ],
  "mangaluru": [
    { name: "PVR Fiza by Nexus", address: "Pandeshwar" },
    { name: "INOX City Centre", address: "Mangaluru" },
  ],
  "hubli": [
    { name: "PVR Cinemas", address: "Hubli" },
    { name: "INOX", address: "Hubli" },
  ],
  "belagavi": [
    { name: "PVR Cinemas", address: "Belagavi" },
  ],
  "chennai": [
    { name: "PVR Skywalk", address: "Aminjikarai" },
    { name: "SPI Sathyam", address: "Royapettah" },
    { name: "INOX The Marina Mall", address: "OMR" },
    { name: "Cinepolis", address: "Velachery" },
  ],
  "coimbatore": [
    { name: "INOX Prozone", address: "Sathy Rd" },
    { name: "PVR Cinemas", address: "Coimbatore" },
  ],
  "madurai": [
    { name: "Cinepolis Vishaal De Mall", address: "Goripalayam" },
    { name: "INOX", address: "Madurai" },
  ],
  "tiruchirappalli": [
    { name: "PVR Cinemas", address: "Trichy" },
    { name: "INOX", address: "Trichy" },
  ],
  "salem": [
    { name: "PVR Cinemas", address: "Salem" },
  ],
  "kolkata": [
    { name: "PVR Mani Square", address: "EM Bypass" },
    { name: "INOX South City", address: "Prince Anwar Shah Rd" },
    { name: "Cinepolis", address: "Salt Lake" },
    { name: "INOX Quest Mall", address: "Park Street" },
  ],
  "howrah": [
    { name: "INOX Forum Rangoli", address: "Rangoli Mall" },
    { name: "PVR Cinemas", address: "Howrah" },
  ],
  "durgapur": [
    { name: "Bioscope", address: "Junction Mall" },
    { name: "PVR Cinemas", address: "Durgapur" },
  ],
  "asansol": [
    { name: "PVR Cinemas", address: "Asansol" },
  ],
  "siliguri": [
    { name: "INOX", address: "Siliguri" },
    { name: "PVR Cinemas", address: "Siliguri" },
  ],
  "ahmedabad": [
    { name: "PVR Acropolis", address: "Thaltej" },
    { name: "Cinepolis Ahmedabad One", address: "Vastrapur" },
    { name: "INOX R3", address: "Ahmedabad" },
    { name: "PVR Cinemas", address: "Ahmedabad" },
  ],
  "surat": [
    { name: "INOX VR Surat", address: "VR Mall" },
    { name: "Cinepolis Imperial", address: "Piplod" },
    { name: "PVR Cinemas", address: "Surat" },
  ],
  "vadodara": [
    { name: "Inox Inorbit", address: "Inorbit Mall" },
    { name: "Cinepolis Eva", address: "Manjalpur" },
    { name: "PVR Cinemas", address: "Vadodara" },
  ],
  "rajkot": [
    { name: "PVR Cinemas", address: "Rajkot" },
    { name: "INOX", address: "Rajkot" },
  ],
  "gandhinagar": [
    { name: "PVR Cinemas", address: "Gandhinagar" },
  ],
  "jaipur": [
    { name: "Cinepolis WTP", address: "World Trade Park" },
    { name: "INOX Crystal Palm", address: "C-Scheme" },
    { name: "PVR Cinemas", address: "Jaipur" },
    { name: "INOX Pink Square", address: "Malviya Nagar" },
  ],
  "jodhpur": [
    { name: "Carnival Cinema", address: "Ratanada" },
    { name: "PVR Cinemas", address: "Jodhpur" },
  ],
  "udaipur": [
    { name: "INOX Celebration", address: "Mald area" },
    { name: "PVR Cinemas", address: "Udaipur" },
  ],
  "kota": [
    { name: "PVR Cinemas", address: "Kota" },
    { name: "INOX", address: "Kota" },
  ],
  "ajmer": [
    { name: "PVR Cinemas", address: "Ajmer" },
  ],
  "lucknow": [
    { name: "PVR Phoenix Palassio", address: "Amar Shaheed Path" },
    { name: "INOX Riverside", address: "Gomti Nagar" },
    { name: "PVR Cinemas", address: "Lucknow" },
    { name: "Cinepolis", address: "Lucknow" },
  ],
  "noida": [
    { name: "PVR DLF Mall of India", address: "Sector 18" },
    { name: "INOX Logix City Center", address: "Sector 32" },
    { name: "PVR Cinemas", address: "Noida Sector 62" },
  ],
  "ghaziabad": [
    { name: "PVR Opulent", address: "Opulent Mall" },
    { name: "INOX", address: "Ghaziabad" },
  ],
  "kanpur": [
    { name: "PVR Cinemas", address: "Kanpur" },
    { name: "INOX", address: "Kanpur" },
  ],
  "varanasi": [
    { name: "INOX JHV", address: "JHV Mall" },
    { name: "PVR Cinemas", address: "Varanasi" },
  ],
  "agra": [
    { name: "PVR Cinemas", address: "Agra" },
    { name: "INOX", address: "Agra" },
  ],
  "hyderabad": [
    { name: "PVR Forum Sujana", address: "Kukatpally" },
    { name: "INOX GVK One", address: "Banjara Hills" },
    { name: "Cinepolis", address: "Hyderabad" },
    { name: "PVR Cinemas", address: "Hyderabad" },
  ],
  "warangal": [
    { name: "PVR Cinemas", address: "Warangal" },
    { name: "INOX", address: "Warangal" },
  ],
  "nizamabad": [
    { name: "PVR Cinemas", address: "Nizamabad" },
  ],
  "karimnagar": [
    { name: "PVR Cinemas", address: "Karimnagar" },
  ],
  "visakhapatnam": [
    { name: "PVR Cinemas", address: "Visakhapatnam" },
    { name: "INOX", address: "Visakhapatnam" },
    { name: "Cinepolis", address: "Visakhapatnam" },
  ],
  "vijayawada": [
    { name: "PVR Cinemas", address: "Vijayawada" },
    { name: "INOX", address: "Vijayawada" },
  ],
  "guntur": [
    { name: "PVR Cinemas", address: "Guntur" },
  ],
  "tirupati": [
    { name: "PVR Cinemas", address: "Tirupati" },
    { name: "INOX", address: "Tirupati" },
  ],
  "kochi": [
    { name: "PVR Cinemas", address: "Kochi" },
    { name: "INOX", address: "Kochi" },
    { name: "Cinepolis", address: "Kochi" },
  ],
  "thiruvananthapuram": [
    { name: "PVR Cinemas", address: "Thiruvananthapuram" },
    { name: "INOX", address: "Thiruvananthapuram" },
  ],
  "kozhikode": [
    { name: "PVR Cinemas", address: "Kozhikode" },
    { name: "INOX", address: "Kozhikode" },
  ],
  "thrissur": [
    { name: "PVR Cinemas", address: "Thrissur" },
  ],
  "ludhiana": [
    { name: "PVR Cinemas", address: "Ludhiana" },
    { name: "INOX", address: "Ludhiana" },
    { name: "Cinepolis", address: "Ludhiana" },
  ],
  "amritsar": [
    { name: "PVR Cinemas", address: "Amritsar" },
    { name: "INOX", address: "Amritsar" },
  ],
  "jalandhar": [
    { name: "PVR Cinemas", address: "Jalandhar" },
    { name: "INOX", address: "Jalandhar" },
  ],
  "patiala": [
    { name: "PVR Cinemas", address: "Patiala" },
  ],
  "gurugram": [
    { name: "PVR Ambience", address: "Ambience Mall" },
    { name: "DT Star", address: "Sector 29" },
    { name: "Cinepolis", address: "Gurugram" },
  ],
  "faridabad": [
    { name: "Cinepolis", address: "Crown Interiorz Mall" },
    { name: "PVR Cinemas", address: "Faridabad" },
  ],
  "panipat": [
    { name: "INOX Panipat", address: "Panipat Mall" },
    { name: "PVR Cinemas", address: "Panipat" },
  ],
  "ambala": [
    { name: "PVR Cinemas", address: "Ambala" },
  ],
  "indore": [
    { name: "INOX Sapna Sangeeta", address: "Sapna Sangeeta Rd" },
    { name: "Carnival Treasure Island", address: "TI Mall" },
    { name: "PVR Cinemas", address: "Indore" },
  ],
  "bhopal": [
    { name: "Cinepolis DB Mall", address: "DB City Mall" },
    { name: "PVR Aura Mall", address: "Aura Mall" },
    { name: "INOX", address: "Bhopal" },
  ],
  "gwalior": [
    { name: "PVR Cinemas", address: "Gwalior" },
    { name: "INOX", address: "Gwalior" },
  ],
  "jabalpur": [
    { name: "PVR Samdariya Mall", address: "Samdariya Mall" },
    { name: "INOX", address: "Jabalpur" },
  ],
  "patna": [
    { name: "PVR Cinemas", address: "Patna" },
    { name: "INOX", address: "Patna" },
    { name: "Cinepolis", address: "Patna" },
  ],
  "gaya": [
    { name: "PVR Cinemas", address: "Gaya" },
  ],
  "bhagalpur": [
    { name: "PVR Cinemas", address: "Bhagalpur" },
  ],
  "muzaffarpur": [
    { name: "PVR Cinemas", address: "Muzaffarpur" },
  ],
  "bhubaneswar": [
    { name: "PVR Cinemas", address: "Bhubaneswar" },
    { name: "INOX", address: "Bhubaneswar" },
    { name: "Cinepolis", address: "Bhubaneswar" },
  ],
  "cuttack": [
    { name: "PVR Cinemas", address: "Cuttack" },
    { name: "INOX", address: "Cuttack" },
  ],
  "rourkela": [
    { name: "PVR Cinemas", address: "Rourkela" },
  ],
  "berhampur": [
    { name: "PVR Cinemas", address: "Berhampur" },
  ],
  "guwahati": [
    { name: "PVR Cinemas", address: "Guwahati" },
    { name: "INOX", address: "Guwahati" },
    { name: "Cinepolis", address: "Guwahati" },
  ],
  "silchar": [
    { name: "PVR Cinemas", address: "Silchar" },
  ],
  "dibrugarh": [
    { name: "PVR Cinemas", address: "Dibrugarh" },
  ],
  "jorhat": [
    { name: "PVR Cinemas", address: "Jorhat" },
  ],
  "ranchi": [
    { name: "PVR Cinemas", address: "Ranchi" },
    { name: "INOX", address: "Ranchi" },
    { name: "Cinepolis", address: "Ranchi" },
  ],
  "jamshedpur": [
    { name: "PVR Cinemas", address: "Jamshedpur" },
    { name: "INOX", address: "Jamshedpur" },
  ],
  "dhanbad": [
    { name: "PVR Cinemas", address: "Dhanbad" },
  ],
  "bokaro": [
    { name: "PVR Cinemas", address: "Bokaro" },
  ],
  "raipur": [
    { name: "PVR Cinemas", address: "Raipur" },
    { name: "INOX", address: "Raipur" },
    { name: "Cinepolis", address: "Raipur" },
  ],
  "bhilai": [
    { name: "PVR Cinemas", address: "Bhilai" },
  ],
  "bilaspur": [
    { name: "PVR Cinemas", address: "Bilaspur" },
  ],
  "durg": [
    { name: "PVR Cinemas", address: "Durg" },
  ],
  "panaji": [
    { name: "INOX Panaji", address: "Panaji" },
    { name: "PVR Cinemas", address: "Panaji" },
  ],
  "margao": [
    { name: "OSIA Multiplex", address: "Margao" },
    { name: "PVR Cinemas", address: "Margao" },
  ],
  "vasco da gama": [
    { name: "PVR Cinemas", address: "Vasco da Gama" },
  ],
};

/* ---------------- Small UI helpers ---------------- */
const Card = ({ title, children, icon: Icon }) => (
  <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 md:p-6 mb-6 shadow-lg backdrop-blur-sm relative">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-red-500" />}
      <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
    </div>
    {children}
  </section>
);

/* ---------------- Searchable Dropdown Component ---------------- */
const SearchableDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  searchPlaceholder = "Search...",
  icon: Icon 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  // Calculate position when dropdown opens and on scroll/resize
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        // For position: fixed, use viewport coordinates (no scroll offset)
        setPosition({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width
        });
      }
    };

    if (isOpen) {
      updatePosition();
      // Use requestAnimationFrame for smooth updates
      const handleScroll = () => {
        requestAnimationFrame(updatePosition);
      };
      const handleResize = () => {
        requestAnimationFrame(updatePosition);
      };
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className="fixed bg-gray-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        zIndex: 99999,
        maxHeight: '60vh'
      }}
    >
      {/* Search Input */}
      <div className="p-3 border-b border-white/10 bg-gray-900/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            className="w-full pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSearchTerm("");
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Options List */}
      <div className="max-h-60 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-8 text-center text-white/60 text-sm">
            No results found
          </div>
        ) : (
          filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                setSearchTerm("");
              }}
              className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 ${
                value === option.value
                  ? "bg-red-500/20 text-red-400 font-medium"
                  : "text-white/90 hover:bg-white/5 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="relative w-full">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {Icon && <Icon className="w-5 h-5 text-red-500 flex-shrink-0" />}
            <span className="text-left truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-white/60 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      {isOpen && createPortal(dropdownContent, document.body)}
    </>
  );
};

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter theatres based on search
  const filteredTheatres = theatres.filter((theatre) =>
    theatre.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theatre.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative">
      <div className="max-w-6xl mx-auto p-4 md:p-8 text-white relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Choose Your Location
            </h1>
          </div>
          <p className="text-white/60 text-sm md:text-base">
            Select your state and city to find nearby theatres
          </p>
        </div>

        {/* STEP 1: Select State */}
        <Card title="Select State" icon={MapPin}>
          <SearchableDropdown
            options={Object.keys(STATES).map((k) => ({
              label: STATE_LABELS[k] || k,
              value: k,
            }))}
            value={stateKey}
            onChange={setStateKey}
            placeholder="Select a state..."
            searchPlaceholder="Search states..."
            icon={MapPin}
          />
        </Card>

        {/* STEP 2: Select City */}
        <Card title="Select City" icon={Building2}>
          <SearchableDropdown
            options={STATES[stateKey] || []}
            value={city}
            onChange={setCity}
            placeholder="Select a city..."
            searchPlaceholder="Search cities..."
            icon={Building2}
          />
        </Card>

        {/* STEP 3: Theatres */}
        <Card title="Available Theatres" icon={Film}>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search theatres by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
              <span className="ml-3 text-white/70">Loading theatres...</span>
            </div>
          ) : filteredTheatres.length === 0 ? (
            <div className="text-center py-12">
              <Film className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg">
                {searchQuery ? "No theatres found matching your search." : "No theatres found in this city."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTheatres.map((t, idx) => (
                <div
                  key={t._id || `${city}-${idx}`}
                  onClick={() => {
                    localStorage.setItem("ks_city", city);
                    localStorage.setItem("ks_theatre", t.name || "");
                    navigate("/movies");
                  }}
                  className="group border border-white/15 rounded-xl p-5 cursor-pointer bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition">
                      <Film className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1 group-hover:text-red-400 transition">
                        {t.name}
                      </h4>
                      {t.address && (
                        <div className="flex items-center gap-1 text-white/60 text-sm">
                          <MapPin className="w-3 h-3" />
                          <span>{t.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-red-400/70 font-medium opacity-0 group-hover:opacity-100 transition">
                    Click to view movies →
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
