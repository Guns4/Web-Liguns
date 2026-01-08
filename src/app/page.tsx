import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Star, ShieldCheck, Banknote } from "lucide-react"

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">

            {/* Background Glow Effect (Abstrak) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-500/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container px-4 z-10 text-center space-y-8 animate-fade-in">

                {/* Badge Premium */}
                <Badge variant="outline" className="border-gold-500/50 text-gold-400 px-4 py-1 text-sm uppercase tracking-widest bg-gold-500/10">
                    Liguns Entertainment
                </Badge>

                {/* Headline Mewah */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Bangun Karier <br />
                    <span className="text-gold-gradient">Premium & Berkelas</span>
                </h1>

                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Agency penyalur tenaga kerja hiburan malam terpercaya di Indonesia.
                    Jaminan keamanan, fasilitas mess, dan penghasilan harian transparan.
                </p>

                {/* Tombol CTA */}
                <div className="flex gap-4 justify-center pt-4">
                    <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 h-12 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        Lamar Sekarang
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 border-white/20 hover:bg-white/5">
                        <Play className="w-4 h-4 mr-2" /> Tonton Profil
                    </Button>
                </div>

                {/* Grid Kartu Fitur (Glassmorphism) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
                    {[
                        { icon: Banknote, title: "Gaji Harian", desc: "Voucher cair setiap hari tanpa potongan tersembunyi." },
                        { icon: ShieldCheck, title: "Jaminan Keamanan", desc: "Perlindungan penuh dan privasi data terjamin." },
                        { icon: Star, title: "Fasilitas Mewah", desc: "Mess gratis, makeup artist, dan transportasi." },
                    ].map((item, idx) => (
                        <Card key={idx} className="glass border-white/5 hover:border-gold-500/50 transition-all duration-300">
                            <CardContent className="p-6">
                                <item.icon className="w-10 h-10 text-gold-400 mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    )
}
