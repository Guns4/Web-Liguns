import { MetadataRoute } from 'next';
import { getActiveVenues } from '@/lib/venues';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ligunsentertainment.agency';

    // Get all active venues (jobs) for dynamic routes
    const venues = await getActiveVenues();

    const jobRoutes = venues.map((venue) => ({
        url: `${baseUrl}/lowongan/${venue.slug || venue.id}`,
        lastModified: new Date(venue.updated_at || venue.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/lowongan`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/register`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
    ];

    return [...staticRoutes, ...jobRoutes];
}
