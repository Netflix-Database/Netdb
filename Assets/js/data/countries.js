import countriesPkg from 'i18n-iso-countries';
import i18next from 'i18next';

// Preload common locales
const localeCache = {};

async function loadLocale(lang) {
  if (localeCache[lang])
    return localeCache[lang];

  try {
    const locale = await import(`i18n-iso-countries/langs/${lang}.json`);
    countriesPkg.registerLocale(locale.default || locale);
    localeCache[lang] = true;
    return true;
  } catch {
    if (!localeCache.en) {
      const enLocale = await import('i18n-iso-countries/langs/en.json');
      countriesPkg.registerLocale(enLocale.default || enLocale);
      localeCache.en = true;
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
