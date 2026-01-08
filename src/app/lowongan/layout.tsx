import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lowongan Kerja',
    description: 'Temukan lowongan kerja terbaik di industri hiburan malam. Ladies karaoke, terapis spa, hostess, dan entertainer.',
};

export default function LowonganLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
