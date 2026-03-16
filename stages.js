/**
 * ОРБИТА — Единая база стадий зрелости продукта
 * Синхронизирует Framework Lite и Хэндбук через localStorage + storage event
 * Ключ хранилища: 'ECOTECH_STAGES'
 */
(function () {
  'use strict';

  var LS_KEY = 'ECOTECH_STAGES';

  // 7 унифицированных стадий — единый источник истины
  var DEFAULT = [
    {
      id: 's0', num: 0, orbita: 'О·0',
      name: 'Заявка', icon: '🌱',
      tagline: 'Бриф → Скрининг → Gate 0',
      goal: 'Быстро оценить: стоит ли браться. Получить Go/No-Go за 5 рабочих дней.',
      duration: 'до 5 дней',
      color: '#FFB830',
      colorDim: 'rgba(255,184,48,0.12)',
      colorBorder: 'rgba(255,184,48,0.35)',
      hbKey: 'idea'
    },
    {
      id: 's1', num: 1, orbita: 'О·1',
      name: 'Разведка', icon: '🔍',
      tagline: 'CustDev → PSF → Gate 1',
      goal: 'Подтвердить Problem-Solution Fit. Понять кто страдает и как сильно.',
      duration: '3–6 нед',
      color: '#B3E5FC',
      colorDim: 'rgba(79,195,247,0.12)',
      colorBorder: 'rgba(79,195,247,0.35)',
      hbKey: 'discovery'
    },
    {
      id: 's2', num: 2, orbita: 'О·2',
      name: 'Прототип', icon: '🚀',
      tagline: 'PRD → Спринты → Gate 2',
      goal: 'Разработать MVP и проверить с реальными пользователями.',
      duration: '6–12 нед',
      color: '#3B82F6',
      colorDim: 'rgba(59,130,246,0.12)',
      colorBorder: 'rgba(59,130,246,0.35)',
      hbKey: 'pilot'
    },
    {
      id: 's3', num: 3, orbita: 'О·3',
      name: 'Разгон', icon: '📈',
      tagline: 'GTM → Метрики → Gate 3',
      goal: 'Полный выход на аудиторию. GTM план, SLA, поддержка. Активный рост метрик.',
      duration: '1–3 мес',
      color: '#00D4B4',
      colorDim: 'rgba(0,212,180,0.12)',
      colorBorder: 'rgba(0,212,180,0.35)',
      hbKey: 'launch'
    },
    {
      id: 's4', num: 4, orbita: 'О·4',
      name: 'Экосистема', icon: '⚡',
      tagline: 'Retention → A/B → Интеграция',
      goal: 'PMF достигнут. Растим аудиторию, снижаем Churn, интегрируемся в экосистему.',
      duration: '3–12 мес',
      color: '#34D399',
      colorDim: 'rgba(52,211,153,0.12)',
      colorBorder: 'rgba(52,211,153,0.35)',
      hbKey: 'scale'
    },
    {
      id: 's5', num: 5, orbita: 'О·5',
      name: 'Плато', icon: '💎',
      tagline: 'Unit Economics → Оптимизация',
      goal: 'Продукт на плато. Оптимизируем маржинальность. Решаем: новая Разведка или архивация.',
      duration: 'ongoing',
      color: '#FF85C0',
      colorDim: 'rgba(255,133,192,0.12)',
      colorBorder: 'rgba(255,133,192,0.35)',
      hbKey: 'maturity'
    },
    {
      id: 's6', num: 6, orbita: 'О·6',
      name: 'Архив', icon: '📦',
      tagline: 'Offboarding → Архивация',
      goal: 'Завершаем жизнь продукта без потери доверия пользователей и команды.',
      duration: '2–4 нед',
      color: '#8B8BAE',
      colorDim: 'rgba(139,139,174,0.12)',
      colorBorder: 'rgba(139,139,174,0.35)',
      hbKey: 'archive'
    }
  ];

  var STAGES_DB = {
    /** Возвращает актуальные стадии (из localStorage или defaults) */
    get: function () {
      try {
        var raw = localStorage.getItem(LS_KEY);
        if (!raw) return DEFAULT.map(function (d) { return Object.assign({}, d); });
        var stored = JSON.parse(raw);
        return DEFAULT.map(function (def, i) {
          return Object.assign({}, def, stored[i] || {});
        });
      } catch (e) {
        return DEFAULT.map(function (d) { return Object.assign({}, d); });
      }
    },

    /** Сохраняет массив стадий */
    save: function (stages) {
      localStorage.setItem(LS_KEY, JSON.stringify(stages));
    },

    /** Обновляет одну стадию по индексу */
    update: function (index, changes) {
      var stages = this.get();
      Object.assign(stages[index], changes);
      this.save(stages);
      return stages;
    },

    /** Сбрасывает к настройкам по умолчанию */
    reset: function () {
      localStorage.removeItem(LS_KEY);
      return DEFAULT.map(function (d) { return Object.assign({}, d); });
    },

    /**
     * Подписаться на изменения из других вкладок/страниц
     * cb(stages) вызывается при изменении ECOTECH_STAGES в другой вкладке
     */
    listen: function (cb) {
      window.addEventListener('storage', function (e) {
        if (e.key === LS_KEY) {
          try {
            var parsed = e.newValue ? JSON.parse(e.newValue) : null;
            cb(parsed || STAGES_DB.get());
          } catch (x) {
            cb(STAGES_DB.get());
          }
        }
      });
    }
  };

  window.STAGES_DB = STAGES_DB;
  window.STAGES_DEFAULT = DEFAULT;
})();
