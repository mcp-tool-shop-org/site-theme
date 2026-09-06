<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.md">English</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="site-theme preview" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  Multi-template Astro toolkit for landing pages, docs, product sites, portfolios, and SaaS dashboards —<br/>
  plus <strong>front-door</strong>, the verifier for a repo's AI-native README / AGENTS.md / llms.txt.<br/>
  Dark palette · Tailwind CSS v4 · GitHub Pages ready.
</p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/site-theme/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/site-theme/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@mcptoolshop/site-theme"><img src="https://img.shields.io/npm/v/@mcptoolshop/site-theme" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/templates-default_·_docs_·_product_·_portfolio_·_app_·_tool-34d399" alt="Templates: default · docs · product · portfolio · app · tool" />
  <a href="https://mcp-tool-shop-org.github.io/site-theme/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="MIT License" /></a>
</p>

<p align="center">
  <a href="#templates">Templates</a> &middot;
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#front-door">Front Door</a> &middot;
  <a href="#design-tokens">Design Tokens</a> &middot;
  <a href="#components">Components</a> &middot;
  <a href="#deploy">Deploy</a> &middot;
  <a href="#license">License</a>
</p>

---

## टेम्पलेट

एक टेम्पलेट चुनें, ढांचा बनाएं, और निर्माण करें। प्रत्येक टेम्पलेट CI-परीक्षण के साथ और GitHub पेजों के लिए तैयार होकर आता है।

| टेम्पलेट | विवरण | पेज |
|----------|-------------|-------|
| **default** | मुख्य आकर्षण, विशेषताओं और कोड उदाहरणों के साथ प्रोजेक्ट लैंडिंग पेज | 1 |
| **docs** | साइडबार नेविगेशन और सामग्री अनुभागों के साथ दस्तावेज़ साइट | 1 |
| **product** | मूल्य निर्धारण, प्रशंसापत्र और CTA के साथ मार्केटिंग लैंडिंग पेज | 1 |
| **portfolio** | उपकरणों, परियोजनाओं या किसी भी संग्रह के लिए फ़िल्टर करने योग्य कैटलॉग ग्रिड | 1 |
| **app** | RBAC, सुविधा झंडे और वर्कस्पेस रूटिंग के साथ मल्टी-टेनेंट SaaS डैशबोर्ड | 31 |
| **tool** | CLI / MCP / npm पैकेज लैंडिंग पेज जिसमें कमांड, वर्कफ़्लो और प्रमाण शामिल हैं | 1 |

```bash
npx @mcptoolshop/site-theme list-templates            # see all options
npx @mcptoolshop/site-theme list-templates --json      # machine-readable output
npx @mcptoolshop/site-theme init --template app        # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run   # preview files
npx @mcptoolshop/site-theme init --out ../other-repo   # scaffold into another directory
```

---

## त्वरित शुरुआत

### एक नई साइट बनाएं

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

यह Astro 7 + Tailwind + थीम के साथ एक `site/` निर्देशिका बनाता है, साथ ही एक GitHub पेजों का वर्कफ़्लो भी। CSS आयात, `@source` पथ और बेस पथ सभी पहले से कॉन्फ़िगर किए गए हैं - किसी मैन्युअल सेटअप की आवश्यकता नहीं है। Astro 5 या 6 पर मौजूदा उपयोगकर्ता काम करना जारी रख सकते हैं (`peerDependencies.astro` `>=5` है)।

### अपनी सामग्री संपादित करें

सभी पृष्ठ सामग्री `site/src/site-config.ts` में मौजूद है। अपने लैंडिंग पेज को अनुकूलित करने के लिए कॉन्फ़िगरेशन ऑब्जेक्ट को संपादित करें:

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'What my tool does.',
  logoBadge: 'MT',
  brandName: 'my-tool',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  packageUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'MIT Licensed',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

---

## फ्रंट डोर

साइट-थीम एक रिपॉजिटरी के **मानवीय** फ्रंट डोर को प्रस्तुत करता है; **फ्रंट-डोर** इसके **एजेंट/मशीन** फ्रंट डोर को सत्यापित करता है - README, `AGENTS.md` और `llms.txt`, जिन्हें मनुष्य, एजेंट और उपकरण सबसे पहले पढ़ते हैं। यह पहले सत्यापित करता है: यह आपके लिए गद्य नहीं लिखता है, यह साबित करता है कि आपका गद्य सत्य और संक्षिप्त है।

```bash
npx @mcptoolshop/site-theme front-door verify                  # audit; exits 1 if the gate fails
npx @mcptoolshop/site-theme front-door verify --run-doctests   # also compile/run fenced JS examples
npx @mcptoolshop/site-theme front-door init                    # scaffold a minimal, verify-clean front door
npx @mcptoolshop/site-theme front-door standard                # print the front-door spine
npx @mcptoolshop/site-theme front-door eval                    # the verifier's self-eval receipt
npx @mcptoolshop/site-theme front-door mcp                     # start the MCP server (agents call verify)
```

यह प्रत्येक प्रलेखित दावे को उस प्रमाण से जोड़ता है जो इसका समर्थन कर सकता है - मृत पथ / स्क्रिप्ट / लिंक, AGENTS.md↔README दोहराव, स्टेटस-बैज अविश्वास, उदाहरण आयात बनाम वास्तविक `exports` (और, `--run-doctests` के साथ, यह कि उदाहरण वास्तव में संकलित और चलते हैं), प्रामाणिक दावे बनाम वास्तविक सत्यापन, और अतिरेक (लंबाई / पठनीयता / `AGENTS.md` के लिए निर्देश बजट)। निष्कर्षों को चार श्रेणियों में जोखिम-आधारित क्रम में व्यवस्थित किया जाता है: सत्यापित / खंडित / गुम / अविश्वसनीय।

इसे प्रोग्रामेटिक रूप से उपयोग करें (शिपचेक इसे उपयोग करता है):

```js
import { verify } from '@mcptoolshop/site-theme/front-door';

const scorecard = verify({ root: process.cwd() });
if (!scorecard.gate.pass) process.exit(1);
```

या किसी एजेंट को इसे चलाने दें: `front-door mcp` एक शून्य-निर्भरता MCP सर्वर (stdio) शुरू करता है जो `front_door_verify` को उजागर करता है - एजेंट को समान संरचित स्कोरकार्ड प्राप्त होता है।

पूरी चैनल सूची और मानक के लिए [फ्रंट डोर संदर्भ](docs/front-door.md) देखें।

---

## डिजाइन टोकन

थीम `styles/theme.css` के माध्यम से सिमेंटिक डिजाइन टोकन प्रदान करता है। घटक हार्डकोडेड रंगों के बजाय इन टोकन का संदर्भ देते हैं, इसलिए आप कुछ मानों को ओवरराइड करके पूरी थीम को फिर से डिज़ाइन कर सकते हैं।

### डिफ़ॉल्ट टोकन

| टोकन | डिफ़ॉल्ट | उपयोग किया जाता है |
|-------|---------|----------|
| `--color-surface` | `#09090b` | पृष्ठ पृष्ठभूमि |
| `--color-surface-raised` | `#18181b` | उन्नत तत्व, कोड ब्लॉक |
| `--color-surface-strong` | `#27272a` | बैज, जोर वाली पृष्ठभूमि |
| `--color-edge` | `#27272a` | प्राथमिक बॉर्डर |
| `--color-edge-subtle` | `#18181b` | कार्ड / तालिका बॉर्डर |
| `--color-heading` | `#fafafa` | शीर्षक, प्राथमिक पाठ |
| `--color-body` | `#e4e4e7` | मुख्य / द्वितीयक पाठ |
| `--color-muted` | `#d4d4d8` | मंद पाठ |
| `--color-dim` | `#a1a1aa` | लेबल, विवरण |
| `--color-accent` | `#34d399` | स्थिति संकेतक |
| `--color-action` | `#fafafa` | प्राथमिक बटन पृष्ठभूमि |
| `--color-action-text` | `#09090b` | प्राथमिक बटन पाठ |
| `--color-action-hover` | `#e4e4e7` | प्राथमिक बटन होवर |

### अनुकूलन

अपनी साइट के `global.css` में किसी भी टोकन को ओवरराइड करें, आयात के बाद एक `@theme` ब्लॉक जोड़कर:

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

टोकन मानक Tailwind v4 उपयोगिताओं (`bg-surface`, `text-heading`, `border-edge`, आदि) उत्पन्न करते हैं, इसलिए आप उन्हें अपने स्वयं के घटकों में भी उपयोग कर सकते हैं।

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
import DocLayout from '@mcptoolshop/site-theme/components/DocLayout.astro';
import Sidebar from '@mcptoolshop/site-theme/components/Sidebar.astro';
import TableOfContents from '@mcptoolshop/site-theme/components/TableOfContents.astro';
import ContentSection from '@mcptoolshop/site-theme/components/ContentSection.astro';
import SocialProof from '@mcptoolshop/site-theme/components/SocialProof.astro';
import PricingGrid from '@mcptoolshop/site-theme/components/PricingGrid.astro';
import TestimonialGrid from '@mcptoolshop/site-theme/components/TestimonialGrid.astro';
import CtaBanner from '@mcptoolshop/site-theme/components/CtaBanner.astro';
import PortfolioGrid from '@mcptoolshop/site-theme/components/PortfolioGrid.astro';
import FilterBar from '@mcptoolshop/site-theme/components/FilterBar.astro';
---
```

थीम पांच श्रेणियों में 17 Astro घटक प्रदान करता है: लेआउट शैल, सामग्री अनुभाग, मार्केटिंग ब्लॉक, पोर्टफोलियो और दस्तावेज़।

### बेसलेआउट

चिपचिपे हेडर (लोगो बैज, नेव लिंक, GitHub / पैकेज बटन) और फ़ुटर के साथ पूर्ण पृष्ठ शेल। नामित स्लॉट `head` अतिरिक्त `<head>` टैग (OG छवि, JSON-LD, प्रीकनेक्ट) के लिए विस्तार बिंदु है।

| प्रोप | प्रकार | विवरण |
|------|------|-------------|
| `title` | `string` | पृष्ठ `<title>` |
| `description` | `string` | मेटा विवरण |
| `logoBadge` | `string` | 1-2 अक्षर का बैज (जैसे `"RS"`) |
| `brandName` | `string` | हेडर में नाम |
| `nav` | `{ href, label }[]` | एंकर नेव लिंक (वैकल्पिक, डिफ़ॉल्ट रूप से `[]`) |
| `repoUrl` | `string` | GitHub रिपॉजिटरी URL |
| `packageUrl?` | `string` | प्राथमिक रजिस्ट्री लिस्टिंग (npm, PyPI, crates.io, ...)। लेबल होस्ट से प्राप्त होता है। |
| `packageLabel?` | `string` | `packageUrl` के लिए वैकल्पिक प्रदर्शन लेबल ओवरराइड |
| `npmUrl?` | `string` | `packageUrl` के लिए अप्रचलित उपनाम |
| `footerText` | `string` | फ़ुटर टेक्स्ट (HTML की अनुमति है) |

```astro
<BaseLayout {title} {description} {logoBadge} {brandName} {repoUrl} packageUrl={config.packageUrl} {footerText}>
  <Fragment slot="head">
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={ogImage} />
  </Fragment>
  <!-- page body -->
</BaseLayout>
```

### हीरो

ग्रेडिएंट हीरो जिसमें स्टेटस बैज, शीर्षक, CTA और वैकल्पिक कोड पूर्वावलोकन कार्ड शामिल हैं।

| प्रोप | प्रकार | विवरण |
|------|------|-------------|
| `badge` | `string` | स्टेटस बैज टेक्स्ट |
| `headline` | `string` | मुख्य शीर्षक |
| `headlineAccent` | `string` | मंद प्रत्यय |
| `description` | `string` | विवरण (HTML की अनुमति है) |
| `primaryCta` | `{ href, label }` | प्राथमिक बटन |
| `secondaryCta` | `{ href, label }` | द्वितीयक बटन |
| `previews` | `{ label, code }[]` | कोड पूर्वावलोकन कार्ड (वैकल्पिक) |

### सेक्शन

एंकर `id`, शीर्षक और वैकल्पिक उपशीर्षक के साथ अनुभाग रैपर।

### फीचरग्रिड

3-कॉलम उत्तरदायी कार्ड ग्रिड। प्रॉप्स: `features: { title, desc }[]`

### डेटाटेबल

ग्रिड-आधारित बॉर्डर वाली तालिका। प्रॉप्स: `columns: string[]`, `rows: string[][]`

### कोडकार्डग्रिड

2-कॉलम का डार्क कोड ब्लॉक कार्ड ग्रिड। प्रॉप्स: `cards: { title, code }[]`

### एपीआईलिस्ट

पूर्ण-चौड़ाई वाली स्टैक्ड API संदर्भ कार्ड। प्रॉप्स: `apis: { signature, description }[]`

### फ़िल्टरबार

पोर्टफोलियो ग्रिड के लिए क्लाइंट-साइड खोज + टैग फ़िल्टरिंग बार। प्रॉप्स: `tags: string[]`, `searchable?: boolean`, `searchPlaceholder?: string`

### पोर्टफोलियोग्रिड

कॉन्फ़िगर करने योग्य कार्ड ग्रिड जिसमें स्टेटस बैज, श्रेणी समूहीकरण और छवि/बैज फ़ॉलबैक शामिल हैं। प्रॉप्स: `items: PortfolioItem[]`, `columns?: 2 | 3 | 4`, `groupByCategory?: boolean`

### डॉक्लेआउट

दो-कॉलम लेआउट जिसमें संकुचित साइडबार और मुख्य सामग्री क्षेत्र है। **डॉक्स** टेम्पलेट द्वारा उपयोग किया जाता है। प्रॉप्स: `sidebar: SidebarGroup[]`, `currentPath: string`

### साइडबार

सक्रिय-लिंक हाइलाइटिंग के साथ समूहीकृत नेविगेशन सूची। प्रॉप्स: `groups: SidebarGroup[]`, `currentPath?: string`

### टेबलऑफकंटेंट्स

पृष्ठ पर हेडिंग नेविगेशन। प्रॉप्स: `headings?: { text, id, depth }[]`

### सामग्री अनुभाग

एंकर-लिंक्ड सामग्री ब्लॉक जो `set:html` के माध्यम से HTML प्रस्तुत करता है। प्रॉप्स: `id: string`, `title: string`, `content: string`

### सोशल प्रूफ

हेडलाइन और मान/लेबल युग्मों के साथ आँकड़े बार। प्रॉप्स: `headline?: string`, `stats?: { value, label }[]`

### मूल्य निर्धारण ग्रिड

हाइलाइट किए गए "लोकप्रिय" स्तर के साथ उत्तरदायी मूल्य निर्धारण स्तर कार्ड। प्रॉप्स: `tiers?: PricingTier[]`

### प्रशंसापत्र ग्रिड

अवतार फ़ॉलबैक इनिशियल्स के साथ दो-स्तंभ उद्धरण कार्ड। प्रॉप्स: `testimonials?: { quote, author, role, avatarUrl? }[]`

### सीटीए बैनर

पूरी चौड़ाई वाला ग्रेडिएंट कॉल-टू-एक्शन बैनर। प्रॉप्स: `headline: string`, `description?: string`, `cta: { href, label }`

---

## अनुभाग प्रकार

आपके कॉन्फ़िग में `sections` सरणी इन `kind` मानों का समर्थन करती है:

| प्रकार | घटक | प्रॉप्स |
|------|-----------|-------|
| `features` | फीचरग्रिड | `features: { title, desc }[]` |
| `data-table` | डेटाटेबल | `columns: string[]`, `rows: string[][]` |
| `code-cards` | कोडकार्डग्रिड | `cards: { title, code }[]` |
| `api` | एपीआईलिस्ट | `apis: { signature, description }[]` |

अनुभाग उस क्रम में प्रस्तुत किए जाते हैं जिसमें वे सरणी में दिखाई देते हैं।

---

## तैनात करें

`init` CLI स्वचालित रूप से `.github/workflows/pages.yml` बनाता है। लाइव होने के लिए:

1. अपनी रिपॉजिटरी को GitHub पर पुश करें
2. अपनी रिपॉजिटरी पर जाएं → **सेटिंग्स → पेज**
3. **बिल्ड और परिनियोजन** के अंतर्गत, **स्रोत** को **GitHub क्रियाएं** पर सेट करें
4. पहला बिल्ड शुरू करने के लिए `site/` में कोई भी परिवर्तन पुश करें

आपकी साइट `https://<org>.github.io/<repo>/` पर लाइव होगी।

---

## सुरक्षा और डेटा दायरा

| पहलू | विवरण |
|--------|--------|
| **Data touched** | थीम: एस्ट्रो घटक, सीएसएस टोकन, बिल्ड समय पर साइट कॉन्फ़िग। फ्रंट-डोर: README / AGENTS.md / llms.txt / CLAUDE.md डिस्क पर। |
| **Data NOT touched** | कोई उपयोगकर्ता खाते नहीं, कोई रनटाइम साइट स्थिति नहीं, कोई एनालिटिक्स नहीं, कोई तृतीय-पक्ष एपीआई नहीं |
| **Permissions** | पढ़ें: परियोजना स्रोत। लिखें: `init` cwd (या `--out`) में `site/` लिखता है। जब तक `--run-doctests` न हो, सत्यापन केवल-पढ़ने योग्य है। |
| **Network** | डिफ़ॉल्ट रूप से बंद। MCP stdio है। `--run-doctests` एक वैकल्पिक चाइल्ड-प्रोसेस निष्पादन है; यह पैकेज स्थापित नहीं करता है या नेटवर्क नहीं खोलता है। |
| **Telemetry** | कोई भी एकत्र या भेजा नहीं गया |

### HTML प्रॉप्स (सेट:html)

कई घटक प्रॉप्स एस्ट्रो के `set:html` निर्देश के माध्यम से कच्चे HTML प्रस्तुत करते हैं। यदि आपका डेटा स्रोत अविश्वसनीय है (उपयोगकर्ता-जनित सामग्री, बाहरी एपीआई), तो [DOMPurify](https://github.com/cure53/DOMPurify) या [sanitize-html](https://github.com/apostrophecms/sanitize-html) जैसे पुस्तकालय का उपयोग करके इसे पास करने से पहले HTML को सैनिटाइज करें।

| घटक | सेट:html का उपयोग करने वाले प्रॉप्स |
|-----------|---------------------|
| बेसलेआउट | `footerText` |
| हीरो | `badge`, `description` |
| कोडकार्डग्रिड | `cards[].code` |
| एपीआईलिस्ट | `apis[].signature`, `apis[].description` |
| सामग्री अनुभाग | `content` |

भेद्यता रिपोर्टिंग के लिए [SECURITY.md](SECURITY.md) देखें।

## स्कोरकार्ड

| श्रेणी | स्कोर |
|----------|-------|
| ए. सुरक्षा | 10 |
| बी. त्रुटि प्रबंधन | 10 |
| सी. ऑपरेटर दस्तावेज़ | 10 |
| डी. शिपिंग स्वच्छता | 10 |
| ई. पहचान (नरम) | 10 |
| **Overall** | **50/50** |

> पूर्ण ऑडिट: [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## लाइसेंस

एमआईटी

---

[MCP टूल शॉप](https://mcp-tool-shop.github.io/) द्वारा निर्मित
