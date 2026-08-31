/**
 * BANGLE MAISON - Header & Hero Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const siteHeader = document.getElementById('siteHeader');
  const announcementBar = document.getElementById('announcementBar');
  const closeAnnouncement = document.getElementById('closeAnnouncement');
  
  // Mobile Drawer Elements
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  
  // Search Overlay Elements
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  // Cart Drawer Elements
  const cartToggle = document.getElementById('cartToggle');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartCountEl = document.getElementById('cartCount');
  const cartDrawerCountEl = document.getElementById('cartDrawerCount');
  const emptyCartEl = document.getElementById('emptyCart');
  const cartItemsListEl = document.getElementById('cartItemsList');
  const cartFooterEl = document.getElementById('cartFooter');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const addDemoItemBtn = document.getElementById('addDemoItemBtn');
  const startShoppingBtn = document.getElementById('startShoppingBtn');
  
  // Hero Slider Elements
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-pagination .dot');
  const prevSlideBtn = document.getElementById('prevSlide');
  const nextSlideBtn = document.getElementById('nextSlide');

  // State Management
  let currentSlideIndex = 0;
  let slideInterval = null;
  let cartItems = [];

  /* --------------------------------------------------------------------------
     1. Announcement Bar & Sticky Header Logic
     -------------------------------------------------------------------------- */
  if (closeAnnouncement && announcementBar) {
    closeAnnouncement.addEventListener('click', () => {
      announcementBar.classList.add('hide');
    });
  }

  // Handle sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('is-sticky');
    } else {
      siteHeader.classList.remove('is-sticky');
    }
  });

  /* --------------------------------------------------------------------------
     2. Mobile Drawer & Accordion Submenus
     -------------------------------------------------------------------------- */
  function openMobileDrawer() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeMobileDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileDrawer);

  // Accordion submenus inside drawer
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parentItem = trigger.parentElement;
      const isOpen = parentItem.classList.contains('open');

      // Close all accordions
      document.querySelectorAll('.mobile-nav-item.has-accordion').forEach(item => {
        item.classList.remove('open');
      });

      // Toggle clicked item
      if (!isOpen) {
        parentItem.classList.add('open');
      }
    });
  });

  /* --------------------------------------------------------------------------
     3. Search Overlay
     -------------------------------------------------------------------------- */
  function openSearch() {
    searchOverlay.classList.add('active');
    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 200);
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
  }

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  // Close search overlay with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
  });

  /* --------------------------------------------------------------------------
     4. Cart Drawer & Cart Logic
     -------------------------------------------------------------------------- */
  function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartToggle) cartToggle.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (startShoppingBtn) startShoppingBtn.addEventListener('click', closeCart);

  // Add Item to Cart Demonstration
  function addItemToCart(item) {
    const existing = cartItems.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }
    updateCartUI();
    openCart();

    // Animate cart badge bump
    cartCountEl.classList.add('bump');
    setTimeout(() => cartCountEl.classList.remove('bump'), 300);
  }

  function removeItemFromCart(id) {
    cartItems = cartItems.filter(i => i.id !== id);
    updateCartUI();
  }

  function updateCartUI() {
    const totalCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
    const subtotal = cartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    cartCountEl.textContent = totalCount;
    cartDrawerCountEl.textContent = totalCount;

    if (cartItems.length === 0) {
      emptyCartEl.style.display = 'block';
      cartItemsListEl.style.display = 'none';
      cartFooterEl.style.display = 'none';
    } else {
      emptyCartEl.style.display = 'none';
      cartItemsListEl.style.display = 'block';
      cartFooterEl.style.display = 'block';

      cartSubtotalEl.textContent = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

      cartItemsListEl.innerHTML = cartItems.map(item => `
        <div class="cart-item-card" style="display: flex; gap: 1rem; margin-bottom: 1.2rem; align-items: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 1rem;">
          <img src="${item.image}" alt="${item.title}" style="width: 65px; height: 65px; object-fit: cover; border-radius: 4px;">
          <div style="flex: 1;">
            <h5 style="font-family: var(--font-serif); font-size: 0.95rem; color: var(--color-burgundy);">${item.title}</h5>
            <p style="font-size: 0.8rem; color: #666;">Qty: ${item.quantity} x $${item.price.toLocaleString()}</p>
          </div>
          <button onclick="window.removeCartItem('${item.id}')" style="color: #999; font-size: 1.2rem;">&times;</button>
        </div>
      `).join('');
    }
  }

  // Expose remove handler globally for inline onclick string
  window.removeCartItem = removeItemFromCart;

  if (addDemoItemBtn) {
    addDemoItemBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addItemToCart({
        id: 'bangle-01',
        title: '22K Royal Gold Kada Bangle',
        price: 1850,
        image: 'https://images.unsplash.com/photo-1611591475179-42dd450d0322?q=80&w=200&auto=format&fit=crop'
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. Hero Slider Logic
     -------------------------------------------------------------------------- */
  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlideIndex = index;
  }

  function nextSlide() {
    const newIndex = (currentSlideIndex + 1) % slides.length;
    goToSlide(newIndex);
  }

  function prevSlide() {
    const newIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    goToSlide(newIndex);
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      goToSlide(index);
      startAutoSlide();
    });
  });

  // Start initial auto slider
  startAutoSlide();

  /* --------------------------------------------------------------------------
     6. Shop by Collection Interactive Modal & Quick View
     -------------------------------------------------------------------------- */
  const collectionCards = document.querySelectorAll('.collection-card');
  const collectionModalOverlay = document.getElementById('collectionModalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalCategoryTitle = document.getElementById('modalCategoryTitle');
  const modalCategoryDesc = document.getElementById('modalCategoryDesc');
  const modalCategoryImg = document.getElementById('modalCategoryImg');
  const modalItemCount = document.getElementById('modalItemCount');
  const modalBadge = document.getElementById('modalBadge');
  const modalExploreBtn = document.getElementById('modalExploreBtn');

  // Collection details database
  const collectionData = {
    'traditional': {
      title: 'Traditional Bangles',
      badge: 'HERITAGE CLASSICS',
      desc: 'Inspired by ancient royal dynasties, our traditional bangles showcase intricate filigree, nakshi artwork, and pure 22K yellow gold craftsmanship.',
      count: '48+ Designs',
      img: 'images/traditional.jpg'
    },
    'bridal': {
      title: 'Bridal Bangles Collection',
      badge: 'SIGNATURE COUTURE',
      desc: 'Complete your dream bridal ensemble with our magnificent red chooda, uncut polki kada, and sparkling diamond embedded bridal sets.',
      count: '62+ Designs',
      img: 'images/bridal.jpg'
    },
    'kundan': {
      title: 'Kundan & Polki Bangles',
      badge: 'ROYAL EMBEDDED',
      desc: 'Feature authentic uncut diamonds and vibrant meena foil backings, handcrafted meticulously by Jaipur master goldsmiths.',
      count: '35+ Designs',
      img: 'images/kundan.jpg'
    },
    'meenakari': {
      title: 'Meenakari Enamel Bangles',
      badge: 'ARTISANAL COLOR',
      desc: 'Vibrant hand-enameled motifs celebrating peacock blues, ruby reds, and emerald greens blended with high karat yellow gold.',
      count: '29+ Designs',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'
    },
    'pearl': {
      title: 'Lustrous Pearl Bangles',
      badge: 'ELEGANT ESSENTIALS',
      desc: 'Selected South Sea and freshwater cultured pearls set in intricate gold cage frames for timeless grace and poise.',
      count: '24+ Designs',
      img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop'
    },
    'glass': {
      title: 'Glass Bangles Collection',
      badge: 'TRADITIONAL SHINE',
      desc: 'Handcrafted traditional glass bangles in rich ruby reds and sparkling gold embellishments for classic elegance.',
      count: '40+ Designs',
      img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop'
    },
    'kids': {
      title: 'Kids & Baby Bangles',
      badge: 'SAFE & DELICATE',
      desc: 'Lightweight, smooth-finished, allergen-free gold and silver bangles with safety latches designed specifically for little wrist comfort.',
      count: '18+ Designs',
      img: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop'
    },
    'gold-plated': {
      title: '22K Gold Plated Bangles',
      badge: 'EVERYDAY LUXURY',
      desc: 'Premium anti-tarnish micro gold plated alloy bangles offering royal aesthetics and long-lasting brilliant shine for daily wear.',
      count: '55+ Designs',
      img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop'
    },
    'royal-kada': {
      title: 'Royal Kada Bangles',
      badge: 'ROYAL MASTERPIECE',
      desc: 'Heavyweight handcrafted 22K solid gold kada bangles engraved with royal heritage motifs and lion-head terminals.',
      count: '30+ Designs',
      img: 'https://images.unsplash.com/photo-1611591475179-42dd450d0322?q=80&w=600&auto=format&fit=crop'
    },
    'diamond-cuff': {
      title: 'Diamond Cuff Bangles',
      badge: 'LUXURY BRILLIANCE',
      desc: 'High-clarity VVS certified diamonds pave-set along sleek 18K white and yellow gold open-end cuff frames.',
      count: '25+ Designs',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'
    },
    'emerald-cut': {
      title: 'Emerald Cut Bangles',
      badge: 'GEMSTONE COUTURE',
      desc: 'Deep green natural Zambian emeralds framed by tapered diamond baguettes set in solid gold structure.',
      count: '20+ Designs',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'
    },
    'antique-finish': {
      title: 'Antique Finish Bangles',
      badge: 'VINTAGE ARTISTRY',
      desc: 'Darkened gold patina finish combined with ruby accents for an authentic heirlooms look passed down through generations.',
      count: '38+ Designs',
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
    },
    'rose-gold': {
      title: 'Rose Gold Bangles',
      badge: 'CONTEMPORARY CHIC',
      desc: 'Warm blush-pink 18K rose gold bangles engineered for stacking, casual elegance, and modern cocktail attire.',
      count: '32+ Designs',
      img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop'
    },
    'ruby-embedded': {
      title: 'Ruby Embedded Bangles',
      badge: 'ROYAL RED',
      desc: 'Pigeon-blood natural rubies studded along floral filigree gold patterns, creating a mesmerizing sparkle.',
      count: '28+ Designs',
      img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop'
    },
    'temple-design': {
      title: 'Temple Design Bangles',
      badge: 'SACRED ARTWORK',
      desc: 'Hand-sculpted divine deity motifs and floral relief work rendered in matte 22K yellow gold.',
      count: '42+ Designs',
      img: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop'
    },
    'solitaire-kada': {
      title: 'Solitaire Kada Bangles',
      badge: 'SOLITAIRE EDITION',
      desc: 'Single prominent solitaire diamond focal points anchored on solid gold kada bangles for understated grandeur.',
      count: '15+ Designs',
      img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop'
    }
  };

  function openCollectionModal(categoryKey) {
    const info = collectionData[categoryKey];
    if (!info) return;

    modalCategoryTitle.textContent = info.title;
    modalBadge.textContent = info.badge;
    modalCategoryDesc.textContent = info.desc;
    modalItemCount.textContent = info.count;
    modalCategoryImg.src = info.img;

    collectionModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCollectionModal() {
    collectionModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  collectionCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      openCollectionModal(category);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const category = card.dataset.category;
        openCollectionModal(category);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeCollectionModal);
  if (collectionModalOverlay) {
    collectionModalOverlay.addEventListener('click', (e) => {
      if (e.target === collectionModalOverlay) closeCollectionModal();
    });
  }

  if (modalExploreBtn) {
    modalExploreBtn.addEventListener('click', () => {
      closeCollectionModal();
      // Scroll to shop or show notification
      const shopSection = document.getElementById('shop') || document.getElementById('collections');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Hero Slider Hover & Touch Gestures
  const heroSliderWrap = document.getElementById('heroSlider');
  if (heroSliderWrap) {
    heroSliderWrap.addEventListener('mouseenter', stopAutoSlide);
    heroSliderWrap.addEventListener('mouseleave', startAutoSlide);

    let heroStartX = 0;
    heroSliderWrap.addEventListener('touchstart', (e) => {
      heroStartX = e.touches[0].clientX;
      stopAutoSlide();
    }, { passive: true });

    heroSliderWrap.addEventListener('touchend', (e) => {
      const heroEndX = e.changedTouches[0].clientX;
      const heroDiffX = heroStartX - heroEndX;
      if (Math.abs(heroDiffX) > 40) {
        if (heroDiffX > 0) nextSlide();
        else prevSlide();
      }
      startAutoSlide();
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     7. Feature Banners Auto-Scrolling Carousel (Responsive Mobile/Tablet)
     -------------------------------------------------------------------------- */
  const bannerCarouselWrap = document.getElementById('featureBannersCarousel');
  const bannerTrack = document.getElementById('featureBannersTrack');
  const bannerDots = document.querySelectorAll('#bannerPaginationDots .b-dot');
  const bannerCards = document.querySelectorAll('.feature-banner-card');
  let currentBannerIndex = 0;
  let bannerInterval = null;

  function updateBannerSlide(index) {
    if (!bannerTrack || bannerCards.length === 0) return;
    currentBannerIndex = (index + bannerCards.length) % bannerCards.length;
    
    // Only translate horizontal track on mobile/tablet (<= 860px)
    if (window.innerWidth <= 860) {
      bannerTrack.style.transform = `translateX(-${currentBannerIndex * 100}%)`;
    } else {
      bannerTrack.style.transform = 'none';
    }

    bannerDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentBannerIndex);
    });
  }

  function startBannerAutoSlide() {
    stopBannerAutoSlide();
    bannerInterval = setInterval(() => {
      if (window.innerWidth <= 860) {
        updateBannerSlide(currentBannerIndex + 1);
      }
    }, 3800);
  }

  function stopBannerAutoSlide() {
    if (bannerInterval) clearInterval(bannerInterval);
  }

  bannerDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.bindex);
      updateBannerSlide(idx);
      startBannerAutoSlide();
    });
  });

  if (bannerCarouselWrap) {
    bannerCarouselWrap.addEventListener('mouseenter', stopBannerAutoSlide);
    bannerCarouselWrap.addEventListener('mouseleave', startBannerAutoSlide);

    // Touch gesture support for banner carousel
    let startX = 0;
    bannerCarouselWrap.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopBannerAutoSlide();
    }, { passive: true });

    bannerCarouselWrap.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          updateBannerSlide(currentBannerIndex + 1);
        } else {
          updateBannerSlide(currentBannerIndex - 1);
        }
      }
      startBannerAutoSlide();
    }, { passive: true });
  }

  window.addEventListener('resize', () => {
    updateBannerSlide(currentBannerIndex);
  });

  // Start auto-sliding for banners
  startBannerAutoSlide();
});

/* ==========================================================================
   Centralized Products Catalog Data & Dynamic PDP Handler
   ========================================================================== */
window.PRODUCTS_DATA = {
  "kundan-bridal-set": {
    id: "kundan-bridal-set",
    title: "Kundan Bridal Bangles Set",
    category: "Bridal Bangles",
    price: "₹1,499",
    originalPrice: "₹2,199",
    discount: "32% OFF",
    rating: "★★★★★",
    reviewsCount: "(128 Reviews)",
    description: "Exquisite kundan bangles with intricate craftsmanship. Perfect for weddings and festive occasions.",
    material: "Brass with Gold Plating",
    stoneType: "Kundan",
    finish: "High Polish 22K Gold",
    occasion: "Wedding, Festive, Party",
    packContains: "1 Set of Bangles",
    sizes: ["2.2", "2.4", "2.6", "2.8", "2.10", "2.12"],
    mainImage: "images/kundan.jpg",
    images: ["images/kundan.jpg", "images/bridal.jpg", "images/traditional.jpg", "images/kundan.jpg", "images/bridal.jpg"]
  },
  "meenakari-handpainted": {
    id: "meenakari-handpainted",
    title: "Meenakari Hand-Painted Bangles",
    category: "Meenakari Bangles",
    price: "₹1,299",
    originalPrice: "₹1,899",
    discount: "31% OFF",
    rating: "★★★★★",
    reviewsCount: "(94 Reviews)",
    description: "Vibrant royal Rajasthani Meenakari hand-painted bangles embedded with sparkling Austrian stones.",
    material: "Pure Brass & Enamel",
    stoneType: "Meenakari & Stone",
    finish: "Micro Gold Plated",
    occasion: "Festive, Wedding, Reception",
    packContains: "Set of 4 Bangles",
    sizes: ["2.4", "2.6", "2.8"],
    mainImage: "images/traditional.jpg",
    images: ["images/traditional.jpg", "images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg", "images/kundan.jpg"]
  },
  "gold-plated-kada": {
    id: "gold-plated-kada",
    title: "Royal 22K Gold Plated Kada",
    category: "Traditional Bangles",
    price: "₹2,199",
    originalPrice: "₹2,899",
    discount: "24% OFF",
    rating: "★★★★★",
    reviewsCount: "(76 Reviews)",
    description: "Timeless 22K yellow gold micro-plated kada bangles with floral nakshi carvings.",
    material: "Brass with 22K Gold Finish",
    stoneType: "Uncut Gem / Kundan",
    finish: "Antic Gold High Gloss",
    occasion: "Daily Wear, Festive, Puja",
    packContains: "Set of 2 Kada Bangles",
    sizes: ["2.4", "2.6", "2.8", "2.10"],
    mainImage: "images/kundan.jpg",
    images: ["images/kundan.jpg", "images/traditional.jpg", "images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg"]
  },
  "cultured-pearl-chooda": {
    id: "cultured-pearl-chooda",
    title: "Cultured Pearl Chooda Set",
    category: "Bridal Bangles",
    price: "₹1,899",
    originalPrice: "₹2,499",
    discount: "24% OFF",
    rating: "★★★★★",
    reviewsCount: "(112 Reviews)",
    description: "Classic pearl-studded kada bangles lined with emerald-tinted accents for graceful evenings.",
    material: "Alloy with Gold Plating",
    stoneType: "Cultured Pearls & Cubic Zirconia",
    finish: "Glossy Gold Finish",
    occasion: "Party, Engagement, Festive",
    packContains: "1 Pair of Kada",
    sizes: ["2.2", "2.4", "2.6", "2.8"],
    mainImage: "images/bridal.jpg",
    images: ["images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg", "images/bridal.jpg", "images/kundan.jpg"]
  },
  "multi-stone-zircon": {
    id: "multi-stone-zircon",
    title: "Multi-Stone Zircon Bangles",
    category: "Stone Bangles",
    price: "₹1,699",
    originalPrice: "₹2,299",
    discount: "26% OFF",
    rating: "★★★★★",
    reviewsCount: "(85 Reviews)",
    description: "Intricately paved multicolor and clear zircon stones designed to complement heavy ethnic lehengas.",
    material: "Copper Alloy",
    stoneType: "American Diamond & Rubies",
    finish: "Rhodium & Gold Two-Tone",
    occasion: "Wedding, Cocktail, Festive",
    packContains: "Set of 4 Bangles",
    sizes: ["2.4", "2.6", "2.8", "2.10"],
    mainImage: "images/traditional.jpg",
    images: ["images/traditional.jpg", "images/kundan.jpg", "images/bridal.jpg", "images/traditional.jpg", "images/bridal.jpg"]
  },
  "velvet-bridal-chura": {
    id: "velvet-bridal-chura",
    title: "Grand Velvet Bridal Chura",
    category: "Bridal Bangles",
    price: "₹2,799",
    originalPrice: "₹3,799",
    discount: "26% OFF",
    rating: "★★★★★",
    reviewsCount: "(156 Reviews)",
    description: "Grand bridal chura and kada masterpiece crafted with velvet texture, gold bells, and uncut gems.",
    material: "Brass, Velvet & Acrylic",
    stoneType: "Premium Kundan & Polki",
    finish: "Matte Royal Gold",
    occasion: "Wedding, Shaadi, Reception",
    packContains: "Full Bridal Chooda Set",
    sizes: ["2.4", "2.6", "2.8"],
    mainImage: "images/bridal.jpg",
    images: ["images/bridal.jpg", "images/traditional.jpg", "images/kundan.jpg", "images/bridal.jpg", "images/traditional.jpg"]
  },
  "antique-temple-kada": {
    id: "antique-temple-kada",
    title: "Antique Temple Heritage Kada",
    category: "Traditional Bangles",
    price: "₹999",
    originalPrice: "₹1,399",
    discount: "28% OFF",
    rating: "★★★★☆",
    reviewsCount: "(64 Reviews)",
    description: "Pure traditional temple jewelry motif bangles featuring auspicious floral engravings.",
    material: "High Grade Brass",
    stoneType: "Synthetic Ruby / Emerald",
    finish: "Antique Matte Gold",
    occasion: "Puja, Festive, Traditional",
    packContains: "Set of 2 Bangles",
    sizes: ["2.4", "2.6", "2.8", "2.10"],
    mainImage: "images/traditional.jpg",
    images: ["images/traditional.jpg", "images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg", "images/kundan.jpg"]
  },
  "jaipuri-lac-bangles": {
    id: "jaipuri-lac-bangles",
    title: "Handcrafted Jaipuri Lac Bangles",
    category: "Lac Bangles",
    price: "₹899",
    originalPrice: "₹1,299",
    discount: "30% OFF",
    rating: "★★★★☆",
    reviewsCount: "(48 Reviews)",
    description: "Authentic handcrafted Rajasthani Lac bangles with mirror inlay work and vibrant festive colors.",
    material: "Natural Lac & Mirror",
    stoneType: "Glass Mirrors & Crystals",
    finish: "Handmade Gloss",
    occasion: "Teej, Karwa Chauth, Festive",
    packContains: "Set of 6 Bangles",
    sizes: ["2.4", "2.6", "2.8"],
    mainImage: "images/kundan.jpg",
    images: ["images/kundan.jpg", "images/traditional.jpg", "images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg"]
  },
  "copper-wire-weave": {
    id: "copper-wire-weave",
    title: "Copper Wire Weave Bangles",
    category: "Traditional Bangles",
    price: "₹799",
    originalPrice: "₹1,099",
    discount: "27% OFF",
    rating: "★★★★☆",
    reviewsCount: "(52 Reviews)",
    description: "Sturdy copper alloy base bangles with rich gold plating and comfortable smooth inner contour.",
    material: "Copper Base",
    stoneType: "Kundan Gems",
    finish: "Micro Gold Layered",
    occasion: "Daily Wear, Festive",
    packContains: "Pair of 2 Bangles",
    sizes: ["2.2", "2.4", "2.6", "2.8", "2.10"],
    mainImage: "images/traditional.jpg",
    images: ["images/traditional.jpg", "images/kundan.jpg", "images/bridal.jpg", "images/traditional.jpg", "images/bridal.jpg"]
  },
  "kids-floral-enamel": {
    id: "kids-floral-enamel",
    title: "Kids Floral Enamel Bangles",
    category: "Kids Bangles",
    price: "₹599",
    originalPrice: "₹899",
    discount: "33% OFF",
    rating: "★★★★★",
    reviewsCount: "(39 Reviews)",
    description: "Lightweight, skin-friendly, nickel-free festive bangles designed specially for young girls.",
    material: "Hypoallergenic Brass",
    stoneType: "Smooth Colored Enamel",
    finish: "Nickel-Free Gold Polish",
    occasion: "Festive, Family Functions, Birthdays",
    packContains: "Set of 4 Small Bangles",
    sizes: ["1.12", "2.0", "2.2"],
    mainImage: "images/bridal.jpg",
    images: ["images/bridal.jpg", "images/traditional.jpg", "images/kundan.jpg", "images/bridal.jpg", "images/kundan.jpg"]
  },
  "ruby-polki-kada": {
    id: "ruby-polki-kada",
    title: "Ruby & Emerald Polki Kada",
    category: "Bridal Bangles",
    price: "₹2,399",
    originalPrice: "₹3,199",
    discount: "25% OFF",
    rating: "★★★★★",
    reviewsCount: "(88 Reviews)",
    description: "Dazzling handcrafted bridal polki bangles intricately set in antique gold tones for luxury occasions.",
    material: "Brass with 22K Gold Finish",
    stoneType: "Uncut Polki & Ruby",
    finish: "High Gloss Gold",
    occasion: "Wedding, Engagement, Sangeet",
    packContains: "Set of 2 Heavy Kada",
    sizes: ["2.4", "2.6", "2.8"],
    mainImage: "images/kundan.jpg",
    images: ["images/kundan.jpg", "images/bridal.jpg", "images/traditional.jpg", "images/kundan.jpg", "images/bridal.jpg"]
  },
  "glass-crystal-latkan": {
    id: "glass-crystal-latkan",
    title: "Glass Crystal Latkan Bangles",
    category: "Traditional Bangles",
    price: "₹1,199",
    originalPrice: "₹1,599",
    discount: "25% OFF",
    rating: "★★★★★",
    reviewsCount: "(65 Reviews)",
    description: "Traditional crystal faceted bangles encrusted with golden glitter trims and hanging latkan drops.",
    material: "Glass & Brass Rim",
    stoneType: "Faceted Crystals",
    finish: "Lustrous Lacquer",
    occasion: "Puja, Karwa Chauth, Weddings",
    packContains: "Set of 12 Bangles",
    sizes: ["2.4", "2.6", "2.8"],
    mainImage: "images/traditional.jpg",
    images: ["images/traditional.jpg", "images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg", "images/bridal.jpg"]
  },
  "twin-layered-kundan": {
    id: "twin-layered-kundan",
    title: "Twin Layered Kundan Kada",
    category: "Kundan Bangles",
    price: "₹1,399",
    originalPrice: "₹1,799",
    discount: "22% OFF",
    rating: "★★★★★",
    reviewsCount: "(42 Reviews)",
    description: "Twin row embedded kundan stones on gold plated curved frames for modern royal elegance.",
    material: "Brass Alloy",
    stoneType: "White Glass Kundan",
    finish: "Micro Gold Layered",
    occasion: "Reception, Festive, Parties",
    packContains: "Pair of 2 Bangles",
    sizes: ["2.2", "2.4", "2.6", "2.8"],
    mainImage: "images/kundan.jpg",
    images: ["images/kundan.jpg", "images/traditional.jpg", "images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg"]
  },
  "rose-gold-diamond-cuffs": {
    id: "rose-gold-diamond-cuffs",
    title: "Rose Gold Diamond Cuffs",
    category: "Designer Cuffs",
    price: "₹2,599",
    originalPrice: "₹3,499",
    discount: "26% OFF",
    rating: "★★★★★",
    reviewsCount: "(115 Reviews)",
    description: "Modern rose gold plated openable statement cuffs adorned with channel set American diamonds.",
    material: "Rose Gold Plated Brass",
    stoneType: "Cubic Zirconia Diamond",
    finish: "High Gloss Rose Finish",
    occasion: "Cocktail, Modern Reception, Evening",
    packContains: "1 Statement Cuff",
    sizes: ["2.4", "2.6", "2.8"],
    mainImage: "images/bridal.jpg",
    images: ["images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg", "images/bridal.jpg", "images/kundan.jpg"]
  },
  "green-onyx-gemstone": {
    id: "green-onyx-gemstone",
    title: "Green Onyx Gemstone Bangles",
    category: "Stone Bangles",
    price: "₹1,499",
    originalPrice: "₹1,999",
    discount: "25% OFF",
    rating: "★★★★☆",
    reviewsCount: "(34 Reviews)",
    description: "Rich emerald green stones framed by delicate floral gold work, lightweight and elegant for day wear.",
    material: "Copper Brass",
    stoneType: "Onyx Synthetic Gem",
    finish: "22K Yellow Gold Polish",
    occasion: "Daily, Festive, Family Gatherings",
    packContains: "Set of 4 Bangles",
    sizes: ["2.4", "2.6", "2.8", "2.10"],
    mainImage: "images/traditional.jpg",
    images: ["images/traditional.jpg", "images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg", "images/bridal.jpg"]
  },
  "rajputi-royal-chuda": {
    id: "rajputi-royal-chuda",
    title: "Traditional Rajputi Royal Chuda",
    category: "Bridal Bangles",
    price: "₹3,199",
    originalPrice: "₹4,299",
    discount: "26% OFF",
    rating: "★★★★★",
    reviewsCount: "(97 Reviews)",
    description: "Authentic royal Rajputi bridal chuda set with pure pearl edging and gold elephant motifs.",
    material: "Ivory Acrylic & Brass",
    stoneType: "White & Amber Kundan",
    finish: "Royal Heritage Polish",
    occasion: "Traditional Rajput Wedding",
    packContains: "Full 32-Piece Chuda Set",
    sizes: ["2.4", "2.6", "2.8"],
    mainImage: "images/bridal.jpg",
    images: ["images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg", "images/bridal.jpg", "images/traditional.jpg"]
  },
  "silk-thread-bangles": {
    id: "silk-thread-bangles",
    title: "Classic Silk Thread Bangles",
    category: "Traditional Bangles",
    price: "₹699",
    originalPrice: "₹999",
    discount: "30% OFF",
    rating: "★★★★★",
    reviewsCount: "(73 Reviews)",
    description: "Silk thread wrapped festive bangles lined with golden ball chains and crystal borders.",
    material: "Pure Silk Thread & Plastic Base",
    stoneType: "Rhinestones",
    finish: "Handwoven Silk",
    occasion: "Haldi, Mehendi, Casual Wear",
    packContains: "Set of 12 Bangles",
    sizes: ["2.4", "2.6", "2.8"],
    mainImage: "images/traditional.jpg",
    images: ["images/traditional.jpg", "images/bridal.jpg", "images/kundan.jpg", "images/traditional.jpg", "images/bridal.jpg"]
  },
  "navratna-kada-set": {
    id: "navratna-kada-set",
    title: "Navratna Multicolor Kada Set",
    category: "Stone Bangles",
    price: "₹1,799",
    originalPrice: "₹2,399",
    discount: "25% OFF",
    rating: "★★★★★",
    reviewsCount: "(58 Reviews)",
    description: "Auspicious 9-gemstone Navratna openable kada with intricately engraved peacocks on the terminals.",
    material: "High Grade Brass",
    stoneType: "Navratna 9 Planetary Gems",
    finish: "Antique Gold",
    occasion: "Festive, Astrology, Religious Events",
    packContains: "Set of 2 Kada",
    sizes: ["2.4", "2.6", "2.8"],
    mainImage: "images/kundan.jpg",
    images: ["images/kundan.jpg", "images/bridal.jpg", "images/traditional.jpg", "images/kundan.jpg", "images/bridal.jpg"]
  },
  "matte-finish-bangles": {
    id: "matte-finish-bangles",
    title: "Festive Matte Finish Gold Bangles",
    category: "Traditional Bangles",
    price: "₹1,599",
    originalPrice: "₹2,099",
    discount: "24% OFF",
    rating: "★★★★★",
    reviewsCount: "(67 Reviews)",
    description: "South Indian style matte finish temple bangles depicting floral creepers and goddess lakshmi motifs.",
    material: "Brass with Micro Gold",
    stoneType: "Kemp Stones",
    finish: "Matte Gold Texture",
    occasion: "Temple, Festival, Weddings",
    packContains: "Set of 4 Bangles",
    sizes: ["2.4", "2.6", "2.8"],
    mainImage: "images/traditional.jpg",
    images: ["images/traditional.jpg", "images/kundan.jpg", "images/bridal.jpg", "images/traditional.jpg", "images/bridal.jpg"]
  },
  "minimalist-stackable-cuffs": {
    id: "minimalist-stackable-cuffs",
    title: "Minimalist Sleek Stackable Cuffs",
    category: "Designer Cuffs",
    price: "₹1,099",
    originalPrice: "₹1,499",
    discount: "27% OFF",
    rating: "★★★★★",
    reviewsCount: "(82 Reviews)",
    description: "Contemporary lightweight stackable metal bangles with geometric polished surfaces.",
    material: "Stainless Steel with 18K Gold PVD",
    stoneType: "Single Solitaire Crystal",
    finish: "Mirror Polish",
    occasion: "Office Wear, Daily, Casual Outings",
    packContains: "Set of 3 Stackable Cuffs",
    sizes: ["2.2", "2.4", "2.6"],
    mainImage: "images/bridal.jpg",
    images: ["images/bridal.jpg", "images/traditional.jpg", "images/kundan.jpg", "images/bridal.jpg", "images/kundan.jpg"]
  }
};

// Global Handler to make all Product Cards clickable
document.addEventListener('click', (e) => {
  const card = e.target.closest('.product-card') || e.target.closest('.shop-item-card');
  const isWishlist = e.target.closest('.wishlist-btn') || e.target.closest('.shop-item-wishlist-btn') || e.target.closest('.pdp-wishlist-circle');
  
  if (card && !isWishlist) {
    const pId = card.getAttribute('data-id');
    if (pId) {
      window.location.href = `product-detail.html?id=${pId}`;
    }
  }
});

/* ==========================================================================
   Shop Catalog Category Filtering, Sorting, & Mobile Drawer
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const desktopPills = document.querySelectorAll('#desktopCategoryPills .category-pill-btn');
  const mobileCatItems = document.querySelectorAll('#mobileCategorySlider .mobile-cat-item');
  const shopGrid = document.getElementById('shopCardsGrid');
  const desktopResultCount = document.getElementById('desktopResultCount');
  const mobileResultCount = document.getElementById('mobileResultCount');
  const desktopSort = document.getElementById('desktopSortSelect');

  // Mobile Filter Drawer Toggle
  const mobileFilterBtn = document.getElementById('mobileFilterBtn');
  const filterSidebar = document.getElementById('filterSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  if (mobileFilterBtn && filterSidebar && sidebarBackdrop) {
    mobileFilterBtn.addEventListener('click', () => {
      filterSidebar.classList.add('open');
      sidebarBackdrop.classList.add('active');
    });

    sidebarBackdrop.addEventListener('click', () => {
      filterSidebar.classList.remove('open');
      sidebarBackdrop.classList.remove('active');
    });
  }

  // Filter Group Accordions in sidebar
  document.querySelectorAll('.filter-group-title').forEach(title => {
    title.addEventListener('click', () => {
      const group = title.closest('.filter-group');
      if (group) group.classList.toggle('collapsed');
    });
  });

  // Price slider live value
  const priceInput = document.getElementById('priceRangeInput');
  const priceMaxVal = document.getElementById('priceRangeMaxVal');
  if (priceInput && priceMaxVal) {
    priceInput.addEventListener('input', (e) => {
      priceMaxVal.textContent = '₹' + parseInt(e.target.value).toLocaleString() + '+';
    });
  }

  // Category Filter Function
  function filterCategory(cat) {
    // Update Desktop Pills active class
    desktopPills.forEach(pill => {
      if (pill.dataset.category === cat) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update Mobile Slider active class
    mobileCatItems.forEach(item => {
      if (item.dataset.category === cat) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Filter Cards in Grid
    if (shopGrid) {
      const cards = shopGrid.querySelectorAll('.shop-item-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const cardCat = card.dataset.category || '';
        if (cat === 'all' || cardCat.includes(cat) || cat.includes(cardCat)) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const countText = cat === 'all' ? `Showing 1–24 of 240 products` : `Showing 1–${visibleCount} of ${visibleCount} products`;
      if (desktopResultCount) desktopResultCount.textContent = countText;
      if (mobileResultCount) mobileResultCount.textContent = countText;
    }
  }

  // Desktop Pills Click
  desktopPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.category;
      filterCategory(cat);
    });
  });

  // Mobile Category Items Click
  mobileCatItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = item.dataset.category;
      filterCategory(cat);
    });
  });

  // Sort Handling
  if (desktopSort && shopGrid) {
    desktopSort.addEventListener('change', () => {
      const val = desktopSort.value;
      const cards = Array.from(shopGrid.querySelectorAll('.shop-item-card'));

      if (val === 'price-low') {
        cards.sort((a, b) => {
          const pA = parseInt(a.querySelector('.shop-item-curr-price').textContent.replace(/[^\d]/g, '')) || 0;
          const pB = parseInt(b.querySelector('.shop-item-curr-price').textContent.replace(/[^\d]/g, '')) || 0;
          return pA - pB;
        });
      } else if (val === 'price-high') {
        cards.sort((a, b) => {
          const pA = parseInt(a.querySelector('.shop-item-curr-price').textContent.replace(/[^\d]/g, '')) || 0;
          const pB = parseInt(b.querySelector('.shop-item-curr-price').textContent.replace(/[^\d]/g, '')) || 0;
          return pB - pA;
        });
      }

      cards.forEach(c => shopGrid.appendChild(c));
    });
  }
});







