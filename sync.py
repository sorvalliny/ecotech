#!/usr/bin/env python3
"""
EcoTech Platform — синхронизация данных
Запуск: python3 sync.py

Читает data.json и пересоздаёт data.js.
После этого index.html автоматически подхватит новые данные.
"""
import json, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_JSON = os.path.join(BASE, 'data.json')
DATA_JS   = os.path.join(BASE, 'data.js')

def sync():
    # 1. Читаем data.json
    try:
        with open(DATA_JSON, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("✗ data.json не найден")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"✗ Ошибка в data.json: {e}")
        sys.exit(1)

    # 2. Обновляем дату
    from datetime import date
    data['_meta']['updated'] = date.today().isoformat()

    # 3. Пересохраняем data.json с обновлённой датой
    with open(DATA_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # 4. Генерируем data.js
    js = f"""// ─────────────────────────────────────────────────────────────────
// data.js — авто-генерируется из data.json командой: python3 sync.py
// Последнее обновление: {data['_meta']['updated']}
// ─────────────────────────────────────────────────────────────────
window.ECOTECH_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};
"""
    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write(js)

    # 5. Отчёт
    print(f"✓ data.json обновлён ({data['_meta']['updated']})")
    print(f"✓ data.js пересоздан")
    print(f"  Модулей: {len(data['modules'])}")
    print(f"  Продуктов в портфеле: {len([p for p in data['portfolio'] if p['type'] != 'tbd'])}")
    print(f"  Слайдов: {len(data['slides'])}")
    print(f"\nОткрой index.html — данные обновятся автоматически.")

if __name__ == '__main__':
    sync()
