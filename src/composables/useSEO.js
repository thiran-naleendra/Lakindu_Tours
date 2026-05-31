import { watchEffect } from 'vue'

export function useSEO({ title, description, image, url }) {
    const defaultTitle = 'Lakdinu Tours - Sri Lanka & Maldives Travel Expert'
    const defaultDescription = 'Discover the best of Sri Lanka and Maldives with Lakdinu Tours. Custom tailor-made tours, luxury packages, and unforgettable experiences.'
    const defaultImage = 'https://lakdinutours.com/og-image.jpg' // Replace with actual default image URL
    const siteUrl = 'https://lakdinutours.com'

    watchEffect(() => {
        // Title
        const pageTitle = title?.value ? `${title.value} | Lakdinu Tours` : defaultTitle
        document.title = pageTitle

        // Helper to set meta tag
        const setMeta = (name, content) => {
            let element = document.querySelector(`meta[name="${name}"]`)
            if (!element) {
                element = document.createElement('meta')
                element.setAttribute('name', name)
                document.head.appendChild(element)
            }
            element.setAttribute('content', content)
        }

        // Helper to set OG tag
        const setOg = (property, content) => {
            let element = document.querySelector(`meta[property="${property}"]`)
            if (!element) {
                element = document.createElement('meta')
                element.setAttribute('property', property)
                document.head.appendChild(element)
            }
            element.setAttribute('content', content)
        }

        // Description
        const pageDescription = description?.value || defaultDescription
        setMeta('description', pageDescription)

        // Open Graph
        setOg('og:title', pageTitle)
        setOg('og:description', pageDescription)
        setOg('og:image', image?.value || defaultImage)
        setOg('og:url', url?.value || window.location.href)
        setOg('og:type', 'website')
        setOg('og:site_name', 'Lakdinu Tours')

        // Twitter Card (optional but good for SEO)
        setMeta('twitter:card', 'summary_large_image')
        setMeta('twitter:title', pageTitle)
        setMeta('twitter:description', pageDescription)
        setMeta('twitter:image', image?.value || defaultImage)
    })
}
