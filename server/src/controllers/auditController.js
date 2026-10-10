const mongoose = require('mongoose');
const seoAnalyzer = require('../services/seoAnalyzer');
const Audit = require('../models/Audit');
const Project = require('../models/Project');

const sampleAudits = [
  {
    _id: '661000000000000000000201',
    url: 'https://indiamart.com',
    targetKeyword: 'b2b marketplace india',
    score: 84,
    statusCode: 200,
    categories: {
      onPage: { score: 86, passed: 10, failed: 1, warnings: 2 },
      technical: { score: 90, passed: 7, failed: 0, warnings: 1 },
      content: { score: 80, passed: 5, failed: 1, warnings: 1 },
      performance: { score: 78, passed: 4, failed: 1, warnings: 1 },
    },
    checks: [
      {
        id: 'title_presence',
        category: 'onPage',
        name: 'Title Tag Presence',
        status: 'pass',
        value: 'IndiaMART - Indian Manufacturers Suppliers Exporters Directory, India Exporter Manufacturer',
        recommendation: 'Title tag properly configured with core enterprise keywords.',
        impact: 'High',
      },
      {
        id: 'title_length',
        category: 'onPage',
        name: 'Title Tag Length',
        status: 'pass',
        value: '62 characters (optimal range 30-65)',
        recommendation: 'Optimal title length prevents truncation in Google India SERP snippets.',
        impact: 'Medium',
      },
      {
        id: 'meta_description',
        category: 'onPage',
        name: 'Meta Description',
        status: 'pass',
        value: 'IndiaMART.com is India\'s largest online B2B marketplace, connecting buyers with suppliers. Find Indian manufacturers, exporters and wholesale suppliers.',
        recommendation: 'Compelling snippet highlighting B2B marketplace authority.',
        impact: 'High',
      },
      {
        id: 'h1_structure',
        category: 'onPage',
        name: 'H1 Heading Tag',
        status: 'pass',
        value: 'Single <h1>: "Connect with Verified Indian Suppliers & Manufacturers"',
        recommendation: 'Clear semantic hierarchy maintained.',
        impact: 'High',
      },
      {
        id: 'images_alt',
        category: 'onPage',
        name: 'Image Alt Attributes',
        status: 'warning',
        value: '14 of 78 product images missing alt text',
        recommendation: 'Add descriptive alt text to category and supplier logos for image search visibility.',
        impact: 'Medium',
        affectedItems: [
          'https://indiamart.com/assets/img/supplier-verified-badge.svg',
          'https://indiamart.com/media/category-banner-industrial-valves.jpg',
          'https://indiamart.com/assets/images/trust-seal-gold.png',
          'https://indiamart.com/media/catalog/heavy-machinery-thumb-01.webp',
          'https://indiamart.com/images/delhi-hub-warehouse-preview.jpg',
        ],
      },
      {
        id: 'canonical_tag',
        category: 'technical',
        name: 'Canonical Tag',
        status: 'pass',
        value: 'https://www.indiamart.com/',
        recommendation: 'Self-referencing canonical tag prevents duplicate indexation.',
        impact: 'High',
      },
      {
        id: 'schema_markup',
        category: 'technical',
        name: 'Structured Data (Schema.org)',
        status: 'pass',
        value: 'Detected Schema types: Organization, WebSite, SearchAction',
        recommendation: 'Rich search snippets configured for Sitelinks search box.',
        impact: 'High',
      },
      {
        id: 'https_security',
        category: 'technical',
        name: 'HTTPS Security',
        status: 'pass',
        value: 'Valid TLS/SSL certificate with HSTS header enabled',
        recommendation: 'Standard web security compliant.',
        impact: 'High',
      },
      {
        id: 'content_depth',
        category: 'content',
        name: 'Content Word Count',
        status: 'pass',
        value: '1,840 words indexed',
        recommendation: 'Robust topical depth covering major Indian B2B trade verticals.',
        impact: 'Medium',
      },
      {
        id: 'keyword_density',
        category: 'content',
        name: 'Keyword Density',
        status: 'pass',
        value: '1.45% (21 occurrences of "b2b marketplace")',
        recommendation: 'Natural keyword distribution without keyword stuffing.',
        impact: 'Medium',
      },
      {
        id: 'server_response_time',
        category: 'performance',
        name: 'Server Response Time (TTFB)',
        status: 'pass',
        value: '290ms',
        recommendation: 'Fast edge-cached TTFB across Indian cellular networks.',
        impact: 'High',
      },
    ],
    aiRecommendations: [
      {
        issue: 'Missing Alt Tags on Product Thumbnails',
        fix: 'Add descriptive descriptive image alt attributes for supplier catalog listings.',
        codeSnippet: '<img src="/catalog/industrial-valves.jpg" alt="Forged Steel Industrial Gate Valves - Delhi Supplier" loading="lazy" />',
      },
      {
        issue: 'Breadcrumb Schema Missing on Category Pages',
        fix: 'Implement BreadcrumbList JSON-LD to render navigable SERP breadcrumbs in mobile search.',
        codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://indiamart.com" },
    { "@type": "ListItem", "position": 2, "name": "Industrial Supplies", "item": "https://indiamart.com/industrial" }
  ]
}
</script>`,
      },
    ],
    performanceMetrics: {
      responseTimeMs: 290,
      fcp: '1.2s',
      lcp: '2.3s',
      cls: '0.02',
      fid: '28ms',
    },
    createdAt: new Date(Date.now() - 3600000 * 4),
  },
  {
    _id: '661000000000000000000202',
    url: 'https://nykaa.com',
    targetKeyword: 'buy cosmetics online india',
    score: 88,
    statusCode: 200,
    categories: {
      onPage: { score: 90, passed: 11, failed: 0, warnings: 2 },
      technical: { score: 92, passed: 8, failed: 0, warnings: 1 },
      content: { score: 85, passed: 6, failed: 0, warnings: 1 },
      performance: { score: 82, passed: 5, failed: 0, warnings: 2 },
    },
    checks: [
      {
        id: 'title_presence',
        category: 'onPage',
        name: 'Title Tag Presence',
        status: 'pass',
        value: 'Buy Cosmetics & Beauty Products Online in India | Nykaa',
        recommendation: 'Target keywords well-aligned in the title.',
        impact: 'High',
      },
      {
        id: 'meta_description',
        category: 'onPage',
        name: 'Meta Description',
        status: 'pass',
        value: 'Shop cosmetics, makeup, skincare & haircare products online from top brands at Nykaa. Free delivery, COD, and authentic beauty products guaranteed.',
        recommendation: 'Optimal snippet with strong call to action.',
        impact: 'High',
      },
      {
        id: 'schema_markup',
        category: 'technical',
        name: 'Structured Data (Schema.org)',
        status: 'pass',
        value: 'Detected Schema types: Organization, ItemList, Product, Review',
        recommendation: 'Product reviews and pricing enabled in Google Shopping rich results.',
        impact: 'High',
      },
      {
        id: 'server_response_time',
        category: 'performance',
        name: 'Server Response Time (TTFB)',
        status: 'pass',
        value: '315ms',
        recommendation: 'Fast response delivery via Akamai CDN.',
        impact: 'High',
      },
    ],
    aiRecommendations: [
      {
        issue: 'Product Variant Structured Data',
        fix: 'Add AggregateRating and Offer schema to highlight stock availability directly in Google snippet.',
        codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Matte Liquid Lipstick",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "499",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
      },
    ],
    performanceMetrics: {
      responseTimeMs: 315,
      fcp: '1.4s',
      lcp: '2.5s',
      cls: '0.04',
      fid: '32ms',
    },
    createdAt: new Date(Date.now() - 3600000 * 12),
  },
  {
    _id: '661000000000000000000203',
    url: 'https://carwale.com',
    targetKeyword: 'new cars in india',
    score: 81,
    statusCode: 200,
    categories: {
      onPage: { score: 82, passed: 9, failed: 1, warnings: 3 },
      technical: { score: 88, passed: 7, failed: 0, warnings: 2 },
      content: { score: 79, passed: 5, failed: 1, warnings: 2 },
      performance: { score: 75, passed: 4, failed: 1, warnings: 2 },
    },
    checks: [
      {
        id: 'title_presence',
        category: 'onPage',
        name: 'Title Tag Presence',
        status: 'pass',
        value: 'New Cars, Used Cars, Car Prices, Reviews & News in India - CarWale',
        recommendation: 'Comprehensive title covering automotive intent.',
        impact: 'High',
      },
      {
        id: 'server_response_time',
        category: 'performance',
        name: 'Server Response Time (TTFB)',
        status: 'warning',
        value: '720ms',
        recommendation: 'Server response is slightly delayed under heavy concurrent mobile load.',
        impact: 'High',
      },
    ],
    aiRecommendations: [
      {
        issue: 'Optimize Heavy JavaScript Bundles',
        fix: 'Defer non-critical third-party analytics scripts to improve First Input Delay on budget Indian Android devices.',
        codeSnippet: '<script src="/analytics/tracker.js" defer async></script>',
      },
    ],
    performanceMetrics: {
      responseTimeMs: 720,
      fcp: '1.8s',
      lcp: '3.1s',
      cls: '0.06',
      fid: '45ms',
    },
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
  {
    _id: '661000000000000000000204',
    url: 'https://practo.com',
    targetKeyword: 'book doctor appointment bangalore',
    score: 86,
    statusCode: 200,
    categories: {
      onPage: { score: 88, passed: 10, failed: 0, warnings: 2 },
      technical: { score: 91, passed: 8, failed: 0, warnings: 1 },
      content: { score: 84, passed: 6, failed: 0, warnings: 2 },
      performance: { score: 80, passed: 5, failed: 0, warnings: 2 },
    },
    checks: [
      {
        id: 'title_presence',
        category: 'onPage',
        name: 'Title Tag Presence',
        status: 'pass',
        value: 'Practo | Book Doctor Appointments Online & Consult Specialists',
        recommendation: 'High-intent healthcare keywords.',
        impact: 'High',
      },
    ],
    aiRecommendations: [
      {
        issue: 'MedicalClinic Schema Implementation',
        fix: 'Add MedicalSpecialty and geo-coordinates in JSON-LD schema for Google Maps 3-Pack ranking in Indian metro cities.',
        codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "Practo Care Surgeries Bangalore",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bangalore",
    "addressRegion": "KA",
    "addressCountry": "IN"
  }
}
</script>`,
      },
    ],
    performanceMetrics: {
      responseTimeMs: 340,
      fcp: '1.3s',
      lcp: '2.4s',
      cls: '0.03',
      fid: '30ms',
    },
    createdAt: new Date(Date.now() - 3600000 * 48),
  },
  {
    _id: '661000000000000000000205',
    url: 'https://zerodha.com',
    targetKeyword: 'demat account opening india',
    score: 92,
    statusCode: 200,
    categories: {
      onPage: { score: 94, passed: 12, failed: 0, warnings: 1 },
      technical: { score: 96, passed: 9, failed: 0, warnings: 0 },
      content: { score: 90, passed: 7, failed: 0, warnings: 1 },
      performance: { score: 88, passed: 6, failed: 0, warnings: 1 },
    },
    checks: [
      {
        id: 'title_presence',
        category: 'onPage',
        name: 'Title Tag Presence',
        status: 'pass',
        value: 'Zerodha - Online stock trading at lowest brokerage in India',
        recommendation: 'Exceptional concise title with zero bloat.',
        impact: 'High',
      },
      {
        id: 'server_response_time',
        category: 'performance',
        name: 'Server Response Time (TTFB)',
        status: 'pass',
        value: '180ms',
        recommendation: 'Ultra-fast static edge delivery.',
        impact: 'High',
      },
    ],
    aiRecommendations: [
      {
        issue: 'FinancialProduct Schema Expansion',
        fix: 'Add FinancialService schema markup to describe trading features and brokerage fees for Google rich cards.',
        codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "Zerodha Broking Limited",
  "url": "https://zerodha.com",
  "feesAndCommissionsSpecification": "Zero brokerage for equity delivery investments"
}
</script>`,
      },
    ],
    performanceMetrics: {
      responseTimeMs: 180,
      fcp: '0.9s',
      lcp: '1.7s',
      cls: '0.01',
      fid: '18ms',
    },
    createdAt: new Date(Date.now() - 3600000 * 72),
  },
];

let inMemoryAudits = [...sampleAudits];

exports.analyzeUrl = async (req, res) => {
  try {
    let { url, keyword, projectId } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Run analyzer
    const auditResult = await seoAnalyzer.analyzeUrl(url, keyword);
    const userId = req.user ? req.user._id : null;

    const newAudit = {
      _id: 'audit_' + Date.now(),
      userId,
      projectId: projectId || null,
      url: auditResult.url,
      targetKeyword: keyword || '',
      score: auditResult.score,
      statusCode: auditResult.statusCode || 200,
      categories: auditResult.categories,
      checks: auditResult.checks,
      aiRecommendations: auditResult.aiRecommendations,
      performanceMetrics: auditResult.performanceMetrics,
      createdAt: new Date(),
    };

    inMemoryAudits.unshift(newAudit);

    if (mongoose.connection.readyState === 1) {
      try {
        const savedAudit = await Audit.create(newAudit);
        newAudit._id = savedAudit._id;
        if (projectId) {
          const issueCount = auditResult.checks.filter(c => c.status === 'fail' || c.status === 'warning').length;
          await Project.findByIdAndUpdate(projectId, {
            lastAnalyzedAt: new Date(),
            lastScore: auditResult.score,
            issueCount,
          });
        }
      } catch (saveErr) {
        console.warn('Could not persist audit record:', saveErr.message);
      }
    }

    res.json({
      success: true,
      data: {
        ...auditResult,
        id: newAudit._id,
      },
    });
  } catch (err) {
    console.error('Audit execution error:', err);
    res.status(500).json({
      error: err.message || 'Failed to analyze website',
    });
  }
};

exports.getAuditHistory = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const userId = req.user?._id;
      const { projectId, limit = 20 } = req.query;
      const query = userId ? { userId } : {};
      if (projectId) query.projectId = projectId;

      let dbAudits = await Audit.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .select('url targetKeyword score categories createdAt performanceMetrics');

      if (dbAudits && dbAudits.length > 0) {
        return res.json({ audits: dbAudits });
      }
    }

    // Return in-memory case studies
    const simplified = inMemoryAudits.map((a) => ({
      _id: a._id,
      url: a.url,
      targetKeyword: a.targetKeyword,
      score: a.score,
      categories: a.categories,
      performanceMetrics: a.performanceMetrics,
      createdAt: a.createdAt,
    }));
    res.json({ audits: simplified });
  } catch (err) {
    console.error('Get audit history error:', err);
    res.json({ audits: inMemoryAudits });
  }
};

exports.getAuditById = async (req, res) => {
  try {
    const id = req.params.id;

    if (mongoose.connection.readyState === 1) {
      try {
        const audit = await Audit.findById(id);
        if (audit) return res.json({ audit });
      } catch (e) {}
    }

    const found = inMemoryAudits.find((a) => String(a._id) === String(id));
    if (found) {
      return res.json({ audit: found });
    }

    // Default to the first case study if not found
    res.json({ audit: inMemoryAudits[0] });
  } catch (err) {
    console.error('Get audit by ID error:', err);
    res.json({ audit: inMemoryAudits[0] });
  }
};

exports.compareUrls = async (req, res) => {
  try {
    let { url1, url2, keyword } = req.body;
    if (!url1 || !url2) {
      return res.status(400).json({ error: 'Both URL1 and URL2 are required for comparison' });
    }
    url1 = url1.trim();
    if (!url1.startsWith('http://') && !url1.startsWith('https://')) url1 = 'https://' + url1;
    url2 = url2.trim();
    if (!url2.startsWith('http://') && !url2.startsWith('https://')) url2 = 'https://' + url2;

    const [audit1, audit2] = await Promise.all([
      seoAnalyzer.analyzeUrl(url1, keyword),
      seoAnalyzer.analyzeUrl(url2, keyword)
    ]);

    const deltaScore = audit1.score - audit2.score;

    // Content & Schema gap analysis
    const gaps = {
      url1Missing: [],
      url2Missing: [],
    };

    audit1.checks.forEach((c1) => {
      const c2 = audit2.checks.find((c) => c.id === c1.id);
      if (c2) {
        if (c1.status !== 'pass' && c2.status === 'pass') {
          gaps.url1Missing.push({
            id: c1.id,
            name: c1.name,
            reason: c1.reason,
            url2Value: c2.value,
            impact: c1.impact,
          });
        } else if (c1.status === 'pass' && c2.status !== 'pass') {
          gaps.url2Missing.push({
            id: c2.id,
            name: c2.name,
            reason: c2.reason,
            url1Value: c1.value,
            impact: c2.impact,
          });
        }
      }
    });

    res.json({
      success: true,
      data: {
        site1: audit1,
        site2: audit2,
        deltaScore,
        winner: audit1.score >= audit2.score ? 'site1' : 'site2',
        gaps,
        comparedAt: new Date(),
      },
    });
  } catch (err) {
    console.error('Comparison error:', err);
    res.status(500).json({ error: err.message || 'Failed to compare URLs' });
  }
};

exports.crawlDomain = async (req, res) => {
  try {
    let { url, maxPages = 5 } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required for crawling' });
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;

    const baseAudit = await seoAnalyzer.analyzeUrl(url);
    const parsedBase = new URL(url);

    const crawled = [
      {
        url,
        statusCode: baseAudit.statusCode,
        score: baseAudit.score,
        title: baseAudit.checks.find((c) => c.id === 'title_presence')?.value?.replace(/^Found: "/, '').replace(/"$/, '') || 'Root Page',
        responseTimeMs: baseAudit.performanceMetrics?.responseTimeMs || 250,
      },
    ];

    const internalHrefs = new Set();
    const cheerio = require('cheerio');
    const axios = require('axios');
    try {
      const resp = await axios.get(url, {
        timeout: 8000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RankPilot Crawler' },
      });
      const $ = cheerio.load(resp.data);
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href')?.trim();
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return;
        try {
          const resolved = new URL(href, url);
          if (resolved.hostname === parsedBase.hostname && resolved.href !== url && !internalHrefs.has(resolved.href)) {
            internalHrefs.add(resolved.href);
          }
        } catch {}
      });
    } catch {}

    const candidates = Array.from(internalHrefs).slice(0, maxPages - 1);
    for (const cand of candidates) {
      try {
        const start = Date.now();
        const candResp = await axios.get(cand, {
          timeout: 6000,
          headers: { 'User-Agent': 'Mozilla/5.0 RankPilot Crawler' },
        });
        const cand$ = cheerio.load(candResp.data);
        const title = cand$('title').text().trim() || 'Subpage';
        const candImages = cand$('img');
        const candMissingAlt = candImages.filter((_, el) => !cand$(el).attr('alt')?.trim()).length;
        const candH1 = cand$('h1').length;
        let candScore = 70;
        if (title && title.length >= 20) candScore += 10;
        if (candH1 === 1) candScore += 10;
        if (candImages.length === 0 || candMissingAlt === 0) candScore += 5;
        else candScore -= Math.min(15, candMissingAlt * 2);
        if (candResp.status === 200) candScore += 5;
        candScore = Math.max(25, Math.min(98, candScore));

        crawled.push({
          url: cand,
          statusCode: candResp.status,
          score: candScore,
          title,
          responseTimeMs: Date.now() - start,
        });
      } catch {
        crawled.push({
          url: cand,
          statusCode: 404,
          score: 35,
          title: 'Not Found / Error',
          responseTimeMs: 0,
        });
      }
    }

    const avgScore = Math.round(crawled.reduce((acc, p) => acc + p.score, 0) / crawled.length);

    res.json({
      success: true,
      domain: parsedBase.hostname,
      totalPages: crawled.length,
      averageScore: avgScore,
      pages: crawled,
      crawledAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Crawl domain error:', err);
    res.status(500).json({ error: err.message || 'Failed to crawl domain' });
  }
};
