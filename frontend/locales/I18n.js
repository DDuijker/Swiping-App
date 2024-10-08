import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your translation files
import translationEN from "./en/translation.json";
import translationNL from "./nl/translation.json";

// The translations
const resources = {
  en: {
    translation: translationEN,
  },
  nl: {
    translation: translationNL,
  },
};

// Initialize i18next
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
