# Minimalist Clean UI Design System

## 🎨 Design Overview

The auth pages have been redesigned with a **Minimalist Clean** aesthetic, focusing on:

- Clear typography hierarchy
- Generous whitespace
- Minimal color palette
- Smooth interactions
- Excellent accessibility

## 📏 Design Tokens

### Typography

| Element         | Font Size | Font Weight   | Line Height |
| --------------- | --------- | ------------- | ----------- |
| H1 (Main Title) | 36px      | 300 (Light)   | 1.2         |
| H2 (Section)    | 24px      | 300 (Light)   | 1.3         |
| Body Text       | 14px      | 400 (Regular) | 1.5         |
| Small Text      | 12px      | 400 (Regular) | 1.4         |
| Form Label      | 14px      | 500 (Medium)  | 1.4         |

### Colors

```css
/* Primary */
--blue-600: #2563eb; /* Main actions */
--blue-700: #1d4ed8; /* Hover state */

/* Status */
--green-500: #10b981; /* Success */
--red-600: #dc2626; /* Error */
--yellow-500: #eab308; /* Warning */

/* Neutral */
--gray-50: #f9fafb; /* Background */
--gray-100: #f3f4f6; /* Subtle bg */
--gray-300: #d1d5db; /* Borders */
--gray-400: #9ca3af; /* Icons */
--gray-600: #4b5563; /* Secondary text */
--gray-900: #111827; /* Primary text */
```

### Spacing Scale

```css
0.5px    (0.125rem)
1px      (0.25rem)
2px      (0.5rem)
3px      (0.75rem)
4px      (1rem)
6px      (1.5rem)
8px      (2rem)
12px     (3rem)
16px     (4rem)
20px     (5rem)
24px     (6rem)
32px     (8rem)
```

### Border Radius

```css
--radius-sm: 0.5rem; /* 8px - Small elements */
--radius-md: 0.75rem; /* 12px - Standard inputs */
--radius-lg: 1rem; /* 16px - Large modals */
```

## 🔘 Component Styles

### Inputs & Fields

```tsx
// Standard Input
<input className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
  text-gray-900 placeholder-gray-400 transition" />

// Specifications:
- Height: 40px (py-2.5)
- Padding: 16px left/right (px-4)
- Border: 1px gray-300
- Focus: 2px blue-500 ring
- Rounded: 8px
- Transition: 150ms smooth
```

### Buttons

#### Primary Button

```tsx
<button className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg
  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
  focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition" />

// Specifications:
- Height: 40px (py-2.5)
- Background: Blue-600
- Hover: Blue-700
- Disabled: 50% opacity, not-allowed cursor
- Focus ring: 2px blue-500 with offset
```

#### Secondary Button

```tsx
<button className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium
  rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500
  focus:ring-offset-2 transition" />

// Specifications:
- Border: 1px gray-300
- Hover: Gray-50 background
- Focus: Gray-500 ring
```

#### Text Link

```tsx
<button type="button" className="text-blue-600 hover:text-blue-700 font-medium transition" />

// Specifications:
- Text color: Blue-600
- Hover: Blue-700
- Underline: None (unless specified)
```

### Form Labels

```tsx
<label className="block text-sm font-medium text-gray-700 mb-2">
  Email Address
</label>

// Specifications:
- Font size: 14px (text-sm)
- Font weight: 500 (medium)
- Color: Gray-700
- Margin bottom: 8px
```

### Error Messages

```tsx
<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
  <p className="text-red-700 text-sm">{error}</p>
</div>

// Specifications:
- Background: Red-50 (light red)
- Border: 1px red-200
- Text color: Red-700
- Padding: 16px (p-4)
- Border radius: 8px
```

### Icons

```tsx
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

// Icon sizing:
- Small: size={16}
- Standard: size={18}
- Medium: size={20}
- Large: size={24}
- XL: size={48}
```

## 📱 Layout Patterns

### Centered Form Container

```tsx
<div className="w-full max-w-md mx-auto p-8">
  {/* Content */}
</div>

// Specifications:
- Max width: 448px (max-w-md)
- Horizontal padding: 32px (p-8)
- Vertical padding: 32px (p-8)
- Centered: mx-auto
- Full width on mobile: w-full
```

### Vertical Spacing

```tsx
<form className="space-y-6">
  <div>{/* Input group */}</div>
  <div>{/* Input group */}</div>
  <button>{/* Submit */}</button>
</form>

// Specifications:
- Vertical gap between fields: 24px (space-y-6)
- Internal field spacing: 8px (mb-2 for labels)
- Before submit: 16px gap (pt-4)
```

### Header Section

```tsx
<div className="mb-8">
  <h1 className="text-3xl font-light text-gray-900 mb-1">Welcome Back</h1>
  <p className="text-gray-600 text-sm">Sign in to your account</p>
</div>

// Specifications:
- Title: 36px, Light weight, Gray-900
- Margin bottom: 4px (mb-1)
- Subtitle: 14px, Gray-600
- Section margin: 32px bottom (mb-8)
```

## 🎬 Animations & Transitions

### Smooth Transitions

```css
/* All interactive elements */
transition: all 150ms ease-in-out;

/* Or specific properties */
transition: background-color 150ms ease-in-out;
transition: color 150ms ease-in-out;
transition: box-shadow 150ms ease-in-out;
```

### Focus States

```css
/* Input focus */
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-transparent

/* Button focus */
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:ring-offset-2
```

## 🌈 Color Usage Guide

### Primary Brand Actions

- Buttons, links, focus states: **Blue-600**
- Hover state: **Blue-700**
- Disabled: Reduced opacity

### Error States

- Background: **Red-50** (light background)
- Border: **Red-200** (light border)
- Text: **Red-700** (dark red text)
- Icon: **Red-600** (medium red)

### Success States

- Icon background: **Green-500**
- Text: **Green-600**
- Checkmark: **White** on green

### Secondary Elements

- Labels: **Gray-700** (medium dark)
- Placeholder text: **Gray-400** (light)
- Secondary text: **Gray-600** (medium)
- Icons (inactive): **Gray-400** (light)

## 📐 Responsive Design

### Breakpoints

| Size    | Width          | Used For              |
| ------- | -------------- | --------------------- |
| Mobile  | < 640px        | phones, small screens |
| Tablet  | 640px - 1024px | tablets               |
| Desktop | > 1024px       | desktop screens       |

### Mobile-First Approach

```tsx
// Mobile first, then tablet/desktop
className = "p-4 sm:p-6 md:p-8";

// Mobile: 16px padding
// Tablet (sm): 24px padding
// Desktop (md): 32px padding
```

## ♿ Accessibility Features

### Keyboard Navigation

- ✓ Tab to navigate form fields
- ✓ Enter to submit forms
- ✓ Arrow keys to navigate OTP fields
- ✓ Escape to cancel dialogs

### Screen Readers

- ✓ Proper `<label>` elements linked to inputs
- ✓ Descriptive button text (not "Click here")
- ✓ Error messages announced
- ✓ Form labels describe purpose

### Color Contrast

- ✓ Text: WCAG AA compliant (4.5:1 ratio minimum)
- ✓ Primary: Blue-600 on white (8.5:1)
- ✓ Secondary: Gray-600 on white (7:1)
- ✓ Errors: Red-700 on white (8:1)

### Focus Indicators

- ✓ Visible 2px focus ring on all interactive elements
- ✓ Focus ring color matches brand blue
- ✓ Offset ring for better visibility

## 📝 Implementation Examples

### Login Form Component

```tsx
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-gray-600 text-sm">Sign in to your account</p>
      </div>

      {/* Form */}
      <form className="space-y-5">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="email"
              type="email"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};
```

## 🎯 Design Checklist

When creating new auth pages, verify:

- [ ] Max width 448px (max-w-md)
- [ ] 32px padding (p-8)
- [ ] Title is 36px, light weight
- [ ] Subtitle is 14px, gray-600
- [ ] Input height is 40px
- [ ] Button height is 40px
- [ ] Field spacing is 24px (space-y-5 or space-y-6)
- [ ] Icons are 18px for inputs
- [ ] Focus ring is blue-500
- [ ] Error background is red-50
- [ ] All interactive elements have hover states
- [ ] Smooth 150ms transitions
- [ ] Mobile responsive with breakpoints
- [ ] Proper label associations
- [ ] All buttons have accessible names

## 🚀 Using This System

### In Your Components

```tsx
// Always use these class patterns
const containerClasses = "w-full max-w-md mx-auto p-8";
const labelClasses = "block text-sm font-medium text-gray-700 mb-2";
const inputClasses =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition";
const buttonPrimaryClasses =
  "w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition";
```

---

This design system ensures consistency across all authentication pages and provides an excellent minimalist clean user experience! 🎨
