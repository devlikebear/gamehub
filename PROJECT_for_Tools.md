# GameHub 에셋 생성 도구 개발 계획서

> **목적**: GameHub 프로젝트를 위한 레트로 아케이드 스타일 에셋(오디오, 이미지) 자동 생성 도구

**마지막 업데이트**: 2025-10-09  
**프로젝트 상태**: 계획 수립 중

---

## 📋 목차

1. [프로젝트 개요](#-프로젝트-개요)
2. [도구 1: 레트로 오디오 생성기](#-도구-1-레트로-오디오-생성기)
3. [도구 2: 2D 스프라이트 생성기](#-도구-2-2d-스프라이트-생성기)
4. [기술 스택 및 아키텍처](#-기술-스택-및-아키텍처)
5. [문제점 분석 및 개선안](#-문제점-분석-및-개선안)
6. [구현 로드맵](#-구현-로드맵)
7. [라이선스 및 저작권](#-라이선스-및-저작권)

---

## 🎯 프로젝트 개요

### 배경 및 필요성

**현재 GameHub 프로젝트 상황**:

- ✅ 8개의 레트로 아케이드 게임 구현 완료
- ✅ 네온 스타일 UI/UX 완성
- ❌ **부족**: 게임별 고유 BGM, 효과음, 스프라이트/애니메이션

**기존 문제점**:

1. **오디오 에셋**: 저작권 없는 레트로 BGM/효과음 찾기 어려움
2. **이미지 에셋**: 일관된 네온 아케이드 스타일 유지 어려움
3. **시간 소요**: 에셋 제작/수집에 개발 시간 과다 소요
4. **품질 일관성**: 게임마다 다른 아티스트 작품 사용 시 통일성 부족

### 핵심 목표

**자동화된 에셋 생성 도구**로 다음을 달성:

- ✅ 간단한 설정으로 양질의 레트로 스타일 에셋 생성
- ✅ 저작권 걱정 없는 자체 제작 에셋
- ✅ GameHub 디자인 시스템과 일관된 스타일
- ✅ 반복 작업 최소화, 개발 생산성 향상

---

## 🎵 도구 1: 레트로 오디오 생성기

### 기능 개요

**목적**: 80-90년대 아케이드 게임 스타일 BGM 및 효과음을 웹 기반으로 생성

**핵심 기술**: Web Audio API, Tone.js

**출력 포맷**: WAV, MP3

### 사용자 워크플로우

#### BGM 생성

1. **장르 선택**: Chiptune, Synthwave, Arcade Rock, Ambient, Action
2. **길이 선택**: 30초 (메뉴), 60초 (일반), 120초 (보스전)
3. **템포 선택**: 80-180 BPM
4. **무드 선택**: 긴장감, 경쾌함, 신비로움, 영웅적
5. **코드 진행**: 자동 생성 또는 수동 선택
6. **생성 및 다운로드**: 미리듣기 → WAV/MP3 다운로드

#### 효과음 생성

1. **타입 선택**: UI, 액션, 무기, 수집, 상태
2. **스타일 선택**: 단조, 화려, 복고
3. **길이 선택**: 0.1-2초
4. **생성 및 다운로드**: 미리듣기 → WAV/MP3

### 기술 구현

**핵심 라이브러리**:

- `tone@15.0.4` - 음악 생성 및 신디사이저
- `pizzicato@0.6.4` - 효과음 생성 및 이펙트
- `lamejs@1.2.1` - MP3 인코딩
- `audiobuffer-to-wav@1.0.0` - WAV 변환

---

## 🎨 도구 2: 2D 스프라이트 생성기

### 기능 개요

**목적**: Gemini API를 활용한 레트로 아케이드 스타일 2D 스프라이트 생성

**핵심 기술**: Gemini Image API (클라이언트 사이드), Canvas API (후처리)

**출력 포맷**: PNG (투명 배경), 스프라이트시트

**중요**: 서버에서 API 중계 없음. 사용자가 직접 API 키 관리 및 비용 부담.

### 보안 및 비용 관리 설계

#### 클라이언트 사이드 아키텍처

**PWA 기반 완전 클라이언트 사이드 실행**:

1. **서버 중계 없음**: Gemini API는 사용자 브라우저에서 직접 호출
2. **비용 투명성**: 사용자가 자신의 API 키로 직접 비용 관리
3. **보안 강화**: API 키는 사용자 로컬에만 저장, 서버 전송 없음

#### API 키 관리 시스템

```typescript
// tools/sprite-generator/security/ApiKeyManager.ts

import CryptoJS from 'crypto-js';

class ApiKeyManager {
  private static STORAGE_KEY = 'gamehub_gemini_api_key_encrypted';
  private static ENCRYPTION_KEY = 'user_device_fingerprint'; // 디바이스별 고유키

  // API 키 암호화 저장
  static async saveApiKey(apiKey: string): Promise<void> {
    // 1. 디바이스 핑거프린트 생성 (브라우저 고유값)
    const deviceFingerprint = await this.getDeviceFingerprint();

    // 2. API 키 암호화 (AES-256)
    const encrypted = CryptoJS.AES.encrypt(apiKey, deviceFingerprint).toString();

    // 3. localStorage에 암호화된 값만 저장
    localStorage.setItem(this.STORAGE_KEY, encrypted);

    // 4. 세션 메모리에 복호화된 키 임시 저장 (새로고침 시 삭제)
    sessionStorage.setItem('api_key_session', apiKey);
  }

  // API 키 복호화 로드
  static async loadApiKey(): Promise<string | null> {
    // 1. 세션에서 먼저 확인 (이미 복호화된 키)
    const sessionKey = sessionStorage.getItem('api_key_session');
    if (sessionKey) return sessionKey;

    // 2. localStorage에서 암호화된 키 가져오기
    const encrypted = localStorage.getItem(this.STORAGE_KEY);
    if (!encrypted) return null;

    // 3. 디바이스 핑거프린트로 복호화
    const deviceFingerprint = await this.getDeviceFingerprint();
    const decrypted = CryptoJS.AES.decrypt(encrypted, deviceFingerprint).toString(
      CryptoJS.enc.Utf8
    );

    // 4. 세션에 저장
    sessionStorage.setItem('api_key_session', decrypted);

    return decrypted;
  }

  // API 키 삭제
  static clearApiKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem('api_key_session');
  }

  // 디바이스 핑거프린트 생성 (브라우저 고유 식별자)
  private static async getDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.width + 'x' + screen.height,
      navigator.hardwareConcurrency || 0,
    ];

    const fingerprint = components.join('|');

    // SHA-256 해시로 고정 길이 키 생성
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // API 키 유효성 검증
  static async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      // Gemini API에 테스트 요청
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1/models',
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      return response.ok;
    } catch {
      return false;
    }
  }
}
```

#### 사용량 추적 및 비용 모니터링

```typescript
// tools/sprite-generator/security/UsageTracker.ts

interface UsageRecord {
  timestamp: number;
  operation: 'sprite' | 'animation' | 'effect';
  imageCount: number;
  estimatedCost: number; // USD
}

class UsageTracker {
  private static STORAGE_KEY = 'gamehub_gemini_usage';

  // Gemini API 가격 (2025년 1월 기준 예상)
  private static PRICING = {
    imageGeneration: 0.02, // $0.02 per image
  };

  // 사용량 기록
  static recordUsage(operation: string, imageCount: number): void {
    const cost = imageCount * this.PRICING.imageGeneration;

    const record: UsageRecord = {
      timestamp: Date.now(),
      operation: operation as any,
      imageCount,
      estimatedCost: cost,
    };

    const history = this.getUsageHistory();
    history.push(record);

    // 최근 30일만 보관
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const filtered = history.filter((r) => r.timestamp > thirtyDaysAgo);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  // 사용량 조회
  static getUsageHistory(): UsageRecord[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // 월별 비용 계산
  static getMonthlyUsage(): {
    totalImages: number;
    totalCost: number;
    byOperation: Record<string, number>;
  } {
    const history = this.getUsageHistory();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = history.filter((r) => r.timestamp > thirtyDaysAgo);

    const totalImages = recent.reduce((sum, r) => sum + r.imageCount, 0);
    const totalCost = recent.reduce((sum, r) => sum + r.estimatedCost, 0);

    const byOperation: Record<string, number> = {};
    recent.forEach((r) => {
      byOperation[r.operation] = (byOperation[r.operation] || 0) + r.estimatedCost;
    });

    return { totalImages, totalCost, byOperation };
  }

  // 일일 한도 확인
  static checkDailyLimit(limit: number = 50): boolean {
    const history = this.getUsageHistory();
    const today = new Date().setHours(0, 0, 0, 0);
    const todayUsage = history.filter((r) => r.timestamp >= today);
    const todayImages = todayUsage.reduce((sum, r) => sum + r.imageCount, 0);

    return todayImages < limit;
  }
}
```

### 사용자 워크플로우 (보안 강화)

#### 초기 설정

1. **API 키 입력**: 첫 방문 시 Gemini API 키 요청
2. **키 검증**: 유효성 테스트 (무료 API 호출)
3. **암호화 저장**: 디바이스 고유 핑거프린트로 AES-256 암호화
4. **사용량 안내**: 월별 무료/유료 한도 설명

#### 이미지 생성

1. **생성 타입**: 스프라이트, 애니메이션, 이펙트
2. **API 키 확인**: 세션에서 복호화된 키 로드
3. **비용 사전 안내**: 예상 비용 표시 (이미지 수 × $0.02)
4. **사용자 확인**: "생성하시겠습니까? 예상 비용: $0.06"
5. **클라이언트 API 호출**: 브라우저에서 직접 Gemini API 호출
6. **사용량 기록**: 로컬에 사용 내역 저장
7. **결과 캐싱**: IndexedDB에 생성 결과 저장 (재사용)

#### 설정 관리

1. **사용량 대시보드**: 월별/일별 사용량 및 비용 표시
2. **일일 한도 설정**: 사용자가 직접 한도 설정 (기본 50개/일)
3. **API 키 교체**: 언제든지 키 삭제 및 재등록 가능
4. **캐시 관리**: 생성된 이미지 캐시 삭제/관리

### 기술 구현

**핵심 라이브러리**:

- `@google/generative-ai@0.1.0` - Gemini API (클라이언트)
- `crypto-js@4.2.0` - AES 암호화
- `sharp@0.33.0` - 이미지 최적화 (선택적)

---

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (PWA 지원)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Deployment**: Cloudflare Pages
- **보안**: crypto-js (AES-256), Web Crypto API
- **저장소**: localStorage (암호화), sessionStorage, IndexedDB (캐시)

---

## ⚠️ 문제점 분석 및 개선안

### 오디오 생성기

| 문제점 | 개선안 |
|--------|--------|
| ❌ MIDI는 실제 소리가 아님 | ✅ WAV/MP3 직접 생성 |
| ❌ 완전 랜덤 코드는 부자연스러움 | ✅ 장르별 검증된 프리셋 |
| ❌ 랜덤 효과음 품질 불확실 | ✅ 검증된 템플릿 + 미세 변형 |

### 스프라이트 생성기

| 문제점 | 개선안 |
|--------|--------|
| ❌ AI 일관성 부족 | ✅ 참고 이미지 + Canvas 후처리 |
| ❌ 애니메이션 프레임 일관성 | ✅ 시드 고정 + 키프레임 방식 |
| ❌ API 비용/제한 | ✅ 로컬 캐싱 + 배치 최적화 |
| ❌ API 키 서버 저장 보안 위험 | ✅ 클라이언트 사이드 암호화 저장 |
| ❌ 서버 API 중계 비용 | ✅ 사용자 직접 API 호출 (비용 투명성) |

---

## 📅 구현 로드맵

### Phase 1: 기반 구축 (1-2주)

**기존 완료 항목** ✅:

- ✅ PWA 기본 설정 - 게임용 [manifest.json](public/manifest.json), [sw.js](public/sw.js) 존재

**추가 작업 필요**:

- [ ] Service Worker에 도구 페이지 경로 추가 (`/tools/audio`, `/tools/sprite`)
- [ ] manifest.json에 도구 shortcuts 추가
- [ ] 보안 라이브러리 설치 (crypto-js)
- [ ] IndexedDB 캐시 시스템 구축 (생성 에셋 저장용)
- [ ] 공통 UI 컴포넌트 개발

### Phase 2: 오디오 생성기 (2-3주)

- [ ] Tone.js BGM 생성 로직
- [ ] Pizzicato 효과음 생성 로직
- [ ] 게임별 프리셋 시스템
- [ ] 미리듣기 및 다운로드 UI

### Phase 3: 스프라이트 생성기 보안 구현 (3-4주)

- [ ] **API 키 관리 시스템** (ApiKeyManager)
  - [ ] 디바이스 핑거프린트 생성
  - [ ] AES-256 암호화/복호화
  - [ ] API 키 유효성 검증
- [ ] **사용량 추적 시스템** (UsageTracker)
  - [ ] 로컬 사용 내역 저장
  - [ ] 월별/일별 비용 계산
  - [ ] 일일 한도 체크
- [ ] **클라이언트 사이드 Gemini API 통합**
  - [ ] 브라우저에서 직접 API 호출
  - [ ] 에러 처리 및 재시도 로직
  - [ ] 결과 캐싱 (IndexedDB)
- [ ] **사용자 대시보드**
  - [ ] API 키 설정 UI
  - [ ] 사용량/비용 모니터링
  - [ ] 캐시 관리 기능

### Phase 4: 통합 및 배포 (1주)

- [ ] GameHub 메인에 도구 링크
- [ ] PWA 최적화 (오프라인 지원)
- [ ] 보안 테스트 (XSS, 암호화 검증)
- [ ] Cloudflare Pages 배포

### Phase 5: 고도화 (선택적, 2-3주)

- [ ] 결과 공유 기능 (이미지만, API 키 제외)
- [ ] 일괄 생성 (배치 모드)
- [ ] 고급 필터링 및 편집 도구

**총 예상 기간**: 8-12주 (2-3개월)

---

## 📜 라이선스

- **생성 도구**: MIT License
- **생성 에셋**: CC0 또는 CC BY 4.0
- **Tone.js**: MIT ✅
- **Gemini SDK**: 이용약관 확인 필요 ⚠️

---

## 🔒 보안 고려사항

### API 키 보안

**절대 금지**:
- ❌ 서버에 API 키 저장
- ❌ 환경 변수에 사용자 키 저장
- ❌ Git에 키 커밋
- ❌ 평문으로 localStorage 저장

**권장 방법**:
- ✅ 클라이언트 사이드 AES-256 암호화
- ✅ 디바이스 핑거프린트로 암호화 키 생성
- ✅ sessionStorage에만 평문 임시 저장
- ✅ 사용자가 직접 키 입력 및 관리

### 비용 관리

**투명한 비용 구조**:
- 생성 전 예상 비용 표시
- 월별/일별 사용량 대시보드
- 사용자 설정 가능한 일일 한도
- 로컬에 모든 사용 내역 저장

**서버 비용 제로**:
- 모든 API 호출은 사용자 브라우저에서 직접
- 서버는 정적 파일만 호스팅 (Cloudflare Pages)
- 사용자가 100% 비용 부담 및 관리

---

## 🚀 다음 단계

1. **계획서 검토**: 보안 및 비용 관리 방향 최종 확인
2. **우선순위 결정**: Phase 1-5 중 구현 범위
3. **사용자 안내 작성**: API 키 발급 가이드 문서
4. **프로토타입 개발**: PWA + 보안 시스템부터 시작
5. **보안 테스트**: 암호화 검증, XSS 방어 확인

**예상 비용**:
- **서버**: $0 (Cloudflare Pages 무료 티어)
- **사용자**: Gemini API 사용량에 따라 $0-50/월 (개인 부담)
