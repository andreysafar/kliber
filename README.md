# 🎯 Система отслеживания переходов

Простая система для сбора данных о переходах пользователей по ссылкам с мгновенным редиректом.

## 🚀 Быстрый запуск

### 1. Настройка Google Таблицы
1. Создай новую таблицу в Google Sheets
2. Расширения → Apps Script
3. Вставь код из `script.gs`
4. Сохрани (Ctrl+S)
5. Разверни как веб-приложение:
   - Развернуть → Новое развертывание
   - Тип: Веб-приложение
   - Доступ: Все (даже анонимные)
   - Скопируй URL

### 2. Настройка ссылки
В `index.html` замени `SCRIPT_URL` на твой URL из шага 1:

**Текущий SCRIPT_URL:**
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxkrRaN1gI31JBKxXwexdrOMjpgMwEpX1mFffMhzO3USeM5yorjQk2Vrg71yiwFVHU/exec';
```

### 3. Скачай файлы
📁 **[index.html](https://github.com/andreysafar/kliber/blob/Prod/index.html)** - страница отслеживания
📁 **[script.gs](https://github.com/andreysafar/kliber/blob/Prod/script.gs)** - код для Google Apps Script

Или скопируй код напрямую:
📋 **[index.html сырой код](https://raw.githubusercontent.com/andreysafar/kliber/Prod/index.html)**
📋 **[script.gs сырой код](https://raw.githubusercontent.com/andreysafar/kliber/Prod/script.gs)**

### 4. Готовая ссылка
Используй: **`https://andreysafar.github.io/kliber/`** (эта ссылка уже работает сейчас)

— Открывается минимальная страница, которая собирает данные и сразу перенаправляет.

## 📧 Что делает система

✅ **Собирает данные** о пользователе (браузер, устройство, экран)
✅ **Сохраняет в таблицу** автоматически
✅ **Отправляет email** с информацией о переходе
✅ **Делает редирект** на целевую страницу незаметно

## 🎨 Использование

### Что уже настроено (работает из коробки)
- Ссылка: `https://andreysafar.github.io/kliber/`
- Отправка данных в таблицу через `SCRIPT_URL` (см. выше)
- Email-уведомления на `anastasiyaanastasiya510@gmail.com`

### Что можно поменять вручную
- В `index.html` можно добавить свои параметры в ссылку (после `?`)
- В `script.gs` можно изменить получателя писем в `EMAIL_TO`
- Можно сократить длинные ссылки через Bitly/TinyURL и использовать их в QR

### Простая ссылка
```html
<a href="https://andreysafar.github.io/kliber/">Ссылка с аналитикой</a>
```

### С параметрами
```html
<!-- Источник трафика -->
<a href="https://andreysafar.github.io/kliber/?source=qr_code">QR-код</a>

<!-- Кампания и локация -->
<a href="https://andreysafar.github.io/kliber/?campaign=summer2024&location=moscow">Летняя кампания Москва</a>

<!-- Множественные параметры -->
<a href="https://andreysafar.github.io/kliber/?source=email&campaign=newsletter&user_id=123">Рассылка пользователя 123</a>
```

## 🎯 QR-коды и сокращенные ссылки

### Создание QR-кодов для разных мероприятий

Используй параметры для отслеживания разных источников трафика:

**Для презентации:**
```
https://andreysafar.github.io/kliber/?source=presentation&speaker=Иван&event=Конференция2024
```

**Для выставочного стенда:**
```
https://andreysafar.github.io/kliber/?source=exhibition&booth=A1&city=Москва
```

**Для email рассылки:**
```
https://andreysafar.github.io/kliber/?source=email&campaign=Winter2024&segment=vip
```

**Для соцсетей:**
```
https://andreysafar.github.io/kliber/?source=instagram&campaign=holiday&post_id=12345
```

### Примеры использования на мероприятиях

| Мероприятие | Параметры | Цель отслеживания |
|-------------|-----------|-------------------|
| Конференция | `?event=TechConf&speaker=Иван&topic=AI` | Кто из спикеров привлек больше трафика |
| Выставка | `?exhibition=Expo&booth=A1&industry=IT` | Эффективность разных стендов |
| Семинар | `?seminar=Marketing&instructor=Анна&format=online` | Популярность форматов обучения |
| Акция | `?promotion=Sale&product=Course&discount=20%` | Конверсия разных предложений |

### Генерация QR-кодов

#### Способ 1: Онлайн генераторы (самый простой)

**Рекомендуемые сервисы:**
- 🏆 **[QR Code Monkey](https://www.qrcode-monkey.com/)** - красивые дизайны
- ⚡ **[QR Code Generator](https://www.qr-code-generator.com/)** - быстро и просто
- 🎨 **[Beaconstac](https://www.beaconstac.com/qr-code-generator)** - кастомизация

**Пошаговая инструкция:**
1. Зайди на любой из сервисов выше
2. Выбери тип "URL" или "Ссылка"
3. Вставь длинную ссылку с параметрами
4. Настрой дизайн (цвета, логотип)
5. Скачай PNG файл
6. Распечатай или используй цифровой формат

#### Способ 2: Сокращение ссылок

**Зачем сокращать?**
- Длинные ссылки некрасиво выглядят в QR-кодах
- Меньше места занимает
- Легче сканировать

**Популярные сервисы для сокращения:**
- 🔗 **[Bitly](https://bitly.com/)** - аналитика кликов
- ⚡ **[TinyURL](https://tinyurl.com/)** - просто и быстро
- 🎯 **[Rebrandly](https://www.rebrandly.com/)** - кастомные домены

**Как сократить:**
1. Зайди на сервис сокращения ссылок
2. Вставь длинную ссылку:
   ```
   https://andreysafar.github.io/kliber/?source=conference&event=TechMeet2024&speaker=Иван
   ```
3. Получи короткую ссылку:
   ```
   https://bit.ly/3abc123
   ```
4. Используй короткую ссылку для генерации QR-кода

**Пример полного процесса:**

**Исходная длинная ссылка:**
```
https://andreysafar.github.io/kliber/?source=presentation&speaker=Анна&event=MarketingConf&date=2024-01-15&location=moscow
```

**Шаг 1 - Сокращение:**
```
https://bit.ly/MarketingConf2024
```

**Шаг 2 - Генерация QR-кода:**
- Зайди на QR Code Monkey
- Вставь `https://bit.ly/MarketingConf2024`
- Выбери дизайн (добавь логотип компании)
- Скачай PNG размером 1000x1000 пикселей

**Шаг 3 - Готовый QR-код:**
Теперь у тебя есть красивый QR-код для печати на флаеры конференции!

## 📊 Что сохраняется

Таблица создается автоматически с колонками:
- **Время перехода** - дата и время в МСК
- **Браузер и ОС** - Chrome на Windows, Safari на iPhone и т.д.
- **Разрешение экрана** - размер монитора/экрана пользователя
- **Часовой пояс** - где находится пользователь
- **Источник перехода** - откуда пришел (referrer)
- **Ваши кастомные параметры** - source, campaign, location и др.

### Как посмотреть данные

1. Открой Google Таблицу
2. Найди лист "clicks"
3. Смотри данные в реальном времени!

## 📧 Email уведомления

При каждом переходе приходит письмо с полной информацией:

**Что в письме:**
- 📱 **Устройство** - ОС, браузер, мобильное ли устройство
- 🌍 **Местоположение** - часовой пояс, языки браузера
- 🔗 **Источник** - откуда пришел пользователь
- 🏷 **Ваши параметры** - все кастомные параметры из ссылки
- ⚙️ **Технические данные** - разрешение экрана, память устройства

**Настройка получателя:**
В `script.gs` измени строку:
```javascript
var EMAIL_TO = 'твой@email.com';
```

**Как выглядит письмо:**
```
🔔 Новый переход по ссылке

📱 Устройство:
• ОС: Windows
• Браузер: Chrome
• Мобильное: Нет

🏷 Параметры:
• source: qr_code
• campaign: conference2024
• location: moscow

🕐 Время: 15.01.2024 14:30 МСК
```

## 🤖 Улучшение через Telegram бота

Для большей удобности можно добавить Telegram бота:

### Преимущества
- 💬 Мгновенные уведомления в мессенджере
- 📊 Кнопки для просмотра статистики
- 👥 Отправка в несколько чатов

### Простая настройка

1. Создай бота через @BotFather в Telegram
2. Получи токен бота
3. Добавь в `index.html` отправку в Telegram:

```javascript
// Добавить в функцию sendData()
await fetch(`https://api.telegram.org/bot${токен}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: 'твой_chat_id',
    text: `Новый переход! ${JSON.stringify(userData)}`
  })
});
```

## ✅ Готово!

Теперь твоя система отслеживания готова к работе! 🎉

