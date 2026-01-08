import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Daftar Anggota Baru',
    description: 'Bergabunglah dengan Liguns Entertain dan dapatkan akses ke lowongan kerja premium dengan benefit menarik.',
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
