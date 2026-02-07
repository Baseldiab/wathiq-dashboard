// export const i18n = {
//   defaultLocale: 'ar',
//   locales: ['ar', 'en'],
//   localeDetection: false,
// };

// const nextI18NextConfig = {
//   i18n,
//   localePath: './public/locales',
// };

// export default nextI18NextConfig;
const i18n = {
  defaultLocale: "ar",
  locales: ["ar", "en"],
  localeDetection: false,
};

const nextI18NextConfig = {
  i18n,
  localePath: "./public/locales",
};

module.exports = nextI18NextConfig;
