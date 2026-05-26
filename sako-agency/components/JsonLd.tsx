export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "SAKO Agency",
    description:
      "Bespoke digital experiences — Web, UI/UX, SEO, and AI automation — for brands that refuse to be average.",
    url: "https://sako.agency",
    founder: { "@type": "Person", name: "Sako" },
    areaServed: "Worldwide",
    availableLanguage: ["English"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@sako.agency",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
