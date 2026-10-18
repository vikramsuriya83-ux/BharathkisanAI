
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

const crops = [
  "Tomato (Hybrid)",
  "Onion (Bellary)",
  "Green Chilli (G4)",
  "Potato (Kufri)",
];

const initialMarkets = [
  {
    id: 1,
    name: "Madurai Central",
    location: "Madurai District",
    distance: 185,
    price: 1970,
    transport: 450,
    labour: 180,
    commission: 120,
    handling: 100,
    tag: "Best Net Proceeds",
    color: "green",
  },
  {
    id: 2,
    name: "Pollachi Mandi",
    location: "Coimbatore District",
    distance: 42,
    price: 1900,
    transport: 180,
    labour: 150,
    commission: 100,
    handling: 80,
    tag: "Lowest Transport Cost",
    color: "green",
  },
  {
    id: 3,
    name: "Oddanchatram",
    location: "Dindigul District",
    distance: 68,
    price: 1850,
    transport: 250,
    labour: 160,
    commission: 100,
    handling: 90,
    tag: "Nearby Market",
    color: "gray",
  },
];

function Icon({ name, size = 15 }) {
  const icons = {
    leaf: (
      <>
        <path d="M20 4C12 4 5 7 5 14a5 5 0 0 0 5 5c7 0 10-7 10-15Z" />
        <path d="M3 22c3-6 7-10 13-14" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h12v12H3zM15 10h4l3 4v4h-7" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m6 15 4-4 4 2 6-8" />
      </>
    ),
    calculator: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M8 7h8M8 11h2m4 0h2M8 15h2m4 0h2" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m9 11 6-5m-6 8 6 4" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5m0-8h.01" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      {icons[name] || icons.info}
    </svg>
  );
}

const money = (amount) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-[9px] font-semibold text-[#728475]">
        {label}
      </label>
      {children}
    </div>
  );
}

function MarketCard({
  market,
  quantity,
  selected,
  onSelect,
  onExpenseChange,
}) {
  const totalExpenses =
    Number(market.transport) +
    Number(market.labour) +
    Number(market.commission) +
    Number(market.handling);

  const gross = Number(market.price) * quantity;
  const net = gross - totalExpenses;
  const isBest = selected;

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white transition ${
        isBest
          ? "border-[#69b785] shadow-[0_3px_12px_rgb(28_100_53_/_7%)]"
          : "border-[#e5ece3]"
      }`}
    >
      {/* Market heading */}
      <div className="flex items-start justify-between gap-2 px-3 pt-3 sm:px-4">
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold text-[#31513a] sm:text-sm">
            <Icon name="pin" size={12} />
            {market.name}
          </h3>
          <p className="mt-1 text-[8px] text-[#839084] sm:text-[9px]">
            {market.location} · {market.distance} km away
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-bold ${
            isBest
              ? "bg-[#dff6e5] text-[#188348]"
              : market.color === "green"
                ? "bg-[#e9f4e5] text-[#50835a]"
                : "bg-[#f0f3ed] text-[#7d8b7c]"
          }`}
        >
          {market.tag}
        </span>
      </div>

      {/* Price and proceeds */}
      <div className="mx-3 mt-3 rounded-lg bg-[#edf6e9] px-3 py-2.5 sm:mx-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-wide text-[#819180]">
              Modal Rate
            </p>
            <p className="mt-0.5 text-[20px] font-extrabold leading-tight tracking-tight text-[#28563a] sm:text-2xl">
              {money(market.price)}
              <span className="ml-1 text-[9px] font-medium text-[#718775]">
                /quintal
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-[8px] text-[#758777]">Estimated Net Proceeds</p>
            <p className="mt-1 text-[13px] font-extrabold text-[#1d7544] sm:text-base">
              {money(net)}
            </p>
            <p className="text-[8px] text-[#809080]">
              Gross: {money(gross)}
            </p>
          </div>
        </div>
      </div>

      {/* Expense editor */}
      <div className="px-3 pt-2 sm:px-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[9px] font-bold text-[#506852]">
            Expense Breakdown
          </p>
          <p className="text-[8px] text-[#839084]">Edit values (₹)</p>
        </div>

        {[
          {
            key: "transport",
            title: "Transport & Logistics",
            description: "Estimated travel cost",
          },
          {
            key: "labour",
            title: "Loading & Unloading",
            description: "Handling and labour charges",
          },
          {
            key: "commission",
            title: "Market Commission",
            description: "Market and auction fees",
          },
          {
            key: "handling",
            title: "Packaging & Other Costs",
            description: "Additional selling expenses",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-2 border-b border-[#f0f3ed] py-2 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold text-[#506451]">
                {item.title}
              </p>
              <p className="mt-0.5 text-[8px] text-[#98a096]">
                {item.description}
              </p>
            </div>

            <div className="flex w-[90px] shrink-0 items-center rounded-md border border-[#e7eee4] bg-[#f7faf5] px-1.5 sm:w-[110px]">
              <span className="text-[9px] text-[#9a766b]">₹</span>
              <input
                type="number"
                min="0"
                aria-label={`${market.name} ${item.title}`}
                value={market[item.key]}
                onChange={(event) =>
                  onExpenseChange(
                    market.id,
                    item.key,
                    event.target.value
                  )
                }
                className="w-full bg-transparent py-1.5 text-right text-[10px] font-bold text-[#bb6659] outline-none"
              />
            </div>
          </div>
        ))}

        <div className="mt-2 flex items-center justify-between rounded-md bg-[#f3f6ef] px-2.5 py-2">
          <span className="text-[9px] font-bold text-[#586b59]">
            Total Expenses
          </span>
          <span className="text-[10px] font-extrabold text-[#c75b4d]">
            − {money(totalExpenses)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#eaf0e7] px-3 py-2.5 sm:px-4">
        <div className="min-w-0">
          <p className="text-[8px] text-[#8b9689]">Net per quintal</p>
          <p className="mt-0.5 text-[10px] font-bold text-[#397348]">
            {money(quantity > 0 ? net / quantity : 0)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(market.id)}
          className={`rounded-md px-3 py-2 text-[9px] font-bold transition ${
            isBest
              ? "bg-[#17613a] text-white hover:bg-[#104b2c]"
              : "border border-[#dfe9dd] bg-[#f2f7ef] text-[#397149] hover:bg-[#e6f1e2]"
          }`}
        >
          {isBest ? (
            <>
              <Icon name="check" size={11} /> Selected
            </>
          ) : (
            "Select Market"
          )}
        </button>
      </div>
    </article>
  );
}

function BottomNavigation() {
  const items = [
    { name: "Overview", icon: "chart", to: "/overview" },
    { name: "Mandi Intel", icon: "leaf", to: "/mandi-intel" },
    { name: "Comparisons", icon: "chart", to: "/comparison" },
    { name: "Calculator", icon: "calculator", to: "/calculator" },
    { name: "AI Forecast", icon: "info", to: "/ai-forecast" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex min-h-[52px] w-full max-w-[1440px] -translate-x-1/2 items-center justify-around border-t border-[#e1e9df] bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:bottom-2 sm:w-[calc(100%-20px)] sm:rounded-xl sm:border">
      {items.map((item) => (
        <NavLink
          key={item.name}
          to={item.to}
          end
          className={({ isActive }) => `flex min-h-[38px] flex-1 flex-col items-center justify-center gap-1 rounded-lg text-[8px] transition sm:max-w-[145px] sm:text-[9px] ${
            isActive
              ? "bg-[#e5f0e2] font-bold text-[#28623b]"
              : "text-[#778778] hover:bg-[#f0f5ed]"
          }`}
        >
          <Icon name={item.icon} size={14} />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Comparison({ onNavigate = () => {} }) {
  const [crop, setCrop] = useState(crops[0]);
  const [quantity, setQuantity] = useState("50");
  const [unit, setUnit] = useState("Quintals");
  const [sortBy, setSortBy] = useState("net");
  const [selectedId, setSelectedId] = useState(1);
  const [markets, setMarkets] = useState(initialMarkets);
  const [showRecommendation, setShowRecommendation] = useState(true);

  const effectiveQuantity = useMemo(() => {
    const value = Math.max(0, Number(quantity) || 0);

    if (unit === "Tonnes") return value * 10;
    if (unit === "Kg") return value / 100;

    return value;
  }, [quantity, unit]);

  const evaluatedMarkets = useMemo(() => {
    return markets
      .map((market) => {
        const expenses =
          Number(market.transport) +
          Number(market.labour) +
          Number(market.commission) +
          Number(market.handling);

        const gross = Number(market.price) * effectiveQuantity;

        return {
          ...market,
          expenses,
          gross,
          net: gross - expenses,
        };
      })
      .sort((a, b) => {
        if (sortBy === "price") return b.price - a.price;
        if (sortBy === "distance") return a.distance - b.distance;
        return b.net - a.net;
      });
  }, [markets, effectiveQuantity, sortBy]);

  const bestMarket = evaluatedMarkets[0];

  const selectedMarket =
    evaluatedMarkets.find((market) => market.id === selectedId) ||
    bestMarket;

  const updateExpense = (id, key, value) => {
    setMarkets((previous) =>
      previous.map((market) =>
        market.id === id ? { ...market, [key]: value } : market
      )
    );
  };

  const updateCrop = (nextCrop) => {
    setCrop(nextCrop);
  };

  const handleShare = async () => {
    const summary = [
      `Mandi comparison — ${crop}`,
      `Quantity: ${quantity} ${unit}`,
      ...evaluatedMarkets.map(
        (market) =>
          `${market.name}: Rate ${money(market.price)}/quintal, net proceeds ${money(market.net)}`
      ),
      `Selected market: ${selectedMarket.name}`,
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mandi Price Comparison",
          text: summary,
        });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(summary);
      window.alert("Comparison copied to clipboard.");
    } catch {
      window.alert(summary);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf2ee] text-[#304b37]">
      <div className="mx-auto min-h-screen w-full max-w-[1440px] bg-[#f8fbf7] pb-[70px] sm:border-x sm:border-[#dfe8dc]">
        {/* Header */}
        <header className="sticky top-0 z-20 flex min-h-[49px] items-center gap-2 border-b border-[#e3ebe0] bg-[#f3faf0]/95 px-3 backdrop-blur-md sm:min-h-[58px] sm:px-6">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#e0efdc] text-[#2d7544]">
            <Icon name="leaf" size={18} />
          </div>

          <div>
            <p className="text-[8px] text-[#839183]">Tamil Nadu (CBE)</p>
            <h1 className="text-[12px] font-extrabold text-[#2b4c33] sm:text-sm">
              Mandi Comparison
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-full bg-[#e2eee0] px-2 py-1 text-[8px] font-semibold text-[#59765b]">
              EN / தமிழ்
            </span>
            <div className="grid h-7 w-7 place-items-center rounded-full bg-[#e1ecdd] text-[9px] font-bold text-[#376647]">
              AK
            </div>
          </div>
        </header>

        <main className="mx-auto w-[calc(100%-20px)] max-w-[1120px] sm:w-[calc(100%-44px)]">
          {/* Page title */}
          <section className="flex items-center justify-between gap-3 py-3 sm:py-5">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[1px] text-[#32864c]">
                <Icon name="chart" size={11} className="mr-1 inline" />
                Smart market comparison
              </p>
              <h2 className="mt-1 text-[16px] font-extrabold tracking-[-.4px] text-[#264d33] sm:text-xl">
                Find Your Best Mandi
              </h2>
              <p className="mt-1 text-[9px] text-[#819080] sm:text-[11px]">
                Compare market prices, transport costs and estimated net
                returns.
              </p>
            </div>

            <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-[#e0eadd] bg-white text-[#3b8652] sm:flex">
              <Icon name="chart" size={22} />
            </div>
          </section>

          {/* Comparison controls */}
          <section className="rounded-xl border border-[#e2eae0] bg-white p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-[10px] font-extrabold text-[#36563c] sm:text-xs">
                <Icon name="leaf" size={12} className="mr-1 inline" />
                MARKET COMPARISON FILTERS
              </h2>
              <span className="rounded-full bg-[#e1f5e4] px-2 py-1 text-[8px] font-bold text-[#27814a]">
                {evaluatedMarkets.length} Markets
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Select Crop">
                <select
                  value={crop}
                  onChange={(event) => updateCrop(event.target.value)}
                  className="h-[34px] w-full rounded-md border border-[#e1e9de] bg-[#edf5e9] px-2 text-[10px] font-semibold text-[#365a3d] outline-none focus:border-[#73a67b]"
                >
                  {crops.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>

              <Field label="Harvest Quantity">
                <div className="flex h-[34px] overflow-hidden rounded-md border border-[#e1e9de] bg-[#edf5e9]">
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="w-full min-w-0 bg-transparent px-2 text-[11px] font-bold text-[#365a3d] outline-none"
                  />
                  <select
                    value={unit}
                    onChange={(event) => setUnit(event.target.value)}
                    className="max-w-[100px] border-l border-[#dfe9db] bg-[#e7f0e2] px-2 text-[9px] font-semibold text-[#476b4c] outline-none"
                  >
                    <option>Quintals</option>
                    <option>Tonnes</option>
                    <option>Kg</option>
                  </select>
                </div>
              </Field>

              <Field label="Sort Markets By">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-[34px] w-full rounded-md border border-[#e1e9de] bg-[#edf5e9] px-2 text-[10px] font-semibold text-[#365a3d] outline-none focus:border-[#73a67b]"
                >
                  <option value="net">Highest Net Proceeds</option>
                  <option value="price">Highest Modal Price</option>
                  <option value="distance">Nearest Market</option>
                </select>
              </Field>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-md bg-[#e9f4e6] px-2.5 py-2">
              <Icon name="info" size={12} />
              <p className="text-[8px] leading-relaxed text-[#5f785f] sm:text-[9px]">
                <strong>Today's market comparison:</strong> Prices and costs
                below are sample values. Change the quantity and expenses to
                compare your expected returns.
              </p>
            </div>
          </section>

          {/* Summary strip */}
          <section className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-[#e3ebe0] bg-white p-3">
              <p className="text-[8px] text-[#849184]">Markets Compared</p>
              <p className="mt-1 text-lg font-extrabold text-[#315b3c]">
                {evaluatedMarkets.length}
              </p>
            </div>

            <div className="rounded-lg border border-[#d9ead9] bg-[#edf6e9] p-3">
              <p className="text-[8px] text-[#6d856f]">Best Estimated Return</p>
              <p className="mt-1 text-lg font-extrabold text-[#207546]">
                {money(bestMarket?.net || 0)}
              </p>
            </div>

            <div className="col-span-2 rounded-lg border border-[#e3ebe0] bg-white p-3 sm:col-span-1">
              <p className="text-[8px] text-[#849184]">Selected Market</p>
              <p className="mt-1 truncate text-[12px] font-extrabold text-[#315b3c]">
                {selectedMarket?.name || "No market"}
              </p>
            </div>
          </section>

          {/* Market cards */}
          <section className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-[11px] font-extrabold text-[#35583d] sm:text-sm">
                <Icon name="chart" size={13} className="mr-1 inline" />
                Mandi Price Comparison
              </h2>
              <span className="text-[8px] text-[#899589]">
                Sorted by{" "}
                {sortBy === "net"
                  ? "net proceeds"
                  : sortBy === "price"
                    ? "modal price"
                    : "distance"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {evaluatedMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  quantity={effectiveQuantity}
                  selected={market.id === selectedId}
                  onSelect={setSelectedId}
                  onExpenseChange={updateExpense}
                />
              ))}
            </div>
          </section>

          {/* Price comparison bars */}
          <section className="mt-4 rounded-xl border border-[#e1e9df] bg-white p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[10px] font-extrabold text-[#35583d] sm:text-xs">
                <Icon name="chart" size={12} className="mr-1 inline" />
                Net Proceeds Comparison
              </h2>
              <span className="text-[8px] text-[#839084]">
                Estimated returns
              </span>
            </div>

            <div className="space-y-4">
              {evaluatedMarkets.map((market) => {
                const maxNet = Math.max(
                  1,
                  ...evaluatedMarkets.map((item) => Math.max(0, item.net))
                );
                const percentage = Math.max(
                  0,
                  (market.net / maxNet) * 100
                );

                return (
                  <div key={market.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[9px] font-semibold text-[#586d59]">
                        {market.name}
                      </span>
                      <span className="shrink-0 text-[10px] font-extrabold text-[#287747]">
                        {money(market.net)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#edf2e9]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          market.id === selectedId
                            ? "bg-[#087b49]"
                            : "bg-[#83b78a]"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Selected market recommendation */}
          {showRecommendation && selectedMarket && (
            <section className="relative mt-4 overflow-hidden rounded-xl bg-[#153f2c] p-4 text-white sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[10px] font-extrabold tracking-wide text-[#e0eee2] sm:text-xs">
                  <Icon name="check" size={13} className="mr-1 inline" />
                  RECOMMENDED MARKET
                </h2>

                <button
                  type="button"
                  onClick={() => setShowRecommendation(false)}
                  className="rounded-md bg-white/10 px-2 py-1 text-[8px] font-semibold text-white hover:bg-white/20"
                >
                  Dismiss
                </button>
              </div>

              <h3 className="mt-3 text-[17px] font-extrabold sm:text-xl">
                {selectedMarket.name}
              </h3>
              <p className="mt-1 text-[9px] text-[#b9d4bf]">
                {selectedMarket.location} · {selectedMarket.distance} km away
              </p>

              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-[8px] font-semibold text-[#b7d2bd]">
                  ESTIMATED NET PROCEEDS
                </p>
                <p className="mt-1 text-[29px] font-extrabold tracking-tight text-white sm:text-4xl">
                  {money(selectedMarket.net)}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/15 pt-3">
                  <div>
                    <p className="text-[8px] text-[#b7d2bd]">Gross Revenue</p>
                    <p className="mt-1 text-[12px] font-bold text-[#b2efbf]">
                      {money(selectedMarket.gross)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] text-[#b7d2bd]">Total Expenses</p>
                    <p className="mt-1 text-[12px] font-bold text-[#ffc2b1]">
                      − {money(selectedMarket.expenses)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-[9px] leading-relaxed text-[#c4d9c8]">
                Based on the current sample rates and your entered costs,
                {` ${selectedMarket.name} `}is your selected market, with
                estimated net proceeds of {money(selectedMarket.net)}.
                Confirm actual prices and transportation charges before
                travelling.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex min-h-[37px] items-center justify-center gap-2 rounded-md bg-[#07804a] px-3 py-2 text-[9px] font-bold text-white hover:bg-[#099356]"
                >
                  <Icon name="share" size={13} />
                  Share Comparison
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate("Calculator")}
                  className="flex min-h-[37px] items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-[9px] font-bold text-[#28583a] hover:bg-[#eaf3e7]"
                >
                  <Icon name="calculator" size={13} />
                  Open Net Calculator
                </button>
              </div>
            </section>
          )}

          {/* Advisory */}
          <section className="mt-3 flex items-start gap-2 rounded-lg border border-[#f0e8d7] bg-[#fff8e9] p-3">
            <span className="mt-0.5 text-[#ba8d46]">
              <Icon name="info" size={14} />
            </span>
            <div>
              <h3 className="text-[9px] font-bold text-[#80683f]">
                Market Advisory
              </h3>
              <p className="mt-1 text-[8px] leading-relaxed text-[#927d59]">
                Net proceeds are estimates based on the entered modal prices,
                quantity and expenses. Actual prices, commissions, market
                deductions and freight charges may differ. The displayed
                market data is illustrative and is not live API data.
              </p>
            </div>
          </section>

          {/* Agricultural banner */}
          <section className="relative mt-3 h-[85px] overflow-hidden rounded-lg bg-[#244d30] sm:h-[115px]">
            <img
              src="https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=80"
              alt="Fresh produce at an agricultural market"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#14331e]/90 via-[#173b23]/45 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-[85%] flex-col justify-center px-4 text-white sm:px-6">
              <p className="text-[11px] font-extrabold sm:text-sm">
                Compare Smart. Sell Better.
              </p>
              <p className="mt-1 text-[8px] leading-relaxed text-white/85 sm:text-[10px]">
                Find the right mandi for your harvest and make informed
                selling decisions.
              </p>
            </div>
          </section>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
