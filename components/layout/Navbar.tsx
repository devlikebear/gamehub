import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neon-cyan/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="pixel-text text-xl text-neon-cyan group-hover:neon-text transition-all duration-300">
              🕹️ GAMEHUB
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/games"
              className="text-gray-300 hover:text-neon-pink transition-colors duration-300 font-medium"
            >
              Games
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-300 hover:text-neon-yellow transition-colors duration-300 font-medium"
            >
              Leaderboard
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-neon-purple transition-colors duration-300 font-medium"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-neon-cyan hover:text-neon-pink transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
