import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { 
      url: 'https://www.autovidriosvf.com',
      lastModified: '2025-01-09',
      changeFrequency: 'daily',
      priority: 1.0 
    },
    {
      url: 'https://www.autovidriosvf.com/mejores-vidrios-del-mercado',
      lastModified: '2025-04-16',
      changeFrequency: 'never',
      priority: 1.0
    },
    { 
      url: 'https://www.autovidriosvf.com/contacto',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://www.autovidriosvf.com/servicios-productos/instalacion-pelicula-antirobo',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://www.autovidriosvf.com/servicios-productos/instalacion-sunroof',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://www.autovidriosvf.com/servicios-productos/instalacion-vidrios-blindados',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://www.autovidriosvf.com/servicios-productos/polarizados',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://www.autovidriosvf.com/servicios-productos/vidrios-para-vehiculo',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://www.autovidriosvf.com/sobre-nosotros',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    }
  ]
}
