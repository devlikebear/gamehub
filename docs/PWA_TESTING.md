# PWA 기능 테스트 가이드

GameHub의 Progressive Web App 기능을 테스트하는 방법입니다.

## 사전 준비

1. **프로덕션 빌드 생성**
   ```bash
   npm run build
   ```

2. **로컬 서버 실행**
   ```bash
   npm start
   # 또는
   npx serve out
   ```

> **참고**: PWA 기능은 HTTPS 또는 localhost에서만 작동합니다.

## 테스트 항목

### 1. Service Worker 등록 확인

1. Chrome DevTools 열기 (`F12`)
2. **Application** 탭 선택
3. **Service Workers** 메뉴 확인
4. `http://localhost:3000/sw.js` 등록 확인

**확인 사항**:
- ✅ Status: activated and is running
- ✅ Source: /sw.js
- ✅ Scope: /

### 2. Manifest 확인

1. Chrome DevTools > **Application** 탭
2. **Manifest** 메뉴 선택

**확인 사항**:
- ✅ Name: GameHub Arcade - 추억의 고전 게임
- ✅ Short name: GameHub
- ✅ Start URL: /
- ✅ Theme color: #000000
- ✅ Display mode: standalone
- ✅ Icons: 192x192, 512x512

### 3. 오프라인 기능 테스트

1. 브라우저에서 페이지 로드 (캐시 생성)
2. Chrome DevTools > **Network** 탭
3. **Offline** 체크박스 선택
4. 페이지 새로고침

**확인 사항**:
- ✅ 홈 페이지 정상 로딩
- ✅ 게임 목록 페이지 접근 가능
- ✅ 이미지/아이콘 정상 표시
- ✅ BGM 오디오 재생 가능

### 4. 캐시 확인

1. Chrome DevTools > **Application** 탭
2. **Cache Storage** 메뉴 확인

**확인 사항**:
- ✅ `gamehub-v1-static`: 정적 자산
- ✅ `gamehub-v1-dynamic`: 동적 콘텐츠
- ✅ `gamehub-v1-images`: 이미지 파일
- ✅ `gamehub-v1-audio`: BGM 파일

### 5. 앱 설치 프롬프트 테스트

#### 데스크톱 (Chrome)
1. 주소창 오른쪽 **설치** 아이콘 클릭
2. 또는 우측 하단 **앱으로 설치** 버튼 클릭
3. 설치 다이얼로그에서 **설치** 클릭

**확인 사항**:
- ✅ 설치 프롬프트 표시
- ✅ 독립 실행 창으로 실행
- ✅ 시작 메뉴/앱 목록에 추가

#### 모바일 (Android Chrome)
1. 메뉴 > **홈 화면에 추가**
2. 또는 우측 하단 **앱으로 설치** 버튼 클릭
3. 설치 확인

**확인 사항**:
- ✅ 홈 화면에 아이콘 추가
- ✅ 전체 화면 모드 실행
- ✅ 브라우저 UI 없음

#### iOS (Safari)
1. 공유 버튼 > **홈 화면에 추가**
2. 이름 확인 후 **추가**

**확인 사항**:
- ✅ 홈 화면에 아이콘 추가
- ✅ 독립 실행 모드

### 6. 아이콘 표시 확인

1. 설치된 앱 아이콘 확인
2. 다양한 해상도에서 확인

**확인 사항**:
- ✅ 192x192 아이콘 (일반 해상도)
- ✅ 512x512 아이콘 (고해상도)
- ✅ 네온 조이스틱 디자인 표시
- ✅ 배경 투명도 적절

### 7. Lighthouse 감사

1. Chrome DevTools > **Lighthouse** 탭
2. **Progressive Web App** 체크
3. **Analyze page load** 클릭

**목표 점수**:
- ✅ PWA: 90점 이상
- ✅ Performance: 90점 이상
- ✅ Accessibility: 90점 이상
- ✅ Best Practices: 90점 이상
- ✅ SEO: 90점 이상

## 문제 해결

### Service Worker가 등록되지 않음
```bash
# 브라우저 캐시 완전 삭제
Chrome DevTools > Application > Clear storage > Clear site data

# 다시 빌드 및 실행
npm run build
npm start
```

### 오프라인 모드에서 페이지 로딩 실패
1. 온라인 모드에서 먼저 페이지 방문 (캐시 생성)
2. 네트워크 탭에서 캐시된 리소스 확인
3. Service Worker 콘솔 로그 확인

### 설치 프롬프트가 표시되지 않음
- HTTPS 또는 localhost 확인
- manifest.json 경로 확인
- 최소 요구사항 충족 확인:
  - Service Worker 등록됨
  - manifest.json 존재
  - 192x192, 512x512 아이콘 존재
  - display: standalone 설정

### 캐시가 업데이트되지 않음
```javascript
// 콘솔에서 Service Worker 강제 업데이트
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.update());
});
```

## 브라우저 호환성

| 기능 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Manifest | ✅ | ⚠️ | ✅ | ✅ |
| Install Prompt | ✅ | ⚠️ | ❌ | ✅ |
| Offline Mode | ✅ | ✅ | ✅ | ✅ |

⚠️ = 부분 지원, ❌ = 미지원

## 참고 자료

- [Web.dev PWA 가이드](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
