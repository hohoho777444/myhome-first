// KDH GUN SHOP - Main Application Script

// 1. 글로벌 상태 (State)
let state = {
  credits: parseInt(localStorage.getItem('kdh_credits')) || 5000000,
  cart: JSON.parse(localStorage.getItem('kdh_cart')) || [],
  logsCount: 4
};

// 2. 인트로 세션 로딩 애니메이션
document.addEventListener('DOMContentLoaded', () => {
  initIntroLoader();
  updateWalletUI();
  updateCartCountUI();
  initMobileMenu();
  initScrollSpy();
  initLiveTerminalLogs();
  initStatsCounter();
  initContactForm();
  initCartModals();
  initCategoryFilters();
});

function initIntroLoader() {
  const progressBar = document.getElementById('load-progress');
  const overlay = document.getElementById('loading-overlay');
  const terminalText = document.getElementById('loading-terminal-text');
  
  if (!overlay) return;

  const extraLogs = [
    '> CLEARING CACHE NODES...',
    '> LOADING ARMAMENT SPEC DATABASE...',
    '> ENABLING PGP SECURE HANDSHAKE...',
    '> SESSION ENCRYPTED VIA SHA-256...',
    '> SYSTEM READY. ACCESS GRANTED.'
  ];

  let progress = 0;
  let logIndex = 0;

  // 로딩 진행률 및 로그 출력 타이머
  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      
      // 약간의 지연 후 페이드아웃
      setTimeout(() => {
        overlay.classList.add('fade-out');
        document.body.style.overflow = 'auto'; // 스크롤 복구
      }, 400);
    }
    progressBar.style.width = `${progress}%`;

    // 랜덤 시점에 로깅 텍스트 추가
    if (progress % 20 < 5 && logIndex < extraLogs.length) {
      const newLine = document.createElement('p');
      newLine.className = 'term-line';
      newLine.textContent = extraLogs[logIndex];
      if (logIndex === extraLogs.length - 1) {
        newLine.classList.add('text-green');
      }
      terminalText.appendChild(newLine);
      logIndex++;
    }
  }, 100);
}

// 3. 모바일 네비게이션 제어
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // 메뉴 링크 클릭 시 드로워 닫기
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// 4. 스크롤 스파이 (Scroll Spy) & 헤더 고정 처리
function initScrollSpy() {
  const sections = document.querySelectorAll('.scroll-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.querySelector('.main-header');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100;

    // 헤더 투명도/배경 처리
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'rgba(6, 6, 8, 0.95)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.backgroundColor = 'var(--bg-glass)';
      header.style.boxShadow = 'none';
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// 5. 히어로 영역 실시간 전술 터미널 로그 스트리밍
function initLiveTerminalLogs() {
  const logContainer = document.getElementById('hero-log-lines');
  if (!logContainer) return;

  const logPool = [
    "CHECKING QUANTUM ENCRYPTED NODE...",
    "SECURE ROUTING TABLE UPDATED.",
    "SYNCING BLUEPRINT STACK [M4A1_REAPER]...",
    "NODE KDH_ARMORY INBOUND TRAFFIC OK.",
    "PGP KEY ROTATION: SUCCESS [0x92BC3A]",
    "CARGO DROP COORDINATES PARSED.",
    "DIAGNOSTICS: ALL WEAPON INTERFACES READY.",
    "ESTABLISHING DEEP-WEB RELAY TUNNEL...",
    "INTRUSION DETECTION SYSTEM: ACTIVE.",
    "CLEANING TEMPORARY IP FOOTPRINTS..."
  ];

  setInterval(() => {
    const time = new Date();
    const timeString = `[${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}]`;
    const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
    
    const p = document.createElement('p');
    p.className = 'term-log-line';
    
    // 무작위로 색상 클래스 추가
    const rand = Math.random();
    if (rand < 0.25) {
      p.className += ' text-green';
    } else if (rand > 0.85) {
      p.className += ' text-dim';
    }
    
    p.textContent = `${timeString} ${randomLog}`;
    logContainer.appendChild(p);

    // 오래된 로그 제거하여 DOM 부하 방지
    if (logContainer.children.length > 5) {
      logContainer.removeChild(logContainer.firstChild);
    }
    
    // 자동 스크롤
    logContainer.scrollTop = logContainer.scrollHeight;
  }, 4000);
}

// 6. 이미지 로딩 실패 시 전술 와이어프레임 폴백 화면 생성
function handleImageLoadError(imgElement, weaponCode) {
  const parent = imgElement.parentElement;
  if (!parent) return;

  // 이미지 숨기기
  imgElement.style.display = 'none';

  // 폴백 UI 박스 생성
  const fallbackDiv = document.createElement('div');
  fallbackDiv.className = 'fallback-weapon-ui';
  
  fallbackDiv.innerHTML = `
    <div class="fallback-blueprint-box"></div>
    <div class="fallback-err-title">BLUEPRINT_LOAD_FAILED</div>
    <div class="fallback-err-code text-mono">[WEAPON_${weaponCode}_0x4F]</div>
    <div class="fallback-err-tag text-mono">SECURE_DRAWING</div>
  `;

  parent.appendChild(fallbackDiv);
}

// 7. 상점 카테고리 필터링 기능
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const weaponCards = document.querySelectorAll('.weapon-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 액티브 클래스 전환
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      weaponCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          // 부드러운 노출 애니메이션 효과
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.4s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 8. 장바구니 & 지갑 비즈니스 로직
function updateWalletUI() {
  const formattedCredits = `₩ ${state.credits.toLocaleString()}`;
  
  const walletEl = document.getElementById('wallet-credits');
  if (walletEl) walletEl.textContent = formattedCredits;

  const modalWalletEl = document.getElementById('modal-wallet-balance');
  if (modalWalletEl) modalWalletEl.textContent = formattedCredits;
}

function updateCartCountUI() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    countEl.textContent = state.cart.length;
    // 수량 변경 시 카트 튀는 바운스 효과 추가
    countEl.classList.remove('bounce-animation');
    void countEl.offsetWidth; // Reflow 트리거
    countEl.classList.add('bounce-animation');
  }
}

function saveStateToStorage() {
  localStorage.setItem('kdh_credits', state.credits);
  localStorage.setItem('kdh_cart', JSON.stringify(state.cart));
}

function addToCart(name, price, category) {
  // 중복 검사
  const exists = state.cart.find(item => item.name === name);
  if (exists) {
    showToast(`이미 장바구니에 담긴 화기입니다: ${name}`);
    return;
  }

  state.cart.push({ name, price, category });
  saveStateToStorage();
  updateCartCountUI();
  updateCartModalUI();
  showToast(`조달 계획에 장비 추가됨: ${name}`);
}

function removeFromCart(name) {
  state.cart = state.cart.filter(item => item.name !== name);
  saveStateToStorage();
  updateCartCountUI();
  updateCartModalUI();
}

function updateCartModalUI() {
  const cartContainer = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const pointsEl = document.getElementById('cart-estimated-points');
  const checkoutBtn = document.getElementById('btn-checkout');

  if (!cartContainer) return;

  if (state.cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-message text-mono">No tactical gear selected. Cart is empty.</p>';
    subtotalEl.textContent = '₩ 0';
    pointsEl.textContent = '0 PTS';
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  cartContainer.innerHTML = '';
  let subtotal = 0;

  state.cart.forEach(item => {
    subtotal += item.price;
    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item';
    itemRow.innerHTML = `
      <div class="item-details text-mono">
        <span class="item-name">${item.name}</span>
        <span class="item-spec-brief font-xs">${item.category.toUpperCase()} // STATUS: APPROVED</span>
        <span class="item-price">₩ ${item.price.toLocaleString()}</span>
      </div>
      <div class="item-controls">
        <button class="btn-remove-item" onclick="removeFromCart('${item.name}')">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `;
    cartContainer.appendChild(itemRow);
  });

  subtotalEl.textContent = `₩ ${subtotal.toLocaleString()}`;
  pointsEl.textContent = `${Math.floor(subtotal / 1000).toLocaleString()} PTS`;

  // 크레딧 부족 시 결제 버튼 비활성화
  if (state.credits < subtotal) {
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'INSUFFICIENT CREDITS (크레딧 부족)';
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = 'EXECUTE PROCUREMENT CONTRACT';
  }
}

// 장바구니 결제 로직 이행
function executeProcurement() {
  let subtotal = 0;
  state.cart.forEach(item => {
    subtotal += item.price;
  });

  if (state.credits < subtotal) {
    showToast('보유 크레딧이 부족하여 조달 결제가 불가능합니다.');
    return;
  }

  // 크레딧 차감
  state.credits -= subtotal;
  
  // 모달 데이터 갱신을 위해 주문 아이디 생성
  const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  document.getElementById('success-order-id').textContent = orderId;
  document.getElementById('success-wallet-balance').textContent = `₩ ${state.credits.toLocaleString()}`;
  
  // 장바구니 비우기
  state.cart = [];
  saveStateToStorage();

  // UI 리로드
  updateWalletUI();
  updateCartCountUI();
  updateCartModalUI();

  // 모달 가동
  document.getElementById('cart-modal').classList.remove('show');
  
  // 0.4초 후 성공 모달 노출
  setTimeout(() => {
    document.getElementById('success-modal').classList.add('show');
  }, 400);
}

function closeSuccessModal() {
  document.getElementById('success-modal').classList.remove('show');
}

// 9. 장바구니 모달 트리거 바인딩
function initCartModals() {
  const cartTrigger = document.getElementById('cart-trigger');
  const walletTrigger = document.getElementById('wallet-trigger');
  const cartModal = document.getElementById('cart-modal');
  const cartClose = document.getElementById('cart-close');

  if (!cartModal) return;

  const openCart = () => {
    updateCartModalUI();
    cartModal.classList.add('show');
  };

  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  if (walletTrigger) walletTrigger.addEventListener('click', openCart);

  if (cartClose) {
    cartClose.addEventListener('click', () => {
      cartModal.classList.remove('show');
    });
  }

  // 모달 바깥쪽 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove('remove');
      cartModal.classList.remove('show');
    }
  });
}

// 10. 스크롤 기반 숫자 카운트업 애니메이션 (Stats Counter)
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  const section = document.querySelector('.stats-section');
  if (counters.length === 0 || !section) return;

  let started = false;

  const startCounting = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
      const duration = 2000; // ms
      const stepTime = 30; // ms
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (target === 99.9 ? '%' : target === 45 ? '%' : '+');
          clearInterval(timer);
        } else {
          counter.textContent = current.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (target === 99.9 ? '%' : target === 45 ? '%' : '+');
        }
      }, stepTime);
    });
  };

  // Scroll Event Listener
  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    
    // 섹션이 화면의 80% 근방에 올 때 동작 시작
    if (!started && (rect.top <= viewHeight * 0.85)) {
      started = true;
      startCounting();
    }
  });
}

// 11. 보안 문의 폼 송신 시뮬레이션
function initContactForm() {
  const form = document.getElementById('secure-inquiry-form');
  const terminal = document.getElementById('form-terminal-output');
  const btnSubmit = document.getElementById('btn-submit-form');

  if (!form || !terminal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 입력 필드 추출
    const opId = document.getElementById('operator-id').value;
    const replyCoord = document.getElementById('reply-coordinate').value;
    const requestLog = document.getElementById('request-log').value;

    // 전송 모션 작동
    btnSubmit.disabled = true;
    btnSubmit.querySelector('.btn-text').textContent = 'ROUTING DATA PACKETS...';
    btnSubmit.querySelector('.loading-ring').style.display = 'inline-block';
    
    // 터미널 디버그창 노출 및 로깅 시뮬레이션
    terminal.style.display = 'block';
    terminal.innerHTML = `
      <p class="term-log-line text-dim">[${new Date().toLocaleTimeString()}] INBOUND CONNECTION OPEN FROM NODE_GUEST.</p>
      <p class="term-log-line">> ESTABLISHING SYMMETRIC SESSION KEY...</p>
    `;

    const logSteps = [
      `> SERIALIZING ENVELOPE (ID: ${opId})...`,
      `> RE-ROUTING EMAIL COORDINATE TO HYPER-GATEWAY...`,
      `> ENCRYPTING PAYLOAD PLAIN TEXT VIA PGP 4096-BIT RSA...`,
      `> DISPATCHING HOP 1: Tor-Node [Amsterdam] - OK.`,
      `> DISPATCHING HOP 2: Secure-Relay [Reykjavik] - OK.`,
      `> DISPATCHING HOP 3: Armory-Internal [Private Node] - OK.`,
      `> PACKET ACCEPTED. INBOUND INTEGRITY VALUE VALID.`,
      `> [SUCCESS] DISPATCH SEALED. WIPING SESSION TRACES...`
    ];

    let step = 0;
    const stepInterval = setInterval(() => {
      if (step < logSteps.length) {
        const p = document.createElement('p');
        p.className = 'term-log-line';
        if (logSteps[step].includes('SUCCESS')) {
          p.className += ' text-green';
        } else if (logSteps[step].includes('DISPATCHING')) {
          p.className += ' text-dim';
        }
        p.textContent = logSteps[step];
        terminal.appendChild(p);
        terminal.scrollTop = terminal.scrollHeight;
        step++;
      } else {
        clearInterval(stepInterval);
        
        // 폼 초기화 및 완료 피드백
        setTimeout(() => {
          form.reset();
          btnSubmit.disabled = false;
          btnSubmit.querySelector('.btn-text').textContent = 'SEND SECURE PACKET';
          btnSubmit.querySelector('.loading-ring').style.display = 'none';
          
          showToast('보안 패킷 전송 성공. 이력 삭제 대기 큐에 할당됨.');
          
          // 4초 뒤 터미널 자동 숨김
          setTimeout(() => {
            terminal.style.display = 'none';
          }, 4000);
        }, 800);
      }
    }, 450);
  });
}

// 12. 간단한 토스트 알림 컴포넌트
function showToast(message) {
  // 이미 존재하는 토스트가 있다면 제거
  const existToast = document.querySelector('.tactical-toast');
  if (existToast) {
    document.body.removeChild(existToast);
  }

  const toast = document.createElement('div');
  toast.className = 'tactical-toast text-mono';
  toast.innerHTML = `
    <span class="toast-indicator"></span>
    <span class="toast-msg">${message}</span>
  `;

  // 토스트 스타일링 주입 (CSS에 정의되지 않았을 수 있는 부분 고려)
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: 'var(--bg-glass)',
    border: '1px solid var(--color-red-bright)',
    boxShadow: '0 5px 20px rgba(139, 0, 0, 0.3)',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transform: 'translateY(100px)',
    opacity: '0',
    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease'
  });

  const indicator = toast.querySelector('.toast-indicator');
  Object.assign(indicator.style, {
    width: '6px',
    height: '6px',
    backgroundColor: 'var(--color-red-bright)',
    borderRadius: '50%',
    boxShadow: '0 0 6px var(--color-red-bright)',
    animation: 'blink 1s infinite'
  });

  document.body.appendChild(toast);

  // 애니메이션 효과
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 100);

  // 3.5초 후 제거
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 400);
  }, 3500);
}
