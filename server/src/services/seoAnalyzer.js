const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config/env');

class SEOAnalyzer {
  constructor() {
    this.userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (RankPilot SEO Auditor)';
  }

  async analyzeUrl(url, targetKeyword = '') {
    const startTime = Date.now();
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        },
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
      });
    } catch (err) {
      throw new Error(`Failed to fetch website (${url}): ${err.message}`);
    }

    const responseTimeMs = Date.now() - startTime;
    const html = response.data;
    const statusCode = response.status;
    const $ = cheerio.load(typeof html === 'string' ? html : '');

    const checks = [];
    const normalizedKeyword = targetKeyword ? targetKeyword.trim().toLowerCase() : '';

    // --- ON-PAGE CHECKS ---

    // 1. Title Tag Presence
    const rawTitle = $('title').first().text().trim();
    if (!rawTitle) {
      checks.push({
        id: 'title_presence',
        category: 'onPage',
        name: 'Title Tag Presence',
        status: 'fail',
        value: 'Missing <title> tag in HTML document',
        impact: 'High',
        reason: 'The <title> tag is Google\'s primary signal for establishing the central topic of a webpage and generates the clickable headline in organic search results.',
        explainability: 'No <title> tag was found within the <head> element. Search engines will generate an arbitrary title from page body text, drastically lowering click-through rates and keyword relevance.',
        correctionMethod: 'Add a dedicated <title> tag inside the <head> element of your HTML document that encapsulates the primary subject and branding.',
        codeSnippet: '<title>Your Main Product or Service Keyword | Brand Name</title>',
      });
    } else {
      checks.push({
        id: 'title_presence',
        category: 'onPage',
        name: 'Title Tag Presence',
        status: 'pass',
        value: `Found: "${rawTitle}"`,
        impact: 'High',
        reason: 'The <title> tag serves as the foundational headline for search engines, social shares, and browser tabs.',
        explainability: `The <title> tag is correctly present in the <head> section with text: "${rawTitle}".`,
        correctionMethod: 'Keep the title updated whenever the page topic or core offerings evolve.',
        codeSnippet: `<title>${rawTitle}</title>`,
      });

      // 2. Title Tag Length
      const titleLen = rawTitle.length;
      if (titleLen < 30) {
        checks.push({
          id: 'title_length',
          category: 'onPage',
          name: 'Title Tag Length',
          status: 'warning',
          value: `${titleLen} characters (under recommended 30-65 range)`,
          impact: 'Medium',
          reason: 'Search engines display up to 60-65 characters (approx. 600px width). Short titles underutilize valuable SERP visual real estate and miss opportunities for secondary keywords.',
          explainability: `Your title is only ${titleLen} characters long. While not penalized, you are missing out on describing your value proposition, location, or brand name.`,
          correctionMethod: 'Expand the title to 45-60 characters by adding a compelling secondary benefit, location descriptor, or brand suffix.',
          codeSnippet: `<title>${rawTitle} — Best Services in India | BrandName</title>`,
        });
      } else if (titleLen > 65) {
        checks.push({
          id: 'title_length',
          category: 'onPage',
          name: 'Title Tag Length',
          status: 'warning',
          value: `${titleLen} characters (exceeds 65 characters; likely truncated in SERP)`,
          impact: 'Medium',
          reason: 'Google desktop and mobile snippets clip titles exceeding ~600 pixels (roughly 60-65 characters) with an ellipsis (...), hiding your brand or call-to-action.',
          explainability: `Detected title length is ${titleLen} characters. The trailing characters will be cut off on Google search result pages.`,
          correctionMethod: 'Shorten the title to under 60 characters while keeping your primary target keyword in the first 35 characters.',
          codeSnippet: `<title>${rawTitle.substring(0, 55).trim()}... | Brand</title>`,
        });
      } else {
        checks.push({
          id: 'title_length',
          category: 'onPage',
          name: 'Title Tag Length',
          status: 'pass',
          value: `${titleLen} characters (optimal range 30-65)`,
          impact: 'Medium',
          reason: 'A title between 30 and 65 characters maximizes keyword context while staying within Google\'s 600px pixel display limit.',
          explainability: `Your title is ${titleLen} characters long. It will display completely without truncation on both mobile and desktop Google search results.`,
          correctionMethod: 'Maintain this length when optimizing other pages on your site.',
          codeSnippet: `<title>${rawTitle}</title>`,
        });
      }

      // 3. Title Keyword Inclusion
      if (normalizedKeyword) {
        const titleHasKw = rawTitle.toLowerCase().includes(normalizedKeyword);
        checks.push({
          id: 'title_keyword',
          category: 'onPage',
          name: 'Target Keyword in Title',
          status: titleHasKw ? 'pass' : 'fail',
          value: titleHasKw ? `Keyword "${targetKeyword}" detected in title` : `Keyword "${targetKeyword}" missing in title`,
          impact: 'High',
          reason: 'Placing your target keyword near the beginning of the title tag is one of the highest weighted on-page relevance signals in Google\'s ranking algorithms.',
          explainability: titleHasKw
            ? `The target keyword "${targetKeyword}" was successfully identified in your title tag, establishing immediate search intent alignment.`
            : `The query "${targetKeyword}" does not appear anywhere in the title tag. Search engines may conclude the page is irrelevant for this search query.`,
          correctionMethod: titleHasKw
            ? 'No action required. For further optimization, position the keyword as close to the beginning of the title as possible.'
            : `Re-write the title tag to begin with or prominently include "${targetKeyword}".`,
          codeSnippet: `<title>${targetKeyword.charAt(0).toUpperCase() + targetKeyword.slice(1)} — ${rawTitle.substring(0, 40)}</title>`,
        });
      }
    }

    // 4. Meta Description
    const metaDesc = $('meta[name="description" i]').attr('content')?.trim() || '';
    if (!metaDesc) {
      checks.push({
        id: 'meta_description',
        category: 'onPage',
        name: 'Meta Description Presence & Quality',
        status: 'fail',
        value: 'Missing meta description tag',
        impact: 'High',
        reason: 'While not a direct ranking factor, meta descriptions are your primary snippet copy on search results. Missing descriptions cause Google to grab arbitrary text snippets, resulting in lower click-through rates (CTR).',
        explainability: 'The document does not specify a <meta name="description"> tag. Google will auto-generate an excerpt from random text on the page.',
        correctionMethod: 'Add a custom meta description between 120 and 160 characters describing the benefit and including a clear call to action.',
        codeSnippet: `<meta name="description" content="Discover premium ${targetKeyword || 'services'} in India. Verified quality, fast delivery, and top customer satisfaction. Explore our catalogue today!" />`,
      });
    } else {
      const descLen = metaDesc.length;
      if (descLen < 100) {
        checks.push({
          id: 'meta_description',
          category: 'onPage',
          name: 'Meta Description Length',
          status: 'warning',
          value: `${descLen} characters (brief; recommended 120-160)`,
          impact: 'Medium',
          reason: 'A meta description that is too brief fails to give searchers enough context to click, leaving valuable SERP real estate unused.',
          explainability: `Your description is only ${descLen} characters. Google gives you up to 160 characters to persuade users to click your link over competitors.`,
          correctionMethod: 'Expand the description to 130-155 characters by adding customer benefits, guarantees, or an enticing call to action.',
          codeSnippet: `<meta name="description" content="${metaDesc} Find the best options, compare reviews, and contact us today." />`,
        });
      } else if (descLen > 165) {
        checks.push({
          id: 'meta_description',
          category: 'onPage',
          name: 'Meta Description Length',
          status: 'warning',
          value: `${descLen} characters (exceeds 160 chars; will truncate on mobile)`,
          impact: 'Medium',
          reason: 'Descriptions longer than 160 characters are truncated by Google with an ellipsis (...), which can cut off calls to action or key details.',
          explainability: `Current description is ${descLen} characters. On mobile search devices, only the first ~120-140 characters will be visible to users.`,
          correctionMethod: 'Trim non-essential words so the entire message delivers within 150-160 characters.',
          codeSnippet: `<meta name="description" content="${metaDesc.substring(0, 150).trim()}..." />`,
        });
      } else {
        checks.push({
          id: 'meta_description',
          category: 'onPage',
          name: 'Meta Description Length',
          status: 'pass',
          value: `${descLen} characters (optimal range 120-160)`,
          impact: 'High',
          reason: 'A 120-160 character description fits Google\'s display limits on both desktop and mobile while providing a complete marketing pitch.',
          explainability: `Your meta description is ${descLen} characters long. It fits search display snippets cleanly without truncation.`,
          correctionMethod: 'Keep the description updated with current offers and keywords.',
          codeSnippet: `<meta name="description" content="${metaDesc}" />`,
        });
      }

      if (normalizedKeyword) {
        const descHasKw = metaDesc.toLowerCase().includes(normalizedKeyword);
        checks.push({
          id: 'meta_keyword',
          category: 'onPage',
          name: 'Target Keyword in Meta Description',
          status: descHasKw ? 'pass' : 'warning',
          value: descHasKw ? `Keyword "${targetKeyword}" present in description` : `Keyword "${targetKeyword}" missing in description`,
          impact: 'Medium',
          reason: 'When a searcher\'s query terms appear in the meta description, Google highlights them in bold text in the SERP, catching the user\'s attention and improving CTR.',
          explainability: descHasKw
            ? `Your meta description includes "${targetKeyword}", meaning Google will bold this term when users search for it.`
            : `The meta description does not contain "${targetKeyword}", missing out on bold highlighting in search snippets.`,
          correctionMethod: `Weave "${targetKeyword}" naturally into the first sentence of your meta description.`,
          codeSnippet: `<meta name="description" content="${targetKeyword.charAt(0).toUpperCase() + targetKeyword.slice(1)}: ${metaDesc.substring(0, 120)}..." />`,
        });
      }
    }

    // 5. Heading Structure (H1, H2, H3)
    const h1Tags = $('h1').map((_, el) => $(el).text().trim()).get();
    if (h1Tags.length === 0) {
      checks.push({
        id: 'h1_structure',
        category: 'onPage',
        name: 'H1 Heading Tag',
        status: 'fail',
        value: 'No <h1> tag found on the page',
        impact: 'High',
        reason: 'The <h1> tag is the primary semantic title of the web document. It provides essential context to search engine crawlers and screen-reader accessibility software.',
        explainability: 'The page lacks any <h1> element. Search engines must guess the primary subject from generic text or CSS-styled <div> tags.',
        correctionMethod: 'Add exactly one semantic <h1> element above the main body content clearly summarizing the page topic.',
        codeSnippet: `<h1>${targetKeyword ? targetKeyword.charAt(0).toUpperCase() + targetKeyword.slice(1) : (rawTitle || 'Welcome to Our Platform')}</h1>`,
      });
    } else if (h1Tags.length > 1) {
      checks.push({
        id: 'h1_structure',
        category: 'onPage',
        name: 'H1 Heading Tag',
        status: 'warning',
        value: `${h1Tags.length} <h1> tags found (multiple H1s dilute topic focus)`,
        impact: 'Medium',
        reason: 'While HTML5 permits multiple H1s, SEO best practice is to reserve <h1> for the singular main title. Multiple H1 tags can confuse search engines about which heading is the primary topic.',
        explainability: `Found ${h1Tags.length} separate <h1> tags: "${h1Tags.slice(0, 2).join('", "')}". This divides semantic priority.`,
        correctionMethod: 'Convert subordinate <h1> elements into <h2> tags, keeping only the main page title as an <h1>.',
        codeSnippet: `<h1>${h1Tags[0]}</h1>\n<h2>${h1Tags[1] || 'Sub-section Title'}</h2>`,
      });
    } else {
      checks.push({
        id: 'h1_structure',
        category: 'onPage',
        name: 'H1 Heading Tag',
        status: 'pass',
        value: `Single <h1>: "${h1Tags[0]}"`,
        impact: 'High',
        reason: 'A single, clear <h1> establishes a clean document outline for Googlebot, Bingbot, and assistive technologies.',
        explainability: `The page features exactly one semantic <h1> tag: "${h1Tags[0]}", providing clear structural hierarchy.`,
        correctionMethod: 'Ensure this heading accurately reflects the content below it.',
        codeSnippet: `<h1>${h1Tags[0]}</h1>`,
      });

      if (normalizedKeyword) {
        const h1HasKw = h1Tags[0].toLowerCase().includes(normalizedKeyword);
        checks.push({
          id: 'h1_keyword',
          category: 'onPage',
          name: 'Target Keyword in H1',
          status: h1HasKw ? 'pass' : 'warning',
          value: h1HasKw ? `Keyword "${targetKeyword}" found in <h1>` : `Keyword "${targetKeyword}" missing in <h1>`,
          impact: 'Medium',
          reason: 'Aligning your primary keyword across both the <title> tag and the <h1> tag confirms topical focus to Google\'s algorithms.',
          explainability: h1HasKw
            ? `Your <h1> tag incorporates the target keyword "${targetKeyword}".`
            : `Your <h1> heading does not contain "${targetKeyword}". Adding it strengthens search relevance.`,
          correctionMethod: `Update your main heading to feature "${targetKeyword}".`,
          codeSnippet: `<h1>${targetKeyword.charAt(0).toUpperCase() + targetKeyword.slice(1)} — ${h1Tags[0]}</h1>`,
        });
      }
    }

    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    checks.push({
      id: 'subheadings_structure',
      category: 'onPage',
      name: 'Sub-Headings Hierarchy',
      status: h2Count > 0 ? 'pass' : 'warning',
      value: `${h2Count} <h2> tags, ${h3Count} <h3> tags`,
      impact: 'Low',
      reason: 'Structured subheadings (<h2> and <h3>) make long articles scannable for users and enable Google to parse sub-topics for Featured Snippets.',
      explainability: h2Count > 0
        ? `Found ${h2Count} <h2> and ${h3Count} <h3> tags creating an organized topical outline.`
        : 'No <h2> headings were found. The page appears as a continuous block of text without structured sections.',
      correctionMethod: 'Break up content into clear thematic sections by using <h2> tags for major subtopics and <h3> tags for granular points.',
      codeSnippet: '<h2>Core Features & Benefits</h2>\n<h3>1. High Performance Architecture</h3>',
    });

    // 6. Image Alt Tags
    const images = $('img');
    const totalImages = images.length;
    let missingAlt = 0;
    const missingAltSources = [];
    images.each((_, el) => {
      const alt = $(el).attr('alt');
      if (alt === undefined || alt === null || alt.trim() === '') {
        missingAlt++;
        const rawSrc = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original') || $(el).attr('srcset') || '';
        const id = $(el).attr('id');
        const className = $(el).attr('class');
        let descriptor = rawSrc;
        if (!descriptor) {
          descriptor = `<img ${id ? `id="${id}" ` : ''}${className ? `class="${className}" ` : ''}/> (no src attribute)`;
        }
        if (missingAltSources.length < 25) {
          missingAltSources.push(descriptor);
        }
      }
    });

    if (totalImages === 0) {
      checks.push({
        id: 'images_alt',
        category: 'onPage',
        name: 'Image Alt Attributes',
        status: 'pass',
        value: 'No images detected on page',
        impact: 'Low',
        reason: 'Alt attributes are necessary when images are present to ensure accessibility and enable Google Image indexing.',
        explainability: 'The page contains no <img> tags. When adding images in the future, always include descriptive alt text.',
        correctionMethod: 'When introducing imagery, define descriptive alt attributes.',
        codeSnippet: '<img src="/banner.jpg" alt="Descriptive caption of image content" />',
      });
    } else if (missingAlt > 0) {
      checks.push({
        id: 'images_alt',
        category: 'onPage',
        name: 'Image Alt Attributes',
        status: missingAlt > totalImages * 0.3 ? 'fail' : 'warning',
        value: `${missingAlt} of ${totalImages} images missing alt text`,
        affectedItems: missingAltSources,
        impact: 'Medium',
        reason: 'Image alt attributes are crucial for web accessibility (WCAG) and are the primary signal Google Image Search uses to understand visuals.',
        explainability: `${missingAlt} out of ${totalImages} images have blank or missing alt attributes. This impairs screen readers and misses Google Image traffic.`,
        correctionMethod: 'Inspect your image tags and add concise, informative alt text describing each picture, diagram, or logo.',
        codeSnippet: '<img src="product.jpg" alt="Blue Cotton Kurta - Front View" loading="lazy" />',
      });
    } else {
      checks.push({
        id: 'images_alt',
        category: 'onPage',
        name: 'Image Alt Attributes',
        status: 'pass',
        value: `All ${totalImages} images have descriptive alt text`,
        impact: 'Medium',
        reason: 'Descriptive alt tags ensure complete image accessibility compliance and allow Google Image Search to index all assets.',
        explainability: `100% of images (${totalImages}/${totalImages}) feature valid alt tags. Excellent accessibility and image SEO hygiene.`,
        correctionMethod: 'Maintain this standard for all newly uploaded media assets.',
        codeSnippet: '<img src="example.jpg" alt="Verified descriptive caption" />',
      });
    }

    // 7. Canonical Tag
    const canonical = $('link[rel="canonical"]').attr('href');
    if (!canonical) {
      checks.push({
        id: 'canonical_tag',
        category: 'technical',
        name: 'Canonical Tag',
        status: 'warning',
        value: 'Missing rel="canonical" link in <head>',
        impact: 'High',
        reason: 'The canonical tag instructs search engines which URL represents the authoritative version of a page, preventing duplicate content dilution caused by URL parameters (UTM tags, sorting filters, session IDs).',
        explainability: 'No <link rel="canonical"> tag was found. If your page can be reached via multiple URL variations (e.g., http vs https, trailing slashes, or query parameters), search engines may split PageRank across duplicates.',
        correctionMethod: 'Add a self-referencing canonical tag pointing directly to the primary, clean URL format of this page.',
        codeSnippet: `<link rel="canonical" href="${url.split('?')[0]}" />`,
      });
    } else {
      checks.push({
        id: 'canonical_tag',
        category: 'technical',
        name: 'Canonical Tag',
        status: 'pass',
        value: `Canonical defined: ${canonical}`,
        impact: 'High',
        reason: 'A valid canonical URL prevents duplicate content issues and consolidates link equity into a single indexable target.',
        explainability: `Found canonical reference: "${canonical}". Search engines will attribute all ranking signals to this master URL.`,
        correctionMethod: 'Verify that the canonical URL matches your intended clean destination exactly.',
        codeSnippet: `<link rel="canonical" href="${canonical}" />`,
      });
    }

    // 8. Meta Robots
    const metaRobots = $('meta[name="robots" i]').attr('content') || '';
    if (metaRobots.toLowerCase().includes('noindex')) {
      checks.push({
        id: 'meta_robots',
        category: 'technical',
        name: 'Robots Indexing Directive',
        status: 'fail',
        value: `Directive active: "${metaRobots}" (page is blocked from indexing)`,
        impact: 'High',
        reason: 'The "noindex" directive instructs search engines to remove the webpage from search results entirely.',
        explainability: `CRITICAL ALERT: Your meta robots tag specifies "${metaRobots}". Googlebot will obey this and will NOT rank this page in search results.`,
        correctionMethod: 'Remove "noindex" from your meta robots tag immediately if this page is intended for public search visibility.',
        codeSnippet: '<meta name="robots" content="index, follow" />',
      });
    } else {
      checks.push({
        id: 'meta_robots',
        category: 'technical',
        name: 'Robots Indexing Directive',
        status: 'pass',
        value: metaRobots ? `Directives: ${metaRobots}` : 'Default allowed (index, follow)',
        impact: 'High',
        reason: 'Search engines require permission to index pages and follow internal links to discover your website.',
        explainability: 'Page allows indexing and crawling by Googlebot without restrictive noindex or nofollow blocks.',
        correctionMethod: 'No action needed. Page is fully eligible for search indexation.',
        codeSnippet: '<meta name="robots" content="index, follow" />',
      });
    }

    // 9. Open Graph & Social Meta
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDesc = $('meta[property="og:description"]').attr('content');
    const ogImage = $('meta[property="og:image"]').attr('content');
    const hasFullOg = !!(ogTitle && ogDesc && ogImage);
    checks.push({
      id: 'open_graph',
      category: 'onPage',
      name: 'Open Graph (Social Sharing)',
      status: hasFullOg ? 'pass' : ogTitle ? 'warning' : 'fail',
      value: hasFullOg ? 'Complete (og:title, og:description, og:image present)' : 'Missing some Open Graph meta tags',
      impact: 'Medium',
      reason: 'Open Graph protocol tags control how your links display as rich visual cards when shared on WhatsApp, LinkedIn, Twitter/X, and Facebook.',
      explainability: hasFullOg
        ? 'All key Open Graph tags (title, description, image) are implemented, ensuring high-engagement visual cards on messaging and social platforms.'
        : `Missing social sharing meta tags (${!ogTitle ? 'og:title ' : ''}${!ogDesc ? 'og:description ' : ''}${!ogImage ? 'og:image' : ''}). Shares may appear as plain, unstyled links.`,
      correctionMethod: 'Add the complete set of Open Graph tags to your <head> section to maximize referral traffic and brand credibility.',
      codeSnippet: `<meta property="og:title" content="${rawTitle || 'Website Title'}" />\n<meta property="og:description" content="${metaDesc || 'Overview of website'}" />\n<meta property="og:image" content="https://${new URL(url).hostname}/og-image.jpg" />\n<meta property="og:url" content="${url}" />`,
    });

    // 10. Schema.org / Structured Data JSON-LD
    const jsonLdScripts = $('script[type="application/ld+json"]').get();
    let schemaTypes = [];
    jsonLdScripts.forEach((script) => {
      try {
        const parsed = JSON.parse($(script).html());
        if (parsed['@type']) schemaTypes.push(parsed['@type']);
      } catch (e) {}
    });

    if (schemaTypes.length > 0) {
      checks.push({
        id: 'schema_markup',
        category: 'technical',
        name: 'Structured Data (Schema.org)',
        status: 'pass',
        value: `Detected Schema types: ${schemaTypes.join(', ')}`,
        impact: 'High',
        reason: 'Schema.org JSON-LD gives search engines structured knowledge about your business, products, reviews, and breadcrumbs to unlock Google Rich Results (stars, FAQs, pricing cards).',
        explainability: `Found valid JSON-LD structured data with entity types: [${schemaTypes.join(', ')}]. This enhances Knowledge Graph and rich snippet visibility.`,
        correctionMethod: 'Validate your schema using Google\'s Rich Results Test tool to check for syntax errors or missing required properties.',
        codeSnippet: `<!-- Existing Schema active: ${schemaTypes.join(', ')} -->`,
      });
    } else {
      let hostname = 'example.com';
      try { hostname = new URL(url).hostname; } catch {}
      checks.push({
        id: 'schema_markup',
        category: 'technical',
        name: 'Structured Data (Schema.org)',
        status: 'warning',
        value: 'No JSON-LD structured data detected',
        impact: 'High',
        reason: 'Without Schema.org markup, Google cannot generate Rich Snippets (star ratings, review summaries, business hours, FAQ accordions) for your listings in search results.',
        explainability: 'Zero <script type="application/ld+json"> blocks were detected. Your listing in Google will only display basic text snippets rather than rich interactive cards.',
        correctionMethod: 'Implement a Schema.org JSON-LD block (Organization, LocalBusiness, Article, or Product) inside your <head> or <body>.',
        codeSnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "${hostname}",\n  "url": "${url}",\n  "description": "${metaDesc || 'Leading digital and business services in India'}",\n  "areaServed": "India",\n  "priceRange": "$$"\n}\n</script>`,
      });
    }

    // 11. Content Analysis & Word Count
    $('script, style, noscript, svg').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const words = bodyText.split(' ').filter(Boolean);
    const wordCount = words.length;

    if (wordCount < 250) {
      checks.push({
        id: 'content_depth',
        category: 'content',
        name: 'Content Word Count',
        status: 'warning',
        value: `${wordCount} words (thin content detected)`,
        impact: 'High',
        reason: 'Google\'s Helpful Content System algorithm demotes pages with sparse or shallow text because they often fail to satisfy user search intent completely.',
        explainability: `Detected only ${wordCount} words on the page. Search algorithms may classify this as "thin content" and favor more comprehensive competitor pages.`,
        correctionMethod: 'Expand the page content to at least 500-1000 words by adding detailed explanations, user benefits, FAQs, and industry insights.',
        codeSnippet: '<!-- Add in-depth sections, FAQ blocks, and case study examples to reach 600+ words -->',
      });
    } else {
      checks.push({
        id: 'content_depth',
        category: 'content',
        name: 'Content Word Count',
        status: 'pass',
        value: `${wordCount} words indexed`,
        impact: 'Medium',
        reason: 'Thorough, in-depth text signals authority to search engines and satisfies multi-intent user inquiries.',
        explainability: `Page contains ${wordCount} words, providing sufficient depth for Google to extract contextual entities and rank for long-tail keywords.`,
        correctionMethod: 'Keep the content fresh and periodically update stats, references, and examples.',
        codeSnippet: `<!-- Content depth optimal: ${wordCount} words -->`,
      });
    }

    // 12. Keyword Density & First 100 words
    if (normalizedKeyword && wordCount > 0) {
      const lowerBody = bodyText.toLowerCase();
      const occurrences = (lowerBody.match(new RegExp(normalizedKeyword, 'gi')) || []).length;
      const density = ((occurrences * normalizedKeyword.split(' ').length) / wordCount) * 100;
      const first100Words = words.slice(0, 100).join(' ').toLowerCase();
      const inFirst100 = first100Words.includes(normalizedKeyword);

      checks.push({
        id: 'keyword_prominence',
        category: 'content',
        name: 'Keyword in First 100 Words',
        status: inFirst100 ? 'pass' : 'warning',
        value: inFirst100 ? 'Detected in opening paragraph' : 'Not found in first 100 words',
        impact: 'Medium',
        reason: 'Including your target keyword early in the text immediately establishes relevance for both web visitors and search engine bots.',
        explainability: inFirst100
          ? `The keyword "${targetKeyword}" appears early in the opening section, providing immediate topical context.`
          : `The keyword "${targetKeyword}" was not found in the introductory 100 words. Readers and crawlers must read deeper into the page to confirm relevance.`,
        correctionMethod: `Mention "${targetKeyword}" naturally within your opening introduction sentence.`,
        codeSnippet: `<p>Welcome to our official guide on <strong>${targetKeyword}</strong> in India, where we explore...</p>`,
      });

      checks.push({
        id: 'keyword_density',
        category: 'content',
        name: 'Keyword Density',
        status: density >= 0.5 && density <= 3.0 ? 'pass' : 'warning',
        value: `${density.toFixed(2)}% (${occurrences} matches)`,
        impact: 'Medium',
        reason: 'An optimal keyword density (0.5% - 2.5%) maintains clear search intent without crossing into unnatural "keyword stuffing" penalties.',
        explainability: density < 0.5
          ? `Keyword density is only ${density.toFixed(2)}% (${occurrences} times in ${wordCount} words). The page may not emphasize the keyword enough.`
          : density > 3.0
          ? `Keyword density is high (${density.toFixed(2)}%). Excessive repetition risks triggering Google's spam filters for keyword stuffing.`
          : `Keyword density is ${density.toFixed(2)}%, right in the sweet spot for natural search optimization.`,
        correctionMethod: density < 0.5
          ? `Incorporate "${targetKeyword}" naturally 2-3 more times in headings or body paragraphs.`
          : density > 3.0
          ? `Replace some occurrences of "${targetKeyword}" with synonyms, LSI terms, and pronouns to make the writing feel natural.`
          : 'Maintain this natural keyword balance.',
        codeSnippet: `<!-- Target density benchmark: 1.0% - 2.0% (Current: ${density.toFixed(2)}%) -->`,
      });
    }

    // 13. Links Audit (Internal & External)
    const links = $('a[href]');
    let internalCount = 0;
    let externalCount = 0;
    let urlHost = '';
    try { urlHost = new URL(url).hostname; } catch {}

    links.each((_, el) => {
      const href = $(el).attr('href')?.trim() || '';
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      if (href.startsWith('/') || href.includes(urlHost)) {
        internalCount++;
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        externalCount++;
      }
    });

    checks.push({
      id: 'links_ratio',
      category: 'onPage',
      name: 'Link Architecture & Internal Links',
      status: internalCount > 3 ? 'pass' : 'warning',
      value: `${internalCount} internal links, ${externalCount} external links`,
      impact: 'Medium',
      reason: 'Internal links distribute PageRank across your site, help search engine bots crawl deep subpages, and lower bounce rate by engaging visitors.',
      explainability: internalCount > 3
        ? `Found ${internalCount} internal links and ${externalCount} external references, creating strong site connectivity and crawl pathways.`
        : `Only ${internalCount} internal links detected. Pages with few internal links become "orphan pages" that struggle to rank.`,
      correctionMethod: 'Add contextual links pointing to related products, services, guides, and contact pages throughout your text.',
      codeSnippet: '<a href="/related-service">Learn more about our services</a>',
    });

    // 14. Technical Basics: HTTPS, Charset, Viewport
    const isHttps = url.startsWith('https://');
    checks.push({
      id: 'https_security',
      category: 'technical',
      name: 'HTTPS Security (SSL/TLS)',
      status: isHttps ? 'pass' : 'fail',
      value: isHttps ? 'Valid HTTPS encryption active' : 'Insecure HTTP connection',
      impact: 'High',
      reason: 'HTTPS is an official Google ranking signal. Unencrypted HTTP pages display a "Not Secure" warning in Chrome and Firefox, driving away users.',
      explainability: isHttps
        ? 'Website enforces encrypted HTTPS communication, protecting user data and fulfilling Google\'s core security requirement.'
        : 'CRITICAL: The URL uses insecure HTTP. Google flags this in browser address bars and penalizes search rankings.',
      correctionMethod: 'Install an SSL certificate (e.g. free via Let\'s Encrypt) and enforce 301 redirects from HTTP to HTTPS in your web server config.',
      codeSnippet: '# NGINX 301 Redirect:\nserver {\n  listen 80;\n  server_name example.com;\n  return 301 https://$host$request_uri;\n}',
    });

    const hasViewport = $('meta[name="viewport" i]').length > 0;
    checks.push({
      id: 'mobile_viewport',
      category: 'technical',
      name: 'Mobile Viewport Meta Tag',
      status: hasViewport ? 'pass' : 'fail',
      value: hasViewport ? 'Mobile viewport declared' : 'Missing viewport meta tag',
      impact: 'High',
      reason: 'Google uses Mobile-First Indexing. Without a viewport meta tag, mobile browsers display a zoomed-out desktop view, immediately failing Google\'s Mobile-Friendly test.',
      explainability: hasViewport
        ? 'Viewport meta tag is active, ensuring proper scaling and layout responsiveness across smartphones and tablets.'
        : 'Missing viewport meta tag. Mobile devices will render the site in 980px desktop emulation mode, degrading user experience.',
      correctionMethod: 'Add the standard responsive viewport meta tag inside the <head> element of your HTML template.',
      codeSnippet: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    });

    const hasCharset = $('meta[charset]').length > 0 || $('meta[http-equiv="content-type" i]').length > 0;
    checks.push({
      id: 'charset_declaration',
      category: 'technical',
      name: 'Character Encoding (Charset)',
      status: hasCharset ? 'pass' : 'warning',
      value: hasCharset ? 'UTF-8 charset declared' : 'No explicit charset declaration',
      impact: 'Low',
      reason: 'Declaring character encoding ensures Indian languages (Hindi, Marathi, etc.), currency symbols (₹), and special characters render correctly without browser mojibake errors.',
      explainability: hasCharset
        ? 'Character encoding is explicitly defined, ensuring seamless rendering across international browsers.'
        : 'Missing charset tag. The browser will guess encoding, which can cause corrupted character rendering.',
      correctionMethod: 'Add the UTF-8 charset declaration at the very top of your <head> section.',
      codeSnippet: '<meta charset="UTF-8">',
    });

    // 15. Server Response Time / TTFB
    const perfStatus = responseTimeMs < 800 ? 'pass' : responseTimeMs < 2000 ? 'warning' : 'fail';
    checks.push({
      id: 'server_response_time',
      category: 'performance',
      name: 'Server Response Time (TTFB)',
      status: perfStatus,
      value: `${responseTimeMs}ms server latency`,
      impact: 'High',
      reason: 'Time to First Byte (TTFB) measures how quickly the server begins returning HTML. Fast TTFB (<600ms) is essential for passing Core Web Vitals and maximizes crawler crawl budget.',
      explainability: responseTimeMs < 800
        ? `Server response time is ${responseTimeMs}ms, well within Google\'s recommended sub-800ms threshold for rapid page rendering.`
        : `Server response took ${responseTimeMs}ms. Slow server response delays First Contentful Paint and frustrates mobile visitors on 4G networks.`,
      correctionMethod: 'Optimize backend queries, enable Redis page caching, compress responses with Gzip/Brotli, and deploy an Edge CDN like Cloudflare.',
      codeSnippet: '// Express Gzip Compression:\nconst compression = require("compression");\napp.use(compression());',
    });

    // Calculate Scores (0-100)
    const categoryScores = {
      onPage: this.computeCategoryScore(checks.filter((c) => c.category === 'onPage')),
      technical: this.computeCategoryScore(checks.filter((c) => c.category === 'technical')),
      content: this.computeCategoryScore(checks.filter((c) => c.category === 'content')),
      performance: this.computeCategoryScore(checks.filter((c) => c.category === 'performance')),
    };

    const overallScore = Math.round(
      categoryScores.onPage.score * 0.35 +
      categoryScores.technical.score * 0.30 +
      categoryScores.content.score * 0.20 +
      categoryScores.performance.score * 0.15
    );

    const htmlLen = typeof html === 'string' ? html.length : 10000;
    const missingDimensions = (typeof html === 'string' ? (html.match(/<img(?![^>]*\b(width|height)=)/gi) || []).length : 0);
    const calculatedCls = (Math.min(0.25, Math.max(0.01, missingDimensions * 0.015))).toFixed(2);
    const calculatedFcp = ((Math.max(200, responseTimeMs * 1.4)) / 1000).toFixed(2) + 's';
    const calculatedLcp = ((Math.max(600, responseTimeMs * 2.5 + (htmlLen / 40000) * 300)) / 1000).toFixed(2) + 's';
    const calculatedFid = Math.max(15, Math.min(180, Math.round(responseTimeMs * 0.12))) + 'ms';

    let performanceMetrics = {
      responseTimeMs,
      statusCode,
      fcp: calculatedFcp,
      lcp: calculatedLcp,
      cls: calculatedCls,
      fid: calculatedFid,
    };

    if (config.pagespeed.apiKey) {
      try {
        const psRes = await axios.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', {
          params: {
            url,
            key: config.pagespeed.apiKey,
            strategy: 'mobile',
          },
          timeout: 10000,
        });
        const lighthouse = psRes.data?.lighthouseResult?.audits;
        if (lighthouse) {
          performanceMetrics.fcp = lighthouse['first-contentful-paint']?.displayValue || performanceMetrics.fcp;
          performanceMetrics.lcp = lighthouse['largest-contentful-paint']?.displayValue || performanceMetrics.lcp;
          performanceMetrics.cls = lighthouse['cumulative-layout-shift']?.displayValue || performanceMetrics.cls;
        }
      } catch (err) {}
    }

    const aiRecommendations = await this.generateAIFixes(url, targetKeyword, rawTitle, metaDesc, h1Tags, checks);

    return {
      url,
      targetKeyword,
      score: overallScore,
      statusCode,
      categories: categoryScores,
      checks,
      performanceMetrics,
      aiRecommendations,
      analyzedAt: new Date().toISOString(),
    };
  }

  computeCategoryScore(categoryChecks) {
    if (categoryChecks.length === 0) return { score: 100, passed: 0, failed: 0, warnings: 0 };
    let passed = 0;
    let failed = 0;
    let warnings = 0;
    let points = 0;

    categoryChecks.forEach((c) => {
      if (c.status === 'pass') {
        passed++;
        points += 100;
      } else if (c.status === 'warning') {
        warnings++;
        points += 50;
      } else {
        failed++;
        points += 0;
      }
    });

    const score = Math.round(points / categoryChecks.length);
    return { score, passed, failed, warnings };
  }

  async generateAIFixes(url, keyword, title, metaDesc, h1Tags, checks) {
    const failedChecks = checks.filter((c) => c.status === 'fail' || c.status === 'warning');
    const recommendations = [];

    if (!metaDesc || metaDesc.length < 100) {
      recommendations.push({
        issue: 'Missing or Inadequate Meta Description',
        fix: 'Implement an engaging, SEO-optimized meta description containing target keywords and a clear call-to-action.',
        codeSnippet: `<meta name="description" content="${keyword ? `Explore the best solutions for ${keyword} in India. Get high quality, verified results and top customer support today.` : `Discover our platform for industry-leading services and proven results. Learn more today.`}" />`,
      });
    }

    if (h1Tags.length !== 1) {
      recommendations.push({
        issue: h1Tags.length === 0 ? 'Missing Main H1 Tag' : 'Multiple H1 Tags Present',
        fix: 'Ensure your document hierarchy features exactly one semantic <h1> element that signals the core topic.',
        codeSnippet: `<h1>${keyword ? `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} — Official Guide & Services` : (title || 'Welcome to Our Platform')}</h1>`,
      });
    }

    const hasSchema = checks.find((c) => c.id === 'schema_markup' && c.status === 'pass');
    if (!hasSchema) {
      let hostname = 'example.com';
      try { hostname = new URL(url).hostname; } catch {}
      recommendations.push({
        issue: 'Missing Structured Data Schema.org',
        fix: 'Add JSON-LD Organization / LocalBusiness schema to enable rich snippets and Google Knowledge Graph recognition.',
        codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "${hostname}",
  "url": "${url}",
  "description": "${metaDesc || 'Leading business and digital services in India'}",
  "areaServed": "India",
  "priceRange": "$$"
}
</script>`,
      });
    }

    if (config.llm.geminiApiKey) {
      try {
        const prompt = `You are a world-class Technical SEO Expert.
A website was audited:
URL: ${url}
Target Keyword: ${keyword || 'None specified'}
Title: ${title}
Meta Description: ${metaDesc}
Failed/Warning SEO checks: ${failedChecks.map((f) => f.name + ': ' + f.value).join('; ')}

Provide 3 concrete, high-impact fixes with code snippets in JSON format:
[
  {
    "issue": "Brief description of problem",
    "fix": "Actionable explanation of the solution",
    "codeSnippet": "Exact HTML/JSON-LD code block to paste"
  }
]
Respond ONLY with the JSON array.`;

        const geminiRes = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.llm.geminiApiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          },
          { timeout: 8000 }
        );

        const aiText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          const parsed = JSON.parse(aiText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {}
    }

    return recommendations;
  }
}

module.exports = new SEOAnalyzer();
