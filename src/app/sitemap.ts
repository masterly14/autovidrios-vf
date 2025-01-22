import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { 
      url: 'https://autovidriosvf.com/',
      lastModified: '2025-01-09',
      changeFrequency: 'daily',
      priority: 1.0 
    },
    { 
      url: 'https://autovidriosvf.com/contacto',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://autovidriosvf.com/servicios-productos/instalacion-pelicula-antirobo',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://autovidriosvf.com/servicios-productos/instalacion-sunroof',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://autovidriosvf.com/servicios-productos/instalacion-vidrios-blindados',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://autovidriosvf.com/servicios-productos/polarizados',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://autovidriosvf.com/servicios-productos/vidrios-para-vehiculo',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    { 
      url: 'https://autovidriosvf.com/sobre-nosotros',
      lastModified: '2025-01-22',
      changeFrequency: 'monthly',
      priority: 0.8 
    }
  ]
}