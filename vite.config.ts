import { defineConfig, loadEnv, type Plugin } from 'vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, '')
}

function seoPlugin(siteUrl: string): Plugin {
  const normalizedUrl = normalizeSiteUrl(siteUrl)

  return {
    name: 'kihannama-seo',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', normalizedUrl)
    },
    closeBundle() {
      const distDir = resolve(process.cwd(), 'dist')
      const sitemapPath = resolve(distDir, 'sitemap.xml')
      const sitemapTemplate = readFileSync(resolve(process.cwd(), 'public/sitemap.xml'), 'utf-8')
      writeFileSync(sitemapPath, sitemapTemplate.replaceAll('__SITE_URL__', normalizedUrl))

      const robotsPath = resolve(distDir, 'robots.txt')
      const robots = readFileSync(resolve(process.cwd(), 'public/robots.txt'), 'utf-8')
      writeFileSync(
        robotsPath,
        robots.replace('Sitemap: /sitemap.xml', `Sitemap: ${normalizedUrl}/sitemap.xml`),
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL || 'http://localhost:5173')

  return {
    plugins: [react(), cesium(), seoPlugin(siteUrl)],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('cesium') || id.includes('resium')) {
                return 'cesium-vendor'
              }
              if (id.includes('@mui') || id.includes('@emotion')) {
                return 'mui-vendor'
              }
            }
          },
        },
      },
    },
  }
})
