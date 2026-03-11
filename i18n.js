(function(){
  const I18N = {
    translations: {},
    lang: 'en',
    async init() {
      try {
        const res = await fetch('data/translations.json');
        this.translations = await res.json();
      } catch (e) {
        console.error('i18n: failed to load translations', e);
        this.translations = { en: {} };
      }

      const saved = localStorage.getItem('site_lang');
      const navLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
      this.lang = saved || (this.translations[navLang] ? navLang : 'en');

      document.addEventListener('DOMContentLoaded', () => {
        const selector = document.getElementById('langSelector');
        if (selector) {
          selector.value = this.lang;
          selector.addEventListener('change', (e) => {
            this.setLang(e.target.value);
          });
        }
        this.translateAll();
      });
    },
    setLang(l) {
      this.lang = l || 'en';
      localStorage.setItem('site_lang', this.lang);
      this.translateAll();
    },
    t(key) {
      if (!key) return '';
      const langObj = this.translations[this.lang] || {};
      if (langObj[key] !== undefined) return langObj[key];
      const enObj = this.translations['en'] || {};
      return enObj[key] || key;
    },
    translateAll() {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = this.t(key);
        // If input or textarea, set placeholder when appropriate
        if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.hasAttribute('placeholder')) {
          el.setAttribute('placeholder', text);
        } else if (el.dataset && el.dataset.i18nHtml !== undefined) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      });

      // Special handling for elements that use value attributes (like submit inputs)
      document.querySelectorAll('[data-i18n-value]').forEach(el => {
        const key = el.getAttribute('data-i18n-value');
        el.value = this.t(key);
      });

      // Update dynamic buttons that may have inner HTML
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        el.innerHTML = this.t(key);
      });
    }
  };

  window.i18n = I18N;
  I18N.init();
})();
