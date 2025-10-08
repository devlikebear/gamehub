# Supabase Edge Functions

GameHub의 리더보드 API를 처리하는 Supabase Edge Function입니다.

## Edge Function 목록

### submit-score

리더보드 점수 제출 및 조회를 처리하는 함수입니다.

**기능:**
- GET: 게임별 리더보드 조회
- POST: 점수 제출 및 검증

**보안:**
- Origin/Referer 검증
- 점수 범위 검증
- Rate Limiting (IP당 분당 5회)
- 닉네임 sanitization

## 배포 방법

### 1. Supabase CLI 로그인

```bash
supabase login
```

### 2. 프로젝트 연결

```bash
supabase link --project-ref <your-project-ref>
```

프로젝트 Ref는 Supabase Dashboard > Settings > General > Project ID에서 확인할 수 있습니다.

### 3. Edge Function 배포

```bash
supabase functions deploy submit-score
```

### 4. 환경 변수 설정

Supabase Dashboard > Edge Functions > submit-score > Settings에서 환경 변수를 설정합니다:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 로컬 테스트

### 1. Supabase 로컬 개발 환경 시작

```bash
supabase start
```

### 2. Edge Function 로컬 실행

```bash
supabase functions serve submit-score
```

### 3. 테스트 요청

**리더보드 조회:**
```bash
curl "http://localhost:54321/functions/v1/submit-score?gameId=stellar-salvo"
```

**점수 제출:**
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/submit-score' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
  --header 'Content-Type: application/json' \
  --data '{
    "gameId": "stellar-salvo",
    "nickname": "TestPlayer",
    "score": 1000,
    "outcome": "victory"
  }'
```

## Edge Function URL

배포 후 Edge Function URL:

```
https://<your-project-ref>.supabase.co/functions/v1/submit-score
```

이 URL이 `lib/leaderboard/supabase.ts`에서 사용됩니다.

## 주의사항

- Edge Function은 Deno 런타임을 사용합니다
- CORS는 모든 origin을 허용하지만, Origin/Referer 검증으로 보호됩니다
- Rate limiting은 Edge Function 인스턴스별로 in-memory로 관리됩니다
- 배포 전에 `.env.local`의 Supabase 환경 변수가 올바른지 확인하세요
