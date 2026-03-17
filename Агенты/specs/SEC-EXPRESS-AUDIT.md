# SEC-EXPRESS-AUDIT — Экспресс ИБ-аудит платформы ОРБИТА
## Только CRITICAL уязвимости | До пилота
**Дата:** 17 марта 2026
**Аудитор:** Агент ИБ (AGENT_SECURITY.md)
**Скоуп:** XSS, PII, AuthBypass, CDN integrity, CSP

---

## Сводка

| Severity | Кол-во |
|----------|--------|
| CRITICAL | 3 |
| HIGH | 3 |
| **Итого** | **6** |

---

## SEC-001 | Severity: CRITICAL
**Категория:** XSS (OWASP A03 + A07)
**Файл:** `/Проектный офис/tracker.html` — строки 2087-2088, 2092-2095, 2111
**Описание:** Функция `renderItem()` вставляет `item.name`, `item.desc`, `item.audience`, `item.notes` через template literal напрямую в innerHTML без экранирования. Эти поля заполняются пользователем через формы и хранятся в localStorage (`ECOTECH_BACKLOG`). Любой пользователь с доступом к странице может создать инициативу с XSS-пейлоадом в названии или описании.

**PoC:**
```
1. Открыть DevTools > Console
2. var bl = JSON.parse(localStorage.getItem('ECOTECH_BACKLOG') || '[]');
3. bl.push({id:'XSS1', name:'<img src=x onerror=alert(document.cookie)>', desc:'test', cat:'feature', status:'backlog', track:'discovery', productId:'P01', r:5,i:5,c:5,e:5});
4. localStorage.setItem('ECOTECH_BACKLOG', JSON.stringify(bl));
5. Перезагрузить tracker.html — скрипт выполнится
```

**Затронутые поля в tracker.html (без sanitization):**
- `item.name` (строка 2087) — название инициативы
- `item.desc` (строка 2088) — описание
- `item.audience` (строка 2092)
- `item.notes` (строка 2111, в title-атрибуте)
- `item.release` (строка 2095)
- `l.userName`, `l.entityName`, `l.oldValue`, `l.newValue` в renderChangelog() (строка 1598)
- `goal.title`, `kr.text` в renderGoalPreview() (строки 2956, 2962)
- `p.name` в renderPM() (строка 2175) и множественных других рендерах

**Рекомендация:**
Создать утилиту `escHtml()` (аналог той, что уже есть в admin.html:683-687) и применить ко ВСЕМ пользовательским данным перед вставкой в innerHTML. Альтернатива: использовать `textContent` для текстовых узлов.

```js
function escHtml(s) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(s || ''));
  return d.innerHTML;
}
```

**Приоритет: ДО ПИЛОТА**

---

## SEC-002 | Severity: CRITICAL
**Категория:** AuthBypass (OWASP A01)
**Файл:** `/js/auth.js` — строки 9, 46-53, 57-62; `/admin.html` — строки 317-329
**Описание:** Авторизация полностью клиентская. Роль определяется по `ECOTECH_AUTH.id`, который ищется в массиве `ECOTECH_USERS` в localStorage. Через DevTools можно за 10 секунд получить admin-доступ к админ-панели, включая: управление пользователями, экспорт всех данных, сброс платформы.

**PoC:**
```
1. Открыть DevTools > Console
2. localStorage.setItem('ECOTECH_AUTH', JSON.stringify({id:'U001', ts:Date.now()}));
3. Перейти на admin.html — полный доступ администратора
```

Или создать нового admin-пользователя:
```
1. var users = JSON.parse(localStorage.getItem('ECOTECH_USERS') || 'null') || [{"id":"U001","name":"Admin","role":"admin","email":""}];
2. users[0].role = 'admin';
3. localStorage.setItem('ECOTECH_USERS', JSON.stringify(users));
4. localStorage.setItem('ECOTECH_AUTH', JSON.stringify({id: users[0].id, ts: Date.now()}));
```

**Рекомендация:**
- MVP/пилот: добавить disclaimer "Авторизация демонстрационная, не защищает данные"
- До продакшена: серверная авторизация (SSO через WB ID)
- Немедленно: переместить admin.html на неочевидный путь (security through obscurity как временная мера)
- Добавить `requireAuth` проверку с редиректом на login для всех защищённых страниц

**Приоритет: ДО ПИЛОТА (disclaimer) / ДО ПРОДАКШЕНА (серверная авторизация)**

---

## SEC-003 | Severity: HIGH
**Категория:** PII / ФЗ-152 (OWASP A02)
**Файл:** `/js/auth.js` — строки 13-18
**Описание:** Массив `DEFAULT_USERS` содержит реальное ФИО сотрудника и корпоративный email (`sorval.viktor@rwb.ru`). Репозиторий публичный (github.com/sorvalliny/ecotech) — данные видны любому. Это нарушение ФЗ-152 и внутренних политик ИБ.

**Конкретные PII:**
- Строка 14: `name: 'Виктор Сорвал'`, `email: 'sorval.viktor@rwb.ru'`

Остальные записи (U002-U005) содержат только функциональные роли без реальных email — это приемлемо.

**PoC:** Открыть https://github.com/sorvalliny/ecotech/blob/main/js/auth.js — ФИО и email видны публично.

**Рекомендация:**
```js
// Заменить на:
{ id: 'U001', name: 'Администратор', role: 'admin', email: '', productIds: [] },
```
Реальные email использовать только в localStorage при деплое, не хардкодить в коде. Также убрать `sorval.viktor@rwb.ru` из `brief.html` строка 461 (mailto-ссылка).

**Приоритет: ДО ПИЛОТА**

---

## SEC-004 | Severity: HIGH
**Категория:** CDN Supply Chain (OWASP A08)
**Файл:** Множественные файлы (см. список ниже)
**Описание:** Все внешние скрипты и стили подключены через CDN (jsdelivr) без атрибута `integrity` (Subresource Integrity). При компрометации CDN злоумышленник может внедрить произвольный код на все страницы платформы.

**Затронутые CDN-ресурсы без integrity:**

| Файл | Библиотека |
|------|-----------|
| `/pages/dashboard.html:8` | chart.js@4.4.8 |
| `/pages/dashboard.html:10` | html2canvas@1.4.1 |
| `/pages/dashboard.html:12` | jspdf@2.5.2 |
| `/business.html:243` | shepherd.js@13 (CSS) |
| `/business.html:250` | shepherd.js@13 (JS) |
| `/Продукту/strategy.html:9` | xlsx@0.18.5 |

Google Fonts (fonts.googleapis.com) используются на ~15 страницах — SRI для Google Fonts технически сложен из-за динамической генерации CSS, но это меньший риск.

**PoC:**
```
1. Компрометация CDN jsdelivr (прецеденты: 2021, 2024)
2. Внедрённый код получает доступ к localStorage (все данные ОРБИТЫ)
3. Exfiltration через fetch() на внешний сервер
```

**Рекомендация:**
Для каждого CDN-скрипта добавить `integrity` и `crossorigin="anonymous"`:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js"
        integrity="sha384-[hash]"
        crossorigin="anonymous"></script>
```
Получить хэши: `curl -s URL | openssl dgst -sha384 -binary | openssl base64 -A`

**Приоритет: ДО ПИЛОТА**

---

## SEC-005 | Severity: HIGH
**Категория:** CSP / Security Misconfiguration (OWASP A05)
**Файл:** ВСЕ HTML-файлы платформы
**Описание:** Ни на одной странице платформы нет Content-Security-Policy (ни через meta-tag, ни через HTTP-заголовок). Это означает:
- Inline-скрипты выполняются без ограничений
- Внедрённый XSS-код может загружать ресурсы с любых доменов
- Нет защиты от clickjacking (отсутствует X-Frame-Options / frame-ancestors)

**PoC:** На GitHub Pages невозможно задать HTTP-заголовки, но CSP можно добавить через meta-tag:
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'">
```

**Рекомендация:**
1. Добавить CSP meta-tag на все страницы (шаблон выше)
2. `unsafe-inline` необходим для текущей архитектуры (inline-скрипты), но ограничивает домены загрузки
3. После миграции на GitLab/корп серверы: CSP через HTTP-заголовок + nonce для inline-скриптов

**Приоритет: ДО ПИЛОТА (meta-tag) / ДО ПРОДАКШЕНА (HTTP-заголовок + nonce)**

---

## SEC-006 | Severity: CRITICAL
**Категория:** XSS / Stored XSS через admin.html
**Файл:** `/admin.html` — строки 369-397
**Описание:** В функции `renderUsers()` поле `prodNames` строится через `p.name` из данных localStorage без экранирования (строка 378, через `.join(', ')`), и затем вставляется в innerHTML (строка 397). При этом `escHtml()` применяется к `u.name` и `u.email` (строки 387, 389), но НЕ к именам продуктов (строка 378). Если имя продукта содержит HTML-код, оно выполнится.

**PoC:**
```
1. Создать продукт с именем: <img src=x onerror=alert('XSS')>
2. Назначить его пользователю
3. Открыть admin.html > вкладка Пользователи
4. В колонке "Продукты" выполнится скрипт
```

**Рекомендация:**
Строка 378 — обернуть `p.name` в `escHtml()`:
```js
return p ? escHtml(p.name) : pid;
```

**Приоритет: ДО ПИЛОТА**

---

## Матрица приоритетов

| ID | Severity | Исправление | Сложность | Приоритет |
|----|----------|------------|-----------|-----------|
| SEC-001 | CRITICAL | Добавить escHtml() в tracker.html | Средняя (много мест) | До пилота |
| SEC-002 | CRITICAL | Disclaimer + обфускация пути | Низкая | До пилота |
| SEC-003 | HIGH | Убрать ФИО/email из кода | Низкая (5 мин) | До пилота |
| SEC-004 | HIGH | Добавить SRI-хэши | Низкая (30 мин) | До пилота |
| SEC-005 | HIGH | Добавить CSP meta-tag | Низкая (15 мин) | До пилота |
| SEC-006 | CRITICAL | escHtml() для product names | Низкая (5 мин) | До пилота |

---

## Вне скоупа (для следующего аудита)

- localStorage не шифрован (все данные читаются через DevTools) — MEDIUM
- Нет session expiry в ECOTECH_AUTH (токен живёт вечно) — MEDIUM
- Нет rate limiting (GitHub Pages) — LOW для пилота
- Нет audit log на сервере (только localStorage changelog) — MEDIUM
- `eval()` / `document.write()` — не обнаружены (хорошо)
- HTTPS — обеспечивается GitHub Pages по умолчанию (OK)

---

*SEC-EXPRESS-AUDIT.md | ОРБИТА | WB Экосистема*
*Создано: 17 марта 2026 | Агент ИБ*
