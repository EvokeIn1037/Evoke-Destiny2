import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en';
import fr from './locales/fr';
import es from './locales/es';
import esMx from './locales/es-mx';
import de from './locales/de';
import it from './locales/it';
import ja from './locales/ja';
import ptBr from './locales/pt-br';
import ru from './locales/ru';
import pl from './locales/pl';
import ko from './locales/ko';
import zhCht from './locales/zh-cht';
import zhChs from './locales/zh-chs';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      'es-mx': { translation: esMx },
      de: { translation: de },
      it: { translation: it },
      ja: { translation: ja },
      'pt-br': { translation: ptBr },
      ru: { translation: ru },
      pl: { translation: pl },
      ko: { translation: ko },
      'zh-cht': { translation: zhCht },
      'zh-chs': { translation: zhChs },
    },
    fallbackLng: 'en',
    detection: {
      order: ['navigator'],
      caches: [],
      convertDetectedLanguage: (lng: string) => {
        const l = lng.toLowerCase();
        if (l === 'zh-cn' || l === 'zh-hans' || l === 'zh-sg') return 'zh-chs';
        if (l === 'zh-tw' || l === 'zh-hk' || l === 'zh-hant') return 'zh-cht';
        return l;
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
