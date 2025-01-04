import i18next from 'i18next';
import detector from 'i18next-browser-languagedetector';
import ChainedBackend from 'i18next-chained-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import * as lang from '../../locales/en.json';

const bundledResources = {
  en: {
    translation: lang.default,
  },
};

export function initLocalization() {
  i18next
    .use(detector)
    .use(ChainedBackend)
    .init({
      load: 'languageOnly',
      backend: {
        backends: [resourcesToBackend(bundledResources), resourcesToBackend((lng) => import(`../../locales/${lng}.json`))],
        load: 'languageOnly',
      },
      fallbackLng: 'en',
      debug: false,
    });

  i18next.on('initialized', () => {
    applyLocalization();

    i18next.on('languageChanged', (e) => {
      applyLocalization();
    });
  });
}

export function applyLocalization(area = document) {
  area.querySelectorAll('[i18n]').forEach((element) => {
    element.innerText = i18next.t(element.getAttribute('i18n')) + element.innerText;
  });

  area.querySelectorAll('[i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', i18next.t(element.getAttribute('i18n-placeholder')));
  });
}

export function setLanguage(language) {
  i18next.changeLanguage(language);
}

export function getKey() {
  return i18next.t.apply(null, arguments);
}
