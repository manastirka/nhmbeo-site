// Curated hero image per inner page. Pulled from the pool of nhmbeo.rs
// images we've already scraped — chosen so each page's banner thematically
// matches its subject. Unmapped pages fall back to the soft-gradient header.

const NHM = 'https://nhmbeo.rs/wp-content/uploads';

export const pageHeroes: Record<string, string> = {
  // Visit Us
  'visit-section': `${NHM}/2021/04/prirodnjacki-muyej.jpg`,
  galerija: 'https://upload.wikimedia.org/wikipedia/commons/2/28/KalemegdanGalery.JPG',
  'izlozba-u-galeriji': `${NHM}/2026/03/655223022_18385450078094058_269805532308419901_n.jpg`,
  ulaznice: `${NHM}/2025/09/Kolaz-1.jpg`,
  prodavnica: `${NHM}/2025/09/Prednja-i-zadnja-strana-14.jpg`,

  // About
  'about-section': `${NHM}/2021/04/nhmbeozgrada.jpg`,
  'organizaciona-struktura': `${NHM}/2021/04/nhmbeozgrada.jpg`,
  godisnjak: `${NHM}/2021/04/Godisnjak-2017.jpg`,

  // Explore
  'explore-section': `${NHM}/2021/04/Vodeni-vecernjak-Myotis-daubentonii-photo-Milan-Paunovic-scaled-1.jpg`,
  'centar-za-markiranje-zivotinja': `${NHM}/2021/04/Buteo-buteo-photo-Milivoj-Vucanovic.jpg`,
  bulletin: `${NHM}/2021/04/galerijanhmbeo.jpg`,
  glasnik: `${NHM}/2021/04/galerijanhmbeo.jpg`,
  'posebna-izdanja': `${NHM}/2025/09/Kolaz-2.png`,

  // News
  vesti: `${NHM}/2026/03/655223022_18385450078094058_269805532308419901_n.jpg`,
};

export function heroFor(slug: string): string | undefined {
  return pageHeroes[slug];
}
