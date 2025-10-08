# Open Graph Images

## 디렉토리 구조

```
og/
├── default.png          # 기본 OG 이미지 (1200x630px)
└── games/
    ├── stellar-salvo.png
    ├── neon-serpent.png
    ├── cascade-blocks.png
    ├── prism-smash.png
    ├── pulse-paddles.png
    ├── photon-vanguard.png
    ├── spectral-pursuit.png
    └── starshard-drift.png
```

## 디자인 사양

### 이미지 크기
- **1200x630px** (Facebook, Twitter 권장)
- **PNG 포맷**
- **파일 크기 < 5MB**

### 디자인 요소

각 게임 이미지는 다음 요소를 포함해야 합니다:

1. **배경**: 네온 그라디언트
   ```css
   background: linear-gradient(135deg, #1a0033 0%, #000000 50%, #001a33 100%);
   ```

2. **그리드 패턴**: 레트로 스타일
   - 라인 색상: `rgba(0, 240, 255, 0.1)`
   - 그리드 간격: 50px

3. **게임 아이콘**: 중앙 배치, 큰 사이즈 (160px)
   - Stellar Salvo: 🚀 (cyan glow)
   - Neon Serpent: 🐍 (green glow)
   - Cascade Blocks: 🎮 (pink glow)
   - Prism Smash: 🔨 (yellow glow)
   - Pulse Paddles: 🏓 (cyan glow)
   - Photon Vanguard: 🛡️ (pink glow)
   - Spectral Pursuit: 👻 (purple glow)
   - Starshard Drift: 💎 (cyan glow)

4. **게임명**: Pixel 폰트, 게임별 네온 컬러
   - 크기: 72px
   - 텍스트 쉐도우: `0 0 30px {color}`

5. **GameHub 로고**: 하단 중앙
   - 텍스트: "🎮 GameHub Arcade"
   - 색상: #ff10f0 (pink)
   - 크기: 32px

6. **하단 네온 라인**: 게임별 컬러
   - 높이: 4px
   - 그라데이션 + 글로우 효과

## 게임별 컬러

| 게임 | 메인 컬러 | 컬러 코드 |
|------|-----------|-----------|
| Stellar Salvo | Cyan | #00f0ff |
| Neon Serpent | Green | #00ff00 |
| Cascade Blocks | Pink | #ff10f0 |
| Prism Smash | Yellow | #ffff00 |
| Pulse Paddles | Cyan | #00f0ff |
| Photon Vanguard | Pink | #ff10f0 |
| Spectral Pursuit | Purple | #9d00ff |
| Starshard Drift | Cyan | #00f0ff |

## 생성 도구

이미지는 다음 도구로 생성할 수 있습니다:

1. **Figma** - 디자인 템플릿 사용
2. **Canva** - OG 이미지 템플릿
3. **HTML2Canvas** - 프로그래매틱 생성
4. **ImageMagick** - 커맨드라인 도구

## 임시 대체 방안

이미지가 준비될 때까지 metadata에서 기본 이미지 사용:
```typescript
openGraph: {
  images: ['/icon.svg'], // 임시로 아이콘 사용
}
```
