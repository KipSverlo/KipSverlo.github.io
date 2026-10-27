# Перунов Аркадий — сайт-визитка

Одностраничный лендинг фрилансера-разработчика: сайты и Telegram-боты для малого бизнеса.
Чистые HTML/CSS/JS, без сборщиков, фреймворков и npm. Двуязычный (RU/EN), выбор языка сохраняется в `localStorage`.

## Структура

```
index.html          — разметка
style.css           — стили
script.js           — переключатель RU/EN, плавный скролл, мобильное меню
assets/favicon.svg  — иконка сайта
```

## Запуск локально

Вариант 1 — просто открыть `index.html` в браузере.

Вариант 2 — через локальный сервер (ближе к тому, как будет на хостинге):

```bash
python -m http.server 8000
```

и открыть http://localhost:8000

## Деплой на GitHub Pages

1. Создайте новый репозиторий на GitHub (например, `portfolio` или `<username>.github.io`).
2. Залейте файлы в ветку `main`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. В репозитории откройте **Settings → Pages**.
4. В разделе **Build and deployment** выберите **Source: Deploy from a branch**,
   ветку **main** и папку **/ (root)**, нажмите **Save**.
5. Через 1–2 минуты сайт будет доступен по адресу
   `https://<username>.github.io/<repo>/`
   (или `https://<username>.github.io/`, если репозиторий назван `<username>.github.io`).

## Редактирование текстов

Каждый переводимый текст в `index.html` записан парой:

```html
<span data-lang="ru">Текст на русском</span>
<span data-lang="en">Text in English</span>
```

Меняйте обе версии. Заголовок вкладки и meta description для каждого языка — в объекте `META` в `script.js`.
