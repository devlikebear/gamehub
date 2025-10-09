/**
 * 도구 페이지 공통 레이아웃
 */

import React from 'react';

interface ToolLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function ToolLayout({ children, sidebar }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900">
      {/* 그리드 패턴 배경 */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 (설정 패널) */}
          {sidebar && (
            <aside className="lg:col-span-1">
              <div className="sticky top-8">{sidebar}</div>
            </aside>
          )}

          {/* 메인 컨텐츠 */}
          <main className={sidebar ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
