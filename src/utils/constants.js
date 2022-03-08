//import moment from "moment";

const CODE_VARIANTS = {
  JS: "JS",
  TS: "TS",
};

// Valid languages to server-side render in production
const LANGUAGES = ["en", "zh", "pt"];

// Server side rendered languages
const LANGUAGES_SSR = ["en", "zh", "pt"];

// Work in progress
const LANGUAGES_IN_PROGRESS = LANGUAGES.slice();

// Valid languages to use in production
const LANGUAGES_LABEL = [
  {
    code: "en",
    text: "English",
  },
  {
    code: "zh",
    text: "中文",
  },
  {
    code: "pt",
    text: "Português",
  },
];

const ENABLE_REDUX_DEV_TOOLS = true;
// const BACKEND_BASE_URL = "https://backend.doctorscan.com.au/api/v1/";

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const OPTHY_NETWORKS = {
  RinkebyTestnet: 4,
  GodwokenTestnet: 71393,
};

module.exports = {
  CODE_VARIANTS,
  LANGUAGES,
  LANGUAGES_SSR,
  LANGUAGES_LABEL,
  LANGUAGES_IN_PROGRESS,
  ENABLE_REDUX_DEV_TOOLS,
  THEMES,
  OPTHY_NETWORKS,
  // BACKEND_BASE_URL,
};
