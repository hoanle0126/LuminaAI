import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will be added in Phase 4 */}
      <main id="main-content" className="flex-1">
        {/* Topbar will be added in Phase 4 */}
        {children}
      </main>
    </div>
  );
}
