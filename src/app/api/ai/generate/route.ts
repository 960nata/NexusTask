import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, description, type } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let responseText = '';
    let apiUsed = '';
    let isSimulated = false;

    // 1. Try Groq API first (Llama-3.3-70b-versatile is extremely fast and capable)
    if (groqKey) {
      try {
        let systemPrompt = '';
        if (type === 'checklist') {
          systemPrompt = `
Anda adalah asisten AI produktivitas. Berikan daftar subtask (checklist items) dalam bahasa Indonesia untuk tugas berikut.
Judul: "${title}"
Deskripsi: "${description || 'Tidak ada deskripsi'}"

Format output HARUS berupa JSON array of strings murni, contoh:
["Subtask 1", "Subtask 2", "Subtask 3"]
Jangan sertakan teks markdown seperti \`\`\`json atau penjelasan tambahan lainnya.
`;
        } else {
          systemPrompt = `
Berikan rekomendasi warna label yang paling sesuai untuk tugas berikut:
Judul: "${title}"
Deskripsi: "${description || 'Tidak ada deskripsi'}"

Pilihan warna label yang tersedia hanya: "red" (urgent/blocker), "orange" (konten/media), "yellow" (sedang/medium), "green" (prioritas rendah), "blue" (fitur baru/feature), "purple" (kutu/bug), "pink" (video/desain).
Format output HARUS hanya berupa satu kata string warna tersebut, tanpa tanda kutip atau markdown. Contoh:
red
`;
        }

        const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
        const response = await fetch(groqUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: systemPrompt }],
            temperature: 0.1,
            max_tokens: 1000
          })
        });

        if (response.ok) {
          const json = await response.json();
          responseText = json.choices?.[0]?.message?.content || '';
          apiUsed = 'Groq (Llama-3.3-70b)';
        } else {
          console.warn('Groq API returned error status:', response.status);
        }
      } catch (e) {
        console.error('Failed to query Groq API:', e);
      }
    }

    // 2. Fallback to OpenRouter (Gemini 2.5 Flash)
    if (!responseText && openRouterKey) {
      try {
        let systemPrompt = '';
        if (type === 'checklist') {
          systemPrompt = `
Berikan daftar subtask (checklist items) dalam bahasa Indonesia untuk tugas berikut:
Judul: "${title}"
Deskripsi: "${description || 'Tidak ada deskripsi'}"

Format output HARUS berupa JSON array of strings murni. Contoh:
["Subtask 1", "Subtask 2", "Subtask 3"]
Jangan sertakan markdown atau penjelasan tambahan.
`;
        } else {
          systemPrompt = `
Berikan rekomendasi warna label yang paling sesuai untuk tugas berikut:
Judul: "${title}"
Deskripsi: "${description || 'Tidak ada deskripsi'}"

Pilihan warna label yang tersedia hanya: "red" (urgent/blocker), "orange" (konten/media), "yellow" (sedang/medium), "green" (prioritas rendah), "blue" (fitur baru/feature), "purple" (kutu/bug), "pink" (video/desain).
Format output HARUS hanya berupa satu kata string warna tersebut, tanpa tanda kutip atau markdown. Contoh:
red
`;
        }

        const orUrl = 'https://openrouter.ai/api/v1/chat/completions';
        const response = await fetch(orUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [{ role: 'user', content: systemPrompt }],
            temperature: 0.1,
            max_tokens: 1000
          })
        });

        if (response.ok) {
          const json = await response.json();
          responseText = json.choices?.[0]?.message?.content || '';
          apiUsed = 'OpenRouter (Gemini-2.5-Flash)';
        } else {
          console.warn('OpenRouter API returned error status:', response.status);
        }
      } catch (e) {
        console.error('Failed to query OpenRouter API:', e);
      }
    }

    // 3. Process API Result if success
    if (responseText) {
      try {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        if (type === 'checklist') {
          const checklist = JSON.parse(cleaned);
          if (Array.isArray(checklist)) {
            return NextResponse.json({ result: checklist, simulated: false, apiUsed });
          }
        } else {
          const color = cleaned.toLowerCase().replace(/[^a-z]/g, '');
          const validColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
          if (validColors.includes(color)) {
            return NextResponse.json({ result: color, simulated: false, apiUsed });
          }
        }
      } catch (parseError) {
        console.error('Failed to parse AI response text:', responseText, parseError);
      }
    }

    // 4. Final Fallback to Smart Heuristics Simulation
    isSimulated = true;
    const t = (title + ' ' + (description || '')).toLowerCase();

    if (type === 'checklist') {
      let checklist: string[] = [];

      if (t.includes('login') || t.includes('oauth') || t.includes('auth') || t.includes('sign') || t.includes('registrasi') || t.includes('register')) {
        checklist = [
          'Setup Google OAuth Developer Credentials 🔑',
          'Desain Antarmuka Form Login (Responsive UI) 🎨',
          'Tambahkan Validasi Input (Email & Password) 🛡️',
          'Integrasikan dengan Endpoint Auth API Backend ⚡',
          'Implementasikan Error Handling & UX Feedback (Toast/Alert) 💬'
        ];
      } else if (t.includes('bug') || t.includes('crash') || t.includes('error') || t.includes('fix') || t.includes('perbaiki')) {
        checklist = [
          'Reproduksi error secara lokal 🐛',
          'Analisis log server & stack trace error 📂',
          'Perbaiki logika kode pada file target 🛠️',
          'Jalankan tes verifikasi lokal ✅',
          'Commit perbaikan & deploy ke staging 🚀'
        ];
      } else if (t.includes('database') || t.includes('db') || t.includes('schema') || t.includes('sql') || t.includes('postgresql') || t.includes('prisma')) {
        checklist = [
          'Definisikan relasi tabel baru 🗄️',
          'Buat file migrasi database SQL/Prisma ⚙️',
          'Jalankan script database migration 🚀',
          'Buat seed data awal untuk pengembangan 🌾',
          'Verifikasi indeks tabel untuk optimasi query 📊'
        ];
      } else if (t.includes('api') || t.includes('endpoint') || t.includes('backend') || t.includes('crud')) {
        checklist = [
          'Desain struktur route RESTful API ⚡',
          'Buat logic Controller & CRUD Service 🔧',
          'Tambahkan middleware validasi skema request 🛡️',
          'Uji coba koneksi query database 🗄️',
          'Dokumentasikan endpoint API (Postman/Swagger) 📝'
        ];
      } else if (t.includes('desain') || t.includes('design') || t.includes('ui') || t.includes('homepage') || t.includes('landing') || t.includes('tampilan') || t.includes('katalog')) {
        checklist = [
          'Rancang sketsa layout UI (Figma/Wireframe) 🎨',
          'Implementasikan struktur HTML & Flexbox/Grid 🌐',
          'Terapkan tema warna & tipografi premium 🪄',
          'Buat animasi hover & interaksi mikro 🚀',
          'Uji responsivitas di berbagai perangkat (Mobile/Desktop) 📱'
        ];
      } else if (t.includes('reels') || t.includes('konten') || t.includes('video') || t.includes('content') || t.includes('instagram')) {
        checklist = [
          'Tulis script copywriting & storyboard konten 🎬',
          'Ambil aset foto/video berkualitas tinggi 📸',
          'Edit video dengan efek transisi menarik 🎥',
          'Tulis caption kreatif & hashtag populer 📝',
          'Jadwalkan postingan pada jam aktif audiens 📅'
        ];
      } else {
        checklist = [
          `Analisis spesifikasi teknis untuk "${title}" 📋`,
          `Rancang mockup awal / sketsa solusi 🎨`,
          `Lakukan coding & implementasi fitur dasar 💻`,
          `Tinjau kode & jalankan pengetesan kualitas ✅`,
          `Selesaikan dokumentasi akhir tugas 📝`
        ];
      }

      return NextResponse.json({ result: checklist, simulated: true, apiUsed: 'Simulated Fallback' });
    } else {
      let color = 'yellow'; // default

      if (t.includes('bug') || t.includes('crash') || t.includes('error') || t.includes('perbaiki')) {
        color = 'purple'; // Bug
      } else if (t.includes('urgent') || t.includes('segera') || t.includes('darurat') || t.includes('cepat')) {
        color = 'red'; // Urgent
      } else if (t.includes('konten') || t.includes('media') || t.includes('content') || t.includes('instagram')) {
        color = 'orange'; // Content
      } else if (t.includes('video') || t.includes('reels') || t.includes('film')) {
        color = 'pink'; // Video
      } else if (t.includes('fitur') || t.includes('buat') || t.includes('create') || t.includes('feature')) {
        color = 'blue'; // Feature
      } else if (t.includes('low') || t.includes('ringan') || t.includes('mudah') || t.includes('santai')) {
        color = 'green'; // Low priority
      }

      return NextResponse.json({ result: color, simulated: true, apiUsed: 'Simulated Fallback' });
    }
  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
