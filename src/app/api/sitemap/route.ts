// app/api/sitemap/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  // Lista de URLs estáticas de tu sitio
  const pages = [
    { url: 'https://autovidriosvf.com/', lastmod: '2025-01-09', changefreq: 'daily', priority: 1.0 },
    { url: 'https://autovidriosvf.com/contacto', lastmod: '2025-01-09', changefreq: 'monthly', priority: 0.8 },
    { url: 'https://autovidriosvf.com/instalacion-pelicula-antirobo', lastmod: '2025-01-09', changefreq: 'monthly', priority: 0.8 },
    { url: 'https://autovidriosvf.com/instalacion-sunroof', lastmod: '2025-01-09', changefreq: 'monthly', priority: 0.8 },
    { url: 'https://autovidriosvf.com/instalacion-vidrios-blindados', lastmod: '2025-01-09', changefreq: 'monthly', priority: 0.8 },
    { url: 'https://autovidriosvf.com/polarizados', lastmod: '2025-01-09', changefreq: 'monthly', priority: 0.8 },
    { url: 'https://autovidriosvf.com/vidrios-para-vehiculo', lastmod: '2025-01-09', changefreq: 'monthly', priority: 0.8 },
    { url: 'https://autovidriosvf.com/sobre-nosotros', lastmod: '2025-01-09', changefreq: 'monthly', priority: 0.8 }
  ];

  // Crear el contenido XML del sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          return `
            <url>
              <loc>${page.url}</loc>
              <lastmod>${page.lastmod}</lastmod>
              <changefreq>${page.changefreq}</changefreq>
              <priority>${page.priority}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>`;

  // Responder con el sitemap XML
  return NextResponse.json(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
