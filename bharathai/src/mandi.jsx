import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { getErrorMessage, getJson, getSessionId, inr, postJson } from "./api/client.js";
import StatusBanner from "./components/StatusBanner.jsx";

const defaultCrops = ["Tomato", "Onion", "Green Chilli", "Potato"];

function Icon({ name, size = 16, className = "" }) {
  const paths = {
    leaf: "M20.8 3.2C12.5 2.7 5.1 5.2 4 11.4c-.7 4.1 2.8 6.8 6.2 5.7 4.7-1.6 8.2-7.1 10.6-13.9ZM3 21c3.5-6.2 7.7-9.8 13.8-13.2",
    pin: "M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    search: "m21 21-4.3-4.3M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
    sliders: "M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 6h4",
    chart: "M3 3v18h18M7 14l4-4 4 3 6-7",
    truck: "M3 6h12v12H3zM15 10h4l3 4v4h-7M7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    check: "m5 12 4 4L19 6",
    overview: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1V10Z",
    market: "M3 21h18M5 21V8h14v13M3 8l2-5h14l2 5M9 21v-7h6v7M9 11h.01M15 11h.01",
    compare: "M5 4v16m0-13h10a3 3 0 0 1 0 6H5m14-9v16m0-4H9a3 3 0 0 1 0-6h10",
    calculator: "M5 3h14v18H5zM8 7h8M8 11h2m4 0h2M8 15h2m4 0h2M8 18h2m4 0h2",
    spark: "m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z",
    bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4",
    bookmark: "M6 4h12v17l-6-4-6 4V4Z",
    globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d={paths[name] || paths.chart} />
    </svg>
  );
}

function BottomNavigation() {
  const items = [
    { label: "Overview", icon: "overview", to: "/overview" },
    { label: "Mandi Intel", icon: "market", to: "/mandi-intel" },
    { label: "Comparisons", icon: "compare", to: "/comparison" },
    { label: "Calculator", icon: "calculator", to: "/calculator" },
    { label: "AI Forecast", icon: "spark", to: "/ai-forecast" },
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-[max(8px,env(safe-area-inset-bottom))] left-1/2 z-40 flex min-h-[58px] w-[calc(100%-16px)] max-w-[1100px] -translate-x-1/2 items-center justify-around rounded-xl border border-[#e3ebe4] bg-white/95 px-1 py-1 shadow-[0_5px_24px_rgb(24_56_35_/_10%)] backdrop-blur-xl sm:bottom-3 sm:min-h-[62px] sm:px-3"
    >
      {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end
            className={({ isActive }) => `flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-[8px] transition sm:max-w-[150px] sm:text-[10px] ${
              isActive
                ? "bg-[#e4eee5] font-bold text-[#28583a]"
                : "font-medium text-[#66756b] hover:bg-[#f3f7f3]"
            }`}
          >
            <Icon name={item.icon} size={16} />
            <span className="whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
    </nav>
  );
}

function MandiCard({ mandi, index, onAction, saved, onToggleSave }) {
  const badgeStyles = {
    green: "bg-[#d9f8e2] text-[#248148]",
    orange: "bg-[#fff0d5] text-[#95621c]",
  };

  return (
    <article className="rounded-[13px] border border-[#e8eee8] bg-white p-[11px] shadow-[0_2px_8px_rgb(28_60_37_/_3%)] sm:p-[15px]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="text-[12px] font-bold leading-tight tracking-[-.2px] text-[#2b4434] sm:text-[15px]">
              {mandi.name}
            </h2>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-[7px] py-[3px] text-[8px] font-bold ${badgeStyles[mandi.badgeColor]}`}
            >
              {mandi.badgeColor === "orange" ? "★" : "✓"}
              {mandi.badge}
            </span>
          </div>

          <p className="mt-[5px] flex flex-wrap items-center gap-1 text-[9px] text-[#758379] sm:text-[10px]">
            <Icon name="pin" size={11} />
            {mandi.district}
            <span className="text-[#b8c2ba]">•</span>
            {mandi.distance}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onToggleSave(mandi.name)}
          aria-label={saved ? "Remove saved mandi" : "Save mandi"}
          className={`grid h-[27px] w-[27px] shrink-0 place-items-center rounded-lg ${
            saved
              ? "bg-[#dff2e2] text-[#287545]"
              : "bg-[#f0f7f0] text-[#8da291] hover:bg-[#e4f1e5]"
          }`}
        >
          <Icon name="bookmark" size={14} />
        </button>
      </div>

      {/* Price panel */}
      <div className="mt-[9px] flex items-center justify-between gap-2 rounded-[9px] bg-[#edf6eb] px-[10px] py-[8px] sm:px-[13px] sm:py-[10px]">
        <div>
          <p className="text-[8px] font-bold tracking-[.55px] text-[#829185]">
            MODAL RATE
          </p>
          <p className="mt-[2px] text-[20px] font-bold leading-none tracking-[-.6px] text-[#2e5b3e] sm:text-[24px]">
            {inr(mandi.price)}
            <span className="ml-1 text-[9px] font-medium tracking-normal text-[#78877b]">
              /qtl
            </span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-[8px] font-medium text-[#758379]">
            Today&apos;s Band
          </p>
          <p className="mt-1 text-[9px] font-semibold text-[#5d7865] sm:text-[10px]">
            ₹{mandi.range}
          </p>
        </div>
      </div>

      {/* Market details */}
      <div className="mt-[10px] grid grid-cols-2 gap-3">
        <div className="flex min-w-0 items-start gap-[6px]">
          <span className="mt-[1px] text-[#398153]">
            <Icon name="chart" size={12} />
          </span>
          <div className="min-w-0">
            <p className="text-[8px] text-[#8b978d]">Arrival Volume</p>
            <p className="mt-[2px] text-[9px] font-semibold text-[#435649]">
              {mandi.arrival}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-start gap-[6px]">
          <span className="mt-[1px] text-[#398153]">
            <Icon name="check" size={12} />
          </span>
          <div className="min-w-0">
            <p className="text-[8px] text-[#8b978d]">Source Feed</p>
            <p className="mt-[2px] text-[9px] font-semibold text-[#435649]">
              {mandi.source}
              <span className="font-normal text-[#8b978d]">
                {" "}• {mandi.updated}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Price trend */}
      {index === 0 ? (
        <div className="mt-[8px] flex items-center justify-between gap-2">
          <p className="text-[9px] font-semibold text-[#348552]">
            ↗ {mandi.trend}
          </p>
          <svg
            viewBox="0 0 64 18"
            className="h-[18px] w-[64px] text-[#50a17a]"
            fill="none"
            aria-label="Positive price trend"
          >
            <path
              d="M1 14 C12 14 16 5 27 7 S45 11 52 5 S60 5 63 3"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : (
        <div className="mt-[8px] flex flex-wrap items-center justify-between gap-1">
          <p
            className={`text-[9px] font-medium ${
              index === 1 ? "text-[#9b773b]" : "text-[#398153]"
            }`}
          >
            {index === 1 ? "♨" : "↗"} {mandi.trend}
          </p>
          <span className="text-[8px] text-[#8b978d]">
            Updated {mandi.updated}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-[10px] grid grid-cols-2 gap-[5px]">
        <button
          type="button"
          onClick={() => onAction(mandi, "details")}
          className="flex min-h-[33px] items-center justify-center gap-1 rounded-[7px] bg-[#e3ece2] px-1.5 text-[9px] font-semibold text-[#4f7157] transition hover:bg-[#d5e6d4] sm:min-h-[37px] sm:text-[10px]"
        >
          {index === 0 && <Icon name="chart" size={12} />}
          {mandi.actionOne}
        </button>

        <button
          type="button"
          onClick={() => onAction(mandi, "analysis")}
          className="flex min-h-[33px] items-center justify-center gap-1 rounded-[7px] bg-[#194831] px-1.5 text-[9px] font-semibold text-white transition hover:bg-[#235c3d] sm:min-h-[37px] sm:text-[10px]"
        >
          {index === 0 ? (
            <Icon name="chart" size={12} />
          ) : (
            <Icon name="truck" size={12} />
          )}
          {mandi.actionTwo}
        </button>
      </div>
    </article>
  );
}

function toCard(record, index, highestPrice) {
  const isHighest = record.modalPrice !== null && record.modalPrice === highestPrice;
  return {
    name: record.market || "Unnamed market",
    district: [record.district, record.state].filter(Boolean).join(", "),
    distance: record.variety ? `Variety: ${record.variety}` : "Variety not reported",
    badge: isHighest ? "Highest modal price" : record.grade || "Reported record",
    badgeColor: isHighest ? "orange" : "green",
    price: record.modalPrice,
    range: `${record.minPrice ?? "—"} — ${record.maxPrice ?? "—"}`,
    arrival: record.arrivalDate || "Arrival date not reported",
    source: record.source || "data.gov.in",
    updated: record.arrivalDate || "",
    trend: `${record.commodity}${record.grade ? ` · ${record.grade}` : ""}`,
    actionOne: "Price Details",
    actionTwo: "Net Proceeds",
    icon: index === 0 ? "chart" : "truck",
    raw: record,
  };
}

export default function MandiIntel({ onNavigate = () => {} }) {
  const [search, setSearch] = useState("");
  const [crops, setCrops] = useState(defaultCrops);
  const [selectedCrop, setSelectedCrop] = useState(defaultCrops[0]);
  const [district, setDistrict] = useState("All (TN)");
  const [districts, setDistricts] = useState(["All (TN)"]);
  const [variety, setVariety] = useState("All Varieties");
  const [varieties, setVarieties] = useState(["All Varieties"]);
  const [sortBy, setSortBy] = useState("Highest Price");
  const [savedMandis, setSavedMandis] = useState([]);
  const [selectedMandi, setSelectedMandi] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Crop");
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMandis = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [priceResponse, filterResponse] = await Promise.all([
        getJson("/api/mandi/prices", {
          commodity: selectedCrop,
          state: "Tamil Nadu",
          district: district === "All (TN)" ? undefined : district,
          limit: 50,
        }),
        getJson("/api/mandi/filters", { state: "Tamil Nadu" }),
      ]);
      setRecords(priceResponse.data || []);
      setMeta(priceResponse.meta || null);
      const nextCrops = filterResponse.data?.commodities?.length
        ? filterResponse.data.commodities
        : defaultCrops;
      setCrops(nextCrops);
      setDistricts(["All (TN)", ...(filterResponse.data?.districts || [])]);
      setVarieties(["All Varieties", ...(filterResponse.data?.varieties || [])]);
    } catch (err) {
      setRecords([]);
      setMeta(null);
      setError(getErrorMessage(err, "Unable to load mandi prices."));
    } finally {
      setLoading(false);
    }
  }, [selectedCrop, district]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMandis();
  }, [loadMandis]);

  const mandis = useMemo(() => {
    const highestPrice = records.reduce((max, item) => {
      if (item.modalPrice === null) return max;
      return Math.max(max, item.modalPrice);
    }, 0);
    return records.map((record, index) => toCard(record, index, highestPrice));
  }, [records]);

  const filteredMandis = mandis
    .filter((mandi) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        mandi.name.toLowerCase().includes(term) ||
        mandi.district.toLowerCase().includes(term);
      const matchesVariety =
        variety === "All Varieties" ||
        (mandi.raw.variety || "").toLowerCase() === variety.toLowerCase();
      return matchesSearch && matchesVariety;
    })
    .sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      if (sortBy === "Highest Price") return priceB - priceA;
      if (sortBy === "Lowest Price") return priceA - priceB;
      return 0;
    });

  const toggleSave = async (name) => {
    const card = mandis.find((item) => item.name === name);
    setSavedMandis((previous) =>
      previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name],
    );
    try {
      await postJson("/api/mandi/saved", {
        sessionId: getSessionId(),
        market: name,
        district: card?.raw?.district || "",
        state: card?.raw?.state || "",
        commodity: card?.raw?.commodity || selectedCrop,
      });
    } catch {
      // Saving is optional; the page still shows the local bookmark state.
    }
  };

  const handleAction = (mandi, action) => {
    setSelectedMandi({ ...mandi, action });
  };

  return (
    <div className="min-h-screen bg-[#f0f4f1] text-[#26382d]">
      <div className="mx-auto min-h-screen w-full max-w-[1440px] overflow-hidden border-0 bg-[#f9fbf8] sm:border-x sm:border-[#e0e9e1]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[57px] items-center gap-3 border-b border-[#e8efe8] bg-[#f4faf2]/95 px-4 backdrop-blur-md sm:h-[65px] sm:px-7">
          <button
            type="button"
            onClick={() => onNavigate("Overview")}
            className="flex shrink-0 items-center gap-2 text-[#244e35]"
            aria-label="Return to overview"
          >
            <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-[#e0f0e2]">
              <Icon name="leaf" size={19} />
            </span>
            <span className="text-[12px] font-extrabold tracking-[-.4px] sm:text-[14px]">
              Bharath<span className="font-medium text-[#428052]">AI</span>
            </span>
          </button>

          <div className="hidden h-7 w-px bg-[#dfe8df] sm:block" />

          <div className="min-w-0">
            <p className="text-[9px] text-[#78877b]">Tamil Nadu (CBE)</p>
            <h1 className="text-[13px] font-bold leading-tight text-[#284b34] sm:text-[15px]">
              Mandi Intel
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="flex items-center gap-1 rounded-full bg-[#e8f1e7] px-2 py-[6px] text-[9px] font-semibold text-[#4c6652]"
              onClick={() => setActiveFilter(activeFilter === "Language" ? "Crop" : "Language")}
            >
              <Icon name="globe" size={12} />
              EN / தமிழ்
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-8 w-8 place-items-center rounded-full text-[#627669] hover:bg-[#e8f1e7]"
            >
              <Icon name="bell" size={16} />
              <span className="absolute right-[5px] top-[5px] h-1.5 w-1.5 rounded-full bg-[#d58b47]" />
            </button>

            <span className="grid h-[29px] w-[29px] place-items-center rounded-full bg-[#dce9d9] text-[10px] font-bold text-[#386144]">
              AK
            </span>
          </div>
        </header>

        <main className="mx-auto w-[calc(100%-24px)] max-w-[1120px] pb-[100px] sm:w-[calc(100%-44px)] sm:pb-[105px]">
          {/* Search */}
          <section className="pt-[13px] sm:pt-[17px]">
            <label className="flex min-h-[39px] items-center gap-2 rounded-[9px] border border-[#e8eee7] bg-white px-3 shadow-[0_1px_4px_rgb(25_55_35_/_3%)] sm:min-h-[43px]">
              <Icon name="search" size={16} className="text-[#95a297]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search mandis in Tamil Nadu..."
                className="min-w-0 flex-1 bg-transparent text-[11px] text-[#304b38] outline-none placeholder:text-[#9aa69d] sm:text-xs"
              />
              <Icon name="pin" size={15} className="text-[#718a76]" />
            </label>
          </section>

          {/* Crop selection */}
          <section className="mt-[7px] rounded-[10px] border border-[#e7eee5] bg-[#edf6e9] px-[10px] py-[9px] sm:px-[14px]">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/80 text-[#37834b]">
                <Icon name="leaf" size={16} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold text-[#2d5a3b] sm:text-[12px]">
                  {selectedCrop}
                </p>
                <p className="mt-[2px] text-[9px] text-[#7c8b7e]">
                  Live data.gov.in records • Tamil Nadu
                </p>
              </div>

              <label className="sr-only" htmlFor="crop-select">
                Select crop
              </label>
              <select
                id="crop-select"
                value={selectedCrop}
                onChange={(event) => setSelectedCrop(event.target.value)}
                className="max-w-[112px] rounded-md border border-[#dce8d9] bg-white/80 px-1.5 py-1.5 text-[9px] font-semibold text-[#527259] outline-none sm:max-w-none sm:px-2"
              >
                {crops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Filters */}
          <section className="mt-[7px] flex gap-[5px] overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#194831] px-[10px] py-[6px] text-[9px] font-semibold text-white">
              <Icon name="leaf" size={11} />
              {selectedCrop}
            </span>

            <label className="flex shrink-0 items-center gap-1 rounded-full border border-[#e3eae2] bg-white px-2 py-[5px] text-[9px] text-[#637467]">
              District:
              <select
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                className="max-w-[75px] bg-transparent font-semibold outline-none"
              >
                {districts.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <span>⌄</span>
            </label>

            <label className="flex shrink-0 items-center gap-1 rounded-full border border-[#e3eae2] bg-white px-2 py-[5px] text-[9px] text-[#637467]">
              <select
                value={variety}
                onChange={(event) => setVariety(event.target.value)}
                className="max-w-[91px] bg-transparent font-semibold outline-none"
              >
                {varieties.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <span>⌄</span>
            </label>

            <label className="flex shrink-0 items-center gap-1 rounded-full border border-[#e3eae2] bg-white px-2 py-[5px] text-[9px] text-[#637467]">
              Sort:
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="max-w-[93px] bg-transparent font-semibold outline-none"
              >
                <option>Highest Price</option>
                <option>Lowest Price</option>
                <option>Default</option>
              </select>
              <Icon name="sliders" size={11} />
            </label>
          </section>

          {/* Arrivals banner */}
          <section className="mt-[7px] flex items-center gap-2 rounded-[10px] border border-[#e4eee2] bg-[#e8f3e5] px-[11px] py-[9px] sm:px-[14px]">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/70 text-[#39844e]">
              <Icon name="chart" size={15} />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#416c49]">
                Available records: {records.length}
                <span className="ml-1.5 rounded-full bg-[#d2f2d7] px-1.5 py-0.5 text-[8px] text-[#2b8749]">
                  {meta?.cached ? "Cached" : "Live"}
                </span>
              </p>
              <p className="mt-1 text-[9px] leading-relaxed text-[#7a8d7d]">
                {meta?.retrievedAt
                  ? `Retrieved ${new Date(meta.retrievedAt).toLocaleString("en-IN")} via ${meta.source || "data.gov.in"}`
                  : "Waiting for data.gov.in records"}
              </p>
            </div>
          </section>

          {/* Mandi list heading */}
          <div className="mb-[7px] mt-[13px] flex items-center justify-between">
            <p className="text-[10px] font-semibold text-[#748479]">
              {filteredMandis.length} featured markets
            </p>
            <p className="text-[9px] text-[#87968a]">
              Prices per quintal
            </p>
          </div>

          <div className="mb-3">
            <StatusBanner
              loading={loading}
              error={error}
              empty={!loading && !error && filteredMandis.length === 0}
              emptyText="No mandi records match these filters."
              onRetry={loadMandis}
            />
          </div>

          {/* Market cards */}
          <section className="grid grid-cols-1 gap-[9px] sm:gap-[12px]">
            {filteredMandis.map((mandi, index) => (
              <MandiCard
                key={`${mandi.name}-${mandi.district}-${index}`}
                mandi={mandi}
                index={index}
                onAction={handleAction}
                saved={savedMandis.includes(mandi.name)}
                onToggleSave={toggleSave}
              />
            ))}

            {filteredMandis.length === 0 && (
              <div className="rounded-xl border border-[#e5ece5] bg-white px-4 py-12 text-center">
                <Icon
                  name="search"
                  size={25}
                  className="mx-auto text-[#90a195]"
                />
                <p className="mt-3 text-sm font-semibold text-[#344b39]">
                  No mandis found
                </p>
                <p className="mt-1 text-xs text-[#819086]">
                  Try searching by market name or district.
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 rounded-lg bg-[#194831] px-4 py-2 text-xs font-semibold text-white"
                >
                  Clear search
                </button>
              </div>
            )}
          </section>
        </main>

        {/* Action details modal */}
        {selectedMandi && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#102719]/40 p-3 backdrop-blur-[2px] sm:items-center"
            onClick={() => setSelectedMandi(null)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="mandi-dialog-title"
              className="w-full max-w-[440px] rounded-2xl border border-[#e3ebe3] bg-white p-5 shadow-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#64816b]">
                    Mandi intelligence
                  </p>
                  <h2
                    id="mandi-dialog-title"
                    className="mt-1 text-lg font-bold text-[#254b32]"
                  >
                    {selectedMandi.action === "details"
                      ? selectedMandi.actionOne
                      : selectedMandi.actionTwo}
                  </h2>
                  <p className="mt-1 text-xs text-[#829086]">
                    {selectedMandi.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMandi(null)}
                  className="rounded-lg bg-[#f0f5f0] px-3 py-2 text-xs font-semibold text-[#55705b]"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 rounded-xl bg-[#edf6eb] p-4">
                <p className="text-[10px] text-[#728575]">Current modal rate</p>
                <p className="mt-1 text-3xl font-bold text-[#28593a]">
                  {inr(selectedMandi.price)}
                  <span className="ml-1 text-xs font-medium">/ quintal</span>
                </p>
                <p className="mt-2 text-xs text-[#718574]">
                  Today&apos;s range: ₹{selectedMandi.range}
                </p>
              </div>

              <p className="mt-4 text-xs leading-6 text-[#718075]">
                {selectedMandi.action === "details"
                  ? `Arrival ${selectedMandi.arrival}. Prices are actual data.gov.in values for this market.`
                  : "Open the Calculator page to estimate net proceeds from this modal price after your transport and other costs."}
              </p>

              <button
                type="button"
                onClick={() => setSelectedMandi(null)}
                className="mt-4 w-full rounded-lg bg-[#194831] py-3 text-xs font-semibold text-white hover:bg-[#245b3c]"
              >
                Done
              </button>
            </section>
          </div>
        )}

        <BottomNavigation />
      </div>
    </div>
  );
}
