import { useState, useEffect, useCallback, useRef } from "react";
import homeBg from "./src/homebackground.png";

// ── Mobile hook ───────────────────────────────────────────────────────────────
const useIsMobile = () => {
  const [mobile, setMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
};

// ── Food emoji mapping ────────────────────────────────────────────────────────
const getFoodEmoji = (itemName) => {
  const name = itemName.toLowerCase();
  const emojiMap = [
    { keys: ["pizza"], emoji: "🍕" },
    { keys: ["burger", "hamburger"], emoji: "🍔" },
    { keys: ["taco", "tacos"], emoji: "🌮" },
    { keys: ["salad"], emoji: "🥗" },
    { keys: ["pasta", "spaghetti", "noodle", "lasagna"], emoji: "🍝" },
    { keys: ["rice"], emoji: "🍚" },
    { keys: ["sushi", "roll", "maki"], emoji: "🍱" },
    { keys: ["soup", "stew", "chili"], emoji: "🍲" },
    { keys: ["bread", "baguette", "loaf"], emoji: "🍞" },
    { keys: ["cake", "cupcake", "birthday cake"], emoji: "🎂" },
    { keys: ["cookie", "cookies", "brownie"], emoji: "🍪" },
    { keys: ["pie"], emoji: "🥧" },
    { keys: ["fruit", "fruits", "berry", "berries"], emoji: "🍓" },
    { keys: ["watermelon"], emoji: "🍉" },
    { keys: ["apple"], emoji: "🍎" },
    { keys: ["banana"], emoji: "🍌" },
    { keys: ["grape", "grapes"], emoji: "🍇" },
    { keys: ["corn"], emoji: "🌽" },
    { keys: ["carrot"], emoji: "🥕" },
    { keys: ["broccoli"], emoji: "🥦" },
    { keys: ["sandwich"], emoji: "🥪" },
    { keys: ["hotdog", "hot dog"], emoji: "🌭" },
    { keys: ["fries", "chips"], emoji: "🍟" },
    { keys: ["donut", "doughnut"], emoji: "🍩" },
    { keys: ["ice cream", "icecream"], emoji: "🍦" },
    { keys: ["chicken", "poultry"], emoji: "🍗" },
    { keys: ["meat", "beef", "steak", "bbq", "grill"], emoji: "🥩" },
    { keys: ["fish", "seafood", "shrimp"], emoji: "🐟" },
    { keys: ["egg", "eggs", "deviled"], emoji: "🥚" },
    { keys: ["cheese"], emoji: "🧀" },
    { keys: ["lemonade", "juice"], emoji: "🍋" },
    { keys: ["wine"], emoji: "🍷" },
    { keys: ["beer"], emoji: "🍺" },
    { keys: ["water", "drink", "soda", "beverage"], emoji: "🥤" },
    { keys: ["mushroom"], emoji: "🍄" },
    { keys: ["potato", "potatoes", "mashed"], emoji: "🥔" },
    { keys: ["avocado", "guacamole"], emoji: "🥑" },
    { keys: ["wrap", "burrito"], emoji: "🌯" },
    { keys: ["dumpling", "dim sum"], emoji: "🥟" },
    { keys: ["curry"], emoji: "🍛" },
    { keys: ["kebab"], emoji: "🍢" },
    { keys: ["pretzel"], emoji: "🥨" },
    { keys: ["croissant"], emoji: "🥐" },
    { keys: ["waffle", "pancake"], emoji: "🧇" },
    { keys: ["muffin"], emoji: "🧁" },
    { keys: ["candy", "sweets", "chocolate"], emoji: "🍫" },
    { keys: ["pumpkin"], emoji: "🎃" },
    { keys: ["honey"], emoji: "🍯" },
    { keys: ["nut", "nuts", "almond", "cashew", "peanut"], emoji: "🥜" },
    { keys: ["tofu"], emoji: "🫘" },
    { keys: ["oatmeal", "oats", "porridge", "cereal"], emoji: "🥣" },
    { keys: ["bacon", "sausage", "ham"], emoji: "🥓" },
    { keys: ["orange"], emoji: "🍊" },
    { keys: ["coffee", "espresso", "latte"], emoji: "☕" },
    { keys: ["tea"], emoji: "🍵" },
  ];
  for (const { keys, emoji } of emojiMap) {
    if (keys.some((k) => name.includes(k))) return emoji;
  }
  return "🍽️";
};

// ── Contextual food recommendations ──────────────────────────────────────────
const getEventRecommendations = (eventName, mealType) => {
  const name = (eventName || "").toLowerCase();
  const meal = (mealType || "").toLowerCase();
  const contextMap = [
    { keys: ["bbq", "barbecue", "grill", "cookout"],      items: ["Grilled Ribs", "Corn on the Cob", "Coleslaw", "Burgers", "Hot Dogs", "Baked Potatoes", "Lemonade"] },
    { keys: ["birthday", "bday", "celebration", "party"], items: ["Birthday Cake", "Pizza", "Punch Bowl", "Fries", "Cookies", "Cupcakes", "Popcorn"] },
    { keys: ["christmas", "holiday", "xmas", "festive"],  items: ["Roast Turkey", "Mashed Potatoes", "Pumpkin Pie", "Sugar Cookies", "Green Bean Casserole", "Dinner Rolls", "Mulled Wine"] },
    { keys: ["thanksgiving", "harvest", "fall"],           items: ["Turkey", "Mashed Potatoes", "Pumpkin Pie", "Green Bean Casserole", "Cornbread", "Apple Cider", "Corn Pudding"] },
    { keys: ["halloween", "spooky", "trick", "treat"],    items: ["Pumpkin Soup", "Chocolate Treats", "Caramel Apples", "Spooky Cupcakes", "Witches Brew Punch", "Candy Corn Cookies"] },
    { keys: ["summer", "picnic", "outdoor", "garden"],    items: ["Garden Salad", "Watermelon", "Sandwiches", "Lemonade", "Fruit Salad", "Chips & Dip", "Ice Cream"] },
    { keys: ["taco", "mexican", "fiesta", "cinco"],       items: ["Tacos", "Guacamole", "Burritos", "Salsa", "Queso Dip", "Spanish Rice", "Refried Beans"] },
    { keys: ["italian", "pasta", "pizza night"],          items: ["Spaghetti", "Margherita Pizza", "Caesar Salad", "Garlic Bread", "Chianti", "Cannoli"] },
    { keys: ["asian", "chinese", "japanese", "sushi", "korean"], items: ["Sushi Rolls", "Dumplings", "Ramen", "Fried Rice", "Kimchi", "Mochi", "Green Tea"] },
    { keys: ["game", "super bowl", "sports", "watch"],   items: ["Pizza", "Sodas", "Nachos", "Hot Dogs", "Peanuts", "Buffalo Wings", "Cheese Dip"] },
    { keys: ["brunch", "mimosa"],                         items: ["Waffles", "Pancakes", "Deviled Eggs", "Croissants", "Fruit Salad", "Mimosas", "Coffee"] },
    { keys: ["vegan", "vegetarian", "plant", "healthy"],  items: ["Mixed Green Salad", "Avocado Toast", "Lentil Soup", "Roasted Veggies", "Hummus & Pita", "Stuffed Tomatoes", "Vegan Brownies"] },
    { keys: ["seafood", "fish", "clambake", "lobster"],   items: ["Lobster Rolls", "Grilled Salmon", "Shrimp Cocktail", "Crab Cakes", "Coleslaw", "Sourdough Bread"] },
    { keys: ["dessert", "sweet", "candy", "chocolate"],   items: ["Layer Cake", "Cookies", "Donuts", "Brownies", "Cupcakes", "Ice Cream", "Pie"] },
    { keys: ["potluck", "community", "neighborhood"],     items: ["Pasta Salad", "Fried Chicken", "Potato Salad", "Dinner Rolls", "Sheet Cake", "Sweet Tea", "Baked Beans"] },
  ];
  const mealDefaults = {
    breakfast: ["Pancakes", "Scrambled Eggs", "Bacon", "Coffee", "Orange Juice", "Waffles", "Toast"],
    brunch:    ["French Toast", "Quiche", "Croissants", "Fruit Salad", "Mimosas", "Coffee", "Muffins"],
    lunch:     ["Garden Salad", "Sandwiches", "Pasta Salad", "Pizza Slices", "Iced Tea", "Rolls", "Fresh Fruit"],
    dinner:    ["Green Salad", "Roasted Chicken", "Mashed Potatoes", "Steamed Veggies", "Dinner Rolls", "Wine", "Dessert"],
    supper:    ["Casserole", "Side Salad", "Cornbread", "Pie", "Sweet Tea", "Baked Beans", "Fried Chicken"],
  };
  for (const { keys, items } of contextMap) {
    if (keys.some((k) => name.includes(k))) return items;
  }
  return mealDefaults[meal] || ["🥗 Salad", "🍗 Main Dish", "🍞 Bread", "🥤 Drinks", "🍰 Dessert", "🍝 Pasta", "🥔 Side Dish"];
};

// ── Contextual table themes ───────────────────────────────────────────────────
const getTableTheme = (eventName, mealType) => {
  const name = (eventName || "").toLowerCase();
  const themes = [
    { keys: ["bbq", "barbecue", "grill", "cookout"],
      bg: "radial-gradient(circle at 35% 35%, #8d4a20 0%, #5a2d0c 55%, #2d1508 100%)",
      ring: "#cd7f32", glow: "rgba(180,90,30,0.55)", label: "#ffcc80", woodGrain: true },
    { keys: ["christmas", "holiday", "xmas", "festive"],
      bg: "radial-gradient(circle at 35% 35%, #2e7d32 0%, #1b5e20 55%, #0a3d0a 100%)",
      ring: "#ef5350", glow: "rgba(198,40,40,0.5)", label: "#ffeb3b", woodGrain: false },
    { keys: ["halloween", "spooky", "trick"],
      bg: "radial-gradient(circle at 35% 35%, #6a1b9a 0%, #4a148c 55%, #1a0050 100%)",
      ring: "#ff6d00", glow: "rgba(255,109,0,0.55)", label: "#ff6d00", woodGrain: false },
    { keys: ["birthday", "bday", "party", "celebration"],
      bg: "radial-gradient(circle at 35% 35%, #c2185b 0%, #880e4f 55%, #5c0033 100%)",
      ring: "#f48fb1", glow: "rgba(244,143,177,0.5)", label: "#fce4ec", woodGrain: false },
    { keys: ["thanksgiving", "harvest", "fall"],
      bg: "radial-gradient(circle at 35% 35%, #d84315 0%, #bf360c 55%, #7f1d00 100%)",
      ring: "#ffb300", glow: "rgba(255,179,0,0.5)", label: "#fff8e1", woodGrain: true },
    { keys: ["summer", "picnic", "garden", "outdoor"],
      bg: "radial-gradient(circle at 35% 35%, #388e3c 0%, #2e7d32 55%, #1b5e20 100%)",
      ring: "#a5d6a7", glow: "rgba(165,214,167,0.5)", label: "#f1f8e9", woodGrain: false },
    { keys: ["taco", "mexican", "fiesta", "cinco"],
      bg: "radial-gradient(circle at 35% 35%, #e65100 0%, #bf360c 55%, #8d2000 100%)",
      ring: "#ffca28", glow: "rgba(255,202,40,0.55)", label: "#fff8e1", woodGrain: false },
    { keys: ["italian", "pasta", "pizza night"],
      bg: "radial-gradient(circle at 35% 35%, #c62828 0%, #b71c1c 55%, #7f0000 100%)",
      ring: "#ffffff", glow: "rgba(255,255,255,0.3)", label: "#ffebee", woodGrain: false },
    { keys: ["asian", "chinese", "japanese", "sushi", "korean"],
      bg: "radial-gradient(circle at 35% 35%, #ad1457 0%, #880e4f 55%, #4a0030 100%)",
      ring: "#f06292", glow: "rgba(240,98,146,0.5)", label: "#fce4ec", woodGrain: false },
    { keys: ["game", "super bowl", "sports", "watch"],
      bg: "radial-gradient(circle at 35% 35%, #283593 0%, #1a237e 55%, #0d1642 100%)",
      ring: "#42a5f5", glow: "rgba(66,165,245,0.5)", label: "#e3f2fd", woodGrain: false },
    { keys: ["vegan", "vegetarian", "plant", "healthy"],
      bg: "radial-gradient(circle at 35% 35%, #558b2f 0%, #33691e 55%, #1b4004 100%)",
      ring: "#aed581", glow: "rgba(174,213,129,0.5)", label: "#f1f8e9", woodGrain: false },
    { keys: ["seafood", "fish", "clambake", "lobster"],
      bg: "radial-gradient(circle at 35% 35%, #00838f 0%, #006064 55%, #001f20 100%)",
      ring: "#4dd0e1", glow: "rgba(77,208,225,0.5)", label: "#e0f7fa", woodGrain: false },
    { keys: ["brunch", "mimosa"],
      bg: "radial-gradient(circle at 35% 35%, #f57c00 0%, #e65100 55%, #9e3600 100%)",
      ring: "#fff59d", glow: "rgba(255,245,157,0.5)", label: "#fffde7", woodGrain: false },
    { keys: ["dessert", "sweet", "candy", "chocolate"],
      bg: "radial-gradient(circle at 35% 35%, #6d1b7b 0%, #4a148c 55%, #1a0050 100%)",
      ring: "#f48fb1", glow: "rgba(244,143,177,0.5)", label: "#fce4ec", woodGrain: false },
  ];
  const mealThemes = {
    breakfast: { bg: "radial-gradient(circle at 35% 35%, #f57f17 0%, #bf360c 55%, #8d2000 100%)", ring: "#ffcc02", glow: "rgba(255,204,2,0.45)", label: "#fffde7", woodGrain: false },
    brunch:    { bg: "radial-gradient(circle at 35% 35%, #e91e63 0%, #ad1457 55%, #6a0036 100%)", ring: "#f48fb1", glow: "rgba(244,143,177,0.45)", label: "#fce4ec", woodGrain: false },
    lunch:     { bg: "radial-gradient(circle at 35% 35%, #558b2f 0%, #33691e 55%, #1b4004 100%)", ring: "#aed581", glow: "rgba(174,213,129,0.45)", label: "#f1f8e9", woodGrain: false },
    dinner:    { bg: "radial-gradient(circle at 35% 35%, #4a148c 0%, #311b92 55%, #1a0050 100%)", ring: "#ce93d8", glow: "rgba(206,147,216,0.45)", label: "#f3e5f5", woodGrain: false },
    supper:    { bg: "radial-gradient(circle at 35% 35%, #1a237e 0%, #0d1642 55%, #060d2c 100%)", ring: "#90caf9", glow: "rgba(144,202,249,0.45)", label: "#e3f2fd", woodGrain: false },
  };
  for (const theme of themes) {
    if (theme.keys.some((k) => name.includes(k))) return theme;
  }
  return mealThemes[(mealType || "").toLowerCase()] || {
    bg: "radial-gradient(circle at 35% 35%, #6d4c41 0%, #4e342e 55%, #3e2723 100%)",
    ring: "#ffcc80", glow: "rgba(255,204,128,0.45)", label: "#fff8e1", woodGrain: true
  };
};

// ── Animation pool ────────────────────────────────────────────────────────────
const ANIM_POOL = ["float", "wobble", "spin-slow", "bounce-soft", "sway", "pulse-scale", "drift"];
const ANIM_DURATIONS = { float: "3s", wobble: "1.8s", "spin-slow": "7s", "bounce-soft": "2.4s", sway: "3.2s", "pulse-scale": "2s", drift: "4.5s" };

const getItemAnimation = (seed) => ANIM_POOL[Math.abs(seed) % ANIM_POOL.length];

// Emoji font-size scales with quantity: 1→1.9rem, 2→2.3rem, 3→2.7rem, 4→3.1rem, 5+→3.6rem
const getEmojiSize = (qty) => {
  if (qty >= 5) return "3.6rem";
  if (qty >= 4) return "3.1rem";
  if (qty >= 3) return "2.7rem";
  if (qty >= 2) return "2.3rem";
  return "1.9rem";
};

// ── Meal types & times ────────────────────────────────────────────────────────
const MEAL_TYPES = [
  { value: "Breakfast", label: "🌅 Breakfast" },
  { value: "Brunch",    label: "🥞 Brunch"    },
  { value: "Lunch",     label: "☀️ Lunch"     },
  { value: "Dinner",    label: "🌙 Dinner"    },
  { value: "Supper",    label: "🌆 Supper"    },
];
const TIME_OPTIONS = (() => {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const hr = h === 0 ? 12 : h > 12 ? h - 12 : h;
      opts.push({ value: `${hh}:${mm}`, label: `${hr}:${mm} ${h < 12 ? "AM" : "PM"}` });
    }
  }
  return opts;
})();

// ── Storage ───────────────────────────────────────────────────────────────────
const generateId = () => Math.random().toString(36).substr(2, 9);
const EVENTS_KEY   = "potluckpal_events_v2";
const USER_MAP_KEY = "potluckpal_usermap_v2";
function loadData(key) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
const fieldBase = { width: "100%", padding: "0.6rem 0.9rem", borderRadius: 8, border: "1.5px solid #e0f2f1", fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", outline: "none", background: "rgba(255,255,255,0.9)", color: "#5d4e37", boxSizing: "border-box" };

function Blob({ style }) { return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(60px)", opacity: 0.18, pointerEvents: "none", ...style }} />; }

function Card({ children, style }) {
  return <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 16, border: "1.5px solid rgba(224,242,241,0.5)", boxShadow: "0 4px 20px rgba(93,78,55,0.15)", padding: "2rem", ...style }}>{children}</div>;
}

function Button({ children, onClick, variant = "primary", style, disabled }) {
  const v = {
    primary:   { background: "linear-gradient(135deg,#8d6e63,#a1887f)", color: "#fff", boxShadow: "0 4px 18px rgba(141,110,99,0.35)" },
    secondary: { background: "rgba(141,110,99,0.1)", color: "#5d4e37" },
    ghost:     { background: "transparent", color: "#5d4e37" },
    green:     { background: "linear-gradient(135deg,#6b8e23,#9ccc65)", color: "#fff", boxShadow: "0 4px 18px rgba(107,142,35,0.30)" },
    danger:    { background: "rgba(139,69,19,0.10)", color: "#8d4a2b" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ border: "none", borderRadius: 14, fontFamily: "'Fredoka One', cursive", fontSize: "1rem", cursor: disabled ? "not-allowed" : "pointer", padding: "0.65rem 1.4rem", transition: "transform 0.12s", opacity: disabled ? 0.55 : 1, ...v[variant], ...style }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(-2px) scale(1.03)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
      {children}
    </button>
  );
}

function FieldLabel({ children, required }) {
  return <label style={{ display: "block", marginBottom: 4, fontFamily: "'Fredoka One', cursive", color: "#5d4037", fontSize: "0.9rem" }}>{children}{required && <span style={{ color: "#ff7043" }}> *</span>}</label>;
}

function Input({ label, value, onChange, type = "text", placeholder, required }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={fieldBase}
        onFocus={(e) => (e.target.style.borderColor = "#ff7043")} onBlur={(e) => (e.target.style.borderColor = "#ffccbc")} />
    </div>
  );
}

function Select({ label, value, onChange, options, required, placeholder = "— Select —" }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <div style={{ position: "relative" }}>
        <select value={value} onChange={(e) => onChange(e.target.value)}
          style={{ ...fieldBase, appearance: "none", cursor: "pointer", paddingRight: "2rem" }}
          onFocus={(e) => (e.target.style.borderColor = "#ff7043")} onBlur={(e) => (e.target.style.borderColor = "#ffccbc")}>
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#8d6e63" }}>▾</span>
      </div>
    </div>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────
function HomeScreen({ onCreateEvent, onJoinEvent, onViewHistory }) {
  const isMobile = useIsMobile();
  const [name, setName]         = useState("");
  const [joinName, setJoinName] = useState("");
  const [code, setCode]         = useState("");
  const [histName, setHistName] = useState("");
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: isMobile ? "1rem" : "2rem", paddingBottom: isMobile ? "1.5rem" : "3rem", paddingLeft: isMobile ? "0.5rem" : "1rem", paddingRight: isMobile ? "0.5rem" : "1rem", display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center", backgroundImage: `linear-gradient(rgba(255,245,235,0.55), rgba(255,245,235,0.55)), url(${homeBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", borderRadius: "20px", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? "1rem" : "2.5rem" }}>
        <div style={{ fontSize: "clamp(2rem, 10vw, 4rem)", marginBottom: "0.4rem" }}>🥟</div>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(2.8rem, 14vw, 6.5rem)", color: "#ff6a00", margin: 0, lineHeight: 1.1, fontWeight: "900", textShadow: "3px 3px 0 #fff, 6px 6px 0 rgba(255,150,0,0.35), 0 0 40px rgba(255,120,0,0.5)" }}>Potluck Pal</h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#3e2000", marginTop: 8, fontSize: "clamp(0.85rem, 3.5vw, 1.1rem)", display: "inline-block", background: "rgba(255,245,220,0.72)", borderRadius: 20, padding: "4px 18px" }}>Bring something delicious, share something wonderful 🎉</p>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Card style={{ flex: "1 1 min(300px, 100%)", maxWidth: "400px", padding: isMobile ? "1.25rem" : "2rem" }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontStyle: "italic", color: "#d84315", marginTop: 0, fontSize: "1.4rem" }}>🎊 Host a Potluck</h2>
        <Input value={name} onChange={setName} placeholder="Your name, e.g. Grandma Sue" required />
        <Button onClick={() => name.trim() && onCreateEvent(name.trim())} disabled={!name.trim()} style={{ width: "100%" }}>🎊 Create a New Event</Button>
      </Card>
      <Card style={{ flex: "1 1 min(300px, 100%)", maxWidth: "400px", padding: isMobile ? "1.25rem" : "2rem" }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontStyle: "italic", color: "#d84315", marginTop: 0, fontSize: "1.4rem" }}>🔗 Join an Existing Event</h2>
        <Input value={joinName} onChange={setJoinName} placeholder="Your name..." required />
        <Input value={code} onChange={setCode} placeholder="Paste event ID or share link..." />
        <Button onClick={() => { if (!joinName.trim() || !code.trim()) return; const m = code.match(/event=([a-z0-9]+)/); onJoinEvent(m ? m[1] : code.trim(), joinName.trim()); }} disabled={!joinName.trim() || !code.trim()} variant="secondary" style={{ width: "100%" }}>🚪 Join Event</Button>
      </Card>
      <Card style={{ flex: "1 1 min(300px, 100%)", maxWidth: "400px", padding: isMobile ? "1.25rem" : "2rem" }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontStyle: "italic", color: "#d84315", marginTop: 0, fontSize: "1.4rem" }}>📖 My Past Events</h2>
        <Input value={histName} onChange={setHistName} placeholder="Enter your name to look up events..." />
        <Button onClick={() => histName.trim() && onViewHistory(histName.trim())} disabled={!histName.trim()} variant="ghost" style={{ width: "100%", border: "1.5px solid #e0f2f1" }}>🔍 Look Up My Events</Button>
      </Card>
      </div>
    </div>
  );
}

// ── History Screen ────────────────────────────────────────────────────────────
function HistoryScreen({ userName, events, userMap, onDelete, onOpen, onBack }) {
  const key = userName.trim().toLowerCase();
  const myEvents = ((userMap[key] || []).filter((id) => events[id])).map((id) => events[id]).sort((a, b) => b.createdAt - a.createdAt);
  const fmtDate = (d) => { try { return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }); } catch { return d; } };
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "1.5rem" }}>
      <Button variant="ghost" onClick={onBack} style={{ marginBottom: "0.8rem" }}>← Back</Button>
      <Card>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontStyle: "italic", color: "#5d4e37", marginTop: 0, fontSize: "1.6rem" }}>📖 {userName}'s Events</h2>
        {myEvents.length === 0 ? (
          <p style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#a8caba", textAlign: "center", padding: "1.5rem 0" }}>No events found for <strong>{userName}</strong>.<br /><span style={{ fontSize: "0.85rem" }}>Events link to you when you create them or add a dish.</span></p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {myEvents.map((ev) => {
              const theme = getTableTheme(ev.name, ev.mealType);
              const mealLabel = MEAL_TYPES.find((m) => m.value === ev.mealType)?.label || ev.mealType || "";
              return (
                <div key={ev.id} style={{ background: "rgba(245,245,220,0.85)", borderRadius: 14, border: "1px solid #a8caba", padding: "0.9rem 1.1rem", display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: theme.bg, border: `3px solid ${theme.ring}`, flexShrink: 0, boxShadow: `0 0 10px ${theme.glow}` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Fredoka One', cursive", fontStyle: "italic", color: "#5d4e37", fontSize: "1.05rem" }}>{ev.name}</div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#5d4e37", fontSize: "0.82rem", marginTop: 2 }}>{mealLabel} · {fmtDate(ev.date)} · {ev.location}</div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#a8caba", fontSize: "0.78rem" }}>{(ev.items || []).length} dish(es) · {ev.attendees} guests</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                    <Button variant="secondary" onClick={() => onOpen(ev.id)} style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem" }}>Open</Button>
                    <Button variant="danger" onClick={() => { if (window.confirm(`Delete "${ev.name}"? This cannot be undone.`)) onDelete(ev.id); }} style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem" }}>🗑️</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Create Event Screen ───────────────────────────────────────────────────────
function CreateEventScreen({ userName, onCreate, onBack }) {
  const [form, setForm] = useState({ name: "", mealType: "", date: "", time: "", location: "", attendees: "" });
  const set   = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name.trim() && form.mealType && form.date && form.time && form.location.trim() && Number(form.attendees) > 0;
  const recs  = getEventRecommendations(form.name, form.mealType);
  const theme = getTableTheme(form.name, form.mealType);
  const showPreview = form.name.trim().length > 1 || form.mealType;
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "1.5rem" }}>
      <Button variant="ghost" onClick={onBack} style={{ marginBottom: "1rem" }}>← Back</Button>
      <Card>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontStyle: "italic", color: "#5d4e37", marginTop: 0, fontSize: "1.6rem" }}>🎉 Create Your Potluck</h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#5d4e37", marginTop: -8, marginBottom: "1.2rem" }}>Hi <strong>{userName}</strong>! Fill in the details below.</p>
        <Input label="Event Name" value={form.name} onChange={set("name")} placeholder="e.g. Summer BBQ Bash" required />
        <Select label="Meal Type" value={form.mealType} onChange={set("mealType")} options={MEAL_TYPES} required placeholder="— Choose meal type —" />
        <Input label="Date" value={form.date} onChange={set("date")} type="date" required />
        <Select label="Time" value={form.time} onChange={set("time")} options={TIME_OPTIONS} required placeholder="— Choose a time —" />
        <Input label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Grandma's Backyard" required />
        <Input label="Number of Guests" value={form.attendees} onChange={set("attendees")} type="number" placeholder="e.g. 12" required />
        {showPreview && (
          <div style={{ marginBottom: "1rem", borderRadius: 14, overflow: "hidden", border: `2px solid ${theme.ring}`, boxShadow: `0 0 16px ${theme.glow}` }}>
            <div style={{ background: theme.bg, padding: "0.65rem 1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: `2px solid ${theme.ring}`, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Fredoka One', cursive", color: theme.label, fontSize: "0.9rem" }}>✨ Suggested dishes for your event</span>
            </div>
            <div style={{ background: "rgba(255,252,248,0.97)", padding: "0.7rem 1rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {recs.map((r, i) => <span key={i} style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", background: "rgba(255,240,220,0.9)", border: "1px solid #ffe0b2", borderRadius: 20, padding: "3px 10px", color: "#5d4037" }}>{getFoodEmoji(r)} {r}</span>)}
            </div>
          </div>
        )}
        <Button onClick={() => valid && onCreate(form)} disabled={!valid} style={{ width: "100%" }}>🚀 Create Event & Get Link</Button>
      </Card>
    </div>
  );
}

// ── Round Potluck Table ───────────────────────────────────────────────────────
function PotluckTable({ items, eventName, mealType }) {
  const theme   = getTableTheme(eventName, mealType);
  const isEmpty = items.length === 0;
  const tableItems = items.map((item, idx) => {
    const seed = item.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + idx;
    return { ...item, animName: getItemAnimation(seed), animDelay: ((idx * 0.22) % 1.5).toFixed(2) + "s", fontSize: getEmojiSize(item.quantity) };
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem 0 0.5rem" }}>
      <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: "0.88rem", marginBottom: "0.7rem", background: "rgba(255,255,255,0.8)", padding: "3px 18px", borderRadius: 20, border: `1.5px solid ${theme.ring}`, color: "#5d4037", boxShadow: `0 0 10px ${theme.glow}`, letterSpacing: "0.06em" }}>
        🍽️ The Table
      </span>
      <div style={{ position: "relative", width: "min(320px, 88vw)", height: "min(320px, 88vw)", borderRadius: "50%", background: theme.bg, boxShadow: `0 0 0 7px ${theme.ring}, 0 0 50px ${theme.glow}, 0 14px 45px rgba(0,0,0,0.32), inset 0 4px 24px rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {/* dashed inner ring */}
        <div style={{ position: "absolute", inset: 14, borderRadius: "50%", border: "2px dashed rgba(255,255,255,0.15)", pointerEvents: "none" }} />
        {/* highlight gleam */}
        <div style={{ position: "absolute", top: "8%", left: "20%", width: "55%", height: "28%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        {isEmpty ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", fontFamily: "'Nunito', sans-serif", fontSize: "0.88rem", padding: "1rem", zIndex: 1 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 6 }}>🍽️</div>
            <p style={{ margin: 0 }}>Add your dish below!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0.3rem", padding: "1.6rem", maxWidth: "100%", maxHeight: "100%", overflow: "hidden", zIndex: 1, position: "relative" }}>
            {tableItems.map((item) => (
              <span key={item.id} title={`${item.itemName} ×${item.quantity} — by ${item.bringerName}`}
                style={{ fontSize: item.fontSize, display: "inline-block", cursor: "default", animationName: item.animName, animationDuration: ANIM_DURATIONS[item.animName], animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: item.animDelay, filter: "drop-shadow(0 3px 7px rgba(0,0,0,0.4))", lineHeight: 1 }}>
                {item.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Add Item Form ─────────────────────────────────────────────────────────────
function AddItemForm({ userName, onAdd, eventName, mealType }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [added, setAdded]       = useState(false);
  const recs = getEventRecommendations(eventName, mealType);

  const handleAdd = () => {
    if (!itemName.trim() || Number(quantity) < 1) return;
    onAdd({ itemName: itemName.trim(), quantity: Number(quantity) });
    setItemName(""); setQuantity("1");
    setAdded(true); setTimeout(() => setAdded(false), 2200);
  };

  return (
    <Card style={{ marginTop: "1.2rem" }}>
      <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "#e64a19", marginTop: 0, fontSize: "1.2rem" }}>✍️ {userName}, what are you bringing?</h3>
      <div style={{ marginBottom: "0.9rem" }}>
        <p style={{ fontFamily: "'Fredoka One', cursive", color: "#8d6e63", fontSize: "0.82rem", margin: "0 0 0.45rem" }}>💡 Suggested for this event:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {recs.map((r, i) => (
            <button key={i} onClick={() => setItemName(r.replace(/^[\p{Emoji}\u200d\s]+/u, "").trim())}
              style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.78rem", background: "rgba(255,240,220,0.9)", border: "1.5px solid #ffcc80", borderRadius: 20, padding: "3px 10px", color: "#5d4037", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ffe0b2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,240,220,0.9)")}>
              {r}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0 0.8rem", alignItems: "end" }}>
        <Input label="Dish / Item" value={itemName} onChange={setItemName} placeholder="e.g. Potato Salad" />
        <div style={{ marginBottom: "1rem" }}>
          <FieldLabel>Qty</FieldLabel>
          <input type="number" min="1" max="99" value={quantity} onChange={(e) => setQuantity(e.target.value)}
            style={{ width: 70, padding: "0.6rem", borderRadius: 10, border: "1.5px solid #ffccbc", fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", outline: "none", background: "rgba(255,248,244,0.9)", color: "#4e342e", textAlign: "center" }} />
        </div>
      </div>
      <Button onClick={handleAdd} disabled={!itemName.trim()} variant="green" style={{ width: "100%" }}>
        {added ? "✅ Added to The Table!" : "➕ Add to The Table"}
      </Button>
    </Card>
  );
}

// ── Item List ─────────────────────────────────────────────────────────────────
function ItemList({ items }) {
  if (!items.length) return null;
  return (
    <Card style={{ marginTop: "1.2rem" }}>
      <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "#e64a19", marginTop: 0, fontSize: "1.2rem" }}>📋 Who's Bringing What</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "0.7rem", background: "rgba(255,248,244,0.8)", borderRadius: 12, padding: "0.55rem 0.9rem", border: "1px solid #ffe0b2" }}>
            <span style={{ fontSize: "1.6rem" }}>{item.emoji}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: "'Fredoka One', cursive", color: "#bf360c", fontSize: "1rem" }}>{item.itemName}</span>
              <span style={{ fontFamily: "'Nunito', sans-serif", color: "#8d6e63", fontSize: "0.82rem", marginLeft: 6 }}>×{item.quantity}</span>
            </div>
            <span style={{ fontFamily: "'Nunito', sans-serif", color: "#6d4c41", fontSize: "0.85rem" }}>by <strong>{item.bringerName}</strong></span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Event Screen ──────────────────────────────────────────────────────────────
function EventScreen({ event, userName, onAddItem, onBack }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied]       = useState(false);
  const shareUrl = `${window.location.href.split("?")[0]}?event=${event.id}`;
  const theme    = getTableTheme(event.name, event.mealType);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const mealLabel = MEAL_TYPES.find((m) => m.value === event.mealType)?.label || "";
  const fmtDate   = (d) => { try { return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); } catch { return d; } };
  const fmtTime   = (t) => TIME_OPTIONS.find((o) => o.value === t)?.label || t;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: "1.2rem" }}>
      <Button variant="ghost" onClick={onBack} style={{ marginBottom: "0.8rem" }}>← Home</Button>
      <Card style={{ marginBottom: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontStyle: "italic", color: "#5d4e37", marginTop: 0, fontSize: "clamp(1.3rem, 5vw, 1.8rem)" }}>🎊 {event.name}</h2>
            {mealLabel && <p style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#5d4e37", margin: "4px 0", fontSize: "0.92rem" }}>🍴 {mealLabel}</p>}
            <p style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#5d4e37", margin: "4px 0", fontSize: "0.92rem" }}>📅 {fmtDate(event.date)} at {fmtTime(event.time)}</p>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#5d4e37", margin: "4px 0", fontSize: "0.92rem" }}>📍 {event.location}</p>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#5d4e37", margin: "4px 0", fontSize: "0.92rem" }}>👥 {event.attendees} guests</p>
          </div>

          {/* Share panel */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", flexShrink: 0 }}>
            <Button onClick={() => setShareOpen((o) => !o)} variant="secondary">
              {shareOpen ? "✕ Close" : "🔗 Share Link"}
            </Button>
            {shareOpen && (
              <div style={{ background: "rgba(255,250,245,0.98)", border: `2px solid ${theme.ring}`, borderRadius: 16, padding: "0.85rem 1rem", boxShadow: `0 6px 28px ${theme.glow}`, minWidth: 0, width: "min(360px, calc(100vw - 3rem))", animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", fontStyle: "italic", color: "#5d4e37", fontSize: "0.88rem", margin: "0 0 0.5rem" }}>🔗 Share with your guests:</p>
                <div style={{ background: "rgba(255,255,255,0.95)", border: "1.5px solid #ffccbc", borderRadius: 10, padding: "0.45rem 0.7rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "#5d4037", flex: 1, overflowX: "auto", whiteSpace: "nowrap", userSelect: "all", lineHeight: 1.4 }}>
                    {shareUrl}
                  </span>
                  <button onClick={copyLink}
                    style={{ flexShrink: 0, border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "'Fredoka One', cursive", fontSize: "0.78rem", background: copied ? "#c8e6c9" : "#fff3e0", color: copied ? "#2e7d32" : "#e65100", transition: "background 0.2s, color 0.2s", whiteSpace: "nowrap" }}>
                    {copied ? "✅ Copied!" : "Copy"}
                  </button>
                </div>
                <p style={{ fontFamily: "'Nunito', sans-serif", color: "#a1887f", fontSize: "0.72rem", margin: 0 }}>Anyone with this link can view and add dishes to the event.</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <PotluckTable items={event.items || []} eventName={event.name} mealType={event.mealType} />
      <AddItemForm userName={userName} onAdd={(item) => onAddItem(event.id, item, userName)} eventName={event.name} mealType={event.mealType} />
      <ItemList items={event.items || []} />
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  const [screen, setScreen]                 = useState("home");
  const [events, setEvents]                 = useState({});
  const [userMap, setUserMap]               = useState({});
  const [currentEventId, setCurrentEventId] = useState(null);
  const [userName, setUserName]             = useState("");
  const [historyUser, setHistoryUser]       = useState("");
  const [loading, setLoading]               = useState(true);
  const [scrollY, setScrollY]               = useState(0);

  useEffect(() => {
    const ev = loadData(EVENTS_KEY);
    const um = loadData(USER_MAP_KEY);
    setEvents(ev); setUserMap(um); setLoading(false);
    const eid = new URLSearchParams(window.location.search).get("event");
    if (eid && ev[eid]) { setCurrentEventId(eid); setScreen("event-join"); }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const persistEvents  = useCallback((ne) => { setEvents(ne);  saveData(EVENTS_KEY, ne);   }, []);
  const persistUserMap = useCallback((nm) => { setUserMap(nm); saveData(USER_MAP_KEY, nm); }, []);

  const registerUserEvent = useCallback((name, eventId, currentMap) => {
    const key = name.trim().toLowerCase();
    const ids = currentMap[key] || [];
    if (ids.includes(eventId)) return currentMap;
    const updated = { ...currentMap, [key]: [...ids, eventId] };
    persistUserMap(updated);
    return updated;
  }, [persistUserMap]);

  const handleCreateEvent = useCallback((form) => {
    const id = generateId();
    persistEvents({ ...events, [id]: { id, ...form, createdBy: userName, items: [], createdAt: Date.now() } });
    registerUserEvent(userName, id, userMap);
    setCurrentEventId(id); setScreen("event");
  }, [events, userMap, userName, persistEvents, registerUserEvent]);

  const handleJoinEvent = useCallback((id, name) => {
    setUserName(name);
    if (events[id]) { registerUserEvent(name, id, userMap); setCurrentEventId(id); setScreen("event"); }
    else { alert("Event not found. Please check the link or ID."); }
  }, [events, userMap, registerUserEvent]);

  const handleAddItem = useCallback((eventId, item, bringer) => {
    const newItem = { id: generateId(), itemName: item.itemName, quantity: item.quantity, bringerName: bringer, emoji: getFoodEmoji(item.itemName), addedAt: Date.now() };
    persistEvents({ ...events, [eventId]: { ...events[eventId], items: [...(events[eventId].items || []), newItem] } });
    registerUserEvent(bringer, eventId, userMap);
  }, [events, userMap, persistEvents, registerUserEvent]);

  const handleDeleteEvent = useCallback((eventId) => {
    const updatedEvents = { ...events }; delete updatedEvents[eventId]; persistEvents(updatedEvents);
    const updatedMap = {};
    for (const [k, ids] of Object.entries(userMap)) { const f = ids.filter((id) => id !== eventId); if (f.length) updatedMap[k] = f; }
    persistUserMap(updatedMap);
  }, [events, userMap, persistEvents, persistUserMap]);

  if (loading) return <div style={{ textAlign: "center", paddingTop: "5rem", fontFamily: "'Fredoka One', cursive", color: "#5d4e37", fontSize: "2rem" }}>🤝 Loading Potluck Pal...</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap');
        * { box-sizing: border-box; } body { margin: 0; }
        @keyframes float       { 0%,100%{transform:translateY(0)rotate(0)} 33%{transform:translateY(-9px)rotate(4deg)} 66%{transform:translateY(-4px)rotate(-2deg)} }
        @keyframes wobble      { 0%,100%{transform:rotate(0)scale(1)} 20%{transform:rotate(-9deg)scale(1.06)} 40%{transform:rotate(7deg)scale(1.03)} 60%{transform:rotate(-5deg)scale(1.05)} 80%{transform:rotate(3deg)scale(1.01)} }
        @keyframes spin-slow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bounce-soft { 0%,100%{transform:translateY(0)scale(1)} 50%{transform:translateY(-11px)scale(1.09)} }
        @keyframes sway        { 0%,100%{transform:rotate(-7deg)translateX(-4px)} 50%{transform:rotate(7deg)translateX(4px)} }
        @keyframes pulse-scale { 0%,100%{transform:scale(1)} 50%{transform:scale(1.17)} }
        @keyframes drift       { 0%{transform:translate(0,0)rotate(0)} 25%{transform:translate(5px,-7px)rotate(6deg)} 50%{transform:translate(-4px,-3px)rotate(-4deg)} 75%{transform:translate(-6px,5px)rotate(5deg)} 100%{transform:translate(0,0)rotate(0)} }
        @keyframes popIn       { from{transform:scale(0)rotate(-15deg);opacity:0} to{transform:scale(1)rotate(0);opacity:1} }
        select option { font-family: 'Nunito', sans-serif; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e0f2f1 100%)", position: "relative", overflow: "hidden" }}>
        <Blob style={{ width: 250, height: 250, background: "#fce4ec", top: -100, left: -150, opacity: 0.3, transform: `translateY(${scrollY * 0.1}px)` }} />
        <Blob style={{ width: 200, height: 200, background: "#f3e5f5", bottom: -80, right: -100, opacity: 0.3, transform: `translateY(${scrollY * -0.15}px)` }} />
        <Blob style={{ width: 180, height: 180, background: "#e0f2f1", top: "40%", right: "10%", opacity: 0.3, transform: `translateY(${scrollY * 0.2}px)` }} />
        {screen !== "home" && <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderBottom: "1.5px solid rgba(224,242,241,0.4)", padding: isMobile ? "0.6rem 1rem" : "1rem 2rem", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
          <span style={{ fontSize: isMobile ? "1.5rem" : "2rem" }}>🥟</span>
          <span style={{ fontFamily: "'Fredoka One', cursive", color: "#ff6a00", fontSize: "clamp(1.4rem, 5vw, 2.5rem)", textShadow: "2px 2px 0 #fff, 0 0 20px rgba(255,120,0,0.4)" }}>Potluck Pal</span>
          {userName && <span style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#5d4e37", fontSize: isMobile ? "0.8rem" : "1rem", marginLeft: "auto" }}>Hi, {userName}! 👋</span>}
        </div>}
        <div style={{ padding: isMobile ? "1rem" : "2rem", maxWidth: "800px", margin: "0 auto" }}>
          {(screen === "home" || screen === "event-join") && (
            <HomeScreen onCreateEvent={(n) => { setUserName(n); setScreen("create"); }} onJoinEvent={handleJoinEvent} onViewHistory={(n) => { setHistoryUser(n); setUserName(n); setScreen("history"); }} />
          )}
          {screen === "create" && <CreateEventScreen userName={userName} onCreate={handleCreateEvent} onBack={() => setScreen("home")} />}
          {screen === "history" && <HistoryScreen userName={historyUser} events={events} userMap={userMap} onDelete={handleDeleteEvent} onOpen={(id) => { setCurrentEventId(id); setScreen("event"); }} onBack={() => setScreen("home")} />}
          {screen === "event" && currentEventId && events[currentEventId] && (
            <EventScreen event={events[currentEventId]} userName={userName} onAddItem={handleAddItem} onBack={() => setScreen("home")} />
          )}
        </div>
      </div>
    </>
  );
}
