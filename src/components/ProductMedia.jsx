import { useId, useState } from "react";

/* Product photo, falling back to an illustrated bottle if the image is missing. */
export default function ProductMedia({ product, eager = false }) {
  const [failed, setFailed] = useState(false);
  if (product.image && !failed) {
    return (
      <img
        className="photo"
        src={product.image}
        alt={`${product.brand} ${product.name}`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }
  return <BottleIllustration product={product} />;
}

const SHAPES = {
  square: { body: (p) => <rect x="40" y="110" width="120" height="155" rx="8" {...p} />, top: 110, neck: [86, 96, 28, 16], cap: (p) => <rect x="70" y="46" width="60" height="52" rx="4" {...p} />, labelY: 168, labelW: 84 },
  tall: { body: (p) => <rect x="58" y="80" width="84" height="185" rx="6" {...p} />, top: 80, neck: [88, 68, 24, 14], cap: (p) => <rect x="74" y="22" width="52" height="48" rx="3" {...p} />, labelY: 160, labelW: 64 },
  round: { body: (p) => <circle cx="100" cy="186" r="78" {...p} />, top: 108, neck: [86, 96, 28, 16], cap: (p) => <rect x="74" y="52" width="52" height="46" rx="3" {...p} />, labelY: 174, labelW: 82 },
  flask: { body: (p) => <path d="M48 118H152L164 254Q165 265 154 265H46Q35 265 36 254Z" {...p} />, top: 118, neck: [88, 100, 24, 20], cap: (p) => <circle cx="100" cy="76" r="27" {...p} />, labelY: 178, labelW: 82 },
  // Pump bottle (body lotion)
  lotion: { body: (p) => <rect x="56" y="106" width="88" height="159" rx="18" {...p} />, top: 106, neck: [84, 90, 32, 16], cap: (p) => <path d="M90 46h20v44H90zM74 36h52v14H74zM126 40h32v7h-32z" {...p} />, labelY: 180, labelW: 68 },
  // Squeeze bottle with flip cap (body wash)
  wash: { body: (p) => <path d="M62 100H138Q150 100 150 114L144 252Q143 265 130 265H70Q57 265 56 252L50 114Q50 100 62 100Z" {...p} />, top: 100, neck: [80, 88, 40, 12], cap: (p) => <rect x="72" y="50" width="56" height="40" rx="9" {...p} />, labelY: 178, labelW: 74 },
  mist: { body: (p) => <rect x="66" y="94" width="68" height="171" rx="14" {...p} />, top: 94, neck: [74, 80, 52, 16], cap: (p) => <rect x="68" y="26" width="64" height="56" rx="20" {...p} />, labelY: 168, labelW: 54 },
};

const FALLBACK = {
  Men: { shape: "square", liquid: "#3a4350", cap: "#151515" },
  Women: { shape: "round", liquid: "#ead2d4", cap: "#c9a24f" },
  Unisex: { shape: "square", liquid: "#d9cdb8", cap: "#1d1d1d" },
};

function wrapWords(text, max) {
  const lines = [];
  let cur = "";
  for (const w of text.toUpperCase().split(/\s+/)) {
    if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; }
    else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function BottleIllustration({ product }) {
  const id = useId().replace(/:/g, "");
  const b = product.bottle || FALLBACK[product.gender] || FALLBACK.Unisex;
  const S = SHAPES[b.shape] || SHAPES.square;
  const lines = wrapWords(product.brand, ["mist", "lotion"].includes(b.shape) ? 9 : 11);
  // Body care bottles also name the product, so a lotion and a wash read differently
  const sub = product.bodycare ? product.type.toUpperCase() : null;
  const lh = 10;
  const lw = S.labelW;
  const boxH = lines.length * lh + 14 + (sub ? 10 : 0);
  const lx = 100 - lw / 2;
  const ly = S.labelY - boxH / 2;
  const [nx, ny, nw, nh] = S.neck;

  return (
    <svg className="bottle" viewBox="0 0 200 280" role="img" aria-label={`${product.brand} ${product.name}`}>
      <defs>
        <clipPath id={`${id}c`}>{S.body({})}</clipPath>
        <linearGradient id={`${id}g`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".18" stopColor="#fff" stopOpacity=".08" />
          <stop offset=".7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".22" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".05" />
          <stop offset="1" stopColor="#000" stopOpacity=".35" />
        </linearGradient>
      </defs>
      {S.cap({ fill: b.cap })}
      {S.cap({ fill: `url(#${id}m)` })}
      <rect x={nx} y={ny} width={nw} height={nh} fill="#cfcfcf" />
      <rect x={nx} y={ny} width={nw} height={nh} fill={`url(#${id}m)`} />
      <g clipPath={`url(#${id}c)`}>
        <rect width="200" height="280" fill={b.liquid} />
        <rect y={S.top} width="200" height="12" fill="#fff" opacity=".38" />
        <rect width="200" height="280" fill={`url(#${id}g)`} />
        <rect x={lx - 14} y={S.top + 16} width="5" height="140" fill="#fff" opacity=".35" />
      </g>
      {S.body({ fill: "none", stroke: "#000", strokeOpacity: 0.2, strokeWidth: 1.2 })}
      <rect x={lx} y={ly} width={lw} height={boxH} fill="#fff" stroke="#111" strokeWidth="1.6" />
      <rect x={lx + 3} y={ly + 3} width={lw - 6} height={boxH - 6} fill="none" stroke="#111" strokeWidth=".7" />
      <g fontFamily="Montserrat, Arial, sans-serif" fontWeight="800" fontSize="8.4" letterSpacing=".6" fill="#111">
        {lines.map((l, i) => (
          <text key={i} x="100" y={ly + 17 + lh * i} textAnchor="middle">{l}</text>
        ))}
        {sub && (
          <text x="100" y={ly + 17 + lh * lines.length + 2} textAnchor="middle" fontSize="5.6" fontWeight="600" letterSpacing="1">{sub}</text>
        )}
      </g>
    </svg>
  );
}
