export default function ContactPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="pixel-text text-4xl md:text-6xl text-bright mb-6 neon-text">
            CONTACT
          </h1>
          <p className="text-bright text-lg">
            문의사항이나 제안이 있으시면 GitHub를 통해 연락해주세요
          </p>
        </section>

        {/* GitHub Issues */}
        <section className="mb-12 p-8 bg-black/50 border-2 border-bright-pink rounded-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="pixel-text text-2xl text-bright-pink mb-4">GITHUB ISSUES</h2>
            <p className="text-bright mb-6">
              버그 제보, 기능 제안, 또는 문의사항이 있으시면
              GitHub Issues를 통해 알려주세요.
            </p>
            <a
              href="https://github.com/devlikebear/gamehub/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-bright-pink/20 border-2 border-bright-pink text-bright-pink pixel-text text-sm hover:bg-bright-pink hover:text-black transition-all duration-300 rounded"
            >
              OPEN ISSUE
            </a>
          </div>
        </section>

        {/* Contribution */}
        <section className="mb-12 p-8 bg-black/50 border-2 border-bright-green rounded-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🤝</div>
            <h2 className="pixel-text text-2xl text-bright-green mb-4">CONTRIBUTE</h2>
            <p className="text-bright mb-6">
              GameHub는 오픈소스 프로젝트입니다.
              Pull Request를 통해 자유롭게 기여하실 수 있습니다.
            </p>
            <a
              href="https://github.com/devlikebear/gamehub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-bright-green/20 border-2 border-bright-green text-bright-green pixel-text text-sm hover:bg-bright-green hover:text-black transition-all duration-300 rounded"
            >
              VIEW REPOSITORY
            </a>
          </div>
        </section>

        {/* Social Links */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* GitHub */}
          <div className="p-6 bg-black/30 border-2 border-bright-cyan rounded-lg text-center">
            <div className="text-4xl mb-3">
              <svg className="w-16 h-16 mx-auto text-bright-cyan" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="pixel-text text-bright-cyan text-sm mb-2">GITHUB</h3>
            <p className="text-bright text-xs mb-4">소스코드 & 이슈 트래킹</p>
            <a
              href="https://github.com/devlikebear/gamehub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bright-cyan hover:text-bright text-xs underline"
            >
              devlikebear/gamehub
            </a>
          </div>

          {/* Discussions */}
          <div className="p-6 bg-black/30 border-2 border-bright-purple rounded-lg text-center">
            <div className="text-4xl mb-3">💭</div>
            <h3 className="pixel-text text-bright-purple text-sm mb-2">DISCUSSIONS</h3>
            <p className="text-bright text-xs mb-4">아이디어 공유 & 질문</p>
            <a
              href="https://github.com/devlikebear/gamehub/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bright-purple hover:text-bright text-xs underline"
            >
              GitHub Discussions
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="p-8 bg-black/50 border-2 border-bright-yellow rounded-lg">
          <h2 className="pixel-text text-2xl text-bright-yellow mb-6 text-center">
            FAQ
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-bright-pink font-bold mb-2">Q. 게임이 언제 공개되나요?</h3>
              <p className="text-bright text-sm">
                A. 게임은 순차적으로 개발되어 공개됩니다. GitHub Issues를 통해 진행 상황을 확인하실 수 있습니다.
              </p>
            </div>

            <div>
              <h3 className="text-bright-pink font-bold mb-2">Q. 기여하려면 어떻게 하나요?</h3>
              <p className="text-bright text-sm">
                A. GitHub 저장소를 Fork하고 Pull Request를 보내주세요. 기여 가이드는 README.md를 참조해주세요.
              </p>
            </div>

            <div>
              <h3 className="text-bright-pink font-bold mb-2">Q. 새로운 게임을 제안할 수 있나요?</h3>
              <p className="text-bright text-sm">
                A. 네! GitHub Issues에 게임 제안을 올려주시면 검토 후 로드맵에 추가하겠습니다.
              </p>
            </div>

            <div>
              <h3 className="text-bright-pink font-bold mb-2">Q. 모바일에서도 플레이할 수 있나요?</h3>
              <p className="text-bright text-sm">
                A. 네, 모든 게임은 모바일과 데스크톱에서 모두 플레이 가능하도록 개발됩니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
