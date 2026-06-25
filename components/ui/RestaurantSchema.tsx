const SITE_URL = "https://restaurace-u-maxe.vercel.app";

const schema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${SITE_URL}/#restaurant`,
  name: "Restaurace U Maxe",
  url: SITE_URL,
  description:
    "Restaurace U Maxe v Jindřichově Hradci. Poctivá česká kuchyně. Polední menu a obědy s sebou, objednávky online do 10:00. Otevřeno Po–Pá 10:00–13:30.",
  servesCuisine: ["Czech"],
  priceRange: "$$",
  telephone: "+420728814736",
  email: "Objednavkyumaxe@seznam.cz",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Denisova 20/II",
    postalCode: "377 01",
    addressLocality: "Jindřichův Hradec",
    addressCountry: "CZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 49.145364845662876,
    longitude: 15.009206771139327,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "13:30",
    },
  ],
  menu: `${SITE_URL}/menu`,
  potentialAction: {
    "@type": "OrderAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://umaxe.sebou.cz",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    deliveryMethod: ["http://purl.org/goodrelations/v1#DeliveryModePickUp"],
  },
  sameAs: [
    "https://www.facebook.com/UMaxeJH/",
    "https://www.instagram.com/umaxerestaurace/",
  ],
};

export default function RestaurantSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
