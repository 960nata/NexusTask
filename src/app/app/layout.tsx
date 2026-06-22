import { BoardProvider } from '@/lib/boardStore';
import Sidebar from '@/components/Sidebar';
import ThemeApplier from '@/components/ThemeApplier';
import ChatFab from '@/components/ChatFab';
import AuthOverlay from '@/components/AuthOverlay';
import ToastContainer from '@/components/ToastContainer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BoardProvider>
      <ThemeApplier />
      <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#0E0E0E', fontFamily: 'var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif', overflow: 'hidden', color: '#fff' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {children}
        </div>
      </div>
      <ChatFab />
      <AuthOverlay />
      <ToastContainer />
    </BoardProvider>
  );
}
