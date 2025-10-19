import { useEffect, useState } from "react";

// Local dev vs deployed API
const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://movie-ticket-fullstack.vercel.app";

const CITIES = [
  { label: "Mumbai", value: "mumbai" },
  { label: "Indore", value: "indore" },
  { label: "Balaghat", value: "balaghat" },
  { label: "Pune", value: "pune" },
  { label: "Navi Mumbai", value: "navi mumbai" },
];

export default function TheatreSelector() {
  const [city, setCity] = useState("mumbai");
  const [loading, setLoading] = useState(false);
  const [theatres, setTheatres] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/theatres?city=${encodeURIComponent(city)}`);
        const data = await res.json();
        setTheatres(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error fetching theatres:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [city]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-white">Choose your city</h2>

      {/* City chips (no dropdown) */}
      <div className="flex flex-wrap gap-3 mb-6">
        {CITIES.map((c) => {
          const active = c.value === city;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setCity(c.value)}
              className={`px-4 py-2 rounded-full border transition
                ${active
                  ? "bg-white text-black border-white"
                  : "bg-black text-white border-white/30 hover:border-white/60"
                }`}
              aria-pressed={active}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {loading && <p className="text-white/70">Loading theatres…</p>}
      {!loading && theatres.length === 0 && (
        <p className="text-white/70">No theatres found.</p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {theatres.map((t) => (
          <li key={t._id} className="border border-white/15 rounded p-3 text-white">
            <div className="font-medium">{t.name}</div>
            {t.address && <div className="text-white/60">{t.address}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
