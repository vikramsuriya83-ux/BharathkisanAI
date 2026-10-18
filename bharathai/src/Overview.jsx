import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { getErrorMessage, getJson, inr } from "./api/client.js";
import StatusBanner from "./components/StatusBanner.jsx";

const fallbackCrops = [
  "Tomato",
  "Onion",
  "Green Chilli",
  "Potato",
];

const timeframes = ["1W", "1M", "3M"];

function Icon({ name, size = 18, className = "" }) {
  const paths = {
    leaf: "M20.8 3.2C12.5 2.7 5.1 5.2 4 11.4c-.7 4.1 2.8 6.8 6.2 5.7 4.7-1.6 8.2-7.1 10.6-13.9ZM3 21c3.5-6.2 7.7-9.8 13.8-13.2",
    pin: "M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z M12 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4",
    language: "M4 5h12M10 3v2m3 0c0 6-4 10-9 12m1-8c1 3 4 6 7 7m2-1 3 6m-6 0 3-6m-1 4h5",
    sliders: "M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 6h4",
    check: "m5 12 4 4L19 6",
    chart: "M3 3v18h18M7 14l4-4 4 3 6-7",
    market: "M3 21h18M5 21V8h14v13M3 8l2-5h14l2 5M9 21v-7h6v7M9 11h.01M15 11h.01",
    spark: "m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z",
    overview: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1V10Z",
    compare: "M5 4v16m0-13h10a3 3 0 0 1 0 6H5m14-9v16m0-4H9a3 3 0 0 1 0-6h10",
    calculator: "M5 3h14v18H5zM8 7h8M8 11h2m4 0h2M8 15h2m4 0h2M8 18h2m4 0h2",
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <path d={paths[name] || paths.spark} />
    </svg>
  );
}

function PriceChart({ timeframe, series }) {
  const chartSeries = series.length ? series : [];
  const prices = chartSeries.map((item) => item.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 1;
  const span = Math.max(maxPrice - minPrice, 1);
  const top = 35;
  const bottom = 206;
  const left = 55;
  const right = 709;

  const points = chartSeries.map((item, index) => {
    const x =
      chartSeries.length === 1
        ? (left + right) / 2
        : left + ((right - left) * index) / (chartSeries.length - 1);
    const y = bottom - ((item.price - minPrice) / span) * (bottom - top);
    return [x, y, item];
  });

  const line = points
    .map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`)
    .join(" ");

  const area = points.length
    ? `${line} L${points[points.length - 1][0]} 206 L${points[0][0]} 206 Z`
    : "";

  const last = points[points.length - 1];
  const axisLabels = [maxPrice, maxPrice - span * 0.25, maxPrice - span * 0.5, maxPrice - span * 0.75, minPrice];

  if (!chartSeries.length) {
    return (
      <div className="mt-2 flex h-[190px] w-full items-center justify-center rounded-lg bg-[#f7faf7] text-center text-[10px] text-[#7e8b82] sm:h-[239px]">
        Not enough dated mandi records were returned to draw a {timeframe} price trajectory.
      </div>
    );
  }

  return (
    <div
      className="mt-2 h-[190px] w-full sm:h-[239px]"
      role="img"
      aria-label={`${timeframe} modal price trajectory from actual mandi records`}
    >
      <svg
        className="h-full w-full overflow-visible"
        viewBox="0 0 760 260"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="chart-area-fill"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#a5d6b5" stopOpacity=".48" />
            <stop offset="100%" stopColor="#eaf5ed" stopOpacity=".18" />
          </linearGradient>
        </defs>

        {[35, 78, 121, 164, 207].map((y) => (
          <line
            key={y}
            x1="42"
            x2="730"
            y1={y}
            y2={y}
            stroke="#edf1ee"
            strokeWidth="1"
          />
        ))}

        {axisLabels.map((label, index) => (
            <text
              key={`${label}-${index}`}
              x="0"
              y={39 + index * 43}
              fill="#87938b"
              fontSize="9"
            >
              {inr(label)}
            </text>
          ))}

        <path d={area} fill="url(#chart-area-fill)" />

        <path
          d={line}
          fill="none"
          stroke="#34774a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {points.slice(0, -1).map(([x, y], index) => (
          <circle
            key={`${x}-${y}-${index}`}
            cx={x}
            cy={y}
            r="4"
            fill="#fff"
            stroke="#4a8a5b"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {last && (
          <>
            <circle cx={last[0]} cy={last[1]} r="8" fill="#4b8b5c" opacity=".15" />
            <circle
              cx={last[0]}
              cy={last[1]}
              r="4.5"
              fill="#2c6b40"
              stroke="#fff"
              strokeWidth="1.5"
            />
            <g transform={`translate(${Math.max(last[0] - 135, 42)} 0)`}>
              <rect width="112" height="43" rx="8" fill="#194a30" />
              <text x="10" y="18" fill="#fff" fontSize="11" fontWeight="700">
                {inr(last[2].price)}
              </text>
              <text x="10" y="33" fill="#c2d9c7" fontSize="8">
                {last[2].date}
              </text>
            </g>
          </>
        )}

        {points.map(([x, , item], index) => (
          <text
            key={`${item.date}-${index}`}
            x={x}
            y="239"
            textAnchor="middle"
            fill="#87938b"
            fontSize="9"
          >
            {item.date}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function Overview() {
  const [activeCrop, setActiveCrop] = useState("Tomato");
  const [crops, setCrops] = useState(fallbackCrops);
  const [timeframe, setTimeframe] = useState("1W");
  const [language, setLanguage] = useState("EN");
  const [cropMenuOpen, setCropMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getJson("/api/dashboard/summary", {
        commodity: activeCrop,
        state: "Tamil Nadu",
      });
      setDashboard(response.data);
      const filterResponse = await getJson("/api/mandi/filters", {
        state: "Tamil Nadu",
      });
      const commodities = filterResponse.data?.commodities || [];
      if (commodities.length) {
        const preferred = fallbackCrops.filter((crop) =>
          commodities.some((item) => item.toLowerCase().includes(crop.toLowerCase())),
        );
        setCrops(preferred.length ? preferred : commodities.slice(0, 8));
      }
    } catch (err) {
      setDashboard(null);
      setError(getErrorMessage(err, "Unable to load dashboard data."));
    } finally {
      setLoading(false);
    }
  }, [activeCrop]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboard();
  }, [loadDashboard]);

  const latest = dashboard?.summary?.latest;
  const highest = dashboard?.summary?.highest;
  const change = dashboard?.summary?.change;
  const weather = dashboard?.weather;
  const trendPoints = useMemo(() => {
    const points = dashboard?.trend?.points || [];
    if (timeframe === "1W") return points.slice(-7);
    if (timeframe === "1M") return points.slice(-30);
    return points;
  }, [dashboard, timeframe]);

  const navItems = [
    { label: "Overview", icon: "overview", to: "/overview" },
    { label: "Mandi Intel", icon: "market", to: "/mandi-intel" },
    { label: "Comparisons", icon: "compare", to: "/comparison" },
    { label: "Calculator", icon: "calculator", to: "/calculator" },
    { label: "AI Forecast", icon: "spark", to: "/ai-forecast" },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4f1] p-0 text-[#26382d] sm:p-6">
      <div className="relative mx-auto min-h-screen w-full overflow-hidden border-0 border-[#e2eae4] bg-white shadow-none sm:min-h-[calc(100vh-48px)] sm:max-w-[1440px] sm:rounded-[20px] sm:border sm:shadow-[0_12px_36px_rgb(21_51_35_/_6%)]">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#edf1ee] bg-white px-[18px] sm:h-[76px] sm:gap-[22px] sm:px-[clamp(24px,5vw,76px)]">
          <a
            href="#overview"
            aria-label="BharathAI home"
            className="inline-flex shrink-0 items-center gap-[9px] text-[#183d2b] no-underline"
          >
            <span className="grid h-[31px] w-[31px] place-items-center rounded-[11px] bg-[#e8f4eb] text-[#21633c] sm:h-[34px] sm:w-[34px]">
              <Icon name="leaf" size={21} />
            </span>
            <span className="text-[15px] font-extrabold tracking-[-0.7px] sm:text-[17px]">
              bharath<span className="font-medium text-[#438256]">ai</span>
            </span>
          </a>

          <div className="hidden h-8 w-px bg-[#e7ede8] sm:block" />

          <div className="hidden flex-col gap-[3px] sm:flex">
            <span className="text-[9px] font-bold tracking-[1.15px] text-[#748179]">
              YOUR REGION
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#23392c]">
              <Icon name="pin" size={14} className="text-[#668770]" />
              Tamil Nadu <span className="font-normal text-[#85918a]">(CBE)</span>
            </span>
          </div>

          <span className="ml-1 hidden text-[13px] font-semibold text-[#34483b] sm:block sm:ml-4">
            Overview
          </span>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() =>
                setLanguage((previous) => (previous === "EN" ? "தமிழ்" : "EN"))
              }
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[10px] font-semibold text-[#3b4e41] hover:bg-[#f4f8f5] sm:text-[11px]"
            >
              <Icon name="language" size={16} className="text-[#718379]" />
              {language}
              <span className="text-[15px] text-[#819087]">⌄</span>
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-[#3b4e41] hover:bg-[#f4f8f5]"
            >
              <Icon name="bell" size={18} />
              <span className="absolute right-[6px] top-[6px] h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-[#d78149]" />
            </button>

            <button
              type="button"
              aria-label="User profile"
              className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-[#e9f0ea] text-[11px] font-bold text-[#2c6040] sm:h-[34px] sm:w-[34px]"
            >
              AK
            </button>
          </div>
        </header>

        {/* Main content */}
        <main
          id="overview"
          className="mx-auto w-[calc(100%-36px)] max-w-[1080px] pb-28 sm:w-[calc(100%-64px)] sm:pb-[138px]"
        >
          {/* Hero */}
          <section className="relative py-[25px] sm:py-[35px]">
            <div className="mb-[15px] flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-[7px] rounded-full border border-[#dcecdf] bg-[#f0f8f1] px-[9px] py-[6px] text-[8px] font-bold tracking-[.75px] text-[#34754b] sm:text-[9px]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#56a66a]" />
                LIVE MANDI PULSE
              </span>

              <span className="flex items-center gap-1 text-[10px] font-medium text-[#77857b] sm:text-[11px]">
                <Icon name="pin" size={14} />
                Coimbatore Basin
              </span>
            </div>

            <h1 className="max-w-[690px] text-[clamp(29px,8vw,37px)] font-semibold leading-[1.14] tracking-[-1.2px] text-[#193e2b] sm:text-[clamp(29px,3.5vw,43px)] sm:tracking-[-1.8px]">
              Your crops. Your markets.
              <br className="hidden sm:block" /> Better decisions.
            </h1>

            <p className="mb-[17px] mt-[10px] max-w-[650px] text-xs leading-[1.6] text-[#718078] sm:mb-[22px] sm:text-[13px]">
              Explore verified mandi prices, weather conditions, and market
              comparisons from live public data sources.
            </p>

            {/* Selected crop */}
            <div className="flex min-h-[58px] flex-wrap items-center gap-x-[9px] gap-y-2 rounded-xl border border-[#e9efea] bg-white p-[9px] shadow-[0_3px_12px_rgb(30_66_41_/_3%)] sm:flex-nowrap sm:gap-3 sm:px-[14px] sm:py-[9px]">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#edf6ef] text-[#39804d]">
                <Icon name="leaf" size={19} />
              </span>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[#293e31] sm:text-xs">
                  {activeCrop}
                  <span className="font-medium text-[#6f8075]">
                    {" "}
                    / Tamil Nadu
                  </span>
                </p>
                <p className="mt-1 text-[10px] text-[#7e8b82]">
                  Tamil Nadu <span className="px-1 text-[#b2bcb5]">•</span>
                  Coimbatore Hub
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCropMenuOpen(!cropMenuOpen)}
                className="ml-auto inline-flex shrink-0 items-center gap-[7px] rounded-lg bg-[#eff6f0] px-2 py-[7px] text-[10px] font-semibold text-[#2c6a40] hover:bg-[#e4f1e6] sm:px-[10px] sm:text-[11px]"
              >
                <Icon name="sliders" size={15} />
                Change
              </button>
            </div>

            {cropMenuOpen && (
              <div className="relative z-10 mt-2 rounded-xl border border-[#e0ebe0] bg-white p-2 shadow-lg">
                {crops.map((crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => {
                      setActiveCrop(crop);
                      setCropMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-[#34483b] hover:bg-[#edf6ef]"
                  >
                    {crop}
                    {activeCrop === crop && (
                      <Icon name="check" size={14} />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {crops.map((crop) => {
                const selected = activeCrop === crop;

                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => setActiveCrop(crop)}
                    className={`inline-flex min-h-[29px] shrink-0 items-center gap-[5px] rounded-full border px-[11px] text-[9px] font-medium transition sm:text-[10px] ${
                      selected
                        ? "border-[#1c5132] bg-[#1e5033] text-white"
                        : "border-[#e7ede8] bg-white text-[#66766b] hover:border-[#b9d4bf] hover:text-[#28623c]"
                    }`}
                  >
                    {selected && <Icon name="check" size={13} />}
                    {crop}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mb-3">
            <StatusBanner
              loading={loading}
              error={error}
              empty={!loading && !error && dashboard?.empty}
              emptyText="No mandi records were returned for this crop in Tamil Nadu."
              onRetry={loadDashboard}
            />
          </div>

          {/* Current prices */}
          <section className="grid gap-3">
            <article className="relative min-h-[157px] overflow-hidden rounded-[14px] bg-[#16432c] px-[17px] py-[17px] text-white sm:min-h-[170px] sm:px-6 sm:pb-[17px] sm:pt-5">
              <span className="absolute -right-[60px] -top-[130px] h-[300px] w-[300px] rounded-full border border-white/[0.08]" />
              <span className="absolute -right-[20px] -top-[79px] h-[198px] w-[198px] rounded-full border border-white/[0.08]" />

              <div className="relative z-[1] flex items-center justify-between gap-2">
                <span className="text-[8px] font-bold tracking-[1.15px] text-[#b6d1bc] sm:text-[9px]">
                  LATEST MODAL PRICE <span className="ml-1">ⓘ</span>
                </span>
                <span className="inline-flex items-center gap-[5px] rounded-full border border-white/[0.15] bg-white/[0.07] px-2 py-1.5 text-[8px] font-medium text-[#d6e8d8] sm:px-[9px] sm:text-[9px]">
                  <Icon name="check" size={12} className="text-[#8ccea0]" />
                  Agrimarket Verified
                </span>
              </div>

              <div className="relative z-[1] mt-[15px] flex flex-wrap items-baseline gap-x-2 gap-y-2 sm:mt-3">
                <span className="text-[38px] font-semibold leading-none tracking-[-1.5px] sm:text-[46px]">
                  {latest ? inr(latest.modalPrice) : "—"}
                </span>
                <span className="text-[10px] text-[#bfd1c3] sm:text-xs">
                  / quintal
                </span>
                <span className="rounded-full border border-[#95d2a1]/20 bg-[#8fc797]/10 px-2 py-1.5 text-[9px] font-semibold text-[#b8e0bf] sm:ml-2 sm:text-[10px]">
                  {change
                    ? `${change.amount >= 0 ? "↗ +" : "↘ "}${inr(Math.abs(change.amount))} (${change.percent ?? "—"}%)`
                    : "No comparable previous date"}
                  <span className="font-normal text-[#a9c7af]">
                    {" "}
                    {change ? `vs ${change.fromDate}` : ""}
                  </span>
                </span>
              </div>

              <div className="relative z-[1] mt-[11px] flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-white/10 pt-3 text-[9px] text-[#b3c9b8] sm:gap-[11px] sm:text-[10px]">
                <span className="inline-flex items-center gap-[5px] text-[#e0ece2]">
                  <Icon name="pin" size={14} />
                  {latest?.market || "No market record"}
                </span>
                <span className="hidden h-3 w-px bg-white/20 sm:block" />
                <span>{latest?.arrivalDate || "Arrival date unavailable"}</span>
                <span className="ml-auto hidden items-center gap-[5px] sm:inline-flex">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#77c987]" />
                  {dashboard ? "data.gov.in" : "Waiting for data"}
                </span>
              </div>
            </article>

            <article className="flex min-h-[103px] items-center justify-between gap-2 rounded-[13px] border border-[#e8eee9] bg-white px-[14px] py-[14px] sm:min-h-[105px] sm:gap-5 sm:px-[21px] sm:py-4">
              <div className="min-w-0">
                <span className="flex items-center gap-1.5 text-[8px] font-bold tracking-[1px] text-[#748179] sm:text-[9px]">
                  <Icon name="pin" size={14} />
                  HIGHEST REPORTED TODAY
                </span>
                <div className="mt-1.5 text-[19px] font-bold tracking-[-.5px] text-[#203d2c] sm:text-[21px]">
                  {highest ? inr(highest.modalPrice) : "—"}{" "}
                  <span className="text-[10px] font-medium tracking-normal text-[#7b8980]">
                    / quintal
                  </span>
                </div>
                <p className="mt-1 text-[9px] text-[#77847b] sm:text-[10px]">
                  {highest ? `${highest.market}, ${highest.district}` : "No comparable record"}
                  <span className="px-1 text-[#b2bcb5]">·</span>
                  {highest?.arrivalDate || ""}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#edf6ef] px-2 py-1.5 text-[8px] font-semibold text-[#367249] sm:px-[10px] sm:text-[10px]">
                {latest && highest
                  ? `${inr(highest.modalPrice - latest.modalPrice)} difference`
                  : "Awaiting records"}
              </span>
            </article>
          </section>

          {/* Stats */}
          <section className="mt-[9px] grid grid-cols-1 gap-[9px] sm:mt-3 sm:grid-cols-2 sm:gap-3">
            <article className="relative min-h-[118px] overflow-hidden rounded-[13px] border border-[#e5eee7] bg-[#f7faf7] px-4 py-[15px] sm:min-h-[129px] sm:px-[19px] sm:py-[17px]">
              <div className="flex items-center gap-2">
                <span className="grid h-[27px] w-[27px] place-items-center rounded-lg bg-[#eaf4ec] text-[#3a7950]">
                  <Icon name="market" size={17} />
                </span>
                <span className="text-[9px] font-bold tracking-[1px] text-[#748179]">
                  ACTIVE MANDIS
                </span>
              </div>
              <p className="mt-[10px] text-2xl font-bold tracking-[-.8px] text-[#203d2c]">
                {dashboard?.summary?.marketCount ?? "—"}{" "}
                <span className="text-xs font-medium tracking-normal text-[#687a6e]">Markets</span>
              </p>
              <p className="mt-[3px] text-[10px] text-[#78867d]">
                {dashboard
                  ? `${dashboard.summary?.recordCount || 0} priced records returned for ${activeCrop}`
                  : "Waiting for mandi records"}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8fc49a] via-[#d8ebdc] to-transparent" />
            </article>

            <article className="relative min-h-[118px] overflow-hidden rounded-[13px] border border-[#e5eee7] bg-[#f5f9f5] px-4 py-[15px] sm:min-h-[129px] sm:px-[19px] sm:py-[17px]">
              <div className="flex items-center gap-2">
                <span className="grid h-[27px] w-[27px] place-items-center rounded-lg bg-[#eaf4ec] text-[#3a7950]">
                  <Icon name="spark" size={17} />
                </span>
                <span className="text-[9px] font-bold tracking-[1px] text-[#748179]">
                  WEATHER FORECAST
                </span>
                <span className="ml-auto rounded border border-[#dceade] px-1.5 py-1 text-[7px] font-bold tracking-wide text-[#548062]">
                  OPEN-METEO
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="mt-[10px] text-[23px] font-bold tracking-[-.8px] text-[#203d2c]">
                  {weather?.today?.maxTemperature != null
                    ? `${weather.today.maxTemperature}°C`
                    : "—"}{" "}
                  <span className="text-[11px] font-semibold text-[#55815e]">
                    {weather?.today?.minTemperature != null
                      ? `min ${weather.today.minTemperature}°C`
                      : ""}
                  </span>
                </p>
                <span className="grid h-[31px] w-[31px] place-items-center rounded-[9px] bg-[#e8f3e9] text-[#438052]">
                  <Icon name="chart" size={18} />
                </span>
              </div>

              <p className="mt-[3px] flex items-center gap-1.5 text-[10px] text-[#78867d]">
                <span className="h-[5px] w-[5px] rounded-full bg-[#56a66a]" />
                {dashboard?.weatherError
                  ? dashboard.weatherError
                  : weather?.today
                    ? `Rain chance ${weather.today.precipitationProbability ?? "—"}% · ${weather.today.precipitationSum ?? "—"} mm`
                    : "Weather unavailable"}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8fc49a] via-[#d8ebdc] to-transparent" />
            </article>
          </section>

          {/* Chart */}
          <section className="mt-[10px] rounded-[14px] border border-[#e7ede8] bg-white px-[13px] pb-3 pt-4 sm:mt-[13px] sm:px-5 sm:pb-[13px] sm:pt-[19px]">
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              <div>
                <h2 className="text-sm font-bold tracking-[-.25px] text-[#243d2e] sm:text-[15px]">
                  Modal Price Trajectory
                </h2>
                <p className="mt-[5px] text-[9px] text-[#7e8b82] sm:text-[10px]">
                  {dashboard?.trend?.message || "Actual dated mandi records"}{" "}
                  <span className="px-[3px] text-[#b4beb7]">·</span>
                  Tamil Nadu
                </p>
              </div>

              <div className="flex shrink-0 gap-0.5 rounded-lg border border-[#e9efea] bg-[#f7f9f7] p-[3px]">
                {timeframes.map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setTimeframe(period)}
                    className={`min-w-[27px] rounded-md px-[5px] py-[5px] text-[9px] font-semibold transition sm:min-w-[31px] sm:px-[7px] ${
                      timeframe === period
                        ? "bg-white text-[#2b6840] shadow-[0_1px_4px_rgb(28_59_39_/_10%)]"
                        : "text-[#7a887f] hover:bg-white"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <PriceChart timeframe={timeframe} series={trendPoints} />

            <div className="flex items-center gap-[7px] border-t border-[#f0f3f0] pt-[7px] text-[9px] text-[#68776e]">
              <span className="h-0.5 w-[15px] rounded bg-[#418253]" />
              Modal price
              <span className="ml-auto text-[#98a39b]">
                Prices in ₹ per quintal
              </span>
            </div>
          </section>

          {/* Opportunities */}
          <section className="pb-8 pt-[23px] sm:pt-[27px]">
            <span className="mb-[7px] block text-[8px] font-bold tracking-[1px] text-[#718b78]">
              SMARTER ROUTES, BETTER RETURNS
            </span>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-[17px] font-bold tracking-[-.45px] text-[#243d2e] sm:text-[19px]">
                Mandi Opportunities Near You
              </h2>
            </div>

            {!dashboard?.opportunities?.length && (
              <p className="mt-4 text-[10px] text-[#7e8b82]">
                Market highlights appear when comparable mandi records are available.
              </p>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(dashboard?.opportunities || []).map((market) => (
                <article
                  key={market.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#e6eee4] bg-[#f8fbf6] p-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#e1f3e3] text-[#15803d]">
                      <Icon name="pin" size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-bold text-[#244c35]">
                        {market.name}
                      </p>
                      <p className="mt-1 text-[8px] text-[#7e8b82]">
                        {market.location}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] font-bold text-[#16834a]">
                      {inr(market.price)}
                    </p>
                    <p className="mt-1 text-[8px] text-[#98a39b]">
                      {market.label}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        {/* Bottom navigation */}
        <nav
          aria-label="Primary navigation"
          className="fixed bottom-[max(10px,env(safe-area-inset-bottom))] left-1/2 z-30 flex min-h-[61px] w-[calc(100%-20px)] -translate-x-1/2 items-center justify-around rounded-[14px] border border-[#e4ebe5] bg-white/[.96] px-1 py-[5px] shadow-[0_8px_30px_rgb(23_54_35_/_12%)] backdrop-blur-xl sm:bottom-6 sm:min-h-[66px] sm:w-[min(720px,calc(100vw-40px))] sm:rounded-[15px] sm:px-3 sm:py-[7px]"
        >
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end
                className={({ isActive }) => `flex min-h-[47px] min-w-0 flex-1 flex-col items-center justify-center gap-[2px] rounded-[10px] px-0.5 py-1 transition sm:min-w-[86px] sm:flex-none sm:gap-[3px] sm:px-3 sm:py-[5px] ${
                  isActive
                    ? "bg-[#edf6ef] text-[#28653d]"
                    : "text-[#829087] hover:bg-[#f4f8f5]"
                }`}
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} size={17} />
                    <span
                      className={`whitespace-nowrap text-[8px] sm:text-[9px] ${
                        isActive ? "font-bold" : "font-medium"
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
