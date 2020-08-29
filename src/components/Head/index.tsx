import React, { ReactElement } from "react";
import Helmet from "react-helmet";
import useSiteMeta from "../../hooks/useSiteMeta";

interface HeadProps {
  pageTitle: string;
  pageDescription: string;
  pathName: string;
  bodyCssClass?: string;
  pageType: string;
  image?: string;
}

export default ({
  pageTitle,
  pageDescription,
  pageType,
  pathName,
  bodyCssClass,
  image
}: HeadProps): ReactElement => {
  const siteMeta = useSiteMeta();
  const imageMetaContent = image ? image : `https://www.gravitysimulator.org/images/scenarios/${pageTitle}.png`;

  return (
    <Helmet>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=UA-153406767-1"
      ></script>
      <script>{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-153406767-1');
      `}</script>
      <html lang={siteMeta.lang} />

      <title>{`${siteMeta.title} | ${
        pageType !== "simulator" ? `${pageTitle} Scenarios` : pageTitle
      }`}</title>

      <meta name="description" content={pageDescription} />
      <meta name="author" content={siteMeta.author} />
      <meta property="og:title" content={`${siteMeta.title} | ${pageTitle}`} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`https://gravitysimulator.org${pathName}`}
      />
      <meta property="og:description" content={pageDescription} />
      <meta
        property="og:image"
        content={imageMetaContent}
      />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@SpaceGravitySim" />
      <meta name="twitter:title" content={`${siteMeta.title} | ${pageTitle}`} />
      <meta name="twitter:description" content={pageDescription} />
      <meta
        name="twitter:image"
        content={imageMetaContent}
      />

      {pageType === "main" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebSite",
            name: "Gravity Simulator",
            url: "https://gravitysimulator.org",
            image,
            description: pageDescription
          })}
        </script>
      )}
      
      {pageType === "category" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebPage",
            name: `${pageTitle} Scenarios`,
            image,
            description: pageDescription
          })}
        </script>
      )}

      {pageType === "simulator" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "SoftwareApplication",
            applicationCategory: "GameApplication",
            applicationSubCategory: "Science",
            name: pageTitle,
            image: `https://www.gravitysimulator.org/images/scenarios/${pageTitle}.png`,
            description: pageDescription,
            about: {
              "@type": "Thing",
              description: "gravity, simulation, space"
            },
            creator: {
              "@type": "Person",
              name: "Darrell Huffman & contributors",
              url: "https://github.com/TheHappyKoala/Harmony-of-the-Spheres"
            },
            url: `https://gravitysimulator.org${pathName}`,
            operatingSystem: "All"
          })}
        </script>
      )}

      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      
      <body className={bodyCssClass ? bodyCssClass : ""} />
    </Helmet>
  );
};
