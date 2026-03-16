#!/usr/bin/env bash
# =============================================================
#  ОРБИТА · Активатор агентов
#  Репозиторий: sorvalliny/ecotech
#  Запуск: ./activate-agent.sh [имя-агента]
# =============================================================

set -euo pipefail

# ─── цвета ───────────────────────────────────────────────────
RESET='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

BLACK='\033[0;30m'
WHITE='\033[0;37m'
BWHITE='\033[1;37m'

CYAN='\033[0;36m'
BCYAN='\033[1;36m'
GREEN='\033[0;32m'
BGREEN='\033[1;32m'
YELLOW='\033[0;33m'
BYELLOW='\033[1;33m'
RED='\033[0;31m'
BRED='\033[1;31m'
BLUE='\033[0;34m'
BBLUE='\033[1;34m'
PURPLE='\033[0;35m'
BPURPLE='\033[1;35m'

# ─── константы ───────────────────────────────────────────────
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_DIR="${REPO_ROOT}/Агенты"
CLAUDE_MD="${REPO_ROOT}/CLAUDE.md"
ACTIVE_FILE="${REPO_ROOT}/.active-agent"
LOG_FILE="${REPO_ROOT}/.agent-log"
VERSION="v2.0"

# ─── утилиты ─────────────────────────────────────────────────
print_header() {
  echo ""
  echo -e "${BBLUE}╔════════════════════════════════════════════════════╗${RESET}"
  echo -e "${BBLUE}║${RESET}  ${BWHITE}🛸  ОРБИТА · Активатор агентов · ${VERSION}${RESET}         ${BBLUE}║${RESET}"
  echo -e "${BBLUE}║${RESET}  ${DIM}sorvalliny.github.io/ecotech${RESET}                    ${BBLUE}║${RESET}"
  echo -e "${BBLUE}╚════════════════════════════════════════════════════╝${RESET}"
  echo ""
}

print_step() {
  echo -e "  ${BCYAN}→${RESET}  $1"
}

print_ok() {
  echo -e "  ${BGREEN}✓${RESET}  $1"
}

print_warn() {
  echo -e "  ${BYELLOW}⚠${RESET}  $1"
}

print_err() {
  echo -e "  ${BRED}✗${RESET}  $1" >&2
}

print_dim() {
  echo -e "  ${DIM}$1${RESET}"
}

# лог действий
log_action() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "${LOG_FILE}"
}

# ─── проверки окружения ───────────────────────────────────────
check_env() {
  # Убедиться что мы в корне репозитория
  if [[ ! -d "${AGENTS_DIR}" ]]; then
    print_err "Папка Агенты/ не найдена в: ${REPO_ROOT}"
    print_err "Запускай скрипт из корня репозитория ecotech."
    exit 1
  fi

  # Проверить наличие claude CLI
  if ! command -v claude &> /dev/null; then
    print_err "Claude Code CLI не найден."
    print_err "Установи: npm install -g @anthropic-ai/claude-code"
    exit 1
  fi
}

# ─── список агентов ───────────────────────────────────────────
list_agents() {
  # Возвращает массив .md файлов из папки Агенты/
  local -a agents=()
  while IFS= read -r -d '' file; do
    agents+=("$(basename "${file}" .md)")
  done < <(find "${AGENTS_DIR}" -maxdepth 1 -name "*.md" -print0 | sort -z)
  printf '%s\n' "${agents[@]}"
}

# ─── описание агента из фронтматера ──────────────────────────
get_agent_meta() {
  local file="$1"
  local field="$2"
  grep -m1 "^${field}:" "${file}" 2>/dev/null | sed 's/^[^:]*: *//' | tr -d '"' || echo ""
}

# ─── меню выбора ─────────────────────────────────────────────
show_menu() {
  local -a agents=()
  mapfile -t agents < <(list_agents)

  if [[ ${#agents[@]} -eq 0 ]]; then
    print_err "В папке Агенты/ не найдено ни одного .md файла."
    exit 1
  fi

  echo -e "  ${BWHITE}Доступные агенты:${RESET}"
  echo ""

  local i=1
  for agent in "${agents[@]}"; do
    local file="${AGENTS_DIR}/${agent}.md"
    local desc
    desc="$(get_agent_meta "${file}" "description")"
    local role
    role="$(get_agent_meta "${file}" "role")"

    # маркер активного агента
    local active_mark=""
    if [[ -f "${ACTIVE_FILE}" ]] && [[ "$(cat "${ACTIVE_FILE}")" == "${agent}" ]]; then
      active_mark=" ${BGREEN}← активен${RESET}"
    fi

    echo -e "  ${BCYAN}[${i}]${RESET}  ${BWHITE}${agent}${RESET}${active_mark}"
    [[ -n "${role}" ]]  && echo -e "       ${DIM}Роль: ${role}${RESET}"
    [[ -n "${desc}" ]]  && echo -e "       ${DIM}${desc}${RESET}"
    echo ""
    ((i++))
  done

  echo -e "  ${BCYAN}[0]${RESET}  ${DIM}Выход${RESET}"
  echo ""

  local choice
  read -rp "$(echo -e "  ${BYELLOW}Выбери агента [1-$((i-1))]: ${RESET}")" choice

  if [[ "${choice}" == "0" ]] || [[ -z "${choice}" ]]; then
    echo ""
    print_dim "Выход."
    exit 0
  fi

  if ! [[ "${choice}" =~ ^[0-9]+$ ]] || \
     [[ "${choice}" -lt 1 ]] || \
     [[ "${choice}" -gt "${#agents[@]}" ]]; then
    print_err "Неверный выбор: ${choice}"
    exit 1
  fi

  echo "${agents[$((choice-1))]}"
}

# ─── активация агента ─────────────────────────────────────────
activate_agent() {
  local agent_name="$1"
  local agent_file="${AGENTS_DIR}/${agent_name}.md"

  # Проверка файла
  if [[ ! -f "${agent_file}" ]]; then
    print_err "Файл не найден: ${agent_file}"
    exit 1
  fi

  echo ""
  print_step "Активирую агента: ${BWHITE}${agent_name}${RESET}"

  # ── 1. Читаем метаданные ──────────────────────────────────
  local desc role author version
  desc="$(get_agent_meta "${agent_file}" "description")"
  role="$(get_agent_meta "${agent_file}" "role")"
  author="$(get_agent_meta "${agent_file}" "author")"
  version="$(get_agent_meta "${agent_file}" "version")"

  # ── 2. Сохраняем как CLAUDE.md ────────────────────────────
  # Claude Code автоматически читает CLAUDE.md при запуске
  print_step "Записываю инструкцию в CLAUDE.md..."

  {
    echo "<!-- AUTO-GENERATED by activate-agent.sh -->"
    echo "<!-- Агент: ${agent_name} · $(date '+%Y-%m-%d %H:%M:%S') -->"
    echo "<!-- Источник: Агенты/${agent_name}.md -->"
    echo ""
    cat "${agent_file}"
  } > "${CLAUDE_MD}"

  print_ok "CLAUDE.md обновлён из Агенты/${agent_name}.md"

  # ── 3. Запоминаем активного агента ───────────────────────
  echo "${agent_name}" > "${ACTIVE_FILE}"

  # ── 4. Лог ───────────────────────────────────────────────
  log_action "ACTIVATE agent=${agent_name} repo=${REPO_ROOT}"

  # ── 5. Итог ──────────────────────────────────────────────
  echo ""
  echo -e "  ${BBLUE}┌──────────────────────────────────────────────┐${RESET}"
  echo -e "  ${BBLUE}│${RESET}  ${BGREEN}Агент активирован:${RESET} ${BWHITE}${agent_name}${RESET}"
  [[ -n "${role}" ]]    && echo -e "  ${BBLUE}│${RESET}  ${DIM}Роль:${RESET}     ${role}"
  [[ -n "${desc}" ]]    && echo -e "  ${BBLUE}│${RESET}  ${DIM}Описание:${RESET} ${desc}"
  [[ -n "${version}" ]] && echo -e "  ${BBLUE}│${RESET}  ${DIM}Версия:${RESET}   ${version}"
  echo -e "  ${BBLUE}│${RESET}"
  echo -e "  ${BBLUE}│${RESET}  ${DIM}CLAUDE.md обновлён ← Агенты/${agent_name}.md${RESET}"
  echo -e "  ${BBLUE}│${RESET}  ${DIM}Запусти:${RESET}  ${BGREEN}claude${RESET}"
  echo -e "  ${BBLUE}└──────────────────────────────────────────────┘${RESET}"
  echo ""
}

# ─── статус текущего агента ───────────────────────────────────
show_status() {
  echo ""
  if [[ -f "${ACTIVE_FILE}" ]]; then
    local active
    active="$(cat "${ACTIVE_FILE}")"
    echo -e "  ${BGREEN}Активный агент:${RESET} ${BWHITE}${active}${RESET}"

    local agent_file="${AGENTS_DIR}/${active}.md"
    if [[ -f "${agent_file}" ]]; then
      local desc role version
      desc="$(get_agent_meta "${agent_file}" "description")"
      role="$(get_agent_meta "${agent_file}" "role")"
      version="$(get_agent_meta "${agent_file}" "version")"
      [[ -n "${role}" ]]    && print_dim "Роль: ${role}"
      [[ -n "${desc}" ]]    && print_dim "${desc}"
      [[ -n "${version}" ]] && print_dim "Версия: ${version}"
    fi
  else
    print_warn "Ни один агент не активирован."
    print_dim  "Запусти: ./activate-agent.sh"
  fi

  echo ""

  if [[ -f "${CLAUDE_MD}" ]]; then
    local lines
    lines=$(wc -l < "${CLAUDE_MD}")
    print_dim "CLAUDE.md: ${lines} строк"
  else
    print_warn "CLAUDE.md отсутствует"
  fi

  echo ""
}

# ─── деактивация ─────────────────────────────────────────────
deactivate_agent() {
  if [[ -f "${ACTIVE_FILE}" ]]; then
    local active
    active="$(cat "${ACTIVE_FILE}")"
    rm -f "${ACTIVE_FILE}"
    print_ok "Агент ${active} деактивирован."
    log_action "DEACTIVATE agent=${active}"
  else
    print_warn "Ни один агент не был активен."
  fi

  # Очищаем CLAUDE.md или восстанавливаем дефолтный
  if [[ -f "${CLAUDE_MD}" ]]; then
    # Оставляем только заголовок-напоминание
    echo "# CLAUDE.md — ОРБИТА" > "${CLAUDE_MD}"
    echo "" >> "${CLAUDE_MD}"
    echo "Агент не активирован. Запусти: ./activate-agent.sh" >> "${CLAUDE_MD}"
    print_ok "CLAUDE.md сброшен."
  fi
  echo ""
}

# ─── прямой запуск claude с агентом ──────────────────────────
launch_claude() {
  local agent_name="$1"

  # Сначала активируем
  activate_agent "${agent_name}"

  echo ""
  print_step "Запускаю Claude Code..."
  echo ""

  # Запускаем claude — он автоматически прочитает CLAUDE.md
  exec claude
}

# ─── ТОЧКА ВХОДА ─────────────────────────────────────────────
main() {
  print_header
  check_env

  case "${1:-}" in

    # ── явное имя агента ─────────────────────────────────
    --launch|-l)
      local agent_name="${2:-}"
      if [[ -z "${agent_name}" ]]; then
        print_err "Укажи имя агента: ./activate-agent.sh --launch ИМЯ"
        exit 1
      fi
      launch_claude "${agent_name}"
      ;;

    # ── только активировать без запуска ──────────────────
    --activate|-a)
      local agent_name="${2:-}"
      if [[ -z "${agent_name}" ]]; then
        print_err "Укажи имя агента: ./activate-agent.sh --activate ИМЯ"
        exit 1
      fi
      activate_agent "${agent_name}"
      ;;

    # ── статус ───────────────────────────────────────────
    --status|-s)
      show_status
      ;;

    # ── деактивировать ────────────────────────────────────
    --deactivate|-d)
      deactivate_agent
      ;;

    # ── список агентов ───────────────────────────────────
    --list)
      if [[ ! -d "${AGENTS_DIR}" ]]; then
        print_err "Папка Агенты/ не найдена."; exit 1
      fi
      echo ""
      echo -e "  ${BWHITE}Агенты в Агенты/:${RESET}"
      echo ""
      list_agents | while read -r agent; do
        local file="${AGENTS_DIR}/${agent}.md"
        local desc
        desc="$(get_agent_meta "${file}" "description")"
        echo -e "  ${BCYAN}•${RESET}  ${BWHITE}${agent}${RESET}  ${DIM}${desc}${RESET}"
      done
      echo ""
      ;;

    # ── помощь ───────────────────────────────────────────
    --help|-h)
      echo -e "  ${BWHITE}Использование:${RESET}"
      echo ""
      echo -e "  ${CYAN}./activate-agent.sh${RESET}              ${DIM}интерактивное меню${RESET}"
      echo -e "  ${CYAN}./activate-agent.sh -a ИМЯ${RESET}       ${DIM}активировать агента${RESET}"
      echo -e "  ${CYAN}./activate-agent.sh -l ИМЯ${RESET}       ${DIM}активировать и запустить claude${RESET}"
      echo -e "  ${CYAN}./activate-agent.sh -s${RESET}            ${DIM}показать статус${RESET}"
      echo -e "  ${CYAN}./activate-agent.sh -d${RESET}            ${DIM}деактивировать агента${RESET}"
      echo -e "  ${CYAN}./activate-agent.sh --list${RESET}        ${DIM}список всех агентов${RESET}"
      echo ""
      echo -e "  ${BWHITE}Примеры:${RESET}"
      echo ""
      echo -e "  ${GREEN}\$${RESET} ./activate-agent.sh"
      echo -e "  ${GREEN}\$${RESET} ./activate-agent.sh -l ux-ui-agent"
      echo -e "  ${GREEN}\$${RESET} ./activate-agent.sh -a ux-ui-agent && claude"
      echo ""
      ;;

    # ── конкретное имя без флага ──────────────────────────
    ?*)
      # Если первый аргумент — имя файла (без .md)
      local agent_name="${1}"
      if [[ -f "${AGENTS_DIR}/${agent_name}.md" ]]; then
        activate_agent "${agent_name}"
      else
        print_err "Агент не найден: ${agent_name}"
        print_dim  "Доступные агенты:"
        list_agents | while read -r a; do echo -e "    ${CYAN}•${RESET} ${a}"; done
        echo ""
        exit 1
      fi
      ;;

    # ── интерактивное меню ────────────────────────────────
    "")
      local chosen
      chosen="$(show_menu)"
      if [[ -n "${chosen}" ]]; then
        echo ""

        # Спросить: только активировать или сразу запустить?
        local action
        read -rp "$(echo -e "  ${BYELLOW}Запустить claude сразу? [Y/n]: ${RESET}")" action
        action="${action:-Y}"

        if [[ "${action}" =~ ^[Yy]$ ]]; then
          launch_claude "${chosen}"
        else
          activate_agent "${chosen}"
          echo -e "  ${DIM}Запусти когда будешь готов: ${BGREEN}claude${RESET}"
          echo ""
        fi
      fi
      ;;
  esac
}

main "$@"
