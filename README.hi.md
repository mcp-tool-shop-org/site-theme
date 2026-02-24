<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <strong>हिन्दी</strong> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="site-theme पूर्वावलोकन" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  MCP Tool Shop प्रोजेक्ट लैंडिंग पेजों के लिए कॉन्फ़िग-संचालित Astro थीम।<br/>
  डार्क पैलेट · Tailwind CSS v4 · GitHub Pages तैयार।
</p>

<p align="center">
  <a href="#त्वरित-शुरुआत">त्वरित शुरुआत</a> &middot;
  <a href="#डिज़ाइन-टोकन">डिज़ाइन टोकन</a> &middot;
  <a href="#कॉम्पोनेंट">कॉम्पोनेंट</a> &middot;
  <a href="#डिप्लॉय">डिप्लॉय</a> &middot;
  <a href="#लाइसेंस">लाइसेंस</a>
</p>

---

## त्वरित शुरुआत

### नई साइट बनाएं

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

यह एक `site/` डायरेक्टरी बनाता है जिसमें Astro + Tailwind + थीम पहले से कॉन्फ़िगर होती है, साथ ही GitHub Pages वर्कफ़्लो भी शामिल होता है। CSS इम्पोर्ट, `@source` पाथ और बेस पाथ सभी स्वचालित रूप से सेट होते हैं।

### अपना कंटेंट संपादित करें

सभी पेज कंटेंट `site/src/site-config.ts` में रहता है। अपनी लैंडिंग पेज को कस्टमाइज़ करने के लिए कॉन्फ़िग ऑब्जेक्ट संपादित करें:

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'मेरा टूल क्या करता है।',
  logoBadge: 'MT',
  brandName: 'my-tool',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'MIT लाइसेंस',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

---

## डिज़ाइन टोकन

थीम `styles/theme.css` के माध्यम से सिमेंटिक डिज़ाइन टोकन प्रदान करती है। कॉम्पोनेंट हार्डकोडेड रंगों के बजाय इन टोकन का उपयोग करते हैं, इसलिए कुछ मान बदलकर पूरी थीम को बदला जा सकता है।

### डिफ़ॉल्ट टोकन

| टोकन | डिफ़ॉल्ट | उपयोग |
|------|---------|-------|
| `--color-surface` | `#09090b` | पेज बैकग्राउंड |
| `--color-surface-raised` | `#18181b` | उभरे हुए तत्व, कोड ब्लॉक |
| `--color-surface-strong` | `#27272a` | बैज, हाइलाइट बैकग्राउंड |
| `--color-edge` | `#27272a` | मुख्य बॉर्डर |
| `--color-edge-subtle` | `#18181b` | कार्ड/टेबल बॉर्डर |
| `--color-heading` | `#fafafa` | हेडिंग, मुख्य टेक्स्ट |
| `--color-body` | `#e4e4e7` | बॉडी/सेकेंडरी टेक्स्ट |
| `--color-muted` | `#d4d4d8` | म्यूटेड टेक्स्ट |
| `--color-dim` | `#a1a1aa` | लेबल, विवरण |
| `--color-accent` | `#34d399` | स्टेटस इंडिकेटर |
| `--color-action` | `#fafafa` | प्राइमरी बटन बैकग्राउंड |
| `--color-action-text` | `#09090b` | प्राइमरी बटन टेक्स्ट |
| `--color-action-hover` | `#e4e4e7` | प्राइमरी बटन होवर |

### कस्टमाइज़ेशन

इम्पोर्ट के बाद `@theme` ब्लॉक जोड़कर अपनी साइट के `global.css` में किसी भी टोकन को ओवरराइड करें:

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

/* टोकन ओवरराइड */
@theme {
  --color-accent: #60a5fa;          /* नीला स्टेटस डॉट  */
  --color-surface: #0a0a1a;         /* नेवी बैकग्राउंड  */
  --color-action: #60a5fa;          /* नीले बटन         */
  --color-action-hover: #3b82f6;
}
```

टोकन स्टैंडर्ड Tailwind v4 यूटिलिटीज़ (`bg-surface`, `text-heading`, `border-edge` आदि) उत्पन्न करते हैं जिन्हें आप अपने खुद के कॉम्पोनेंट में भी उपयोग कर सकते हैं।

---

## कॉम्पोनेंट

पैकेज से कॉम्पोनेंट अलग-अलग इम्पोर्ट करें:

```astro
---
import BaseLayout from '@mcptoolshop/site-theme/components/BaseLayout.astro';
import Hero from '@mcptoolshop/site-theme/components/Hero.astro';
import Section from '@mcptoolshop/site-theme/components/Section.astro';
import FeatureGrid from '@mcptoolshop/site-theme/components/FeatureGrid.astro';
import DataTable from '@mcptoolshop/site-theme/components/DataTable.astro';
import CodeCardGrid from '@mcptoolshop/site-theme/components/CodeCardGrid.astro';
import ApiList from '@mcptoolshop/site-theme/components/ApiList.astro';
---
```

### BaseLayout

स्टिकी हेडर (लोगो बैज, नेव लिंक, GitHub/npm बटन) और फ़ुटर के साथ पूरा पेज शेल।

| Prop | प्रकार | विवरण |
|------|--------|-------|
| `title` | `string` | पेज `<title>` |
| `description` | `string` | मेटा विवरण |
| `logoBadge` | `string` | 1–2 अक्षर का लोगो बैज (जैसे `"RS"`) |
| `brandName` | `string` | हेडर में नाम |
| `nav` | `{ href, label }[]` | एंकर नेव लिंक |
| `repoUrl` | `string` | GitHub रिपो URL |
| `npmUrl?` | `string` | npm पैकेज URL |
| `footerText` | `string` | फ़ुटर टेक्स्ट (HTML मान्य) |

### Hero

ग्रेडिएंट हीरो सेक्शन जिसमें स्टेटस बैज, हेडलाइन, CTA और वैकल्पिक कोड प्रीव्यू कार्ड हैं।

| Prop | प्रकार | विवरण |
|------|--------|-------|
| `badge` | `string` | स्टेटस बैज टेक्स्ट |
| `headline` | `string` | मुख्य हेडलाइन |
| `headlineAccent` | `string` | म्यूटेड सफ़िक्स |
| `description` | `string` | विवरण (HTML मान्य) |
| `primaryCta` | `{ href, label }` | प्राइमरी बटन |
| `secondaryCta` | `{ href, label }` | सेकेंडरी बटन |
| `previews` | `{ label, code }[]` | कोड प्रीव्यू कार्ड |

### Section

एंकर `id`, हेडिंग और वैकल्पिक सबटाइटल के साथ सेक्शन रैपर।

### FeatureGrid

3-कॉलम रिस्पॉन्सिव कार्ड ग्रिड। Props: `features: { title, desc }[]`

### DataTable

ग्रिड-आधारित बॉर्डर टेबल। Props: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

डार्क कोड ब्लॉक कार्ड की 2-कॉलम ग्रिड। Props: `cards: { title, code }[]`

### ApiList

फ़ुल-विड्थ स्टैक्ड API रेफरेंस कार्ड। Props: `apis: { signature, description }[]`

---

## सेक्शन टाइप

आपकी कॉन्फ़िग में `sections` एरे इन `kind` मानों को सपोर्ट करता है:

| Kind | कॉम्पोनेंट | Props |
|------|------------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

सेक्शन एरे में जिस क्रम में दिखाई देते हैं उसी क्रम में रेंडर होते हैं।

---

## डिप्लॉय

`init` CLI स्वचालित रूप से `.github/workflows/pages.yml` बनाती है। लाइव जाने के लिए:

1. अपना रिपो GitHub पर पुश करें
2. रिपो → **Settings → Pages** पर जाएं
3. **Build and deployment** में **Source** को **GitHub Actions** पर सेट करें
4. पहला बिल्ड ट्रिगर करने के लिए `site/` में कोई भी बदलाव पुश करें

आपकी साइट `https://<org>.github.io/<repo>/` पर लाइव हो जाएगी।

---

## लाइसेंस

MIT
