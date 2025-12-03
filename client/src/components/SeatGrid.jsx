import { useMemo, useState } from "react";

/**
 * SeatGrid
 * Props:
 *  - layout: { grid:{rows,cols}, seats:[{ row:"A", number:1, seatKey:"A1", type:"STD" }, ...], aisles?: number[] }
 *  - availability: { [seatKey]: "BOOKED" | "HELD" | "AVAILABLE" }  // empty object means all available
 *  - onChange(selectedSeatKeys: string[])
 */
export default function SeatGrid({ layout, availability = {}, onChange }) {
  const [selected, setSelected] = useState([]);

  const seatMapByKey = useMemo(() => {
    const map = new Map();
    layout?.seats?.forEach((s) => map.set(s.seatKey, s));
    return map;
  }, [layout]);

  const statusByKey = useMemo(() => {
    // default to AVAILABLE if not provided
    const map = new Map();
    layout?.seats?.forEach((s) => {
      map.set(s.seatKey, availability[s.seatKey] || "AVAILABLE");
    });
    return map;
  }, [layout, availability]);

  const rows = layout?.grid?.rows || 0;
  const cols = layout?.grid?.cols || 0;

  function toggle(seatKey) {
    const status = statusByKey.get(seatKey);
    if (status !== "AVAILABLE") return; // cannot select held/booked
    setSelected((prev) =>
      prev.includes(seatKey) ? prev.filter((k) => k !== seatKey) : [...prev, seatKey]
    );
  }

  // notify parent
  useMemo(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  // quick helpers
  const isAisleCol = (c) => (layout?.aisles || []).includes(c);

  return (
    <div style={{ display: "inline-block" }}>
      {/* simple legend */}
      <div style={{ marginBottom: 8, fontSize: 14 }}>
        <span style={{ paddingRight: 12 }}>Available</span>
        <span style={{ opacity: 0.6, paddingRight: 12 }}>Held</span>
        <span style={{ opacity: 0.35, paddingRight: 12 }}>Booked</span>
        <span style={{ fontWeight: 600 }}>Selected</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 32px)`,
          gap: "6px",
          padding: 8,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        {Array.from({ length: rows }).map((_, rIdx) =>
          Array.from({ length: cols }).map((__, cIdx) => {
            const rowLetter = String.fromCharCode(65 + rIdx);
            const num = cIdx + 1;
            const key = `${rowLetter}${num}`;
            const seat = seatMapByKey.get(key);

            // render empty cell if seat doesn't exist (e.g., aisle gap)
            if (!seat) {
              return (
                <div
                  key={`empty-${rIdx}-${cIdx}`}
                  style={{ width: 32, height: 28 }}
                />
              );
            }

            const status = statusByKey.get(key) || "AVAILABLE";
            const isSelected = selected.includes(key);

            const baseStyle = {
              width: 32,
              height: 28,
              fontSize: 11,
              lineHeight: "28px",
              textAlign: "center",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              cursor: status === "AVAILABLE" ? "pointer" : "not-allowed",
              opacity: status === "BOOKED" ? 0.35 : status === "HELD" ? 0.6 : 1,
              userSelect: "none",
            };

            const selectedStyle = isSelected
              ? { outline: "2px solid #111827", outlineOffset: 1, background: "#eef2ff" }
              : {};

            // extra left gap for aisles
            const cellStyle = isAisleCol(num)
              ? { marginLeft: 10, ...baseStyle, ...selectedStyle }
              : { ...baseStyle, ...selectedStyle };

            return (
              <div
                key={key}
                title={`${key} • ${seat.type} • ${status}`}
                onClick={() => toggle(key)}
                style={cellStyle}
              >
                {key}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
