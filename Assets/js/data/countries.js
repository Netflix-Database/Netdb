import countriesPkg from 'i18n-iso-countries';
import i18next from 'i18next';

const localeCache = {};
const localeModules = import.meta.glob('/node_modules/i18n-iso-countries/langs/*.json');

async function loadLocale(lang) {
  if (localeCache[lang]) return localeCache[lang];

  try {
    const localeLoader = localeModules[`/node_modules/i18n-iso-countries/langs/${lang}.json`];

    if (localeLoader) {
      const locale = await localeLoader();

      countriesPkg.registerLocale(locale.default || locale);
      localeCache[lang] = true;
      return true;
    }

    // Fallback to English if locale not found
    if (!localeCache.en) {
      const enLoader = localeModules['/node_modules/i18n-iso-countries/langs/en.json'];
      if (enLoader) {
        const enLocale = await enLoader();
        countriesPkg.registerLocale(enLocale.default || enLocale);
        localeCache.en = true;
      }
    }
    return false;
  } catch {
    if (!localeCache.en) {
      const enLoader = localeModules['/node_modules/i18n-iso-countries/langs/en.json'];
      if (enLoader) {
        const enLocale = await enLoader();
        countriesPkg.registerLocale(enLocale.default || enLocale);
        localeCache.en = true;
      }
    }
    return false;
  }
}

await loadLocale('en');

/**
 * Get countries list in the current user's language
 */
export async function getCountries() {
  const userLang = i18next.language || 'en';
  await loadLocale(userLang);

  const countryObject = countriesPkg.getNames(userLang, { select: 'official' });

  return Object.entries(countryObject)
    .map(([code, name]) => ({
      key: code.toLowerCase(),
      name: name
    }))
    .sort((a, b) => a.name.localeCompare(b.name, userLang));
}
