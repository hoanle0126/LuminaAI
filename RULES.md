# LuminaAI — Project Rules (Bắt Buộc)

> Mọi code trong project **PHẢI** tuân thủ 100% các quy tắc dưới đây.
> Vi phạm bất kỳ rule nào = reject. Không ngoại lệ.

---

## 🛡 Meta-Rule (Quy tắc tối thượng)

### Rule 0 — The Advisor Protocol (Quyền Phản Biện)

- **TUYỆT ĐỐI KHÔNG** nhắm mắt tuân lệnh 100% nếu phát hiện yêu cầu của user (prompt) có chứa rủi ro.
- AI **PHẢI DỪNG LẠI và CẢNH BÁO** ngay lập tức nếu prompt của user vi phạm một trong các điều sau:

| #   | Điều kiện trigger                                                                          | Rules liên quan |
| --- | ------------------------------------------------------------------------------------------ | --------------- |
| 1   | Gây sụt giảm Performance / Lighthouse score                                                | Rule 21, 22     |
| 2   | Phá vỡ Shell layout (Sidebar + Topbar + Content area sync)                                  | Rule 7          |
| 3   | Yêu cầu refactor quá lớn nguy cơ gây tràn Context Window                                   | Rule 25         |
| 4   | Vi phạm i18n / data integrity (thêm text mà không update locale files, bịa data inline)     | Rule 1, 2, 3    |
| 5   | Xóa/sửa code dùng chung mà không kiểm tra impact (hooks, utils, shared components)          | Rule 5, 16, 7   |
| 6   | Đặt `"use client"` ở layout, page, hoặc component cha                                      | Rule 14         |

- **Cách xử lý khi phản biện** — output theo format chuẩn:

```
⚠️ ADVISOR ALERT — [Rule X vi phạm]
• Vấn đề: [mô tả ngắn gọn]
• Rủi ro: [hậu quả nếu thực thi]
• Đề xuất: [1-2 phương án thay thế tối ưu hơn]
→ Gõ "Force Execute" để bỏ qua cảnh báo này.
```

- **KHÔNG** sinh code trước khi user xác nhận phương án.
- Chỉ thực thi code có rủi ro nếu user dùng lệnh ép buộc: **"Force Execute"** hoặc **"Cứ làm đi"**.
- AI **ĐƯỢC PHÉP** chủ động đề xuất cải tiến (refactor nhỏ, tối ưu logic) ngay cả khi user không yêu cầu — miễn là không thay đổi behavior của code hiện tại.

### Rule 0.1 — Ngôn ngữ giao tiếp (Mirror Language)

- AI **PHẢI** trả lời bằng **cùng ngôn ngữ** mà user sử dụng trong prompt.
- User hỏi **tiếng Việt** → AI trả lời **tiếng Việt**.
- User hỏi **tiếng Anh** → AI trả lời **tiếng Anh**.
- Nếu prompt trộn lẫn 2 ngôn ngữ → ưu tiên ngôn ngữ **chiếm phần lớn** trong prompt.
- **Code, tên file, tên biến, commit message** vẫn giữ **tiếng Anh** — chỉ phần giải thích, mô tả, và giao tiếp mới theo ngôn ngữ của user.

---

## 🌐 i18n (Đa Ngôn Ngữ)

### Rule 1 — Không hard-code text

- Mọi text hiển thị cho user → `t("key")` qua `next-intl`.
- Config text (tên web, email...) → `.env` → gọi qua `process.env.NEXT_PUBLIC_*`.

```tsx
// ✅
<h1>{t("dashboard.greeting")}</h1>

// ❌
<h1>Chào buổi sáng</h1>
```

### Rule 2 — Update 2 ngôn ngữ đồng thời

Khi thêm/sửa key trong bất kỳ file `.json` nào → cập nhật cả 2 file:

| Code | Ngôn ngữ   |
| :--- | :--------- |
| `vi` | Tiếng Việt |
| `en` | English    |

Không được để file nào thiếu key so với file còn lại.

---

## 📦 Data

### Rule 3 — Data từ Services, code như API

- Mọi dữ liệu động (tasks, projects, users, activities, AI insights...) → lấy từ `services/` folder.
- Code phải viết dạng `async function` y hệt gọi API backend thật (có simulated latency).
- **Không được bịa** data inline trong component.

```tsx
// ✅
export async function getTasks(): Promise<Task[]> {
  const data = await import("@/services/mock/tasks.json");
  return data.default;
}

// ❌
const tasks = [{ title: "Fix bug", status: "todo" }]; // bịa
```

---

## 🏗 Architecture

### Rule 4 — 1 file = 1 component (Max 200 dòng / file)

- **Mỗi file chỉ chứa DUY NHẤT 1 component.** Không nhồi nhiều component vào cùng 1 file.
- 200 dòng là **giới hạn tối đa**, KHÔNG phải điều kiện để bắt đầu tách.
- Sub-component (ví dụ: `StatCard` trong `Dashboard`) → **PHẢI tách ra file riêng**.
- Logic xử lý dài → tách ra Custom Hook (xem Rule 16).

```
// ✅ Mỗi component 1 file riêng
components/widgets/
├── StatCard.tsx
├── AIInsightCard.tsx
├── TaskOverviewWidget.tsx
├── WeeklyProgressChart.tsx

// ❌ Nhồi nhiều component vào 1 file
components/widgets/
├── Dashboard.tsx  ← chứa StatCard + AIInsightCard + ...
```

### Rule 5 — Component tái sử dụng → `@/components/ui/`

- Không tạo component UI riêng **trực tiếp trong page/section file**.
- Shared UI components (Button, Card, Input, Badge...) nằm trong `@/components/ui/` (từ shadcn/ui).
- Domain-specific components (widgets, forms) nằm trong `@/components/widgets/`, `@/components/layout/`, etc.
- Mọi component phải có `interface` / `type` cho props.

### Rule 6 — Không inline SVG, dùng Lucide

- Có trong `lucide-react` → dùng Lucide.
- Không có → đặt file `.svg` vào `public/assets/icons/` → dùng `<Image>` hoặc component wrapper.

```tsx
// ✅
import { LayoutDashboard } from "lucide-react";
<LayoutDashboard className="w-5 h-5" />

// ❌
<svg viewBox="0 0 24 24"><path d="M12 2L..."/></svg>
```

### Rule 7 — Shell Layout đồng nhất

- **Sidebar + Topbar + Content Area** phải transition **đồng bộ** khi collapse/expand.
- Content area `margin-left` **PHẢI khớp** sidebar width (240px expanded / 56px collapsed / 0 mobile).
- Transition timing: `220ms ease-out` cho cả sidebar width VÀ content offset.
- **KHÔNG được** thay đổi Shell layout structure mà không kiểm tra impact trên tất cả pages.

---

## 💻 Code Quality

### Rule 8 — TypeScript strict

- **Không `any`**. Không `// @ts-ignore`. Không `// @ts-expect-error`.
- `as` chỉ dùng cho DOM refs khi bắt buộc.
- Mọi component phải có `interface` / `type` cho props.
- Types tập trung trong `@/types/` folder.

### Rule 9 — Import alias `@/`

```tsx
// ✅
import { Button } from "@/components/ui/Button";
import type { Task } from "@/types";

// ❌
import { Button } from "../../../components/ui/Button";
```

### Rule 10 — Không `console.log` trong production

- Debug xong → xóa.
- Nếu cần logging → dùng custom logger chỉ chạy ở `NODE_ENV=development`.

### Rule 11 — ESLint Strict Config

- **PHẢI** dùng `@next/eslint-plugin-next`, extend `next/core-web-vitals`.
- Enforce:
  - `react-hooks/exhaustive-deps` — bắt buộc khai báo đủ deps.
  - `react/no-danger` — cấm `dangerouslySetInnerHTML`.
- **Prettier** phải integrate với ESLint — format trước khi commit.
- Không ship code có ESLint warning hoặc error.

### Rule 12 — Không inline CSS decorative

- **KHÔNG** dùng `style={{}}` cho styling decorative (color, padding, margin, font...).
- `style={{}}` **CHỈ** cho phép khi giá trị dynamic tính toán runtime.
- Mọi styling → Tailwind classes hoặc CSS custom properties.

```tsx
// ✅
<div className="bg-surface-1 p-4 rounded-lg">

// ✅ (dynamic runtime value)
<div style={{ transform: `translateX(${scrollOffset}px)` }}>

// ❌
<div style={{ backgroundColor: '#1A1B22', padding: '16px' }}>
```

---

## 🖥 UX

### Rule 13 — Mỗi page route phải có skeleton + error

```
app/[locale]/(app)/tasks/
├── page.tsx
├── loading.tsx    ← Skeleton UI bắt buộc
├── error.tsx      ← Error boundary bắt buộc
```

Mỗi dashboard widget cũng phải có skeleton + error state riêng.

---

## 🎨 Theming & Design Tokens

### Rule 13.1 — Design tokens, không hard-code màu / spacing

- Màu sắc dùng qua CSS custom properties (`bg-brand-primary`, `text-surface-1`).
- **KHÔNG** hard-code hex/oklch trong component.
- 6 palette variants (arctic-violet, ember-gold, midnight-mint, ocean-blue, neon-coral, phantom-slate) → đổi palette = đổi 1 `data-palette` attribute.

```tsx
// ✅
className="text-brand-primary bg-surface-1 border-border-default"

// ❌
className="text-[#A78BFA] bg-[#1A1B22] border-[#2A2B34]"
```

### Rule 13.2 — Typography tokens từ design system

- Dùng utility classes đã định nghĩa: `.text-display-xl`, `.text-body-md`, `.text-stat-value`, etc.
- Font families qua CSS variables: `--font-display` (Lexend Deca), `--font-body` (Inter), `--font-mono` (JetBrains Mono).
- **KHÔNG** tự ý thêm font size / font family ngoài hệ thống 14 type scale tokens.

---

## ♿ Accessibility

### Rule 13.3 — A11y bắt buộc

- `<img>` → phải có `alt`.
- Button/link icon-only → `aria-label` bắt buộc.
- Keyboard: Tab, Enter, Escape phải hoạt động.
- Color contrast ≥ 4.5:1.
- **Semantic HTML5:** `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- Modal: focus trap + ESC closes + `aria-modal`.
- Sidebar: `aria-current="page"` cho active item, `aria-expanded` cho collapse button.
- **KHÔNG** dùng `<a href="#">` — dùng `<button>` cho JS interactions.

---

## ⚡ Next.js & Performance

### Rule 14 — Tách biệt Server Component và Client Component

- **Mặc định mọi component là Server Component.**
- Chỉ thêm `"use client"` ở component **lá (leaf node)** thực sự cần tương tác.
- **TUYỆT ĐỐI KHÔNG** đặt `"use client"` ở layout, page, hoặc component cha ngoài cùng.

```tsx
// ✅ Page = Server Component
import { StatCard } from "@/components/widgets/StatCard";        // Server
import { QuickActionsFAB } from "@/components/widgets/QuickActionsFAB"; // Client (leaf)

export default function DashboardPage() {
  return (
    <>
      <StatCard />          {/* Server — SSR, fast FCP */}
      <QuickActionsFAB />   {/* Client — chỉ FAB cần onClick */}
    </>
  );
}

// ❌ TUYỆT ĐỐI KHÔNG
"use client";  // ← Đặt ở page = phá nát SSR
export default function DashboardPage() { ... }
```

### Rule 15 — Motion Tokens (Centralized Animations)

- **Không viết inline variants** trong từng file.
- Toàn bộ hiệu ứng phải import từ `lib/motion.ts`.
- Living Constellation animations (Pulse Ring, Confidence Glow, Momentum Trail, Decay Fade) → CSS `@keyframes` trong `styles/`.

```ts
// lib/motion.ts — Single source of truth
export const MOTION = {
  fadeIn: {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  hover: {
    scale: { scale: 1.02, transition: { duration: 0.2 } },
    lift: { y: -4, transition: { duration: 0.2 } },
  },
} as const;
```

```tsx
// ✅
import { MOTION } from "@/lib/motion";
<motion.div {...MOTION.fadeIn}>...</motion.div>

// ❌ Inline lung tung
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
```

### Rule 16 — Tách UI và Business Logic (Custom Hooks)

- **File `.tsx` chỉ nhận data và render UI.** Không nhồi logic xử lý.
- Toàn bộ logic (filter, sort, form validation, pagination, sidebar state...) → tách ra Custom Hooks.
- Hook đặt trong `@/hooks/`.

```tsx
// ✅ Hook riêng
// hooks/useTaskFilter.ts
export function useTaskFilter(tasks: Task[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT);
  const filtered = useMemo(() => applyFilters(tasks, filters), [tasks, filters]);
  return { filters, setFilters, filtered };
}

// ❌ Logic nhồi trong component
export function TaskList() {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  // 80 dòng filter + sort logic ...
}
```

---

## 📐 Animation Performance

### Rule 17 — Animation Constraints

- **Hover transitions**: max `200-300ms`, dùng `ease-in-out` hoặc custom cubic-bezier.
- **Scroll animations**: dùng `Intersection Observer` — **TUYỆT ĐỐI KHÔNG** dùng `scroll` event listener.
- **KHÔNG scroll hijack** — không override native browser scroll.
- Chỉ animate thuộc tính **GPU-accelerated**: `transform`, `opacity`.
- **KHÔNG** animate: `width`, `height`, `top`, `left`, `margin`, `padding` (gây layout thrashing).
- Living Constellation animations: CSS-only `@keyframes`, durations theo spec (xem Phase 10).

```tsx
// ✅ GPU-accelerated
transition: { transform: "translateY(0)", opacity: 1 }

// ❌ Layout thrashing
transition: { height: "auto", marginTop: "20px" }
```

---

## 🧹 Console & Hydration

### Rule 18 — Console sạch bóng, Hydration = 0

- **KHÔNG được có** bất kỳ `warning`, `error`, hay `hydration mismatch` nào.
- Server HTML phải **khớp 100%** với Client HTML.
- Không dùng `typeof window`, `Date.now()`, `Math.random()` trong initial render mà không wrap trong `useEffect`.
- Trước khi hoàn thành feature → **PHẢI kiểm tra** browser console.

---

## 📝 Convention

### Rule 19 — Naming convention

| Loại       | Format       | Ví dụ                |
| :--------- | :----------- | :------------------- |
| Components | PascalCase   | `StatCard.tsx`       |
| Hooks      | camelCase    | `useTaskFilter.ts`   |
| Utils      | camelCase    | `formatDate.ts`      |
| Constants  | UPPER_SNAKE  | `MAX_VISIBLE_TASKS`  |
| Folders    | kebab-case   | `task-detail/`       |
| i18n keys  | dot.notation | `dashboard.greeting` |
| Types      | PascalCase   | `Task`, `Project`    |
| Stores     | camelCase    | `useThemeStore.ts`   |

### Rule 20 — Commit message rõ ràng

```
feat(dashboard): add weekly progress chart
fix(sidebar): resolve collapse animation sync
style(topbar): adjust glass blur opacity
i18n(common): add English translations for settings
refactor(hooks): extract useTaskFilter from TaskList
```

---

## ⚡ Performance Benchmarks

### Rule 21 — Performance Targets

| Metric                          | Target  |
| ------------------------------- | ------- |
| Performance (Lighthouse)        | ≥ 90    |
| Accessibility (Lighthouse)      | ≥ 95    |
| Best Practices                  | ≥ 90    |
| First Contentful Paint (FCP)    | < 1.5s  |
| Largest Contentful Paint (LCP)  | < 2.5s  |
| Interaction to Next Paint (INP) | < 200ms |
| Cumulative Layout Shift (CLS)   | < 0.1   |

- Static UI **PHẢI** render server-side (RSC).
- Image → dùng `next/image` với `priority` cho above-the-fold.
- Heavy client libraries (FullCalendar, Recharts) → `next/dynamic` với `{ ssr: false }`.

### Rule 22 — Bundle Size Discipline

- Không single chunk > 200KB.
- Chart libraries (Recharts) → lazy load, chỉ import khi page cần.
- `@dnd-kit` → chỉ load trên Kanban board page.
- `@fullcalendar` → chỉ load trên Calendar page.

---

## 🧠 Context Management

### Rule 23 — Giới hạn scope per session

- Mỗi session chỉ làm **tối đa 2 pages/features**.
- Nếu task phức tạp → **chia nhỏ thành sub-tasks**, commit sau mỗi sub-task hoàn thành.
- **KHÔNG** cố refactor + implement + test tất cả trong 1 session.
- Khi cảm thấy context dài → **chủ động thông báo** user để bắt đầu session mới.

### Rule 24 — Hiểu cấu trúc project trước khi code

- **TUYỆT ĐỐI KHÔNG** bắt đầu code khi chưa hiểu cấu trúc hiện tại.
- Checklist trước khi code:
  1. Đọc folder structure hiện tại
  2. Xác nhận naming convention đang dùng
  3. Xác nhận pattern tách component đang dùng
  4. Code theo đúng pattern đã có — **KHÔNG tự sáng tạo cấu trúc mới**

---

## 🎨 CSS Architecture

### Rule 25 — Tách CSS theo category

`globals.css` **CHỈ** chứa `@import`. **KHÔNG** viết style trực tiếp ở đây.

**Folder structure:**

```
src/styles/
├── palettes/
│   ├── arctic-violet.css    ← [data-palette="arctic-violet"] tokens
│   ├── ember-gold.css
│   ├── midnight-mint.css
│   ├── ocean-blue.css
│   ├── neon-coral.css
│   └── phantom-slate.css
├── tokens.css               ← Shared tokens (spacing, shadows, z-index)
├── component-system.css     ← Radius ladder, shadow scale, focus ring
├── typography.css            ← Font families, 14 type scale tokens
└── globals.css               ← Entry point — chỉ @import
```

---

## 🔄 Palette & Theme Switching

### Rule 26 — Palette switching rules

- 6 palettes via `[data-palette]` attribute trên `<html>`.
- Dark/light via `[data-theme]` attribute (`light` | `dark` | system auto).
- `setTheme(mode, palette)` function + `localStorage` persist.
- Mỗi palette file chứa **đầy đủ tokens** cho CẢ light + dark mode.
- Đổi palette **KHÔNG được** gây layout shift hoặc flash.

---

## 📊 Chart & Data Visualization

### Rule 27 — Chart conventions

- Tất cả charts dùng **Recharts**.
- Chart colors map từ design tokens (CSS custom properties) — **KHÔNG hard-code** hex trong chart config.
- Tất cả charts phải responsive (`ResponsiveContainer`).
- Number formatting: dùng `JetBrains Mono` (`--font-mono`) + `tabular-nums`.
- Chart loading state: skeleton shimmer matching chart dimensions.
- Chart error state: `ErrorCard` với retry button.

---

## 🖱 Drag & Drop

### Rule 28 — Drag & Drop conventions

- Chỉ dùng `@dnd-kit/core` + `@dnd-kit/sortable` — không thêm library khác.
- Drag preview phải match card visual (not browser ghost image).
- Drop animation: `250ms ease`, card settles into position.
- Column reorder: update Zustand store → TanStack Query cache.
- **Accessibility:** `aria-grabbed`, `aria-dropeffect`, keyboard support (Space to grab, Arrow to move, Space to drop).

---

## 🤖 Living Constellation (AI Visual Language)

### Rule 29 — AI visual elements consistency

- **Pulse Ring:** Mọi task status indicator dùng animated circles (KHÔNG dùng static dots).
  - Idle: dim violet, 3s loop
  - Active: bright violet, 1.5s loop
  - Urgent: amber, 0.8s loop
  - Done: green, 0.6s once
- **Confidence Glow:** AI insight cards → `box-shadow` intensity = confidence %.
  - High (>90%): strong glow + solid border
  - Low (<60%): no glow + dashed border
- **Momentum Trail:** Progress bars → animated gradient `background-position`.
- **Decay Opacity:** Untouched tasks → opacity fades `1.0 → 0.5` over 7 days.
- **Notification:** Ambient icon glow — **KHÔNG dùng red number badges**.
- **`prefers-reduced-motion`:** ALL animations → instant (0ms), Pulse Rings → static dots.
