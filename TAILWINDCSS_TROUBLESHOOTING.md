# TailwindCSS & Next.js 15 Troubleshooting Guide

This guide documents the step-by-step process to fix common TailwindCSS styling issues in Next.js 15 with Turbopack.

## 🚨 Common Symptoms

- TailwindCSS classes not applying (colors, spacing, etc.)
- "Unknown at rule @tailwind" errors in CSS
- Components appear unstyled
- Module resolution errors for icons (Lucide React, Heroicons)
- PostCSS loader errors
- Long startup times

## 🔧 Step-by-Step Fix Process

### Step 1: Verify TailwindCSS Installation

First, check if TailwindCSS is properly installed:

```bash
npm list tailwindcss postcss autoprefixer --depth=0
```

**Expected output:**

```
├── autoprefixer@10.4.21
├── postcss@8.5.6
└── tailwindcss@3.4.17
```

**If missing, install:**

```bash
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
```

### Step 2: Install Missing PostCSS Loader (Critical for Next.js 15)

```bash
npm install -D postcss-loader
```

**Why needed:** Next.js 15 with Turbopack requires explicit PostCSS loader installation.

### Step 3: Configure PostCSS (postcss.config.js)

Create/update `postcss.config.js` in project root:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**Note:** Do NOT use `@tailwindcss/postcss` - use `tailwindcss` directly.

### Step 4: Configure TailwindCSS (tailwind.config.js)

Ensure proper content paths and custom colors:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#1E40AF",
          700: "#1d4ed8",
          800: "#1e3a8a",
          900: "#1e293b",
        },
        secondary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Poppins", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
```

### Step 5: Fix Next.js Configuration (next.config.js)

For Next.js 15 + Turbopack compatibility:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated options
  // swcMinify: true, // ← Remove this

  // Turbopack configuration (if needed)
  experimental: {
    turbo: {
      // Turbopack-specific config if needed
    },
  },
};

module.exports = nextConfig;
```

### Step 6: Verify Global CSS Import (src/app/globals.css)

Ensure TailwindCSS directives are present:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  html {
    font-family: Inter, ui-sans-serif, system-ui;
  }

  body {
    @apply bg-white text-gray-900 antialiased;
  }
}

/* Custom component styles */
@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }

  .btn-secondary {
    @apply bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }

  .btn-outline {
    @apply border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }

  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
  }

  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }
}
```

### Step 7: Fix Layout.tsx Import and Hydration Issues

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css"; // ← Ensure this import exists

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // ← Add this for better performance
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap", // ← Add this for better performance
});

export const metadata: Metadata = {
  title: "Nexscholar - Global Scholarship Discovery Platform",
  description:
    "Discover, apply for, and access global scholarship opportunities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

### Step 8: Fix Icon Import Issues (Lucide React & Heroicons)

**For Lucide React icons, use this import format:**

```tsx
// ❌ Wrong
import { ArrowRight } from "lucide-react";

// ✅ Correct for Next.js 15
import { ArrowRight, Search, Globe } from "lucide-react";
// OR if still having issues:
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
```

**For Heroicons:**

```tsx
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
```

### Step 9: Configure VS Code for TailwindCSS

Create `.vscode/settings.json`:

```json
{
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescript"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["className\\s*:\\s*['\"`]([^'\"`]*)['\"`]", "([a-zA-Z0-9\\-:]+)"]
  ],
  "css.validate": false,
  "scss.validate": false,
  "css.lint.unknownAtRules": "ignore"
}
```

### Step 10: Clear Cache and Restart

```bash
# Delete .next folder
rm -rf .next
# OR on Windows:
# rmdir /s .next

# Restart development server
npm run dev
```

## 🧪 Testing TailwindCSS

Create a simple test component to verify TailwindCSS is working:

```tsx
export default function TailwindTest() {
  return (
    <div className="p-8 bg-blue-500 text-white rounded-lg m-4">
      <h1 className="text-3xl font-bold mb-4">TailwindCSS Test</h1>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="w-16 h-16 bg-red-500 rounded"></div>
        <div className="w-16 h-16 bg-blue-500 rounded"></div>
        <div className="w-16 h-16 bg-green-500 rounded"></div>
        <div className="w-16 h-16 bg-yellow-500 rounded"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="w-16 h-16 bg-primary-600 rounded"></div>
        <div className="w-16 h-16 bg-secondary-500 rounded"></div>
      </div>
    </div>
  );
}
```

**Expected result:** Colored squares with proper spacing and styling.

## 🚀 Performance Optimization

### Speed up development startup:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      loaders: {
        ".css": ["css-loader", "postcss-loader"],
      },
    },
  },
  // Enable SWC minification
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
```

## 🔍 Debugging Tips

### 1. Check Browser DevTools

- **Network Tab:** Look for CSS files loading
- **Console Tab:** Check for CSS-related errors
- **Elements Tab:** Inspect elements to see if classes are applied

### 2. Verify TailwindCSS Processing

Check if TailwindCSS classes are being generated:

```bash
# Build the project and check output
npm run build
```

### 3. Check Package Versions

Ensure compatibility:

```bash
npm list next tailwindcss postcss autoprefixer
```

## 📋 Troubleshooting Checklist

- [ ] TailwindCSS 3.x installed (not 4.x)
- [ ] PostCSS loader installed
- [ ] `postcss.config.js` configured correctly
- [ ] `tailwind.config.js` has proper content paths
- [ ] `globals.css` imported in `layout.tsx`
- [ ] No conflicting CSS frameworks
- [ ] `.next` folder deleted and rebuilt
- [ ] Icon imports using correct syntax
- [ ] Next.js config compatible with Turbopack
- [ ] VS Code TailwindCSS extension installed

## 🎯 Quick Fix Commands

```bash
# Complete reset and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm install -D postcss-loader
npm run dev
```

## 📝 Common Error Messages & Solutions

| Error                                                             | Solution                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------- |
| `Cannot find module 'postcss-loader'`                             | `npm install -D postcss-loader`                       |
| `Unknown at rule @tailwind`                                       | Check VS Code settings, install TailwindCSS extension |
| `Module not found: Can't resolve 'lucide-react/dist/esm/icons/*'` | Fix icon imports, reinstall lucide-react              |
| TailwindCSS classes not applying                                  | Check PostCSS config, clear cache                     |
| Long startup times                                                | Update Next.js config for Turbopack                   |

---

**Created:** August 6, 2025  
**Last Updated:** August 6, 2025  
**Version:** 1.0  
**Tested with:** Next.js 15.4.5, TailwindCSS 3.4.17, Turbopack
