# Expense Tracker Frontend

Beautiful, responsive React application with SaaS-level UI/UX polish.

## Features

- ✅ Modern card-based layout
- ✅ Smooth animations with Framer Motion
- ✅ Skeleton loaders for better UX
- ✅ Toast notifications
- ✅ Real-time filtering and sorting
- ✅ Responsive design
- ✅ shadcn/ui components
- ✅ Tailwind CSS styling
- ✅ React Query for server state

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **React Query** - Data fetching
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

App runs on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Output in `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── ExpenseForm.jsx  # Add expense form
│   ├── ExpenseList.jsx  # Expense list with animations
│   ├── FilterBar.jsx    # Category filter and sort
│   └── TotalCard.jsx    # Total spending card
├── hooks/
│   └── use-toast.js     # Toast notification hook
├── lib/
│   ├── api.js           # API client
│   └── utils.js         # Utility functions
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Design System

### Colors
- Primary: Blue (500-600)
- Secondary: Indigo (500-600)
- Success: Green (500-600)
- Error: Red (500-600)

### Typography
- Headings: Font weight 600-700
- Body: Font weight 400
- Numbers: Font weight 700

### Spacing
- Cards: p-6
- Gaps: gap-4, gap-6
- Margins: mt-4, mb-6

### Shadows
- Cards: shadow-sm, shadow-lg
- Hover: shadow-md

### Animations
- Duration: 200ms (default)
- Easing: ease-out
- Framer Motion for complex animations

## Component Guidelines

### ExpenseForm
- Validates input before submission
- Disables button during submission
- Shows loading state
- Resets form on success
- Shows error toasts

### ExpenseList
- Shows skeleton loaders while loading
- Empty state with meaningful message
- Smooth enter/exit animations
- Hover effects on cards
- Responsive layout

### TotalCard
- Animates on value change
- Shows loading spinner
- Formats currency properly
- Updates in real-time

### FilterBar
- Category dropdown
- Sort order toggle
- Responsive layout

## Performance

- Code splitting with Vite
- Lazy loading components
- React Query caching
- Optimized re-renders
- Debounced inputs (where needed)

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

MIT
