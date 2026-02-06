/**
 * 슬래시 커맨드 파싱 & 라우팅 — AI CLI Agent 핵심 로직
 * 커맨드 입력 → 파싱 → 적절한 페이지로 라우팅
 */
(function () {
  'use strict';

  // ============================================================
  // 초기화
  // ============================================================

  var inputEl = document.getElementById('command-input');
  var helpOverlay = document.getElementById('help-overlay');
  var menuToggle = document.getElementById('menu-toggle');
  var terminalNav = document.getElementById('terminal-nav');

  // 기본 경로 (baseurl 지원)
  var baseUrl = document.querySelector('link[rel="stylesheet"]');
  var base = '';
  if (baseUrl) {
    var href = baseUrl.getAttribute('href');
    var cssIndex = href.indexOf('/assets/css/main.css');
    if (cssIndex > 0) {
      base = href.substring(0, cssIndex);
    }
  }

  // ============================================================
  // 커맨드 파싱 & 실행
  // ============================================================

  /**
   * 커맨드 문자열 파싱
   * @param {string} raw - 입력 문자열
   * @returns {{ cmd: string, args: string }}
   */
  function parseCommand(raw) {
    var trimmed = raw.trim();

    // `/` 로 시작하지 않으면 검색으로 처리
    if (trimmed.charAt(0) !== '/') {
      return { cmd: '/search', args: trimmed };
    }

    var spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex === -1) {
      return { cmd: trimmed.toLowerCase(), args: '' };
    }

    return {
      cmd: trimmed.substring(0, spaceIndex).toLowerCase(),
      args: trimmed.substring(spaceIndex + 1).trim(),
    };
  }

  /**
   * 커맨드 실행 — 해당 페이지로 네비게이션
   * @param {string} raw - 원본 입력 문자열
   */
  function executeCommand(raw) {
    var parsed = parseCommand(raw);
    var cmd = parsed.cmd;
    var args = parsed.args;

    switch (cmd) {
      case '/home':
        navigateTo('/');
        break;

      case '/posts':
        if (args) {
          // --tag, --category 플래그 파싱
          var tagMatch = args.match(/--tag\s+(\S+)/);
          var catMatch = args.match(/--category\s+(\S+)/);

          if (tagMatch) {
            navigateTo('/posts/?tag=' + encodeURIComponent(tagMatch[1]));
          } else if (catMatch) {
            navigateTo('/posts/?category=' + encodeURIComponent(catMatch[1]));
          } else {
            navigateTo('/posts/');
          }
        } else {
          navigateTo('/posts/');
        }
        break;

      case '/read':
        if (args) {
          navigateTo('/posts/' + args.replace(/\s+/g, '-') + '/');
        } else {
          showError("Missing article slug. Usage: /read <slug>");
        }
        break;

      case '/about':
        navigateTo('/about/');
        break;

      case '/search':
        if (args) {
          performSearch(args);
        } else {
          showError("Missing keyword. Usage: /search <keyword>");
        }
        break;

      case '/help':
        showHelp();
        break;

      default:
        showError("Hmm, I don't recognize '" + cmd + "'. Type /help to see available commands.");
        break;
    }
  }

  /**
   * 페이지 이동
   * @param {string} path - 이동할 경로
   */
  function navigateTo(path) {
    window.location.href = base + path;
  }

  // ============================================================
  // 인라인 헬프
  // ============================================================

  function showHelp() {
    if (helpOverlay) {
      helpOverlay.style.display = 'flex';
    }
  }

  function hideHelp() {
    if (helpOverlay) {
      helpOverlay.style.display = 'none';
    }
  }

  // 헬프 닫기 이벤트
  if (helpOverlay) {
    helpOverlay.addEventListener('click', function (e) {
      if (e.target === helpOverlay) {
        hideHelp();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      hideHelp();
    }
  });

  // ============================================================
  // 에러 메시지 표시
  // ============================================================

  /**
   * 터미널 출력에 에러 메시지 표시
   * @param {string} msg - 에러 메시지
   */
  function showError(msg) {
    var output = document.getElementById('terminal-output');
    if (!output) return;

    var content = output.querySelector('.terminal__content');
    if (!content) return;

    var errorDiv = document.createElement('div');
    errorDiv.className = 'ai-response';
    errorDiv.innerHTML =
      '<div class="ai-greeting" style="color: #f85149;">' +
      '🤖 ' + escapeHtml(msg) +
      '</div>';

    // ai-response 영역 뒤에 삽입
    var aiResponse = content.querySelector('#ai-response');
    if (aiResponse) {
      aiResponse.parentNode.insertBefore(errorDiv, aiResponse.nextSibling);
    } else {
      content.appendChild(errorDiv);
    }

    // 일정 시간 후 자동 제거
    setTimeout(function () {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  /** HTML 이스케이프 (XSS 방지) */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ============================================================
  // 검색 기능
  // ============================================================

  /**
   * 클라이언트사이드 검색 실행
   * @param {string} keyword - 검색어
   */
  function performSearch(keyword) {
    var posts = window.__POSTS__ || [];
    var lowerKeyword = keyword.toLowerCase();

    var results = posts.filter(function (post) {
      return (
        post.title.toLowerCase().indexOf(lowerKeyword) !== -1 ||
        (post.excerpt && post.excerpt.toLowerCase().indexOf(lowerKeyword) !== -1) ||
        post.tags.some(function (t) { return t.toLowerCase().indexOf(lowerKeyword) !== -1; })
      );
    });

    showSearchResults(keyword, results);
  }

  /**
   * 검색 결과를 터미널에 렌더링
   * @param {string} keyword - 검색어
   * @param {Array} results - 검색 결과 배열
   */
  function showSearchResults(keyword, results) {
    var output = document.getElementById('terminal-output');
    if (!output) return;

    var content = output.querySelector('.terminal__content');
    if (!content) return;

    // 기존 검색 결과 제거
    var existing = content.querySelector('.search-results');
    if (existing) existing.parentNode.removeChild(existing);

    var html = '<div class="search-results">';

    // 커맨드 라인
    html += '<div class="command-line" style="margin-top: 24px;">';
    html += '<span class="command-line__prompt">&gt;</span>';
    html += '<span class="command-line__text">/search ' + escapeHtml(keyword) + '</span>';
    html += '</div>';

    if (results.length > 0) {
      html += '<div class="ai-greeting">';
      html += "Searching for '" + escapeHtml(keyword) + "'... Found " + results.length + " match(es):";
      html += '</div>';

      html += '<div class="ai-content"><div class="post-list">';
      html += '<div class="post-list__header">';
      html += '<span>Date</span><span class="post-list__col--tag">Tag</span><span>Title</span>';
      html += '</div>';

      results.forEach(function (post) {
        var tag = post.tags.length > 0 ? post.tags[0] : '';
        html += '<div class="post-list__item">';
        html += '<span class="post-list__date">' + post.date + '</span>';
        html += '<span class="post-list__tag"><span class="post-list__tag-badge">' + escapeHtml(tag) + '</span></span>';
        html += '<a href="' + base + post.url + '" class="post-list__title">' + escapeHtml(post.title) + '</a>';
        html += '</div>';
      });

      html += '</div></div>';
    } else {
      html += '<div class="ai-greeting" style="color: #d29922;">';
      html += "No results found for '" + escapeHtml(keyword) + "'. Try a different keyword.";
      html += '</div>';
    }

    html += '</div>';

    // ai-response 뒤에 삽입
    var aiResponse = content.querySelector('#ai-response');
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    var resultEl = tempDiv.firstChild;

    if (aiResponse && aiResponse.nextSibling) {
      content.insertBefore(resultEl, aiResponse.nextSibling);
    } else {
      content.appendChild(resultEl);
    }

    // 검색 결과로 스크롤
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ============================================================
  // 포스트 필터링 (URL 파라미터 기반)
  // ============================================================

  function applyFilters() {
    var params = new URLSearchParams(window.location.search);
    var tag = params.get('tag');
    var category = params.get('category');

    if (!tag && !category) return;

    var items = document.querySelectorAll('.post-list__item[data-tags]');
    if (items.length === 0) return;

    var visibleCount = 0;

    items.forEach(function (item) {
      var itemTags = (item.getAttribute('data-tags') || '').toLowerCase();
      var itemCats = (item.getAttribute('data-categories') || '').toLowerCase();
      var show = true;

      if (tag && itemTags.indexOf(tag.toLowerCase()) === -1) {
        show = false;
      }
      if (category && itemCats.indexOf(category.toLowerCase()) === -1) {
        show = false;
      }

      item.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    // 필터 상태 표시
    var statusEl = document.querySelector('.filter-status');
    if (statusEl) {
      var filterText = '';
      if (tag) {
        filterText = "Filtering posts tagged '" + tag + "'... Found " + visibleCount + " result(s):";
      } else if (category) {
        filterText = "Showing posts in '" + category + "' category... Found " + visibleCount + " result(s):";
      }
      statusEl.textContent = filterText;
      statusEl.style.display = 'block';
    }

    // 커맨드 라인 업데이트
    var cmdText = document.querySelector('.command-line__text');
    if (cmdText) {
      if (tag) cmdText.textContent = '/posts --tag ' + tag;
      if (category) cmdText.textContent = '/posts --category ' + category;
    }
  }

  // ============================================================
  // 모바일 메뉴 토글
  // ============================================================

  if (menuToggle && terminalNav) {
    menuToggle.addEventListener('click', function () {
      terminalNav.classList.toggle('is-open');
    });
  }

  // ============================================================
  // 이벤트 바인딩
  // ============================================================

  if (inputEl) {
    // Enter 키로 커맨드 실행
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var value = inputEl.value.trim();
        if (value) {
          executeCommand(value);
          inputEl.value = '';
        }
      }
    });

    // 포커스 시 커서 숨김은 CSS에서 처리
    inputEl.addEventListener('focus', function () {
      // 모바일에서 키보드가 올라올 때 네비 닫기
      if (terminalNav) {
        terminalNav.classList.remove('is-open');
      }
    });
  }

  // 전역 단축키: `/` 입력 시 커맨드 입력창 포커스
  document.addEventListener('keydown', function (e) {
    // 다른 입력 필드에 포커스가 있으면 무시
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') return;

    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      if (inputEl) {
        inputEl.focus();
        inputEl.value = '/';
      }
    }
  });

  // ============================================================
  // 페이지 로드 시 실행
  // ============================================================

  // 타이핑 시퀀스 시작
  if (window.AgentTyping) {
    window.AgentTyping.run();
  }

  // 포스트 필터 적용
  applyFilters();

})();
