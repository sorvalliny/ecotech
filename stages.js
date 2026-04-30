/**
 * ОРБИТА — Единая база стадий зрелости продукта
 * Синхронизирует Framework Lite и Хэндбук через localStorage + storage event
 * Ключ хранилища: 'ECOTECH_STAGES'
 */
(function () {
  'use strict';

  var LS_KEY = 'ECOTECH_STAGES';

  // 6 стадий ОРБИТА (от заявки до масштаба) + служебный О·6 Архив
  // Источник: RWB_Экосистема(финал).pdf от 29.04.2026, слайды 5-7
  var DEFAULT = [
    {
      id: 's0', num: 0, orbita: 'О·0',
      name: 'Заявка', icon: '🌱',
      tagline: 'Реестр: инициативы проходят тест-драйв до запуска',
      goal: 'Есть ли рынок? — через 4 источника: поиск гипотез, запросы бизнеса, рынок (фонды, M&A), акселератор сотрудников. Скрининг и решение департамента.',
      fork: null,
      committee: 'Департамент',
      duration: 'до 14 дней',
      color: '#FFB830',
      colorDim: 'rgba(255,184,48,0.12)',
      colorBorder: 'rgba(255,184,48,0.35)',
      hbKey: 'idea'
    },
    {
      id: 's1', num: 1, orbita: 'О·1',
      name: 'Проект-ние', icon: '🔍',
      tagline: 'Реестр: тест-драйв и сборка команды',
      goal: 'Поиск лидера проекта и сбор команды. 5–10 интервью с клиентами, анализ конкурентов, черновик финмодели, техническая предоценка.',
      fork: 'Гейт: соответствие стратегии, потенциальный заказчик от бизнеса, уникальность (нет дубля в реестре)',
      committee: 'Инвест комитет',
      duration: '1–2 мес',
      color: '#B3E5FC',
      colorDim: 'rgba(79,195,247,0.12)',
      colorBorder: 'rgba(79,195,247,0.35)',
      hbKey: 'discovery'
    },
    {
      id: 's2', num: 2, orbita: 'О·2',
      name: 'Запуск MVP', icon: '🚀',
      tagline: 'Фаст-трек запуска: проверка метрик и решение об интеграции',
      goal: 'MVP в изолированной песочнице. Уровень проработки зависит от рисков. Тест на когорте 100–1000.',
      fork: 'Развилка: строим сами / покупаем (M&A) / интегрируем партнёра',
      committee: 'Тех комитет',
      duration: 'до 3 мес',
      color: '#3B82F6',
      colorDim: 'rgba(59,130,246,0.12)',
      colorBorder: 'rgba(59,130,246,0.35)',
      hbKey: 'pilot'
    },
    {
      id: 's3', num: 3, orbita: 'О·3',
      name: 'Рост метрик', icon: '📈',
      tagline: 'Фаст-трек запуска: проверка метрик и решение об интеграции',
      goal: 'Трафик WB (70 млн), реклама, сбор ключевых метрик. Цель на 90 дней фиксируется на входе.',
      fork: null,
      committee: 'УК (Интеграция)',
      duration: '1–3 мес',
      color: '#00D4B4',
      colorDim: 'rgba(0,212,180,0.12)',
      colorBorder: 'rgba(0,212,180,0.35)',
      hbKey: 'launch'
    },
    {
      id: 's4', num: 4, orbita: 'О·4',
      name: 'Интеграция', icon: '⚡',
      tagline: 'Передача продукта с командой в профильный департамент',
      goal: 'Глубокая интеграция: WB ID, Кошелёк, ПВЗ, перекрёстные продажи с маркетплейсом. A/B-тесты. Передача с командой в профильный департамент.',
      fork: 'Передача владельцу: коммерция, CX, ПВЗ, склад, ESG — зависит от операционки',
      committee: 'УК (Масштаб)',
      duration: '3–12 мес',
      color: '#34D399',
      colorDim: 'rgba(52,211,153,0.12)',
      colorBorder: 'rgba(52,211,153,0.35)',
      hbKey: 'scale'
    },
    {
      id: 's5', num: 5, orbita: 'О·5',
      name: 'Масштаб', icon: '💎',
      tagline: 'Готово: продукт интегрирован в RWB',
      goal: 'Продукт на плато. Ищем новые модели монетизации и роста.',
      fork: 'Три пути: новый цикл разведки (О·1), сбор прибыли (остаёмся), закрытие (О·6)',
      committee: 'УК (Развитие)',
      duration: 'все время',
      color: '#FF85C0',
      colorDim: 'rgba(255,133,192,0.12)',
      colorBorder: 'rgba(255,133,192,0.35)',
      hbKey: 'maturity'
    },
    {
      id: 's6', num: 6, orbita: 'О·6',
      name: 'Архив', icon: '📦',
      tagline: 'Служебная стадия: завершение и архивация',
      goal: 'Завершаем жизнь продукта без потери доверия пользователей и команды.',
      fork: null,
      committee: null,
      duration: '2–4 нед',
      color: '#8B8BAE',
      colorDim: 'rgba(139,139,174,0.12)',
      colorBorder: 'rgba(139,139,174,0.35)',
      hbKey: 'archive',
      service: true
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
