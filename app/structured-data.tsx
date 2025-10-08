'use client';

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://gamehub.example.com/#website",
        "url": "https://gamehub.example.com/",
        "name": "GameHub",
        "description": "Play original neon arcade reinterpretations of maze runners, paddle duels, color matching puzzles and more.",
        "publisher": {
          "@id": "https://gamehub.example.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://gamehub.example.com/games?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "ko-KR"
      },
      {
        "@type": "Organization",
        "@id": "https://gamehub.example.com/#organization",
        "name": "GameHub",
        "url": "https://gamehub.example.com/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "ko-KR",
          "@id": "https://gamehub.example.com/#/schema/logo/image/",
          "url": "https://gamehub.example.com/opengraph-image",
          "contentUrl": "https://gamehub.example.com/opengraph-image",
          "width": 1200,
          "height": 630,
          "caption": "GameHub"
        },
        "sameAs": [
          "https://github.com/devlikebear/gamehub"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://gamehub.example.com/#webpage",
        "url": "https://gamehub.example.com/",
        "name": "GameHub - Retro Arcade Games",
        "isPartOf": {
          "@id": "https://gamehub.example.com/#website"
        },
        "about": {
          "@id": "https://gamehub.example.com/#organization"
        },
        "description": "Play original neon arcade reinterpretations of maze runners, paddle duels, color matching puzzles and more. Free browser-based retro games with 100% original IP.",
        "inLanguage": "ko-KR"
      },
      {
        "@type": "VideoGame",
        "name": "GameHub Arcade Collection",
        "description": "A collection of 8 original neon-themed arcade games playable in browser",
        "genre": ["Arcade", "Action", "Puzzle"],
        "playMode": "SinglePlayer",
        "applicationCategory": "Game",
        "operatingSystem": "Any (Browser-based)",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "gamePlatform": ["Web Browser"],
        "inLanguage": ["ko-KR", "en-US"]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
