/**
 * AI 처리중 스피너 — braille 패턴 애니메이션
 * ⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏ 순서로 회전
 */
(function () {
  'use strict';

  var FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  var INTERVAL = 80; // ms

  var spinnerEl = document.getElementById('ai-spinner');
  if (!spinnerEl) return;

  var charEl = spinnerEl.querySelector('.ai-spinner__char');
  if (!charEl) return;

  var frameIndex = 0;
  var timerId = null;

  /** 스피너 시작 */
  function start() {
    spinnerEl.style.display = 'block';
    frameIndex = 0;
    timerId = setInterval(function () {
      frameIndex = (frameIndex + 1) % FRAMES.length;
      charEl.textContent = FRAMES[frameIndex];
    }, INTERVAL);
  }

  /** 스피너 정지 및 숨김 */
  function stop() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    spinnerEl.style.display = 'none';
  }

  // 전역에 노출 (다른 스크립트에서 사용)
  window.AgentSpinner = {
    start: start,
    stop: stop,
  };
})();
