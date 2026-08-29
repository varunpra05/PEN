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
      img: 'https://images.unsplash.com/photo-1611591475179-42dd450d0322?q=80&w=600&auto=format&fit=crop'
    },
    'bridal': {
      title: 'Bridal Bangles Collection',
      badge: 'SIGNATURE COUTURE',
      desc: 'Complete your dream bridal ensemble with our magnificent red chooda, uncut polki kada, and sparkling diamond embedded bridal sets.',
      count: '62+ Designs',
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
    },
    'kundan': {
      title: 'Kundan & Polki Bangles',
      badge: 'ROYAL EMBEDDED',
      desc: 'Feature authentic uncut diamonds and vibrant meena foil backings, handcrafted meticulously by Jaipur master goldsmiths.',
      count: '35+ Designs',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'
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
    'stone': {
      title: 'Precious Stone Bangles',
      badge: 'GEMSTONE SPARKLE',
      desc: 'Adorned with natural Burmese rubies, Zambian emeralds, and Sri Lankan sapphires set in 18K solid gold frames.',
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
});

