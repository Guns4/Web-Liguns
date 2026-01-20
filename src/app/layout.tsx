import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
    weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
    title: {
        default: 'Loker Hiburan Malam Bandung - Agency LC & Terapis Spa Terpercaya',
        template: '%s | Liguns Entertainment',
    },
    description:
        'Pusat info lowongan kerja hiburan malam di Bandung khusus wanita. Gaji tinggi, aman, & profesional. Loker LC (Pemandu Lagu) & Terapis Spa. Gabung sekarang!',
    keywords: [
        'loker hiburan malam bandung',
        'lowongan kerja lc bandung',
        'loker pemandu lagu bandung',
        'lowongan terapis spa bandung',
        'loker wanita bandung',
        'kerja malam gaji besar',
        'agency lc terpercaya',
        'liguns entertainment',
        'nightlife jobs indonesia',
    ],
    authors: [{ name: 'Liguns Entertainment' }],
    creator: 'Liguns Entertainment',
    publisher: 'Liguns Entertainment',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: 'Loker Hiburan Malam Bandung - Gaji Tinggi & Aman',
        description:
            'Info lowongan kerja terbaru untuk LC & Terapis Spa di Bandung. Agency resmi & profesional khusus wanita. Daftar gratis sekarang!',
        url: 'https://ligunsentertainment.agency',
        siteName: 'Liguns Entertainment',
        locale: 'id_ID',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Loker Hiburan Malam Bandung - Liguns Entertainment',
        description:
            'Lowongan kerja LC & Spa Therapist di Bandung. Gaji besar, aman, & fasilitas lengkap.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" className="dark">
            <head>
                {/* Google Fonts CDN Backup */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                {/* Google Analytics - Replace with your ID */}
                {process.env.NEXT_PUBLIC_GA_ID && (
                    <>
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                        />
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
                            }}
                        />
                    </>
                )}
            </head>
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
                <AuthProvider>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
