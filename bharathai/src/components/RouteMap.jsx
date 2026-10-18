import { useEffect, useRef } from "react";

export default function RouteMap({ origin, destination }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination || !containerRef.current || !window.L) return undefined;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = window.L.map(containerRef.current).setView(
      [origin.latitude, origin.longitude],
      7,
    );
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const start = window.L.marker([origin.latitude, origin.longitude]).addTo(map);
    start.bindPopup(origin.name || "Origin");
    const end = window.L.marker([destination.latitude, destination.longitude]).addTo(map);
    end.bindPopup(destination.name || "Market");
    map.fitBounds(
      [
        [origin.latitude, origin.longitude],
        [destination.latitude, destination.longitude],
      ],
      { padding: [24, 24] },
    );
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [origin, destination]);

  if (!origin || !destination) {
    return (
      <p className="text-[9px] text-[#7a8d7d]">
        A map is shown only when reliable coordinates are available.
      </p>
    );
  }

  return (
    <div>
      <div ref={containerRef} className="h-[180px] w-full overflow-hidden rounded-lg border border-[#e3ebe3]" />
      <p className="mt-1 text-[8px] text-[#8b978d]">
        Map data © OpenStreetMap contributors
      </p>
    </div>
  );
}
