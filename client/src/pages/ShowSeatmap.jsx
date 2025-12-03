import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SeatGrid from "../components/SeatGrid";

export default function ShowSeatmap() {
  const { showId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/show/${showId}/seatmap`);
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `HTTP ${res.status}`);
        }
        const j = await res.json();
        setData(j);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (showId) load();
  }, [showId]);

  if (loading) return <div style={{ padding: 24 }}>Loading seatmap…</div>;
  if (error) return <div style={{ padding: 24, color: "crimson" }}>Error: {error}</div>;
  if (!data) return null;

  const { show, layout, availability } = data;
  const priceByType = show?.priceTiers || { STD: show.price };

  // compute total using seat type (STD/PRM) from layout data
  const total = selected.reduce((sum, key) => {
    const seat = layout.seats.find((s) => s.seatKey === key);
    const price = priceByType[seat?.type || "STD"] ?? show.price;
    return sum + price;
    }, 0);

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 4 }}>
        {show?.movie?.title} — {show?.theatre?.name}
      </h2>
      <div style={{ marginBottom: 16, color: "#6b7280" }}>
        {show?.screenName} • {new Date(show?.showDateTime).toLocaleString()}
      </div>

      <SeatGrid
        layout={layout}
        availability={availability}
        onChange={setSelected}
      />

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
        <div>
          Selected: {selected.length ? selected.join(", ") : "None"}
        </div>
        <div>
          Total: <strong>₹{total}</strong>
        </div>
      </div>

      {/* Hook this up to your booking flow later */}
      <button
        disabled={!selected.length}
        style={{
          marginTop: 12,
          padding: "10px 14px",
          borderRadius: 8,
          background: selected.length ? "#111827" : "#9ca3af",
          color: "#fff",
          border: "none",
          cursor: selected.length ? "pointer" : "not-allowed",
        }}
        onClick={() => alert(`Proceed to booking: ${selected.join(", ")}`)}
      >
        Continue
      </button>
    </div>
  );
}
