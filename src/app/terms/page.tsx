import MarketingLayout from '@/components/MarketingLayout';

export const metadata = { title: 'Syarat & Ketentuan · Nexus Task' };

export default function TermsPage() {
  return (
    <MarketingLayout>
      <article className="max-w-2xl mx-auto py-10 text-sm text-zinc-400 leading-relaxed">
        <h1 className="text-2xl font-extrabold text-white mb-2">Syarat &amp; Ketentuan</h1>
        <p className="text-zinc-600 text-xs mb-8">Proyek eksperimental — ketentuan ringkas.</p>

        <h2 className="text-white font-bold text-base mt-6 mb-2">Penggunaan layanan</h2>
        <p>Nexus Task disediakan &quot;apa adanya&quot; sebagai proyek eksperimental, tanpa jaminan ketersediaan atau keamanan untuk penggunaan produksi. Fitur dapat berubah atau dihentikan sewaktu-waktu.</p>

        <h2 className="text-white font-bold text-base mt-6 mb-2">Tanggung jawab</h2>
        <p>Kamu bertanggung jawab atas data yang kamu masukkan. Hindari menyimpan informasi sensitif. Kami tidak bertanggung jawab atas kehilangan data.</p>

        <h2 className="text-white font-bold text-base mt-6 mb-2">Akun</h2>
        <p>Login menggunakan akun Google via Firebase. Jaga keamanan akun kamu sendiri.</p>
      </article>
    </MarketingLayout>
  );
}
