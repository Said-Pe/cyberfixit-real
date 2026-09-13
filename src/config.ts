// Datos centrales del negocio y configuración del sitio
export const WHATSAPP_NUMBER = '50764984403'; // Formato internacional sin "+" (Panamá 6498-4403)
export const DEFAULT_WHATSAPP_MSG = 'Hola CyberFix-It, quiero cotizar la reparación de un equipo';

export const getWhatsAppUrl = (customMessage?: string) => {
  const msg = customMessage || DEFAULT_WHATSAPP_MSG;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export const WHATSAPP_URL = getWhatsAppUrl();

export const SITE = {
  name: 'CyberFix-It',
  legalName: 'CyberFix-It Tech Solutions',
  url: 'https://cyberfixit.com',
  tagline: 'Soporte técnico y reparación especializada de tecnología',
  phoneDisplay: '+507 6498-4403',
  phoneRaw: '+50764984403',
  email: 'cyberfixit9@gmail.com',
  address: 'Tocumen, La siesta',
  city: 'Ciudad de Panamá',
  country: 'Panamá',
  countryCode: 'PA',
  hours: 'Lun. a Sáb. · 8:00 a.m. – 7:00 p.m.',
  geo: {
    latitude: 9.079655,
    longitude: -79.359806,
  },
  mapsUrl: 'https://maps.google.com/?cid=16470042809519118065',
  wazeUrl: 'https://waze.com/ul?ll=9.079655,-79.359159&navigate=yes',
  seo: {
    defaultTitle: 'CyberFix-It | Reparación de Computadoras, Laptops, Consolas y Celulares',
    defaultDescription: 'Taller especializado en reparación de PC Gamer, laptops, consolas PS5/Xbox y celulares. Diagnóstico sin costo en 24h, repuestos certificados y garantía por escrito.',
    keywords: [
      'reparación de computadoras',
      'reparación de laptops',
      'mantenimiento pc gamer',
      'reparación consolas ps5 xbox',
      'arreglo de celulares pantalla batería',
      'soporte técnico computación',
      'cambio de pasta térmica líquida',
      'recuperación de datos disco duro',
      'cyberfix-it'
    ].join(', '),
  }
};
