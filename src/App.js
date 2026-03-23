import React, {
  useState,
  useRef,
  useEffect,
  memo,
  useCallback,
  useMemo,
} from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  getDocs,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";

// ==========================================
// 🎨 АВТО-ЗАГРУЗКА ДИЗАЙНА (TAILWIND CSS)
// ==========================================
if (typeof window !== "undefined" && !document.getElementById("tailwind-cdn")) {
  const script = document.createElement("script");
  script.id = "tailwind-cdn";
  script.src = "https://cdn.tailwindcss.com";
  document.head.appendChild(script);
}

// ==========================================
// 🎨 ИКОНКИ (LUCIDE-REACT)
// ==========================================
import {
  Search,
  Menu,
  Paperclip,
  Smile,
  Send,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  Sparkles,
  Loader2,
  Settings,
  X,
  User,
  Palette,
  Bell,
  Shield,
  Bot,
  LogOut,
  Trash2,
  Info,
  PhoneOff,
  MicOff,
  Crown,
  CheckCircle2,
  Wallet,
  Gift,
  Mic,
  Square,
  Pin,
  ChevronLeft,
  Reply,
  Image as ImageIcon,
  FileText,
  MapPin,
  UserCircle,
  Type,
  AudioWaveform,
  Wand2,
  Gem,
  Lock,
  UserPlus,
  Play,
  Pause,
  AlertCircle,
  Camera,
  RefreshCw,
  Globe,
  VideoOff,
  Flame,
  Languages,
  ImagePlus,
  Edit3,
  Dices,
  CircleDot,
  Volume2,
  Trash,
  Wallpaper,
  Eye,
  EyeOff,
  Zap,
  ShieldAlert,
  Users,
  Megaphone,
  CalendarDays,
} from "lucide-react";

// ==========================================
// 🔥 КОНФИГУРАЦИЯ FIREBASE
// ==========================================
const myFirebaseConfig = {
  apiKey: "AIzaSyBK9uZcI5M60N-AOpFXk3nwmRXi9CFSXF8",
  authDomain: "platina-messenger.firebaseapp.com",
  projectId: "platina-messenger",
  storageBucket: "platina-messenger.firebasestorage.app",
  messagingSenderId: "940602416899",
  appId: "1:940602416899:web:33eece93c2feacd490d336",
};

const firebaseConfig = myFirebaseConfig.apiKey
  ? myFirebaseConfig
  : typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : null;
const fbApp = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = fbApp ? getAuth(fbApp) : null;
const db = fbApp ? getFirestore(fbApp) : null;
const appId =
  typeof __app_id !== "undefined" ? __app_id : "platina-messenger-prod";

const ADMIN_IDS = ["levkkkaw"]; // 🔥 ТВОЙ АККАУНТ - БОСС

const getAccRef = (userId) =>
  doc(db, "artifacts", appId, "public", "data", "platina_accounts", userId);

let sharedAudioCtx = null;
const getAudioContext = () => {
  if (!sharedAudioCtx)
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (sharedAudioCtx.state === "suspended") sharedAudioCtx.resume();
  return sharedAudioCtx;
};

const cleanData = (obj) =>
  JSON.parse(JSON.stringify(obj, (k, v) => (v === undefined ? null : v)));

// ==========================================
// 🌍 СЛОВАРЬ (DICT)
// ==========================================
const DICT = {
  ru: {
    login_title: "С возвращением.",
    reg_title: "Создай свой аккаунт.",
    login_id: "ЛОГИН (ID)",
    login_pass: "ПАРОЛЬ",
    btn_login: "ВОЙТИ В СЕТЬ",
    btn_reg: "РЕГИСТРАЦИЯ",
    no_acc: "Нет аккаунта? Создать",
    has_acc: "Уже есть аккаунт? Войти",
    disp_name: "ИМЯ ПРОФИЛЯ",
    bio: "О СЕБЕ",
    birthday: "ДЕНЬ РОЖДЕНИЯ",
    photo: "ФОТО",
    search: "ПОИСК ЧАТОВ...",
    add_friend: "НАЙТИ ДРУГА",
    settings: "Настройки",
    logout: "Выйти из сети",
    empty_chats: "Никого не найдено",
    find_bros: "Найти друзей",
    today: "Сегодня",
    start_chat: "Нет сообщений",
    type_msg: "Сообщение...",
    recording: "ЗАПИСЬ ЗВУКА...",
    you: "ВЫ",
    gift: "ПОДАРОК",
    photo_msg: "ФОТО",
    file_msg: "ФАЙЛ",
    geo_msg: "ГЕО",
    voice_msg: "ГОЛОСОВОЕ",
    sent_gift: "ВЫ ПОДАРИЛИ",
    gets_gift: "ДАРИТ",
    transcribe: "РАСШИФРОВАТЬ",
    hide: "СКРЫТЬ",
    ai_typing: "PLATINA AI ДУМАЕТ...",
    magic: "МАГИЯ ТЕКСТА",
    formal: "ОФИЦИАЛЬНО",
    friendly: "ДРУЖЕЛЮБНО",
    slang: "PLATINA STYLE",
    gallery: "ГАЛЕРЕЯ",
    friend: "ДРУГ",
    normal: "НОРМ",
    bass: "БАСС",
    chipmunk: "ПИСК",
    premium_emoji: "💎 ПРЕМИУМ ЭМОДЗИ",
    text_vibe: "⌨️ ТЕКСТОВЫЙ ВАЙБ",
    vip_gift: "VIP-ПОДАРОК 🎁",
    crystals: "Кристаллов",
    balance: "ТВОЙ БАЛАНС",
    top_up: "ПОПОЛНЕНИЕ КРИСТАЛЛОВ",
    hit: "ХИТ ПРОДАЖ",
    bonus: "БОНУС",
    del_chat_title: "УДАЛИТЬ ЧАТ?",
    del_chat_desc: "Вся история исчезнет навсегда. БЕЗ ВОЗВРАТА.",
    back: "НАЗАД",
    delete: "УДАЛИТЬ",
    new_connect: "НОВЫЙ КОННЕКТ",
    enter_id: "Введи ID друга, чтобы начать переписку.",
    connect_btn: "ПОДКЛЮЧИТЬ",
    calling: "ЗВОНОК...",
    burned: "Сообщение сгорело",
    reply: "Ответить",
    translate: "Перевести",
    delete_msg: "Удалить",
    edit_msg: "Изменить",
    generating_image: "PLATINA AI РИСУЕТ...",
    dice: "КУБИК",
    coin: "МОНЕТКА",
    clear_history: "Очистить историю",
    secret_chat: "Секретный чат",
    change_bg: "Сменить фон",
    read_aloud: "Прочитать",
    history_cleared: "История очищена 🧹",
    s_prem: "PLATINA PREMIUM",
    s_wallet: "КРИСТАЛЛЫ",
    s_prof: "ПРОФИЛЬ",
    s_app: "ВНЕШНИЙ ВИД",
    s_notif: "УВЕДОМЛЕНИЯ",
    s_priv: "ПРИВАТНОСТЬ",
    s_ai: "PLATINA AI",
    s_lang: "ЯЗЫК / LANGUAGE",
    s_admin: "АДМИН-ПАНЕЛЬ",
    theme: "ГЛОБАЛЬНАЯ ТЕМА",
    accent: "ЦВЕТОВОЙ АКЦЕНТ",
    font_size: "РАЗМЕР ШРИФТА",
    sounds: "ЗВУКОВЫЕ ЭФФЕКТЫ",
    toasts: "ВСПЛЫВАЮЩИЕ ТОСТЫ",
    status: "СТАТУС В СЕТИ",
    everyone: "ВИДЯТ ВСЕ",
    contacts_only: "ТОЛЬКО КОНТАКТЫ",
    nobody: "РЕЖИМ НЕВИДИМКИ (PREMIUM)",
    invisible: "РЕЖИМ НЕВИДИМКИ",
    ai_tone: "НАСТРОЙКА ЛИЧНОСТИ ИИ",
    perf_mode: "ПРОИЗВОДИТЕЛЬНОСТЬ",
    perf_ultra: "ULTRA (БЛЮР + АНИМАЦИИ)",
    perf_lite: "LITE (БЕЗ ЛАГОВ)",
    profile_of: "ПРОФИЛЬ",
    gifts_received: "ПОДАРКИ",
    empty_gifts: "Тут пока пусто 💨",
    sell_gift: "ПРОДАТЬ",
    pin_badge: "В СТАТУС",
    unpin_badge: "СНЯТЬ СТАТУС",
    bubble_style: "СТИЛЬ ПУЗЫРЕЙ",
    rounded_style: "ОКРУГЛЫЕ",
    sharp_style: "ОСТРЫЕ",
    density: "ПЛОТНОСТЬ ЧАТА",
    compact: "КОМПАКТНЫЙ",
    normal_density: "ОБЫЧНЫЙ",
  },
  en: {
    login_title: "Welcome back.",
    reg_title: "Create your account.",
    login_id: "LOGIN (ID)",
    login_pass: "PASSWORD",
    btn_login: "LOGIN",
    btn_reg: "REGISTER",
    no_acc: "No account? Sign up",
    has_acc: "Have an account? Login",
    disp_name: "DISPLAY NAME",
    bio: "ABOUT ME (BIO)",
    photo: "PHOTO",
    search: "SEARCH CHATS...",
    add_friend: "ADD FRIEND",
    settings: "Settings",
    logout: "Logout",
    empty_chats: "Nobody found",
    find_bros: "Find friends",
    today: "Today",
    start_chat: "No messages yet",
    type_msg: "Message...",
    recording: "RECORDING...",
    you: "YOU",
    gift: "GIFT",
    photo_msg: "PHOTO",
    file_msg: "FILE",
    geo_msg: "LOCATION",
    voice_msg: "VOICE",
    sent_gift: "YOU SENT",
    gets_gift: "SENTS",
    transcribe: "TRANSCRIBE",
    hide: "HIDE",
    ai_typing: "PLATINA AI IS TYPING...",
    magic: "TEXT MAGIC",
    formal: "FORMAL",
    friendly: "FRIENDLY",
    slang: "PLATINA STYLE",
    gallery: "GALLERY",
    friend: "FRIEND",
    normal: "NORM",
    bass: "BASS",
    chipmunk: "CHIPMUNK",
    premium_emoji: "💎 PREMIUM EMOJI",
    text_vibe: "⌨️ TEXT VIBE",
    vip_gift: "VIP GIFT 🎁",
    crystals: "Crystals",
    balance: "YOUR BALANCE",
    top_up: "BUY CRYSTALS",
    hit: "BEST SELLER",
    bonus: "BONUS",
    del_chat_title: "DELETE CHAT?",
    del_chat_desc: "All history will be erased forever. NO UNDO.",
    back: "BACK",
    delete: "DELETE",
    new_connect: "NEW CONNECT",
    enter_id: "Enter friend's ID to start chatting.",
    connect_btn: "CONNECT",
    calling: "CALLING...",
    burned: "Message burned",
    reply: "Reply",
    translate: "Translate",
    delete_msg: "Delete",
    edit_msg: "Edit Message",
    generating_image: "PLATINA AI DRAWING...",
    dice: "DICE",
    coin: "COIN",
    clear_history: "Clear History",
    secret_chat: "Secret Chat",
    change_bg: "Change Wallpaper",
    read_aloud: "Read Aloud",
    history_cleared: "History cleared 🧹",
    s_prem: "PLATINA PREMIUM",
    s_wallet: "WALLET",
    s_prof: "PROFILE",
    s_app: "APPEARANCE",
    s_notif: "NOTIFICATIONS",
    s_priv: "PRIVACY",
    s_ai: "PLATINA AI",
    s_lang: "LANGUAGE / ЯЗЫК",
    s_admin: "ADMIN PANEL",
    theme: "GLOBAL THEME",
    accent: "COLOR ACCENT",
    font_size: "CHAT FONT SIZE",
    sounds: "SOUND EFFECTS",
    toasts: "POPUP TOASTS",
    status: "ONLINE STATUS",
    everyone: "EVERYONE",
    contacts_only: "CONTACTS ONLY",
    nobody: "INVISIBLE MODE (PREMIUM)",
    invisible: "INVISIBLE MODE",
    ai_tone: "AI PERSONALITY",
    perf_mode: "PERFORMANCE",
    perf_ultra: "ULTRA (BLUR + ANIMATIONS)",
    perf_lite: "LITE (NO LAGS)",
    profile_of: "PROFILE",
    gifts_received: "GIFTS",
    empty_gifts: "Empty here 💨",
    sell_gift: "SELL",
    pin_badge: "SET AS STATUS",
    unpin_badge: "REMOVE STATUS",
    bubble_style: "BUBBLE STYLE",
    rounded_style: "ROUNDED",
    sharp_style: "SHARP",
    density: "CHAT DENSITY",
    compact: "COMPACT",
    normal_density: "NORMAL",
  },
};

const t = (key, lang = "ru") => DICT[lang]?.[key] || DICT["ru"][key] || key;

// ==========================================
// 🎨 ГЛОБАЛЬНЫЕ НАСТРОЙКИ И ДИЗАЙН-ТОКЕНЫ
// ==========================================
const defaultSettings = {
  username: "",
  bio: "",
  birthday: "",
  theme: "light",
  accent: "sky",
  fontSize: "text-[15px]",
  wallpaper: "dots",
  soundEnabled: true,
  pushEnabled: true,
  isPremium: false,
  balance: 0,
  aiTone: "slang",
  avatar: null,
  lang: "ru",
  bubbleStyle: "rounded",
  bubbleOpacity: 1,
  glassEffect: true,
  animationSpeed: 1,
  messageVolume: 0.5,
  messageDensity: "normal",
  lastSeen: "everyone",
  perfMode: "ultra",
  activeBadge: null,
  officialBadge: null,
  lastOnline: 0,
  customWallpaper: null,
  readingSpeed: 1,
  profileBlur: false,
};

const themesMap = {
  dark: {
    id: "dark",
    name: "Тёмная",
    base: "bg-[#0e1621]",
    panel: "bg-[#17212b]",
    glass: "bg-[#17212b]/90",
    border: "border-[#2b3949]",
    litePanel: "bg-[#17212b]",
    text: "text-white",
    subText: "text-[#7f91a4]",
  },
  light: {
    id: "light",
    name: "Белая",
    base: "bg-[#f1f1f1]",
    panel: "bg-white",
    glass: "bg-white/90",
    border: "border-[#e4e4e4]",
    litePanel: "bg-white",
    text: "text-zinc-800",
    subText: "text-zinc-400",
    bubble: "bg-white shadow-sm border border-zinc-100",
  },
  oled: {
    id: "oled",
    name: "OLED Black",
    base: "bg-black",
    panel: "bg-[#050505]",
    glass: "bg-black/70",
    border: "border-zinc-900",
    litePanel: "bg-black",
    text: "text-zinc-100",
    subText: "text-zinc-600",
  },
  dracula: {
    id: "dracula",
    name: "Дракула",
    base: "bg-[#1e1e2e]",
    panel: "bg-[#11111b]",
    glass: "bg-[#181825]/70",
    border: "border-[#313244]",
    litePanel: "bg-[#181825]",
    text: "text-zinc-100",
    subText: "text-[#6272a4]",
  },
  midnight: {
    id: "midnight",
    name: "Полуночная",
    base: "bg-slate-950",
    panel: "bg-[#020617]",
    glass: "bg-slate-900/70",
    border: "border-slate-800/60",
    litePanel: "bg-slate-900",
    text: "text-slate-100",
    subText: "text-slate-500",
  },
  forest: {
    id: "forest",
    name: "Лесная",
    base: "bg-[#022c22]",
    panel: "bg-[#064e3b]",
    glass: "bg-emerald-900/70",
    border: "border-emerald-900/50",
    litePanel: "bg-emerald-900",
    text: "text-emerald-50",
    subText: "text-emerald-500",
  },
  nord: {
    id: "nord",
    name: "Nord Frost",
    base: "bg-[#2e3440]",
    panel: "bg-[#242933]",
    glass: "bg-[#2e3440]/70",
    border: "border-[#3b4252]",
    litePanel: "bg-[#2e3440]",
    text: "text-[#eceff4]",
    subText: "text-[#4c566a]",
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk",
    base: "bg-[#0a0a0a]",
    panel: "bg-[#1a1a1a]",
    glass: "bg-[#121212]/70",
    border: "border-yellow-500/30",
    litePanel: "bg-[#121212]",
    text: "text-yellow-400",
    subText: "text-yellow-900",
  },
  "rose-pine": {
    id: "rose-pine",
    name: "Rosé Pine",
    base: "bg-[#191724]",
    panel: "bg-[#1f1d2e]",
    glass: "bg-[#191724]/70",
    border: "border-[#26233a]",
    litePanel: "bg-[#191724]",
    text: "text-[#e0def4]",
    subText: "text-[#6e6a86]",
  },
};

const accentMap = {
  zinc: {
    bg: "bg-zinc-200",
    text: "text-zinc-900",
    toggleBg: "bg-zinc-200",
    textActive: "text-white",
  },
  amber: {
    bg: "bg-[#3390ec]",
    text: "text-amber-950",
    toggleBg: "bg-sky-400",
    textActive: "text-[#3390ec]",
  },
  indigo: {
    bg: "bg-indigo-500",
    text: "text-white",
    toggleBg: "bg-indigo-500",
    textActive: "text-indigo-500",
  },
  rose: {
    bg: "bg-rose-500",
    text: "text-white",
    toggleBg: "bg-rose-500",
    textActive: "text-rose-500",
  },
  emerald: {
    bg: "bg-emerald-500",
    text: "text-white",
    toggleBg: "bg-emerald-500",
    textActive: "text-emerald-500",
  },
  violet: {
    bg: "bg-violet-500",
    text: "text-white",
    toggleBg: "bg-violet-500",
    textActive: "text-violet-500",
  },
  sky: {
    bg: "bg-[#5288c1]",
    text: "text-white",
    toggleBg: "bg-[#5288c1]",
    textActive: "text-[#5288c1]",
  },
  orange: {
    bg: "bg-[#5288c1]",
    text: "text-white",
    toggleBg: "bg-[#5288c1]",
    textActive: "text-orange-500",
  },
};

const premiumGifts = [
  {
    id: "rose",
    name: "Вечная Роза",
    icon: "🌹",
    price: 15,
    glow: "rgba(244,63,94,0.4)",
    grad: "from-rose-500/20 to-red-600/20",
    border: "border-rose-500/30",
    text: "text-rose-400",
  },
  {
    id: "bear",
    name: "Плюшевый Мишка",
    icon: "🧸",
    price: 50,
    glow: "rgba(217,119,6,0.4)",
    grad: "from-sky-500/20 to-blue-600/20",
    border: "border-[#3390ec]/30",
    text: "text-sky-400",
  },
  {
    id: "lambo",
    name: "Спорткар",
    icon: "🏎️",
    price: 1500,
    glow: "rgba(16,185,129,0.5)",
    grad: "from-emerald-400/20 to-green-600/20",
    border: "border-emerald-400/40",
    text: "text-emerald-400",
  },
  {
    id: "diamond",
    name: "Бриллиант",
    icon: "💎",
    price: 5000,
    glow: "rgba(56,189,248,0.5)",
    grad: "from-blue-400/20 to-cyan-500/20",
    border: "border-blue-400/40",
    text: "text-blue-400",
  },
  {
    id: "jet",
    name: "Private Jet",
    icon: "✈️",
    price: 10000,
    glow: "rgba(161,161,170,0.5)",
    grad: "from-zinc-300/20 to-zinc-500/20",
    border: "border-zinc-300/40",
    text: "text-zinc-300",
  },
];

// 🔥 ОФИЦИАЛЬНЫЕ ЗНАЧКИ ДЛЯ АДМИНКИ 🔥
const OFFICIAL_BADGES = {
  creator: {
    icon: "👑",
    label: "СОЗДАТЕЛЬ",
    color: "text-sky-400",
    bg: "bg-[#3390ec]/20",
  },
  verified: {
    icon: "☑️",
    label: "ПОДТВЕРЖДЁН",
    color: "text-blue-400",
    bg: "bg-blue-500/20",
  },
  moderator: {
    icon: "🛡️",
    label: "МОДЕРАТОР",
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
  },
  tester: {
    icon: "🧪",
    label: "БЕТА-ТЕСТЕР",
    color: "text-purple-400",
    bg: "bg-purple-500/20",
  },
  og: {
    icon: "🦕",
    label: "ОЛД",
    color: "text-rose-400",
    bg: "bg-rose-500/20",
  },
  sponsor: {
    icon: "💸",
    label: "СПОНСОР",
    color: "text-green-400",
    bg: "bg-green-500/20",
  },
  star: {
    icon: "⭐",
    label: "ПОПУЛЯРНЫЙ",
    color: "text-yellow-400",
    bg: "bg-yellow-400/20",
  },
  ai: {
    icon: "🤖",
    label: "НЕЙРОСЕТЬ",
    color: "text-indigo-400",
    bg: "bg-indigo-500/20",
  },
};

const BadgeDisplay = memo(({ type, className = "" }) => {
  if (!type || !OFFICIAL_BADGES[type]) return null;
  return (
    <span
      title={OFFICIAL_BADGES[type].label}
      className={`inline-flex items-center justify-center ml-1 cursor-help drop-shadow-md ${className}`}
    >
      {OFFICIAL_BADGES[type].icon}
    </span>
  );
});

const customEmojis = {
  smiles: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "☺️",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👿",
    "👹",
    "👺",
    "🤡",
    "💩",
    "👻",
    "💀",
    "☠️",
    "👽",
    "👾",
    "🤖",
    "🎃",
    "😺",
    "😸",
    "😹",
    "😻",
    "😼",
    "😽",
    "🙀",
    "😿",
    "😾",
  ],
  vibe: [
    "🦇",
    "🕷️",
    "🕸️",
    "⛓️",
    "🩸",
    "💊",
    "💸",
    "🖤",
    "🤍",
    "💽",
    "💀",
    "★",
    "†",
    "👁️⃤",
    "🪬",
    "🧿",
    "💮",
    "💠",
    "🧬",
    "🪩",
    "🎛️",
    "⚰️",
    "🥀",
    "🌙",
    "🗡️",
    "🍷",
    "🕯️",
    "🚬",
    "🥀",
    "🖤",
    "🔗",
    "💣",
    "🩹",
    "🪦",
    "🛹",
    "🎸",
    "🎧",
    "🎬",
  ],
  animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐻‍❄️",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐽",
    "🐸",
    "🐵",
    "🙈",
    "🙉",
    "🙊",
    "🐒",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🪱",
    "🐛",
    "🦋",
    "🐌",
    "🐞",
    "🐜",
    "🪰",
    "🪲",
    "🪳",
    "🦟",
    "🦗",
    "🕷️",
    "🕸️",
    "🦂",
    "🐢",
    "🐍",
    "🦎",
    "🦖",
    "🦕",
    "🐙",
    "🦑",
    "🦐",
    "🦞",
    "🦀",
    "🐡",
    "🐠",
    "🐟",
    "🐬",
    "🐳",
    "🐋",
    "🦈",
    "🐊",
    "🐅",
    "🐆",
    "🦓",
    "🦍",
    "🦧",
    "🦣",
    "🐘",
    "🦛",
    "🦏",
    "🐪",
    "🐫",
    "🦒",
    "🦘",
    "🦬",
    "🐃",
    "🐂",
    "🐄",
    "🐎",
    "🐖",
    "🐏",
    "🐑",
    "🦙",
    "🐐",
    "🦌",
    "🐕",
    "🐩",
    "🦮",
    "🐕‍🦺",
    "🐈",
    "🐈‍⬛",
    "🐓",
    "🦃",
    "🦚",
    "🦜",
    "🦢",
    "🦩",
    "🕊️",
    "🐇",
    "🦝",
    "🦨",
    "🦡",
    "🦫",
    "🦦",
    "🦥",
    "🐁",
    "🐀",
    "🐿️",
    "🦔",
    "🐾",
    "🐉",
    "🐲",
    "🌵",
    "🎄",
    "🌲",
    "🌳",
    "🌴",
    "🌱",
    "🌿",
    "☘️",
    "🍀",
    "🎍",
    "🪴",
    "🎋",
    "🍃",
    "🍂",
    "🍁",
    "🍄",
    "🐚",
    "🪨",
    "🌾",
    "💐",
    "🌷",
    "🌹",
    "🥀",
    "🌺",
    "🌸",
    "🌼",
    "🌻",
    "🌞",
    "🌝",
    "🌛",
    "🌜",
    "🌚",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🌑",
    "🌒",
    "🌓",
    "🌔",
    "🌙",
    "🌎",
    "🌍",
    "🌏",
    "🪐",
    "💫",
    "⭐️",
    "🌟",
    "✨",
    "⚡️",
    "☄️",
    "💥",
    "🔥",
    "🌪️",
    "🌈",
    "☀️",
    "🌤️",
    "⛅️",
    "🌥️",
    "☁️",
    "🌦️",
    "🌧️",
    "⛈️",
    "🌩️",
    "❄️",
    "☃️",
    "⛄️",
    "🌬️",
    "💨",
    "💧",
    "💦",
    "☔️",
    "☂️",
    "🌊",
    "🌫️",
  ],
  food: [
    "🍏",
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶️",
    "🫑",
    "🌽",
    "🥕",
    "🫒",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥯",
    "🍞",
    "🥖",
    "🥨",
    "🧀",
    "🥚",
    "🍳",
    "🧈",
    "🥞",
    "🧇",
    "🥓",
    "🥩",
    "🍗",
    "🍖",
    "🦴",
    "🌭",
    "🍔",
    "🍟",
    "🍕",
    "🫓",
    "🥪",
    "🥙",
    "🧆",
    "🌮",
    "🌯",
    "🫔",
    "🥗",
    "🥘",
    "🫕",
    "🥣",
    "🍝",
    "🍜",
    "🍲",
    "🍛",
    "🍣",
    "🍱",
    "🥟",
    "🦪",
    "🍤",
    "🍙",
    "🍚",
    "🍘",
    "🍥",
    "🥠",
    "🥮",
    "🍢",
    "🍡",
    "🍧",
    "🍨",
    "🍦",
    "🥧",
    "🧁",
    "🍰",
    "🎂",
    "🍮",
    "🍭",
    "🍬",
    "🍫",
    "🍿",
    "🍩",
    "🍪",
    "🌰",
    "🥜",
    "🍯",
    "🥛",
    "🍼",
    "☕️",
    "🍵",
    "🧃",
    "🥤",
    "🧋",
    "🍶",
    "🍺",
    "🍻",
    "🥂",
    "🍷",
    "🥃",
    "🍸",
    "🍹",
    "🧉",
    "🧊",
    "🥢",
    "🍽️",
    "🍴",
    "🥄",
    "🔪",
    "🏺",
  ],
  kaomoji: [
    "(ง'̀-'́)ง",
    "▄︻̷̿┻̿═━一",
    "ﮩ٨ـﮩﮩ٨ـ♡ﮩ٨ـ",
    "【=◈︿◈=】",
    "¯\\_(ツ)_/¯",
    "( ͡° ͜ʖ ͡°)",
    "ᕦ(ò_óˇ)ᕤ",
    "ʕ•ᴥ•ʔ",
    "ᕙ(`▽´)ᕗ",
    "t(-_-t)",
    "(づ｡◕‿‿◕｡)づ",
    "(❁´◡`❁)",
    "( ͡🔥 ͜ʖ ͡🔥)",
    "( ͡° ⚠️ ͡°)",
    "ᶘ ᵒᴥᵒᶅ",
  ],
};

const premiumPlans = [
  { id: "1m", name: "1 Месяц", price: "299 ₽", oldPrice: null, badge: "" },
  {
    id: "3m",
    name: "3 Месяца",
    price: "790 ₽",
    oldPrice: "897 ₽",
    badge: "Выгода 10%",
  },
  {
    id: "6m",
    name: "6 Месяцев",
    price: "1490 ₽",
    oldPrice: "1794 ₽",
    badge: "Выгода 15%",
  },
  {
    id: "1y",
    name: "1 Год",
    price: "2490 ₽",
    oldPrice: "3588 ₽",
    badge: "ХИТ",
    isPopular: true,
  },
];

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// ==========================================
// 🤖 НАСТРОЙКИ БОТА И ИИ
// ==========================================
const aiUser = {
  id: "ai",
  name: "Platina AI ✨",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=PlatinaAI",
  status: "всегда на связи",
  isRealUser: false,
  officialBadge: "ai",
};

const initialMessages = {
  ai: [
    {
      id: 1,
      senderId: "ai",
      text: 'Привет! Я ИИ-ассистент твоего мессенджера. Могу помочь с текстом, а если у тебя Premium — могу сгенерировать картинку (просто напиши"Нарисуй киберпанк"). Чем могу помочь?',
      time: "00:00",
      status: "read",
      reactions: ["🔥"],
    },
  ],
};

const callGemini = async (prompt, systemInstruction) => {
  const apiKey = myFirebaseConfig.apiKey;
  if (!apiKey) return "API ключ не настроен 🔑";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      if (res.status === 403) {
        return "Привет! Я ИИ-ассистент. Мой API-ключ временно заблокирован или недействителен. Но я всё равно с тобой на связи! 😉";
      }
      throw new Error(`API Error: ${res.status}`);
    }
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Бро, нейросеть прилегла. Зайди позже. 💿"
    );
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Ошибка ИИ: ${error.message} 🔌`;
  }
};

const callImagen = async (prompt) => {
  const apiKey = myFirebaseConfig.apiKey;
  if (!apiKey) return null;
  // Note: Imagen API structure might vary depending on region/version
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.predictions?.[0])
      return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    return null;
  } catch (e) {
    console.error("Imagen Error:", e);
    return null;
  }
};

// ==========================================
// ⏱️ ОПТИМИЗИРОВАННЫЕ МИКРОКОМПОНЕНТЫ
// ==========================================
const CallTimerDisplay = memo(({ status, lang }) => {
  const [timer, setTimer] = useState(0);
    useEffect(() => {
    let it;
    if (status === "connected")
      it = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(it);
  }, [status]);
  return <>{status === "calling" ? t("calling", lang) : formatTime(timer)}</>;
});

const RecordingTimerDisplay = memo(({ isRecording }) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    let it;
    if (isRecording) {
      setTime(0);
      it = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(it);
  }, [isRecording]);
  return <>{formatTime(time)}</>;
});

const BurnTimer = memo(({ expiresAt, onExpire }) => {
  const [left, setLeft] = useState(() =>
    Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)),
  );
  useEffect(() => {
    if (left <= 0) {
      onExpire();
      return;
    }
    const it = setInterval(() => {
      const l = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setLeft(l);
      if (l <= 0) {
        clearInterval(it);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(it);
  }, [expiresAt, left, onExpire]);
  return <>{left}s</>;
});

const VideoRenderer = memo(({ localStream, remoteStream, facingMode }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  useEffect(() => {
    if (localVideoRef.current && localStream)
      localVideoRef.current.srcObject = localStream;
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      // Force play if needed
      remoteVideoRef.current
        .play()
        .catch((e) => console.error("Video play failed", e));
    }
  }, [localStream, remoteStream]);
  return (
    <>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className={`absolute bottom-32 sm:bottom-40 right-4 sm:right-8 w-24 sm:w-32 h-36 sm:h-48 rounded-2xl shadow-md border-2 border-white/20 object-cover z-20 ${
          facingMode === "user" ? "scale-x-[-1]" : ""
        }`}
      />
    </>
  );
});

const CustomAudioPlayer = memo(({ src, isMe, durationText }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const [waveHeights] = useState(() =>
    Array.from({ length: 24 }, () => 15 + Math.random() * 85),
  );
  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    const updateProgress = () => {
      if (audio.duration)
        setProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [src]);
  const togglePlay = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    isPlaying
      ? audioRef.current.pause()
      : audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };
  const handleSeek = (e) => {
    e.stopPropagation();
    if (!audioRef.current?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audioRef.current.currentTime =
      ((e.clientX - rect.left) / rect.width) * audioRef.current.duration;
  };

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 pr-4 sm:pr-5 rounded-2xl w-full max-w-[220px] sm:max-w-[280px] shadow-lg backdrop-blur-xl transition-all hover:scale-[1.02] ${
        isMe
          ? "bg-black/30 border border-white/10"
          : "bg-[#242f3d]/90 border border-[#2b3949]/50"
      }`}
    >
      <button
        onClick={togglePlay}
        className={`w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-all active:scale-90 hover:scale-105 shadow-md ${
          isMe ? "bg-white text-zinc-950" : "bg-[#3390ec] text-amber-950"
        }`}
      >
        {isPlaying ? (
          <Pause
            fill="currentColor"
            size={18}
            className="sm:w-[20px] sm:h-[20px]"
          />
        ) : (
          <Play
            fill="currentColor"
            size={18}
            className="sm:w-[20px] sm:h-[20px] ml-1"
          />
        )}
      </button>
      <div
        className="flex-1 flex flex-col justify-center h-8 sm:h-10 cursor-pointer relative"
        onClick={handleSeek}
      >
        <div className="flex items-end gap-[2px] h-full w-full opacity-50 mb-1 overflow-hidden">
          {waveHeights.map((h, i) => (
            <div
              key={i}
              className={`w-[2px] sm:w-[4px] rounded-full origin-bottom transition-all duration-300 ${
                isMe ? "bg-white" : "bg-sky-400"
              } ${isPlaying ? "animate-audio-wave" : ""}`}
              style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
        <div className="w-full h-1 sm:h-1.5 bg-black/30 rounded-full overflow-hidden absolute bottom-0 left-0">
          <div
            className={`h-full transition-all duration-100 shadow-md ${
              isMe ? "bg-white" : "bg-[#3390ec]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className="text-[10px] sm:text-[11px] font-medium font-mono text-zinc-400 ml-1 sm:ml-2 flex-shrink-0">
        {durationText}
      </span>
    </div>
  );
});

const Toggle = memo(({ checked, onChange, accent = "zinc" }) => {
  const activeBg = accentMap[accent]?.toggleBg || "bg-zinc-200";
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-12 sm:w-14 h-6 sm:h-7 rounded-full cursor-pointer transition-all duration-300 relative flex-shrink-0 ${
        checked ? activeBg : "bg-[#2b3949] shadow-inner"
      }`}
    >
      <div
        className={`absolute top-[2px] sm:top-[3px] left-[2px] sm:left-[3px] w-5 h-5 rounded-full transition-all duration-500 ease-spring ${
          checked
            ? "translate-x-6 sm:translate-x-7 bg-white"
            : "translate-x-0 bg-[#17212b] shadow-md"
        }`}
      />
    </div>
  );
});

// ==========================================
// 🔑 ЭКРАН ВХОДА И РЕГИСТРАЦИИ (AUTH) + ДЕНЬ РОЖДЕНИЯ
// ==========================================
function AuthScreen({ onLogin, isDeviceReady }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); // Для показа выбранного пресета
  const avatarRef = useRef(null);

  const PRESET_AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
  ];
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const lang = "ru";

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 200;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > MAX_SIZE) {
            h *= MAX_SIZE / w;
            w = MAX_SIZE;
          }
        } else {
          if (h > MAX_SIZE) {
            w *= MAX_SIZE / h;
            h = MAX_SIZE;
          }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        setAvatar(canvas.toDataURL("image/jpeg", 0.8));
        setAvatarPreview(null); // Сбрасываем пресет, если выбрано фото
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) {
      setError("Нет связи с базой данных!");
      return;
    }
    if (username.length < 3 || password.length < 3) {
      setError("Логин и пароль от 3 символов!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const login = username.toLowerCase().trim();
      const ref = getAccRef(login);
      const snap = await getDoc(ref);

      if (mode === "login") {
        if (snap.exists() && snap.data().password === password) {
          if (snap.data().settings?.isBanned && !ADMIN_IDS.includes(login)) {
            setError("Твой аккаунт заблокирован! 🚫");
            setLoading(false);
            return;
          }
          onLogin(login);
        } else {
          setError("Неверный логин или пароль ❌");
        }
      } else {
        if (snap.exists()) {
          setError("Логин уже занят 😢");
        } else {
          const finalName =
            displayName.trim() !== "" ? displayName.trim() : login;
          const finalBio = bio.trim() || "Я в Platina Messenger";
          const finalAvatar =
            avatar ||
            avatarPreview ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${login}`;

          await setDoc(
            ref,
            cleanData({
              password,
              receivedGifts: [],
              messages: { ai: initialMessages["ai"] },
              settings: {
                ...defaultSettings,
                username: finalName,
                bio: finalBio,
                birthday,
                avatar: finalAvatar,
                lastOnline: Date.now(),
              },
              contacts: [aiUser],
            }),
          );
          onLogin(login);
        }
      }
    } catch (e) {
      setError("Ошибка Firebase! Проверьте подключение.");
    }

    setLoading(false);
  };

  if (!isDeviceReady)
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#0e1621] font-sans p-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-[#3390ec] rounded-2xl animate-ping opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
          </div>
        </div>
        <p className="text-[#3390ec] font-medium tracking-[0.4em] animate-pulse text-xs sm:text-sm">
          PLATINA WEB
        </p>
      </div>
    );

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[#0e1621] font-sans p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/10 via-zinc-950 to-zinc-950"></div>
      <div className="relative z-10 w-full max-w-[95%] sm:max-w-md max-h-[95vh] overflow-y-auto custom-scrollbar p-6 sm:p-10 lg:p-12 bg-[#17212b]/40 backdrop-blur-3xl border border-white/10 rounded-2xl sm:rounded-2xl shadow-lg animate-spring-up flex flex-col justify-center">
        <div className="flex flex-col items-center mb-8 sm:mb-10 flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl sm:rounded-2xl flex items-center justify-center shadow-lg mb-4 sm:mb-6 animate-float">
            <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium text-white leading-none">
            Platina<span className="text-[#3390ec]">Web</span>
          </h1>
          <p className="text-zinc-500 text-[9px] sm:text-[10px] mt-2 sm:mt-3 font-medium tracking-[0.2em] sm:tracking-[0.3em] opacity-60 text-center">
            {mode === "login" ? t("login_title", lang) : t("reg_title", lang)}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 flex-shrink-0"
        >
          {mode === "register" && (
            <div className="flex flex-col items-center gap-2 mb-6 animate-fade-in">
              <div
                onClick={() => avatarRef.current?.click()}
                className="relative w-24 h-24 rounded-full bg-black/50 border-[3px] border-[#2b3949] flex items-center justify-center cursor-pointer hover:border-[#3390ec] transition-colors overflow-hidden group shadow-xl"
              >
                {avatar || avatarPreview ? (
                  <img
                    src={avatar || avatarPreview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera
                    size={32}
                    className="text-zinc-600 group-hover:text-[#3390ec] transition-colors"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-medium text-white">
                    {t("photo", lang)}
                  </span>
                </div>
              </div>

              {/* ПРЕСЕТЫ АВАТАРОК */}
              <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar py-2 w-full justify-center">
                {PRESET_AVATARS.map((url, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setAvatarPreview(url);
                      setAvatar(null);
                    }}
                    className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all flex-shrink-0 hover:scale-110 ${avatarPreview === url ? "border-[#3390ec] scale-110 shadow-lg" : "border-[#2b3949] opacity-60"}`}
                  >
                    <img src={url} className="w-full h-full rounded-full" />
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={avatarRef}
                onChange={handleAvatarSelect}
                className="hidden"
              />
              <div className="w-full space-y-4 sm:space-y-5 mt-4">
                <div className="relative group">
                  <UserCircle className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#3390ec] transition-colors w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder={t("disp_name", lang)}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-6 text-white focus:outline-none focus:border-[#3390ec] transition-all font-medium placeholder-zinc-700 text-xs sm:text-sm"
                  />
                </div>
                <div className="relative group">
                  <Info className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#3390ec] transition-colors w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder={t("bio", lang)}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-6 text-white focus:outline-none focus:border-[#3390ec] transition-all font-medium placeholder-zinc-700 text-xs sm:text-sm"
                  />
                </div>
                <div className="relative group">
                  <CalendarDays className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#3390ec] transition-colors w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className={`w-full bg-black/50 border border-white/5 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-6 focus:outline-none focus:border-[#3390ec] transition-all font-medium text-xs sm:text-sm ${
                      birthday ? "text-white" : "text-zinc-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="relative group">
            <User className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#3390ec] transition-colors w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder={t("login_id", lang)}
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
              className="w-full bg-black/50 border border-white/5 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-6 text-white focus:outline-none focus:border-[#3390ec] transition-all font-medium placeholder-zinc-700 text-xs sm:text-sm"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#3390ec] transition-colors w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("login_pass", lang)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/5 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-14 pr-12 text-white focus:outline-none focus:border-[#3390ec] transition-all font-medium placeholder-zinc-700 text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="text-rose-500 text-[10px] sm:text-[11px] font-medium text-center animate-shake bg-rose-500/10 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-rose-500/20 leading-relaxed px-2 sm:px-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 sm:py-4 mt-2 sm:mt-4 bg-[#f1f1f1] hover:bg-white text-zinc-950 font-medium rounded-xl sm:rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center text-sm sm:text-base group overflow-hidden relative"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6" />
            ) : mode === "login" ? (
              t("btn_login", lang)
            ) : (
              t("btn_reg", lang)
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
          className="w-full mt-6 sm:mt-8 text-[9px] sm:text-[10px] text-zinc-500 hover:text-[#3390ec] font-medium tracking-[0.2em] transition-all hover:tracking-[0.3em] flex-shrink-0"
        >
          {mode === "login" ? t("no_acc", lang) : t("has_acc", lang)}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 🚀 ОСНОВНОЕ ПРИЛОЖЕНИЕ (V5.1 - ПРОФИЛИ + ФИКСЫ)
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [currentUserAcc, setCurrentUserAcc] = useState(
    () => localStorage.getItem("platina_user") || null,
  );
  const [isDeviceReady, setIsDeviceReady] = useState(false);

  const [activeChat, setActiveChat] = useState(null);
  const [activeChatProfile, setActiveChatProfile] = useState(null); // 🔥 ЖИВОЙ ПРОФИЛЬ ДЛЯ ЧАТА

  const [messages, setMessages] = useState({});
  const [contacts, setContacts] = useState([aiUser]);
  const [settings, setSettings] = useState(defaultSettings);

  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [adminBroadcastText, setAdminBroadcastText] = useState("");
  const [adminConsoleCmd, setAdminConsoleCmd] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  const [showAddContact, setShowAddContact] = useState(false);
  const [addContactLogin, setAddContactLogin] = useState("");
  const [addContactError, setAddContactError] = useState("");
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  // 🔥 НОВЫЕ СТЕЙТЫ ПРОФИЛЯ
  const [viewingProfile, setViewingProfile] = useState(null);
  const [giftActionMenu, setGiftActionMenu] = useState(null); // { gift, index }

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGiftPicker, setShowGiftPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showRewriteMenu, setShowRewriteMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const [activeReactionMsg, setActiveReactionMsg] = useState(null);
  const [transcribedMessages, setTranscribedMessages] = useState({});
  const [translatedMessages, setTranslatedMessages] = useState({});

  const [isRecording, setIsRecording] = useState(false);
  const [isBurnMode, setIsBurnMode] = useState(false);
  const [voiceEffect, setVoiceEffect] = useState("normal");

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [buyingPackId, setBuyingPackId] = useState(null);
  const [selectedPremiumPlan, setSelectedPremiumPlan] = useState("1y");

  // --- АДМИНКА ---
  const isAdmin = ADMIN_IDS.includes(currentUserAcc);
  const [adminUsersList, setAdminUsersList] = useState([]);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  const adminStats = useMemo(() => {
    if (!adminUsersList.length) return null;

    const giftCounts = {};
    const spenders = {};
    const accents = {};
    let totalMsgs = 0;
    let ru = 0,
      en = 0;
    let dark = 0,
      light = 0;
    let totalGifts = 0;

    adminUsersList.forEach((u) => {
      // Gifts
      u.receivedGifts?.forEach((g) => {
        giftCounts[g.name] = (giftCounts[g.name] || 0) + 1;
        totalGifts++;
      });

      // Messages & Spending
      Object.values(u.messages || {}).forEach((mList) => {
        totalMsgs += mList.length;
        mList.forEach((m) => {
          if (m.senderId === "me" && m.type === "gift") {
            spenders[u.id] = (spenders[u.id] || 0) + (m.gift?.price || 0);
          }
        });
      });

      // Settings
      if (u.settings?.accent)
        accents[u.settings.accent] = (accents[u.settings.accent] || 0) + 1;
      if ((u.settings?.lang || "ru") === "ru") ru++;
      else en++;
      if (u.settings?.theme === "light") light++;
      else dark++;
    });

    const topGift = Object.entries(giftCounts).sort((a, b) => b[1] - a[1])[0];
    const topSpender = Object.entries(spenders).sort((a, b) => b[1] - a[1])[0];
    const topAccents = Object.entries(accents)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    const msgLeaderboard = adminUsersList
      .map((u) => ({
        id: u.id,
        name: u.name,
        count: Object.values(u.messages || {}).flat().length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    const giftLeaderboard = adminUsersList
      .map((u) => ({
        id: u.id,
        name: u.name,
        count: (u.receivedGifts || []).length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      topGift: topGift ? `${topGift[0]} (${topGift[1]})` : "—",
      topSpender: topSpender ? `${topSpender[0]} (${topSpender[1]} 💎)` : "—",
      avgMsgs: Math.round(totalMsgs / adminUsersList.length),
      topAccents,
      langRatio: `RU: ${ru} | EN: ${en}`,
      themeRatio: `🌙 ${dark} | ☀️ ${light}`,
      totalMsgs,
      totalGifts,
      premiumConv: Math.round(
        (adminUsersList.filter((u) => u.settings?.isPremium).length /
          adminUsersList.length) *
          100,
      ),
      msgLeaderboard,
      giftLeaderboard,
    };
  }, [adminUsersList]);

  const fetchAdminUsers = async () => {
    if (!isAdmin) return;
    setIsLoadingAdmin(true);
    try {
      const snap = await getDocs(
        collection(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "platina_accounts",
        ),
      );
      const arr = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data.settings) arr.push({ id: d.id, ...data });
      });
      setAdminUsersList(arr);
    } catch (e) {
      triggerToast("Admin", "Ошибка загрузки базы");
    }
    setIsLoadingAdmin(false);
  };

  useEffect(() => {
    if (activeSettingsTab === "admin" && isAdmin) fetchAdminUsers();
  }, [activeSettingsTab, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const calculateOnline = () => {
      const now = Date.now();
      const count = adminUsersList.filter(
        (u) => u.settings?.lastOnline && now - u.settings.lastOnline < 120000,
      ).length;
      setOnlineCount(count);
    };
    calculateOnline();
    const it = setInterval(calculateOnline, 30000);
    return () => clearInterval(it);
  }, [isAdmin, adminUsersList]);

  const adminAction = async (targetId, action, value) => {
    try {
      if (action === "global_broadcast") {
        setIsBroadcasting(true);
        const text = adminBroadcastText.trim();
        if (!text) return;
        const time = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const broadcastMsg = cleanData({
          id: Date.now(),
          senderId: "ai", // Отправляем как системное от ИИ
          text: `📢 ОБЪЯВЛЕНИЕ: ${text}`,
          time,
          status: "read",
        });

        // Используем batch или Promise.all для ускорения
        const broadcastPromises = adminUsersList.map(async (u) => {
          try {
            const uRef = getAccRef(u.id);
            // Прямое обновление без getDoc, используя Firestore updateDoc with dot notation или замену
            // Но так как нам нужно запушить в массив, придется получить текущие сообщения или использовать arrayUnion
            // В данном приложении сообщения - это объект чатов, используем arrayUnion для безопасного пуша
            await updateDoc(uRef, {
              [`messages.ai`]: arrayUnion(broadcastMsg),
            });
          } catch (err) {
            console.error(`Broadcast failed for ${u.id}:`, err);
          }
        });
        await Promise.all(broadcastPromises);
        setAdminBroadcastText("");
        setIsBroadcasting(false);
        triggerToast("АДМИН", "Рассылка завершена! 🚀");
        return;
      } else if (action === "console_cmd") {
        const cmd = adminConsoleCmd.trim().toLowerCase();
        if (cmd === "clear_all_history") {
          for (const u of adminUsersList) {
            await updateDoc(getAccRef(u.id), { messages: {} });
          }
          triggerToast("CONSOLE", "История всех очищена!");
        } else if (cmd === "ban_all") {
          for (const u of adminUsersList) {
            if (!ADMIN_IDS.includes(u.id))
              await updateDoc(getAccRef(u.id), { "settings.isBanned": true });
          }
          triggerToast("CONSOLE", "Все забанены!");
        } else {
          triggerToast("CONSOLE", "Команда не найдена");
        }
        setAdminConsoleCmd("");
        return;
      }
      const ref = getAccRef(targetId);
      if (action === "give_premium") {
        await updateDoc(ref, { "settings.isPremium": value });
        triggerToast(
          "АДМИН",
          `${targetId} ${value ? "получил VIP" : "лишен VIP"}`,
        );
      } else if (action === "add_balance") {
        const snap = await getDoc(ref);
        const currentBal = snap.data()?.settings?.balance || 0;
        await updateDoc(ref, { "settings.balance": currentBal + value });
        triggerToast("АДМИН", `Баланс ${targetId} пополнен на ${value} 💎`);
      } else if (action === "delete") {
        await deleteDoc(ref);
        triggerToast("АДМИН", `Аккаунт ${targetId} стерт из базы.`);
      } else if (action === "set_badge") {
        await updateDoc(ref, { "settings.officialBadge": value || null });
        triggerToast("АДМИН", `Значок обновлен для ${targetId}`);
      } else if (action === "clear_history") {
        await updateDoc(ref, { messages: {} });
        triggerToast("АДМИН", `История сообщений ${targetId} очищена.`);
      } else if (action === "toggle_ban") {
        await updateDoc(ref, { "settings.isBanned": value });
        triggerToast(
          "АДМИН",
          `Юзер ${targetId} ${value ? "ЗАБАНЕН 🚫" : "РАЗБАНЕН ✅"}`,
        );
      }
      fetchAdminUsers();
    } catch (e) {
      triggerToast("Ошибка АДМИН", e.message);
    }
  };

  // --- ЗВОНКИ (WebRTC) ---
  const [callState, setCallState] = useState(null);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isCallVideoOff, setIsCallVideoOff] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [remoteStream, setRemoteStream] = useState(null);

  const remoteAudioRef = useRef(null); // 🔥 Фикс звука

  useEffect(() => {
    if (remoteAudioRef.current && remoteStream && callState?.type === "audio") {
      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current.volume = 1;
      const playPromise = remoteAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.error("Audio play failed", e));
      }
    }
  }, [remoteStream, callState]);

  const pcRef = useRef(null);
  const callStreamRef = useRef(null);
  const callDocUnsubRef = useRef(null);
  const currentCallRoomIdRef = useRef(null);
  const addedCandsRef = useRef(new Set());
  const iceCandidatesQueueRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordStartTimeRef = useRef(0);
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const profileAvatarRef = useRef(null);
  const [now, setNow] = useState(Date.now());

  const lang = settings.lang || "ru";
  const getText = (key) => t(key, lang);
  const isLite = settings.perfMode === "lite" && settings.theme !== "light";

  const handleLogin = (login) => {
    localStorage.setItem("platina_user", login);
    setCurrentUserAcc(login);
  };
  const handleLogout = () => {
    localStorage.removeItem("platina_user");
    setCurrentUserAcc(null);
    setActiveChat(null);
    setMessages({});
    setContacts([aiUser]);
    setSettings(defaultSettings);
    setIsMainMenuOpen(false);
  };

  useEffect(() => {
    if (!auth) {
      setIsDeviceReady(true);
      return;
    }
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== "undefined" && __initial_auth_token)
          await signInWithCustomToken(auth, __initial_auth_token);
        else await signInAnonymously(auth);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsDeviceReady(true);
      }
    };
    initAuth();
    const unsub = onAuthStateChanged(auth, setUser);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      unsub();
      clearInterval(tick);
    };
  }, []);

  // 🔥 ОБНОВЛЕНИЕ ОНЛАЙН СТАТУСА 🔥
  useEffect(() => {
    if (!currentUserAcc || !db || !user) return;

    // Пингуем базу каждую минуту, чтобы показать, что мы онлайн
    const updateOnlineStatus = () => {
      updateDoc(getAccRef(currentUserAcc), {
        "settings.lastOnline": Date.now(),
      }).catch(() => {});
    };
    updateOnlineStatus();
    const onlineInterval = setInterval(updateOnlineStatus, 60000);

    const ref = getAccRef(currentUserAcc);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.messages) setMessages(data.messages);
        if (data.contacts) setContacts(data.contacts);
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
          if (data.settings?.isBanned && !ADMIN_IDS.includes(currentUserAcc)) {
            handleLogout();
            triggerToast("ОЙ", "Твой аккаунт заблокирован! 🚫");
            return;
          }
          if (data.settings.incomingCall && !callState) {
            if (
              !incomingCallData ||
              incomingCallData.roomId !== data.settings.incomingCall.roomId
            ) {
              setIncomingCallData(data.settings.incomingCall);
              // playNotificationSound() disabled;
            }
          } else if (!data.settings.incomingCall && incomingCallData) {
            setIncomingCallData(null);
          }
        }
      }
    });
    return () => {
      unsubscribe();
      clearInterval(onlineInterval);
    };
  }, [currentUserAcc, user, callState, incomingCallData]);

  // 🔥 ПОДТЯГИВАЕМ ЖИВОЙ ПРОФИЛЬ ДЛЯ АКТИВНОГО ЧАТА (ЧТОБЫ ВИДЕТЬ ЗНАЧКИ И СТАТУС) 🔥
  useEffect(() => {
    if (!activeChat) {
      setActiveChatProfile(null);
      return;
    }
    // Сразу ставим базовую инфу из списка контактов, чтобы не было задержки
    setActiveChatProfile(activeChat);

    if (activeChat?.id === "ai") {
      setActiveChatProfile(aiUser);
      return;
    }

    const unsub = onSnapshot(getAccRef(activeChat?.id), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setActiveChatProfile({ id: activeChat?.id, ...d.settings });
      }
    });
    return () => unsub();
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: isLite ? "auto" : "smooth",
    });
  }, [messages, activeChat, isAiTyping, isGeneratingImage, replyingTo, isLite]);

  const triggerToast = (title, message) => {
    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      { id, title: String(title), message: String(message) },
    ]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  };

  const playNotificationSound = () => {
    if (!settings.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const vol = settings.messageVolume || 0.5;
      const playNote = (freq, start, type = "sine", dur = 0.5) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.15 * vol, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.start(start);
        osc.stop(start + dur + 0.1);
      };
      playNote(659.25, ctx.currentTime);
      playNote(880.0, ctx.currentTime + 0.12, "triangle", 0.6);
    } catch (e) {}
  };

  const saveToCloud = async (updates) => {
    if (!currentUserAcc || !db) return;
    try {
      await updateDoc(getAccRef(currentUserAcc), cleanData(updates));
    } catch (e) {
      console.error(e);
    }
  };
  const updateSettingField = (key, val) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    saveToCloud({ settings: next });
  };

  // 🔥 ЗАГРУЗКА КРАСИВОГО ПРОФИЛЯ С ПОДАРКАМИ И ЗНАЧКАМИ
  const loadProfile = async (targetId) => {
    if (targetId === "ai") {
      setViewingProfile({
        id: "ai",
        username: "Platina AI ✨",
        bio: "Я нейросеть твоего мессенджера. Рисую арты, перевожу тексты, общаюсь на сленге.",
        avatar: aiUser.avatar,
        receivedGifts: [],
        isPremium: true,
        birthday: "01.01.2024",
        activeBadge: null,
        officialBadge: "ai",
      });
      return;
    }
    try {
      const snap = await getDoc(getAccRef(targetId));
      if (snap.exists()) {
        const d = snap.data();
        setViewingProfile({
          id: targetId,
          ...d.settings,
          receivedGifts: d.receivedGifts || [],
        });
      }
    } catch (e) {
      triggerToast("Ошибка", "Не удалось загрузить профиль");
    }
  };

  const handleSellGift = async () => {
    if (!giftActionMenu) return;
    const { gift, index } = giftActionMenu;
    const updatedGifts = [...(viewingProfile.receivedGifts || [])];
    updatedGifts.splice(index, 1);
    const sellPrice = Math.floor(gift.price * 0.5) || 1; // Возвращаем 50%
    const newBalance = settings.balance + sellPrice;

    setSettings((s) => ({ ...s, balance: newBalance }));
    setViewingProfile((p) => ({ ...p, receivedGifts: updatedGifts }));
    setGiftActionMenu(null);
    triggerToast("КРИСТАЛЛЫ", `Подарок продан! +${sellPrice} 💎`);

    await updateDoc(getAccRef(currentUserAcc), {
      receivedGifts: updatedGifts,
      "settings.balance": newBalance,
    });
  };

  const handlePinGiftBadge = async () => {
    if (!giftActionMenu) return;
    const { gift } = giftActionMenu;
    updateSettingField("activeBadge", gift.icon);
    setViewingProfile((p) => ({ ...p, activeBadge: gift.icon }));
    setGiftActionMenu(null);
    triggerToast("СТАТУС", `Значок ${gift.icon} установлен!`);
  };

  // ==========================================
  // ✉️ ОТПРАВКА СООБЩЕНИЙ + ПОДАРКИ В БАЗУ
  // ==========================================
  const handleSendMessage = async (payloadOverride = null) => {
    if (!inputText.trim() && !payloadOverride) return;
    if (!activeChat || !currentUserAcc) return;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (editingMsg && !payloadOverride) {
      const updatedChat = (messages?.[activeChat?.id] || []).map((m) =>
        m.id === editingMsg.id
          ? { ...m, text: inputText.trim(), isEdited: true }
          : m,
      );
      const myNextMsgs = { ...messages, [activeChat?.id]: updatedChat };
      setMessages(myNextMsgs);
      setEditingMsg(null);
      setInputText("");
      await saveToCloud({ messages: myNextMsgs });
      if (activeChat?.id !== "ai") {
        try {
          const fRef = getAccRef(activeChat?.id);
          const fSnap = await getDoc(fRef);
          if (fSnap.exists()) {
            const fMsgs = fSnap.data().messages || {};
            if (fMsgs[currentUserAcc]) {
              fMsgs[currentUserAcc] = fMsgs[currentUserAcc].map((m) =>
                m.id === editingMsg.id
                  ? { ...m, text: inputText.trim(), isEdited: true }
                  : m,
              );
              await updateDoc(fRef, cleanData({ messages: fMsgs }));
            }
          }
        } catch (e) {}
      }
      return;
    }

    const basePayload = payloadOverride || { text: inputText.trim() };
    const myMsg = cleanData({
      id: Date.now(),
      senderId: "me",
      time,
      text: basePayload.text || null,
      type: basePayload.type || null,
      url: basePayload.url || null,
      fileName: basePayload.fileName || null,
      fileSize: basePayload.fileSize || null,
      lat: basePayload.lat || null,
      lon: basePayload.lon || null,
      gift: basePayload.gift || null,
      isVoice: basePayload.isVoice || false,
      audioData: basePayload.audioData || null,
      durationText: basePayload.durationText || null,
      voiceEffect: basePayload.voiceEffect || null,
      expiresAt:
        isBurnMode && basePayload.type !== "gift" ? Date.now() + 10000 : null,
      replyTo: replyingTo
        ? {
            text: String(replyingTo.text || "Вложение"),
            senderId: replyingTo.senderId,
            type: replyingTo.type || null,
          }
        : null,
      status: "sent",
      reactions: [],
    });

    const myNextMsgs = {
      ...messages,
      [activeChat?.id]: [...(messages?.[activeChat?.id] || []), myMsg],
    };
    setMessages(myNextMsgs);
    setInputText("");
    setReplyingTo(null);
    setIsBurnMode(false);
    // playNotificationSound() disabled;
    await saveToCloud({ messages: myNextMsgs });

    if (activeChat?.id === "ai") {
      const txt = String(myMsg.text || "").toLowerCase();
      if (txt.startsWith("нарисуй") || txt.startsWith("draw")) {
        if (!settings.isPremium) {
          triggerToast("Premium", "Рисование только для VIP 💎");
          return;
        }
        setIsGeneratingImage(true);
        const promptText = myMsg.text.replace(/нарисуй|draw/i, "").trim();
        const b64 = await callImagen(
          `High quality, highly detailed, professional digital art, masterpiece: ${promptText}`,
        );
        setIsGeneratingImage(false);
        if (b64) {
          const aiImg = {
            id: Date.now() + 1,
            senderId: "ai",
            type: "image",
            url: b64,
            time,
            status: "read",
          };
          const withAi = {
            ...myNextMsgs,
            ai: [...(myNextMsgs.ai || []), aiImg],
          };
          setMessages(withAi);
          await saveToCloud({ messages: withAi });
          // playNotificationSound() disabled;
        } else {
          triggerToast("Platina AI", "Сервера художников перегружены 🎨");
        }
      } else if (myMsg.text && !myMsg.isVoice && !myMsg.type) {
        setIsAiTyping(true);
        const tone =
          settings.aiTone === "formal"
            ? "Официально, строго."
            : "Современно, сленг.";
        const resp = await callGemini(
          myMsg.text,
          `Ты Platina AI. Стиль: ${tone}. Язык: ${lang}. Кратко.`,
        );
        const aiMsg = {
          id: Date.now() + 1,
          senderId: "ai",
          text: resp,
          time,
          status: "read",
        };
        const withAi = { ...myNextMsgs, ai: [...(myNextMsgs.ai || []), aiMsg] };
        setMessages(withAi);
        await saveToCloud({ messages: withAi });
        // playNotificationSound() disabled;
        setIsAiTyping(false);
      } else {
        setIsAiTyping(true);
        setTimeout(async () => {
          let aiText = "Сообщение получено! Выглядит отлично. 😎";
          if (myMsg.type === "geo") aiText = "Локация получена. 📍";
          if (myMsg.isVoice) aiText = "Голосовое сообщение получено. 🎧";
          if (myMsg.type === "gift") aiText = "Спасибо за подарок! 🎁";
          if (myMsg.type === "image") aiText = "Отличное фото! Сохранил. 📸";
          if (myMsg.type === "file") aiText = `Файл принят. 📄`;
          const aiMsg = {
            id: Date.now() + 1,
            senderId: "ai",
            text: aiText,
            time,
            status: "read",
          };
          const withAi = {
            ...myNextMsgs,
            ai: [...(myNextMsgs.ai || []), aiMsg],
          };
          setMessages(withAi);
          await saveToCloud({ messages: withAi });
          // playNotificationSound() disabled;
          setIsAiTyping(false);
        }, 2000);
      }
    } else {
      try {
        const friendRef = getAccRef(activeChat?.id);
        const friendSnap = await getDoc(friendRef);
        if (friendSnap.exists()) {
          const fData = friendSnap.data();
          const fMsgs = fData.messages || {};
          const fContacts = fData.contacts || [aiUser];
          const meIndex = fContacts.findIndex((c) => c.id === currentUserAcc);
          const myContactData = {
            id: currentUserAcc,
            name: settings.username || currentUserAcc,
            avatar:
              settings.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserAcc}`,
            isRealUser: true,
            isPremium: settings.isPremium,
            activeBadge: settings.activeBadge || null,
            officialBadge: settings.officialBadge || null,
          };
          if (meIndex === -1) {
            fContacts.push(myContactData);
          } else {
            fContacts[meIndex] = { ...fContacts[meIndex], ...myContactData };
          }
          const friendMsg = {
            ...myMsg,
            senderId: currentUserAcc,
            status: "unread",
          };
          fMsgs[currentUserAcc] = [...(fMsgs[currentUserAcc] || []), friendMsg];

          let updates = { messages: fMsgs, contacts: fContacts };

          // 🔥 ЕСЛИ ЭТО ПОДАРОК - ДОБАВЛЯЕМ В ПРОФИЛЬ ДРУГУ
          if (basePayload.type === "gift") {
            const currentGifts = fData.receivedGifts || [];
            updates.receivedGifts = [
              ...currentGifts,
              {
                ...basePayload.gift,
                from: currentUserAcc,
                fromName: settings.username || currentUserAcc,
                timestamp: Date.now(),
              },
            ];
          }
          await updateDoc(friendRef, cleanData(updates));
        }
      } catch (e) {
        triggerToast("Ошибка", "Сообщение не доставлено");
      }
    }
  };

  const STUN_SERVERS = {
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
      { urls: "stun:stun.services.mozilla.com" },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const startCall = async (type) => {
    if (!db || !appId) {
      triggerToast("Ошибка", "Нет связи с сервером");
      return;
    }
    if (!activeChat || activeChat?.id === "ai") return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      triggerToast(
        "Звонок",
        "Ваш браузер не поддерживает звонки или нет HTTPS",
      );
      return;
    }
    const roomId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    currentCallRoomIdRef.current = roomId;
    setCallState({
      type,
      status: "calling",
      peer: activeChatProfile || activeChat,
    });
    setIsCallMuted(false);
    setIsCallVideoOff(false);
    setRemoteStream(null);
    addedCandsRef.current.clear();
    iceCandidatesQueueRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video:
          type === "video"
            ? {
                facingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
              }
            : false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
      });
      callStreamRef.current = stream;
      pcRef.current = new RTCPeerConnection(STUN_SERVERS);

      stream
        .getTracks()
        .forEach((track) => pcRef.current.addTrack(track, stream));

      pcRef.current.ontrack = (event) => {
        const stream = (event.streams && event.streams[0]) || new MediaStream([event.track]);
        setRemoteStream((prev) => {
          if (prev && prev.id === stream.id) return prev;
          if (prev && prev.getTracks().length > 0) {
             prev.addTrack(event.track);
             return new MediaStream(prev.getTracks());
          }
          return stream;
        });
      };

      const roomRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "platina_calls",
        roomId,
      );

      pcRef.current.onicecandidate = async (event) => {
        if (event.candidate) {
          const candId =
            "cand_" + Date.now() + Math.random().toString(36).substr(2, 5);
          await updateDoc(roomRef, {
            [`callerCandidates.${candId}`]: event.candidate.toJSON()
          }).catch(() => {});
        }
      };

      const offer = await pcRef.current.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: type === "video" });
      await pcRef.current.setLocalDescription(offer);

      await setDoc(roomRef, {
        callerId: currentUserAcc,
        calleeId: activeChat?.id,
        type,
        offer: { type: offer.type, sdp: offer.sdp },
        callerCandidates: {},
        calleeCandidates: {},
        status: "ringing",
      });

      const peerRef = getAccRef(activeChat?.id);
      await updateDoc(peerRef, {
        "settings.incomingCall": { roomId, callerId: currentUserAcc, type },
      });

      callDocUnsubRef.current = onSnapshot(roomRef, async (snap) => {
        const data = snap.data();
        if (!data) return;
        if (data.status === "rejected") {
          endCall(false);
          triggerToast("Звонок", "Абонент сбросил вызов");
          return;
        }
        if (data.status === "ended") {
          endCall(false);
          triggerToast("Звонок", "Звонок завершен");
          return;
        }

        if (!pcRef.current.currentRemoteDescription && data.answer) {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
          setCallState((prev) =>
            prev ? { ...prev, status: "connected" } : null,
          );

          for (const { id, cand } of iceCandidatesQueueRef.current) {
            if (!addedCandsRef.current.has(id)) {
              addedCandsRef.current.add(id);
              await pcRef.current
                .addIceCandidate(new RTCIceCandidate(cand))
                .catch(() => {});
            }
          }
          iceCandidatesQueueRef.current = [];
        }

        if (data.calleeCandidates) {
          Object.entries(data.calleeCandidates).forEach(async ([id, cand]) => {
            if (addedCandsRef.current.has(id)) return;
            if (pcRef.current && pcRef.current.currentRemoteDescription) {
              addedCandsRef.current.add(id);
              await pcRef.current
                .addIceCandidate(new RTCIceCandidate(cand))
                .catch(() => {});
            } else {
              iceCandidatesQueueRef.current.push({ id, cand });
            }
          });
        }
      });
    } catch (e) {
      console.error(e);
      triggerToast(
        "Ошибка",
        `Не удалось начать звонок: ${e.name === "NotAllowedError" ? "Доступ запрещен" : e.message}`,
      );
      endCall(false);
    }
  };
  const answerCall = async () => {
    if (!incomingCallData) return;
    const { roomId, callerId, type } = incomingCallData;
    const callerUser = contacts.find((c) => c.id === callerId) || {
      id: callerId,
      name: callerId,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${callerId}`,
    };
    currentCallRoomIdRef.current = roomId;
    setCallState({ type, status: "connecting", peer: callerUser });
    setIncomingCallData(null);
    setIsCallMuted(false);
    setIsCallVideoOff(false);
    setRemoteStream(null);
    addedCandsRef.current.clear();
    iceCandidatesQueueRef.current = [];

    updateDoc(getAccRef(currentUserAcc), {
      "settings.incomingCall": null,
    }).catch(() => {});

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Браузер не поддерживает звонки");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video:
          type === "video"
            ? {
                facingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
              }
            : false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
      });
      callStreamRef.current = stream;
      pcRef.current = new RTCPeerConnection(STUN_SERVERS);

      stream
        .getTracks()
        .forEach((track) => pcRef.current.addTrack(track, stream));

      pcRef.current.ontrack = (event) => {
        const stream = (event.streams && event.streams[0]) || new MediaStream([event.track]);
        setRemoteStream((prev) => {
          if (prev && prev.id === stream.id) return prev;
          if (prev && prev.getTracks().length > 0) {
             prev.addTrack(event.track);
             return new MediaStream(prev.getTracks());
          }
          return stream;
        });
      };

      const roomRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "platina_calls",
        roomId,
      );
      const roomSnap = await getDoc(roomRef);
      if (!roomSnap.exists()) {
        endCall(false);
        return;
      }
      const roomData = roomSnap.data();

      pcRef.current.onicecandidate = async (event) => {
        if (event.candidate) {
          const candId =
            "cand_" + Date.now() + Math.random().toString(36).substr(2, 5);
          await updateDoc(roomRef, {
            [`calleeCandidates.${candId}`]: event.candidate.toJSON()
          }).catch(() => {});
        }
      };

      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(roomData.offer),
      );
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      await updateDoc(roomRef, {
        answer: { type: answer.type, sdp: answer.sdp },
        status: "connected",
      });

      setCallState({ type, status: "connected", peer: callerUser });

      for (const { id, cand } of iceCandidatesQueueRef.current) {
        if (!addedCandsRef.current.has(id)) {
          addedCandsRef.current.add(id);
          await pcRef.current
            .addIceCandidate(new RTCIceCandidate(cand))
            .catch(() => {});
        }
      }
      iceCandidatesQueueRef.current = [];

      callDocUnsubRef.current = onSnapshot(roomRef, async (snap) => {
        const data = snap.data();
        if (!data) return;
        if (data.status === "ended") {
          endCall(false);
          triggerToast("Звонок", "Завершен");
          return;
        }

        if (data.callerCandidates) {
          Object.entries(data.callerCandidates).forEach(async ([id, cand]) => {
            if (addedCandsRef.current.has(id)) return;
            if (pcRef.current && pcRef.current.currentRemoteDescription) {
              addedCandsRef.current.add(id);
              await pcRef.current
                .addIceCandidate(new RTCIceCandidate(cand))
                .catch(() => {});
            } else {
              iceCandidatesQueueRef.current.push({ id, cand });
            }
          });
        }
      });
    } catch (e) {
      console.error(e);
      triggerToast("Ошибка", `Не удалось ответить: ${e.message}`);
      rejectCall();
    }
  };
  const rejectCall = () => {
    if (incomingCallData) {
      const roomRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "platina_calls",
        incomingCallData.roomId,
      );
      updateDoc(roomRef, { status: "rejected" }).catch(() => {});
      updateDoc(getAccRef(currentUserAcc), {
        "settings.incomingCall": null,
      }).catch(() => {});
      setIncomingCallData(null);
    }
  };
  const endCall = (updateFirebase = true) => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (callStreamRef.current) {
      callStreamRef.current.getTracks().forEach((t) => t.stop());
      callStreamRef.current = null;
    }
    if (callDocUnsubRef.current) {
      callDocUnsubRef.current();
      callDocUnsubRef.current = null;
    }
    if (updateFirebase && currentCallRoomIdRef.current) {
      const roomRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "platina_calls",
        currentCallRoomIdRef.current,
      );
      updateDoc(roomRef, { status: "ended" }).catch(() => {});
      if (callState?.peer)
        updateDoc(getAccRef(callState.peer.id), {
          "settings.incomingCall": null,
        }).catch(() => {});
      updateDoc(getAccRef(currentUserAcc), {
        "settings.incomingCall": null,
      }).catch(() => {});
    }
    currentCallRoomIdRef.current = null;
    setCallState(null);
    setRemoteStream(null);
    setIncomingCallData(null);
    addedCandsRef.current.clear();
  };
  const toggleCallMute = () => {
    if (callStreamRef.current) {
      callStreamRef.current
        .getAudioTracks()
        .forEach((t) => (t.enabled = !t.enabled));
      setIsCallMuted(!isCallMuted);
    }
  };
  const toggleCallVideo = () => {
    if (callStreamRef.current) {
      callStreamRef.current
        .getVideoTracks()
        .forEach((t) => (t.enabled = !t.enabled));
      setIsCallVideoOff(!isCallVideoOff);
    }
  };
  const toggleCameraFlip = async () => {
    if (!callStreamRef.current) return;
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    callStreamRef.current.getVideoTracks().forEach((t) => t.stop());
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode },
        audio: !isCallMuted,
      });
      const newTrack = newStream.getVideoTracks()[0];
      const oldTrack = callStreamRef.current.getVideoTracks()[0];
      if (oldTrack) callStreamRef.current.removeTrack(oldTrack);
      callStreamRef.current.addTrack(newTrack);
    } catch (e) {}
  };

  // 🔥 ФИКС ЗВУКА ДЛЯ ГОЛОСОВЫХ 🔥
  const toggleRecording = async () => {
    if (isRecording) {
      if (!mediaRecorderRef.current) return;
      mediaRecorderRef.current.onstop = () => {
        // ПЕРЕДАЕМ ПРАВИЛЬНЫЙ MIME-ТИП, ЧТОБЫ БРАУЗЕР МОГ ЕГО РАСПОЗНАТЬ
        const blob = new Blob(audioChunksRef.current, {
          type: mediaRecorderRef.current.mimeType || "audio/webm",
        });
        if (blob.size === 0) return;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          let effectTag = "";
          if (voiceEffect === "bass") effectTag = ` [${getText("bass")}]`;
          if (voiceEffect === "chipmunk")
            effectTag = ` [${getText("chipmunk")}]`;
          const durationSec =
            Math.floor((Date.now() - recordStartTimeRef.current) / 1000) || 1;
          handleSendMessage({
            isVoice: true,
            audioData: reader.result,
            durationText: formatTime(durationSec),
            text: `${getText("voice_msg")}${effectTag}`,
            voiceEffect: voiceEffect,
          });
          setVoiceEffect("normal");
        };
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }
      };
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = s;
        const mr = new MediaRecorder(s);
        mediaRecorderRef.current = mr;
        audioChunksRef.current = [];
        mr.ondataavailable = (e) =>
          e.data.size > 0 && audioChunksRef.current.push(e.data);
        recordStartTimeRef.current = Date.now();
        mr.start();
        setIsRecording(true);
      } catch (e) {
        triggerToast("Ошибка", "Доступ к микрофону закрыт! 🎙️");
      }
    }
  };

  // --- ВЛОЖЕНИЯ ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      handleSendMessage({ type: "image", url: ev.target.result });
    reader.readAsDataURL(file);
    setShowAttachmentMenu(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const sizeStr =
      file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + "MB"
        : (file.size / 1024).toFixed(1) + "KB";
    handleSendMessage({ type: "file", fileName: file.name, fileSize: sizeStr });
    setShowAttachmentMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleGeoLocation = () => {
    setShowAttachmentMenu(false);
    if (!navigator.geolocation) {
      handleSendMessage({ type: "geo", lat: 55.7558, lon: 37.6173 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) =>
        handleSendMessage({
          type: "geo",
          lat: p.coords.latitude,
          lon: p.coords.longitude,
        }),
      (e) => handleSendMessage({ type: "geo", lat: 55.7558, lon: 37.6173 }),
      { timeout: 5000 },
    );
  };
  const sendMiniGame = (type) => {
    setShowAttachmentMenu(false);
    if (type === "dice") {
      const roll = Math.floor(Math.random() * 6) + 1;
      handleSendMessage({ text: `${getText("dice")} 🎲... Выпало: ${roll}` });
    } else if (type === "coin") {
      const flip = Math.random() > 0.5 ? "Орёл" : "Решка";
      handleSendMessage({ text: `${getText("coin")} 🪙... Выпало: ${flip}` });
    }
  };
  const handleSendGift = (gift) => {
    if (settings.balance < gift.price) {
      triggerToast(getText("s_wallet"), "Недостаточно Кристаллов! 💎");
      return;
    }
    updateSettingField("balance", settings.balance - gift.price);
    setShowGiftPicker(false);
    handleSendMessage({ type: "gift", gift: gift });
  };

  // --- УТИЛИТЫ ---
  const handleRewrite = async (style) => {
    if (!inputText.trim()) return;
    setIsRewriting(true);
    setShowRewriteMenu(false);
    const prompts = {
      formal: `Перепиши официально:"${inputText}"`,
      friendly: `Перепиши дружелюбно:"${inputText}"`,
      slang: `Перепиши рэперским сленгом:"${inputText}"`,
    };
    const result = await callGemini(
      prompts[style],
      `Ты ИИ-редактор. Язык: ${lang}. Только готовый текст.`,
    );
    setInputText(result.trim());
    setIsRewriting(false);
  };
  const handleTranscribe = (msgId) => {
    if (!settings.isPremium) {
      triggerToast("Premium", "Только с Premium 💎");
      setShowSettings(true);
      setActiveSettingsTab("premium");
      return;
    }
    setTranscribedMessages((prev) => ({
      ...prev,
      [msgId]: "Распознавание...",
    }));
    setTimeout(() => {
      setTranscribedMessages((prev) => ({
        ...prev,
        [msgId]: 'Текстовая расшифровка:"Всё супер, бро, давай на связи! 🤙"',
      }));
    }, 2000);
  };
  const handleAddReaction = async (msgId, emoji, isPremiumEmoji = false) => {
    if (isPremiumEmoji && !settings.isPremium) {
      triggerToast("Premium", "Только с Premium 💎");
      return;
    }
    setMessages((prev) => {
      const chatMsgs = prev[activeChat?.id] || [];
      const updatedMsgs = chatMsgs.map((msg) => {
        if (msg.id === msgId && !(msg.reactions || []).includes(emoji))
          return { ...msg, reactions: [...(msg.reactions || []), emoji] };
        return msg;
      });
      const next = { ...prev, [activeChat?.id]: updatedMsgs };
      saveToCloud({ messages: next });
      return next;
    });
    setActiveReactionMsg(null);
    if (activeChat?.id !== "ai") {
      try {
        const fRef = getAccRef(activeChat?.id);
        const fSnap = await getDoc(fRef);
        if (fSnap.exists()) {
          const fMsgs = fSnap.data().messages || {};
          if (fMsgs[currentUserAcc]) {
            const msgIdx = fMsgs[currentUserAcc].findIndex(
              (m) => m.id === msgId,
            );
            if (
              msgIdx !== -1 &&
              !(fMsgs[currentUserAcc][msgIdx].reactions || []).includes(emoji)
            ) {
              fMsgs[currentUserAcc][msgIdx].reactions = [
                ...(fMsgs[currentUserAcc][msgIdx].reactions || []),
                emoji,
              ];
              await updateDoc(fRef, cleanData({ messages: fMsgs }));
            }
          }
        }
      } catch (e) {}
    }
  };
  const handleClearHistory = async () => {
    if (!activeChat) return;
    setMessages((prev) => {
      const next = { ...prev };
      next[activeChat?.id] = [];
      saveToCloud({ messages: next });
      return next;
    });
    if (activeChat?.id !== "ai") {
      try {
        const fRef = getAccRef(activeChat?.id);
        const fSnap = await getDoc(fRef);
        if (fSnap.exists()) {
          const fMsgs = fSnap.data().messages || {};
          if (fMsgs[currentUserAcc]) {
            fMsgs[currentUserAcc] = [];
            await updateDoc(fRef, cleanData({ messages: fMsgs }));
          }
        }
      } catch (e) {}
    }
    setShowChatMenu(false);
    triggerToast("Platina Messenger", getText("history_cleared"));
  };
  const deleteSingleMessage = async (msgId) => {
    if (!activeChat) return;
    setMessages((prev) => {
      const newChatMsgs = (prev[activeChat?.id] || []).filter(
        (m) => m.id !== msgId,
      );
      const next = { ...prev, [activeChat?.id]: newChatMsgs };
      saveToCloud({ messages: next });
      return next;
    });
    if (activeChat?.id !== "ai") {
      try {
        const fRef = getAccRef(activeChat?.id);
        const fSnap = await getDoc(fRef);
        if (fSnap.exists()) {
          const fMsgs = fSnap.data().messages || {};
          if (fMsgs[currentUserAcc]) {
            fMsgs[currentUserAcc] = fMsgs[currentUserAcc].filter(
              (m) => m.id !== msgId,
            );
            await updateDoc(fRef, cleanData({ messages: fMsgs }));
          }
        }
      } catch (e) {}
    }
    setActiveMessageMenu(null);
  };
  const startEditing = (msg) => {
    setEditingMsg(msg);
    setInputText(msg.text || "");
    setActiveMessageMenu(null);
  };
  const translateMessage = async (msgId, text) => {
    if (!settings.isPremium) {
      triggerToast("Premium", "Только с Premium 💎");
      setActiveMessageMenu(null);
      return;
    }
    setActiveMessageMenu(null);
    setTranslatedMessages((prev) => ({ ...prev, [msgId]: "..." }));
    const result = await callGemini(
      `Переведи на ${
        lang === "ru" ? "русский" : "английский"
      } язык:"${text}". Только перевод.`,
      "",
    );
    setTranslatedMessages((prev) => ({ ...prev, [msgId]: result.trim() }));
  };
  const readAloud = (text) => {
    setActiveMessageMenu(null);
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = lang === "ru" ? "ru-RU" : "en-US";
    u.rate = settings.readingSpeed || 1;
    window.speechSynthesis.speak(u);
  };

  const handleAddContact = async () => {
    if (!addContactLogin.trim()) return;
    const target = addContactLogin.toLowerCase().trim();
    if (target === currentUserAcc) {
      setAddContactError("Это ты сам!");
      return;
    }
    if (contacts.some((c) => c.id === target)) {
      setAddContactError("Уже в списке!");
      return;
    }
    setIsSearchingUser(true);
    try {
      const snap = await getDoc(getAccRef(target));
      if (snap.exists()) {
        const d = snap.data();
        const newC = {
          id: target,
          name: d.settings?.username || target,
          avatar:
            d.settings?.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${target}`,
          isRealUser: true,
          isPremium: d.settings?.isPremium,
          officialBadge: d.settings?.officialBadge || null,
        };
        const next = [...contacts, newC];
        setContacts(next);
        await saveToCloud({ contacts: next });
        setShowAddContact(false);
        setAddContactLogin("");
        triggerToast("Коннект!", `${newC.name} добавлен.`);
      } else {
        setAddContactError("ID не найден");
      }
    } catch (e) {
      setAddContactError("Ошибка сети!");
    }
    setIsSearchingUser(false);
  };
  const handleDeleteChat = async () => {
    if (!chatToDelete) return;
    const idToRemove = chatToDelete.id;
    const newContacts = contacts.filter((c) => c.id !== idToRemove);
    const newMsgs = { ...messages };
    delete newMsgs[idToRemove];
    setContacts(newContacts);
    setMessages(newMsgs);
    if (activeChat?.id === idToRemove) setActiveChat(null);
    setChatToDelete(null);
    await saveToCloud({ contacts: newContacts, messages: newMsgs });
    triggerToast(getText("del_chat_title"), getText("del_chat_desc"));
  };

  const handlePurchasePremium = () => {
    setIsPurchasing(true);
    setTimeout(() => {
      updateSettingField("isPremium", true);
      setIsPurchasing(false);
      triggerToast("Premium", "Подписка оформлена! 💎");
    }, 1500);
  };
  const handleBuyCoins = (packId, amount) => {
    setBuyingPackId(packId);
    setTimeout(() => {
      updateSettingField("balance", settings.balance + amount);
      setBuyingPackId(null);
      triggerToast(getText("s_wallet"), `+${amount} 💎`);
    }, 1500);
  };
  const handleProfileAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 200;
        let w = img.width,
          h = img.height;
        if (w > h) {
          if (w > MAX) {
            h *= MAX / w;
            w = MAX;
          }
        } else {
          if (h > MAX) {
            w *= MAX / h;
            h = MAX;
          }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        updateSettingField("avatar", canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const currentTheme = themesMap[settings.theme] || themesMap.dark;
  const currentAccent = accentMap[settings.accent] || accentMap.zinc;
  const filteredContacts = contacts.filter((c) =>
    String(c.name).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getAccentClasses = (isMe, senderId) => {
    const isLight = settings.theme === "light";
    if (!isMe) {
      if (senderId === "ai") return isLight ? "bg-indigo-50 text-indigo-900 border border-indigo-100" : "bg-indigo-900 text-indigo-100 border border-indigo-500/30";
      return isLight ? "bg-white text-black border border-gray-100" : "bg-[#182533] text-white border border-[#2b3949]/50";
    }
    return isLight ? "bg-[#e3f2fd] text-black border border-blue-100" : "bg-[#2b5278] text-white border border-blue-900/50";
  };
  const getWallpaperStyle = () => {
    if (isLite) return {};
    const lineOpacity = settings.theme === "light" ? "0.1" : "0.04";
    const lineColor = settings.theme === "light" ? "0,0,0" : "255,255,255";
    const line = `rgba(${lineColor},${lineOpacity})`;
    const speed = 60 / (settings.animationSpeed || 1);

    if (settings.wallpaper === "custom" && settings.customWallpaper) {
      return {
        backgroundImage: `url(${settings.customWallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    switch (settings.wallpaper) {
      case "grid":
        return {
          backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          animation: `bgMove ${speed}s linear infinite`,
        };
      case "dots":
        return {
          backgroundImage: `radial-gradient(circle at 50% 50%, ${line} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          animation: `bgMove ${speed}s linear infinite`,
        };
      case "lines":
        return {
          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 10px, ${line} 10px, ${line} 11px)`,
          animation: `bgMove ${speed}s linear infinite`,
        };
      default:
        return {};
    }
  };

  if (!currentUserAcc)
    return <AuthScreen onLogin={handleLogin} isDeviceReady={isDeviceReady} />;

  // 🔥 ПОДГОТОВКА ДАННЫХ ДЛЯ АКТИВНОГО ЧАТА (ЧТОБЫ ВЕЗДЕ БЫЛИ СВЕЖИЕ ДАННЫЕ) 🔥
  const chatUser = activeChatProfile || activeChat;
  const isOnline =
    chatUser?.id === "ai" ||
    (chatUser?.lastOnline && Date.now() - chatUser.lastOnline < 120000);
  const displayStatus =
    chatUser?.id === "ai"
      ? "ВСЕГДА НА СВЯЗИ"
      : chatUser?.lastSeen === "nobody"
        ? getText("invisible")
        : isOnline
          ? "В СЕТИ"
          : "БЫЛ(А) НЕДАВНО";

  // ==========================================
  // 🖥️ РЕНДЕР ИНТЕРФЕЙСА
  // ==========================================
  return (
    <div
      className={`flex h-[100dvh] w-full ${currentTheme.base} ${
        settings.theme === "light" ? "text-zinc-900" : "text-zinc-100"
      } font-sans overflow-hidden selection:bg-[#3390ec]/20 relative`}
    >
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        type="file"
        accept="*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={profileAvatarRef}
        onChange={handleProfileAvatarChange}
        className="hidden"
      />

      {/* --- КАРТОЧКА ПРОФИЛЯ (МОДАЛЬНОЕ ОКНО) --- */}
      {viewingProfile && (
        <div
          className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => {
            setViewingProfile(null);
            setGiftActionMenu(null);
          }}
        >
          <div
            className={`${currentTheme.panel} border ${currentTheme.border} rounded-2xl sm:rounded-2xl w-full max-w-md shadow-lg overflow-hidden relative`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setViewingProfile(null);
                setGiftActionMenu(null);
              }}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8 flex flex-col items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 to-transparent pointer-events-none"></div>
              <div
                className="relative group cursor-pointer"
                onClick={() => window.open(viewingProfile.avatar, "_blank")}
              >
                <img
                  src={viewingProfile.avatar}
                  className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105 ${
                    viewingProfile.isPremium
                      ? "border-4 border-[#3390ec] shadow-md"
                      : "border-4 border-[#2b3949] shadow-lg"
                  } ${viewingProfile.profileBlur ? "blur-xl grayscale" : ""}`}
                />
                {viewingProfile.isPremium && (
                  <div className="absolute -bottom-2 -right-2 bg-[#17212b] rounded-full p-2 z-20 shadow-xl border border-[#3390ec]/30">
                    <Crown size={20} className="text-sky-400 fill-amber-400" />
                  </div>
                )}
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-medium mt-4 sm:mt-6 text-center leading-none flex items-center justify-center gap-1 ${
                  viewingProfile.isPremium
                    ? "text-sky-400 drop-shadow-md"
                    : currentTheme.text
                }`}
              >
                {viewingProfile.username || "Без имени"}
                <BadgeDisplay
                  type={viewingProfile.officialBadge}
                  className="text-3xl"
                />
                {viewingProfile.activeBadge && (
                  <span className="text-3xl animate-bounce-slow drop-shadow-lg ml-1">
                    {viewingProfile.activeBadge}
                  </span>
                )}
              </h2>

              {viewingProfile.officialBadge &&
                OFFICIAL_BADGES[viewingProfile.officialBadge] && (
                  <div
                    className={`mt-2 px-3 py-1 rounded-full text-[10px] font-medium ${
                      OFFICIAL_BADGES[viewingProfile.officialBadge].bg
                    } ${
                      OFFICIAL_BADGES[viewingProfile.officialBadge].color
                    } border border-current/20 shadow-lg flex items-center gap-1.5`}
                  >
                    {OFFICIAL_BADGES[viewingProfile.officialBadge].icon}
                    {""}
                    {OFFICIAL_BADGES[viewingProfile.officialBadge].label}
                  </div>
                )}

              <p className="text-zinc-500 font-mono text-xs mt-2">
                ID: {viewingProfile.id}
              </p>
            </div>

            <div className="px-6 pb-6 sm:px-8 sm:pb-8 space-y-3 sm:space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar relative z-10">
              <div
                className={`${settings.theme === "light" ? "bg-[#f1f1f1]" : "bg-black/50"} p-4 sm:p-5 rounded-2xl sm:rounded-xl border ${currentTheme.border} shadow-inner`}
              >
                <p className="text-[9px] sm:text-[10px] text-zinc-500 font-medium tracking-[0.2em] mb-1 sm:mb-1.5 flex items-center gap-1.5">
                  <Info size={12} /> {getText("bio")}
                </p>
                <p
                  className={`text-sm sm:text-base font-medium ${currentTheme.text} leading-relaxed`}
                >
                  {viewingProfile.bio || "Нет описания"}
                </p>
              </div>

              {viewingProfile.birthday && (
                <div
                  className={`${settings.theme === "light" ? "bg-[#f1f1f1]" : "bg-black/50"} p-4 sm:p-5 rounded-2xl sm:rounded-xl border ${currentTheme.border} shadow-inner flex items-center gap-3 sm:gap-4`}
                >
                  <div className="bg-[#3390ec]/20 p-2 sm:p-3 rounded-xl border border-[#3390ec]/30">
                    <CalendarDays className="text-[#3390ec] sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500 font-medium tracking-[0.2em] mb-0.5">
                      {getText("birthday")}
                    </p>
                    <p
                      className={`text-sm sm:text-base font-medium ${currentTheme.text}`}
                    >
                      {viewingProfile.birthday}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-black/50 p-4 sm:p-5 rounded-2xl sm:rounded-xl border border-white/5 shadow-inner">
                <p className="text-[9px] sm:text-[10px] text-zinc-500 font-medium tracking-[0.2em] mb-3 flex items-center justify-between">
                  <span>
                    <Gift size={12} className="inline mr-1 mb-0.5" />
                    {""}
                    {getText("gifts_received")}
                  </span>
                  {""}
                  <span className="bg-[#242f3d] text-zinc-300 px-2 py-0.5 rounded-md">
                    {viewingProfile.receivedGifts?.length || 0}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {viewingProfile.receivedGifts?.length > 0 ? (
                    viewingProfile.receivedGifts.map((g, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          viewingProfile.id === currentUserAcc &&
                          setGiftActionMenu({ gift: g, index: i })
                        }
                        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${
                          g.grad
                        } border ${
                          g.border
                        } flex flex-col items-center justify-center min-w-[70px] sm:min-w-[80px] transition-transform group relative ${
                          viewingProfile.id === currentUserAcc
                            ? "cursor-pointer hover:scale-110 hover:shadow-md"
                            : ""
                        }`}
                      >
                        <span className="text-3xl sm:text-4xl drop-shadow-xl group-hover:animate-bounce-slow">
                          {g.icon}
                        </span>
                        <div className="absolute -top-2 -right-2 bg-black/80 px-2 py-0.5 rounded-md text-[8px] font-medium text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                          от {g.fromName || g.from}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-zinc-600 font-medium text-center w-full py-4 bg-white/5 rounded-xl border border-dashed border-white/10">
                      {getText("empty_gifts")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* МЕНЮ ДЕЙСТВИЙ С ПОДАРКОМ (Только для себя) */}
            {giftActionMenu && (
              <div
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in"
                onClick={() => setGiftActionMenu(null)}
              >
                <div
                  className="bg-[#17212b] border border-[#3390ec]/30 p-6 rounded-2xl shadow-lg w-full max-w-xs flex flex-col items-center animate-spring-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-6xl mb-4 drop-shadow-lg animate-float">
                    {giftActionMenu.gift.icon}
                  </span>
                  <h3 className="text-white font-medium text-xl mb-1">
                    {giftActionMenu.gift.name}
                  </h3>
                  <p className="text-zinc-400 text-[10px] font-medium mb-6">
                    от{""}
                    {giftActionMenu.gift.fromName || giftActionMenu.gift.from}
                  </p>

                  <div className="w-full space-y-2">
                    <button
                      onClick={handlePinGiftBadge}
                      className="w-full py-3 bg-[#3390ec]/20 hover:bg-[#3390ec] text-[#3390ec] hover:text-black font-medium text-xs rounded-xl transition-all border border-[#3390ec]/30 flex items-center justify-center gap-2"
                    >
                      <UserCircle size={16} /> {getText("pin_badge")}
                    </button>
                    <button
                      onClick={handleSellGift}
                      className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-medium text-xs rounded-xl transition-all border border-cyan-500/20 flex items-center justify-center gap-2"
                    >
                      <Wallet size={16} /> {getText("sell_gift")} (+
                      {Math.floor(giftActionMenu.gift.price * 0.5) || 1}
                      {""}
                      <Gem size={12} />)
                    </button>
                    <button
                      onClick={() => setGiftActionMenu(null)}
                      className="w-full py-3 mt-2 bg-[#242f3d] hover:bg-[#2b3949] text-zinc-300 font-medium text-xs rounded-xl transition-all"
                    >
                      ОТМЕНА
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- ВХОДЯЩИЙ ЗВОНОК (MODAL) --- */}
      {incomingCallData && !callState && (
        <div className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-fade-in p-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 to-transparent pointer-events-none"></div>
          <div className="relative mb-12 animate-bounce-slow">
            <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping shadow-md"></div>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#17212b] border-[4px] border-green-500 relative z-10 flex items-center justify-center shadow-lg">
              {incomingCallData.type === "video" ? (
                <Video className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 animate-pulse" />
              ) : (
                <Phone className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 animate-pulse" />
              )}
            </div>
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium text-white mb-3 text-center drop-shadow-lg">
            Входящий{""}
            {incomingCallData.type === "video" ? "видеозвонок" : "звонок"}
          </h2>
          <p className="text-green-400 font-medium text-lg sm:text-2xl tracking-[0.2em] mb-16 shadow-black drop-shadow-md">
            {incomingCallData.callerId}
          </p>
          <div className="flex items-center gap-10 sm:gap-16 z-10">
            <button
              onClick={rejectCall}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
            >
              <PhoneOff size={32} className="text-white sm:w-10 sm:h-10" />
            </button>
            <button
              onClick={answerCall}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform animate-pulse"
            >
              <Phone size={32} className="text-white sm:w-10 sm:h-10" />
            </button>
          </div>
        </div>
      )}

      {/* --- ОКНО АКТИВНОГО ЗВОНКА --- */}
      {callState && (
        <div className="fixed inset-0 z-[1000] bg-[#0e1621] flex flex-col items-center justify-between animate-fade-in overflow-hidden">
          {callState.type === "video" && !isCallVideoOff && (
            <VideoRenderer
              localStream={callStreamRef.current}
              remoteStream={remoteStream}
              facingMode={facingMode}
            />
          )}
          {callState.type === "video" && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none"></div>
          )}
          <div className="relative z-10 flex flex-col items-center mt-16 sm:mt-24 pointer-events-none">
            {callState.type === "audio" && (
              <div className="relative mb-10">
                <div
                  className={`absolute inset-0 rounded-full ${
                    callState.status === "calling" ||
                    callState.status === "connecting"
                      ? "animate-ping bg-[#3390ec]/30"
                      : "bg-[#3390ec]/10 shadow-md"
                  }`}
                ></div>
                <img
                  src={callState.peer.avatar}
                  className="w-32 h-32 rounded-full border-[4px] border-[#2b3949] relative z-10 object-cover"
                />
              </div>
            )}
            {callState.type === "video" && (
              <img
                src={callState.peer.avatar}
                className="w-16 h-16 rounded-full border-[3px] border-white/20 relative z-10 object-cover mb-4 shadow-lg"
              />
            )}
            <h2 className="text-2xl sm:text-3xl font-medium text-white drop-shadow-xl">
              {callState.peer.name}
            </h2>
            <div className="text-sky-400 font-mono text-sm sm:text-lg mt-3 font-medium tracking-[0.2em] drop-shadow-md">
              {callState.status === "connected" ? (
                <CallTimerDisplay status={callState.status} lang={lang} />
              ) : callState.status === "connecting" ? (
                "СОЕДИНЕНИЕ..."
              ) : (
                getText("calling")
              )}
            </div>
          </div>
          <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
          <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-6 mb-10 sm:mb-16 bg-black/60 backdrop-blur-2xl p-4 sm:p-6 rounded-2xl sm:rounded-2xl border border-white/10 shadow-lg">
            {callState.type === "video" && (
              <button
                type="button"
                onClick={toggleCameraFlip}
                className="p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-90 text-white"
              >
                <RefreshCw size={24} className="sm:w-7 sm:h-7" />
              </button>
            )}
            {callState.type === "video" && (
              <button
                type="button"
                onClick={toggleCallVideo}
                className={`p-3 sm:p-4 rounded-full transition-all active:scale-90 ${
                  isCallVideoOff
                    ? "bg-white text-zinc-900"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {isCallVideoOff ? (
                  <VideoOff size={24} className="sm:w-7 sm:h-7" />
                ) : (
                  <Camera size={24} className="sm:w-7 sm:h-7" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={toggleCallMute}
              className={`p-3 sm:p-4 rounded-full transition-all active:scale-90 ${
                isCallMuted
                  ? "bg-white text-zinc-900"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {isCallMuted ? (
                <MicOff size={24} className="sm:w-7 sm:h-7" />
              ) : (
                <Mic size={24} className="sm:w-7 sm:h-7" />
              )}
            </button>
            <button
              type="button"
              onClick={() => endCall(true)}
              className="p-4 sm:p-5 bg-rose-600 hover:bg-rose-500 rounded-full shadow-md transition-all active:scale-90 text-white transform hover:rotate-[135deg] duration-300 ml-2 sm:ml-4"
            >
              <PhoneOff size={28} className="sm:w-8 sm:h-8" />
            </button>
          </div>
        </div>
      )}

      {/* --- ЛЕВАЯ ПАНЕЛЬ --- */}
      <div
        className={`absolute md:relative inset-0 md:inset-auto w-full md:w-[320px] lg:w-[380px] xl:w-[420px] flex-shrink-0 border-r ${
          currentTheme.border
        } flex flex-col z-30 md:z-20 transition-transform duration-300 ${
          activeChat ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        } ${
          isLite
            ? currentTheme.litePanel
            : `${settings.theme === "light" ? "bg-white/40" : "bg-black/20"} backdrop-blur-3xl shadow-xl`
        }`}
      >
        {isMainMenuOpen && (
          <>
            <div
              className="absolute inset-0 z-40 bg-black/50"
              onClick={() => setIsMainMenuOpen(false)}
            />
            <div
              className={`absolute top-14 sm:top-16 left-4 sm:left-6 w-64 sm:w-72 ${currentTheme.base} border ${currentTheme.border} rounded-2xl shadow-lg z-50 p-2 sm:p-3 animate-spring-up origin-top-left flex flex-col`}
            >
              <div
                className={`px-3 py-3 sm:px-4 sm:py-4 border-b ${currentTheme.border} mb-2 sm:mb-3 flex items-center gap-3 sm:gap-4 group cursor-pointer hover:bg-white/5 rounded-2xl transition-all`}
                onClick={() => {
                  setIsMainMenuOpen(false);
                  loadProfile(currentUserAcc);
                }}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      settings.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserAcc}`
                    }
                    alt="me"
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#242f3d] transition-transform duration-500 group-hover:scale-110 object-cover ${
                      settings.isPremium
                        ? "ring-2 ring-sky-400 ring-offset-2 ring-offset-zinc-900 shadow-md"
                        : ""
                    }`}
                  />
                  {settings.isPremium && (
                    <div className="absolute -bottom-1 -right-1 bg-[#17212b] rounded-full p-0.5">
                      <Crown
                        size={12}
                        className="text-sky-400 fill-amber-400 sm:w-3.5 sm:h-3.5"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs sm:text-sm flex items-center gap-1 text-white truncate">
                    {settings.username || currentUserAcc}
                    <BadgeDisplay
                      type={settings.officialBadge}
                      className="text-base"
                    />
                    {settings.activeBadge && (
                      <span className="text-base drop-shadow-md ml-1">
                        {settings.activeBadge}
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-zinc-500 font-medium mt-0.5 truncate">
                    МОЙ ПРОФИЛЬ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMainMenuOpen(false);
                  setShowSettings(true);
                }}
                className="w-full text-left flex items-center gap-3 sm:gap-4 px-3 py-3 sm:px-4 sm:py-3.5 hover:bg-white/5 rounded-2xl transition-all active:scale-95 text-[11px] sm:text-xs font-medium text-zinc-300 hover:text-white"
              >
                <Settings size={18} className="text-zinc-500 flex-shrink-0" />
                {""}
                <span className="truncate">{getText("settings")}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMainMenuOpen(false);
                  setShowAddContact(true);
                }}
                className="w-full text-left flex items-center gap-3 sm:gap-4 px-3 py-3 sm:px-4 sm:py-3.5 hover:bg-white/5 rounded-2xl transition-all active:scale-95 text-[11px] sm:text-xs font-medium text-zinc-300 hover:text-white"
              >
                <UserPlus size={18} className="text-zinc-500 flex-shrink-0" />
                {""}
                <span className="truncate">{getText("add_friend")}</span>
              </button>
              <div className="h-px bg-white/5 my-1 sm:my-2 mx-2"></div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 sm:gap-4 px-3 py-3 sm:px-4 sm:py-3.5 hover:bg-rose-500/10 hover:text-rose-400 text-zinc-500 rounded-2xl transition-all active:scale-95 text-[11px] sm:text-xs font-medium group"
              >
                <LogOut
                  size={18}
                  className="group-hover:translate-x-1 transition-transform flex-shrink-0"
                />
                {""}
                <span className="truncate">{getText("logout")}</span>
              </button>
            </div>
          </>
        )}

        <div
          className={`p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-4 border-b ${currentTheme.border} ${settings.theme === "light" ? "bg-[#f1f1f1]" : "bg-white/5"}`}
        >
          <button
            type="button"
            onClick={() => setIsMainMenuOpen(true)}
            className={`p-2 sm:p-3 ${settings.theme === "light" ? "hover:bg-black/5" : "hover:bg-white/10"} rounded-xl transition-all active:scale-90 flex-shrink-0`}
          >
            <Menu
              size={24}
              className={
                settings.theme === "light" ? "text-zinc-600" : "text-zinc-300"
              }
            />
          </button>
          <div className="relative flex-1 group min-w-0">
            <Search
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#3390ec] transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder={getText("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${settings.theme === "light" ? "bg-[#f1f1f1] text-zinc-900" : "bg-black/40 text-white"} border ${currentTheme.border} rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 pl-9 sm:pl-12 pr-3 sm:pr-4 text-[10px] sm:text-[11px] md:text-xs focus:outline-none transition-all font-medium placeholder-zinc-500 truncate`}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAddContact(true)}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl ${currentAccent.bg} ${currentAccent.text} shadow-md active:scale-90 transition-transform hover:rotate-90 flex-shrink-0`}
          >
            <UserPlus size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4 space-y-1">
          {filteredContacts.map((cUser, i) => {
            const chatMessages = messages[cUser.id] || [];
            const visibleMessages = chatMessages.filter(
              (m) => !(m.expiresAt && Date.now() > m.expiresAt),
            );
            const lastMsg = visibleMessages[visibleMessages.length - 1];
            const isActive = activeChat?.id === cUser.id;

            return (
              <div
                key={cUser.id}
                className={`relative group/chat flex flex-col ${
                  !isLite && "animate-stagger-fade"
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div
                  onClick={() => {
                    setActiveChat(cUser);
                    setReplyingTo(null);
                    setEditingMsg(null);
                    setShowChatMenu(false);
                  }}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isActive
                      ? `${settings.theme === "light" ? "bg-zinc-200" : "bg-white/10"} shadow-lg ring-1 ${settings.theme === "light" ? "ring-zinc-300" : "ring-white/10"}`
                      : `${settings.theme === "light" ? "hover:bg-[#f1f1f1]" : "hover:bg-white/5"} hover:scale-[1.01]`
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={cUser.avatar}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md object-cover ${
                        cUser.isPremium
                          ? "ring-2 ring-sky-400"
                          : "ring-2 ring-black/20"
                      }`}
                    />
                    {cUser.isPremium && (
                      <div className="absolute -bottom-1 -right-1 bg-[#17212b] rounded-full p-0.5">
                        <Crown
                          size={12}
                          className="text-sky-400 fill-amber-400"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3
                        className={`font-medium text-[11px] sm:text-xs lg:text-sm truncate flex items-center gap-1 ${
                          cUser.id === "ai" || cUser.isPremium
                            ? "text-sky-400"
                            : currentTheme.text
                        }`}
                      >
                        {String(cUser.name)}
                        <BadgeDisplay
                          type={cUser.officialBadge}
                          className="text-sm"
                        />
                        {cUser.activeBadge && (
                          <span className="text-sm drop-shadow-md ml-1">
                            {cUser.activeBadge}
                          </span>
                        )}
                      </h3>
                      <span className="text-[8px] sm:text-[9px] font-medium text-zinc-600 flex-shrink-0 ml-2">
                        {lastMsg?.time || ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-[9px] sm:text-[10px] truncate font-medium ${
                          isActive
                            ? "text-zinc-300"
                            : "text-zinc-500 opacity-70"
                        }`}
                      >
                        {lastMsg ? (
                          <>
                            {lastMsg.senderId === "me" && (
                              <span className="text-zinc-400 mr-1">
                                {getText("you")}:
                              </span>
                            )}
                            {lastMsg.type === "gift"
                              ? `🎁 ${getText("gift")}`
                              : lastMsg.type === "image"
                                ? `🖼️ ${getText("photo_msg")}`
                                : lastMsg.type === "file"
                                  ? `📄 ${getText("file_msg")}`
                                  : lastMsg.type === "geo"
                                    ? `📍 ${getText("geo_msg")}`
                                    : lastMsg.isVoice
                                      ? `🎤 ${getText("voice_msg")}`
                                      : lastMsg.text}
                          </>
                        ) : (
                          getText("start_chat")
                        )}
                      </p>
                      {lastMsg?.senderId === "me" &&
                        lastMsg.status === "read" && (
                          <CheckCheck
                            size={12}
                            className={`flex-shrink-0 ml-2 ${currentAccent.textActive}`}
                          />
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredContacts.length === 0 && (
            <div className="text-center text-zinc-500 mt-8 sm:mt-12 px-6 animate-fade-in flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Search size={24} className="text-zinc-600 sm:w-7 sm:h-7" />
              </div>
              <p className="text-[10px] sm:text-xs font-medium mb-4 sm:mb-6">
                {getText("empty_chats")}
              </p>
              <button
                type="button"
                onClick={() => setShowAddContact(true)}
                className={`text-[9px] sm:text-[10px] font-medium px-4 py-3 sm:px-6 sm:py-4 rounded-full transition-transform active:scale-95 shadow-md ${currentAccent.bg} ${currentAccent.text}`}
              >
                {getText("find_bros")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- ГЛАВНОЕ ОКНО ЧАТА --- */}
      <div
        className={`absolute md:relative inset-0 w-full flex-1 flex flex-col ${
          currentTheme.panel
        } z-30 md:z-10 overflow-hidden transition-transform duration-500 ${
          activeChat ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        {!isLite && (
          <div
            className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
            style={getWallpaperStyle()}
          ></div>
        )}

        {!activeChat ? (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-zinc-500 relative z-10 p-4">
            <div
              className={`w-24 h-24 mb-6 rounded-2xl flex items-center justify-center border border-[#2b3949]/30 ${
                isLite
                  ? "bg-[#242f3d]"
                  : "bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-xl animate-float shadow-xl"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#2b3949]/50 flex items-center justify-center animate-pulse">
                <Search size={24} className="text-zinc-500" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-zinc-300 mb-2 drop-shadow-md">
              PLATINA WEB
            </h3>
            <p className="text-[10px] text-zinc-500 max-w-xs text-center font-medium">
              Выбери чат слева или найди друга.
            </p>
          </div>
        ) : (
          <>
            {/* Хедер Чата */}
            <div
              className={`h-16 sm:h-20 flex items-center justify-between px-3 sm:px-6 md:px-8 border-b ${currentTheme.border} z-20 shadow-sm flex-shrink-0 ${
                isLite
                  ? currentTheme.litePanel
                  : `${settings.theme === "light" ? "bg-white/60" : "bg-black/40"} backdrop-blur-3xl`
              }`}
            >
              <div
                className="flex items-center gap-2 sm:gap-4 cursor-pointer group flex-1 min-w-0"
                onClick={() => loadProfile(chatUser.id)}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChat(null);
                  }}
                  className={`md:hidden p-2 -ml-2 ${settings.theme === "light" ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-white"} active:scale-90 transition-all flex-shrink-0`}
                >
                  <ChevronLeft size={26} />
                </button>
                <div className="relative flex-shrink-0 group-hover:scale-110 transition-transform">
                  <img
                    src={chatUser.avatar || activeChat.avatar}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg object-cover ${
                      chatUser.isPremium
                        ? "ring-2 ring-sky-400"
                        : "ring-1 sm:ring-2 ring-white/5"
                    }`}
                  />
                  {chatUser.isPremium && (
                    <div className="absolute -bottom-1 -right-1 bg-[#17212b] rounded-full p-0.5 z-10">
                      <Crown
                        size={12}
                        className="text-sky-400 fill-amber-400"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h2
                    className={`font-medium text-[11px] sm:text-sm md:text-base truncate flex items-center gap-1.5 group-hover:underline ${
                      chatUser.isPremium ? "text-sky-400" : currentTheme.text
                    }`}
                  >
                    {String(chatUser.username || chatUser.name || "Без имени")}
                    <BadgeDisplay
                      type={chatUser.officialBadge}
                      className="text-lg"
                    />
                    {chatUser.activeBadge && (
                      <span className="text-lg drop-shadow-lg">
                        {chatUser.activeBadge}
                      </span>
                    )}
                  </h2>
                  <p
                    className={`text-[8px] sm:text-[9px] ${
                      isOnline
                        ? "text-[#3390ec]/80 animate-pulse"
                        : "text-zinc-500"
                    } font-medium tracking-[0.2em] mt-0.5 truncate`}
                  >
                    {displayStatus}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0 relative">
                {activeChat?.id !== "ai" && (
                  <>
                    <button
                      type="button"
                      onClick={() => startCall("audio")}
                      className={`p-2 sm:p-3 ${settings.theme === "light" ? "text-zinc-600 hover:text-zinc-900 hover:bg-black/5 bg-[#f1f1f1]" : "text-zinc-500 hover:text-white hover:bg-white/10 bg-black/20"} rounded-xl transition-all active:scale-90 shadow-sm`}
                    >
                      <Phone size={18} className="sm:w-[20px] sm:h-[20px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startCall("video")}
                      className={`p-2 sm:p-3 ${settings.theme === "light" ? "text-zinc-600 hover:text-zinc-900 hover:bg-black/5 bg-[#f1f1f1]" : "text-zinc-500 hover:text-white hover:bg-white/10 bg-black/20"} rounded-xl transition-all active:scale-90 shadow-sm`}
                    >
                      <Video size={18} className="sm:w-[20px] sm:h-[20px]" />
                    </button>
                  </>
                )}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowChatMenu(!showChatMenu)}
                    className={`p-2 sm:p-3 ${settings.theme === "light" ? "text-zinc-600 hover:text-zinc-900 hover:bg-black/5 bg-[#f1f1f1]" : "text-zinc-500 hover:text-white hover:bg-white/10 bg-black/20"} rounded-xl transition-all active:scale-90 shadow-sm ml-1 sm:ml-2`}
                  >
                    <MoreVertical
                      size={18}
                      className="sm:w-[20px] sm:h-[20px]"
                    />
                  </button>
                  {showChatMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#17212b]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-lg p-2 z-50 animate-spring-up origin-top-right">
                      <button
                        type="button"
                        onClick={handleClearHistory}
                        className="flex items-center gap-2 px-3 py-3 text-[10px] font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors w-full text-left"
                      >
                        <Trash size={14} /> {getText("clear_history")}
                      </button>
                      <div className="h-px bg-white/10 my-1 mx-2"></div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsBurnMode(!isBurnMode);
                          setShowChatMenu(false);
                        }}
                        className={`flex items-center gap-2 px-3 py-3 text-[10px] font-medium rounded-xl transition-colors w-full text-left ${
                          isBurnMode
                            ? "text-sky-400 bg-[#3390ec]/10"
                            : "text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        <Flame size={14} /> {getText("secret_chat")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSettings(true);
                          setActiveSettingsTab("appearance");
                          setShowChatMenu(false);
                        }}
                        className="flex items-center gap-2 px-3 py-3 text-[10px] font-medium text-zinc-300 hover:bg-white/10 rounded-xl transition-colors w-full text-left"
                      >
                        <Wallpaper size={14} /> {getText("change_bg")}
                      </button>
                      {activeChat?.id !== "ai" && (
                        <button
                          type="button"
                          onClick={() => {
                            setChatToDelete(activeChat);
                            setShowChatMenu(false);
                          }}
                          className="flex items-center gap-2 px-3 py-3 text-[10px] font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors w-full text-left mt-1"
                        >
                          <Trash2 size={14} /> {getText("delete")} чат
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Область сообщений */}
            <div
              className={`flex-1 overflow-y-auto ${
                settings.messageDensity === "compact"
                  ? "p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-1.5"
                  : "p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6"
              } custom-scrollbar relative z-10`}
              onClick={() => {
                setActiveMessageMenu(null);
                setShowChatMenu(false);
              }}
            >
              <div className="text-center w-full my-2 sm:my-4">
                <div
                  className={`text-[8px] sm:text-[9px] font-medium text-zinc-400 tracking-[0.3em] ${settings.theme === "light" ? "bg-zinc-200" : "bg-black/50"} inline-block px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border ${currentTheme.border}`}
                >
                  {getText("today")}
                </div>
              </div>

              {(messages?.[activeChat?.id] || []).map((msg, i, arr) => {
                const isMe = msg.senderId === "me";
                const showAvatar =
                  !isMe && (i === 0 || arr[i - 1].senderId !== msg.senderId);

                if (msg.expiresAt && now > msg.expiresAt) {
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isMe ? "justify-end" : "justify-start"
                      } mb-4 sm:mb-6 animate-fade-in`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-[10px] sm:text-xs font-medium border border-dashed ${
                          isMe
                            ? "border-rose-500/30 text-rose-500/50 bg-rose-500/5"
                            : "border-zinc-500/30 text-zinc-500/50 bg-[#242f3d]/20"
                        }`}
                      >
                        <Flame size={14} /> {getText("burned")}
                      </div>
                    </div>
                  );
                }

                if (msg.type === "gift") {
                  const g = msg.gift;
                  return (
                    <div
                      key={msg.id}
                      className="flex justify-center my-6 sm:my-10 w-full animate-message-pop origin-center"
                    >
                      <div
                        className={`bg-gradient-to-br ${g.grad} border ${g.border} rounded-2xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center relative overflow-hidden backdrop-blur-xl min-w-[200px] sm:min-w-[260px] transition-transform hover:scale-105 shadow-xl`}
                        style={{ boxShadow: `0 0 40px ${g.glow}` }}
                      >
                        <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay pointer-events-none"></div>
                        <div
                          className="absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 rounded-full blur-3xl -mr-8 -mt-8 sm:-mr-12 sm:-mt-12"
                          style={{ backgroundColor: g.glow }}
                        ></div>
                        <span className="text-6xl sm:text-8xl mb-4 sm:mb-6 animate-float drop-shadow-lg z-10">
                          {g.icon}
                        </span>
                        <div className="z-10 flex flex-col items-center text-center">
                          <p className="text-white/80 text-[8px] sm:text-[10px] font-medium mb-1 sm:mb-2">
                            {isMe
                              ? getText("sent_gift")
                              : `${activeChat.name} ${getText("gets_gift")}`}
                          </p>
                          <p
                            className={`${g.text} font-medium text-lg sm:text-2xl drop-shadow-md mb-3 sm:mb-4 `}
                          >
                            {g.name}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 bg-black/50 px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-white/10 shadow-inner">
                            <span className="text-[10px] sm:text-xs text-[#3390ec] font-medium">
                              {g.price}
                            </span>
                            <Gem
                              size={10}
                              className="fill-amber-500 text-[#3390ec] sm:w-3.5 sm:h-3.5"
                            />
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 text-[8px] sm:text-[10px] text-white/40 font-medium z-10">
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isMe ? "justify-end" : "justify-start"
                    } group ${
                      settings.messageDensity === "compact"
                        ? "mb-1 sm:mb-1.5"
                        : "mb-4 sm:mb-6"
                    } relative animate-message-pop origin-bottom`}
                    onMouseLeave={() => {
                      setActiveReactionMsg(null);
                    }}
                  >
                    <div
                      className={`flex max-w-[92%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[65%] items-end gap-2 sm:gap-3 flex-col sm:flex-row ${
                        isMe
                          ? "sm:flex-row-reverse items-end sm:items-end"
                          : "items-start sm:items-end"
                      }`}
                    >
                      {!isMe && (
                        <div className="w-8 sm:w-10 flex-shrink-0 pb-1 hidden sm:block">
                          {showAvatar && (
                            <img
                              src={chatUser.avatar || activeChat.avatar}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md object-cover animate-fade-in cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => loadProfile(activeChat?.id)}
                            />
                          )}
                        </div>
                      )}

                      <div className="relative flex flex-col w-full">
                        {/* Меню сообщения */}
                        <div
                          className={`absolute -top-6 sm:-top-8 z-50 ${
                            isMe ? "left-0 sm:-left-10" : "right-0 sm:-right-10"
                          } opacity-100 transition-all duration-300 z-40`}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMessageMenu(
                                activeMessageMenu === msg.id ? null : msg.id,
                              );
                              setActiveReactionMsg(null);
                            }}
                            className="text-zinc-400 hover:text-white p-1.5 sm:p-2 rounded-full bg-[#17212b]/90 backdrop-blur-xl border border-white/10 shadow-lg hover:scale-110 active:scale-90"
                          >
                            <MoreVertical size={14} className="sm:w-4 sm:h-4" />
                          </button>
                          {activeMessageMenu === msg.id && (
                            <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 bg-[#17212b]/95 backdrop-blur-3xl border border-white/10 rounded-xl p-2 shadow-lg flex flex-col min-w-[150px] animate-spring-up z-50">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReplyingTo(msg);
                                  setActiveMessageMenu(null);
                                }}
                                className="flex items-center gap-2 px-3 py-2.5 text-[10px] sm:text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors w-full text-left"
                              >
                                <Reply size={14} /> {getText("reply")}
                              </button>
                              {!msg.isVoice && !msg.type && msg.text && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    readAloud(msg.text);
                                  }}
                                  className="flex items-center gap-2 px-3 py-2.5 text-[10px] sm:text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors w-full text-left mt-1"
                                >
                                  <Volume2 size={14} /> {getText("read_aloud")}
                                </button>
                              )}
                              {isMe && !msg.isVoice && !msg.type && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditing(msg);
                                  }}
                                  className="flex items-center gap-2 px-3 py-2.5 text-[10px] sm:text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors w-full text-left mt-1"
                                >
                                  <Edit3 size={14} /> {getText("edit_msg")}
                                </button>
                              )}
                              {!isMe && msg.text && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    translateMessage(msg.id, msg.text);
                                  }}
                                  className="flex items-center gap-2 px-3 py-2.5 text-[10px] sm:text-xs font-medium text-sky-400 hover:text-amber-300 hover:bg-[#3390ec]/10 rounded-xl transition-colors w-full text-left mt-1"
                                >
                                  <Languages size={14} /> {getText("translate")}
                                </button>
                              )}
                              {isMe && (
                                <>
                                  <div className="h-px bg-white/10 my-1 mx-2"></div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteSingleMessage(msg.id);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2.5 text-[10px] sm:text-xs font-medium text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors w-full text-left"
                                  >
                                    <Trash2 size={14} /> {getText("delete_msg")}
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Баббл сообщения */}
                        <div
                          style={{ opacity: settings.bubbleOpacity }}
                          className={`relative ${
                            settings.messageDensity === "compact"
                              ? "px-3 py-1.5 sm:px-4 sm:py-2"
                              : "px-4 py-3 sm:px-5 sm:py-4"
                          } ${settings.fontSize} ${
                            isMe
                              ? "rounded-2xl rounded-br-sm"
                              : "rounded-2xl rounded-bl-sm"
                          } ${getAccentClasses(
                            isMe,
                            msg.senderId,
                          )} flex flex-col min-w-0 shadow-sm ${
                            msg.expiresAt
                              ? isMe
                                ? "border-rose-500/50 shadow-md"
                                : "border-rose-500/30"
                              : ""
                          }`}
                        >
                          {msg.expiresAt && (
                            <div
                              className={`absolute top-0 right-0 px-2 py-1 rounded-bl-xl bg-rose-500 flex items-center gap-1 text-[8px] font-medium ${isMe ? currentAccent.text : "text-white"} shadow-md`}
                            >
                              <Flame size={10} className="animate-pulse" />
                              {""}
                              <BurnTimer
                                expiresAt={msg.expiresAt}
                                onExpire={() => setNow(Date.now())}
                              />
                            </div>
                          )}
                          {msg.replyTo && (
                            <div
                              className={`flex flex-col mb-2 sm:mb-3 pl-2 sm:pl-3.5 border-l-2 sm:border-l-4 ${isMe ? "border-white/40" : "border-current/40"} opacity-90 text-[10px] sm:text-sm ${settings.theme === "light" ? "bg-black/5" : "bg-black/20"} p-2 sm:p-2.5 rounded-r-lg sm:rounded-r-xl cursor-pointer hover:bg-black/30 transition-colors mt-2`}
                            >
                              <span className="font-medium text-[8px] sm:text-[10px] mb-0.5 sm:mb-1">
                                {msg.replyTo.senderId === "me"
                                  ? getText("you")
                                  : activeChat.name}
                              </span>
                              <span className="truncate opacity-80 font-medium">
                                {msg.replyTo.text ||
                                  (msg.replyTo.type === "image"
                                    ? `ФОТО 🖼️`
                                    : `ВЛОЖЕНИЕ 📎`)}
                              </span>
                            </div>
                          )}
                          {msg.type === "image" && (
                            <div
                              className={`mt-1 mb-2 sm:mb-3 relative group/img overflow-hidden rounded-xl sm:rounded-2xl ${settings.theme === "light" ? "bg-zinc-200" : "bg-black/50"} shadow-inner cursor-pointer border ${currentTheme.border}`}
                            >
                              <img
                                src={msg.url}
                                className="w-full max-h-[200px] sm:max-h-[300px] object-cover transition-transform duration-700 group-hover/img:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                <Search className="text-white drop-shadow-lg transform scale-50 group-hover/img:scale-100 transition-transform duration-300 w-8 h-8 sm:w-10 sm:h-10" />
                              </div>
                            </div>
                          )}
                          {msg.type === "file" && (
                            <div
                              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 mt-1 cursor-pointer transition-all border shadow-sm sm:shadow-lg hover:-translate-y-0.5 sm:hover:-translate-y-1 ${
                                isMe
                                  ? "bg-black/20 border-white/10 hover:bg-black/30"
                                  : `${settings.theme === "light" ? "bg-[#f1f1f1]" : "bg-black/40"} ${currentTheme.border} hover:bg-black/60`
                              }`}
                            >
                              <div
                                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl shadow-inner flex-shrink-0 ${
                                  isMe
                                    ? "bg-white/20 text-white"
                                    : "bg-rose-500/20 text-rose-400"
                                }`}
                              >
                                <FileText size={18} className="sm:w-6 sm:h-6" />
                              </div>
                              <div className="flex flex-col overflow-hidden min-w-0">
                                <span className="text-[11px] sm:text-sm font-medium truncate">
                                  {msg.fileName}
                                </span>
                                <span
                                  className={`text-[8px] sm:text-[10px] font-medium mt-0.5 sm:mt-1 ${
                                    isMe ? "text-white/60" : "text-zinc-500"
                                  }`}
                                >
                                  {msg.fileSize}
                                </span>
                              </div>
                            </div>
                          )}
                          {msg.type === "geo" && (
                            <div
                              className={`flex flex-col overflow-hidden rounded-xl sm:rounded-2xl mb-2 sm:mb-3 mt-1 border shadow-sm sm:shadow-lg ${
                                isMe
                                  ? "border-white/10 bg-black/20"
                                  : `${currentTheme.border} ${settings.theme === "light" ? "bg-[#f1f1f1]" : "bg-black/40"}`
                              }`}
                            >
                              <div className="h-20 sm:h-28 relative w-full flex items-center justify-center overflow-hidden bg-emerald-950/40 cursor-pointer group/geo">
                                <MapPin className="text-emerald-400 z-10 drop-shadow-md animate-bounce group-hover/geo:scale-110 transition-transform w-6 h-6 sm:w-8 sm:h-8" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent pointer-events-none"></div>
                              </div>
                              <div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                                <p
                                  className={`text-[9px] sm:text-xs font-medium ${
                                    isMe ? "text-white" : "text-zinc-300"
                                  }`}
                                >
                                  {getText("geo_msg")}
                                </p>
                                <p
                                  className={`text-[8px] sm:text-[10px] font-medium mt-0.5 sm:mt-1 ${
                                    isMe ? "text-white/60" : "text-zinc-500"
                                  }`}
                                >
                                  {msg.lat.toFixed(4)}, {msg.lon.toFixed(4)}
                                </p>
                              </div>
                            </div>
                          )}

                          {(msg.text || msg.isVoice) && !msg.isVoice && (
                            <div className="flex flex-col min-w-0">
                              <p className="whitespace-pre-wrap break-words font-medium leading-relaxed text-[13px] sm:text-sm md:text-base">
                                {msg.text}
                              </p>
                              {translatedMessages[msg.id] && (
                                <div
                                  className={`mt-2 p-3 rounded-xl text-xs font-medium leading-relaxed border shadow-inner ${
                                    isMe
                                      ? "bg-black/20 border-white/10 text-amber-200"
                                      : "bg-[#3390ec]/10 border-[#3390ec]/20 text-sky-400"
                                  }`}
                                >
                                  <Languages
                                    size={12}
                                    className="inline mr-1 mb-0.5 opacity-70"
                                  />
                                  {""}
                                  {translatedMessages[msg.id]}
                                </div>
                              )}
                            </div>
                          )}

                          {msg.isVoice && (
                            <div className="flex flex-col w-full min-w-[200px] sm:min-w-[240px]">
                              <p className="whitespace-pre-wrap break-words font-medium flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-[8px] sm:text-[10px] opacity-70">
                                <Mic
                                  size={10}
                                  className={`animate-pulse sm:w-3 sm:h-3 ${
                                    isMe ? "text-white" : "text-rose-500"
                                  }`}
                                />
                                {""}
                                {msg.text}
                              </p>
                              {msg.audioData && (
                                <CustomAudioPlayer
                                  src={msg.audioData}
                                  isMe={isMe}
                                  durationText={msg.durationText}
                                />
                              )}
                              <div className="w-full mt-2 sm:mt-3 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleTranscribe(msg.id)}
                                  className={`text-[7px] sm:text-[9px] font-medium tracking-[0.2em] px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-xl transition-all active:scale-95 flex items-center gap-1 sm:gap-1.5 w-fit ${
                                    isMe
                                      ? "bg-black/30 hover:bg-black/40 text-white shadow-md border border-white/10"
                                      : "bg-white/10 hover:bg-white/20 text-zinc-300 shadow-md border border-white/5"
                                  }`}
                                >
                                  <Type size={8} className="sm:w-3 sm:h-3" />
                                  {""}
                                  {transcribedMessages[msg.id]
                                    ? getText("hide")
                                    : getText("transcribe")}
                                </button>
                              </div>
                              {transcribedMessages[msg.id] && (
                                <div
                                  className={`mt-2 sm:mt-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-medium leading-relaxed border animate-spring-up shadow-inner ${
                                    isMe
                                      ? "bg-black/20 border-white/10 text-white/90"
                                      : "bg-black/40 border-white/5 text-zinc-300"
                                  }`}
                                >
                                  {transcribedMessages[msg.id]}
                                </div>
                              )}
                            </div>
                          )}

                          <div
                            className={`flex items-center justify-end gap-1 sm:gap-1.5 mt-1 sm:mt-2 opacity-50`}
                          >
                            <span className="text-[7px] sm:text-[9px] font-medium">
                              {msg.time}
                            </span>
                            {msg.isEdited && (
                              <span className="text-[7px] sm:text-[9px] font-medium italic ml-1">
                                Изм.
                              </span>
                            )}
                            {isMe && (
                              <CheckCheck
                                size={10}
                                className="sm:w-3.5 sm:h-3.5 opacity-80 ml-1"
                              />
                            )}
                          </div>
                        </div>

                        {msg.reactions && msg.reactions.length > 0 && (
                          <div
                            className={`absolute -bottom-3 sm:-bottom-4 ${
                              isMe ? "right-2 sm:right-4" : "left-2 sm:left-4"
                            } flex items-center gap-1 sm:gap-1.5 z-20`}
                          >
                            {msg.reactions.map((r, i) => (
                              <div
                                key={i}
                                className="bg-[#17212b]/90 backdrop-blur-xl border border-white/10 text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 rounded-lg sm:rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.5)] animate-spring-up text-white flex items-center justify-center transform hover:scale-125 transition-transform cursor-default"
                              >
                                {r}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isAiTyping && activeChat?.id === "ai" && (
                <div className="flex justify-start group mb-2 animate-message-enter-left">
                  <div className="flex max-w-[85%] sm:max-w-[75%] items-end gap-2 sm:gap-3 flex-row">
                    <div className="w-8 sm:w-10 flex-shrink-0 pb-1 hidden sm:block">
                      <img
                        src={activeChat.avatar}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md object-cover"
                      />
                    </div>
                    <div className="relative px-4 py-3 sm:px-5 sm:py-4 shadow-xl bg-indigo-900/40 border border-indigo-500/30 rounded-xl sm:rounded-2xl rounded-bl-sm sm:rounded-bl-md flex items-center gap-2 backdrop-blur-xl">
                      {isGeneratingImage ? (
                        <>
                          <ImagePlus
                            size={16}
                            className="text-indigo-400 animate-pulse"
                          />
                          <span className="text-[10px] font-medium text-indigo-400">
                            {getText("generating_image")}
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce shadow-md"
                            style={{ animationDelay: "0ms" }}
                          ></span>
                          <span
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce shadow-md"
                            style={{ animationDelay: "150ms" }}
                          ></span>
                          <span
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce shadow-md"
                            style={{ animationDelay: "300ms" }}
                          ></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4 sm:h-6" />
            </div>

            {/* --- ПАНЕЛЬ ВВОДА --- */}
            <div
              className={`p-3 sm:p-4 md:p-6 lg:p-8 ${
                isLite
                  ? "bg-[#0e1621] border-t border-white/5"
                  : "bg-gradient-to-t from-gray-100 via-gray-100/80 to-transparent dark:from-black/90 dark:via-black/50 dark:to-transparent z-30"
              } flex-shrink-0`}
            >
              {replyingTo && !editingMsg && (
                <div className="max-w-5xl mx-auto mb-2 sm:mb-3 flex items-center justify-between bg-[#17212b]/95 backdrop-blur-3xl rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-white/10 shadow-xl animate-slide-up relative overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 ${currentAccent.bg}`}
                  ></div>
                  <div className="flex items-center gap-2 sm:gap-3 overflow-hidden ml-2 sm:ml-3">
                    <Reply
                      size={16}
                      className={`sm:w-5 sm:h-5 ${currentAccent.textActive} flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[8px] sm:text-[9px] font-medium ${currentAccent.textActive} mb-0.5 truncate`}
                      >
                        {replyingTo.senderId === "me"
                          ? getText("you")
                          : activeChat.name}
                      </p>
                      <p className="text-[10px] sm:text-xs font-medium text-zinc-300 truncate">
                        {replyingTo.text ||
                          (replyingTo.type === "image"
                            ? `ФОТО 🖼️`
                            : replyingTo.type === "file"
                              ? `ФАЙЛ 📎`
                              : "ВЛОЖЕНИЕ")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="p-1 sm:p-1.5 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition-colors active:scale-90 flex-shrink-0"
                  >
                    <X size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}

              {editingMsg && (
                <div className="max-w-5xl mx-auto mb-2 sm:mb-3 flex items-center justify-between bg-amber-900/90 backdrop-blur-3xl rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-[#3390ec]/30 shadow-xl animate-slide-up relative overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-[#3390ec]`}
                  ></div>
                  <div className="flex items-center gap-2 sm:gap-3 overflow-hidden ml-2 sm:ml-3">
                    <Edit3
                      size={16}
                      className={`sm:w-5 sm:h-5 text-sky-400 flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[8px] sm:text-[9px] font-medium text-sky-400 mb-0.5 truncate`}
                      >
                        {getText("edit_msg")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMsg(null);
                      setInputText("");
                    }}
                    className="p-1 sm:p-1.5 hover:bg-[#3390ec]/20 rounded-full text-[#3390ec] hover:text-sky-400 transition-colors active:scale-90 flex-shrink-0"
                  >
                    <X size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}

              <div
                className={`max-w-5xl mx-auto flex items-end gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 ${settings.theme === "light" ? "bg-[#f1f1f1]" : "bg-white/5"} border ${currentTheme.border} rounded-2xl sm:rounded-2xl focus-within:border-[#3390ec]/50 ${settings.theme === "light" ? "focus-within:bg-white shadow-lg" : "focus-within:bg-black/60"} transition-all duration-300 ${
                  !isLite &&
                  "shadow-xl sm:shadow-lg backdrop-blur-3xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                } ${
                  isRecording || isBurnMode
                    ? "ring-2 sm:ring-4 ring-rose-500/30 bg-rose-500/5 border-rose-500/40 scale-[1.01] sm:scale-[1.02]"
                    : ""
                }`}
              >
                {showRewriteMenu && (
                  <div
                    className={`absolute bottom-[calc(100%+8px)] sm:bottom-[calc(100%+12px)] left-2 sm:left-14 ${currentTheme.base} border ${currentTheme.border} rounded-2xl sm:rounded-2xl shadow-lg p-2 sm:p-3 flex flex-col gap-1 sm:gap-1.5 z-50 min-w-[180px] sm:min-w-[220px] animate-spring-up origin-bottom-left backdrop-blur-3xl`}
                  >
                    <div
                      className={`text-[8px] sm:text-[9px] text-[#3390ec] font-medium px-2 sm:px-3 pb-1.5 sm:pb-2 pt-1 sm:pt-1.5 mb-1 sm:mb-2 border-b ${currentTheme.border} tracking-[0.2em] flex items-center gap-1 sm:gap-1.5`}
                    >
                      <Wand2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      {""}
                      {getText("magic")}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRewrite("formal")}
                      className="text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-white/5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-medium text-zinc-300 hover:text-white transition-all active:scale-95 flex items-center gap-2 sm:gap-3"
                    >
                      <span className="text-lg sm:text-xl drop-shadow-md">
                        👔
                      </span>
                      {""}
                      {getText("formal")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRewrite("friendly")}
                      className="text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-white/5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-medium text-zinc-300 hover:text-white transition-all active:scale-95 flex items-center gap-2 sm:gap-3"
                    >
                      <span className="text-lg sm:text-xl drop-shadow-md">
                        👋
                      </span>
                      {""}
                      {getText("friendly")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRewrite("slang")}
                      className="text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-white/5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-medium text-sky-400 hover:text-amber-300 transition-all active:scale-95 flex items-center gap-2 sm:gap-3 bg-[#3390ec]/10 border border-[#3390ec]/20"
                    >
                      <span className="text-lg sm:text-xl drop-shadow-md">
                        💿
                      </span>
                      {""}
                      {getText("slang")}
                    </button>
                  </div>
                )}

                <div className="relative flex-shrink-0 flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachmentMenu(!showAttachmentMenu);
                      setShowEmojiPicker(false);
                      setShowGiftPicker(false);
                      setShowRewriteMenu(false);
                    }}
                    className={`p-2.5 sm:p-3 md:p-4 transition-all duration-300 rounded-[1rem] sm:rounded-xl active:scale-90 flex items-center justify-center ${
                      showAttachmentMenu
                        ? "bg-white/20 text-white shadow-md"
                        : `${settings.theme === "light" ? "text-zinc-400 hover:text-zinc-600 hover:bg-black/5" : "text-zinc-500 hover:text-white hover:bg-white/10"}`
                    }`}
                  >
                    <Paperclip
                      size={20}
                      className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                    />
                  </button>

                  {showAttachmentMenu && (
                    <div
                      className={`absolute bottom-[calc(100%+8px)] sm:bottom-[calc(100%+12px)] left-0 ${currentTheme.base} border ${currentTheme.border} rounded-2xl sm:rounded-2xl shadow-lg p-3 sm:p-4 z-50 w-[240px] sm:w-[280px] animate-spring-up origin-bottom-left backdrop-blur-3xl`}
                    >
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl sm:rounded-2xl bg-[#17212b]/50 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all active:scale-90 group"
                        >
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-110 transition-transform shadow-inner`}
                          >
                            <ImageIcon
                              size={20}
                              className="text-blue-500 sm:w-6 sm:h-6"
                            />
                          </div>
                          <span className="text-[8px] sm:text-[9px] font-medium text-zinc-400 group-hover:text-white">
                            {getText("gallery")}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl sm:rounded-2xl bg-[#17212b]/50 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all active:scale-90 group"
                        >
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-110 transition-transform shadow-inner`}
                          >
                            <FileText
                              size={20}
                              className="text-rose-500 sm:w-6 sm:h-6"
                            />
                          </div>
                          <span className="text-[8px] sm:text-[9px] font-medium text-zinc-400 group-hover:text-white">
                            {getText("file_msg")}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={handleGeoLocation}
                          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl sm:rounded-2xl bg-[#17212b]/50 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all active:scale-90 group"
                        >
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-110 transition-transform shadow-inner`}
                          >
                            <MapPin
                              size={20}
                              className="text-emerald-500 sm:w-6 sm:h-6"
                            />
                          </div>
                          <span className="text-[8px] sm:text-[9px] font-medium text-zinc-400 group-hover:text-white">
                            {getText("geo_msg")}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAttachmentMenu(false);
                            setShowAddContact(true);
                          }}
                          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl sm:rounded-2xl bg-[#17212b]/50 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all active:scale-90 group"
                        >
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#3390ec]/10 flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-110 transition-transform shadow-inner`}
                          >
                            <UserPlus
                              size={20}
                              className="text-[#3390ec] sm:w-6 sm:h-6"
                            />
                          </div>
                          <span className="text-[8px] sm:text-[9px] font-medium text-zinc-400 group-hover:text-white">
                            {getText("friend")}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => sendMiniGame("dice")}
                          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl sm:rounded-2xl bg-[#17212b]/50 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all active:scale-90 group"
                        >
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-110 transition-transform shadow-inner`}
                          >
                            <Dices
                              size={20}
                              className="text-purple-500 sm:w-6 sm:h-6"
                            />
                          </div>
                          <span className="text-[8px] sm:text-[9px] font-medium text-zinc-400 group-hover:text-white">
                            {getText("dice")}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => sendMiniGame("coin")}
                          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl sm:rounded-2xl bg-[#17212b]/50 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all active:scale-90 group"
                        >
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-110 transition-transform shadow-inner`}
                          >
                            <CircleDot
                              size={20}
                              className="text-yellow-500 sm:w-6 sm:h-6"
                            />
                          </div>
                          <span className="text-[8px] sm:text-[9px] font-medium text-zinc-400 group-hover:text-white">
                            {getText("coin")}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-center min-h-[40px] sm:min-h-[48px] md:min-h-[56px] min-w-0 relative">
                  {isRecording ? (
                    <div className="flex flex-col gap-1 sm:gap-1.5 px-2 sm:px-2 py-1 sm:py-1.5 animate-fade-in w-full overflow-hidden">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full bg-rose-500 animate-pulse-glow shadow-md"></div>
                          <span className="text-rose-400 font-medium text-xs sm:text-sm lg:text-lg font-mono drop-shadow-md">
                            <RecordingTimerDisplay isRecording={isRecording} />
                          </span>
                          <AudioWaveform className="text-rose-500/50 animate-pulse w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 hidden sm:block" />
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 bg-black/60 p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-white/10 shadow-inner overflow-x-auto custom-scrollbar flex-shrink max-w-[50%] sm:max-w-none">
                          {[
                            { id: "normal", label: getText("normal") },
                            {
                              id: "bass",
                              label: getText("bass"),
                              reqPremium: true,
                            },
                            {
                              id: "chipmunk",
                              label: getText("chipmunk"),
                              reqPremium: true,
                            },
                          ].map((eff) => (
                            <button
                              type="button"
                              key={eff.id}
                              onClick={() => {
                                if (eff.reqPremium && !settings.isPremium) {
                                  triggerToast(
                                    "Premium",
                                    "Фильтры только для Premium 💎",
                                  );
                                  return;
                                }
                                setVoiceEffect(eff.id);
                              }}
                              className={`text-[7px] sm:text-[8px] md:text-[9px] font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg transition-all active:scale-90 flex-shrink-0 ${
                                voiceEffect === eff.id
                                  ? "bg-rose-600 text-white shadow-md"
                                  : "text-zinc-500 hover:text-white hover:bg-white/10"
                              }`}
                            >
                              {eff.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (inputText.trim()) handleSendMessage();
                          }
                        }}
                        placeholder={
                          editingMsg ? getText("edit_msg") : getText("type_msg")
                        }
                        className={`w-full bg-transparent border-none focus:outline-none py-2.5 sm:py-3 px-2 sm:px-3 ${settings.theme === "light" ? "text-zinc-900" : "text-white"} font-medium text-xs sm:text-sm md:text-base resize-none max-h-24 sm:max-h-32 placeholder-zinc-500 custom-scrollbar ${
                          isBurnMode
                            ? "text-rose-400 placeholder-rose-500/50"
                            : ""
                        }`}
                        rows="1"
                        disabled={isRewriting}
                      />
                    </>
                  )}
                </div>

                {!isRecording && settings.aiTone !== "off" && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowRewriteMenu(!showRewriteMenu);
                      setShowAttachmentMenu(false);
                      setShowEmojiPicker(false);
                      setShowGiftPicker(false);
                    }}
                    disabled={!inputText.trim()}
                    className={`hidden sm:flex p-3 sm:p-4 rounded-full transition-all ${
                      inputText.trim()
                        ? "text-sky-400 hover:bg-[#3390ec]/10"
                        : "text-zinc-700"
                    }`}
                  >
                    {isRewriting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Sparkles size={20} />
                    )}
                  </button>
                )}

                {!isRecording && (
                  <div className="relative flex-shrink-0">
                    {showEmojiPicker && (
                      <div
                        className={`absolute bottom-[calc(100%+8px)] sm:bottom-[calc(100%+12px)] right-0 ${currentTheme.base} border ${currentTheme.border} rounded-2xl sm:rounded-2xl shadow-lg p-4 sm:p-5 z-50 w-[280px] sm:w-[380px] animate-spring-up origin-bottom-right backdrop-blur-3xl max-h-[350px] sm:max-h-[500px] overflow-y-auto custom-scrollbar`}
                      >
                        <div
                          className={`text-[8px] sm:text-[9px] text-[#3390ec] font-medium pb-2 sm:pb-2.5 mb-3 sm:mb-4 border-b ${currentTheme.border} tracking-[0.2em] flex items-center justify-between`}
                        >
                          <span>ЭМОДЗИ И СМАЙЛЫ</span>
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(false)}
                            className="hover:text-white transition-colors hover:rotate-90 bg-white/5 p-1 sm:p-1.5 rounded-full"
                          >
                            <X size={12} className="sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>

                        {Object.entries(customEmojis).map(([cat, list]) => (
                          <div key={cat} className="mb-4">
                            <h5 className="text-[7px] sm:text-[8px] text-zinc-500 font-medium tracking-[0.2em] mb-2 px-1">
                              {cat === "smiles"
                                ? "СМАЙЛИКИ"
                                : cat === "vibe"
                                  ? "ВАЙБ"
                                  : cat === "animals"
                                    ? "ЖИВОТНЫЕ"
                                    : cat === "food"
                                      ? "ЕДА"
                                      : "КАОМОДЗИ"}
                            </h5>
                            <div
                              className={
                                cat === "kaomoji"
                                  ? "grid grid-cols-2 gap-1.5"
                                  : "flex flex-wrap gap-1.5 sm:gap-2"
                              }
                            >
                              {list.map((em, i) => (
                                <button
                                  type="button"
                                  key={i}
                                  onClick={() =>
                                    setInputText((prev) => prev + em)
                                  }
                                  className={
                                    cat === "kaomoji"
                                      ? "text-[9px] sm:text-[11px] bg-[#17212b]/50 hover:bg-white/10 border border-white/5 rounded-xl p-2 transition-all active:scale-95 text-center text-zinc-300 font-medium shadow-inner truncate"
                                      : "text-lg sm:text-xl bg-[#17212b]/50 hover:bg-white/10 border border-white/5 rounded-xl w-8 h-8 sm:w-10 sm:h-10 transition-all hover:scale-125 active:scale-90 flex items-center justify-center shadow-inner"
                                  }
                                >
                                  {em}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmojiPicker(!showEmojiPicker);
                        setShowGiftPicker(false);
                        setShowAttachmentMenu(false);
                      }}
                      className={`p-2.5 sm:p-3 md:p-4 transition-all duration-300 rounded-[1rem] sm:rounded-xl mr-0.5 sm:mr-1 active:scale-90 flex items-center justify-center ${
                        showEmojiPicker
                          ? "bg-white/20 text-white shadow-md"
                          : `${settings.theme === "light" ? "text-zinc-400 hover:text-zinc-600 hover:bg-black/5" : "text-zinc-500 hover:text-white hover:bg-white/10"}`
                      }`}
                    >
                      <Smile
                        size={20}
                        className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                      />
                    </button>
                  </div>
                )}

                {!isRecording && activeChat?.id !== "ai" && (
                  <div className="relative flex-shrink-0">
                    {showGiftPicker && (
                      <div
                        className={`absolute bottom-[calc(100%+12px)] right-0 ${currentTheme.base} border ${currentTheme.border} rounded-2xl shadow-lg p-5 z-50 w-[360px] animate-spring-up origin-bottom-right backdrop-blur-3xl`}
                      >
                        <div
                          className={`flex items-center justify-between mb-5 border-b ${currentTheme.border} pb-3`}
                        >
                          <span className="text-xs font-medium text-white">
                            {getText("vip_gift")}
                          </span>
                          <div className="text-[9px] font-medium text-sky-400 bg-[#3390ec]/10 px-3 py-1.5 rounded-full border border-[#3390ec]/20 flex items-center gap-1.5 shadow-inner">
                            {settings.balance} <Gem size={12} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {premiumGifts.map((gift) => (
                            <button
                              type="button"
                              key={gift.id}
                              onClick={() => handleSendGift(gift)}
                              className="relative bg-[#17212b]/80 border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden"
                              style={{
                                boxShadow: `0 8px 25px rgba(0,0,0,0.3)`,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                  gift.border.split("-")[1];
                                e.currentTarget.style.boxShadow = `0 0 25px ${gift.glow}`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "";
                                e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.3)`;
                              }}
                            >
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${gift.grad} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                              ></div>
                              <span className="text-5xl mb-3 relative z-10 group-hover:animate-float drop-shadow-xl">
                                {gift.icon}
                              </span>
                              <span
                                className={`text-[10px] font-medium ${gift.text} mb-3 relative z-10 text-center leading-tight`}
                              >
                                {gift.name}
                              </span>
                              <span className="text-[9px] text-[#3390ec] font-medium bg-black/80 px-3 py-1.5 rounded-full relative z-10 flex items-center gap-1.5 border border-[#3390ec]/30 shadow-md group-hover:scale-110 transition-transform">
                                {gift.price} <Gem size={10} />
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowGiftPicker(!showGiftPicker);
                        setShowEmojiPicker(false);
                        setShowAttachmentMenu(false);
                      }}
                      className={`p-3 sm:p-4 transition-all duration-300 rounded-[1rem] sm:rounded-xl mr-1 active:scale-90 flex items-center justify-center ${
                        showGiftPicker
                          ? "bg-[#3390ec]/20 text-sky-400 border border-[#3390ec]/30 shadow-md"
                          : `${settings.theme === "light" ? "text-zinc-400 hover:text-[#3390ec] hover:bg-[#3390ec]/5" : "text-zinc-500 hover:text-sky-400 hover:bg-[#3390ec]/10"}`
                      }`}
                    >
                      <Gift size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </button>
                  </div>
                )}

                <div className="flex-shrink-0 flex items-center pr-1">
                  {inputText.trim() || isRecording ? (
                    <button
                      type="button"
                      onClick={
                        isRecording
                          ? toggleRecording
                          : () => handleSendMessage()
                      }
                      className={`p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-xl md:rounded-2xl shadow-xl md:shadow-lg transition-all duration-300 active:scale-90 flex items-center justify-center ${
                        isRecording
                          ? "bg-rose-600 text-white animate-pulse shadow-md md:shadow-md scale-105 sm:scale-110"
                          : `${currentAccent.bg} ${currentAccent.text} hover:-translate-y-1 md:hover:shadow-[0_10px_25px_rgba(255,255,255,0.2)]`
                      }`}
                    >
                      {isRecording ? (
                        <Square
                          size={18}
                          className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                          fill="currentColor"
                        />
                      ) : (
                        <Send
                          size={18}
                          className="sm:w-5 sm:h-5 md:w-6 md:h-6 ml-0.5 sm:ml-1"
                        />
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`p-3 sm:p-4 md:p-5 transition-all duration-300 rounded-2xl sm:rounded-xl md:rounded-2xl bg-[#242f3d] border border-white/5 text-zinc-400 hover:text-white hover:bg-[#2b3949] hover:shadow-lg md:hover:shadow-lg active:scale-90 flex items-center justify-center`}
                    >
                      <Mic size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========================================== */}
      {/* ⚙️ ОКНО НАСТРОЕК (АДАПТИВНОЕ) */}
      {/* ========================================== */}
      {showSettings && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-3xl p-0 sm:p-4 md:p-6 lg:p-8 animate-fade-in">
          <div
            className={`w-full h-full sm:h-[95vh] lg:h-[90vh] sm:max-w-4xl lg:max-w-6xl ${currentTheme.base} sm:border ${currentTheme.border} rounded-none sm:rounded-2xl lg:rounded-2xl shadow-md flex flex-col md:flex-row overflow-hidden animate-spring-up relative`}
          >
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className={`absolute top-4 sm:top-5 lg:top-6 right-4 sm:right-5 lg:right-6 p-2 sm:p-2.5 lg:p-3 bg-white/5 hover:bg-white/20 rounded-full text-zinc-400 hover:text-white transition-all z-50 hover:rotate-90 duration-300 shadow-xl backdrop-blur-md border border-white/10`}
            >
              <X size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>

            <div
              className={`w-full md:w-[240px] lg:w-[300px] bg-black/20 border-b md:border-b-0 md:border-r ${currentTheme.border} p-4 sm:p-5 lg:p-8 flex flex-col z-20 backdrop-blur-3xl flex-shrink-0 pt-12 sm:pt-6 md:pt-8`}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-white mb-4 sm:mb-6 lg:mb-10">
                {getText("settings")}
              </h2>
              <nav className="flex flex-row md:flex-col gap-2 sm:gap-2.5 lg:gap-3 overflow-x-auto md:overflow-y-auto custom-scrollbar pb-2 md:pb-0 md:pr-2">
                {[
                  {
                    id: "premium",
                    icon: Crown,
                    label: getText("s_prem"),
                    isPremiumBtn: true,
                  },
                  { id: "wallet", icon: Wallet, label: getText("s_wallet") },
                  { id: "profile", icon: User, label: getText("s_prof") },
                  { id: "appearance", icon: Palette, label: getText("s_app") },
                  {
                    id: "notifications",
                    icon: Bell,
                    label: getText("s_notif"),
                  },
                  { id: "privacy", icon: Shield, label: getText("s_priv") },
                  { id: "ai", icon: Bot, label: getText("s_ai") },
                  ...(isAdmin
                    ? [
                        {
                          id: "admin",
                          icon: ShieldAlert,
                          label: getText("s_admin"),
                          isPremiumBtn: false,
                        },
                      ]
                    : []),
                ].map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveSettingsTab(tab.id)}
                    className={`flex items-center gap-2.5 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 text-left whitespace-nowrap md:whitespace-normal text-[9px] sm:text-[10px] lg:text-xs font-medium flex-shrink-0 md:flex-shrink
 ${
   activeSettingsTab === tab.id
     ? tab.isPremiumBtn
       ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_5px_15px_rgba(245,158,11,0.4)] md:shadow-[0_10px_25px_rgba(245,158,11,0.4)] scale-100 md:scale-[1.02]"
       : "bg-white text-zinc-950 shadow-md md:shadow-xl scale-100 md:scale-[1.02]"
     : tab.isPremiumBtn
       ? "text-[#3390ec] hover:bg-[#3390ec]/10 border border-[#3390ec]/20"
       : "text-zinc-500 hover:bg-white/10 hover:text-white"
 }`}
                  >
                    <tab.icon
                      size={16}
                      className={`sm:w-[18px] sm:h-[18px] lg:w-[22px] lg:h-[22px] flex-shrink-0 ${
                        activeSettingsTab === tab.id && !tab.isPremiumBtn
                          ? "text-zinc-950"
                          : ""
                      }`}
                    />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div
              className={`flex-1 ${currentTheme.panel} p-4 sm:p-6 lg:p-12 overflow-y-auto custom-scrollbar relative z-10`}
            >
              <div className="max-w-3xl mx-auto animate-slide-up pb-8 sm:pb-10">
                {activeSettingsTab === "premium" && (
                  <div className="space-y-6 sm:space-y-10 animate-fade-in">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-2xl bg-gradient-to-br from-indigo-950/80 via-purple-900/40 to-rose-950/80 p-6 sm:p-8 lg:p-12 border border-white/10 shadow-xl lg:shadow-lg backdrop-blur-3xl">
                      <div className="absolute top-0 right-0 -mr-10 sm:-mr-20 -mt-10 sm:-mt-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-[#3390ec]/20 rounded-full blur-[40px] sm:blur-[80px] animate-pulse-slow"></div>

                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-amber-300 via-amber-500 to-blue-600 rounded-[1rem] sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 shadow-md lg:shadow-md animate-float border border-white/20">
                          <Crown
                            size={32}
                            className="sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-white"
                          />
                        </div>
                        <h3 className="text-2xl sm:text-4xl lg:text-6xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-blue-600 mb-3 sm:mb-4 lg:mb-6 drop-shadow-xl lg:drop-shadow-lg leading-none">
                          Platina
                          <br />
                          Premium
                        </h3>

                        {!settings.isPremium ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 w-full max-w-2xl mb-6 sm:mb-8 lg:mb-12 text-left mt-6">
                              {[
                                "Золотая аура вокруг профиля",
                                "AI-Расшифровка любых голосовых",
                                "Премиум-фильтры (Басс, Писк)",
                                "Эксклюзивные эмодзи и реакции",
                                "Темы OLED и Дракула",
                                "Режим невидимки",
                              ].map((perk, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2.5 sm:gap-3 lg:gap-4 bg-black/40 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl lg:rounded-2xl border border-white/5 shadow-inner hover:bg-black/60 transition-colors group"
                                >
                                  <div className="bg-[#3390ec]/20 p-1 sm:p-1.5 rounded-full group-hover:scale-110 transition-transform flex-shrink-0">
                                    <CheckCircle2
                                      size={14}
                                      className="sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-sky-400 drop-shadow-md"
                                    />
                                  </div>
                                  <span className="text-[9px] sm:text-[10px] lg:text-xs text-white leading-snug font-medium mt-0.5 sm:mt-1">
                                    {perk}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="w-full max-w-2xl mb-6 sm:mb-8 lg:mb-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
                              {premiumPlans.map((plan) => (
                                <div
                                  key={plan.id}
                                  onClick={() =>
                                    setSelectedPremiumPlan(plan.id)
                                  }
                                  className={`flex-1 relative cursor-pointer rounded-xl sm:rounded-2xl lg:rounded-2xl border-2 p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 ${
                                    selectedPremiumPlan === plan.id
                                      ? "border-[#3390ec] bg-[#3390ec]/10 shadow-[0_5px_15px_rgba(245,158,11,0.2)] lg:shadow-[0_15px_40px_rgba(245,158,11,0.2)]"
                                      : "border-white/5 bg-black/30 hover:border-white/20"
                                  }`}
                                >
                                  {plan.badge && (
                                    <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-orange-500 text-amber-950 text-[8px] sm:text-[9px] lg:text-[10px] font-medium px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full shadow-lg lg:shadow-xl tracking-[0.2em] whitespace-nowrap">
                                      {plan.badge}
                                    </div>
                                  )}
                                  <div
                                    className={`text-[9px] sm:text-[10px] lg:text-xs font-medium mb-1.5 sm:mb-2 lg:mb-3 ${
                                      selectedPremiumPlan === plan.id
                                        ? "text-sky-400"
                                        : "text-zinc-500"
                                    }`}
                                  >
                                    {lang === "ru" ? plan.name : plan.nameEn}
                                  </div>
                                  <div className="text-xl sm:text-2xl lg:text-3xl font-medium text-white">
                                    {plan.price}
                                  </div>
                                  {plan.oldPrice && (
                                    <div className="text-[9px] sm:text-[10px] lg:text-xs text-zinc-600 line-through mt-1 sm:mt-1.5 lg:mt-2 font-medium">
                                      {plan.oldPrice}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={handlePurchasePremium}
                              disabled={isPurchasing}
                              className="w-full max-w-md py-3 sm:py-4 lg:py-6 bg-gradient-to-r from-sky-500 via-amber-500 to-blue-600 hover:from-amber-300 hover:to-orange-500 text-amber-950 font-medium text-sm sm:text-base lg:text-xl rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-[0_10px_20px_rgba(245,158,11,0.4)] lg:shadow-[0_20px_50px_rgba(245,158,11,0.5)] transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4"
                            >
                              {isPurchasing ? (
                                <Loader2 className="animate-spin text-amber-950 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                              ) : (
                                <Crown className="text-amber-950 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                              )}
                              {isPurchasing
                                ? "ОФОРМЛЕНИЕ..."
                                : "ПОЛУЧИТЬ PREMIUM"}
                            </button>
                          </>
                        ) : (
                          <div className="bg-black/60 p-6 sm:p-8 lg:p-12 rounded-xl sm:rounded-2xl lg:rounded-2xl border border-[#3390ec]/50 w-full max-w-xl backdrop-blur-2xl shadow-md lg:shadow-md animate-spring-up mt-6">
                            <h4 className="text-xl sm:text-2xl lg:text-4xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-orange-500 mb-3 sm:mb-4 lg:mb-6">
                              СТАТУС АКТИВЕН
                            </h4>
                            <p className="text-[10px] sm:text-xs lg:text-base text-zinc-300 mb-6 sm:mb-8 lg:mb-10 font-medium leading-relaxed">
                              Клуб Легенд открыт. Тебе доступны все скрытые
                              возможности платформы.
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                updateSettingField("isPremium", false)
                              }
                              className="text-[8px] sm:text-[9px] lg:text-[10px] font-medium text-zinc-500 hover:text-rose-500 transition-colors tracking-[0.3em] bg-white/5 hover:bg-rose-500/10 py-2 sm:py-2.5 lg:py-3 px-3 sm:px-4 lg:px-6 rounded-lg sm:rounded-xl lg:rounded-2xl border border-transparent hover:border-rose-500/20"
                            >
                              Отключить (Dev)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === "wallet" && (
                  <div className="space-y-6 sm:space-y-10 animate-fade-in">
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 sm:p-8 lg:p-12 rounded-xl sm:rounded-2xl lg:rounded-2xl border border-[#2b3949] shadow-xl lg:shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 -mr-10 -mt-10 sm:-mr-20 sm:-mt-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-cyan-500/20 rounded-full blur-[40px] sm:blur-[80px] lg:blur-[100px] animate-pulse-slow"></div>
                      <div className="relative z-10 flex flex-col items-center text-center mb-8 sm:mb-10 lg:mb-12">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 shadow-md lg:shadow-md animate-bounce-slow border border-white/20">
                          <Wallet className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-950" />
                        </div>
                        <h3 className="text-zinc-500 tracking-[0.3em] text-[8px] sm:text-[9px] lg:text-[10px] font-medium mb-2 sm:mb-3 lg:mb-4">
                          {getText("balance")}
                        </h3>
                        <div className="text-3xl sm:text-5xl lg:text-7xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 to-cyan-600 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 drop-shadow-xl lg:drop-shadow-lg">
                          {settings.balance}
                          {""}
                          <Gem className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-cyan-400 fill-cyan-400" />
                        </div>
                      </div>
                      <h4 className="text-[10px] sm:text-xs lg:text-sm font-medium text-white mb-3 sm:mb-4 lg:mb-6 tracking-[0.2em] border-b border-white/5 pb-2 sm:pb-3 lg:pb-4 text-center sm:text-left">
                        {getText("top_up")}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                        {[
                          {
                            id: "pack1",
                            amount: 100,
                            price: "99 ₽",
                            bonus: "",
                          },
                          {
                            id: "pack2",
                            amount: 500,
                            price: "399 ₽",
                            bonus: "+50 💎",
                          },
                          {
                            id: "pack3",
                            amount: 1000,
                            price: "699 ₽",
                            bonus: "+150 💎",
                            popular: true,
                          },
                          {
                            id: "pack4",
                            amount: 5000,
                            price: "2999 ₽",
                            bonus: "+1000 💎",
                          },
                        ].map((pack) => (
                          <div
                            key={pack.id}
                            className={`p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-2xl border-2 ${
                              pack.popular
                                ? "border-cyan-500/50 bg-cyan-500/10 shadow-md sm:scale-[1.02]"
                                : "border-white/5 bg-black/40 hover:bg-black/60"
                            } flex flex-col sm:flex-row items-center justify-between transition-all duration-300 sm:hover:-translate-y-1 relative overflow-hidden group gap-2 sm:gap-3 lg:gap-4`}
                          >
                            {pack.popular && (
                              <div className="absolute top-0 right-0 bg-gradient-to-bl from-cyan-400 to-blue-600 text-white text-[7px] sm:text-[8px] lg:text-[9px] font-medium px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-1.5 rounded-bl-lg sm:rounded-bl-xl lg:rounded-bl-2xl shadow-lg">
                                {getText("hit")}
                              </div>
                            )}
                            <div className="text-center sm:text-left w-full sm:w-auto">
                              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 lg:gap-3 text-lg sm:text-2xl lg:text-3xl font-medium text-white">
                                {pack.amount}
                                {""}
                                <Gem className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-cyan-400 fill-cyan-400 group-hover:animate-pulse" />
                              </div>
                              {pack.bonus && (
                                <div className="text-[8px] sm:text-[9px] lg:text-[10px] text-cyan-400 font-medium mt-1 sm:mt-1.5 lg:mt-2 bg-cyan-500/10 inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border border-cyan-500/20">
                                  {pack.bonus}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleBuyCoins(pack.id, pack.amount)
                              }
                              disabled={buyingPackId !== null}
                              className={`w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-[10px] sm:text-xs lg:text-sm font-medium transition-all active:scale-95 flex items-center justify-center ${
                                buyingPackId === pack.id
                                  ? "bg-[#242f3d] text-zinc-500"
                                  : "bg-white text-zinc-950 hover:bg-zinc-200 shadow-md lg:shadow-xl"
                              }`}
                            >
                              {buyingPackId === pack.id ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                                />
                              ) : (
                                pack.price
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === "profile" && (
                  <div className="space-y-6 sm:space-y-8 lg:space-y-12 animate-fade-in">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white mb-4 sm:mb-6 lg:mb-8 border-b border-white/5 pb-2 sm:pb-3 lg:pb-4 text-center sm:text-left">
                      {getText("s_prof")}
                    </h3>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 lg:gap-10">
                      <div
                        className="relative group cursor-pointer flex-shrink-0"
                        onClick={() => profileAvatarRef.current?.click()}
                      >
                        <div
                          className={`p-1 sm:p-1.5 lg:p-2 rounded-full ${
                            settings.isPremium
                              ? "bg-gradient-to-tr from-sky-500 to-blue-600 animate-pulse-slow shadow-md lg:shadow-md"
                              : "bg-[#242f3d]"
                          }`}
                        >
                          <img
                            src={
                              settings.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserAcc}`
                            }
                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-[#17212b] border border-[#e4e4e4] object-cover group-hover:opacity-50 transition-opacity"
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <span className="text-[7px] sm:text-[9px] lg:text-[10px] font-medium text-white bg-black/60 px-2.5 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full backdrop-blur-md border border-white/10">
                            СМЕНИТЬ
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3 sm:space-y-4 lg:space-y-6 w-full">
                        <div className="bg-black/20 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-2xl border border-white/5 shadow-inner">
                          <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-medium text-zinc-500 ml-1 lg:ml-2 tracking-[0.2em]">
                            {getText("disp_name")}
                          </label>
                          <input
                            type="text"
                            value={settings.username}
                            onChange={(e) =>
                              updateSettingField("username", e.target.value)
                            }
                            className="w-full bg-black/40 border border-[#2b3949] rounded-lg sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 mt-1.5 sm:mt-2 lg:mt-3 focus:outline-none focus:border-[#3390ec] transition-all text-white font-medium text-xs sm:text-sm lg:text-lg placeholder-zinc-700"
                          />
                        </div>
                        <div className="bg-black/20 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-2xl border border-white/5 shadow-inner">
                          <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-medium text-zinc-500 ml-1 lg:ml-2 tracking-[0.2em]">
                            {getText("bio")}
                          </label>
                          <input
                            type="text"
                            value={settings.bio || ""}
                            onChange={(e) =>
                              updateSettingField("bio", e.target.value)
                            }
                            className="w-full bg-black/40 border border-[#2b3949] rounded-lg sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 mt-1.5 sm:mt-2 lg:mt-3 focus:outline-none focus:border-[#3390ec] transition-all text-white font-medium text-xs sm:text-sm lg:text-lg placeholder-zinc-700"
                          />
                        </div>
                        {/* ДЕНЬ РОЖДЕНИЯ В НАСТРОЙКАХ */}
                        <div className="bg-black/20 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-2xl border border-white/5 shadow-inner">
                          <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-medium text-zinc-500 ml-1 lg:ml-2 tracking-[0.2em]">
                            {getText("birthday")}
                          </label>
                          <input
                            type="date"
                            value={settings.birthday || ""}
                            onChange={(e) =>
                              updateSettingField("birthday", e.target.value)
                            }
                            className={`w-full bg-black/40 border border-[#2b3949] rounded-lg sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 mt-1.5 sm:mt-2 lg:mt-3 focus:outline-none focus:border-[#3390ec] transition-all font-medium text-xs sm:text-sm lg:text-lg ${
                              settings.birthday ? "text-white" : "text-zinc-600"
                            }`}
                          />
                        </div>

                        {/* ЗНАЧОК ПРОФИЛЯ */}
                        {settings.activeBadge && (
                          <div className="bg-[#3390ec]/10 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-2xl border border-[#3390ec]/20 shadow-inner flex items-center justify-between gap-4">
                            <div>
                              <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-medium text-[#3390ec] tracking-[0.2em]">
                                ТЕКУЩИЙ СТАТУС-ЗНАЧОК
                              </label>
                              <div className="text-3xl mt-2 drop-shadow-md animate-bounce-slow">
                                {settings.activeBadge}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                updateSettingField("activeBadge", null)
                              }
                              className="bg-black/50 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 px-4 py-3 rounded-xl font-medium text-[10px] transition-colors active:scale-95"
                            >
                              {getText("unpin_badge")}
                            </button>
                          </div>
                        )}

                        <div className="bg-black/20 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-2xl border border-white/5 shadow-inner">
                          <label className="text-[8px] sm:text-[9px] lg:text-[10px] font-medium text-zinc-500 ml-1 lg:ml-2 tracking-[0.2em]">
                            ТВОЙ ID ДЛЯ ДРУЗЕЙ
                          </label>
                          <div className="relative mt-1.5 sm:mt-2 lg:mt-3 group/copy flex flex-col sm:flex-row gap-2 sm:gap-0 sm:block">
                            <input
                              type="text"
                              value={currentUserAcc}
                              readOnly
                              className="w-full bg-black/60 border border-[#2b3949]/50 rounded-lg sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 focus:outline-none text-zinc-500 font-mono cursor-not-allowed text-[10px] sm:text-xs lg:text-sm text-center sm:text-left"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(currentUserAcc);
                                triggerToast("Успех", "ID СКОПИРОВАН!");
                              }}
                              className="sm:absolute sm:right-2 lg:right-3 sm:top-1/2 sm:-translate-y-1/2 w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white text-[8px] sm:text-[9px] lg:text-[10px] font-medium px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl transition-colors active:scale-95 border border-white/5"
                            >
                              КОПИРОВАТЬ
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === "appearance" && (
                  <div className="space-y-8 sm:space-y-10 lg:space-y-12 animate-fade-in">
                    <h3 className="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-6 lg:mb-8 border-b border-white/5 pb-3 sm:pb-4 text-center sm:text-left">
                      {getText("s_app")}
                    </h3>

                    {/* НОВАЯ ФИЧА: ОПТИМИЗАЦИЯ */}
                    <div className="bg-[#3390ec]/10 border border-[#3390ec]/20 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-2xl">
                      <h4 className="text-[9px] sm:text-[10px] lg:text-xs text-[#3390ec] mb-3 sm:mb-4 lg:mb-5 tracking-[0.2em] font-medium flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                        <Zap
                          size={14}
                          className="sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                        />
                        {""}
                        {getText("perf_mode")}
                      </h4>
                      <div className="flex flex-col sm:flex-row bg-black/40 rounded-xl sm:rounded-2xl lg:rounded-2xl p-1 sm:p-1.5 lg:p-2 border border-white/5 shadow-inner gap-1 sm:gap-0">
                        {[
                          { id: "ultra", label: getText("perf_ultra") },
                          { id: "lite", label: getText("perf_lite") },
                        ].map((m) => (
                          <button
                            type="button"
                            key={m.id}
                            onClick={() => updateSettingField("perfMode", m.id)}
                            className={`flex-1 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-[9px] sm:text-[10px] lg:text-[11px] font-medium transition-all duration-300 ${
                              settings.perfMode === m.id
                                ? "bg-[#3390ec] text-amber-950 shadow-md lg:shadow-xl sm:scale-[1.02]"
                                : "text-zinc-500 hover:text-white sm:hover:bg-white/5"
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-[#3390ec]/60 mt-2 sm:mt-3 font-medium text-center sm:text-left">
                        Если телефон греется или лагает чат — включи режим LITE.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        <Globe className="inline mb-1 mr-1" size={12} />
                        {""}
                        {getText("s_lang")}
                      </h4>
                      <div className="flex bg-black/40 rounded-xl sm:rounded-2xl lg:rounded-2xl p-1 sm:p-1.5 lg:p-2 border border-white/5 shadow-inner">
                        {[
                          { id: "ru", label: "РУССКИЙ" },
                          { id: "en", label: "ENGLISH" },
                        ].map((l) => (
                          <button
                            type="button"
                            key={l.id}
                            onClick={() => updateSettingField("lang", l.id)}
                            className={`flex-1 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-[9px] sm:text-[10px] lg:text-[11px] font-medium transition-all duration-300 ${
                              settings.lang === l.id
                                ? "bg-indigo-600 text-white shadow-md lg:shadow-xl sm:scale-[1.02]"
                                : "text-zinc-500 hover:text-white sm:hover:bg-white/5"
                            }`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        {getText("theme")}
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                        {Object.values(themesMap).map((t) => {
                          const isLocked =
                            !settings.isPremium &&
                            (t.id === "oled" || t.id === "dracula");
                          return (
                            <div
                              key={t.id}
                              onClick={() => {
                                if (isLocked) {
                                  setActiveSettingsTab("premium");
                                  triggerToast(
                                    "Premium",
                                    "Тема доступна в Premium",
                                  );
                                } else updateSettingField("theme", t.id);
                              }}
                              className={`cursor-pointer p-2.5 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl lg:rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group sm:hover:-translate-y-1 ${
                                settings.theme === t.id
                                  ? "border-white bg-white/10 shadow-[0_5px_15px_rgba(255,255,255,0.1)] lg:shadow-[0_10px_20px_rgba(255,255,255,0.1)] scale-[1.02]"
                                  : "border-[#2b3949] bg-[#17212b]/50 hover:border-[#2b3949]"
                              } ${
                                isLocked
                                  ? "opacity-50 hover:opacity-80 grayscale"
                                  : ""
                              }`}
                            >
                              {isLocked && (
                                <div className="absolute top-1.5 sm:top-2 lg:top-3 right-1.5 sm:right-2 lg:right-3 z-10 text-[#3390ec] bg-black/60 p-1 sm:p-1.5 lg:p-2 rounded-full backdrop-blur-md shadow-lg border border-[#3390ec]/20">
                                  <Crown
                                    size={10}
                                    className="sm:w-3 lg:w-3.5 sm:h-3 lg:h-3.5"
                                  />
                                </div>
                              )}
                              <div
                                className={`w-full h-12 sm:h-16 lg:h-24 rounded-lg sm:rounded-xl lg:rounded-2xl mb-2 sm:mb-3 lg:mb-4 border border-white/10 flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-105 ${t.base}`}
                              >
                                {settings.theme === t.id && (
                                  <Check
                                    size={20}
                                    className="sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white drop-shadow-lg animate-spring-up"
                                  />
                                )}
                              </div>
                              <p className="text-center font-medium text-[9px] sm:text-[10px] lg:text-xs text-white truncate">
                                {t.name}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        {getText("accent")}
                      </h4>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 lg:gap-5 bg-black/20 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-2xl border border-white/5">
                        {[
                          { id: "zinc", color: "bg-zinc-200", name: "PLATINA" },
                          { id: "amber", color: "bg-sky-400", name: "GOLD" },
                          {
                            id: "indigo",
                            color: "bg-indigo-500",
                            name: "NEON",
                          },
                          { id: "rose", color: "bg-rose-500", name: "BLOOD" },
                        ].map((acc) => (
                          <div
                            key={acc.id}
                            onClick={() => updateSettingField("accent", acc.id)}
                            className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 cursor-pointer group w-12 sm:w-16 lg:w-auto"
                          >
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full ${
                                acc.color
                              } flex items-center justify-center shadow-xl lg:shadow-lg transition-all duration-300 group-hover:scale-110 active:scale-90 ${
                                settings.accent === acc.id
                                  ? "ring-[2px] sm:ring-[3px] lg:ring-4 ring-offset-[2px] sm:ring-offset-[3px] lg:ring-offset-4 ring-offset-zinc-950 ring-white scale-110"
                                  : ""
                              }`}
                            >
                              {settings.accent === acc.id && (
                                <Check
                                  size={20}
                                  className="sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-zinc-950 animate-spring-up"
                                />
                              )}
                            </div>
                            <span
                              className={`text-[7px] sm:text-[8px] lg:text-[9px] tracking-[0.2em] text-center truncate w-full ${
                                settings.accent === acc.id
                                  ? "text-white font-medium"
                                  : "text-zinc-600 font-medium"
                              }`}
                            >
                              {acc.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        {getText("font_size")}
                      </h4>
                      <div className="flex flex-col sm:flex-row bg-black/40 rounded-xl sm:rounded-2xl lg:rounded-2xl p-1 sm:p-1.5 lg:p-2 border border-white/5 shadow-inner gap-1 sm:gap-0">
                        {[
                          { id: "text-sm", label: "MINI" },
                          { id: "text-[15px]", label: "NORM" },
                          { id: "text-base", label: "BIG" },
                          { id: "text-lg", label: "MAX" },
                        ].map((size) => (
                          <button
                            type="button"
                            key={size.id}
                            onClick={() =>
                              updateSettingField("fontSize", size.id)
                            }
                            className={`flex-1 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-[8px] sm:text-[9px] lg:text-[10px] xl:text-xs transition-all duration-300 ${
                              settings.fontSize === size.id
                                ? "bg-white text-zinc-950 font-medium shadow-md lg:shadow-xl sm:scale-[1.02]"
                                : "text-zinc-500 hover:text-white sm:hover:bg-white/5 font-medium"
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        {getText("bubble_style")}
                      </h4>
                      <div className="flex flex-col sm:flex-row bg-black/40 rounded-xl sm:rounded-2xl lg:rounded-2xl p-1 sm:p-1.5 lg:p-2 border border-white/5 shadow-inner gap-1 sm:gap-0">
                        {[
                          { id: "rounded", label: getText("rounded_style") },
                          { id: "sharp", label: getText("sharp_style") },
                        ].map((st) => (
                          <button
                            type="button"
                            key={st.id}
                            onClick={() =>
                              updateSettingField("bubbleStyle", st.id)
                            }
                            className={`flex-1 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-[8px] sm:text-[9px] lg:text-[10px] xl:text-xs transition-all duration-300 ${
                              settings.bubbleStyle === st.id
                                ? "bg-white text-zinc-950 font-medium shadow-md lg:shadow-xl sm:scale-[1.02]"
                                : "text-zinc-500 hover:text-white sm:hover:bg-white/5 font-medium"
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        ПРОЗРАЧНОСТЬ ПУЗЫРЕЙ (
                        {Math.round(settings.bubbleOpacity * 100)}%)
                      </h4>
                      <div className="bg-black/40 rounded-xl sm:rounded-2xl lg:rounded-2xl p-4 border border-white/5 shadow-inner">
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.05"
                          value={settings.bubbleOpacity}
                          onChange={(e) =>
                            updateSettingField(
                              "bubbleOpacity",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-2xl flex items-center justify-between">
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 tracking-[0.3em] font-medium">
                        ЭФФЕКТ СТЕКЛА (BLUR)
                      </h4>
                      <Toggle
                        accent={settings.accent}
                        checked={settings.glassEffect}
                        onChange={(v) => updateSettingField("glassEffect", v)}
                      />
                    </div>

                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        ОБОИ ЧАТА
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {[
                          { id: "dots", label: "Точки" },
                          { id: "grid", label: "Сетка" },
                          { id: "lines", label: "Линии" },
                          { id: "custom", label: "Свои" },
                        ].map((w) => (
                          <button
                            key={w.id}
                            onClick={() =>
                              updateSettingField("wallpaper", w.id)
                            }
                            className={`py-2 rounded-xl text-[9px] font-medium transition-all ${
                              settings.wallpaper === w.id
                                ? "bg-[#3390ec] text-amber-950"
                                : "bg-black/40 text-zinc-500 hover:text-white"
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                      {settings.wallpaper === "custom" && (
                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col gap-3">
                          <input
                            type="text"
                            placeholder="URL картинки..."
                            value={settings.customWallpaper || ""}
                            onChange={(e) =>
                              updateSettingField(
                                "customWallpaper",
                                e.target.value,
                              )
                            }
                            className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#3390ec] transition-all"
                          />
                          <p className="text-[8px] text-zinc-500 font-medium text-center">
                            Или выбери файл ниже
                          </p>
                          <button
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) =>
                                  updateSettingField(
                                    "customWallpaper",
                                    ev.target.result,
                                  );
                                reader.readAsDataURL(file);
                              };
                              input.click();
                            }}
                            className="bg-white/10 hover:bg-white/20 py-2 rounded-xl text-[9px] font-medium text-white transition-all"
                          >
                            ВЫБРАТЬ ФАЙЛ
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        СКОРОСТЬ АНИМАЦИЙ ({settings.animationSpeed}x)
                      </h4>
                      <div className="bg-black/40 rounded-xl sm:rounded-2xl lg:rounded-2xl p-4 border border-white/5 shadow-inner">
                        <input
                          type="range"
                          min="0.1"
                          max="2"
                          step="0.1"
                          value={settings.animationSpeed}
                          onChange={(e) =>
                            updateSettingField(
                              "animationSpeed",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full accent-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        ГРОМКОСТЬ УВЕДОМЛЕНИЙ (
                        {Math.round(settings.messageVolume * 100)}%)
                      </h4>
                      <div className="bg-black/40 rounded-xl sm:rounded-2xl lg:rounded-2xl p-4 border border-white/5 shadow-inner">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={settings.messageVolume}
                          onChange={(e) =>
                            updateSettingField(
                              "messageVolume",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full accent-rose-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        {getText("density")}
                      </h4>
                      <div className="flex flex-col sm:flex-row bg-black/40 rounded-xl sm:rounded-2xl lg:rounded-2xl p-1 sm:p-1.5 lg:p-2 border border-white/5 shadow-inner gap-1 sm:gap-0">
                        {[
                          { id: "normal", label: getText("normal_density") },
                          { id: "compact", label: getText("compact") },
                        ].map((d) => (
                          <button
                            type="button"
                            key={d.id}
                            onClick={() =>
                              updateSettingField("messageDensity", d.id)
                            }
                            className={`flex-1 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-[8px] sm:text-[9px] lg:text-[10px] xl:text-xs transition-all duration-300 ${
                              settings.messageDensity === d.id
                                ? "bg-white text-zinc-950 font-medium shadow-md lg:shadow-xl sm:scale-[1.02]"
                                : "text-zinc-500 hover:text-white sm:hover:bg-white/5 font-medium"
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === "notifications" && (
                  <div className="space-y-6 sm:space-y-8 animate-fade-in">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white mb-4 sm:mb-6 lg:mb-8 border-b border-white/5 pb-2 sm:pb-3 lg:pb-4 text-center sm:text-left">
                      {getText("s_notif")}
                    </h3>
                    <div className="bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl lg:shadow-lg mb-6">
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-5 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        СКОРОСТЬ ЧТЕНИЯ ТЕКСТА ({settings.readingSpeed}x)
                      </h4>
                      <div className="bg-black/40 rounded-xl sm:rounded-2xl lg:rounded-2xl p-4 border border-white/5 shadow-inner">
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={settings.readingSpeed}
                          onChange={(e) =>
                            updateSettingField(
                              "readingSpeed",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full accent-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl lg:rounded-2xl overflow-hidden shadow-xl lg:shadow-lg">
                      <div className="p-4 sm:p-6 lg:p-8 flex flex-row items-center justify-between sm:hover:bg-white/5 transition-colors border-b border-white/5 gap-2 sm:gap-4 lg:gap-0 text-left">
                        <div className="min-w-0">
                          <p className="font-medium text-white text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1 truncate">
                            {getText("sounds")}
                          </p>
                        </div>
                        <Toggle
                          accent={settings.accent}
                          checked={settings.soundEnabled}
                          onChange={(v) =>
                            updateSettingField("soundEnabled", v)
                          }
                        />
                      </div>
                      <div className="p-4 sm:p-6 lg:p-8 flex flex-row items-center justify-between sm:hover:bg-white/5 transition-colors gap-2 sm:gap-4 lg:gap-0 text-left">
                        <div className="min-w-0">
                          <p className="font-medium text-white text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1 truncate">
                            {getText("toasts")}
                          </p>
                        </div>
                        <Toggle
                          accent={settings.accent}
                          checked={settings.pushEnabled}
                          onChange={(v) => updateSettingField("pushEnabled", v)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === "privacy" && (
                  <div className="space-y-6 sm:space-y-8 animate-fade-in">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white mb-4 sm:mb-6 lg:mb-8 border-b border-white/5 pb-2 sm:pb-3 lg:pb-4 text-center sm:text-left">
                      {getText("s_priv")}
                    </h3>

                    <div className="bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl lg:shadow-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white text-xs sm:text-sm mb-1">
                          СКРЫТЬ ПРОФИЛЬ (BLUR)
                        </p>
                        <p className="text-[8px] text-zinc-500 font-medium">
                          Твой аватар будет размыт для всех
                        </p>
                      </div>
                      <Toggle
                        accent={settings.accent}
                        checked={settings.profileBlur}
                        onChange={(v) => updateSettingField("profileBlur", v)}
                      />
                    </div>
                    <div className="bg-black/30 border border-white/5 rounded-xl sm:rounded-2xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl lg:shadow-lg">
                      <label className="block text-[8px] sm:text-[9px] lg:text-[10px] font-medium text-zinc-500 tracking-[0.3em] mb-2 sm:mb-3 lg:mb-4 lg:ml-2 text-center sm:text-left">
                        {getText("status")}
                      </label>
                      <div className="relative">
                        <select
                          value={settings.lastSeen}
                          onChange={(e) => {
                            if (
                              e.target.value === "nobody" &&
                              !settings.isPremium
                            ) {
                              triggerToast(
                                "Premium",
                                "Режим Невидимки только для Premium 💎",
                              );
                              setActiveSettingsTab("premium");
                              return;
                            }
                            updateSettingField("lastSeen", e.target.value);
                          }}
                          className="w-full bg-black/50 border-2 border-[#2b3949] hover:border-[#2b3949] rounded-lg sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 text-[10px] sm:text-xs lg:text-sm text-white focus:outline-none focus:border-[#3390ec] font-medium transition-all cursor-pointer appearance-none shadow-inner text-center sm:text-left"
                        >
                          <option value="everyone">
                            {getText("everyone")}
                          </option>
                          <option value="contacts">
                            {getText("contacts_only")}
                          </option>
                          <option value="nobody">{getText("nobody")}</option>
                        </select>
                        <div className="absolute right-3 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                          ▼
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === "ai" && (
                  <div className="space-y-8 sm:space-y-10 lg:space-y-12 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10 text-center sm:text-left bg-black/20 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-2xl lg:rounded-2xl border border-white/5">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-xl sm:rounded-2xl lg:rounded-2xl flex items-center justify-center shadow-md lg:shadow-md animate-pulse-slow border border-white/20 flex-shrink-0">
                        <Bot className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-2xl sm:text-3xl lg:text-5xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-indigo-200 to-purple-500 mb-1 sm:mb-2 leading-none truncate">
                          PLATINA AI
                        </h3>
                        <p className="text-zinc-400 font-medium text-[8px] sm:text-[10px] lg:text-xs tracking-[0.2em] mt-1 sm:mt-2 lg:mt-0 truncate">
                          Нейросеть Google Gemini внутри чата.
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[8px] sm:text-[9px] lg:text-[10px] text-zinc-500 mb-3 sm:mb-4 lg:mb-6 tracking-[0.3em] font-medium text-center sm:text-left lg:ml-2">
                        {getText("ai_tone")}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                        {[
                          {
                            id: "formal",
                            title: getText("formal"),
                            icon: "👔",
                          },
                          {
                            id: "friendly",
                            title: getText("friendly"),
                            icon: "👋",
                          },
                          { id: "slang", title: getText("slang"), icon: "💿" },
                        ].map((tone) => (
                          <div
                            key={tone.id}
                            onClick={() =>
                              updateSettingField("aiTone", tone.id)
                            }
                            className={`p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col items-center text-center ${
                              settings.aiTone === tone.id
                                ? "border-indigo-500 bg-indigo-500/10 shadow-[0_10px_20px_rgba(99,102,241,0.2)] lg:shadow-[0_20px_40px_rgba(99,102,241,0.2)] scale-[1.02]"
                                : "border-white/5 bg-black/40 hover:bg-black/60"
                            }`}
                          >
                            <span className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 lg:mb-6 drop-shadow-lg">
                              {tone.icon}
                            </span>
                            <p
                              className={`font-medium text-[10px] sm:text-xs lg:text-sm mb-1.5 sm:mb-2 lg:mb-3 ${
                                settings.aiTone === tone.id
                                  ? "text-indigo-400"
                                  : "text-white"
                              }`}
                            >
                              {tone.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === "admin" && isAdmin && (
                  <div className="space-y-6 sm:space-y-8 animate-fade-in">
                    <h3
                      className={`text-xl sm:text-2xl font-medium ${settings.theme === "light" ? "text-indigo-600" : "text-rose-500"} mb-4 border-b ${currentTheme.border} pb-3 flex items-center gap-3`}
                    >
                      <ShieldAlert
                        size={28}
                        className="animate-pulse drop-shadow-md"
                      />
                      {""}
                      АДМИН ПАНЕЛЬ
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <div
                        className={`${settings.theme === "light" ? "bg-emerald-50 border-emerald-100" : "bg-emerald-500/10 border-rose-500/20"} border p-4 rounded-2xl shadow-sm`}
                      >
                        <p
                          className={`text-[9px] ${settings.theme === "light" ? "text-emerald-600" : "text-emerald-500"} font-medium mb-1`}
                        >
                          В СЕТИ
                        </p>
                        <p
                          className={`text-xl font-medium ${settings.theme === "light" ? "text-zinc-900" : "text-white"}`}
                        >
                          {onlineCount}
                        </p>
                      </div>
                      <div
                        className={`${settings.theme === "light" ? "bg-indigo-50 border-indigo-100" : "bg-rose-500/10 border-rose-500/20"} border p-4 rounded-2xl shadow-sm`}
                      >
                        <p
                          className={`text-[9px] ${settings.theme === "light" ? "text-indigo-600" : "text-rose-500"} font-medium mb-1`}
                        >
                          ЮЗЕРЫ
                        </p>
                        <p
                          className={`text-xl font-medium ${settings.theme === "light" ? "text-zinc-900" : "text-white"}`}
                        >
                          {adminUsersList.length}
                        </p>
                      </div>
                      <div
                        className={`${settings.theme === "light" ? "bg-amber-50 border-amber-100" : "bg-[#3390ec]/10 border-[#3390ec]/20"} border p-4 rounded-2xl shadow-sm`}
                      >
                        <p
                          className={`text-[9px] ${settings.theme === "light" ? "text-amber-600" : "text-[#3390ec]"} font-medium mb-1`}
                        >
                          PREMIUM
                        </p>
                        <p
                          className={`text-xl font-medium ${settings.theme === "light" ? "text-zinc-900" : "text-white"}`}
                        >
                          {
                            adminUsersList.filter((u) => u.settings?.isPremium)
                              .length
                          }
                        </p>
                      </div>
                      <div
                        className={`${settings.theme === "light" ? "bg-cyan-50 border-cyan-100" : "bg-cyan-500/10 border-cyan-500/20"} border p-4 rounded-2xl shadow-sm`}
                      >
                        <p
                          className={`text-[9px] ${settings.theme === "light" ? "text-cyan-600" : "text-cyan-500"} font-medium mb-1`}
                        >
                          MSGS
                        </p>
                        <p
                          className={`text-xl font-medium ${settings.theme === "light" ? "text-zinc-900" : "text-white"}`}
                        >
                          {adminUsersList
                            .reduce(
                              (acc, u) =>
                                acc +
                                Object.values(u.messages || {}).reduce(
                                  (mAcc, mArr) => mAcc + mArr.length,
                                  0,
                                ),
                              0,
                            )
                            .toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* РАСШИРЕННАЯ СТАТИСТИКА */}
                    {adminStats && (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                        <div
                          className={`${settings.theme === "light" ? "bg-zinc-50" : "bg-black/20"} p-5 rounded-2xl border ${currentTheme.border}`}
                        >
                          <h4 className="text-[10px] font-medium text-zinc-500 mb-4 border-b border-white/5 pb-2">
                            🏆 ТОП АКТИВНОСТЬ
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-medium text-zinc-400">
                                САМЫЙ ЖЕЛАННЫЙ ПОДАРОК
                              </span>
                              <span
                                className={`text-sm font-medium ${settings.theme === "light" ? "text-zinc-900" : "text-white"}`}
                              >
                                {adminStats.topGift}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-medium text-zinc-400">
                                ГЛАВНЫЙ МЕЦЕНАТ
                              </span>
                              <span className="text-sm font-medium text-sky-400">
                                {adminStats.topSpender}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-medium text-zinc-400">
                                СРЕДНЕЕ КОЛ-ВО СООБЩЕНИЙ
                              </span>
                              <span className="text-sm font-medium text-cyan-400">
                                {adminStats.avgMsgs}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-medium text-zinc-400">
                                ОБЪЕМ ПОДАРКОВ
                              </span>
                              <span className="text-sm font-medium text-emerald-400">
                                {adminStats.totalGifts} 🎁
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-medium text-zinc-400">
                                КОНВЕРСИЯ В PREMIUM
                              </span>
                              <span className="text-sm font-medium text-purple-400">
                                {adminStats.premiumConv}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`${settings.theme === "light" ? "bg-zinc-50" : "bg-black/20"} p-5 rounded-2xl border ${currentTheme.border}`}
                        >
                          <h4 className="text-[10px] font-medium text-zinc-500 mb-4 border-b border-white/5 pb-2">
                            🎨 ПРЕДПОЧТЕНИЯ
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-medium text-zinc-400">
                                ЛЮБИМЫЙ АКЦЕНТ
                              </span>
                              <div className="flex gap-1">
                                {adminStats.topAccents.map(([k, v]) => (
                                  <span
                                    key={k}
                                    className={`text-[9px] font-medium ${settings.theme === "light" ? "bg-zinc-200 text-zinc-600" : "bg-white/5 text-zinc-400"} px-2 py-0.5 rounded `}
                                  >
                                    {k}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-medium text-zinc-400">
                                ЯЗЫК ИНТЕРФЕЙСА
                              </span>
                              <span className="text-sm font-medium text-indigo-400">
                                {adminStats.langRatio}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-medium text-zinc-400">
                                ТЕМНЫЕ ТЕМЫ VS СВЕТЛЫЕ
                              </span>
                              <span className="text-sm font-medium text-rose-400">
                                {adminStats.themeRatio}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`${settings.theme === "light" ? "bg-zinc-50" : "bg-black/20"} p-5 rounded-2xl border ${currentTheme.border}`}
                        >
                          <h4 className="text-[10px] font-medium text-zinc-500 mb-4 border-b border-white/5 pb-2">
                            📊 ЛИДЕРБОРДЫ
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[9px] font-medium text-zinc-500 mb-2">
                                ТОП-3 ПО СООБЩЕНИЯМ
                              </p>
                              <div className="space-y-1">
                                {adminStats.msgLeaderboard.map((u, i) => (
                                  <div
                                    key={u.id}
                                    className="flex justify-between items-center text-[10px] font-medium"
                                  >
                                    <span className="text-zinc-400">
                                      {i + 1}. {u.name || u.id}
                                    </span>
                                    <span
                                      className={`${settings.theme === "light" ? "text-zinc-900" : "text-white"}`}
                                    >
                                      {u.count}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] font-medium text-zinc-500 mb-2">
                                ТОП-3 ПО ПОДАРКАМ
                              </p>
                              <div className="space-y-1">
                                {adminStats.giftLeaderboard.map((u, i) => (
                                  <div
                                    key={u.id}
                                    className="flex justify-between items-center text-[10px] font-medium"
                                  >
                                    <span className="text-zinc-400">
                                      {i + 1}. {u.name || u.id}
                                    </span>
                                    <span className="text-sky-400">
                                      {u.count} 🎁
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ГЛОБАЛЬНАЯ РАССЫЛКА */}
                    <div
                      className={`${settings.theme === "light" ? "bg-indigo-50 border-indigo-100" : "bg-indigo-500/10 border-indigo-500/20"} border p-6 rounded-2xl shadow-sm mb-6`}
                    >
                      <h4 className="text-[10px] font-medium text-indigo-400 mb-4 flex items-center gap-2">
                        <Megaphone size={14} /> Глобальная рассылка
                      </h4>
                      <textarea
                        value={adminBroadcastText}
                        onChange={(e) => setAdminBroadcastText(e.target.value)}
                        placeholder="Текст сообщения для всех пользователей..."
                        className={`w-full ${settings.theme === "light" ? "bg-white" : "bg-black/40"} border ${settings.theme === "light" ? "border-zinc-200" : "border-white/10"} rounded-2xl p-4 text-xs font-medium mb-3 focus:outline-none focus:border-indigo-500 transition-all resize-none`}
                        rows="3"
                      />
                      <button
                        onClick={() => adminAction(null, "global_broadcast")}
                        disabled={isBroadcasting || !adminBroadcastText.trim()}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-[10px] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isBroadcasting ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Send size={14} />
                        )}
                        ОТПРАВИТЬ ВСЕМ
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                      <div className="relative flex-1 w-full">
                        <Search
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                          type="text"
                          placeholder="Поиск по ID или имени..."
                          value={adminSearchQuery}
                          onChange={(e) => setAdminSearchQuery(e.target.value)}
                          className={`w-full ${settings.theme === "light" ? "bg-white border-zinc-200" : "bg-black/40 border-white/5"} border rounded-xl py-3 pl-10 pr-4 text-[11px] font-medium focus:outline-none transition-all`}
                        />
                      </div>
                      <button
                        onClick={fetchAdminUsers}
                        className={`px-4 py-3 ${settings.theme === "light" ? "bg-[#f1f1f1] hover:bg-zinc-200 text-zinc-600" : "bg-black/50 hover:bg-[#242f3d] text-zinc-400"} rounded-xl transition-all border border-transparent font-medium text-[9px] flex items-center gap-2 whitespace-nowrap`}
                      >
                        <RefreshCw
                          size={14}
                          className={isLoadingAdmin ? "animate-spin" : ""}
                        />
                        {""}
                        Обновить базу
                      </button>
                    </div>

                    {/* DEVELOPER CONSOLE */}
                    <div
                      className={`${settings.theme === "light" ? "bg-[#f1f1f1] border-zinc-200" : "bg-black/40 border-white/5"} border p-5 rounded-2xl mb-6 shadow-inner`}
                    >
                      <h4 className="text-[9px] font-medium text-zinc-500 mb-3 flex items-center gap-2">
                        <ShieldAlert size={14} /> Developer Console
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={adminConsoleCmd}
                          onChange={(e) => setAdminConsoleCmd(e.target.value)}
                          placeholder="Введите команду..."
                          className={`flex-1 ${settings.theme === "light" ? "bg-white" : "bg-black/60"} border ${currentTheme.border} rounded-xl px-4 py-2 font-mono text-[10px] text-white focus:outline-none`}
                        />
                        <button
                          onClick={() => adminAction(null, "console_cmd")}
                          className="bg-[#242f3d] hover:bg-[#2b3949] text-white px-4 py-2 rounded-xl text-[10px] font-medium transition-all"
                        >
                          EXEC
                        </button>
                      </div>
                      <p className="text-[7px] text-zinc-600 mt-2 font-mono">
                        Commands: clear_all_history, ban_all
                      </p>
                    </div>

                    <div className="space-y-4">
                      {adminUsersList
                        .filter(
                          (u) =>
                            u.id
                              .toLowerCase()
                              .includes(adminSearchQuery.toLowerCase()) ||
                            (u.settings?.username || "")
                              .toLowerCase()
                              .includes(adminSearchQuery.toLowerCase()),
                        )
                        .map((u) => (
                          <div
                            key={u.id}
                            className={`${settings.theme === "light" ? "bg-white border-zinc-200 shadow-md" : "bg-[#17212b]/40 border-white/5 hover:border-rose-500/30"} border transition-all p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm group`}
                          >
                            <div className="flex items-center gap-5 relative z-10">
                              <div className="relative flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                <img
                                  src={
                                    u.settings?.avatar ||
                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`
                                  }
                                  className={`w-16 h-16 rounded-full border-2 ${settings.theme === "light" ? "border-zinc-100" : "border-black"} object-cover ${
                                    u.settings?.isPremium
                                      ? "ring-2 ring-sky-400 shadow-lg shadow-amber-500/20"
                                      : ""
                                  }`}
                                />
                                {u.settings?.isPremium && (
                                  <div className="absolute -bottom-1 -right-1 bg-[#17212b] rounded-full p-1 border border-[#3390ec]/30">
                                    <Crown
                                      size={14}
                                      className="text-sky-400 fill-amber-400"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-base font-medium ${settings.theme === "light" ? "text-zinc-900" : "text-white"} truncate flex items-center gap-2`}
                                >
                                  {u.settings?.username || "Без имени"}
                                  <BadgeDisplay
                                    type={u.settings?.officialBadge}
                                    className="text-lg"
                                  />
                                </p>
                                <p className="text-[11px] text-zinc-500 font-mono truncate mt-0.5">
                                  ID: {u.id} •{" "}
                                  {u.settings?.lastOnline
                                    ? `Был: ${new Date(u.settings.lastOnline).toLocaleString()}`
                                    : "Оффлайн"}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <p className="text-[10px] text-[#3390ec] font-medium bg-[#3390ec]/10 px-2 py-0.5 rounded-md border border-[#3390ec]/20 flex items-center gap-1">
                                    <Gem size={10} /> {u.settings?.balance || 0}
                                  </p>
                                  {u.settings?.isBanned && (
                                    <p className="text-[10px] text-rose-500 font-medium bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 animate-pulse">
                                      ЗАБАНЕН
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-3 w-full lg:w-auto">
                              {/* ВЫБОР ЗНАЧКА (КРАСИВАЯ СЕТКА) */}
                              <div className="flex flex-wrap gap-1.5 p-2 bg-black/20 rounded-2xl border border-white/5">
                                <button
                                  onClick={() =>
                                    adminAction(u.id, "set_badge", null)
                                  }
                                  className={`p-2 rounded-xl text-[10px] font-medium transition-all ${
                                    !u.settings?.officialBadge
                                      ? "bg-zinc-500 text-white shadow-lg"
                                      : `${settings.theme === "light" ? "text-zinc-400 hover:text-zinc-600" : "text-zinc-600 hover:text-zinc-400"}`
                                  }`}
                                  title="Без значка"
                                >
                                  <X size={14} />
                                </button>
                                {Object.entries(OFFICIAL_BADGES)
                                  .filter(([k]) => k !== "ai")
                                  .map(([k, v]) => (
                                    <button
                                      key={k}
                                      onClick={() =>
                                        adminAction(u.id, "set_badge", k)
                                      }
                                      className={`p-2 rounded-xl text-lg transition-all hover:scale-110 active:scale-90 ${
                                        u.settings?.officialBadge === k
                                          ? "bg-indigo-500 shadow-lg shadow-indigo-500/40"
                                          : "bg-black/40 hover:bg-black/60 opacity-60 hover:opacity-100"
                                      }`}
                                      title={v.label}
                                    >
                                      {v.icon}
                                    </button>
                                  ))}
                              </div>

                              <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap sm:flex-nowrap">
                                <button
                                  onClick={() =>
                                    adminAction(
                                      u.id,
                                      "give_premium",
                                      !u.settings?.isPremium,
                                    )
                                  }
                                  className={`flex-1 sm:flex-none px-4 py-3 rounded-xl text-[10px] font-medium transition-all shadow-md active:scale-95 ${
                                    u.settings?.isPremium
                                      ? `${settings.theme === "light" ? "bg-[#f1f1f1] text-zinc-400" : "bg-[#242f3d] text-zinc-400"} hover:text-white`
                                      : "bg-[#3390ec]/20 text-[#3390ec] hover:bg-[#3390ec] hover:text-black border border-[#3390ec]/30"
                                  }`}
                                >
                                  {u.settings?.isPremium
                                    ? "- Убрать VIP"
                                    : "+ Дать VIP"}
                                </button>
                                <button
                                  onClick={() =>
                                    adminAction(u.id, "add_balance", 1000)
                                  }
                                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-[10px] font-medium bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white border border-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-1"
                                >
                                  <Gem size={12} /> +1000
                                </button>
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Очистить всю историю сообщений для ${u.id}?`,
                                      )
                                    )
                                      adminAction(u.id, "clear_history");
                                  }}
                                  className="px-3 py-3 rounded-xl bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500 hover:text-white border border-zinc-500/20 transition-all active:scale-95 flex items-center justify-center"
                                  title="Очистить историю"
                                >
                                  <Trash size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    adminAction(
                                      u.id,
                                      "toggle_ban",
                                      !u.settings?.isBanned,
                                    )
                                  }
                                  className={`px-3 py-3 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
                                    u.settings?.isBanned
                                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                                      : "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white"
                                  }`}
                                  title={
                                    u.settings?.isBanned
                                      ? "Разбанить"
                                      : "Забанить"
                                  }
                                >
                                  {u.settings?.isBanned ? (
                                    <Check size={16} />
                                  ) : (
                                    <ShieldAlert size={16} />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Полностью стереть ${u.id} из базы данных? Это нельзя отменить!`,
                                      )
                                    )
                                      adminAction(u.id, "delete");
                                  }}
                                  className="px-3 py-3 rounded-xl text-[10px] font-medium bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all flex justify-center active:scale-95 group-hover:border-rose-500/50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                          </div>
                        ))}
                      {adminUsersList.length === 0 && !isLoadingAdmin && (
                        <div className="text-center text-zinc-700 py-20 font-medium tracking-[0.5em] animate-pulse">
                          DATABASE EMPTY
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- МОДАЛКИ (УДАЛЕНИЕ, ДОБАВЛЕНИЕ) --- */}
      {chatToDelete && (
        <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-[#0e1621] p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-2xl lg:rounded-2xl border border-rose-500/30 text-center shadow-md lg:shadow-md animate-spring-up max-w-xs sm:max-w-sm w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 text-rose-500 border border-rose-500/20">
              <AlertCircle
                size={32}
                className="sm:w-10 sm:h-10 lg:w-14 lg:h-14"
              />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium mb-2 sm:mb-3 lg:mb-4 text-white">
              {getText("del_chat_title")}
            </h3>
            <p className="text-[10px] sm:text-xs lg:text-sm text-zinc-500 mb-6 sm:mb-8 lg:mb-12 font-medium tracking-[0.1em] sm:tracking-[0.2em] leading-relaxed">
              {getText("del_chat_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => setChatToDelete(null)}
                className="w-full sm:flex-1 py-3 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl lg:rounded-2xl font-medium bg-[#17212b] text-zinc-500 hover:text-white transition-colors text-[9px] sm:text-[10px] lg:text-xs"
              >
                {getText("back")}
              </button>
              <button
                type="button"
                onClick={handleDeleteChat}
                className="w-full sm:flex-1 py-3 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl lg:rounded-2xl font-medium bg-rose-600 text-white shadow-lg lg:shadow-lg shadow-rose-600/40 transition-all hover:bg-rose-500 text-[9px] sm:text-[10px] lg:text-xs"
              >
                {getText("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddContact && (
        <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
          <div className="bg-[#17212b]/80 sm:bg-[#17212b]/60 p-6 sm:p-10 lg:p-16 rounded-2xl sm:rounded-2xl lg:rounded-2xl border border-white/5 w-full max-w-sm sm:max-w-md lg:max-w-lg animate-spring-up shadow-lg lg:shadow-lg flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-2 sm:mb-3 lg:mb-4 text-white text-center sm:text-left">
              {getText("new_connect")}
            </h3>
            <p className="text-zinc-500 text-[8px] sm:text-[9px] lg:text-[10px] font-medium tracking-[0.2em] sm:tracking-[0.3em] lg:tracking-[0.4em] mb-6 sm:mb-8 lg:mb-12 opacity-50 text-center sm:text-left">
              {getText("enter_id")}
            </p>
            <input
              autoFocus
              value={addContactLogin}
              onChange={(e) =>
                setAddContactLogin(
                  e.target.value.toLowerCase().replace(/\s+/g, ""),
                )
              }
              placeholder="ID..."
              className="w-full bg-black/80 sm:bg-black/60 border border-white/10 rounded-xl sm:rounded-2xl lg:rounded-2xl py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-10 mb-4 sm:mb-6 lg:mb-8 text-white font-medium placeholder-zinc-800 focus:outline-none focus:border-[#3390ec] transition-all text-sm sm:text-base lg:text-xl"
            />
            {addContactError && (
              <p className="text-rose-500 text-[9px] sm:text-[10px] lg:text-[12px] font-medium mb-4 sm:mb-6 lg:mb-8 animate-shake bg-rose-500/10 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl lg:rounded-2xl border border-rose-500/20 text-center">
                {addContactError}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-5">
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="w-full sm:flex-1 py-3 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl lg:rounded-2xl font-medium bg-[#0e1621] text-zinc-500 hover:text-white transition-colors text-[9px] sm:text-[10px] lg:text-xs"
              >
                {getText("back")}
              </button>
              <button
                type="button"
                onClick={handleAddContact}
                disabled={isSearchingUser}
                className={`w-full sm:flex-1 py-3 sm:py-4 lg:py-6 rounded-xl sm:rounded-2xl lg:rounded-2xl font-medium ${currentAccent.bg} ${currentAccent.text} shadow-xl lg:shadow-lg text-[9px] sm:text-[10px] lg:text-xs flex items-center justify-center`}
              >
                {isSearchingUser ? (
                  <Loader2 className="animate-spin w-4 h-4 sm:w-5 h-5 lg:w-auto lg:h-auto" />
                ) : (
                  getText("connect_btn")
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ТОСТЫ УВЕДОМЛЕНИЙ --- */}
      <div className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8 z-[700] space-y-2 sm:space-y-3 lg:space-y-4 pointer-events-none w-[calc(100%-2rem)] sm:w-auto max-w-[280px] sm:max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-[#17212b]/95 backdrop-blur-3xl border border-white/10 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-xl lg:rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] lg:shadow-[0_15px_40px_rgba(0,0,0,0.5)] animate-spring-up pointer-events-auto flex items-center gap-3 sm:gap-4 lg:gap-5 border-l-[3px] sm:border-l-4 border-l-amber-500"
          >
            <div
              className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full ${currentAccent.bg} ${currentAccent.text} flex items-center justify-center shadow-lg flex-shrink-0`}
            >
              <Bell size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[9px] sm:text-[10px] lg:text-xs font-medium truncate text-white">
                {t.title}
              </h4>
              <p className="text-[9px] sm:text-[10px] lg:text-[12px] text-zinc-400 font-medium mt-0.5 truncate">
                {t.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- ГЛОБАЛЬНЫЕ СТИЛИ (АНИМАЦИИ) --- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
 .custom-scrollbar::-webkit-scrollbar { width: 3px; }
 @media (min-width: 640px) { .custom-scrollbar::-webkit-scrollbar { width: 4px; } }
 @media (min-width: 1024px) { .custom-scrollbar::-webkit-scrollbar { width: 6px; } }
 .custom-scrollbar::-webkit-scrollbar-thumb { background: ${settings.theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.05)"}; border-radius: 20px; transition: all 0.3s; }
 .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${settings.theme === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"}; }
 .no-scrollbar::-webkit-scrollbar { display: none; }
 .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

 @keyframes springUp { 0% { opacity: 0; transform: translateY(60px) scale(0.9); } 60% { opacity: 1; transform: translateY(-5px) scale(1.02); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
 .animate-spring-up { animation: springUp 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
 @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
 .animate-slide-up { animation: slideUpFade 0.4s ease-out forwards; }
 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
 .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
 @keyframes messagePop { 0% { opacity: 0; transform: translateY(15px) scale(0.9); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
 .animate-message-pop { animation: messagePop 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
 @keyframes messageEnterLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
 .animate-message-enter-left { animation: messageEnterLeft 0.4s ease-out forwards; }
 @keyframes staggerFade { from { opacity: 0; transform: translateX(-15px); } to { opacity: 1; transform: translateX(0); } }
 .animate-stagger-fade { opacity: 0; animation: staggerFade 0.5s ease-out forwards; }
 @keyframes audioWave { 0%, 100% { transform: scaleY(0.4); opacity: 0.5; } 50% { transform: scaleY(1.3); opacity: 1; } }
 .animate-audio-wave { animation: audioWave 0.6s infinite ease-in-out; }
 @keyframes pulseGlow { 0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(244,63,94,0.4); } 50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(244,63,94,0.8); } }
 .animate-pulse-glow { animation: pulseGlow 1.5s infinite ease-in-out; }
 @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
 .animate-float { animation: float 6s infinite ease-in-out; }
 @keyframes pulseSlow { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.05); } }
 .animate-pulse-slow { animation: pulseSlow 5s infinite ease-in-out; }
 @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
 .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }
 @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
 .animate-shake { animation: shake 0.4s ease-in-out; }
 .ease-spring { transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); }
 @keyframes bgMove { 0% { background-position: 0 0; } 100% { background-position: 1000px 1000px; } }
 .text-shadow-glow { text-shadow: 0 0 15px rgba(244, 63, 94, 0.5); }
 `,
        }}
      />
    </div>
  );
}
