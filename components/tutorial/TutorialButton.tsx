'use client';

interface TutorialButtonProps {
  onClick: () => void;
  language?: 'ko' | 'en';
}

export function TutorialButton({ onClick, language = 'ko' }: TutorialButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-20 right-4 z-40 w-12 h-12 bg-black/80 border-2 border-neon-purple rounded-full flex items-center justify-center text-2xl hover:bg-neon-purple/20 hover:shadow-[0_0_20px_rgba(157,0,255,0.5)] transition-all duration-300 group"
      title={language === 'ko' ? '튜토리얼 보기' : 'View Tutorial'}
      aria-label={language === 'ko' ? '튜토리얼 보기' : 'View Tutorial'}
    >
      <span className="group-hover:scale-110 transition-transform">❓</span>
    </button>
  );
}
