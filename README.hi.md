<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.md">English</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="site-theme preview" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  Multi-template Astro toolkit for landing pages, docs, product sites, and SaaS dashboards.<br/>
  Dark palette · Tailwind CSS v4 · GitHub Pages ready.
</p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/site-theme/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/site-theme/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@mcptoolshop/site-theme"><img src="https://img.shields.io/npm/v/@mcptoolshop/site-theme" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/templates-default_·_docs_·_product_·_app-34d399" alt="Templates: default · docs · product · app" />
  <a href="https://mcp-tool-shop-org.github.io/site-theme/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="MIT License" /></a>
</p>

<p align="center">
  <a href="#templates">Templates</a> &middot;
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#design-tokens">Design Tokens</a> &middot;
  <a href="#components">Components</a> &middot;
  <a href="#deploy">Deploy</a> &middot;
  <a href="#license">License</a>
</p>

---

## टेम्प्लेट

एक टेम्प्लेट चुनें, ढांचा तैयार करें, और बनाएं। प्रत्येक टेम्प्लेट CI-परीक्षित और GitHub पेजों के लिए तैयार है।

| टेम्प्लेट | विवरण | पेज |
|----------|-------------|-------|
| **default** | मुख्य पृष्ठ, जिसमें हीरो सेक्शन, विशेषताएं और कोड के उदाहरण शामिल हैं। | 1 |
| **docs** | साइडबार नेविगेशन और सामग्री अनुभागों वाला दस्तावेज़ साइट। | 1 |
| **product** | मार्केटिंग लैंडिंग पृष्ठ, जिसमें मूल्य निर्धारण, प्रशंसापत्र और कॉल-टू-एक्शन शामिल हैं। | 1 |
| **app** | RBAC (रोल-आधारित एक्सेस कंट्रोल), फीचर फ़्लैग और वर्कस्पेस रूटिंग के साथ मल्टी-टेनेन्ट SaaS डैशबोर्ड। | 31 |

```bash
npx @mcptoolshop/site-theme list-templates        # see all options
npx @mcptoolshop/site-theme init --template app    # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run  # preview files
```

---

## शुरुआत कैसे करें

### एक नई साइट बनाएं

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

यह `site/` नामक एक निर्देशिका बनाता है, जिसमें Astro + Tailwind + थीम पहले से ही स्थापित हैं, साथ ही GitHub पेजों के लिए एक वर्कफ़्लो भी। CSS आयात, `@source` पथ और बेस पथ सभी पहले से ही कॉन्फ़िगर किए गए हैं - किसी भी मैनुअल सेटअप की आवश्यकता नहीं है।

### अपनी सामग्री संपादित करें

सभी पृष्ठ सामग्री `site/src/site-config.ts` में मौजूद है। अपने लैंडिंग पृष्ठ को अनुकूलित करने के लिए, कॉन्फ़िगरेशन ऑब्जेक्ट को संपादित करें:

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'What my tool does.',
  logoBadge: 'MT',
  brandName: 'my-tool',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'MIT Licensed',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

---

## डिज़ाइन टोकन

यह थीम `styles/theme.css` फ़ाइल के माध्यम से सिमेंटिक डिज़ाइन टोकन प्रदान करती है। घटक इन टोकन को संदर्भित करते हैं, हार्डकोडेड रंगों के बजाय, इसलिए आप कुछ मानों को बदलकर पूरे थीम को बदल सकते हैं।

### डिफ़ॉल्ट टोकन

| टोकन | डिफ़ॉल्ट | उपयोग किया गया |
|-------|---------|----------|
| `--color-surface` | `#09090b` | पृष्ठ पृष्ठभूमि |
| `--color-surface-raised` | `#18181b` | ऊंचे तत्वों, कोड ब्लॉक के लिए |
| `--color-surface-strong` | `#27272a` | बैज, हाइलाइट किए गए पृष्ठभूमि |
| `--color-edge` | `#27272a` | प्राथमिक बॉर्डर |
| `--color-edge-subtle` | `#18181b` | कार्ड/टेबल बॉर्डर |
| `--color-heading` | `#fafafa` | शीर्षक, प्राथमिक पाठ |
| `--color-body` | `#e4e4e7` | मुख्य/माध्यमिक पाठ |
| `--color-muted` | `#d4d4d8` | मंद पाठ |
| `--color-dim` | `#a1a1aa` | लेबल, विवरण |
| `--color-accent` | `#34d399` | स्थिति संकेतक |
| `--color-action` | `#fafafa` | प्राथमिक बटन पृष्ठभूमि |
| `--color-action-text` | `#09090b` | प्राथमिक बटन पाठ |
| `--color-action-hover` | `#e4e4e7` | प्राथमिक बटन होवर |

### अनुकूलन

अपनी साइट के `global.css` में किसी भी टोकन को ओवरराइड करने के लिए, आयात के बाद `@theme` ब्लॉक जोड़ें:

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

/* Override tokens */
@theme {
  --color-accent: #60a5fa;          /* blue status dot   */
  --color-surface: #0a0a1a;         /* navy background   */
  --color-action: #60a5fa;          /* blue buttons      */
  --color-action-hover: #3b82f6;
}
```

टोकन मानक Tailwind v4 यूटिलिटीज (`bg-surface`, `text-heading`, `border-edge`, आदि) उत्पन्न करते हैं, इसलिए आप उनका उपयोग अपने स्वयं के घटकों में भी कर सकते हैं।

---

## घटक

पैकेज से व्यक्तिगत रूप से घटकों को आयात करें:

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

पूरे पृष्ठ का लेआउट, जिसमें एक स्थिर हेडर (लोगो बैज, नेविगेशन लिंक, GitHub/npm बटन) और फुटर शामिल हैं।

| प्रॉप | प्रकार | विवरण |
|------|------|-------------|
| `title` | `string` | पृष्ठ `<title>` |
| `description` | `string` | मेटा विवरण |
| `logoBadge` | `string` | 1–2 अक्षर का बैज (जैसे, `"RS"`) |
| `brandName` | `string` | हेडर में नाम |
| `nav` | `{ href, label }[]` | नेविगेशन लिंक |
| `repoUrl` | `string` | GitHub रिपॉजिटरी URL |
| `npmUrl?` | `string` | npm पैकेज URL |
| `footerText` | `string` | फुटर टेक्स्ट (HTML की अनुमति है) |

### हीरो

स्टेटस बैज, शीर्षक, कॉल-टू-एक्शन और वैकल्पिक कोड पूर्वावलोकन कार्ड के साथ ग्रेडिएंट हीरो सेक्शन।

| प्रॉप | प्रकार | विवरण |
|------|------|-------------|
| `badge` | `string` | स्टेटस बैज टेक्स्ट |
| `headline` | `string` | मुख्य शीर्षक |
| `headlineAccent` | `string` | मंद प्रत्यय |
| `description` | `string` | विवरण (HTML की अनुमति है) |
| `primaryCta` | `{ href, label }` | प्राथमिक बटन |
| `secondaryCta` | `{ href, label }` | माध्यमिक बटन |
| `previews` | `{ label, code }[]` | कोड पूर्वावलोकन कार्ड |

### सेक्शन

एंकर `id`, शीर्षक और वैकल्पिक उपशीर्षक के साथ सेक्शन रैपर।

### FeatureGrid

3-कॉलम वाला रिस्पॉन्सिव कार्ड ग्रिड। प्रॉप्स: `features: { title, desc }[]`

### DataTable

ग्रिड-आधारित बॉर्डर वाला टेबल। प्रॉप्स: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

2-कॉलम वाला डार्क कोड ब्लॉक कार्ड ग्रिड। प्रॉप्स: `cards: { title, code }[]`

### ApiList

पूरे चौड़ाई वाला स्टैक्ड API संदर्भ कार्ड। प्रॉप्स: `apis: { signature, description }[]`

---

## सेक्शन प्रकार

आपके कॉन्फ़िगरेशन में `sections` सरणी इन `kind` मानों का समर्थन करती है:

| किंड | घटक | प्रॉप |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

सेक्शन उसी क्रम में प्रदर्शित होते हैं जिस क्रम में वे ऐरे में दिखाई देते हैं।

---

## तैनात करें

`init` कमांड-लाइन इंटरफ़ेस (CLI) स्वचालित रूप से `.github/workflows/pages.yml` फ़ाइल बनाता है। लाइव होने के लिए:

1. अपनी रिपॉजिटरी को GitHub पर अपलोड करें।
2. अपनी रिपॉजिटरी पर जाएं → **सेटिंग्स → पेज**
3. **बिल्ड और डिप्लॉयमेंट** के अंतर्गत, **स्रोत** को **GitHub एक्शन** पर सेट करें।
4. `site/` में कोई भी बदलाव करके पहले बिल्ड को ट्रिगर करें।

आपकी वेबसाइट `https://<संगठन>.github.io/<रिपॉजिटरी>/` पर लाइव होगी।

---

## सुरक्षा और डेटा का दायरा

| पहलू | विवरण |
|--------|--------|
| **Data touched** | एस्ट्रो कंपोनेंट फ़ाइलें, सीएसएस टोकन, साइट कॉन्फ़िगरेशन — केवल बिल्ड समय पर। |
| **Data NOT touched** | कोई उपयोगकर्ता डेटा नहीं, कोई रनटाइम स्थिति नहीं, कोई सर्वर-साइड प्रोसेसिंग नहीं। |
| **Permissions** | पढ़ें: प्रोजेक्ट स्रोत फ़ाइलें। लिखें: बिल्ड आउटपुट `site/dist/` में। |
| **Network** | कोई नहीं — यह एक स्टैटिक साइट जेनरेटर है जिसमें कोई रनटाइम नेटवर्क एक्सेस नहीं है। |
| **Telemetry** | कोई भी डेटा एकत्र या भेजा नहीं जाता है। |

भेद्यता रिपोर्टिंग के लिए [SECURITY.md](SECURITY.md) देखें।

## स्कोरकार्ड

| श्रेणी | स्कोर |
|----------|-------|
| A. सुरक्षा | 10 |
| B. त्रुटि प्रबंधन | 10 |
| C. ऑपरेटर दस्तावेज़ | 10 |
| D. शिपिंग स्वच्छता | 10 |
| E. पहचान (सॉफ्ट) | 10 |
| **Overall** | **50/50** |

> पूर्ण ऑडिट: [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## लाइसेंस

MIT

---

[MCP Tool Shop](https://mcp-tool-shop.github.io/) द्वारा निर्मित।
