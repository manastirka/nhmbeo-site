// Curated hero image per inner page. All assets are now hosted on our
// own server (public/uploads/), so paths are local. Easy to swap a
// specific page's hero by editing a single line below.

export const pageHeroes: Record<string, string> = {
  // Visit Us
  'visit-section': '/uploads/wp-content-uploads-2021-04-prirodnjacki-muyej.jpg',
  galerija: '/uploads/wm-wikipedia-commons-2-28-KalemegdanGalery.JPG',
  'izlozba-u-galeriji': '/uploads/wp-content-uploads-2026-03-655223022_18385450078094058_269805532308419901_n.jpg',
  ulaznice: '/uploads/wp-content-uploads-2025-09-Kolaz-1.jpg',
  prodavnica: '/uploads/wp-content-uploads-2025-09-Prednja-i-zadnja-strana-14.jpg',

  // About
  'about-section': '/uploads/wp-content-uploads-2021-04-nhmbeozgrada.jpg',
  'organizaciona-struktura': '/uploads/wp-content-uploads-2021-04-nhmbeozgrada.jpg',
  godisnjak: '/uploads/wp-content-uploads-2021-04-Godisnjak-2017.jpg',

  // Explore
  'explore-section': '/uploads/wp-content-uploads-2021-04-Vodeni-vecernjak-Myotis-daubentonii-photo-Milan-Paunovic-scaled-1.jpg',
  'centar-za-markiranje-zivotinja': '/uploads/wp-content-uploads-2021-04-Buteo-buteo-photo-Milivoj-Vucanovic.jpg',
  bulletin: '/uploads/wp-content-uploads-2021-04-galerijanhmbeo.jpg',
  glasnik: '/uploads/wp-content-uploads-2021-04-galerijanhmbeo.jpg',
  'posebna-izdanja': '/uploads/wp-content-uploads-2025-09-Kolaz-2.png',

  // News
  vesti: '/uploads/wp-content-uploads-2026-03-655223022_18385450078094058_269805532308419901_n.jpg',
};

export function heroFor(slug: string): string | undefined {
  return pageHeroes[slug];
}
