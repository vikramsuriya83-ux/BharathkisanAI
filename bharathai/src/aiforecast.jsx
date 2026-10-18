import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getErrorMessage, getJson, inr, postJson } from "./api/client.js";
import StatusBanner from "./components/StatusBanner.jsx";

function Icon({ name, size = 16, className = "" }) {
  const icons = {
    leaf: <><path d="M20 4C12 4 5 7 5 14a5 5 0 0 0 5 5c7 0 10-7 10-15Z" /><path d="M3 22c3-6 7-10 13-14" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m6 15 4-4 4 2 6-8" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    cloud: <><path d="M20 16.2A4.5 4.5 0 0 0 18 7.5a6 6 0 0 0-11.6 1.8A4 4 0 0 0 7 17h11" /><path d="m12 11-3 4h3l-1 4 4-5h-3l1-3" /></>,
    rain: <><path d="M20 16.2A4.5 4.5 0 0 0 18 7.5a6 6 0 0 0-11.6 1.8A4 4 0 0 0 7 17h11" /><path d="m8 20 1-2m4 2 1-2m4 2 1-2" /></>,
    truck: <><path d="M3 6h12v12H3z" /><path d="M15 10h4l3 4v4h-7" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 15 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" /><path d="M10 21h4" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m9 11 6-5m-6 8 6 4" /></>,
    overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    market: <><path d="M3 21h18M5 21V8h14v13M3 8l2-5h14l2 5" /><path d="M9 21v-7h6v7" /></>,
    compare: <><path d="M5 4v16m0-13h10a3 3 0 0 1 0 6H5m14-9v16m0-4H9a3 3 0 0 1 0-6h10" /></>,
    calculator: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h2m4 0h2M8 15h2m4 0h2" /></>,
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
      {icons[name] || icons.spark}
    </svg>
  );
}

function ForecastChart({ series = [], message = "" }) {
  const [period, setPeriod] = useState("7D");

  const values =
    period === "7D"
      ? series.slice(-7)
      : period === "3D"
        ? series.slice(-3)
        : series.slice(-1);

  const width = 640;
  const height = 190;
  const left = 42;
  const right = 20;
  const top = 18;
  const bottom = 30;

  const priceValues = values.map((item) => item.price);
  const min = priceValues.length ? Math.min(...priceValues) : 0;
  const max = priceValues.length ? Math.max(...priceValues) : 1;
  const span = Math.max(max - min, 1);

  const points = values.map((item, index) => ({
    ...item,
    day: item.date || item.day,
    x: left + (index * (width - left - right)) / Math.max(values.length - 1, 1),
    y: top + ((max - item.price) / span) * (height - top - bottom),
  }));

  const line = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const area =
    points.length > 1
      ? `${line} L ${points[points.length - 1].x} ${height - bottom} L ${points[0].x} ${height - bottom} Z`
      : "";

  if (!points.length) {
    return (
      <div className="mt-3 rounded-xl border border-[#e3ece3] bg-[#f7faf7] px-4 py-5 text-center text-[12px] text-[#67806f] sm:text-[14px]">
        Not enough dated mandi records are available to draw a reliable price trend for this period.
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-[13px] font-bold text-[#294b35] sm:text-sm">
            Recent Price Trends & Weather Insights
          </h3>
          <p className="mt-1 text-[9px] text-[#879489] sm:text-[10px]">
            {message || "Actual dated mandi records | Tamil Nadu"}
          </p>
        </div>

        <div className="flex shrink-0 rounded-md border border-[#e5ece4] bg-[#f8faf7] p-0.5">
          {["1D", "3D", "7D"].map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded px-2 py-1 text-[9px] font-semibold ${
                period === item
                  ? "bg-[#e0eee0] text-[#28613b]"
                  : "text-[#879489] hover:bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-[#78877b]">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-[#08794c]" />
          Observed modal prices
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 border-t-2 border-dashed border-[#43a978]" />
          Not a future-price prediction
        </span>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="mt-1 h-auto w-full"
          role="img"
          aria-label="Observed mandi prices from dated records"
        >
          <defs>
            <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f9a68" stopOpacity=".18" />
              <stop offset="100%" stopColor="#2f9a68" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[max, min + span * 0.66, min + span * 0.33, min].map((value) => {
            const y =
              top + ((max - value) / span) * (height - top - bottom);

            return (
              <g key={value}>
                <line
                  x1={left}
                  x2={width - right}
                  y1={y}
                  y2={y}
                  stroke="#e9eee8"
                  strokeDasharray="3 4"
                />
                <text
                  x={left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#9aa59b"
                >
                  {value.toLocaleString("en-IN")}
                </text>
              </g>
            );
          })}

          {points.length > 1 && (
            <path d={area} fill="url(#forecastArea)" />
          )}

          {points.length > 1 && (
            <path
              d={line}
              fill="none"
              stroke="#08794c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map((point, index) => (
            <g key={point.day}>
              <circle
                cx={point.x}
                cy={point.y}
                r={index === points.length - 1 ? 4.5 : 3}
                fill="#fff"
                stroke={index === points.length - 1 ? "#08794c" : "#42a476"}
                strokeWidth="2"
              />
              {(index === 0 ||
                index === points.length - 1 ||
                values.length <= 3) && (
                <text
                  x={point.x}
                  y={height - 10}
                  fontSize="9"
                  textAnchor={
                    index === 0
                      ? "start"
                      : index === points.length - 1
                        ? "end"
                        : "middle"
                  }
                  fill="#7e8b80"
                >
                  {point.day}
                </text>
              )}
            </g>
          ))}

          {points.length > 0 && (
            <g>
              <line
                x1={points[points.length - 1].x}
                x2={points[points.length - 1].x}
                y1={points[points.length - 1].y + 8}
                y2={height - bottom}
                stroke="#36a06d"
                strokeDasharray="4 4"
              />
              <rect
                x={Math.min(
                  points[points.length - 1].x - 43,
                  width - right - 83
                )}
                y={Math.max(points[points.length - 1].y - 25, 1)}
                width="82"
                height="19"
                rx="4"
                fill="#174d32"
              />
              <text
                x={Math.min(
                  points[points.length - 1].x - 2,
                  width - right - 42
                )}
                y={Math.max(points[points.length - 1].y - 12, 14)}
                fontSize="9"
                fontWeight="600"
                textAnchor="middle"
                fill="#fff"
              >
                ₹{points[points.length - 1].price.toLocaleString("en-IN")}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1ec] pt-2">
        <span className="flex items-center gap-1 text-[9px] font-medium text-[#5c8065]">
          <Icon name="check" size={12} />
          {values.length >= 2 ? "Comparable dated records found" : "Insufficient history"}
        </span>
        <span className="rounded-full bg-[#e6f5e8] px-2 py-1 text-[9px] font-bold text-[#287b46]">
          Observed prices only
        </span>
      </div>
    </div>
  );
}

function Metric({ label, value, detail, progress }) {
  return (
    <div className="rounded-lg border border-[#e6eee4] bg-[#f0f7ed] p-3">
      <p className="text-[9px] font-medium text-[#758778]">{label}</p>
      <p className="mt-1 text-[17px] font-extrabold leading-tight tracking-[-.4px] text-[#235637] sm:text-[20px]">
        {value}
      </p>
      {detail && (
        <p className="mt-1 text-[9px] leading-relaxed text-[#829083]">
          {detail}
        </p>
      )}
      {progress !== undefined && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#dce8d9]">
          <div
            className="h-full rounded-full bg-[#15834d]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

function Driver({ icon, title, description, impact, color = "green" }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
          color === "orange"
            ? "bg-[#fff0d7] text-[#c58731]"
            : "bg-[#e0f4e3] text-[#2f8b51]"
        }`}
      >
        <Icon name={icon} size={15} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-[#344c39] sm:text-[11px]">
          {title}
        </p>
        <p className="mt-1 text-[9px] leading-relaxed text-[#859187]">
          {description}
        </p>
      </div>

      <span
        className={`shrink-0 text-[9px] font-bold ${
          impact === "Neutral" ? "text-[#7d8a7f]" : "text-[#2c8b4e]"
        }`}
      >
        {impact}
      </span>
    </div>
  );
}

function BottomNavigation() {
  const items = [
    { name: "Overview", icon: "overview", to: "/overview" },
    { name: "Mandi Intel", icon: "market", to: "/mandi-intel" },
    { name: "Comparisons", icon: "compare", to: "/comparison" },
    { name: "Calculator", icon: "calculator", to: "/calculator" },
    { name: "AI Forecast", icon: "spark", to: "/ai-forecast" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 flex min-h-[58px] w-full max-w-[1440px] -translate-x-1/2 items-center justify-around border-t border-[#e2ebe1] bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgb(25_55_35_/_5%)] backdrop-blur-lg sm:bottom-2 sm:w-[calc(100%-20px)] sm:rounded-xl sm:border">
      {items.map((item) => (
        <NavLink
          key={item.name}
          to={item.to}
          end
          className={({ isActive }) => `flex min-h-[43px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-[8px] transition sm:max-w-[145px] sm:text-[9px] ${
            isActive
              ? "bg-[#e3eee1] font-bold text-[#28583a]"
              : "text-[#7b887d] hover:bg-[#f2f6f0]"
          }`}
        >
          <Icon name={item.icon} size={15} />
          <span className="whitespace-nowrap">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function AIForecast({ onNavigate = () => {} }) {
  const [crop, setCrop] = useState("Tomato");
  const [crops, setCrops] = useState(["Tomato", "Onion", "Green Chilli", "Potato"]);
  const [showAlert, setShowAlert] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [alertSaved, setAlertSaved] = useState(false);
  const [alertError, setAlertError] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState(null);

  const loadInsights = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [insightResponse, filterResponse] = await Promise.all([
        getJson("/api/insights", { commodity: crop, state: "Tamil Nadu" }),
        getJson("/api/mandi/filters", { state: "Tamil Nadu" }),
      ]);
      setInsights(insightResponse.data);
      if (filterResponse.data?.commodities?.length) {
        setCrops(filterResponse.data.commodities);
      }
      const latestPrice = insightResponse.data?.summary?.latest?.modalPrice;
      setTargetPrice((current) =>
        current ? current : latestPrice ? String(Math.round(latestPrice)) : "",
      );
    } catch (err) {
      setInsights(null);
      setError(getErrorMessage(err, "Unable to load price trends and weather."));
    } finally {
      setLoading(false);
    }
  }, [crop]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadInsights();
  }, [loadInsights]);

  const currentPrice = insights?.summary?.latest?.modalPrice;
  const change = insights?.summary?.change;
  const weather = insights?.weather;
  const weatherAlert = weather?.alerts?.[0];

  const handleAlert = () => {
    setAlertSaved(false);
    setShowAlert(true);
  };

  return (
    <div className="min-h-screen bg-[#eef3ef] text-[#294234]">
      <div className="mx-auto min-h-screen w-full max-w-[1440px] bg-[#f9fbf8] pb-[76px] sm:border-x sm:border-[#e1eae1]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex min-h-[53px] items-center gap-2 border-b border-[#e6eee5] bg-[#f4faf1]/95 px-3 backdrop-blur-md sm:min-h-[62px] sm:px-6">
          <button
            type="button"
            onClick={() => onNavigate("Overview")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e2f0e0] text-[#23603b]"
            aria-label="Back to overview"
          >
            <Icon name="leaf" size={19} />
          </button>

          <div className="min-w-0">
            <p className="text-[8px] text-[#839084]">Tamil Nadu (CBE)</p>
            <h1 className="text-[12px] font-extrabold text-[#284c35] sm:text-sm">
              Price Trends &amp; Weather Insights
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-full border border-[#dce9da] bg-[#e8f3e5] px-2 py-1 text-[8px] font-semibold text-[#49724f]">
              EN / தமிழ்
            </span>
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-8 w-8 place-items-center rounded-full text-[#63796a]"
            >
              <Icon name="bell" size={16} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#dc8a43]" />
            </button>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#dce9d8] text-[9px] font-bold text-[#376346]">
              AK
            </span>
          </div>
        </header>

        <main className="mx-auto w-[calc(100%-22px)] max-w-[1120px] sm:w-[calc(100%-44px)]">
          {/* Crop selector */}
          <div className="flex items-center justify-between gap-3 pt-3 sm:pt-5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#e8f3e4] text-[#32834a]">
                <Icon name="leaf" size={17} />
              </span>
              <div className="min-w-0">
                <p className="text-[8px] text-[#849185]">Trends for crop</p>
                <select
                  value={crop}
                  onChange={(event) => setCrop(event.target.value)}
                  className="mt-0.5 max-w-full bg-transparent text-[11px] font-bold text-[#31533a] outline-none sm:text-[13px]"
                >
                  {crops.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#e1f5e6] px-2 py-1.5 text-[8px] font-bold text-[#218047]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2b9957]" />
              Live observations
            </span>
          </div>

          <div className="mt-3">
            <StatusBanner
              loading={loading}
              error={error}
              empty={!loading && !error && insights?.empty}
              emptyText="No dated mandi records were returned for this crop."
              onRetry={loadInsights}
            />
          </div>

          {/* Price summary */}
          <section className="relative mt-3 overflow-hidden rounded-[11px] bg-[#153f2c] p-3.5 text-white shadow-sm sm:p-5">
            <div className="pointer-events-none absolute -right-5 -top-9 h-32 w-32 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-2 -top-4 h-24 w-24 rounded-full border border-white/10" />

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-[8px] font-semibold tracking-[.9px] text-[#b8d2bf]">
                  LATEST MODAL PRICE
                </p>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-[29px] font-extrabold leading-none tracking-[-1px] sm:text-[37px]">
                    {currentPrice != null ? inr(currentPrice) : "—"}
                  </span>
                  <span className="text-[9px] text-[#c3d8c7]">/quintal</span>
                </div>
                <p className="mt-2 text-[9px] text-[#b5d0bd]">
                  <span className="font-bold text-[#6be39b]">
                    {change
                      ? `${change.amount >= 0 ? "↗ +" : "↘ "}${inr(Math.abs(change.amount))} (${change.percent ?? "—"}%)`
                      : "No comparable previous date"}
                  </span>
                  {change ? ` vs ${change.fromDate}` : ""}
                </p>
              </div>

              <span className="flex items-center gap-1 rounded-full border border-[#448765]/50 bg-[#1c583c] px-2 py-1 text-[8px] font-bold text-[#9aefb5]">
                <Icon name="check" size={11} />
                Observed data
              </span>
            </div>

            <div className="relative mt-3 border-t border-white/10 pt-2">
              <p className="text-[9px] font-semibold text-[#e0f0e2]">
                <Icon name="pin" size={11} className="mr-1 inline" />
                {insights?.summary?.latest
                  ? `${insights.summary.latest.market}, ${insights.summary.latest.district || "Tamil Nadu"}`
                  : "Tamil Nadu"}
              </p>
              <p className="mt-1 text-[8px] leading-relaxed text-[#b2cdb9]">
                {insights?.disclaimer ||
                  "Recent mandi observations and weather forecasts. This is not a future-price prediction."}
              </p>
            </div>
          </section>

          {/* Forecast trajectory */}
          <section className="mt-3 rounded-[11px] border border-[#e6ece5] bg-white p-3 sm:p-4">
            <ForecastChart
              series={insights?.trend?.points || []}
              message={insights?.trend?.message}
            />
          </section>

          {/* Model engine */}
          <section className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#304d38] sm:text-sm">
                <Icon name="shield" size={15} className="text-[#378451]" />
                Weather Insights
              </h2>
              <span className="rounded-full bg-[#e0f5e5] px-2 py-1 text-[8px] font-bold text-[#288249]">
                Open-Meteo
              </span>
            </div>

            <div className="rounded-[11px] border border-[#e2ece0] bg-[#edf6ea] p-3 sm:p-4">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-[#32814a]">
                  <Icon name="check" size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-[#31553b]">
                    Rule-based weather alerts
                  </p>
                  <p className="mt-1 text-[9px] leading-relaxed text-[#7b8b7d]">
                    Alerts are generated from Open-Meteo forecasts using simple
                    temperature and rainfall thresholds. They are not machine
                    learning predictions.
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Metric
                  label="Max temperature"
                  value={
                    weather?.today?.maxTemperature != null
                      ? `${weather.today.maxTemperature}°C`
                      : "—"
                  }
                  detail={weather?.timezone || insights?.weatherError || "Forecast unavailable"}
                />
                <Metric
                  label="Min temperature"
                  value={
                    weather?.today?.minTemperature != null
                      ? `${weather.today.minTemperature}°C`
                      : "—"
                  }
                  detail={weather?.today?.date || ""}
                />
                <Metric
                  label="Rain probability"
                  value={
                    weather?.today?.precipitationProbability != null
                      ? `${weather.today.precipitationProbability}%`
                      : "—"
                  }
                  detail="Next forecast day"
                  progress={weather?.today?.precipitationProbability ?? 0}
                />
                <Metric
                  label="Precipitation"
                  value={
                    weather?.today?.precipitationSum != null
                      ? `${weather.today.precipitationSum} mm`
                      : "—"
                  }
                  detail={weatherAlert?.title || "No weather alert"}
                />
              </div>
            </div>
          </section>

          {/* Key price drivers */}
          <section className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#304d38] sm:text-sm">
                <Icon name="chart" size={15} className="text-[#378451]" />
                Key Price Drivers
              </h2>
              <span className="text-[8px] text-[#849185]">Observed signals</span>
            </div>

            <div className="divide-y divide-[#eaf0e8] overflow-hidden rounded-[11px] border border-[#e5ece4] bg-white">
              <Driver
                icon="rain"
                title="Rainfall & Weather"
                description={
                  weatherAlert?.description ||
                  (weather?.today
                    ? `Forecast rain chance ${weather.today.precipitationProbability ?? "—"}% and ${weather.today.precipitationSum ?? "—"} mm precipitation.`
                    : insights?.weatherError || "Weather data is unavailable.")
                }
                impact={weatherAlert ? weatherAlert.title : "Watch"}
              />
              <Driver
                icon="leaf"
                title="Latest mandi record"
                description={
                  insights?.summary?.latest
                    ? `${insights.summary.latest.market} reported ${inr(insights.summary.latest.modalPrice)} on ${insights.summary.latest.arrivalDate}.`
                    : "No mandi record is available yet."
                }
                impact={insights?.summary?.recordCount ? `${insights.summary.recordCount} records` : "None"}
              />
              <Driver
                icon="truck"
                title="Price change"
                description={
                  change
                    ? `Comparable records moved from ${change.fromDate} to ${change.toDate}.`
                    : "The current-price API did not return enough dated records to calculate a change."
                }
                impact={change ? `${change.amount >= 0 ? "+" : ""}${inr(change.amount)}` : "Neutral"}
              />
              <Driver
                icon="chart"
                title="Trend coverage"
                description={insights?.trend?.message || "Trend coverage depends on dated records actually returned by data.gov.in."}
                impact={insights?.trend?.sufficient ? "Available" : "Limited"}
              />
            </div>
          </section>

          {/* Advisory */}
          <section className="mt-4 rounded-[11px] border border-[#f0e6ce] bg-[#fff8e9] p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#ffedcb] text-[#b7832e]">
                <Icon name="spark" size={17} />
              </span>
              <div>
                <h2 className="text-[11px] font-extrabold text-[#785927]">
                  Advisory & Probabilistic Disclaimer
                </h2>
                <p className="mt-1.5 text-[9px] leading-[1.7] text-[#927d57]">
                  This page does not predict future prices. It shows recent
                  mandi observations when dated records exist, plus Open-Meteo
                  weather forecasts. Actual market prices can change due to
                  weather, supply, demand and local conditions.
                </p>
              </div>
            </div>
          </section>

          {/* Primary action */}
          <div className="mt-3 flex items-stretch gap-2">
            <button
              type="button"
              onClick={handleAlert}
              className="flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#08764a] px-3 py-2 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#08633f] active:scale-[.99] sm:text-xs"
            >
              <Icon name="bell" size={15} />
              Set Target Price Alert{currentPrice ? ` (${inr(currentPrice)})` : ""}
            </button>

            <button
              type="button"
              onClick={() => setShowShare(!showShare)}
              aria-label="Share forecast"
              className="grid min-h-[42px] w-[42px] shrink-0 place-items-center rounded-[8px] border border-[#e2eae1] bg-white text-[#58735e] hover:bg-[#edf5eb]"
            >
              <Icon name="share" size={16} />
            </button>
          </div>

          {showShare && (
            <div className="mt-2 rounded-lg border border-[#e0e9df] bg-white p-3">
              <p className="text-[10px] font-bold text-[#35553d]">
                Forecast summary
              </p>
              <p className="mt-1 text-[10px] text-[#77867a]">
                {crop}: Latest {currentPrice != null ? inr(currentPrice) : "—"}/qtl • Observed trend only
              </p>
              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(
                      `${crop}: Latest modal price ${currentPrice != null ? inr(currentPrice) : "unavailable"}/quintal. This is an observed price, not a forecast.`,
                    );
                    setShowShare(false);
                  }
                }}
                className="mt-2 rounded-md bg-[#e5f1e3] px-3 py-2 text-[10px] font-semibold text-[#2d6940]"
              >
                Copy summary
              </button>
            </div>
          )}
        </main>

        {/* Target price alert modal */}
        {showAlert && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#12281a]/45 p-3 backdrop-blur-sm sm:items-center"
            onClick={() => setShowAlert(false)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="alert-title"
              className="w-full max-w-[390px] rounded-2xl border border-[#e2ebe0] bg-white p-5 shadow-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e4f4e3] text-[#278047]">
                    <Icon name="bell" size={19} />
                  </span>
                  <h2
                    id="alert-title"
                    className="mt-3 text-base font-extrabold text-[#2d4c35]"
                  >
                    Set target price alert
                  </h2>
                  <p className="mt-1 text-[10px] text-[#829084]">
                    Get notified when your target is reached.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAlert(false)}
                  className="rounded-lg px-2 py-1 text-sm text-[#6e8072]"
                >
                  ✕
                </button>
              </div>

              <label
                htmlFor="target-price"
                className="mt-5 block text-[10px] font-bold text-[#4d6652]"
              >
                Target price per quintal (₹)
              </label>
              <input
                id="target-price"
                type="number"
                min="1"
                value={targetPrice}
                onChange={(event) => setTargetPrice(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[#dce8d9] bg-[#f8fbf6] px-3 py-3 text-sm font-bold text-[#2d5738] outline-none focus:border-[#5c9a69]"
              />

              {alertError && (
                <p className="mt-3 rounded-lg bg-[#fff1ed] p-3 text-[10px] font-semibold text-[#9a4d3f]">
                  {alertError}
                </p>
              )}
              {alertSaved ? (
                <p className="mt-3 rounded-lg bg-[#e6f6e8] p-3 text-[10px] font-semibold text-[#287541]">
                  Alert saved in MongoDB for this project. The app does not send
                  push notifications.
                </p>
              ) : (
                <button
                  type="button"
                  disabled={!targetPrice || Number(targetPrice) <= 0}
                  onClick={async () => {
                    setAlertError("");
                    try {
                      await postJson("/api/insights/alerts", {
                        crop,
                        targetPrice: Number(targetPrice),
                        market: insights?.summary?.latest?.market || "",
                      });
                      setAlertSaved(true);
                    } catch (err) {
                      setAlertError(
                        getErrorMessage(err, "Unable to save the alert."),
                      );
                    }
                  }}
                  className="mt-4 w-full rounded-lg bg-[#08764a] py-3 text-[11px] font-bold text-white hover:bg-[#08633f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save alert
                </button>
              )}
            </section>
          </div>
        )}

        <BottomNavigation />
      </div>
    </div>
  );
}
