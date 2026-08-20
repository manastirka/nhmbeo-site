export type NavItem = {
  key: string;
  href: string;
  children?: NavItem[];
};

export const nav: NavItem[] = [
  { key: 'home', href: '/' },
  {
    key: 'visit',
    href: '/posetite-nas',
    children: [
      { key: 'visit_gallery', href: '/posetite-nas/galerija' },
      { key: 'visit_exhibition', href: '/posetite-nas/izlozba-u-galeriji' },
      { key: 'visit_tickets', href: '/posetite-nas/ulaznice' },
      { key: 'visit_shop', href: '/posetite-nas/prodavnica' },
    ],
  },
  {
    key: 'about',
    href: '/o-muzeju',
    children: [
      { key: 'about_org', href: '/o-muzeju/organizaciona-struktura' },
      { key: 'about_annual', href: '/o-muzeju/godisnjak' },
      { key: 'about_documents', href: '/o-muzeju/dokumenti' },
    ],
  },
  {
    key: 'explore',
    href: '/istrazite',
    children: [
      { key: 'explore_marking', href: '/istrazite/centar-za-markiranje-zivotinja' },
      { key: 'explore_bulletin', href: '/istrazite/bulletin' },
      { key: 'explore_glasnik', href: '/istrazite/glasnik' },
      { key: 'explore_special', href: '/istrazite/posebna-izdanja' },
    ],
  },
  { key: 'news', href: '/vesti' },
  { key: 'contact', href: '/kontakt' },
];

export const socialLinks = [
  { key: 'facebook', href: 'https://www.facebook.com/prirodnjacki' },
  { key: 'instagram', href: 'https://www.instagram.com/prirodnjackimuzej/' },
  { key: 'youtube', href: 'https://www.youtube.com/channel/UCt-Krr-mGjKyhzHfMblaT_A' },
];
