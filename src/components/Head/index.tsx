import React, { ReactElement } from "react";
import Helmet from "react-helmet";
import useSiteMeta from "../../hooks/useSiteMeta";

interface HeadProps {
  pageTitle: string;
  pageDescription: string;
  pathName: string;
  bodyCssClass: string;
}

export default ({
  pageTitle,
  pageDescription,
  pathName,
  bodyCssClass,
  image
}: HeadProps): ReactElement => {
  const siteMeta = useSiteMeta();

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
      <title>{`${siteMeta.title} | ${pageTitle}`}</title>
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
        content={
          image
            ? image
            : `https://www.gravitysimulator.org/images/scenarios/${pageTitle}.png`
        }
      />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@SpaceGravitySim" />
      <meta name="twitter:title" content={`${siteMeta.title} | ${pageTitle}`} />
      <meta name="twitter:description" content={pageDescription} />
      <meta
        name="twitter:image"
        content={
          image
            ? image
            : `https://www.gravitysimulator.org/images/scenarios/${pageTitle}.png`
        }
      />

      {!image && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "SoftwareApplication",
            browserRequirements: "Requires HTML5 support",
            "applicationCategory": "GameApplication",
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
