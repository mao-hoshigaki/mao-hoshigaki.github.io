/* ── Goods data ── */
/* shop: 'suzuri' | 'koufukudo' */
const GOODS = [
  /* ── SUZURI ── */
  {
    shop: 'suzuri',
    name: '舞い降りたまお アクリルスタンド',
    price: '¥2,502',
    img: 'images/舞い降りたまおアクリルスタンド.png.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19559741/acrylic-stand/70mm/clear',
  },
  {
    shop: 'suzuri',
    name: '舞い降りたまお アクリルキーホルダー',
    price: '¥1,439',
    img: 'images/舞い降りたまおアクリルキーホルダー.png.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19717157/acrylic-keychain/70x70mm/clear',
  },
  {
    shop: 'suzuri',
    name: 'ゴールデンマオ アクリルキーホルダー',
    price: '¥1,329',
    img: 'images/ゴールデンマオアクリルキーホルダー.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19717098/acrylic-keychain/70x70mm/white',
  },
  {
    shop: 'suzuri',
    name: '清らかなまお アクリルキーホルダー',
    price: '¥1,329',
    img: 'images/清らかなまおアクリルキーホルダー.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19717131/acrylic-keychain/70x70mm/clear',
  },
  {
    shop: 'suzuri',
    name: '舞い降りたまお ステッカー',
    price: '¥842',
    img: 'images/舞い降りたまおステッカー.png.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19559741/sticker/m/white',
  },
  {
    shop: 'suzuri',
    name: 'シークレットステッカー',
    price: '¥622',
    img: 'images/シークレットステッカー.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19289542/sticker/m/white',
  },
  {
    shop: 'suzuri',
    name: 'お花畑ステッカー',
    price: '¥622',
    img: 'images/お花畑ステッカー.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19289842/sticker/m/white',
  },
  {
    shop: 'suzuri',
    name: '清らかなまお ステッカー',
    price: '¥622',
    img: 'images/清らかなまおステッカー.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19990218/sticker/m/white',
  },
  {
    shop: 'suzuri',
    name: '清らかなまお Tシャツ',
    price: '¥3,421',
    img: 'images/清らかなまおTシャツ.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19559854/t-shirt/m/white',
  },
  {
    shop: 'suzuri',
    name: 'ゴールデンマオ Tシャツ',
    price: '¥3,641',
    img: 'images/ゴールデンマオTシャツ.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19619666/t-shirt/s/white',
  },
  {
    shop: 'suzuri',
    name: 'ゴールデンマオ スウェット',
    price: '¥4,809',
    img: 'images/ゴールデンマオスウェット.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19619666/sweat/s/black',
  },
  {
    shop: 'suzuri',
    name: 'お花畑スウェット',
    price: '¥4,809',
    img: 'images/お花畑スウェット.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19289670/sweat/m/black',
  },
  {
    shop: 'suzuri',
    name: '花畑パーカー（ビッグシルエット）',
    price: '¥6,248',
    img: 'images/花畑パーカー（ビックシルエット）.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19290430/big-hoodie/m/black',
  },
  {
    shop: 'suzuri',
    name: '花畑パーカー',
    price: '¥5,247',
    img: 'images/花畑パーカー.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19290430/hoodie/m/white',
  },
  {
    shop: 'suzuri',
    name: '猫又タンブラー',
    price: '¥3,597',
    img: 'images/猫又タンブラー.webp',
    url: 'https://suzuri.jp/Mao_Hoshigaki/19292107/thermo-tumbler/360ml/silver',
  },
  /* ── 幸福堂 ── */
  {
    shop: 'koufukudo',
    name: '広告塔Tシャツ',
    price: '¥1,940',
    img: 'https://baseec-img-mng.akamaized.net/images/item/origin/41ca7880be7ceecc857961b9bf099918.jpg?imformat=generic&q=90&im=Resize,width=640,type=normal',
    url: 'https://fukutaro86.thebase.in/items/116933652',
  },
  {
    shop: 'koufukudo',
    name: '広告塔タオルハンカチ',
    price: '¥888',
    img: 'https://baseec-img-mng.akamaized.net/images/item/origin/c305e5323914f855ba259ed65e09b869.jpg?imformat=generic&q=90&im=Resize,width=640,type=normal',
    url: 'https://fukutaro86.thebase.in/items/128788176',
  },
  {
    shop: 'koufukudo',
    name: '広告塔缶バッジ',
    price: '¥175',
    img: 'https://baseec-img-mng.akamaized.net/images/item/origin/e9abc28ae6ab86e4a57246cc2295cef7.png?imformat=generic&q=90&im=Resize,width=640,type=normal',
    url: 'https://fukutaro86.thebase.in/items/128790367',
  },
  {
    shop: 'koufukudo',
    name: '星柿⭐︎猫に煽られたい人のための缶バッチ',
    price: '¥708',
    img: 'https://baseec-img-mng.akamaized.net/images/item/origin/d87bb663d68988a589ced9cc90666dde.png?imformat=generic&q=90&im=Resize,width=640,type=normal',
    url: 'https://fukutaro86.thebase.in/items/144545660',
  },
  {
    shop: 'koufukudo',
    name: '星柿⭐︎猫に煽られたい人のためのバッグ',
    price: '¥1,974',
    img: 'https://baseec-img-mng.akamaized.net/images/item/origin/89c788be89ebf35309dfbe1fc78e8239.png?imformat=generic&q=90&im=Resize,width=640,type=normal',
    url: 'https://fukutaro86.thebase.in/items/144545864',
  },
];

/* ════════════════════════════════════════
   CAROUSEL
════════════════════════════════════════ */
const Carousel = (() => {
  const track = document.getElementById('slides-track');
  const dots = [...document.querySelectorAll('.carousel-dot')];
  const btnPrv = document.getElementById('arrow-prev');
  const btnNxt = document.getElementById('arrow-next');
  const pulse = document.getElementById('swipe-pulse');

  let cur = 0;
  let touchStartX = 0;
  let touched = false;

  function goTo(idx) {
    cur = idx;
    // track is 200% wide; each slide is 50% of track = 100vw
    track.style.transform = `translateX(-${idx * 50}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    AudioMgr.onSlideChange(idx);
  }

  function toggle() { goTo(cur === 0 ? 1 : 0); }

  btnPrv.addEventListener('click', toggle);
  btnNxt.addEventListener('click', toggle);
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.idx)));

  /* Touch swipe */
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touched = true;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (!touched) return;
    touched = false;
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 38) {
      goTo(delta > 0 ? 1 : 0);
      pulse.style.display = 'none';
    }
  });

  /* Mouse drag (desktop) */
  let mouseStartX = 0;
  let dragging = false;
  track.addEventListener('mousedown', e => { mouseStartX = e.clientX; dragging = true; });
  window.addEventListener('mouseup', e => {
    if (!dragging) return;
    dragging = false;
    const delta = mouseStartX - e.clientX;
    if (Math.abs(delta) > 38) goTo(delta > 0 ? 1 : 0);
  });
  track.addEventListener('dragstart', e => e.preventDefault());

  return { goTo, cur: () => cur };
})();


/* ════════════════════════════════════════
   AUDIO MANAGER
   Muted by default — browser autoplay policy.
   User clicks the mute button to enable audio.
════════════════════════════════════════ */
const AudioMgr = (() => {
  // Slide 1 audio = video element itself (no separate audio file needed)
  // Slide 2 audio = audio-b (NEKOMATA!)
  const vid = document.getElementById('hero-video');
  const ab = document.getElementById('audio-b');
  const btn = document.getElementById('mute-btn');
  const iM = document.getElementById('ico-muted');
  const iU = document.getElementById('ico-unmuted');

  let unmuted = false;
  let slide = 0;
  let fadeTid = null;

  const FADE_MS = 700;
  const FADE_STEP = 20;

  // Returns the media element for the currently visible slide
  function active() { return slide === 0 ? vid : ab; }
  function inactive() { return slide === 0 ? ab : vid; }

  function clamp(v) { return Math.max(0, Math.min(1, v)); }

  // Silence and stop an element (video: keep playing but mute; audio: pause)
  function silence(el) {
    el.volume = 0;
    if (el === vid) { vid.muted = true; }
    else { el.pause(); }
  }

  // Start playback (video is already looping; just unmute it)
  function start(el) {
    el.volume = 0;
    if (el === vid) { vid.muted = false; }
    else { el.play().catch(() => { }); }
  }

  function crossfade(fromEl, toEl) {
    if (fadeTid) { clearInterval(fadeTid); fadeTid = null; }
    const steps = Math.round(FADE_MS / FADE_STEP);
    let s = 0;
    start(toEl);

    fadeTid = setInterval(() => {
      s++;
      const t = s / steps;
      fromEl.volume = clamp(1 - t);
      toEl.volume = clamp(t);
      if (s >= steps) {
        clearInterval(fadeTid); fadeTid = null;
        silence(fromEl);
        toEl.volume = 1;
      }
    }, FADE_STEP);
  }

  function onSlideChange(idx) {
    const prev = slide;
    slide = idx;
    if (prev === idx || !unmuted) return;
    // inactive()/active() now reflect the new slide value
    crossfade(inactive(), active());
  }

  function toggle() {
    unmuted = !unmuted;
    iM.style.display = unmuted ? 'none' : '';
    iU.style.display = unmuted ? '' : 'none';

    if (unmuted) {
      // Enable only the active slide's audio
      start(active());
      active().volume = 1;
      silence(inactive());
    } else {
      // Silence everything; video keeps looping silently
      silence(vid);
      silence(ab);
    }
  }

  function setVideoHidden(hidden) {
    if (!unmuted) return;
    if (hidden) {
      crossfade(vid, ab);
    } else {
      crossfade(ab, vid);
    }
  }

  btn.addEventListener('click', toggle);
  return { onSlideChange, setVideoHidden };
})();


/* ════════════════════════════════════════
   GOODS GRID
════════════════════════════════════════ */
(function () {
  function renderGoods(shop, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    const items = GOODS.filter(g => g.shop === shop);
    if (items.length === 0) {
      grid.innerHTML = '<p class="g-empty">準備中です。お楽しみに！</p>';
      return;
    }
    const comingSoon = `
      <div class="g-card g-card--soon">
        <div class="g-img">
          <span class="g-soon-icon">✦</span>
        </div>
        <div class="g-info">
          <div class="g-name">Coming Soon</div>
          <span class="g-btn g-btn--soon">お楽しみに</span>
        </div>
      </div>`;
    grid.innerHTML = items.map(g => `
      <div class="g-card">
        <div class="g-img">
          ${g.img
        ? `<img src="${g.img}" alt="${g.name}" loading="lazy"/>`
        : `<span>${g.name}</span>`}
        </div>
        <div class="g-info">
          <div class="g-name">${g.name}</div>
          <div class="g-price">${g.price}（税込）</div>
          <a href="${g.url}" class="g-btn" target="_blank" rel="noopener noreferrer">Buy Now</a>
        </div>
      </div>`).join('') + comingSoon;
  }

  renderGoods('suzuri', 'goods-suzuri');
  renderGoods('koufukudo', 'goods-koufukudo');
})();


/* ════════════════════════════════════════
   ACCORDION
════════════════════════════════════════ */
(function () {
  document.querySelectorAll('.accordion-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // 他を閉じる
      document.querySelectorAll('.accordion-trigger').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = null;
      });
      // クリックされたものを開く（既に開いていれば閉じたまま）
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        const body = btn.nextElementSibling;
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
})();


/* ════════════════════════════════════════
   PROFILE IMAGE  —  click to toggle
════════════════════════════════════════ */
(function () {
  const img = document.querySelector('.profile-art img');
  if (!img) return;
  const IMG_A = 'images/Mao.png';
  const IMG_B = 'images/Mao_profile2.png';
  img.addEventListener('click', () => {
    if (img.classList.contains('glitching')) return;
    img.classList.add('glitching');
    setTimeout(() => {
      const isB = img.src.includes('Mao_profile2.png');
      img.src = isB ? IMG_A : IMG_B;
      img.style.objectPosition = isB ? '' : '50% 88%';
    }, 258);
    img.addEventListener('animationend', () => img.classList.remove('glitching'), { once: true });
  });
})();


/* ════════════════════════════════════════
   VIDEO CLICK TOGGLE  (PC only)
   クリックで動画を非表示 → ブラー背景のみ表示
   音楽は NEKOMATA! に切り替え
════════════════════════════════════════ */
(function () {
  const slide = document.getElementById('slide-video');
  if (!slide) return;
  let hidden = false;

  slide.addEventListener('click', () => {
    if (window.innerWidth < 768) return;
    hidden = !hidden;
    slide.classList.toggle('video-hidden', hidden);
    AudioMgr.setVideoHidden(hidden);
  });
})();


/* ════════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════ */
(function () {
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ════════════════════════════════════════
   EXTERNAL LINK MODAL
════════════════════════════════════════ */
(function () {
  const modal   = document.getElementById('ext-modal');
  const domain  = modal.querySelector('.ext-modal-domain');
  const confirm = modal.querySelector('.ext-modal-confirm');
  const cancel  = modal.querySelector('.ext-modal-cancel');
  let pending   = '';

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[target="_blank"]');
    if (!link) return;
    if (link.hostname === location.hostname) return;
    e.preventDefault();
    pending = link.href;
    try { domain.textContent = new URL(pending).hostname; }
    catch { domain.textContent = pending; }
    modal.classList.add('open');
  });

  confirm.addEventListener('click', function () {
    window.open(pending, '_blank', 'noopener,noreferrer');
    close();
  });

  cancel.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  function close() { modal.classList.remove('open'); pending = ''; }
})();


/* ════════════════════════════════════════
   HEADER  —  sticky on scroll
════════════════════════════════════════ */
(function () {
  const header = document.getElementById('site-header');
  const hero = document.getElementById('hero');

  new IntersectionObserver(([e]) => {
    header.classList.toggle('scrolled', !e.isIntersecting);
  }, { threshold: 0.05 }).observe(hero);
})();


/* ════════════════════════════════════════
   MUTE BUTTON PLACEMENT
   モバイル・タブレット(<1024px): circle-nav内
   PC(1024px+): headerのpc-nav直前に移動
════════════════════════════════════════ */
(function () {
  const btn = document.getElementById('mute-btn');
  const header = document.getElementById('site-header');
  const circleNav = document.getElementById('circle-nav');
  const pcNav = header.querySelector('.pc-nav');

  function place() {
    if (window.innerWidth >= 1024) {
      if (!header.contains(btn)) header.insertBefore(btn, pcNav);
    } else {
      if (!circleNav.contains(btn)) circleNav.appendChild(btn);
    }
  }

  place();
  window.addEventListener('resize', place);
})();


/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('sr-on');
      io.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  const targets = [
    ...document.querySelectorAll('#profile, #news, #fankit, #goods, #contact'),
    ...document.querySelectorAll('.g-card, .fankit-tag-card, .accordion-item'),
  ];

  const vh = window.innerHeight;
  targets.forEach(el => {
    if (el.getBoundingClientRect().top <= vh) return;
    el.classList.add('sr');
    if (el.classList.contains('g-card')) {
      const idx = [...el.parentElement.children].indexOf(el);
      el.style.transitionDelay = `${idx * 0.06}s`;
    }
    io.observe(el);
  });
})();

