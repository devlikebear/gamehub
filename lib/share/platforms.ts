/**
 * SNS Platform Share URLs
 *
 * 플랫폼별 공유 URL 생성
 */

export type SharePlatform = 'twitter' | 'facebook' | 'kakao' | 'copy';

export interface ShareUrlParams {
  url: string;
  title: string;
  text: string;
  hashtags?: string[];
}

/**
 * Twitter (X) 공유 URL 생성
 */
export function createTwitterShareUrl(params: ShareUrlParams): string {
  const { url, text, hashtags } = params;
  const urlParams = new URLSearchParams({
    url,
    text,
  });

  if (hashtags && hashtags.length > 0) {
    urlParams.append('hashtags', hashtags.join(','));
  }

  return `https://twitter.com/intent/tweet?${urlParams.toString()}`;
}

/**
 * Facebook 공유 URL 생성
 */
export function createFacebookShareUrl(params: ShareUrlParams): string {
  const { url } = params;
  const urlParams = new URLSearchParams({
    u: url,
  });

  return `https://www.facebook.com/sharer/sharer.php?${urlParams.toString()}`;
}

/**
 * 카카오톡 공유 (Kakao SDK 필요)
 * 참고: 실제 구현 시 Kakao SDK를 통한 공유 필요
 */
export function shareToKakao(params: ShareUrlParams): void {
  // Kakao SDK가 로드되어 있는지 확인
  if (typeof window === 'undefined' || !window.Kakao) {
    console.warn('Kakao SDK is not loaded');
    return;
  }

  const { url, title, text } = params;

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description: text,
      imageUrl: `${window.location.origin}/og-image.png`, // Open Graph 이미지
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: '플레이하기',
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  });
}

/**
 * Web Share API 사용 (모바일 네이티브 공유)
 */
export async function shareViaWebShareAPI(params: ShareUrlParams): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false;
  }

  try {
    await navigator.share({
      title: params.title,
      text: params.text,
      url: params.url,
    });
    return true;
  } catch (error) {
    // 사용자가 공유 취소한 경우 또는 에러
    console.log('Share cancelled or failed:', error);
    return false;
  }
}

/**
 * 클립보드에 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    // Fallback for older browsers
    return fallbackCopyToClipboard(text);
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Fallback 클립보드 복사 (구형 브라우저)
 */
function fallbackCopyToClipboard(text: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    document.body.removeChild(textArea);
    return false;
  }
}

/**
 * Web Share API 지원 여부 확인
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

// Kakao SDK 타입 선언
declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (params: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
    };
  }
}
