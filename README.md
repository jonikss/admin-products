# Admin Products

Панель администратора для управления каталогом товаров. Построена на React Router 7 с серверным рендерингом и AI-командной строкой для управления интерфейсом на естественном языке.

**Demo:** https://admin-products-two.vercel.app/

## Стек технологий

- **React 19** + **TypeScript**
- **React Router 7** (SSR, вложенные маршруты, clientLoader)
- **TanStack Query** — загрузка и кэширование данных
- **TanStack Table** — таблица с сортировкой и выбором строк
- **React Hook Form** + **Zod** — формы и валидация
- **LangChain.js** — интеграция с LLM для парсинга команд
- **Tailwind CSS 4** — стилизация
- **Vite 7** — сборка и HMR

## Функциональность

- Авторизация (логин/выход, защита маршрутов через `clientLoader`)
- Таблица товаров с серверной сортировкой и пагинацией через URL-параметры
- **Magic Command Bar** — AI-строка, заменяющая обычный поиск:
  - `iphone` — поиск товаров
  - `sort by price desc` — сортировка таблицы
  - `add iPhone 15 by Apple for 999` — открытие формы с предзаполнением
  - `page 3` — переход на страницу
  - `refresh` — обновление данных
  - Подсказки команд при фокусе на пустое поле
  - Fallback на обычный поиск при ошибке LLM
- Добавление товара через drawer (боковая панель на роутинге)
- Скелетон при загрузке данных

## LLM-провайдеры

CommandBar вызывает LLM на сервере через React Router action (`/api/command`). Провайдер настраивается через переменные окружения:

| `LLM_PROVIDER` | Переменные | Описание |
|---|---|---|
| `ollama` | `OLLAMA_BASE_URL` (опционально) | Локальная модель, по умолчанию `llama3.1:8b` |
| `groq` | `GROQ_API_KEY` | Groq Cloud, `llama-3.1-8b-instant` |
| `openai` | `OPENAI_API_KEY`, `OPENAI_BASEURL`, `OPENAI_MODEL` (опционально) | Любой OpenAI-совместимый API (OpenRouter, Together и др.) |

Пример `.env` для локальной разработки с Ollama:
```
LLM_PROVIDER=ollama
```

Пример `.env` для деплоя с OpenAI-совместимым API:
```
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_BASEURL=https://api.example.com/v1
OPENAI_MODEL=meta-llama/llama-3.1-8b-instruct
```

## API

Используется публичный API [DummyJSON](https://dummyjson.com):

- `GET /auth/login` — авторизация
- `GET /products/search` — список товаров с поиском, сортировкой и пагинацией
- `POST /products/add` — добавление товара

## Структура проекта

```
app/
  features/
    command-bar/
      schemas/command.schema.ts         # Zod-схема команд (discriminated union)
      services/llm.service.ts           # LangChain + LLM, parseCommand()
      hooks/use-command-executor.ts     # Выполнение команд через колбэки
      components/CommandBar/index.tsx   # UI: форма + input + подсказки
      index.ts                          # Реэкспорт
    products/
      api.ts                            # API товаров и типы
      hooks/
        use-products.ts                 # Хук: query + сортировка + поиск + пагинация
      components/
        ProductsTable/index.tsx         # Таблица товаров
        ProductsTableSkeleton/index.tsx
        ProductsToolbar/index.tsx       # Панель действий
        AddProductDrawer/index.tsx      # Drawer добавления товара
    auth/
      api.ts                            # API авторизации и сессия
      components/
        LoginForm/index.tsx             # Форма входа
        LoginForm/validation.ts
  components/
    ui/
      Checkbox/index.tsx                # Переиспользуемые UI-компоненты
      TextInput/index.tsx
      SearchInput/index.tsx
      Pagination/index.tsx
      ProgressBar/index.tsx
  lib/
    cn.ts                               # Утилита cn (clsx + tailwind-merge)
  routes/
    api.command.ts                      # Server action для LLM-вызова
    products.tsx                        # Layout с auth guard
    products.index.tsx                  # Страница каталога
    products.empty.tsx                  # Index route (пустой)
    products.add.tsx                    # Drawer добавления
    login.tsx                           # Страница входа
public/
  icons/                                # SVG-иконки
```

## Запуск

### Установка зависимостей

```bash
npm install
```

### Настройка окружения

Создай файл `.env` в корне проекта (см. раздел «LLM-провайдеры» выше).

### Режим разработки

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`.

### Проверка типов

```bash
npm run typecheck
```

### Сборка для продакшена

```bash
npm run build
```

### Запуск продакшен-сборки

```bash
npm run build
npm run start
```

## Деплой

Проект задеплоен на [Vercel](https://vercel.com) через интеграцию с GitHub. Каждый пуш в ветку `master` автоматически запускает новый деплой.

Для деплоя своей копии:

1. Форкни репозиторий
2. Зайди на [vercel.com/new](https://vercel.com/new)
3. Импортируй репозиторий из GitHub
4. Добавь переменные окружения (`LLM_PROVIDER`, `OPENAI_API_KEY`, `OPENAI_BASEURL`)
5. Vercel автоматически определит фреймворк и настройки сборки
6. Нажми **Deploy**

## Учетные данные для входа

API DummyJSON предоставляет тестового пользователя:

- **Логин:** `emilys`
- **Пароль:** `emilyspass`
