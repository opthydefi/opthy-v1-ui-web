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

const ERC20_ADDRESS_CURRENCY = {
  "0x7af456bf0065aadab2e6bec6dad3731899550b84" : "DAI",
  "0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84": "DAI",
  "0xc778417E063141139Fce010982780140Aa0cD5Ab" : "WETH",
  "0x265566d4365d80152515e800ca39424300374a83": "USDC",
  "0x74a3dbd5831f45cd0f3002bb87a59b7c15b1b5e6": "USDT"
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
  ERC20_ADDRESS_CURRENCY,
  // BACKEND_BASE_URL,
};
