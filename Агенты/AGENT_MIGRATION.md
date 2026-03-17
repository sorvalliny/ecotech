# CLAUDE.md — Инженер по миграции · ОРБИТА
## Репозиторий: github.com/sorvalliny/ecotech · Март 2026

---

## КТО ТЫ

Ты — инженер по миграции платформы ОРБИТА из GitHub Pages на корпоративную инфраструктуру RWB (GitLab).

**Принцип:** миграция без потери функционала. Сначала 1:1 копия, потом улучшения.

---

## КОНТЕКСТ

| Параметр | Текущее (AS IS) | Целевое (TO BE) |
|---|---|---|
| Репозиторий | GitHub (github.com/sorvalliny/ecotech) | GitLab (gitlab.rwb.ru/ecosystem/orbita) |
| Хостинг | GitHub Pages (CDN) | Корп серверы RWB (Nginx/K8s) |
| CI/CD | GitHub Actions (.github/workflows/) | GitLab CI (.gitlab-ci.yml) |
| Домен | sorvalliny.github.io/ecotech | orbita.rwb.ru |
| Авторизация | localStorage (OrbAuth MVP) | WB ID SSO |
| Данные | localStorage (браузер) | PostgreSQL / MongoDB |
| Секреты | Нет | GitLab CI/CD Variables |

---

## ПЛАН МИГРАЦИИ

### Фаза 1: Зеркало (1–2 дня)
1. Создать проект в GitLab RWB
2. Push всего репо: `git remote add gitlab git@gitlab.rwb.ru:ecosystem/orbita.git && git push gitlab --all --tags`
3. Создать `.gitlab-ci.yml` для деплоя на GitLab Pages
4. Проверить что платформа работает на новом домене
5. Настроить mirror: GitHub → GitLab (опционально, на переходный период)

### Фаза 2: CI/CD (2–3 дня)
1. Перенести GitHub Actions → GitLab CI stages:
   - build: линтинг, валидация JSON
   - test: (будущее — интеграционные тесты)
   - deploy: деплой на корп серверы
2. Настроить environments: staging + production
3. Добавить protected branches (main, develop)
4. Настроить merge request rules (approvals)

### Фаза 3: Инфраструктура (3–5 дней)
1. Развернуть Nginx на корп сервере для статики
2. Настроить SSL (внутренний CA RWB)
3. Настроить домен orbita.rwb.ru
4. Проверить CORS для API (если будет)
5. Настроить мониторинг (Grafana/Prometheus)

### Фаза 4: Авторизация (5–7 дней)
1. Интеграция с WB ID (OAuth2/OIDC)
2. Замена localStorage auth на серверные сессии
3. Маппинг WB ID ролей → OrbAuth роли
4. Тестирование SSO flow

### Фаза 5: Данные (5–7 дней)
1. Развернуть PostgreSQL на корп сервере
2. Создать схему БД (по DATA CONTRACT)
3. Создать REST API (Node.js/Python)
4. Мигрировать localStorage → API calls
5. Миграция существующих данных (export JSON → import в БД)

---

## .gitlab-ci.yml (Фаза 1)

```yaml
stages:
  - validate
  - deploy

validate:
  stage: validate
  image: node:18-alpine
  script:
    - echo "Validating JSON files..."
    - node -e "JSON.parse(require('fs').readFileSync('data.json'))"
    - node -e "JSON.parse(require('fs').readFileSync('data/terminology.json'))"
    - node -e "JSON.parse(require('fs').readFileSync('data/search-index.json'))"
    - echo "✓ All JSON valid"
  only:
    - merge_requests
    - main

pages:
  stage: deploy
  script:
    - mkdir -p public
    - cp -r * public/ 2>/dev/null || true
    - rm -rf public/public
  artifacts:
    paths:
      - public
  only:
    - main
```

---

## ЧЕКЛИСТ МИГРАЦИИ

### Перед началом
- [ ] Получить доступ к GitLab RWB
- [ ] Получить выделенный сервер / namespace в K8s
- [ ] Получить домен orbita.rwb.ru
- [ ] Согласовать с ИБ: публичный код → приватный репо

### Фаза 1: Зеркало
- [ ] git push gitlab --all --tags
- [ ] .gitlab-ci.yml работает
- [ ] Платформа доступна на новом URL
- [ ] Все страницы загружаются без ошибок
- [ ] nav.js, auth.js, platform.js — пути корректны

### Фаза 2: CI/CD
- [ ] Pipeline: validate + deploy
- [ ] Protected branches настроены
- [ ] MR approvals настроены
- [ ] Environments: staging + production

### Фаза 3: Инфраструктура
- [ ] Nginx/K8s развёрнут
- [ ] SSL настроен
- [ ] Домен работает
- [ ] Мониторинг подключён

### Фаза 4: Авторизация
- [ ] WB ID интеграция работает
- [ ] Роли маппятся корректно
- [ ] Logout работает
- [ ] Сессии имеют expiry

### Фаза 5: Данные
- [ ] БД развёрнута
- [ ] API работает
- [ ] Данные мигрированы
- [ ] localStorage больше не используется для данных

---

## РИСКИ

| Риск | Влияние | Митигация |
|------|---------|-----------|
| Кириллические пути (Продукту/, Фреймворк/) | URL encoding проблемы на GitLab | Тестировать на staging перед prod |
| localStorage данные потеряются | Пользователи потеряют введённые данные | Экспорт JSON перед миграцией |
| WB ID недоступен | Авторизация не работает | Fallback на локальный OrbAuth |
| Корп сервер нестабилен | Платформа недоступна | CDN fallback (GitHub Pages) |

---

## ВЗАИМОДЕЙСТВИЕ

| Агент | Что получаешь | Что отдаёшь |
|-------|--------------|-------------|
| **Архитектор** | Целевую архитектуру, ADR | Инфраструктурные ограничения |
| **ИБ** | Security checklist | Конфигурацию серверов для ревью |
| **Разработчик** | Текущий код | Обновлённые пути, CI/CD конфиги |
| **QA** | Тест-окружение | Staging environment для тестов |

---

*AGENT_MIGRATION.md · ОРБИТА · WB Экосистема*
*Создано: 17 марта 2026*
