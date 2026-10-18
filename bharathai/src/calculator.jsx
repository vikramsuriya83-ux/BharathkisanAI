import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

function Icon({ name, size = 16, className = "" }) {
  const paths = {
    calculator: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M8 7h8M8 11h2m4 0h2M8 15h2m4 0h2" />
      </>
    ),
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
    check: <path d="m5 12 4 4L19 6" />,
    truck: (
      <>
        <path d="M3 6h12v12H3zM15 10h4l3 4v4h-7" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
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
    save: (
      <>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
        <path d="M17 21v-8H7v8M7 3v5h8" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5m0-8h.01" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m6 15 4-4 4 2 6-8" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
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
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {paths[name] || paths.info}
    </svg>
  );
}

function SectionTitle({ children, right }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <h2 className="text-[11px] font-extrabold text-[#294c35] sm:text-xs">
        {children}
      </h2>
      {right}
    </div>
  );
}

function FieldLabel({ children, right }) {
  return (
    <div className="mb-1 flex items-center justify-between gap-2">
      <label className="text-[9px] font-semibold text-[#536b58]">
        {children}
      </label>
      {right}
    </div>
  );
}

function NumberInput({ value, onChange, prefix, suffix, min = 0 }) {
  return (
    <div className="flex h-[31px] items-center gap-1.5 rounded-md border border-[#e3ede0] bg-[#edf5e9] px-2 focus-within:border-[#70a77a]">
      {prefix && (
        <span className="text-[10px] font-semibold text-[#56735b]">
          {prefix}
        </span>
      )}
      <input
        type="number"
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-w-0 bg-transparent text-[11px] font-bold text-[#31583b] outline-none"
      />
      {suffix && (
        <span className="shrink-0 text-[9px] text-[#718474]">{suffix}</span>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, right }) {
  return (
    <div className="min-w-0">
      {label && <FieldLabel right={right}>{label}</FieldLabel>}
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[32px] w-full appearance-none rounded-md border border-[#e3ede0] bg-[#edf5e9] px-2 pr-7 text-[10px] font-semibold text-[#34563c] outline-none focus:border-[#70a77a]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#728676]">
          <Icon name="arrow" size={12} className="rotate-90" />
        </span>
      </div>
    </div>
  );
}

function ExpenseRow({ title, description, value, onChange, negative = true }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#edf1e9] py-2 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold text-[#405a45]">{title}</p>
        <p className="mt-0.5 text-[8px] leading-relaxed text-[#899589]">
          {description}
        </p>
      </div>

      <div className="w-[92px] shrink-0 sm:w-[125px]">
        <div
          className={`flex h-[27px] items-center rounded-md border border-[#e4ece1] bg-[#f4f8f1] px-2 ${
            negative ? "text-[#ce5d4d]" : "text-[#267f4a]"
          }`}
        >
          <span className="mr-1 text-[9px] font-bold">
            {negative ? "− ₹" : "₹"}
          </span>
          <input
            type="number"
            min="0"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full min-w-0 bg-transparent text-right text-[10px] font-bold outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function BottomNavigation() {
  const items = [
    { label: "Overview", icon: "globe", to: "/overview" },
    { label: "Mandi Intel", icon: "leaf", to: "/mandi-intel" },
    { label: "Comparisons", icon: "chart", to: "/comparison" },
    { label: "Calculator", icon: "calculator", to: "/calculator" },
    { label: "AI Forecast", icon: "info", to: "/ai-forecast" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 flex min-h-[53px] w-full max-w-[1440px] -translate-x-1/2 items-center justify-around border-t border-[#e0e9df] bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-3px_14px_rgb(30_60_35_/_5%)] backdrop-blur-md sm:bottom-2 sm:w-[calc(100%-20px)] sm:rounded-xl sm:border">
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end
          className={({ isActive }) => `flex min-h-[38px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-[8px] transition sm:max-w-[145px] sm:text-[9px] ${
            isActive
              ? "bg-[#e2eee0] font-bold text-[#285c39]"
              : "text-[#7a887b] hover:bg-[#f2f6f0]"
          }`}
        >
          <Icon name={item.icon} size={14} />
          <span className="whitespace-nowrap">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function Calculator({ onNavigate = () => {} }) {
  const [crops] = useState(["Tomato", "Onion", "Green Chilli", "Potato"]);
  const [markets] = useState([]);
  const [crop, setCrop] = useState("Tomato");
  const [market, setMarket] = useState("");
  const [quantity, setQuantity] = useState("50");
  const [unit, setUnit] = useState("Qt");
  const [sellingPrice, setSellingPrice] = useState("");
  const [transport, setTransport] = useState("0");
  const [loading, setLoading] = useState("0");
  const [marketFee, setMarketFee] = useState("0");
  const [handling, setHandling] = useState("0");
  const [other, setOther] = useState("0");
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  const calculations = useMemo(() => {
    const amount = Math.max(0, Number(quantity) || 0);
    const rate = Math.max(0, Number(sellingPrice) || 0);

    // Convert the entered quantity to quintals.
    const quintals =
      unit === "Ton"
        ? amount * 10
        : unit === "Kg"
          ? amount / 100
          : amount;

    const gross = quintals * rate;
    const transportCost = Math.max(0, Number(transport) || 0);
    const loadingCost = Math.max(0, Number(loading) || 0);
    const feeCost = Math.max(0, Number(marketFee) || 0);
    const handlingCost = Math.max(0, Number(handling) || 0);
    const otherCost = Math.max(0, Number(other) || 0);

    const totalExpenses =
      transportCost + loadingCost + feeCost + handlingCost + otherCost;

    return {
      quintals,
      gross,
      totalExpenses,
      net: gross - totalExpenses,
      transportCost,
      loadingCost,
      feeCost,
      handlingCost,
      otherCost,
    };
  }, [
    quantity,
    unit,
    sellingPrice,
    transport,
    loading,
    marketFee,
    handling,
    other,
  ]);

  const money = (value) =>
    `₹${Math.round(value).toLocaleString("en-IN")}`;

  const handleSave = () => {
    const record = {
      crop,
      market,
      quantity: Number(quantity),
      unit,
      sellingPrice: Number(sellingPrice),
      estimatedGross: calculations.gross,
      totalExpenses: calculations.totalExpenses,
      estimatedNet: calculations.net,
      savedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(
        window.localStorage.getItem("mandi-calculations") || "[]"
      );
      window.localStorage.setItem(
        "mandi-calculations",
        JSON.stringify([...existing, record])
      );
      setSaved(true);
    } catch {
      setSaved(false);
      setShareMessage("Could not save this calculation in local storage.");
      setShareOpen(true);
    }
  };

  const handleShare = async () => {
    const summary = [
      "Mandi Net-Proceeds Calculator",
      `Crop: ${crop}`,
      `Market: ${market}`,
      `Quantity: ${quantity} ${unit}`,
      `Selling price: ${money(Number(sellingPrice) || 0)}/quintal`,
      `Gross proceeds: ${money(calculations.gross)}`,
      `Total expenses: ${money(calculations.totalExpenses)}`,
      `Estimated net proceeds: ${money(calculations.net)}`,
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mandi Net-Proceeds Calculator",
          text: summary,
        });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(summary);
      setShareMessage("Calculation copied to clipboard.");
    } catch {
      setShareMessage(summary);
    }

    setShareOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#edf2ee] text-[#294234]">
      <div className="mx-auto min-h-screen w-full max-w-[1440px] bg-[#f9fbf8] pb-[72px] sm:border-x sm:border-[#e0e8df]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex min-h-[51px] items-center gap-2 border-b border-[#e5ece3] bg-[#f4faf1]/95 px-3 backdrop-blur-md sm:min-h-[60px] sm:px-6">
          <button
            type="button"
            onClick={() => onNavigate("Overview")}
            aria-label="Go to overview"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#e1efde] text-[#2b7545]"
          >
            <Icon name="leaf" size={18} />
          </button>

          <div>
            <p className="text-[8px] text-[#829083]">Tamil Nadu (CBE)</p>
            <h1 className="text-[12px] font-extrabold text-[#294c35] sm:text-sm">
              Calculator
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-full bg-[#e5f0e2] px-2 py-1 text-[8px] font-semibold text-[#54725a]">
              EN / தமிழ்
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#dce9d8] text-[9px] font-bold text-[#376346]">
              AK
            </span>
          </div>
        </header>

        <main className="mx-auto w-[calc(100%-22px)] max-w-[1120px] sm:w-[calc(100%-44px)]">
          {/* Page heading */}
          <section className="flex items-start justify-between gap-3 py-3 sm:py-5">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[1px] text-[#3b8b56]">
                <Icon name="calculator" size={11} className="mr-1 inline" />
                Market decision tools
              </p>
              <h2 className="mt-1 text-[15px] font-extrabold tracking-[-.4px] text-[#234d32] sm:text-xl">
                Net-Proceeds & Arbitrage Calculator
              </h2>
              <p className="mt-1 max-w-[570px] text-[9px] leading-relaxed text-[#7d8b7e] sm:text-[11px]">
                Calculate your estimated net income after transport, handling
                and market expenses.
              </p>
            </div>

            <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#dce8da] bg-white text-[#328451]">
              <Icon name="calculator" size={17} />
            </span>
          </section>

          {/* Crop and market */}
          <section className="rounded-[10px] border border-[#e3ebe1] bg-white p-3 sm:p-4">
            <SectionTitle
              right={
                <span className="rounded-full bg-[#e4f5e5] px-2 py-1 text-[8px] font-bold text-[#32864b]">
                  <Icon name="check" size={10} className="mr-1 inline" />
                  Optimisation Live
                </span>
              }
            >
              <Icon name="leaf" size={12} className="mr-1 inline text-[#39874d]" />
              Crop & Market Details
            </SectionTitle>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SelectField
                label="Crop Commodity"
                value={crop}
                onChange={setCrop}
                options={crops}
              />

              <SelectField
                label="Target Mandi / APMC"
                value={market}
                onChange={setMarket}
                options={markets}
                right={
                  <span className="text-[8px] font-semibold text-[#35834a]">
                    Market Price Sync
                  </span>
                }
              />
            </div>

            {/* Quantity */}
            <div className="mt-3">
              <FieldLabel
                right={
                  <span className="text-[8px] font-semibold text-[#39884e]">
                    ↗ +6.0% over yesterday
                  </span>
                }
              >
                Harvest Volume
              </FieldLabel>

              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                <NumberInput
                  value={quantity}
                  onChange={(value) => {
                    setQuantity(value);
                    setSaved(false);
                  }}
                  suffix={unit === "Qt" ? "Qt" : unit}
                />

                <div className="grid grid-cols-3 rounded-md border border-[#e1e9df] bg-[#f5f8f3] p-0.5">
                  {[
                    { label: "Qt", value: "Qt" },
                    { label: "Tons", value: "Ton" },
                    { label: "Kg", value: "Kg" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setUnit(item.value);
                        setSaved(false);
                      }}
                      className={`rounded px-1 py-1.5 text-[9px] font-semibold transition ${
                        unit === item.value
                          ? "bg-white text-[#28603a] shadow-sm"
                          : "text-[#829083] hover:bg-[#eaf2e7]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-right text-[8px] text-[#849184]">
                Equivalent quantity: {calculations.quintals.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })} quintals
              </p>
            </div>

            {/* Selling price */}
            <div className="mt-3">
              <FieldLabel
                right={
                  <span className="text-[8px] font-semibold text-[#33864a]">
                    Live Market Rate
                  </span>
                }
              >
                Expected Realisation Rate (₹/Qt)
              </FieldLabel>
              <NumberInput
                prefix="₹"
                value={sellingPrice}
                onChange={(value) => {
                  setSellingPrice(value);
                  setSaved(false);
                }}
                suffix="/Qt"
              />
            </div>
          </section>

          {/* Expenses */}
          <section className="mt-3 rounded-[10px] border border-[#e3ebe1] bg-white p-3 sm:p-4">
            <SectionTitle
              right={
                <span className="text-[8px] text-[#849184]">
                  All values in ₹
                </span>
              }
            >
              <Icon name="chart" size={12} className="mr-1 inline text-[#39874d]" />
              Freight & Direct Costs
            </SectionTitle>

            <div className="mb-2 rounded-md bg-[#f1f7ed] px-2.5 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] font-bold text-[#405a45]">
                  Logistics Cost
                </p>
                <span className="text-[8px] font-semibold text-[#7c8a7d]">
                  Per shipment
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-[#dce8d8]">
                <div className="h-1.5 w-[26%] rounded-full bg-[#18834b]" />
              </div>

              <div className="mt-1 flex justify-between text-[8px] text-[#859185]">
                <span>Transport estimate</span>
                <span className="font-bold text-[#2b7544]">
                  {money(Number(transport) || 0)}
                </span>
              </div>
            </div>

            <ExpenseRow
              title="Transport & Freight"
              description="Estimated travel and delivery expenses"
              value={transport}
              onChange={(value) => {
                setTransport(value);
                setSaved(false);
              }}
            />

            <ExpenseRow
              title="Manual Labour & Commission"
              description="Handling, loading and labour charges"
              value={loading}
              onChange={(value) => {
                setLoading(value);
                setSaved(false);
              }}
            />

            <ExpenseRow
              title="Market & Auction Fees"
              description="Market fee and auction-related charges"
              value={marketFee}
              onChange={(value) => {
                setMarketFee(value);
                setSaved(false);
              }}
            />

            <ExpenseRow
              title="Packaging & Handling"
              description="Packing materials and loading assistance"
              value={handling}
              onChange={(value) => {
                setHandling(value);
                setSaved(false);
              }}
            />

            <ExpenseRow
              title="Other Expenses"
              description="Additional costs for this shipment"
              value={other}
              onChange={(value) => {
                setOther(value);
                setSaved(false);
              }}
            />

            <div className="mt-2 flex items-center justify-between rounded-md bg-[#f2f6ef] px-3 py-2.5">
              <div>
                <p className="text-[9px] font-bold text-[#435d48]">
                  Total Direct Expenses
                </p>
                <p className="mt-0.5 text-[8px] text-[#839083]">
                  All costs combined
                </p>
              </div>
              <p className="text-[12px] font-extrabold text-[#c75c4d]">
                − {money(calculations.totalExpenses)}
              </p>
            </div>
          </section>

          {/* Net proceeds */}
          <section className="relative mt-3 overflow-hidden rounded-[10px] bg-[#153f2c] p-4 text-white sm:p-5">
            <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-3 -top-7 h-28 w-28 rounded-full border border-white/10" />

            <div className="relative flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wide text-[#d8eadd]">
                <Icon name="calculator" size={13} />
                NET PROCEEDS SUMMARY
              </h2>
              <span className="rounded-full bg-[#276143] px-2 py-1 text-[8px] font-bold text-[#a5efb9]">
                All Costs Mapped
              </span>
            </div>

            <p className="relative mt-4 text-[9px] text-[#b7d2bd]">
              ESTIMATED NET INCOME
            </p>
            <div className="relative mt-1 flex flex-wrap items-baseline gap-2">
              <p className="text-[29px] font-extrabold leading-none tracking-[-.8px] text-white sm:text-[36px]">
                {money(calculations.net)}
              </p>
              <span className="text-[9px] text-[#bad8c1]">net proceeds</span>
            </div>

            <p className="relative mt-2 text-[9px] text-[#a8cbb2]">
              Gross realisation: {money(calculations.gross)} ·{" "}
              {calculations.quintals.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}{" "}
              Qt
            </p>

            <div className="relative mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-3">
              <div>
                <p className="text-[8px] text-[#bad0be]">Net per quintal</p>
                <p className="mt-1 text-[12px] font-bold text-[#9debb2]">
                  {money(
                    calculations.quintals > 0
                      ? calculations.net / calculations.quintals
                      : 0
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-[#bad0be]">Total expenses</p>
                <p className="mt-1 text-[12px] font-bold text-[#ffc1ad]">
                  −{money(calculations.totalExpenses)}
                </p>
              </div>
            </div>

            {calculations.net < 0 && (
              <p className="relative mt-3 rounded-md bg-[#713b31]/50 p-2 text-[9px] text-[#ffe0d4]">
                Expenses exceed gross proceeds. Review your selling price and
                costs.
              </p>
            )}
          </section>

          {/* Disclaimer */}
          <div className="mt-3 flex items-start gap-2 rounded-md border border-[#f0e7d4] bg-[#fff8e9] p-2.5">
            <Icon
              name="info"
              size={13}
              className="mt-0.5 shrink-0 text-[#b88b42]"
            />
            <p className="text-[8px] leading-relaxed text-[#927d58]">
              <strong>Advisory:</strong> This estimate uses the prices and
              expenses entered above. Actual net proceeds may vary with final
              sale price, deductions, transport charges and market conditions.
              Confirm all rates before making a selling decision.
            </p>
          </div>

          {/* Actions */}
          <button
            type="button"
            onClick={handleSave}
            className="mt-3 flex min-h-[39px] w-full items-center justify-center gap-2 rounded-md bg-[#087849] px-3 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#08653e] active:scale-[.99]"
          >
            <Icon name="save" size={14} />
            {saved ? "Calculation Saved" : "Save Calculation to My Farmbook"}
          </button>

          {saved && (
            <p className="mt-2 rounded-md bg-[#e5f5e5] p-2 text-center text-[9px] font-semibold text-[#2e7b44]">
              Saved on this device. Connect your backend to sync calculations
              across devices.
            </p>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="mt-2 flex min-h-[34px] w-full items-center justify-center gap-2 rounded-md border border-[#e1eae0] bg-[#f0f7ed] px-3 py-2 text-[9px] font-semibold text-[#3e7350] transition hover:bg-[#e4f0e0]"
          >
            <Icon name="share" size={13} />
            Share Breakdown via WhatsApp / PDF
          </button>

          {shareOpen && (
            <div className="mt-2 rounded-lg border border-[#dfe9dc] bg-white p-3">
              <p className="whitespace-pre-wrap break-words text-[10px] leading-relaxed text-[#46604a]">
                {shareMessage || "Your calculation is ready to share."}
              </p>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="mt-2 text-[9px] font-bold text-[#287646]"
              >
                Close
              </button>
            </div>
          )}

          {/* Agricultural image banner */}
          <section className="relative mt-3 h-[90px] overflow-hidden rounded-lg bg-[#254c30] sm:h-[130px]">
            <img
              src="https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=80"
              alt="Fresh tomatoes harvested for agricultural markets"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#102b1a]/85 via-[#183b24]/35 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-[80%] flex-col justify-center px-4 text-white sm:px-6">
              <p className="text-[11px] font-extrabold sm:text-sm">
                Smarter Decisions. Better Harvests.
              </p>
              <p className="mt-1 text-[8px] leading-relaxed text-white/85 sm:text-[10px]">
                Know your costs, estimate your returns, and plan your next
                market move with confidence.
              </p>
            </div>
          </section>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
