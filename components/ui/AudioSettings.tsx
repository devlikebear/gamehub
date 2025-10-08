'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio/AudioManager';
import { loadAudioSettings, saveAudioSettings } from '@/lib/storage/audioSettings';
import type { AudioSettings as AudioSettingsType } from '@/lib/audio/AudioManager';
import { useI18n } from '@/lib/i18n/provider';

interface AudioSettingsProps {
  onClose?: () => void;
}

export default function AudioSettings({ onClose }: AudioSettingsProps) {
  const { t } = useI18n();
  const [settings, setSettings] = useState<AudioSettingsType>(() => loadAudioSettings());
  const [isOpen, setIsOpen] = useState(false);

  // 설정 초기화
  useEffect(() => {
    const loaded = loadAudioSettings();
    setSettings(loaded);
    audioManager.updateSettings(loaded);
  }, []);

  // 설정 변경 핸들러
  const updateSetting = <K extends keyof AudioSettingsType>(
    key: K,
    value: AudioSettingsType[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    audioManager.updateSettings(newSettings);
    saveAudioSettings(newSettings);
  };

  // 볼륨 슬라이더 변경 핸들러
  const handleVolumeChange = (key: 'masterVolume' | 'bgmVolume' | 'sfxVolume', value: number) => {
    updateSetting(key, value);
  };

  // 토글 핸들러
  const handleToggle = (key: 'bgmEnabled' | 'sfxEnabled') => {
    const newValue = !settings[key];
    updateSetting(key, newValue);

    // BGM을 다시 켤 때 현재 재생 중이던 BGM이 있으면 재시작
    if (key === 'bgmEnabled' && newValue) {
      // BGM 재시작을 위해 이벤트 발생
      window.dispatchEvent(new CustomEvent('bgm-toggle', { detail: { enabled: true } }));
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pixel-text text-xs px-3 py-2 bg-black/80 border-2 border-bright-cyan text-bright-cyan rounded-md hover:bg-bright-cyan/20 transition-colors shadow-[0_0_10px_rgba(0,240,255,0.5)]"
        aria-label={t.audio.settings}
      >
        🔊 {t.audio.settings}
      </button>

      {/* 설정 패널 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-black/95 border-2 border-bright-cyan rounded-lg p-4 shadow-[0_0_20px_rgba(0,240,255,0.6)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="pixel-text text-sm text-white uppercase">{t.audio.settings}</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
              className="pixel-text text-xs text-bright-pink hover:text-white transition-colors"
              aria-label={t.common.close}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* 마스터 볼륨 */}
            <div>
              <label className="pixel-text text-[10px] text-bright-yellow block mb-2">
                {t.audio.masterVolume}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.masterVolume * 100}
                  onChange={(e) => handleVolumeChange('masterVolume', Number(e.target.value) / 100)}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-bright-yellow slider-thumb"
                />
                <span className="pixel-text text-[10px] text-white w-10 text-right">
                  {Math.round(settings.masterVolume * 100)}%
                </span>
              </div>
            </div>

            {/* BGM */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="pixel-text text-[10px] text-bright-purple">
                  {t.audio.bgm}
                </label>
                <button
                  onClick={() => handleToggle('bgmEnabled')}
                  className={`pixel-text text-[10px] px-2 py-1 border rounded transition-colors ${
                    settings.bgmEnabled
                      ? 'border-bright-green text-bright-green hover:bg-bright-green/20'
                      : 'border-gray-600 text-gray-600 hover:bg-gray-600/20'
                  }`}
                >
                  {settings.bgmEnabled ? t.audio.on : t.audio.off}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.bgmVolume * 100}
                  onChange={(e) => handleVolumeChange('bgmVolume', Number(e.target.value) / 100)}
                  disabled={!settings.bgmEnabled}
                  className={`flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-bright-purple slider-thumb ${
                    !settings.bgmEnabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <span className="pixel-text text-[10px] text-white w-10 text-right">
                  {Math.round(settings.bgmVolume * 100)}%
                </span>
              </div>
            </div>

            {/* SFX */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="pixel-text text-[10px] text-bright-pink">
                  {t.audio.sfx}
                </label>
                <button
                  onClick={() => handleToggle('sfxEnabled')}
                  className={`pixel-text text-[10px] px-2 py-1 border rounded transition-colors ${
                    settings.sfxEnabled
                      ? 'border-bright-green text-bright-green hover:bg-bright-green/20'
                      : 'border-gray-600 text-gray-600 hover:bg-gray-600/20'
                  }`}
                >
                  {settings.sfxEnabled ? t.audio.on : t.audio.off}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sfxVolume * 100}
                  onChange={(e) => handleVolumeChange('sfxVolume', Number(e.target.value) / 100)}
                  disabled={!settings.sfxEnabled}
                  className={`flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-bright-pink slider-thumb ${
                    !settings.sfxEnabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <span className="pixel-text text-[10px] text-white w-10 text-right">
                  {Math.round(settings.sfxVolume * 100)}%
                </span>
              </div>
            </div>

            {/* 안내 메시지 */}
            <p className="pixel-text text-[8px] text-gray-500 pt-2 border-t border-gray-700">
              {t.audio.note}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          box-shadow: 0 0 8px currentColor;
        }

        .slider-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px currentColor;
        }
      `}</style>
    </div>
  );
}
