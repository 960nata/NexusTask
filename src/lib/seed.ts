import { AppData } from './types';

export function createSeedData(): AppData {
  return {
    members: ['Admin', 'Diki', 'Chandra', 'Sari', 'Budi', 'Rina'],
    workspaces: [
      { id: 'ws-1', name: 'Ratu Jaya Tani', description: 'Perusahaan pertanian modern', emoji: '🌾' },
      { id: 'ws-2', name: 'FlexiCash', description: 'Fintech startup', emoji: '💰' },
      { id: 'ws-3', name: 'Sicrack Media', description: 'Digital creative agency', emoji: '🎬' },
    ],
    boards: [
      {
        id: 'b-1',
        name: 'Mobile App Flutter',
        workspaceId: 'ws-1',
        background: 'linear-gradient(135deg, #0f766e, #065f46)',
        emoji: '📱',
        butlerRules: [
          { id: 'rule-1', trigger: 'move-list:l-6', action: 'complete-all', active: true }
        ]
      },
      { id: 'b-2', name: 'Website Company Profile', workspaceId: 'ws-1', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', emoji: '🌐' },
      { id: 'b-3', name: 'Marketing Instagram', workspaceId: 'ws-1', background: 'linear-gradient(135deg, #db2777, #e11d48)', emoji: '📸' },
      { id: 'b-4', name: 'Pengembangan API', workspaceId: 'ws-2', background: 'linear-gradient(135deg, #0284c7, #0369a1)', emoji: '⚡' },
      { id: 'b-5', name: 'Keuangan Perusahaan', workspaceId: 'ws-2', background: 'linear-gradient(135deg, #ca8a04, #a16207)', emoji: '📊' },
      { id: 'b-6', name: 'Video Production', workspaceId: 'ws-3', background: 'linear-gradient(135deg, #c026d3, #9333ea)', emoji: '🎥' },
    ],
    lists: [
      { id: 'l-1', name: 'Ide 💡', boardId: 'b-1', position: 0 },
      { id: 'l-2', name: 'Backlog 📋', boardId: 'b-1', position: 1 },
      { id: 'l-3', name: 'To Do 📌', boardId: 'b-1', position: 2 },
      { id: 'l-4', name: 'In Progress 🔧', boardId: 'b-1', position: 3 },
      { id: 'l-5', name: 'Testing 🧪', boardId: 'b-1', position: 4 },
      { id: 'l-6', name: 'Done ✅', boardId: 'b-1', position: 5 },
      { id: 'l-7', name: 'To Do 📌', boardId: 'b-2', position: 0 },
      { id: 'l-8', name: 'In Progress 🔧', boardId: 'b-2', position: 1 },
      { id: 'l-9', name: 'Review 👀', boardId: 'b-2', position: 2 },
      { id: 'l-10', name: 'Done ✅', boardId: 'b-2', position: 3 },
      { id: 'l-11', name: 'Ideas 💡', boardId: 'b-3', position: 0 },
      { id: 'l-12', name: 'Content Creation 🎨', boardId: 'b-3', position: 1 },
      { id: 'l-13', name: 'Scheduled 📅', boardId: 'b-3', position: 2 },
      { id: 'l-14', name: 'Published ✅', boardId: 'b-3', position: 3 },
    ],
    cards: [
      {
        id: 'c-1',
        title: 'Buat Login Google',
        description: 'Implementasi login dengan Google OAuth:\n- Login Google\n- Login Email\n- Validasi Form\n- Dark Mode Support',
        listId: 'l-4',
        position: 0,
        dueDate: '2026-06-30',
        labels: [{ color: 'red', text: 'Urgent' }, { color: 'blue', text: 'Feature' }],
        assignedTo: ['Diki', 'Chandra'],
        coverColor: '#0f766e',
        checklists: [
          {
            id: 'ckl-1',
            name: 'Persiapan OAuth 🔑',
            items: [
              { id: 'ck-1', text: 'Setup Google OAuth', completed: true },
              { id: 'ck-2', text: 'UI Login Screen', completed: true },
            ]
          },
          {
            id: 'ckl-2',
            name: 'Validasi & Error 🛠️',
            items: [
              { id: 'ck-3', text: 'Email Validation', completed: false },
              { id: 'ck-4', text: 'Error Handling', completed: false },
            ]
          }
        ],
        comments: [
          { id: 'cm-1', author: 'Diki', text: 'OAuth sudah setup, tinggal integrasi UI', createdAt: '2026-06-18T08:00:00Z' },
          { id: 'cm-2', author: 'Admin', text: '@Diki tambahkan juga validasi form ya', createdAt: '2026-06-18T09:30:00Z' },
        ],
        attachments: [{ id: 'at-1', name: 'mockup-login.pdf', url: '#', type: 'pdf' }],
        activities: [
          { id: 'act-1', action: 'Card dipindahkan ke In Progress', timestamp: '2026-06-17T10:00:00Z' },
          { id: 'act-2', action: 'Diki ditambahkan ke card', timestamp: '2026-06-17T10:05:00Z' },
          { id: 'act-3', action: 'Checklist "Setup Google OAuth" diselesaikan', timestamp: '2026-06-18T08:00:00Z' },
        ],
        createdAt: '2026-06-15T08:00:00Z',
      },
      {
        id: 'c-2',
        title: 'Buat Halaman Produk',
        description: 'Halaman katalog produk pertanian dengan fitur search dan filter',
        listId: 'l-3',
        position: 0,
        dueDate: '2026-07-05',
        labels: [{ color: 'blue', text: 'Feature' }],
        assignedTo: ['Sari'],
        checklists: [
          {
            id: 'ckl-3',
            name: 'Kebutuhan Frontend 🎨',
            items: [
              { id: 'ck-5', text: 'Hero Section', completed: false },
              { id: 'ck-6', text: 'Product Grid', completed: false },
              { id: 'ck-7', text: 'Search Bar', completed: false },
              { id: 'ck-8', text: 'Filter Kategori', completed: false },
              { id: 'ck-9', text: 'Dark Mode', completed: false },
            ]
          }
        ],
        comments: [],
        attachments: [],
        activities: [{ id: 'act-4', action: 'Card dibuat', timestamp: '2026-06-16T10:00:00Z' }],
        createdAt: '2026-06-16T10:00:00Z',
      },
      {
        id: 'c-3',
        title: 'Perbaiki Bug Search',
        description: 'Search tidak menampilkan hasil yang tepat saat query mengandung spasi ganda',
        listId: 'l-4',
        position: 1,
        dueDate: '2026-06-25',
        labels: [{ color: 'purple', text: 'Bug' }, { color: 'red', text: 'Urgent' }],
        assignedTo: ['Budi'],
        checklists: [
          {
            id: 'ckl-4',
            name: 'Penyelidikan Bug 🐛',
            items: [
              { id: 'ck-10', text: 'Reproduce bug', completed: true },
              { id: 'ck-11', text: 'Fix query parser', completed: true },
              { id: 'ck-12', text: 'Add unit test', completed: false },
            ]
          }
        ],
        comments: [
          { id: 'cm-3', author: 'Budi', text: 'Bug sudah di-reproduce, masalah di regex parser', createdAt: '2026-06-19T14:00:00Z' },
        ],
        attachments: [],
        activities: [
          { id: 'act-5', action: 'Label Bug ditambahkan', timestamp: '2026-06-18T08:00:00Z' },
        ],
        createdAt: '2026-06-18T08:00:00Z',
      },
      {
        id: 'c-4',
        title: 'API Produk',
        description: 'RESTful API untuk CRUD produk pertanian',
        listId: 'l-5',
        position: 0,
        dueDate: '2026-06-28',
        labels: [{ color: 'green', text: 'Low Priority' }],
        assignedTo: ['Diki', 'Chandra'],
        checklists: [
          {
            id: 'ckl-5',
            name: 'Endpoint CRUD ⚡',
            items: [
              { id: 'ck-13', text: 'GET /products', completed: true },
              { id: 'ck-14', text: 'POST /products', completed: true },
              { id: 'ck-15', text: 'PUT /products/:id', completed: true },
              { id: 'ck-16', text: 'DELETE /products/:id', completed: true },
              { id: 'ck-17', text: 'Validasi input', completed: false },
            ]
          }
        ],
        comments: [
          { id: 'cm-4', author: 'Diki', text: 'API sudah selesai, tinggal validasi', createdAt: '2026-06-20T10:00:00Z' },
          { id: 'cm-5', author: 'Admin', text: 'Tambahkan validasi ya @Diki', createdAt: '2026-06-20T11:00:00Z' },
        ],
        attachments: [],
        activities: [],
        createdAt: '2026-06-14T08:00:00Z',
      },
      {
        id: 'c-5',
        title: 'Setup CI/CD Pipeline',
        description: 'GitHub Actions untuk automated testing dan deployment',
        listId: 'l-6',
        position: 0,
        dueDate: null,
        labels: [{ color: 'green', text: 'Low Priority' }],
        assignedTo: ['Chandra'],
        coverColor: '#7c3aed',
        checklists: [
          {
            id: 'ckl-6',
            name: 'Pipeline Config ⚙️',
            items: [
              { id: 'ck-18', text: 'GitHub Actions workflow', completed: true },
              { id: 'ck-19', text: 'Automated tests', completed: true },
              { id: 'ck-20', text: 'Deploy to staging', completed: true },
            ]
          }
        ],
        comments: [],
        attachments: [],
        activities: [{ id: 'act-6', action: 'Card dipindahkan ke Done', timestamp: '2026-06-19T16:00:00Z' }],
        createdAt: '2026-06-10T08:00:00Z',
      },
      {
        id: 'c-6',
        title: 'Database Schema Design',
        description: 'Desain schema PostgreSQL untuk semua tabel utama',
        listId: 'l-6',
        position: 1,
        dueDate: null,
        labels: [{ color: 'blue', text: 'Feature' }],
        assignedTo: ['Diki'],
        checklists: [
          {
            id: 'ckl-7',
            name: 'Skema Tabel 🗄️',
            items: [
              { id: 'ck-21', text: 'Users table', completed: true },
              { id: 'ck-22', text: 'Products table', completed: true },
              { id: 'ck-23', text: 'Orders table', completed: true },
            ]
          }
        ],
        comments: [],
        attachments: [],
        activities: [],
        createdAt: '2026-06-08T08:00:00Z',
      },
      {
        id: 'c-7',
        title: 'Splash Screen Animation',
        description: 'Animasi splash screen dengan Lottie',
        listId: 'l-1',
        position: 0,
        dueDate: '2026-07-15',
        labels: [{ color: 'yellow', text: 'Medium' }],
        assignedTo: [],
        checklists: [],
        comments: [],
        attachments: [],
        activities: [],
        createdAt: '2026-06-20T08:00:00Z',
      },
      {
        id: 'c-8',
        title: 'Push Notification System',
        description: 'Firebase Cloud Messaging untuk push notification',
        listId: 'l-2',
        position: 0,
        dueDate: '2026-07-20',
        labels: [{ color: 'blue', text: 'Feature' }, { color: 'yellow', text: 'Medium' }],
        assignedTo: ['Rina'],
        checklists: [
          {
            id: 'ckl-8',
            name: 'Notifikasi 🔔',
            items: [
              { id: 'ck-24', text: 'Setup FCM', completed: false },
              { id: 'ck-25', text: 'Notification handler', completed: false },
              { id: 'ck-26', text: 'Background notification', completed: false },
            ]
          }
        ],
        comments: [],
        attachments: [],
        activities: [],
        createdAt: '2026-06-19T08:00:00Z',
      },
      // Board b-2 cards
      {
        id: 'c-9',
        title: 'Desain Homepage',
        description: 'Landing page company profile Ratu Jaya Tani',
        listId: 'l-8',
        position: 0,
        dueDate: '2026-07-01',
        labels: [{ color: 'blue', text: 'Feature' }],
        assignedTo: ['Sari', 'Rina'],
        checklists: [
          {
            id: 'ckl-9',
            name: 'Homepage Sections 🏠',
            items: [
              { id: 'ck-27', text: 'Hero section', completed: true },
              { id: 'ck-28', text: 'About section', completed: true },
              { id: 'ck-29', text: 'Products showcase', completed: false },
              { id: 'ck-30', text: 'Contact form', completed: false },
            ]
          }
        ],
        comments: [],
        attachments: [],
        activities: [],
        createdAt: '2026-06-15T08:00:00Z',
      },
      {
        id: 'c-10',
        title: 'SEO Optimization',
        description: 'Optimisasi SEO untuk company profile',
        listId: 'l-7',
        position: 0,
        dueDate: '2026-07-10',
        labels: [{ color: 'yellow', text: 'Medium' }],
        assignedTo: ['Budi'],
        checklists: [],
        comments: [],
        attachments: [],
        activities: [],
        createdAt: '2026-06-19T08:00:00Z',
      },
      // Board b-3 cards
      {
        id: 'c-11',
        title: 'Konten Produk Baru: Pupuk Organik',
        description: 'Buat konten Instagram untuk produk pupuk organik baru',
        listId: 'l-12',
        position: 0,
        dueDate: '2026-06-22',
        labels: [{ color: 'orange', text: 'Content' }, { color: 'red', text: 'Urgent' }],
        assignedTo: ['Rina'],
        checklists: [
          {
            id: 'ckl-10',
            name: 'Proses Kreatif 📸',
            items: [
              { id: 'ck-31', text: 'Photo shoot produk', completed: true },
              { id: 'ck-32', text: 'Copywriting caption', completed: true },
              { id: 'ck-33', text: 'Design carousel', completed: false },
            ]
          }
        ],
        comments: [],
        attachments: [],
        activities: [],
        createdAt: '2026-06-20T08:00:00Z',
      },
      {
        id: 'c-12',
        title: 'Reels Tutorial Tanam Padi',
        description: 'Video reels 60 detik tutorial menanam padi modern',
        listId: 'l-13',
        position: 0,
        dueDate: '2026-06-24',
        labels: [{ color: 'pink', text: 'Video' }],
        assignedTo: ['Sari'],
        checklists: [
          {
            id: 'ckl-11',
            name: 'Video Production 🎬',
            items: [
              { id: 'ck-34', text: 'Script & storyboard', completed: true },
              { id: 'ck-35', text: 'Shooting', completed: true },
              { id: 'ck-36', text: 'Editing', completed: true },
              { id: 'ck-37', text: 'Upload & caption', completed: false },
            ]
          }
        ],
        comments: [],
        attachments: [],
        activities: [],
        createdAt: '2026-06-18T08:00:00Z',
      },
    ],
  };
}

let _counter = 100;
export function generateId(prefix: string): string {
  _counter++;
  return `${prefix}-${Date.now()}-${_counter}`;
}
