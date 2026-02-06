/**
 * 타이핑 애니메이션 — AI 인사말을 한 글자씩 출력
 * localStorage로 방문 이력 추적하여 재방문 시 스킵
 */
(function () {
  'use strict';

  var TYPING_SPEED = 30;  // 글자당 ms
  var STORAGE_KEY = 'agent_typed_pages';

  /**
   * 방문 이력 확인
   * @param {string} pageId - 페이지 식별자
   * @returns {boolean}
   */
  function hasVisited(pageId) {
    try {
      var visited = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return visited[pageId] === true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 방문 이력 저장
   * @param {string} pageId - 페이지 식별자
   */
  function markVisited(pageId) {
    try {
      var visited = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      visited[pageId] = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
    } catch (e) {
      // localStorage 사용 불가 시 무시
    }
  }

  /**
   * 타이핑 효과 실행
   * @param {HTMLElement} el - 타이핑할 요소
   * @param {string} text - 출력할 텍스트
   * @param {Function} callback - 완료 콜백
   */
  function typeText(el, text, callback) {
    el.textContent = '';
    el.classList.add('ai-greeting--typing');
    var i = 0;

    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(tick, TYPING_SPEED);
      } else {
        el.classList.remove('ai-greeting--typing');
        if (callback) callback();
      }
    }

    tick();
  }

  /**
   * 페이지 로딩 시퀀스 실행
   * 1) 스피너 표시 (800ms)
   * 2) AI 인사말 타이핑 (첫 방문) 또는 즉시 표시 (재방문)
   * 3) 콘텐츠 페이드인
   */
  function runSequence() {
    var responseEl = document.getElementById('ai-response');
    var greetingEl = document.getElementById('ai-greeting');
    var contentEl = document.getElementById('ai-content');

    if (!responseEl) return;

    var pageId = responseEl.getAttribute('data-page-id') || window.location.pathname;
    var greetingText = responseEl.getAttribute('data-greeting') || '';
    var alreadyVisited = hasVisited(pageId);

    // 스피너 시작
    if (window.AgentSpinner) {
      window.AgentSpinner.start();
    }

    // 스피너 표시 시간 (첫 방문: 800ms, 재방문: 300ms)
    var spinnerDuration = alreadyVisited ? 300 : 800;

    setTimeout(function () {
      // 스피너 정지
      if (window.AgentSpinner) {
        window.AgentSpinner.stop();
      }

      // 응답 영역 표시
      responseEl.classList.remove('ai-response--hidden');

      if (alreadyVisited) {
        // 재방문: 즉시 표시
        if (contentEl) {
          contentEl.classList.add('ai-content--fade-in');
        }
        scrollToBottom();
      } else {
        // 첫 방문: 타이핑 애니메이션
        if (greetingEl && greetingText) {
          // 콘텐츠 잠시 숨김
          if (contentEl) contentEl.style.opacity = '0';

          typeText(greetingEl, greetingText, function () {
            // 타이핑 완료 후 콘텐츠 페이드인
            if (contentEl) {
              contentEl.style.opacity = '';
              contentEl.classList.add('ai-content--fade-in');
            }
            markVisited(pageId);
            scrollToBottom();
          });
        } else {
          // 인사말 없는 경우 바로 콘텐츠 표시
          if (contentEl) {
            contentEl.classList.add('ai-content--fade-in');
          }
          markVisited(pageId);
          scrollToBottom();
        }
      }
    }, spinnerDuration);
  }

  /** 출력 영역을 아래로 스크롤 */
  function scrollToBottom() {
    var output = document.getElementById('terminal-output');
    if (output) {
      // 약간의 딜레이로 렌더링 완료 대기
      setTimeout(function () {
        output.scrollTop = 0; // 상단으로 (일반 읽기 방향)
      }, 100);
    }
  }

  // 전역에 노출
  window.AgentTyping = {
    run: runSequence,
    hasVisited: hasVisited,
    markVisited: markVisited,
  };
})();
