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
  <img src="https://img.shields.io/badge/templates-default_·_docs_·_product_·_portfolio_·_app-34d399" alt="Templates: default · docs · product · portfolio · app" />
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

## टेम्प्लेट

एक टेम्प्लेट चुनें, ढांचा बनाएं, और विकसित करें। प्रत्येक टेम्प्लेट CI-परीक्षण के साथ आता है और GitHub पेजों के लिए तैयार होता है।

| टेम्प्लेट | विवरण | पेज |
|----------|-------------|-------|
| **default** | मुख्य आकर्षण, विशेषताओं और कोड उदाहरणों के साथ प्रोजेक्ट लैंडिंग पेज | 1 |
| **docs** | साइडबार नेविगेशन और सामग्री अनुभागों के साथ दस्तावेज़ साइट | 1 |
| **product** | मूल्य निर्धारण, प्रशंसापत्र और CTA के साथ मार्केटिंग लैंडिंग पेज | 1 |
| **portfolio** | उपकरणों, परियोजनाओं या किसी भी संग्रह के लिए फ़िल्टर करने योग्य कैटलॉग ग्रिड | 1 |
| **app** | RBAC, सुविधा झंडे और वर्कस्पेस रूटिंग के साथ मल्टी-टेनेंट SaaS डैशबोर्ड | 31 |

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

यह Astro + Tailwind + थीम के साथ एक `site/` निर्देशिका बनाता है, साथ ही GitHub पेजों वर्कफ़्लो भी। CSS आयात, `@source` पथ और आधार पथ सभी पहले से कॉन्फ़िगर किए गए हैं - किसी मैन्युअल सेटअप की आवश्यकता नहीं है।

### अपनी सामग्री संपादित करें

सभी पेज सामग्री `site/src/site-config.ts` में मौजूद है। अपने लैंडिंग पृष्ठ को अनुकूलित करने के लिए कॉन्फ़िगरेशन ऑब्जेक्ट को संपादित करें:

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

## फ्रंट डोर

साइट-थीम एक रिपॉजिटरी का **मानवीय** फ्रंट डोर प्रस्तुत करता है; **फ्रंट-डोर** इसके **एजेंट/मशीन** फ्रंट डोर की पुष्टि करता है - README, `AGENTS.md` और `llms.txt` जो मनुष्य, एजेंट और उपकरण पहले पढ़ते हैं। यह सबसे पहले सत्यापित करता है: यह आपके लिए गद्य नहीं लिखता है, बल्कि यह साबित करता है कि आपका गद्य सत्य और संक्षिप्त है।

```bash
npx @mcptoolshop/site-theme front-door verify                  # audit; exits 1 if the gate fails
npx @mcptoolshop/site-theme front-door verify --run-doctests   # also compile/run fenced JS examples
npx @mcptoolshop/site-theme front-door init                    # scaffold a minimal, verify-clean front door
npx @mcptoolshop/site-theme front-door standard                # print the front-door spine
npx @mcptoolshop/site-theme front-door eval                    # the verifier's self-eval receipt
npx @mcptoolshop/site-theme front-door mcp                     # start the MCP server (agents call verify)
```

यह प्रत्येक प्रलेखित दावे को उस प्रमाण से जोड़ता है जो इसका समर्थन कर सकता है - मृत पथ / स्क्रिप्ट / लिंक, AGENTS.md↔README दोहराव, स्टेटस-बैज अविश्वास, उदाहरण आयात बनाम वास्तविक `निर्यात` (और, `--run-doctests` के साथ, यह कि उदाहरण वास्तव में संकलित और चलते हैं), प्रामाणिकता दावे बनाम वास्तविक सत्यापन, और अतिरेक (लंबाई / पठनीयता / `AGENTS.md` के लिए निर्देश बजट)। निष्कर्षों को चार श्रेणियों में जोखिम-आधारित क्रम में व्यवस्थित किया जाता है: सत्यापित / विरोधाभासी / गुम / अविश्वसनीय।

इसे प्रोग्रामेटिक रूप से उपयोग करें (शिपचेक इसे उपभोग करता है):

```js
import { verify } from '@mcptoolshop/site-theme/front-door';

const scorecard = verify({ root: process.cwd() });
if (!scorecard.gate.pass) process.exit(1);
```

या किसी एजेंट को इसे चलाने दें: `front-door mcp` एक शून्य-निर्भरता MCP सर्वर (stdio) शुरू करता है जो `front_door_verify` को उजागर करता है - एजेंट समान संरचित स्कोरकार्ड प्राप्त करता है।

पूरी चैनल सूची और मानक के लिए [फ्रंट डोर संदर्भ](docs/front-door.md) देखें।

---

## डिजाइन टोकन

थीम `styles/theme.css` के माध्यम से सिमेंटिक डिज़ाइन टोकन प्रदान करता है। घटक हार्डकोडेड रंगों के बजाय इन टोकनों का संदर्भ देते हैं, इसलिए आप कुछ मानों को ओवरराइड करके पूरी थीम को फिर से डिज़ाइन कर सकते हैं।

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

अपनी साइट के `global.css` में किसी भी टोकन को आयात के बाद `@theme` ब्लॉक जोड़कर ओवरराइड करें:

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

टोकन मानक टेलविंड v4 उपयोगिताओं (`bg-surface`, `text-heading`, `border-edge`, आदि) उत्पन्न करते हैं, इसलिए आप उन्हें अपने स्वयं के घटकों में भी उपयोग कर सकते हैं।

---

## घटक

पैकेज से व्यक्तिगत रूप से घटक आयात करें:

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

थीम पांच श्रेणियों में 17 एस्ट्रो घटक प्रदान करता है: लेआउट शैल, सामग्री अनुभाग, मार्केटिंग ब्लॉक, पोर्टफोलियो और दस्तावेज़।

### बेसलेआउट

चिपचिपा हेडर (लोगो बैज, नेव लिंक, GitHub/npm बटन) और फ़ुटर के साथ पूर्ण पृष्ठ शेल।

| प्रोप | प्रकार | विवरण |
|------|------|-------------|
| `title` | `string` | पृष्ठ `<title>` |
| `description` | `string` | मेटा विवरण |
| `logoBadge` | `string` | 1-2 अक्षर का बैज (जैसे, `"RS"`) |
| `brandName` | `string` | हेडर में नाम |
| `nav` | `{ href, label }[]` | एंकर नेव लिंक (वैकल्पिक, डिफ़ॉल्ट रूप से `[]`) |
| `repoUrl` | `string` | GitHub रिपॉजिटरी URL |
| `npmUrl?` | `string` | npm पैकेज URL |
| `footerText` | `string` | फ़ुटर टेक्स्ट (HTML की अनुमति है) |

### हीरो

स्टेटस बैज, हेडिंग, CTA और वैकल्पिक कोड पूर्वावलोकन कार्ड के साथ ग्रेडिएंट हीरो।

| प्रोप | प्रकार | विवरण |
|------|------|-------------|
| `badge` | `string` | स्टेटस बैज टेक्स्ट |
| `headline` | `string` | मुख्य हेडिंग |
| `headlineAccent` | `string` | मंद प्रत्यय |
| `description` | `string` | विवरण (HTML की अनुमति है) |
| `primaryCta` | `{ href, label }` | प्राथमिक बटन |
| `secondaryCta` | `{ href, label }` | द्वितीयक बटन |
| `previews` | `{ label, code }[]` | कोड पूर्वावलोकन कार्ड (वैकल्पिक) |

### सेक्शन

एंकर `id`, हेडिंग और वैकल्पिक उपशीर्षक के साथ अनुभाग रैपर।

### फीचरग्रिड

3-स्तंभ उत्तरदायी कार्ड ग्रिड। प्रॉप्स: `features: { title, desc }[]`

### डेटाटेबल

ग्रिड-आधारित बॉर्डर वाली तालिका। प्रॉप्स: `columns: string[]`, `rows: string[][]`

### कोडकार्डग्रिड

2-स्तंभ गहरे कोड ब्लॉक कार्ड ग्रिड। प्रॉप्स: `cards: { title, code }[]`

### एपीआईलिस्ट

पूर्ण-चौड़ाई स्टैक्ड एपीआई संदर्भ कार्ड। प्रॉप्स: `apis: { signature, description }[]`

### फ़िल्टरबार

पोर्टफोलियो ग्रिड के लिए क्लाइंट-साइड खोज + टैग फ़िल्टरिंग बार। प्रॉप्स: `tags: string[]`, `searchable?: boolean`, `searchPlaceholder?: string`

### पोर्टफोलियोग्रिड

कॉन्फ़िगर करने योग्य कार्ड ग्रिड जिसमें स्टेटस बैज, श्रेणी समूहीकरण और छवि/बैज फ़ॉलबैक शामिल हैं। प्रॉप्स: `items: PortfolioItem[]`, `columns?: 2 | 3 | 4`, `groupByCategory?: boolean`

### डॉक्लेआउट

दो-स्तंभ लेआउट जिसमें संकुचित साइडबार और मुख्य सामग्री क्षेत्र है। **दस्तावेज़** टेम्प्लेट द्वारा उपयोग किया जाता है। प्रॉप्स: `sidebar: SidebarGroup[]`, `currentPath: string`

### साइडबार

सक्रिय लिंक को हाइलाइट करते हुए समूहीकृत नेविगेशन सूची। गुणधर्म: `समूह: साइडबारग्रुप[]`, `वर्तमानपथ?: स्ट्रिंग`

### विषय-सूची

पृष्ठ पर शीर्षक नेविगेशन। प्रॉप्स: `शीर्षक?: { पाठ, आईडी, गहराई }[]`

### सामग्री अनुभाग

एंकर से जुड़े सामग्री ब्लॉक जो `सेट:एचटीएमएल` के माध्यम से एचटीएमएल प्रस्तुत करता है। गुणधर्म: `आईडी: स्ट्रिंग`, `शीर्षक: स्ट्रिंग`, `सामग्री: स्ट्रिंग`।

### सामाजिक प्रमाण

शीर्षक और मान/लेबल युग्मों के साथ आँकड़ा पट्टी। गुणधर्म: `शीर्षक?: स्ट्रिंग`, `आँकड़े?: {मान, लेबल}[]`

### मूल्य निर्धारण तालिका

“लोकप्रिय” श्रेणी को दर्शाते हुए, गतिशील मूल्य निर्धारण वाली विभिन्न श्रेणियों के कार्ड। प्रॉप्स: `टियर्स?: प्राइसिंगटियर[]`

### प्रशंसापत्र ग्रिड

दो कॉलम वाले उद्धरण कार्ड, जिनमें अवतार के रूप में शुरुआती अक्षर प्रदर्शित किए जाते हैं। प्रॉप्स: `टेस्टिमोनियल्स?: {उद्धरण, लेखक, भूमिका, अवतारयूआरएल?}[]`

### कॉल टू एक्शन बैनर

पूरी चौड़ाई वाला ढाल प्रभाव वाला कॉल-टू-एक्शन बैनर। गुणधर्म: `हेडलाइन: स्ट्रिंग`, `विवरण?: स्ट्रिंग`, `सीटीए: { एचआरईएफ, लेबल }`

---

## अनुभाग के प्रकार

आपके कॉन्फ़िगरेशन में मौजूद `सेक्शंस` ऐरे निम्नलिखित `काइंड` मानों का समर्थन करता है:

| दयालु/कृपालु/सौम्य | घटक | सामान/उपकरण/सहायक वस्तुएँ |
|------|-----------|-------|
| `features` | फीचरग्रिड | `features: { title, desc }[]` |
| `data-table` | डेटाटेबल | `columns: string[]`, `rows: string[][]` |
| `code-cards` | कोडकार्डग्रिड | `cards: { title, code }[]` |
| `api` | एपीआईलिस्ट | `apis: { signature, description }[]` |

खंड उसी क्रम में प्रदर्शित होते हैं जिस क्रम में वे ऐरे में दिखाई देते हैं।

---

## तैनात करना।

`init` कमांड-लाइन इंटरफ़ेस स्वचालित रूप से `.github/workflows/pages.yml` फ़ाइल बनाता है। इसे सक्रिय करने के लिए:

1. अपने रिपॉजिटरी को गिटहब पर अपलोड करें।
2. अपने रिपॉजिटरी में जाएं → **सेटिंग्स → पेज**
3. "**निर्माण और तैनाती**" के अंतर्गत, "**स्रोत**" को "**गिटहब एक्शन**" पर सेट करें।
4. `site/` में कोई भी बदलाव करके पहले निर्माण को शुरू करें।

आपकी वेबसाइट `https://<org>.github.io/<repo>/` पर उपलब्ध होगी।

---

## सुरक्षा और डेटा का दायरा

| पहलू/विशिष्टता/दृष्टिकोण | विस्तार से बताएं। |
|--------|--------|
| **Data touched** | एस्ट्रो घटक फ़ाइलें, सीएसएस टोकन, साइट कॉन्फ़िगरेशन – ये केवल निर्माण के समय ही उपयोग किए जाते हैं। |
| **Data NOT touched** | कोई भी उपयोगकर्ता डेटा नहीं, कोई रनटाइम स्थिति नहीं, सर्वर-साइड प्रोसेसिंग नहीं। |
| **Permissions** | पढ़ें: परियोजना स्रोत फ़ाइलें। लिखें: साइट/डिस्ट्रिब्यूशन/ में आउटपुट बनाएँ। |
| **Network** | कोई नहीं – एक स्थिर साइट जनरेटर जिसमें रनटाइम के दौरान नेटवर्क तक पहुँच की आवश्यकता नहीं होती। |
| **Telemetry** | किसी ने भी एकत्र नहीं किया या भेजा। |

### एचटीएमएल गुणधर्म (सेट: एचटीएमएल)

कई घटक गुण एस्ट्रो के `set:html` निर्देशिका का उपयोग करके कच्चा एचटीएमएल प्रस्तुत करते हैं। यदि आपका डेटा स्रोत अविश्वसनीय है (उपयोगकर्ता द्वारा बनाई गई सामग्री, बाहरी एपीआई), तो [DOMPurify](https://github.com/cure53/DOMPurify) या [sanitize-html](https://github.com/apostrophecms/sanitize-html) जैसी लाइब्रेरी का उपयोग करके इसे पास करने से पहले एचटीएमएल को सुरक्षित करें।

| घटक | सेट:एचटीएमएल का उपयोग करके प्रॉप्स। |
|-----------|---------------------|
| बेसलेआउट | `footerText` |
| हीरो | `badge`, `description` |
| कोडकार्डग्रिड | `cards[].code` |
| एपीआईलिस्ट | `apis[].signature`, `apis[].description` |
| सामग्री अनुभाग | `content` |

सुरक्षा संबंधी कमजोरियों की रिपोर्ट करने के लिए [SECURITY.md] देखें।

## स्कोरकार्ड

| श्रेणी | अंक/स्कोर |
|----------|-------|
| ए. सुरक्षा | 10 |
| बी. त्रुटि प्रबंधन | 10 |
| सी. ऑपरेटर दस्तावेज़। | 10 |
| डी. परिवहन स्वच्छता | 10 |
| ई. पहचान (अस्थायी) | 10 |
| **Overall** | **50/50** |

> संपूर्ण ऑडिट: [शिप_गेट.एमडी] ([SHIP_GATE.md]) · [स्कोरकार्ड.एमडी] ([SCORECARD.md])

## लाइसेंस

एमआईटी

---

[एमसीपी टूल शॉप] द्वारा निर्मित।
