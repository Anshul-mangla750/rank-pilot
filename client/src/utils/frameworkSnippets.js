/**
 * Framework-Specific Code Fix Generator
 * Generates copy-paste code snippets for:
 * - Next.js (App Router Metadata)
 * - React Helmet (react-helmet-async)
 * - HTML5 (<head>)
 * - WordPress PHP (functions.php hooks)
 */

export function getFrameworkCodeSnippet(check, framework = 'nextjs', customTitle, customDesc, customUrl) {
  const url = customUrl || check.url || 'https://example.com';
  const title = customTitle || (check.id === 'title_presence' || check.id === 'title_length' ? check.value : 'Optimized Webpage Title | Brand');
  const desc = customDesc || 'High CTR meta description describing products, services, and core value proposition in India.';

  switch (check.id) {
    case 'canonical_tag':
    case 'canonical':
      if (framework === 'nextjs') {
        return `// app/layout.tsx or app/page.tsx
export const metadata = {
  metadataBase: new URL('${url}'),
  alternates: {
    canonical: '/',
  },
};`;
      }
      if (framework === 'react') {
        return `import { Helmet } from 'react-helmet-async';

export function MetaTags() {
  return (
    <Helmet>
      <link rel="canonical" href="${url}" />
    </Helmet>
  );
}`;
      }
      if (framework === 'wordpress') {
        return `// Add to your child theme's functions.php
add_action('wp_head', function() {
    if (is_singular()) {
        echo '<link rel="canonical" href="' . esc_url(get_permalink()) . '" />' . "\\n";
    }
});`;
      }
      return `<link rel="canonical" href="${url}" />`;

    case 'title_presence':
    case 'title_length':
    case 'title_keyword':
      if (framework === 'nextjs') {
        return `// app/page.tsx
export const metadata = {
  title: '${title.replace(/"/g, '\\"')}',
  description: '${desc.replace(/"/g, '\\"')}',
};`;
      }
      if (framework === 'react') {
        return `import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>${title}</title>
</Helmet>`;
      }
      if (framework === 'wordpress') {
        return `// In functions.php or SEO filter hook
add_filter('pre_get_document_title', function($title) {
    if (is_front_page()) {
        return '${title}';
    }
    return $title;
}, 99);`;
      }
      return `<title>${title}</title>`;

    case 'meta_description':
    case 'meta_description_length':
      if (framework === 'nextjs') {
        return `// app/page.tsx
export const metadata = {
  description: '${desc.replace(/"/g, '\\"')}',
};`;
      }
      if (framework === 'react') {
        return `import { Helmet } from 'react-helmet-async';

<Helmet>
  <meta name="description" content="${desc}" />
</Helmet>`;
      }
      if (framework === 'wordpress') {
        return `add_action('wp_head', function() {
    echo '<meta name="description" content="${desc}" />' . "\\n";
});`;
      }
      return `<meta name="description" content="${desc}" />`;

    case 'images_alt':
      if (framework === 'nextjs') {
        return `import Image from 'next/image';

<Image
  src="/products/sample-catalog.jpg"
  alt="Descriptive keyword-rich image label"
  width={600}
  height={400}
  loading="lazy"
/>`;
      }
      if (framework === 'react') {
        return `<img
  src="/products/sample-catalog.jpg"
  alt="Descriptive keyword-rich image label"
  loading="lazy"
/>`;
      }
      if (framework === 'wordpress') {
        return `// Ensure alt attribute is retrieved from media library
<?php 
$image_id = get_post_thumbnail_id();
$alt_text = get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: 'Default Product Description';
the_post_thumbnail('medium', ['alt' => esc_attr($alt_text)]); 
?>`;
      }
      return `<img src="/images/catalog.jpg" alt="Descriptive product keyword label" loading="lazy" />`;

    case 'schema_markup':
    case 'schema':
      const jsonLd = `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "RankPilot Monitored Site",
  "url": "${url}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "${url}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`;
      if (framework === 'nextjs') {
        return `// app/page.tsx
const jsonLd = ${jsonLd};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>{/* Page Content */}</main>
    </>
  );
}`;
      }
      if (framework === 'react') {
        return `import { Helmet } from 'react-helmet-async';

const jsonLd = ${jsonLd};

<Helmet>
  <script type="application/ld+json">
    {JSON.stringify(jsonLd)}
  </script>
</Helmet>`;
      }
      if (framework === 'wordpress') {
        return `add_action('wp_head', function() {
    ?>
    <script type="application/ld+json">
    ${jsonLd}
    </script>
    <?php
});`;
      }
      return `<script type="application/ld+json">
${jsonLd}
</script>`;

    default:
      if (check.codeSnippet) {
        if (framework === 'nextjs' && !check.codeSnippet.includes('export const metadata')) {
          return `// Next.js App Router Component / Script
${check.codeSnippet}`;
        }
        if (framework === 'wordpress') {
          return `// Add to functions.php
add_action('wp_head', function() {
    echo '${check.codeSnippet.replace(/'/g, "\\'")}' . "\\n";
});`;
        }
        return check.codeSnippet;
      }
      return `<meta name="robots" content="index, follow" />`;
  }
}
