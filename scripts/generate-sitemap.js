import { globby } from 'globby'            // Para buscar archivos

async function generate() {
  // Busca todos los archivos que deben incluirse en el sitemap
  const pages = await globby([
    'app/**/*.tsx',            
    '!app/**/_*.tsx',            
    '!app/**/layout.tsx',        
    '!app/api/**',               
  ])

  // Procesa cada página encontrada:
  pages.map((page) => {
    const path = page
      .replace('app', '')
      .replace('/page.tsx', '')
      .replace('/index.tsx', '')
    
    const route = path === '' ? '' : path

    // Genera la entrada XML para esta URL
    return `
      <url>
        <loc>https://autovidriosvf.com${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>
    `
  })
}