import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'website', jsonLd }) => {
  const siteName = 'Talentyra';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Find Your Dream Job`;
  const desc = description || 'Discover thousands of jobs from top companies worldwide.';
  const ogImage = image || '/og-image.png';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
