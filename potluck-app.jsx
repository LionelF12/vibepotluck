import { useState, useEffect, useCallback, useRef } from "react";
import homeBg from "./src/homebackground.png";
import { db } from "./src/firebase.js";
import { ref, set, get, onValue, remove } from "firebase/database";

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
    { keys: ["burger", "hamburger", "slider"], emoji: "🍔" },
    { keys: ["taco", "tacos", "tortilla"], emoji: "🌮" },
    { keys: ["salad", "coleslaw", "slaw", "tabbouleh"], emoji: "🥗" },
    { keys: ["pasta", "spaghetti", "noodle", "lasagna", "gnocchi", "pesto", "marinara", "alfredo"], emoji: "🍝" },
    { keys: ["rice", "fried rice", "risotto", "biryani", "couscous", "quinoa"], emoji: "🍚" },
    { keys: ["sushi", "roll", "maki"], emoji: "🍱" },
    { keys: ["soup", "stew", "chili", "gravy"], emoji: "🍲" },
    { keys: ["casserole", "gratin", "paella"], emoji: "🥘" },
    { keys: ["mac and cheese", "macaroni"], emoji: "🧀" },
    { keys: ["ramen", "pho", "lo mein", "udon", "pad thai"], emoji: "🍜" },
    { keys: ["bread", "baguette", "loaf", "brioche", "focaccia", "french toast", "zucchini bread", "banana bread"], emoji: "🍞" },
    { keys: ["bagel"], emoji: "🥯" },
    { keys: ["roll", "bun", "dinner roll"], emoji: "🍞" },
    { keys: ["naan", "pita", "flatbread", "lavash"], emoji: "🫓" },
    { keys: ["croissant", "danish", "scone", "biscuit"], emoji: "🥐" },
    { keys: ["waffle", "pancake", "crepe"], emoji: "🧇" },
    { keys: ["cake", "cupcake", "birthday cake", "coffee cake", "cheesecake"], emoji: "🎂" },
    { keys: ["cookie", "cookies", "brownie", "shortbread", "gingerbread"], emoji: "🍪" },
    { keys: ["cobbler", "crisp", "crumble", "pie", "tart"], emoji: "🥧" },
    { keys: ["donut", "doughnut", "churro"], emoji: "🍩" },
    { keys: ["muffin"], emoji: "🧁" },
    { keys: ["candy", "sweets", "fudge", "truffle", "bark"], emoji: "🍫" },
    { keys: ["chocolate"], emoji: "🍫" },
    { keys: ["tiramisu", "mousse", "pudding", "flan", "custard"], emoji: "🍮" },
    { keys: ["ice cream", "icecream", "gelato", "sorbet"], emoji: "🍦" },
    { keys: ["fruit", "fruits", "berry", "berries"], emoji: "🍓" },
    { keys: ["strawberry"], emoji: "🍓" },
    { keys: ["blueberry", "blueberries"], emoji: "🫐" },
    { keys: ["watermelon"], emoji: "🍉" },
    { keys: ["apple", "cider"], emoji: "🍎" },
    { keys: ["banana"], emoji: "🍌" },
    { keys: ["mango"], emoji: "🥭" },
    { keys: ["grape", "grapes"], emoji: "🍇" },
    { keys: ["cherry", "cherries"], emoji: "🍒" },
    { keys: ["peach", "plum"], emoji: "🍑" },
    { keys: ["pineapple"], emoji: "🍍" },
    { keys: ["coconut"], emoji: "🥥" },
    { keys: ["kiwi"], emoji: "🥝" },
    { keys: ["orange", "mandarin", "clementine", "tangerine"], emoji: "🍊" },
    { keys: ["pear"], emoji: "🍐" },
    { keys: ["lemon", "lemonade", "lemon tart"], emoji: "🍋" },
    { keys: ["corn", "cornbread", "corn bread", "polenta", "grits"], emoji: "🌽" },
    { keys: ["carrot"], emoji: "🥕" },
    { keys: ["broccoli"], emoji: "🥦" },
    { keys: ["tomato", "caprese", "bruschetta", "marinara"], emoji: "🍅" },
    { keys: ["spinach", "kale", "arugula", "lettuce"], emoji: "🥬" },
    { keys: ["cucumber"], emoji: "🥒" },
    { keys: ["sweet potato", "yam"], emoji: "🍠" },
    { keys: ["green bean", "edamame", "pea", "snap pea"], emoji: "🫛" },
    { keys: ["mushroom"], emoji: "🍄" },
    { keys: ["potato", "potatoes", "mashed", "hash brown"], emoji: "🥔" },
    { keys: ["avocado", "guacamole"], emoji: "🥑" },
    { keys: ["sandwich"], emoji: "🥪" },
    { keys: ["hotdog", "hot dog"], emoji: "🌭" },
    { keys: ["fries", "chips", "nachos"], emoji: "🍟" },
    { keys: ["salsa"], emoji: "🌶️" },
    { keys: ["buffalo", "wing", "wings"], emoji: "🍗" },
    { keys: ["chicken", "poultry", "fried chicken", "grilled chicken"], emoji: "🍗" },
    { keys: ["turkey"], emoji: "🦃" },
    { keys: ["meat", "beef", "steak", "bbq", "grill", "ribs", "brisket", "pot roast", "lamb"], emoji: "🥩" },
    { keys: ["pork", "bacon", "sausage", "ham"], emoji: "🥓" },
    { keys: ["fish", "seafood", "salmon", "tuna"], emoji: "🐟" },
    { keys: ["shrimp", "crab", "lobster", "clam", "oyster", "mussel", "scallop"], emoji: "🦞" },
    { keys: ["egg", "eggs", "deviled", "quiche", "frittata", "shakshuka"], emoji: "🥚" },
    { keys: ["cheese", "queso", "charcuterie", "antipasto"], emoji: "🧀" },
    { keys: ["hummus", "baked beans", "lentil", "bean", "black bean", "chickpea"], emoji: "🫘" },
    { keys: ["tofu", "tempeh"], emoji: "🫘" },
    { keys: ["wrap", "burrito", "enchilada", "spring roll", "empanada", "samosa"], emoji: "🌯" },
    { keys: ["dumpling", "dim sum", "wonton", "falafel"], emoji: "🥟" },
    { keys: ["curry"], emoji: "🍛" },
    { keys: ["kebab", "shawarma", "gyro"], emoji: "🍢" },
    { keys: ["pretzel"], emoji: "🥨" },
    { keys: ["oatmeal", "oats", "porridge", "cereal", "granola"], emoji: "🥣" },
    { keys: ["honey", "syrup", "jam", "jelly"], emoji: "🍯" },
    { keys: ["butter"], emoji: "🧈" },
    { keys: ["milk", "cream", "yogurt", "tzatziki"], emoji: "🥛" },
    { keys: ["nut", "nuts", "almond", "cashew", "peanut", "trail mix"], emoji: "🥜" },
    { keys: ["pumpkin"], emoji: "🎃" },
    { keys: ["juice"], emoji: "🍋" },
    { keys: ["mimosa", "champagne", "sparkling"], emoji: "🍾" },
    { keys: ["punch"], emoji: "🍹" },
    { keys: ["wine", "sangria"], emoji: "🍷" },
    { keys: ["beer"], emoji: "🍺" },
    { keys: ["iced tea", "sweet tea", "boba"], emoji: "🧋" },
    { keys: ["water", "soda", "beverage", "drink"], emoji: "🥤" },
    { keys: ["coffee", "espresso", "latte"], emoji: "☕" },
    { keys: ["tea"], emoji: "🍵" },
  ];
  for (const { keys, emoji } of emojiMap) {
    if (keys.some((k) => name.includes(k))) return emoji;
  }
  return "🎁";
};

// ── Food group category (for color-coding) ───────────────────────────────────
const getFoodCategory = (itemName) => {
  const n = (itemName || "").toLowerCase();
  const groups = [
    { label: "Desserts",      color: "#ce93d8", bg: "#f3e5f5", keys: ["cake","cookie","brownie","pie","donut","muffin","candy","chocolate","tiramisu","pudding","ice cream","cobbler","tart","crisp","crumble","shortbread","fudge","truffle","churro","dessert","sweet","egg tart","mango pudding","red bean soup","black sesame soup","tofu pudding","douhua","tang yuan","pineapple bun","wife cake","cocktail bun","chendol","ice kachang","kueh","ondeh ondeh","pandan cake","ang ku kueh","kaya toast","custard bun","nian gao","lo mai chi","sago"] },
    { label: "Drinks",        color: "#80deea", bg: "#e0f7fa", keys: ["juice","lemonade","punch","wine","beer","champagne","cider","coffee","tea","water","soda","drink","beverage","mimosa","boba","iced tea","sweet tea","sangria","teh tarik","kopi","bandung","milo","horlicks","barley water","soya bean","soy milk","sugar cane","calamansi","chrysanthemum","grass jelly","cincau","yakult","ribena"] },
    { label: "Fruit",         color: "#f48fb1", bg: "#fce4ec", keys: ["fruit","strawberry","blueberry","watermelon","apple","banana","mango","grape","cherry","peach","pineapple","kiwi","orange","pear","lemon","berry","berries","durian","longan","lychee","rambutan","papaya","dragon fruit","dragonfruit","jackfruit","pomelo","starfruit","mangosteen","soursop","guava","passionfruit"] },
    { label: "Protein",       color: "#ef9a9a", bg: "#ffebee", keys: ["chicken","turkey","beef","steak","meat","pork","bacon","sausage","ham","bbq","ribs","brisket","lamb","hotdog","burger","wing","fish","seafood","salmon","tuna","shrimp","crab","lobster","clam","oyster","mussel","scallop","egg","deviled","tofu","tempeh","bean","lentil","chickpea","hummus","falafel","dumpling","char siu","char siew","siu yuk","roast pork","roast duck","roast goose","roast chicken","white cut chicken","hainanese chicken","satay","chili crab","black pepper crab","bak kut teh","har gow","siu mai","lo mai gai","wonton","oyster omelette","ngoh hiang","lap cheong","chinese sausage","century egg","salted egg","fish cake","fish ball","you tiao","youtiao","prawn paste chicken","kung pao","sweet and sour pork","mapo","char siew bao","crispy pork","duck rice","pig trotter","braised pork"] },
    { label: "Vegetables",    color: "#81c784", bg: "#e8f5e9", keys: ["salad","coleslaw","tabbouleh","broccoli","carrot","corn","spinach","kale","arugula","lettuce","cucumber","tomato","green bean","edamame","mushroom","sweet potato","avocado","guacamole","soup","stew","chili","casserole","bok choy","gai lan","kai lan","morning glory","kangkong","water spinach","lotus root","bamboo shoot","bean sprout","choy sum","napa cabbage","achar","pickled vegetable","winter melon","yam","taro","bitter gourd","kailan","chap chye","sayur","vegetable curry","mixed vegetables","chinese cabbage"] },
    { label: "Carbohydrates", color: "#ffb74d", bg: "#fff8e1", keys: ["pasta","rice","bread","noodle","lasagna","gnocchi","potato","mac","ramen","naan","pita","bagel","roll","bun","flatbread","croissant","waffle","pancake","grits","polenta","couscous","quinoa","pretzel","cracker","chip","nacho","tortilla","wrap","taco","sushi","burrito","char kway teow","kway teow","laksa","nasi lemak","nasi goreng","fried rice","mee goreng","mee rebus","roti prata","roti canai","wonton mee","fish ball noodle","lor mee","mee siam","popiah","curry puff","epok epok","cheung fun","turnip cake","chai tow kway","radish cake","lo bak go","clay pot rice","claypot rice","congee","jook","porridge","char siu bao","bao","mantou","yam cake","bee hoon","hor fun","ho fun","kway chap","hae mee","prawn noodle","mee pok","kolo mee","tang hoon","glass noodle","spring roll","pau","dim sum","yum cha","chee cheong fun","chwee kueh"] },
    { label: "Dairy",         color: "#90caf9", bg: "#e3f2fd", keys: ["cheese","queso","milk","cream","yogurt","tzatziki","butter","brie","charcuterie","coconut milk","kaya"] },
  ];
  for (const g of groups) {
    if (g.keys.some((k) => n.includes(k))) return g;
  }
  return { label: "Unknown", color: "#bdbdbd", bg: "#f5f5f5" };
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
    breakfast: ["Pancakes", "Scrambled Eggs", "Bacon", "Hash Browns", "Fresh Fruit Salad", "Coffee Cake", "Orange Juice"],
    brunch:    ["Quiche", "Mimosas", "Avocado Toast", "Bagels & Cream Cheese", "Cinnamon Rolls", "Fruit Salad", "Coffee"],
    lunch:     ["Pasta Salad", "Fried Chicken", "Potato Salad", "Chips & Dip", "Coleslaw", "Lemonade", "Cookies"],
    dinner:    ["Mac & Cheese", "Green Bean Casserole", "Mashed Potatoes", "Fried Chicken", "Dinner Rolls", "Sweet Tea", "Sheet Cake"],
    supper:    ["Baked Beans", "Cornbread", "Fried Chicken", "Coleslaw", "Sweet Potato Casserole", "Peach Cobbler", "Sweet Tea"],
  };
  for (const { keys, items } of contextMap) {
    if (keys.some((k) => name.includes(k))) return items;
  }
  return mealDefaults[meal] || ["Pasta Salad", "Fried Chicken", "Mac & Cheese", "Potato Salad", "Dinner Rolls", "Sheet Cake", "Sweet Tea"];
};

// ── Contextual table themes ───────────────────────────────────────────────────
const getTableTheme = (eventName, mealType) => {
  const name = (eventName || "").toLowerCase();
  const themes = [
    { keys: ["bbq", "barbecue", "grill", "cookout"],
      bg: "radial-gradient(circle at 35% 35%, #ffe8c8 0%, #f5c992 55%, #e8a854 100%)",
      ring: "#f5c892", glow: "rgba(245,200,146,0.55)", label: "#5c3200" },
    { keys: ["christmas", "holiday", "xmas", "festive"],
      bg: "radial-gradient(circle at 35% 35%, #d4edda 0%, #b5d8c4 55%, #8ec4a8 100%)",
      ring: "#ef9a9a", glow: "rgba(239,154,154,0.5)", label: "#1b5e20" },
    { keys: ["halloween", "spooky", "trick"],
      bg: "radial-gradient(circle at 35% 35%, #f5d9fa 0%, #e4b0f0 55%, #ce87e0 100%)",
      ring: "#ffb347", glow: "rgba(255,179,71,0.55)", label: "#4a1060" },
    { keys: ["birthday", "bday", "party", "celebration"],
      bg: "radial-gradient(circle at 35% 35%, #fce4ec 0%, #f8bbd9 55%, #f48fb1 100%)",
      ring: "#ce93d8", glow: "rgba(206,147,216,0.5)", label: "#880e4f" },
    { keys: ["thanksgiving", "harvest", "fall"],
      bg: "radial-gradient(circle at 35% 35%, #fde8c8 0%, #f5c87a 55%, #e8a84a 100%)",
      ring: "#f5c87a", glow: "rgba(245,200,122,0.5)", label: "#5c3200" },
    { keys: ["summer", "picnic", "garden", "outdoor"],
      bg: "radial-gradient(circle at 35% 35%, #d4f5d4 0%, #a8e6a3 55%, #76c870 100%)",
      ring: "#a8d5b5", glow: "rgba(168,213,181,0.55)", label: "#1b5e20" },
    { keys: ["taco", "mexican", "fiesta", "cinco"],
      bg: "radial-gradient(circle at 35% 35%, #ffe8c8 0%, #f5c07a 55%, #e8a040 100%)",
      ring: "#ffe082", glow: "rgba(255,224,130,0.55)", label: "#5c2800" },
    { keys: ["italian", "pasta", "pizza night"],
      bg: "radial-gradient(circle at 35% 35%, #fce4e4 0%, #f8b4b4 55%, #f08080 100%)",
      ring: "#ef9a9a", glow: "rgba(239,154,154,0.5)", label: "#880e0e" },
    { keys: ["asian", "chinese", "japanese", "sushi", "korean"],
      bg: "radial-gradient(circle at 35% 35%, #fde8f0 0%, #f8b4d4 55%, #f080b0 100%)",
      ring: "#f48fb1", glow: "rgba(244,143,177,0.5)", label: "#880e4f" },
    { keys: ["game", "super bowl", "sports", "watch"],
      bg: "radial-gradient(circle at 35% 35%, #dde8fa 0%, #b3c8f5 55%, #8898e0 100%)",
      ring: "#90caf9", glow: "rgba(144,202,249,0.5)", label: "#283593" },
    { keys: ["vegan", "vegetarian", "plant", "healthy"],
      bg: "radial-gradient(circle at 35% 35%, #d4f0d4 0%, #a8d8a8 55%, #76b876 100%)",
      ring: "#aed581", glow: "rgba(174,213,129,0.5)", label: "#1b5e20" },
    { keys: ["seafood", "fish", "clambake", "lobster"],
      bg: "radial-gradient(circle at 35% 35%, #d4f0f5 0%, #a8d8e8 55%, #70b8d0 100%)",
      ring: "#80deea", glow: "rgba(128,222,234,0.5)", label: "#006064" },
    { keys: ["brunch", "mimosa"],
      bg: "radial-gradient(circle at 35% 35%, #fce4ec 0%, #f8bbd9 55%, #f48fb1 100%)",
      ring: "#fff59d", glow: "rgba(255,245,157,0.5)", label: "#880e4f" },
    { keys: ["dessert", "sweet", "candy", "chocolate"],
      bg: "radial-gradient(circle at 35% 35%, #f5e4f5 0%, #e8b8f0 55%, #d080d8 100%)",
      ring: "#f48fb1", glow: "rgba(244,143,177,0.5)", label: "#4a0060" },
  ];
  const mealThemes = {
    breakfast: { bg: "radial-gradient(circle at 35% 35%, #fff8d4 0%, #ffd97d 55%, #f9b347 100%)", ring: "#f4c842", glow: "rgba(244,200,66,0.55)", label: "#5c3d00" },
    brunch:    { bg: "radial-gradient(circle at 35% 35%, #fce4ec 0%, #f8bbd9 55%, #f48fb1 100%)", ring: "#f8bbd9", glow: "rgba(248,187,217,0.55)", label: "#880e4f" },
    lunch:     { bg: "radial-gradient(circle at 35% 35%, #d4edda 0%, #a8d5b5 55%, #74c08a 100%)", ring: "#b8e0b5", glow: "rgba(184,224,181,0.55)", label: "#1b5e20" },
    dinner:    { bg: "radial-gradient(circle at 35% 35%, #dde3fa 0%, #b3bef5 55%, #8898e8 100%)", ring: "#c5caed", glow: "rgba(197,202,237,0.55)", label: "#283593" },
    supper:    { bg: "radial-gradient(circle at 35% 35%, #ead5f5 0%, #d4a8e8 55%, #b87dd1 100%)", ring: "#d4a8e8", glow: "rgba(212,168,232,0.55)", label: "#4a148c" },
  };
  for (const theme of themes) {
    if (theme.keys.some((k) => name.includes(k))) return theme;
  }
  return mealThemes[(mealType || "").toLowerCase()] || {
    bg: "radial-gradient(circle at 35% 35%, #f5deb3 0%, #deb887 55%, #c4a26a 100%)",
    ring: "#deb887", glow: "rgba(222,184,135,0.55)", label: "#5d3a1a"
  };
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

// Events live in Firebase Realtime Database — shared across all devices.
// userMap (which events a user has joined) stays in localStorage — device-local preference.
const USER_MAP_KEY = "potluckpal_usermap_v2";
function loadUserMap() { try { return JSON.parse(localStorage.getItem(USER_MAP_KEY) || "{}"); } catch { return {}; } }
function saveUserMap(data) { try { localStorage.setItem(USER_MAP_KEY, JSON.stringify(data)); } catch {} }

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

// ── Mascot (Potsy the Chef) ───────────────────────────────────────────────────
function Mascot({ size = 130, style = {} }) {
  return (
    <div style={{ display: "inline-block", ...style }}>
      <style>{`
        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes mascotSway {
          0%, 100% { transform: rotate(-2.5deg); }
          50%       { transform: rotate(2.5deg); }
        }
        @keyframes mascotBlink {
          0%, 85%, 100% { opacity: 1; }
          90%, 96%       { opacity: 0; }
        }
        @keyframes mascotBlinkClosed {
          0%, 85%, 100% { opacity: 0; }
          90%, 96%       { opacity: 1; }
        }
        @keyframes mascotArmWave {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(-18deg); }
        }
      `}</style>
      <div style={{ animation: "mascotFloat 3.5s ease-in-out infinite", display: "inline-block" }}>
        <svg
          width={size}
          height={Math.round(size * 1.45)}
          viewBox="0 0 140 203"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animation: "mascotSway 4s ease-in-out infinite", transformOrigin: "70px 198px", display: "block", overflow: "visible" }}
        >
          {/* === SHOES === */}
          <ellipse cx="50" cy="192" rx="16" ry="9" fill="#6b4c35" />
          <ellipse cx="44" cy="188" rx="8" ry="4" fill="#8d6e63" opacity="0.45" />
          <ellipse cx="90" cy="192" rx="16" ry="9" fill="#6b4c35" />
          <ellipse cx="84" cy="188" rx="8" ry="4" fill="#8d6e63" opacity="0.45" />

          {/* === LEFT ARM (behind body) === */}
          <ellipse cx="26" cy="148" rx="14" ry="10" fill="#FFCBA4" transform="rotate(-22 26 148)" />
          <circle cx="18" cy="160" r="11" fill="#FFCBA4" />

          {/* === BODY === */}
          <ellipse cx="70" cy="158" rx="36" ry="32" fill="#ff6a00" />
          <ellipse cx="62" cy="138" rx="14" ry="7" fill="#ff8c40" opacity="0.35" />
          {/* Apron front */}
          <ellipse cx="70" cy="162" rx="21" ry="23" fill="#fff8f0" />
          {/* Apron waist ties */}
          <rect x="47" y="150" width="11" height="8" rx="4" fill="#ffd4a8" />
          <rect x="82" y="150" width="11" height="8" rx="4" fill="#ffd4a8" />
          {/* Apron pocket */}
          <rect x="61" y="174" width="18" height="11" rx="5" fill="#f0e0cc" />

          {/* === EARS (behind head) === */}
          <circle cx="31" cy="97" r="12" fill="#FFCBA4" />
          <circle cx="31" cy="97" r="7" fill="#e8a070" opacity="0.45" />
          <circle cx="109" cy="97" r="12" fill="#FFCBA4" />
          <circle cx="109" cy="97" r="7" fill="#e8a070" opacity="0.45" />

          {/* === HEAD === */}
          <circle cx="70" cy="97" r="40" fill="#FFCBA4" />

          {/* === CHEF HAT === */}
          <rect x="36" y="12" width="68" height="50" rx="7" fill="white" />
          <ellipse cx="70" cy="12" rx="34" ry="10" fill="#f0ede8" />
          <ellipse cx="70" cy="8" rx="25" ry="21" fill="white" />
          <ellipse cx="70" cy="22" rx="25" ry="9" fill="#e8e5e0" opacity="0.5" />
          <rect x="28" y="59" width="84" height="14" rx="7" fill="#8d6e63" />
          <rect x="28" y="67" width="84" height="4" rx="2" fill="#7a5c54" opacity="0.4" />

          {/* === FACE: eyebrows === */}
          <path d="M 47 82 Q 57 77 67 81" stroke="#5d3a20" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M 73 81 Q 83 77 93 82" stroke="#5d3a20" strokeWidth="2.8" strokeLinecap="round" fill="none" />

          {/* === FACE: open eyes (animated blink) === */}
          <g style={{ animation: "mascotBlink 5s ease-in-out infinite" }}>
            <circle cx="55" cy="96" r="10" fill="white" />
            <circle cx="85" cy="96" r="10" fill="white" />
            <circle cx="56" cy="97" r="6" fill="#2d1a0e" />
            <circle cx="86" cy="97" r="6" fill="#2d1a0e" />
            <circle cx="58" cy="94" r="2.5" fill="white" />
            <circle cx="88" cy="94" r="2.5" fill="white" />
          </g>

          {/* === FACE: closed eyes (blink flash) === */}
          <g style={{ animation: "mascotBlinkClosed 5s ease-in-out infinite" }}>
            <path d="M 46 96 Q 55 103 64 96" stroke="#2d1a0e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 76 96 Q 85 103 94 96" stroke="#2d1a0e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>

          {/* === FACE: nose, cheeks, smile === */}
          <ellipse cx="70" cy="108" rx="4.5" ry="3" fill="#e8906a" opacity="0.8" />
          <ellipse cx="43" cy="114" rx="12" ry="7" fill="#ffb3a0" opacity="0.55" />
          <ellipse cx="97" cy="114" rx="12" ry="7" fill="#ffb3a0" opacity="0.55" />
          <path d="M 55 118 Q 70 131 85 118" stroke="#c0523a" strokeWidth="2.8" strokeLinecap="round" fill="none" />

          {/* === RIGHT ARM + WOODEN SPOON (in front, animated wave) === */}
          <g style={{ transformOrigin: "103px 136px", animation: "mascotArmWave 2.8s ease-in-out infinite" }}>
            <ellipse cx="112" cy="148" rx="13" ry="10" fill="#FFCBA4" transform="rotate(22 112 148)" />
            <circle cx="120" cy="160" r="10" fill="#FFCBA4" />
            {/* Spoon handle */}
            <rect x="124" y="118" width="6" height="46" rx="3" fill="#c49a6c" />
            <rect x="125.5" y="114" width="3" height="8" rx="1.5" fill="#b8894c" />
            {/* Spoon bowl */}
            <ellipse cx="127" cy="112" rx="9" ry="7" fill="#c49a6c" />
            <ellipse cx="127" cy="111" rx="6" ry="4.5" fill="#d4aa7d" opacity="0.85" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────
function HomeScreen({ onCreateEvent, onJoinEvent, onViewHistory, initialJoinCode = "" }) {
  const isMobile = useIsMobile();
  const [name, setName]         = useState("");
  const [joinName, setJoinName] = useState("");
  const [code, setCode]         = useState(initialJoinCode);
  const [histName, setHistName] = useState("");

  // initialJoinCode arrives after mount (URL useEffect fires after first render)
  useEffect(() => { if (initialJoinCode) setCode(initialJoinCode); }, [initialJoinCode]);
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: isMobile ? "1rem" : "2rem", paddingBottom: isMobile ? "1.5rem" : "3rem", paddingLeft: isMobile ? "0.5rem" : "1rem", paddingRight: isMobile ? "0.5rem" : "1rem", display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center", backgroundImage: `linear-gradient(rgba(255,245,235,0.55), rgba(255,245,235,0.55)), url(${homeBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", borderRadius: "20px", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? "1rem" : "2.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "flex-end", justifyContent: "center", background: "white", borderRadius: "50%", width: isMobile ? 210 : 280, height: isMobile ? 210 : 280, overflow: "hidden", boxShadow: "0 8px 40px rgba(255,106,0,0.30), 0 0 0 8px rgba(255,255,255,0.55)", marginBottom: "1rem" }}>
          <Mascot size={isMobile ? 200 : 260} />
        </div>
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
function HistoryScreen({ userName, userMap, onDelete, onOpen, onBack }) {
  const [myEvents, setMyEvents] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const key = userName.trim().toLowerCase();
    const ids = userMap[key] || [];
    if (!ids.length) { setFetching(false); return; }
    Promise.all(ids.map((id) => get(ref(db, `events/${id}`)))).then((snaps) => {
      setMyEvents(
        snaps.filter((s) => s.exists()).map((s) => s.val()).sort((a, b) => b.createdAt - a.createdAt)
      );
      setFetching(false);
    });
  }, [userName, userMap]);

  const fmtDate = (d) => { try { return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }); } catch { return d; } };
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "1.5rem" }}>
      <Button variant="ghost" onClick={onBack} style={{ marginBottom: "0.8rem" }}>← Back</Button>
      <Card>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontStyle: "italic", color: "#5d4e37", marginTop: 0, fontSize: "1.6rem" }}>📖 {userName}'s Events</h2>
        {fetching ? (
          <p style={{ fontFamily: "'Nunito', sans-serif", color: "#a8caba", textAlign: "center", padding: "1.5rem 0" }}>Loading…</p>
        ) : myEvents.length === 0 ? (
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
        {form.location.trim() && (
          <div style={{ marginTop: "-0.6rem", marginBottom: "1rem", textAlign: "right" }}>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.location.trim())}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "#ff6a00", fontFamily: "'Nunito', sans-serif", textDecoration: "none" }}>📍 Preview on Maps ↗</a>
          </div>
        )}
        <Input label="Number of Guests" value={form.attendees} onChange={set("attendees")} type="number" placeholder="e.g. 12" required />
        <Button onClick={() => valid && onCreate(form)} disabled={!valid} style={{ width: "100%" }}>🚀 Create Event & Get Link</Button>
      </Card>
    </div>
  );
}

// ── Round Potluck Table ───────────────────────────────────────────────────────
function PotluckTable({ items, attendees }) {
  const isMobile = useIsMobile();
  const isEmpty  = items.length === 0;
  const tableItems = items.map((item, idx) => ({
    ...item,
    animDelay: ((idx * 0.37) % 2).toFixed(2) + "s",
  }));

  // rAF orbit: directly mutate top/left on each frame — no React re-renders
  const itemRefs = useRef([]);
  const orbitRef = useRef(0);
  const rafRef   = useRef(null);

  useEffect(() => {
    if (isEmpty) return;
    const count = tableItems.length;
    const baseAngles = tableItems.map((_, i) => (i * 360 / count - 90) * (Math.PI / 180));
    const degPerSec  = 15; // full orbit every 24 s
    let lastTime = null;

    const animate = (now) => {
      if (lastTime !== null) {
        orbitRef.current = (orbitRef.current + ((now - lastTime) / 1000) * degPerSec) % 360;
      }
      lastTime = now;
      const orbitRad = orbitRef.current * (Math.PI / 180);
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = baseAngles[i] + orbitRad;
        el.style.top  = `${50 + 32 * Math.sin(a)}%`;
        el.style.left = `${50 + 32 * Math.cos(a)}%`;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isEmpty, tableItems.length]);

  const stoolCount = Math.min(12, Math.max(1, parseInt(attendees) || 6));
  const stoolSize  = isMobile ? 18 : 26;
  const chairPad   = isMobile ? "1.5rem" : "2.2rem";
  const tableW     = isMobile ? "min(260px, 72vw)" : "min(320px, 88vw)";
  const woodBg     = "radial-gradient(circle at 38% 32%, #f5e6c8 0%, #e0c080 25%, #c89848 55%, #a87030 80%, #8b5a20 100%)";

  const stoolPositions = Array.from({ length: stoolCount }, (_, i) => {
    const angle = (i * 360 / stoolCount - 90) * (Math.PI / 180);
    return { top: `${50 + 46 * Math.sin(angle)}%`, left: `${50 + 46 * Math.cos(angle)}%`, transform: "translate(-50%, -50%)" };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem 0 0.5rem" }}>
      <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: "0.88rem", marginBottom: "0.7rem", background: "rgba(255,255,255,0.8)", padding: "3px 18px", borderRadius: 20, border: "1.5px solid #c4965a", color: "#5d4037", letterSpacing: "0.06em" }}>
        🍽️ The Table
      </span>
      <div style={{ position: "relative", padding: chairPad, display: "inline-block" }}>
        {stoolPositions.map((pos, i) => (
          <div key={i} style={{ position: "absolute", width: stoolSize, height: stoolSize, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #d4a870 0%, #a06828 60%, #7a4a14 100%)", border: "2px solid #5c3008", boxShadow: "0 2px 6px rgba(0,0,0,0.40)", pointerEvents: "none", ...pos }} />
        ))}
        <div style={{ position: "relative", width: tableW, height: tableW, borderRadius: "50%", background: woodBg, boxShadow: "0 0 0 9px #7a4e10, 0 0 0 14px #c4965a, 0 14px 45px rgba(0,0,0,0.30), inset 0 4px 24px rgba(255,255,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: "7%",  borderRadius: "50%", border: "1px solid rgba(90,50,10,0.20)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "18%", borderRadius: "50%", border: "1px solid rgba(90,50,10,0.18)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "31%", borderRadius: "50%", border: "1px solid rgba(90,50,10,0.15)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "45%", borderRadius: "50%", border: "1px solid rgba(90,50,10,0.12)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "8%", left: "20%", width: "55%", height: "28%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
          {isEmpty ? (
            <div style={{ textAlign: "center", color: "rgba(0,0,0,0.4)", fontFamily: "'Nunito', sans-serif", fontSize: "0.88rem", padding: "1rem", zIndex: 1 }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 6 }}>🍽️</div>
              <p style={{ margin: 0 }}>Add your dish below!</p>
            </div>
          ) : tableItems.map((item, i) => {
            const initAngle = (i * 360 / tableItems.length - 90) * (Math.PI / 180);
            const emojiSize = item.quantity >= 5 ? "2.4rem" : item.quantity >= 4 ? "2.0rem" : item.quantity >= 3 ? "1.7rem" : item.quantity >= 2 ? "1.4rem" : "1.2rem";
            const cat = getFoodCategory(item.itemName);
            return (
              // Outer div: position anchor — rAF updates top/left, transform stays fixed
              <div key={item.id}
                ref={el => { itemRefs.current[i] = el; }}
                style={{ position: "absolute", top: `${50 + 32 * Math.sin(initAngle)}%`, left: `${50 + 32 * Math.cos(initAngle)}%`, transform: "translate(-50%, -50%)", zIndex: 1, pointerEvents: "none" }}>
                {/* Inner div: subtle pulse animation, independent transform */}
                <div title={`${item.itemName} ×${item.quantity} — by ${item.bringerName}`}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", animationName: "pulse-scale", animationDuration: "2.8s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: item.animDelay }}>
                  <div style={{ background: "rgba(255,255,255,0.88)", border: `3px solid ${cat.color}`, borderRadius: "50%", padding: "4px", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 8px rgba(0,0,0,0.20), 0 0 0 1px rgba(255,255,255,0.5)` }}>
                    <span style={{ fontSize: emojiSize, display: "block", lineHeight: 1 }}>{item.emoji}</span>
                  </div>
                  <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: "0.55rem", color: "#fff", background: "rgba(70,35,0,0.55)", borderRadius: 6, padding: "1px 5px", marginTop: "2px", lineHeight: "1.4", whiteSpace: "nowrap" }}>×{item.quantity}</span>
                </div>
              </div>
            );
          })}
        </div>
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
const qtyBtn = { width: 24, height: 24, borderRadius: "50%", border: "1px solid #ffcc80", background: "#fff3e0", color: "#e65100", cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: 0, fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };

function ItemList({ items, onDeleteItem, onUpdateQty }) {
  if (!items.length) return null;
  return (
    <Card style={{ marginTop: "1.2rem" }}>
      <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "#e64a19", marginTop: 0, fontSize: "1.2rem" }}>📋 Who's Bringing What</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item) => {
          const cat = getFoodCategory(item.itemName);
          return (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: cat.bg, borderRadius: 12, padding: "0.55rem 0.9rem", border: `2px solid ${cat.color}` }}>
            <span style={{ fontSize: "1.6rem" }}>{item.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: "'Fredoka One', cursive", color: "#bf360c", fontSize: "1rem" }}>{item.itemName}</span>
              <span style={{ fontFamily: "'Nunito', sans-serif", color: "#6d4c41", fontSize: "0.82rem", marginLeft: 6 }}>by <strong>{item.bringerName}</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
              <button style={qtyBtn} onClick={() => onUpdateQty(item.id, item.quantity - 1)}>−</button>
              <span style={{ fontFamily: "'Fredoka One', cursive", color: "#8d6e63", fontSize: "0.9rem", minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
              <button style={qtyBtn} onClick={() => onUpdateQty(item.id, item.quantity + 1)}>+</button>
            </div>
            <button onClick={() => onDeleteItem(item.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.1rem", opacity: 0.6, padding: "0 2px", flexShrink: 0 }}>🗑️</button>
          </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Event Screen ──────────────────────────────────────────────────────────────
function EventScreen({ event, userName, onAddItem, onDeleteItem, onUpdateItemQty, onAddGuest, onRemoveGuest, onBack }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [newGuest, setNewGuest]   = useState("");
  const [copied, setCopied]       = useState(false);
  const shareUrl = `${window.location.href.split("?")[0].replace(/\/index\.html$/, "")}?event=${event.id}`;
  const theme    = getTableTheme(event.name, event.mealType);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const mealLabel = MEAL_TYPES.find((m) => m.value === event.mealType)?.label || "";
  const fmtDate   = (d) => { try { return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" }); } catch { return d; } };
  const fmtTime   = (t) => TIME_OPTIONS.find((o) => o.value === t)?.label || t;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: "1.2rem" }}>
      <Button variant="ghost" onClick={onBack} style={{ marginBottom: "0.8rem" }}>← Home</Button>
      <Card style={{ marginBottom: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: (shareOpen || guestOpen) ? "0.75rem" : 0 }}>
          <div>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", color: "#5d4e37", marginTop: 0, fontSize: "clamp(1.45rem, 5vw, 1.9rem)" }}>🎊 {event.name}</h2>
            {mealLabel && <p style={{ fontFamily: "'Nunito', sans-serif", color: "#5d4e37", margin: "4px 0", fontSize: "1rem" }}>🍴 {mealLabel}</p>}
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "#5d4e37", margin: "4px 0", fontSize: "1rem" }}>📅 {fmtDate(event.date)} at {fmtTime(event.time)}</p>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "#5d4e37", margin: "4px 0", fontSize: "1rem" }}>
              📍{" "}
              {event.location ? (
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noopener noreferrer" style={{ color: "#ff6a00", textDecoration: "underline", fontFamily: "'Nunito', sans-serif" }}>{event.location}</a>
              ) : event.location}
            </p>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "#5d4e37", margin: "4px 0", fontSize: "1rem" }}>👥 {event.attendees} guests</p>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
            <Button onClick={() => { setGuestOpen((o) => !o); setShareOpen(false); }} variant="secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem" }}>
              {guestOpen ? "✕ Guests" : `👥 Guests${(event.guests || []).length > 0 ? ` (${(event.guests || []).length})` : ""}`}
            </Button>
            <Button onClick={() => { setShareOpen((o) => !o); setGuestOpen(false); }} variant="secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.82rem" }}>
              {shareOpen ? "✕ Close" : "🔗 Share"}
            </Button>
          </div>
        </div>
        {shareOpen && (
          <div style={{ width: "100%", background: "rgba(255,250,245,0.98)", border: `2px solid ${theme.ring}`, borderRadius: 16, padding: "0.85rem 1rem", animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <p style={{ fontFamily: "'Fredoka One', cursive", color: "#5d4e37", fontSize: "0.92rem", margin: "0 0 0.5rem" }}>🔗 Share with your guests:</p>
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
        {guestOpen && (
          <div style={{ width: "100%", background: "rgba(255,250,245,0.98)", border: `2px solid ${theme.ring}`, borderRadius: 16, padding: "0.85rem 1rem", animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <p style={{ fontFamily: "'Fredoka One', cursive", color: "#5d4e37", fontSize: "0.92rem", margin: "0 0 0.6rem" }}>👥 Who's coming:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.75rem" }}>
              {(event.guests || []).length === 0 && (
                <p style={{ fontFamily: "'Nunito', sans-serif", color: "#a1887f", fontSize: "0.82rem", margin: 0 }}>No guests yet — share the link!</p>
              )}
              {(event.guests || []).map((g) => (
                <div key={g.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.85)", border: "1.5px solid #ffccbc", borderRadius: 10, padding: "0.3rem 0.7rem" }}>
                  <span style={{ fontFamily: "'Nunito', sans-serif", color: "#5d4037", fontSize: "0.9rem" }}>🙋 {g.name}</span>
                  <button onClick={() => onRemoveGuest(g.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#bcaaa4", fontSize: "1rem", lineHeight: 1, padding: "0 2px" }} title="Remove guest">×</button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                value={newGuest}
                onChange={(e) => setNewGuest(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && newGuest.trim()) { onAddGuest(newGuest.trim()); setNewGuest(""); } }}
                placeholder="Add a guest name…"
                style={{ flex: 1, padding: "0.4rem 0.7rem", borderRadius: 10, border: "1.5px solid #ffccbc", fontFamily: "'Nunito', sans-serif", fontSize: "0.88rem", outline: "none", background: "rgba(255,255,255,0.95)", color: "#5d4037" }}
              />
              <button
                onClick={() => { if (newGuest.trim()) { onAddGuest(newGuest.trim()); setNewGuest(""); } }}
                disabled={!newGuest.trim()}
                style={{ border: "none", borderRadius: 10, padding: "0.4rem 0.9rem", cursor: newGuest.trim() ? "pointer" : "not-allowed", fontFamily: "'Fredoka One', cursive", fontSize: "0.88rem", background: "linear-gradient(135deg,#8d6e63,#a1887f)", color: "#fff", opacity: newGuest.trim() ? 1 : 0.5 }}
              >Add</button>
            </div>
          </div>
        )}
      </Card>

      <PotluckTable items={event.items || []} eventName={event.name} mealType={event.mealType} attendees={event.attendees} />
      <AddItemForm userName={userName} onAdd={(item) => onAddItem(event.id, item, userName)} eventName={event.name} mealType={event.mealType} />
      <ItemList items={event.items || []} onDeleteItem={(itemId) => onDeleteItem(event.id, itemId)} onUpdateQty={(itemId, qty) => onUpdateItemQty(event.id, itemId, qty)} />
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  const [screen, setScreen]                 = useState("home");
  const [currentEvent, setCurrentEvent]     = useState(null);
  const [userMap, setUserMap]               = useState(() => loadUserMap());
  const [currentEventId, setCurrentEventId] = useState(null);
  const [userName, setUserName]             = useState("");
  const [historyUser, setHistoryUser]       = useState("");
  const [scrollY, setScrollY]               = useState(0);

  // Check URL for ?event=ID on mount
  useEffect(() => {
    const eid = new URLSearchParams(window.location.search).get("event");
    if (eid) { setCurrentEventId(eid); setScreen("event-join"); }
  }, []);

  // Real-time listener: whenever currentEventId changes, subscribe to that event in Firebase
  useEffect(() => {
    if (!currentEventId) return;
    const unsub = onValue(ref(db, `events/${currentEventId}`), (snap) => {
      if (snap.exists()) setCurrentEvent(snap.val());
    });
    return () => unsub();
  }, [currentEventId]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const registerUserEvent = useCallback((name, eventId) => {
    const key = name.trim().toLowerCase();
    setUserMap((prev) => {
      if ((prev[key] || []).includes(eventId)) return prev;
      const updated = { ...prev, [key]: [...(prev[key] || []), eventId] };
      saveUserMap(updated);
      return updated;
    });
  }, []);

  const handleCreateEvent = useCallback(async (form) => {
    try {
      const id = generateId();
      const newEvent = { id, ...form, createdBy: userName, items: [], guests: [{ id: generateId(), name: userName, joinedAt: Date.now() }], createdAt: Date.now() };
      await set(ref(db, `events/${id}`), newEvent);
      registerUserEvent(userName, id);
      setCurrentEventId(id);
      setScreen("event");
    } catch (err) {
      console.error("Failed to create event:", err);
      alert("Could not create event — check your internet connection and try again.\n\nIf this is a Vercel deployment, make sure the Firebase environment variables are set in the Vercel dashboard.");
    }
  }, [userName, registerUserEvent]);

  const handleJoinEvent = useCallback(async (id, name) => {
    try {
      setUserName(name);
      const snap = await get(ref(db, `events/${id}`));
      if (snap.exists()) {
        registerUserEvent(name, id);
        const gRef = ref(db, `events/${id}/guests`);
        const gSnap = await get(gRef);
        const currentGuests = gSnap.val() || [];
        if (!currentGuests.some((g) => g.name.toLowerCase() === name.toLowerCase())) {
          await set(gRef, [...currentGuests, { id: generateId(), name, joinedAt: Date.now() }]);
        }
        setCurrentEventId(id);
        setScreen("event");
      } else {
        alert("Event not found. Please check the link or ID.");
      }
    } catch (err) {
      console.error("Failed to join event:", err);
      alert("Could not connect to the event — check your internet connection and try again.");
    }
  }, [registerUserEvent]);

  const handleAddItem = useCallback(async (eventId, item, bringer) => {
    try {
      const newItem = { id: generateId(), itemName: item.itemName, quantity: item.quantity, bringerName: bringer, emoji: getFoodEmoji(item.itemName), addedAt: Date.now() };
      const itemsRef = ref(db, `events/${eventId}/items`);
      const snap = await get(itemsRef);
      const current = snap.val() || [];
      await set(itemsRef, [...current, newItem]);
      registerUserEvent(bringer, eventId);
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Could not add item — check your internet connection and try again.");
    }
  }, [registerUserEvent]);

  const handleDeleteItem = useCallback(async (eventId, itemId) => {
    try {
      const itemsRef = ref(db, `events/${eventId}/items`);
      const snap = await get(itemsRef);
      const current = snap.val() || [];
      await set(itemsRef, current.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Could not remove item — check your connection and try again.");
    }
  }, []);

  const handleUpdateItemQty = useCallback(async (eventId, itemId, newQty) => {
    try {
      const itemsRef = ref(db, `events/${eventId}/items`);
      const snap = await get(itemsRef);
      const current = snap.val() || [];
      if (newQty <= 0) {
        await set(itemsRef, current.filter((item) => item.id !== itemId));
      } else {
        await set(itemsRef, current.map((item) => item.id === itemId ? { ...item, quantity: newQty } : item));
      }
    } catch (err) {
      console.error("Failed to update item:", err);
      alert("Could not update quantity — check your connection and try again.");
    }
  }, []);

  const handleAddGuest = useCallback(async (eventId, name) => {
    try {
      const gRef = ref(db, `events/${eventId}/guests`);
      const snap = await get(gRef);
      const current = snap.val() || [];
      if (!current.some((g) => g.name.toLowerCase() === name.toLowerCase())) {
        await set(gRef, [...current, { id: generateId(), name: name.trim(), joinedAt: Date.now() }]);
      }
    } catch (err) {
      console.error("Failed to add guest:", err);
    }
  }, []);

  const handleRemoveGuest = useCallback(async (eventId, guestId) => {
    try {
      const gRef = ref(db, `events/${eventId}/guests`);
      const snap = await get(gRef);
      const current = snap.val() || [];
      await set(gRef, current.filter((g) => g.id !== guestId));
    } catch (err) {
      console.error("Failed to remove guest:", err);
    }
  }, []);

  const handleDeleteEvent = useCallback(async (eventId) => {
    await remove(ref(db, `events/${eventId}`));
    setUserMap((prev) => {
      const updated = {};
      for (const [k, ids] of Object.entries(prev)) {
        const f = ids.filter((id) => id !== eventId);
        if (f.length) updated[k] = f;
      }
      saveUserMap(updated);
      return updated;
    });
  }, []);

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
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ffe4e4 0%, #ffd0d0 50%, #ffbaba 100%)", position: "relative", overflow: "hidden" }}>
        <Blob style={{ width: 250, height: 250, background: "#ffb3b3", top: -100, left: -150, opacity: 0.3, transform: `translateY(${scrollY * 0.1}px)` }} />
        <Blob style={{ width: 200, height: 200, background: "#ffc8c8", bottom: -80, right: -100, opacity: 0.3, transform: `translateY(${scrollY * -0.15}px)` }} />
        <Blob style={{ width: 180, height: 180, background: "#ffaaaa", top: "40%", right: "10%", opacity: 0.3, transform: `translateY(${scrollY * 0.2}px)` }} />
        {screen !== "home" && screen !== "event-join" && (
          <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderBottom: "1.5px solid rgba(224,242,241,0.4)", padding: isMobile ? "0.6rem 1rem" : "1rem 2rem", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
            <span style={{ fontSize: isMobile ? "1.5rem" : "2rem" }}>🥟</span>
            <span style={{ fontFamily: "'Fredoka One', cursive", color: "#ff6a00", fontSize: "clamp(1.4rem, 5vw, 2.5rem)", textShadow: "2px 2px 0 #fff, 0 0 20px rgba(255,120,0,0.4)" }}>Potluck Pal</span>
            {userName && <span style={{ fontFamily: "'Nunito', sans-serif", fontStyle: "italic", color: "#5d4e37", fontSize: isMobile ? "0.8rem" : "1rem", marginLeft: "auto" }}>Hi, {userName}! 👋</span>}
          </div>
        )}
        <div style={{ padding: isMobile ? "1rem" : "2rem", maxWidth: "800px", margin: "0 auto" }}>
          {(screen === "home" || screen === "event-join") && (
            <HomeScreen onCreateEvent={(n) => { setUserName(n); setScreen("create"); }} onJoinEvent={handleJoinEvent} onViewHistory={(n) => { setHistoryUser(n); setUserName(n); setScreen("history"); }} initialJoinCode={screen === "event-join" ? (currentEventId || "") : ""} />
          )}
          {screen === "create" && <CreateEventScreen userName={userName} onCreate={handleCreateEvent} onBack={() => setScreen("home")} />}
          {screen === "history" && <HistoryScreen userName={historyUser} userMap={userMap} onDelete={handleDeleteEvent} onOpen={(id) => { setCurrentEventId(id); setScreen("event"); }} onBack={() => setScreen("home")} />}
          {screen === "event" && currentEventId && currentEvent && (
            <EventScreen event={currentEvent} userName={userName} onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} onUpdateItemQty={handleUpdateItemQty} onAddGuest={(name) => handleAddGuest(currentEventId, name)} onRemoveGuest={(guestId) => handleRemoveGuest(currentEventId, guestId)} onBack={() => setScreen("home")} />
          )}
          {screen === "event" && currentEventId && !currentEvent && (
            <div style={{ textAlign: "center", paddingTop: "5rem", fontFamily: "'Fredoka One', cursive", color: "#5d4e37", fontSize: "1.6rem" }}>🍽️ Loading event…</div>
          )}
        </div>
      </div>
    </>
  );
}
