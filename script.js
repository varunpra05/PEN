// ---------- DATASETS WITH CATEGORIZED CAROUSEL SLIDES ----------
const carouselSlidesData = [
  {
    category: "Major Indices",
    items: [
      { id: "nifty", name: "Nifty 50", val: 24864.15, chg: 1.25, up: true, path: "M 0 16 Q 15 14, 30 8 T 60 4" },
      { id: "sensex", name: "Sensex", val: 81330.56, chg: 1.18, up: true, path: "M 0 18 Q 20 12, 35 10 T 60 2" },
      { id: "banknifty", name: "Bank Nifty", val: 51263.80, chg: 0.92, up: true, path: "M 0 15 Q 15 10, 30 12 T 60 5" },
      { id: "niftyit", name: "Nifty IT", val: 42150.25, chg: -0.45, up: false, path: "M 0 5 Q 15 12, 30 10 T 60 16" }
    ]
  },
  {
    category: "Commodities & Forex",
    items: [
      { id: "gold", name: "Gold (24K)", val: 72910, chg: 0.65, up: true, isRupee: true, path: "M 0 14 Q 15 15, 30 9 T 60 5" },
      { id: "silver", name: "Silver (1kg)", val: 91200, chg: 0.42, up: true, isRupee: true, path: "M 0 16 Q 20 10, 40 12 T 60 6" },
      { id: "usdinr", name: "USD / INR", val: 83.42, chg: -0.11, up: false, path: "M 0 8 Q 15 12, 30 14 T 60 16" },
      { id: "crude", name: "Crude Oil (bbl)", val: 6480, chg: 1.05, up: true, isRupee: true, path: "M 0 16 Q 15 8, 30 12 T 60 4" }
    ]
  },
  {
    category: "Top Equities",
    items: [
      { id: "reliance", name: "Reliance Ind", val: 3012.40, chg: 1.45, up: true, isRupee: true, path: "M 0 16 Q 20 10, 40 8 T 60 2" },
      { id: "tcs", name: "TCS", val: 4180.90, chg: -0.30, up: false, isRupee: true, path: "M 0 4 Q 20 10, 40 12 T 60 18" },
      { id: "hdfc", name: "HDFC Bank", val: 1645.10, chg: 0.85, up: true, isRupee: true, path: "M 0 14 Q 20 12, 40 6 T 60 4" },
      { id: "infosys", name: "Infosys", val: 1820.60, chg: 1.12, up: true, isRupee: true, path: "M 0 15 Q 15 8, 30 10 T 60 3" }
    ]
  }
];

// Flat market items list for Live Market section
let flatMarketItems = [];
carouselSlidesData.forEach(slide => {
  slide.items.forEach(item => flatMarketItems.push(item));
});

// Toast Helper
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✅</span> <div>${msg}</div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Modal Controls
const consultModal = document.getElementById('consult-modal');
function openConsultModal(serviceTopic) {
  if (consultModal) {
    consultModal.classList.add('active');
    if (serviceTopic) {
      const topicSelect = document.getElementById('c-topic');
      if (topicSelect) {
        for (let i = 0; i < topicSelect.options.length; i++) {
          if (topicSelect.options[i].text.toLowerCase().includes(serviceTopic.toLowerCase()) || 
              serviceTopic.toLowerCase().includes(topicSelect.options[i].text.toLowerCase())) {
            topicSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  }
}
function closeConsultModal() {
  if (consultModal) consultModal.classList.remove('active');
}

// ---------- MARKET CAROUSEL RENDER & LOGIC ----------
let currentSlideIndex = 0;
let carouselTimer = null;
let isHovered = false;

function renderMarketCarousel() {
  const track = document.getElementById('mc-track');
  const dotsContainer = document.getElementById('mc-dots');
  if (!track) return;

  track.innerHTML = carouselSlidesData.map((slide, sIdx) => `
    <div class="mc-slide" data-slide="${sIdx}">
      <span class="mc-slide-cat">${slide.category}</span>
      <div class="mc-slide-items">
        ${slide.items.map(m => `
          <div class="market-row" id="row-${m.id}">
            <span class="m-name">${m.name}</span>
            <div style="display:flex; align-items:center; gap:14px;">
              <div>
                <div class="m-val" id="val-${m.id}">${m.isRupee ? '₹' : ''}${m.val.toLocaleString('en-IN')}</div>
                <div class="m-chg ${m.up ? 'up' : 'down'}" id="chg-${m.id}">${m.up ? '▲' : '▼'} ${Math.abs(m.chg)}%</div>
              </div>
              <svg class="spark-svg" viewBox="0 0 60 20">
                <path d="${m.path}" fill="none" stroke="${m.up ? '#4ade80' : '#ef4444'}" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = carouselSlidesData.map((_, idx) => `
      <span class="mc-dot ${idx === currentSlideIndex ? 'active' : ''}" onclick="goToSlide(${idx})"></span>
    `).join('');
  }

  updateTrackPosition();
}

function updateTrackPosition() {
  const track = document.getElementById('mc-track');
  if (track) {
    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  }
  const dots = document.querySelectorAll('.mc-dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlideIndex);
  });
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % carouselSlidesData.length;
  updateTrackPosition();
}

function prevSlide() {
  currentSlideIndex = (currentSlideIndex - 1 + carouselSlidesData.length) % carouselSlidesData.length;
  updateTrackPosition();
}

function goToSlide(idx) {
  currentSlideIndex = idx;
  updateTrackPosition();
}

function startCarouselAutoPlay() {
  stopCarouselAutoPlay();
  carouselTimer = setInterval(() => {
    if (!isHovered) {
      nextSlide();
    }
  }, 4500);
}

function stopCarouselAutoPlay() {
  if (carouselTimer) clearInterval(carouselTimer);
}

// ---------- REAL-TIME LIVE MARKET ENGINE ----------
function startLiveUpdatesEngine() {
  setInterval(() => {
    // Pick 1 to 3 random items to update on every tick interval
    const numTicks = Math.floor(Math.random() * 3) + 1;

    for (let k = 0; k < numTicks; k++) {
      const slideIdx = Math.floor(Math.random() * carouselSlidesData.length);
      const itemIdx = Math.floor(Math.random() * carouselSlidesData[slideIdx].items.length);
      const item = carouselSlidesData[slideIdx].items[itemIdx];

      // Small realistic price tick (-0.35% to +0.45%)
      const deltaPct = parseFloat((Math.random() * 0.8 - 0.35).toFixed(2));
      if (deltaPct === 0) continue;

      const changeVal = item.val * (deltaPct / 100);
      item.val = Math.round((item.val + changeVal) * 100) / 100;
      item.chg = parseFloat((item.chg + deltaPct).toFixed(2));
      item.up = item.chg >= 0;

      // Calculate points change
      const pts = item.val * (item.chg / 100);
      const ptsStr = `${pts >= 0 ? '+' : ''}${pts.toFixed(2)}`;

      // 1. Update Hero Carousel Slide Row (if present)
      const valEl = document.getElementById(`val-${item.id}`);
      const chgEl = document.getElementById(`chg-${item.id}`);
      const rowEl = document.getElementById(`row-${item.id}`);

      if (valEl) valEl.textContent = `${item.isRupee ? '₹' : ''}${item.val.toLocaleString('en-IN')}`;
      if (chgEl) {
        chgEl.className = `m-chg ${item.up ? 'up' : 'down'}`;
        chgEl.textContent = `${item.up ? '▲' : '▼'} ${Math.abs(item.chg)}%`;
      }
      if (rowEl) {
        rowEl.classList.add(deltaPct >= 0 ? 'tick-up' : 'tick-down');
        setTimeout(() => rowEl.classList.remove('tick-up', 'tick-down'), 800);
      }

      // 2. Update Live Market Card Grid directly in DOM
      const lcValEl = document.getElementById(`lc-val-${item.id}`);
      const lcChgEl = document.getElementById(`lc-chg-${item.id}`);
      const lcCardEl = document.getElementById(`lc-card-${item.id}`);

      if (lcValEl) {
        lcValEl.textContent = `${item.isRupee ? '₹' : ''}${item.val.toLocaleString('en-IN')}`;
        lcValEl.classList.add(deltaPct >= 0 ? 'tick-flash-up' : 'tick-flash-down');
        setTimeout(() => lcValEl.classList.remove('tick-flash-up', 'tick-flash-down'), 700);
      }

      if (lcChgEl) {
        lcChgEl.className = `chg ${item.up ? 'up' : 'down'}`;
        lcChgEl.textContent = `${item.up ? '▲' : '▼'} ${Math.abs(item.chg)}% (${ptsStr})`;
      }

      if (lcCardEl) {
        lcCardEl.classList.add(deltaPct >= 0 ? 'card-pulse-up' : 'card-pulse-down');
        setTimeout(() => lcCardEl.classList.remove('card-pulse-up', 'card-pulse-down'), 700);
      }
    }
  }, 1600);
}

// Render Live Market Section
function renderLiveGrid() {
  const liveGrid = document.getElementById('live-grid');
  if (!liveGrid) return;
  liveGrid.innerHTML = flatMarketItems.slice(0, 6).map(m => {
    const pts = m.val * (m.chg / 100);
    const ptsStr = `${pts >= 0 ? '+' : ''}${pts.toFixed(2)}`;

    return `
      <div class="live-card" id="lc-card-${m.id}">
        <h5>${m.name.toUpperCase()}</h5>
        <div class="val" id="lc-val-${m.id}">${m.isRupee ? '₹' : ''}${m.val.toLocaleString('en-IN')}</div>
        <div class="chg ${m.up ? 'up' : 'down'}" id="lc-chg-${m.id}">
          ${m.up ? '▲' : '▼'} ${Math.abs(m.chg)}% (${ptsStr})
        </div>
      </div>
    `;
  }).join('');
}

// Services
const services = [
  { ico: "📈", title: "Stock Market Investment", desc: "Invest in top companies and grow your wealth." },
  { ico: "💰", title: "Mutual Funds", desc: "Choose from the best mutual fund schemes." },
  { ico: "📅", title: "SIP Planning", desc: "Start SIP and achieve your financial goals." },
  { ico: "🏛️", title: "Retirement Planning", desc: "Plan your retirement and secure your future." },
  { ico: "💎", title: "Wealth Management", desc: "Comprehensive wealth management solutions." },
  { ico: "📊", title: "Portfolio Analysis", desc: "Analyze your portfolio and maximize returns." }
];
function renderServices() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;
  servicesGrid.innerHTML = services.map(s => {
    const isStock = s.title === "Stock Market Investment";
    const clickHandler = isStock ? "window.location.href='stock-market.html'" : `openConsultModal('${s.title}')`;
    return `
      <div class="service-card" onclick="${clickHandler}">
        <div class="service-icon">${s.ico}</div>
        <div>
          <h4>${s.title}</h4>
          <p>${s.desc}</p>
        </div>
      </div>
    `;
  }).join('');
}

// Why Choose
const whyChoose = [
  { ico: "👤", title: "Experienced Advisors", desc: "Expert guidance from certified professionals." },
  { ico: "🛡️", title: "Safe & Secure", desc: "Your investments are safe with us." },
  { ico: "🏅", title: "SEBI Registered", desc: "We are SEBI registered investment advisor." },
  { ico: "🎧", title: "24x7 Support", desc: "We are here to help you anytime." },
  { ico: "📄", title: "Transparent Process", desc: "Clear and transparent investment process." }
];
function renderWhyChoose() {
  const whyList = document.getElementById('why-list');
  if (!whyList) return;
  whyList.innerHTML = whyChoose.map(w => `
    <li><div class="why-ico">${w.ico}</div><div><h4>${w.title}</h4><p>${w.desc}</p></div></li>
  `).join('');
}

// Stats Data with numeric target values for animated count-up
const stats = [
  { ico: "🏅", target: 10, prefix: "", suffix: "+", label: "Years of Experience", decimals: 0 },
  { ico: "👥", target: 50, prefix: "", suffix: "K+", label: "Happy Clients", decimals: 0 },
  { ico: "🪙", target: 250, prefix: "₹", suffix: " Cr+", label: "Assets Managed", decimals: 0 },
  { ico: "👍", target: 98, prefix: "", suffix: "%", label: "Client Satisfaction", decimals: 0 },
  { ico: "⭐", target: 4.8, prefix: "", suffix: "/5", label: "Google Rating", decimals: 1 }
];

let statsAnimated = false;

function animateCounter(el, target, prefix = "", suffix = "", decimals = 0, duration = 1800) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const currentVal = (eased * target).toFixed(decimals);

    el.textContent = `${prefix}${currentVal}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${prefix}${target}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

function startStatsCounterAnimation() {
  if (statsAnimated) return;
  statsAnimated = true;

  stats.forEach((s, idx) => {
    const el = document.getElementById(`stat-num-${idx}`);
    if (el) {
      animateCounter(el, s.target, s.prefix, s.suffix, s.decimals);
    }
  });
}

function renderStats() {
  const statsStrip = document.getElementById('stats-strip');
  if (!statsStrip) return;

  statsStrip.innerHTML = stats.map((s, idx) => `
    <div class="stat-item">
      <span class="ico">${s.ico}</span>
      <div>
        <b id="stat-num-${idx}">${s.prefix}0${s.suffix}</b>
        <span>${s.label}</span>
      </div>
    </div>
  `).join('');

  // Use IntersectionObserver to trigger animation when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startStatsCounterAnimation();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsStrip);
  } else {
    // Fallback immediate trigger
    setTimeout(startStatsCounterAnimation, 500);
  }
}

// Plans
const plans = [
  { ico: "🌱", title: "Starter Plan", desc: "For beginners", min: "₹500", risk: "Low", ret: "Moderate" },
  { ico: "📈", title: "Growth Plan", desc: "For long term growth", min: "₹5,000", risk: "Medium", ret: "High" },
  { ico: "👑", title: "Premium Plan", desc: "For wealth maximizers", min: "₹50,000", risk: "Medium-High", ret: "Higher" }
];
function renderPlans() {
  const plansGrid = document.getElementById('plans-grid');
  if (!plansGrid) return;
  plansGrid.innerHTML = plans.map(p => `
    <div class="plan-card">
      <div class="plan-icon">${p.ico}</div>
      <h3>${p.title}</h3><p>${p.desc}</p>
      <div class="plan-meta">
        <div><span>Minimum Investment</span><b>${p.min}</b></div>
        <div><span>Risk</span><b>${p.risk}</b></div>
        <div><span>Return</span><b>${p.ret}</b></div>
      </div>
      <button class="btn btn-primary w-full" onclick="openConsultModal()">Choose Plan</button>
    </div>
  `).join('');
}

// Check Items
const checkItems = [
  "Personalized Investment Strategies",
  "Goal Based Financial Planning",
  "High Returns with Managed Risk",
  "Regular Portfolio Monitoring",
  "Tax Efficient Investment Options"
];
function renderCheckList() {
  const checkList = document.getElementById('check-list');
  if (!checkList) return;
  checkList.innerHTML = checkItems.map(c => `<li><span class="c">✔</span> ${c}</li>`).join('');
}

// Process
const processSteps = [
  { n: 1, title: "Understand Your Goals", done: true },
  { n: 2, title: "Plan Your Investments", done: true },
  { n: 3, title: "Invest & Monitor", done: false },
  { n: 4, title: "Grow Your Wealth", done: false }
];
function renderProcessSteps() {
  const processEl = document.getElementById('process-steps');
  if (!processEl) return;
  processEl.innerHTML = processSteps.map(p => `
    <div class="p-step ${p.done ? 'done' : ''}">
      <div class="p-circle">${p.n}</div><span>${p.title}</span>
    </div>
  `).join('');
}

// Blogs
const blogs = [
  { img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400&auto=format&fit=crop", tag: "MARKET NEWS", title: "Market Outlook 2024: What Investors Should Expect", meta: "May 15, 2024 · 5 min read" },
  { img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=400&auto=format&fit=crop", tag: "INVESTMENT TIPS", title: "Best SIP Plans to Invest in 2024 for Higher Returns", meta: "May 12, 2024 · 4 min read" },
  { img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=400&auto=format&fit=crop", tag: "MUTUAL FUNDS", title: "How Mutual Funds Can Help You Build Wealth?", meta: "May 10, 2024 · 6 min read" },
  { img: "https://images.unsplash.com/photo-1611095973763-414019e72400?q=80&w=400&auto=format&fit=crop", tag: "TAX SAVING", title: "Top Tax Saving Investment Options for FY 2024-25", meta: "May 8, 2024 · 4 min read" }
];
function renderBlogs() {
  const blogGrid = document.getElementById('blog-grid');
  if (!blogGrid) return;
  blogGrid.innerHTML = blogs.map(b => `
    <div class="blog-card">
      <img src="${b.img}" alt="${b.title}">
      <div class="blog-tag">${b.tag}</div>
      <div class="blog-body"><h4>${b.title}</h4><div class="blog-meta">${b.meta}</div></div>
    </div>
  `).join('');
  blogGrid.innerHTML += `
    <div class="consult-card">
      <h4>Book Free Consultation</h4>
      <p>Get expert advice for your financial future.</p>
      <ul>
        <li><span class="c">✔</span> One to One Consultation</li>
        <li><span class="c">✔</span> 100% Free</li>
      </ul>
      <button class="btn btn-primary w-full" onclick="openConsultModal()">Book Now →</button>
    </div>
  `;
}

// ---------- CALCULATOR ----------
const mi = document.getElementById('mi'), er = document.getElementById('er'), tp = document.getElementById('tp');
const miVal = document.getElementById('mi-val'), erVal = document.getElementById('er-val'), tpVal = document.getElementById('tp-val');
const totalInv = document.getElementById('total-inv'), estRet = document.getElementById('est-ret'), finalVal = document.getElementById('final-val');

function formatINR(num) {
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

function calculate() {
  if (!mi || !er || !tp) return;
  const P = parseFloat(mi.value);
  const annualRate = parseFloat(er.value) / 100;
  const years = parseFloat(tp.value);
  const n = years * 12;
  const r = annualRate / 12;

  const fv = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = P * n;
  const returns = fv - invested;

  if (miVal) miVal.textContent = parseInt(P).toLocaleString('en-IN');
  if (erVal) erVal.textContent = er.value + '%';
  if (tpVal) tpVal.textContent = tp.value + ' Year' + (tp.value > 1 ? 's' : '');

  if (totalInv) totalInv.textContent = formatINR(invested);
  if (estRet) estRet.textContent = formatINR(returns);
  if (finalVal) finalVal.textContent = formatINR(fv);
}

if (mi && er && tp) {
  [mi, er, tp].forEach(el => el.addEventListener('input', calculate));
  calculate();
}

// ---------- DOM INIT & EVENT BINDINGS ----------
document.addEventListener('DOMContentLoaded', () => {
  renderMarketCarousel();
  renderLiveGrid();
  renderServices();
  renderWhyChoose();
  renderStats();
  renderPlans();
  renderCheckList();
  renderProcessSteps();
  renderBlogs();

  startCarouselAutoPlay();
  startLiveUpdatesEngine();

  // Carousel Prev/Next Buttons
  document.getElementById('mc-prev')?.addEventListener('click', prevSlide);
  document.getElementById('mc-next')?.addEventListener('click', nextSlide);

  // Pause Carousel on Hover
  const carouselCard = document.getElementById('market-carousel-card');
  if (carouselCard) {
    carouselCard.addEventListener('mouseenter', () => { isHovered = true; });
    carouselCard.addEventListener('mouseleave', () => { isHovered = false; });
  }

  // Consultation Modal Triggers
  const consultBtn = document.getElementById('consult-btn');
  const mobileConsultBtn = document.getElementById('mobile-consult-btn');
  const closeConsultBtn = document.getElementById('close-consult-modal');
  const btnTalkExpert = document.getElementById('btn-talk-expert');

  if (consultBtn) consultBtn.addEventListener('click', openConsultModal);
  if (btnTalkExpert) btnTalkExpert.addEventListener('click', openConsultModal);
  if (mobileConsultBtn) mobileConsultBtn.addEventListener('click', () => {
    closeMobileDrawer();
    openConsultModal();
  });
  if (closeConsultBtn) closeConsultBtn.addEventListener('click', closeConsultModal);

  if (consultModal) {
    consultModal.addEventListener('click', (e) => {
      if (e.target === consultModal) closeConsultModal();
    });
  }

  // Consultation Form Submit
  const consultForm = document.getElementById('consult-form');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeConsultModal();
      showToast("Free Consultation Booked! Our advisor will call you within 30 mins.");
    });
  }

  // Mobile Menu Overlay Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
  }
  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileDrawer);

  document.querySelectorAll('.m-link, .m-submenu a').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  window.toggleSubmenu = function(arrowEl) {
    const submenu = arrowEl.parentElement.nextElementSibling;
    if (submenu) {
      submenu.classList.toggle('open');
      arrowEl.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  };

  // ---------- SERVICES PAGE INTERACTIVITY ----------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const serviceCards = document.querySelectorAll('.service-detail-card');
  const searchInput = document.getElementById('service-search-input');

  function filterServices() {
    const activeTab = document.querySelector('.filter-tab.active');
    const category = activeTab ? activeTab.getAttribute('data-category') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    serviceCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const text = card.textContent.toLowerCase();

      const matchesCat = (category === 'all' || cardCategory === category);
      const matchesSearch = (!query || text.includes(query));

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterServices();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterServices);
  }

  // FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // ---------- MARKET PAGE INTERACTIVITY ----------
  const tfBtns = document.querySelectorAll('.tf-btn');
  tfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const moverTabs = document.querySelectorAll('.mover-tab');
  moverTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      moverTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Active Nav Link highlight on Scroll (only for in-page anchors)
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.classList.remove('active');
        if (current && href === `#${current}`) {
          link.classList.add('active');
        }
      }
    });
  });
});
