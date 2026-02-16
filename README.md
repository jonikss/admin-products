# Admin Products

Панель администратора для управления каталогом товаров. Построена на React Router 7 с серверным рендерингом.

**Demo:** https://admin-products-two.vercel.app/

## Стек технологий

- **React 19** + **TypeScript**
- **React Router 7** (SSR, вложенные маршруты, clientLoader)
- **TanStack Query** — загрузка и кэширование данных
- **TanStack Table** — таблица с сортировкой и выбором строк
- **React Hook Form** + **Zod** — формы и валидация
- **Tailwind CSS 4** — стилизация
- **Vite 7** — сборка и HMR

## Функциональность

- Авторизация (логин/выход, защита маршрутов через `clientLoader`)
- Таблица товаров с серверной сортировкой и пагинацией через URL-параметры
- Поиск по товарам с debounce
- Добавление товара через drawer (боковая панель на роутинге)
- Скелетон при загрузке данных

## API

Используется публичный API [DummyJSON](https://dummyjson.com):

- `GET /auth/login` — авторизация
- `GET /products/search` — список товаров с поиском, сортировкой и пагинацией
- `POST /products/add` — добавление товара

## Структура проекта

```
app/
  features/
    products/
      api.ts                          # API товаров и типы
      hooks/
        use-products.ts               # Хук: query + сортировка + поиск + пагинация
      components/
        ProductsTable/index.tsx       # Таблица товаров
        ProductsTableSkeleton/index.tsx
        ProductsToolbar/index.tsx     # Панель действий
        AddProductDrawer/index.tsx    # Drawer добавления товара
    auth/
      api.ts                          # API авторизации и сессия
      components/
        LoginForm/index.tsx           # Форма входа
        LoginForm/validation.ts
  components/
    ui/
      Checkbox/index.tsx              # Переиспользуемые UI-компоненты
      TextInput/index.tsx
      SearchInput/index.tsx
      Pagination/index.tsx
      ProgressBar/index.tsx
  lib/
    cn.ts                             # Утилита cn (clsx + tailwind-merge)
  routes/
    products.tsx                      # Layout с auth guard
    products.index.tsx                # Страница каталога
    products.empty.tsx                # Index route (пустой)
    products.add.tsx                  # Drawer добавления
    login.tsx                         # Страница входа
public/
  icons/                              # SVG-иконки
```

## Запуск

### Установка зависимостей

```bash
npm install
```

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
4. Vercel автоматически определит фреймворк и настройки сборки
5. Нажми **Deploy**

## Учетные данные для входа

API DummyJSON предоставляет тестового пользователя:

- **Логин:** `emilys`
- **Пароль:** `emilyspass`
