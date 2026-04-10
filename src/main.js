import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════════════
  // 1. STATE & ELEMENTS
  // ═══════════════════════════════════════════════════════════
  const preloader = document.getElementById('preloader');
  const header = document.getElementById('header');
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const explorer = document.getElementById('project-explorer');
  const explorerBack = document.getElementById('explorer-back');
  
  // Views
  const viewOverview = document.getElementById('view-overview');
  const viewMap = document.getElementById('view-map');
  const plotDetails = document.getElementById('plot-details');
  
  // ═══════════════════════════════════════════════════════════
  // 2. INITIALIZATION
  // ═══════════════════════════════════════════════════════════
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      initRevealAnimations();
      initCounters();
    }, 1200);
  } else {
    initRevealAnimations();
    initCounters();
  }

  // ═══════════════════════════════════════════════════════════
  // 3. SCROLL HANDLING
  // ═══════════════════════════════════════════════════════════
  let isScrolled = false;
  window.addEventListener('scroll', () => {
    // Header Blur
    if (window.scrollY > 50 && !isScrolled) {
      header?.classList.add('scrolled');
      isScrolled = true;
    } else if (window.scrollY <= 50 && isScrolled) {
      header?.classList.remove('scrolled');
      isScrolled = false;
    }
  });

  // ═══════════════════════════════════════════════════════════
  // 4. EVENT DELEGATION (BULLETPROOF CLICKS)
  // ═══════════════════════════════════════════════════════════
  document.body.addEventListener('click', (e) => {
    
    // -- Mobile Burger --
    if (e.target.closest('#burger-btn')) {
      burgerBtn.classList.toggle('active');
      mobileMenu?.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
      return;
    }

    // -- Smooth Scrolling Anchor Links --
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const href = link.getAttribute('href');
      if (href === '#') return; // Ignore empty
      
      try {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile menu
          if (mobileMenu?.classList.contains('active')) {
            burgerBtn?.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
          }

          // Close Explorer if open
          if (explorer?.getAttribute('aria-hidden') === 'false') {
            closeExplorer();
          }

          const headerOffset = 80;
          const offsetPos = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPos, behavior: 'smooth' });
        }
      } catch (err) {
        console.warn("Invalid scroll target:", href);
      }
      return;
    }

    // -- Action Buttons (Using data-action) --
    const actionBtn = e.target.closest('.js-action-btn');
    if (actionBtn && !actionBtn.disabled) {
      const action = actionBtn.getAttribute('data-action');
      
      if (action === 'open-explorer') {
        openExplorer(actionBtn.getAttribute('data-project'));
      }
      else if (action === 'close-explorer') {
        closeExplorer();
      }
      else if (action === 'back-explorer') {
        showExplorerView('overview');
      }
      else if (action === 'open-venture') {
        openVenture(actionBtn.getAttribute('data-venture'));
      }
      else if (action === 'notify') {
        alert("Thank you! We will notify you when this project opens.");
      }
      else if (action === 'submit-form') {
        e.preventDefault();
        const form = document.getElementById('contact-form');
        if (form && form.checkValidity()) {
          form.style.display = 'none';
          document.getElementById('form-success').style.display = 'block';
        } else {
          form.reportValidity();
        }
      }
      else if (action === 'enquire-plot') {
        closeExplorer();
        setTimeout(() => {
          document.querySelector('a[href="#contact"]')?.click();
        }, 400);
      }
    }

    // -- Plot Click in Interactive Map --
    const plotBox = e.target.closest('.plot-box');
    if (plotBox) {
      if (plotBox.classList.contains('sold')) return; // ignore sold
      
      // Deselect others
      document.querySelectorAll('.plot-box.selected').forEach(b => b.classList.remove('selected'));
      plotBox.classList.add('selected');
      
      // Show details panel
      if (plotDetails) {
        plotDetails.classList.add('active');
        document.getElementById('plot-id').textContent = 'Plot #' + plotBox.getAttribute('data-id');
      }
    }

  });

  // ═══════════════════════════════════════════════════════════
  // 5. EXPLORER LOGIC
  // ═══════════════════════════════════════════════════════════
  function openExplorer(projectId) {
    if (!explorer) return;
    document.body.classList.add('no-scroll');
    explorer.setAttribute('aria-hidden', 'false');
    showExplorerView('overview');
  }

  function closeExplorer() {
    if (!explorer) return;
    document.body.classList.remove('no-scroll');
    explorer.setAttribute('aria-hidden', 'true');
  }

  function showExplorerView(viewId) {
    if (viewId === 'overview') {
      viewOverview?.classList.add('active');
      viewMap?.classList.remove('active');
      if (explorerBack) explorerBack.style.display = 'none';
    } 
    else if (viewId === 'map') {
      viewOverview?.classList.remove('active');
      viewMap?.classList.add('active');
      if (explorerBack) explorerBack.style.display = 'block';
    }
  }

  function openVenture(ventureId) {
    const titles = {
      'a': 'Venture A — Lakeside Reserve',
      'b': 'Venture B — Orchard Hub',
      'c': 'Venture C — Hilltop Enclave'
    };
    
    document.getElementById('map-title').textContent = titles[ventureId] || 'Venture Map';
    plotDetails?.classList.remove('active');
    
    // Inject Mock Plots
    const grid = document.getElementById('map-grid');
    if (grid) {
      grid.innerHTML = '';
      for(let i=1; i<=15; i++) {
        const isSold = Math.random() > 0.6;
        const box = document.createElement('div');
        box.className = `plot-box ${isSold ? 'sold' : 'avail'}`;
        box.setAttribute('data-id', `${ventureId.toUpperCase()}-${String(i).padStart(2,'0')}`);
        box.textContent = String(i).padStart(2,'0');
        grid.appendChild(box);
      }
    }

    showExplorerView('map');
  }

  // ═══════════════════════════════════════════════════════════
  // 6. ANIMATIONS & COUNTERS
  // ═══════════════════════════════════════════════════════════
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-fade-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  function initCounters() {
    const numbers = document.querySelectorAll('.trust__number');
    let hasRun = false;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasRun) {
        hasRun = true;
        numbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'));
          let count = 0;
          const inc = target / 50;
          const update = () => {
            count += inc;
            if (count < target) {
              num.textContent = Math.ceil(count) + (target > 500 ? '+' : '');
              requestAnimationFrame(update);
            } else {
              num.textContent = target + (target > 500 ? '+' : '');
            }
          };
          update();
        });
      }
    }, { threshold: 0.5 });
    
    const trustSec = document.getElementById('trust');
    if (trustSec) observer.observe(trustSec);
  }

});
