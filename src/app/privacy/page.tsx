import MarketingLayout from '@/components/MarketingLayout';

export const metadata = { title: 'Kebijakan Privasi · Nexus Task' };

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <article className="max-w-2xl mx-auto py-10 text-sm text-zinc-400 leading-relaxed">
        <h1 className="text-2xl font-extrabold text-white mb-2">Kebijakan Privasi</h1>
        <p className="text-zinc-600 text-xs mb-8">Proyek eksperimental — kebijakan ringkas.</p>

        <h2 className="text-white font-bold text-base mt-6 mb-2">Data yang disimpan</h2>
        <p>Nexus Task adalah proyek eksperimental. Data board (papan, kartu, dll.) saat ini disimpan di browser kamu (localStorage). Login menggunakan Firebase Authentication — informasi akun (nama, email) dikelola oleh layanan Google sesuai kebijakan mereka.</p>

        <h2 className="text-white font-bold text-base mt-6 mb-2">Penggunaan</h2>
        <p>Kami tidak menjual atau membagikan data kamu. Karena ini proyek eksperimental, jangan menyimpan data sensitif atau penting di sini.</p>

        <h2 className="text-white font-bold text-base mt-6 mb-2">Kontak</h2>
        <p>Pertanyaan? Email <a href="mailto:support@nexustask.app" className="text-[#AAFF00] hover:underline">support@nexustask.app</a>.</p>
      </article>
    </MarketingLayout>
  );
}
