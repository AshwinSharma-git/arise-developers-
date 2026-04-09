// ═══════════════════════════════════════════════════════════
//   ARISING DEVELOPERS — Main Application Script
//   Premium interactions, scroll animations, map explorer
// ═══════════════════════════════════════════════════════════

import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // ─── 1. PRELOADER ───
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Hide preloader after a slight delay to ensure visual impact
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('no-scroll');
      initRevealAnimations();
    }, 1800);
  }

  // ─── 2. HEADER & NAVIGATION ───
  const header = document.getElementById('header');
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.header__link, .mobile-menu__link');
  let isScrolled = false;

  // Handle Scroll for Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50 && !isScrolled) {
      header.classList.add('scrolled');
      isScrolled = true;
    } else if (window.scrollY <= 50 && isScrolled) {
      header.classList.remove('scrolled');
      isScrolled = false;
    }
    updateActiveLink();
  });

  // Mobile Menu Toggle
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Smooth Scroll & Link Active State
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = document.querySelector(link.getAttribute('href'));
      if (targetId) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (mobileMenu.classList.contains('active')) {
          burgerBtn.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }

        const headerOffset = 80;
        const elementPosition = targetId.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  function updateActiveLink() {
    const sections = ['hero', 'about', 'projects', 'blog', 'contact'];
    const currentScroll = window.scrollY + 100; // Offset

    let currentSection = sections[0];
    sections.forEach(section => {
      const el = document.getElementById(section);
      if (el && el.offsetTop <= currentScroll) {
        currentSection = section;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  // ─── 3. SCROLL REVEAL ANIMATIONS ───
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optional: stop observing once revealed
          // observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    });

    revealElements.forEach(el => observer.observe(el));
    
    // Start counter animations only when in view
    const trustSection = document.getElementById('trust');
    if (trustSection) {
      const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          initCounters();
          counterObserver.disconnect();
        }
      });
      counterObserver.observe(trustSection);
    }
  }

  // ─── 4. STAT COUNTERS ───
  function initCounters() {
    const counters = document.querySelectorAll('.trust__number');
    const speed = 200; // Lower is faster

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const updateCount = () => {
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  }

  // ─── 5. PROJECT EXPLORER & INTERACTIVE MAP ───
  const explorer = document.getElementById('project-explorer');
  const explorerCloseBtn = document.getElementById('explorer-close');
  const explorerBackBtn = document.getElementById('explorer-back');
  const projectCards = document.querySelectorAll('.project-card');
  const ventureCards = document.querySelectorAll('.venture-card');
  
  const viewProject = document.getElementById('view-project');
  const viewVenture = document.getElementById('view-venture');
  
  // Data for ventures
  const plotsData = {
    'a': { soldCount: 14, availCount: 28, total: 42, title: 'Venture A — Lakeside Zone', meta: '5.2 Acres • 42 Plots • Peacock Valley' },
    'b': { soldCount: 8, availCount: 30, total: 38, title: 'Venture B — Orchard Valley', meta: '4.8 Acres • 38 Plots • Peacock Valley' },
    'c': { soldCount: 20, availCount: 10, total: 30, title: 'Venture C — Hilltop Retreat', meta: '4.18 Acres • 30 Plots • Peacock Valley' }
  };

  // Open Explorer
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.project-card__btn') && e.target.closest('.project-card__btn').disabled) {
          return;
      }
      
      const projectId = card.getAttribute('data-project');
      if (projectId) {
        document.body.classList.add('no-scroll');
        explorer.classList.add('active');
        switchToView('project');
      }
    });
  });

  // Close Explorer
  if (explorerCloseBtn) {
    explorerCloseBtn.addEventListener('click', () => {
      explorer.classList.remove('active');
      document.body.classList.remove('no-scroll');
      // Reset view to project next time it opens
      setTimeout(() => switchToView('project'), 400); 
    });
  }

  // View Navigation
  function switchToView(viewName) {
    const breadcrumb = document.getElementById('explorer-breadcrumb');
    
    if (viewName === 'project') {
      viewProject.classList.add('explorer__view--active');
      viewProject.classList.remove('explorer__view--exit-left');
      
      viewVenture.classList.remove('explorer__view--active');
      explorerBackBtn.classList.remove('active');
      
      breadcrumb.innerHTML = '<span class="explorer__breadcrumb-item active">Projects</span> / <span class="explorer__breadcrumb-item">Peacock Valley</span>';
    } else if (viewName === 'venture') {
      viewProject.classList.remove('explorer__view--active');
      viewProject.classList.add('explorer__view--exit-left');
      
      viewVenture.classList.add('explorer__view--active');
      explorerBackBtn.classList.add('active');
      
      const title = document.getElementById('venture-title').innerText.split(' — ')[0];
      breadcrumb.innerHTML = '<span class="explorer__breadcrumb-item">Peacock Valley</span> / <span class="explorer__breadcrumb-item active">' + title + '</span>';
      
      // Close open detail panel
      document.getElementById('plot-detail').style.display = 'none';
      const selected = document.querySelector('.plot-node--selected');
      if (selected) selected.classList.remove('plot-node--selected');
    }
  }

  if (explorerBackBtn) {
    explorerBackBtn.addEventListener('click', () => switchToView('project'));
  }

  // Open Venture Detail
  ventureCards.forEach(card => {
    card.addEventListener('click', () => {
      const vid = card.getAttribute('data-venture');
      const vdata = plotsData[vid];
      
      // Update Headers
      document.getElementById('venture-title').innerText = vdata.title;
      document.getElementById('venture-meta').innerText = vdata.meta;
      
      // Generate Grid
      generatePlotGrid(vid, vdata.total, vdata.soldCount);
      
      switchToView('venture');
    });
  });

  // Generate Interactive Pan-Zoom Plot Map
  function generatePlotGrid(ventureId, total, sold) {
    const grid = document.getElementById('plot-grid');
    grid.innerHTML = '';
    
    // Create random sold array
    let statuses = Array(total).fill('avail');
    let soldAssigned = 0;
    while(soldAssigned < sold) {
        let i = Math.floor(Math.random() * total);
        if(statuses[i] === 'avail') {
            statuses[i] = 'sold';
            soldAssigned++;
        }
    }
    
    // Grid generation
    for(let pos = 1; pos <= total; pos++) {
        const node = document.createElement('div');
        node.className = `plot-node plot-node--${statuses[pos-1]}`;
        node.innerText = `${ventureId.toUpperCase()}-${pos}`;
        
        node.addEventListener('click', () => {
            if(node.classList.contains('plot-node--sold')) return;
            
            // Remove previous selection
            const active = grid.querySelector('.plot-node--selected');
            if (active) active.classList.remove('plot-node--selected');
            
            node.classList.add('plot-node--selected');
            showPlotDetails(ventureId, pos);
        });
        
        grid.appendChild(node);
    }
  }

  function showPlotDetails(ventureId, plotNo) {
    const panel = document.getElementById('plot-detail');
    
    document.getElementById('plot-detail-title').innerText = `Plot #${ventureId.toUpperCase()}-${plotNo}`;
    
    // Randomize some details based on plotNo for demo
    const size = 150 + (plotNo % 3) * 50; 
    document.getElementById('plot-detail-size').innerText = `${size} sq.yds`;
    document.getElementById('plot-detail-price').innerText = `₹${(size * 14999).toLocaleString()}`;
    
    const facing = ['East', 'West', 'North', 'South'][plotNo % 4];
    document.getElementById('plot-detail-facing').innerText = facing;
    document.getElementById('plot-detail-dims').innerText = `${Math.floor(size/6)} × ${Math.floor(size/5)} ft`;
    
    panel.style.display = 'block';
  }

  // Panning Support for Map
  const mapContainer = document.getElementById('plot-map');
  const mapGrid = document.getElementById('plot-grid');
  if(mapContainer && mapGrid) {
      let isDown = false;
      let startX;
      let startY;
      let scrollLeft;
      let scrollTop;

      mapContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - mapContainer.offsetLeft;
        startY = e.pageY - mapContainer.offsetTop;
        scrollLeft = mapContainer.scrollLeft;
        scrollTop = mapContainer.scrollTop;
      });
      mapContainer.addEventListener('mouseleave', () => isDown = false);
      mapContainer.addEventListener('mouseup', () => isDown = false);
      mapContainer.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - mapContainer.offsetLeft;
        const y = e.pageY - mapContainer.offsetTop;
        const walkX = (x - startX) * 1.5; 
        const walkY = (y - startY) * 1.5;
        mapContainer.scrollLeft = scrollLeft - walkX;
        mapContainer.scrollTop = scrollTop - walkY;
      });
  }

  // Contact Actions
  document.getElementById('explorer-contact-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      explorer.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.querySelector('#contact').scrollIntoView({behavior:'smooth'});
  });
  
  document.getElementById('plot-enquiry-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      explorer.classList.remove('active');
      document.body.classList.remove('no-scroll');
      
      // Pre-fill form
      const plotTitle = document.getElementById('plot-detail-title').innerText;
      document.getElementById('contact-interest').value = 'peacock-valley';
      
      // Add plot to message if there was a message field, for now just scroll
      document.querySelector('#contact').scrollIntoView({behavior:'smooth'});
  });

  // ─── 6. LIGHTBOX FOR GALLERY ───
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentImageIndex = 0;
  let galleryItems = [];

  function initLightbox() {
    // Collect all gallery items
    galleryItems = Array.from(document.querySelectorAll('.explorer__gallery-item img'));

    galleryItems.forEach((img, index) => {
      img.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(img.src);
      });
    });
  }

  function openLightbox(src) {
    if(!lightbox) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    if(!lightbox) return;
    lightbox.classList.remove('active');
  }

  function changeImage(direction) {
    if (galleryItems.length === 0) return;
    
    currentImageIndex += direction;
    
    // Cycle array
    if (currentImageIndex >= galleryItems.length) currentImageIndex = 0;
    if (currentImageIndex < 0) currentImageIndex = galleryItems.length - 1;
    
    lightboxImg.src = galleryItems[currentImageIndex].src;
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => changeImage(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => changeImage(1));
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Re-init lightbox when explorer opens to catch those dynamic elements
  initLightbox();

  // ─── 7. TESTIMONIALS SLIDER ───
  const track = document.getElementById('testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonial-dots');
  
  if (track && cards.length > 0) {
    let currentIndex = 0;
    
    // Calculate slides length based on responsive breakpoint
    function getCardsPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    let cardsPerView = getCardsPerView();
    let maxIndex = cards.length - cardsPerView;

    // Create dots
    function createDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('div');
        dot.classList.add('testimonials__dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      const cardWidth = 100 / cardsPerView;
      track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
      
      const dots = document.querySelectorAll('.testimonials__dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function goToSlide(index) {
      if (index < 0) index = 0;
      if (index > maxIndex) index = maxIndex;
      currentIndex = index;
      updateSlider();
    }

    prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Handle touch interactions for slider
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive:true});

    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive:true});

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) goToSlide(currentIndex + 1); // Swipe left
      if (touchEndX > touchStartX + 50) goToSlide(currentIndex - 1); // Swipe right
    }

    // Refresh on resize
    window.addEventListener('resize', () => {
      const newCardsPerView = getCardsPerView();
      if (newCardsPerView !== cardsPerView) {
        cardsPerView = newCardsPerView;
        maxIndex = Math.max(0, cards.length - cardsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        createDots();
        updateSlider();
      }
    });

    createDots();
    updateSlider();
  }

  // ─── 8. CONTACT FORM SIMULATION ───
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn?.querySelector('.btn__text');
  const btnLoader = submitBtn?.querySelector('.btn__loader');
  const formSuccess = document.getElementById('form-success');
  const resetBtn = document.getElementById('reset-form-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulating API Call
      submitBtn.disabled = true;
      if(btnText) btnText.style.display = 'none';
      if(btnLoader) btnLoader.style.display = 'inline-block';
      
      setTimeout(() => {
        form.style.display = 'none';
        if(formSuccess) formSuccess.style.display = 'block';
        submitBtn.disabled = false;
        if(btnText) btnText.style.display = 'inline-block';
        if(btnLoader) btnLoader.style.display = 'none';
        form.reset();
      }, 1500);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if(formSuccess) formSuccess.style.display = 'none';
      form.style.display = 'block';
    });
  }

  // ─── 9. BACK TO TOP BUTTON ───
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

});
