/**
 * ==============================================================================
 * YASHVEER SINGH PRAJAPATI — 3D GRAPHIC DESIGNER & MOTION PORTFOLIO
 * Main Interactions & UI Controller (script.js)
 * Vanilla JavaScript: Gallery Filtering, Modals, Lightbox, Form, Parallax & Cursor
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 01. PORTFOLIO DATA ARCHIVE (Authentic project details)
  // ----------------------------------------------------------------------------
  const PROJECTS_DATA = [
    {
      id: 'proj-01',
      title: 'Fluid Kinetic Dynamics',
      category: 'Motion Graphics',
      filterCategory: 'motion-graphics',
      image: 'assets/projects/motion-graphics-01.jpg',
      shortDesc: '3D kinetic typography and fluid ribbon simulation exploring modern brand energy and movement.',
      overview: 'An advanced motion graphics exploration focusing on dimensional kinetic typography, procedural ribbon trajectories, and warm tonal lighting. Created to demonstrate fluid brand transitions and high-energy promotional title packaging.',
      objectives: 'Develop a bold kinetic visual language that merges sculptural 3D forms with typographic rhythm for high-impact brand launches.',
      tools: ['Adobe After Effects', 'Blender 3D', 'Maxon Cinema 4D', 'Illustrator'],
      role: '3D Motion Designer & Art Director',
      year: '2024',
      behanceUrl: 'https://www.behance.net/yashveerk227b0'
    },
    {
      id: 'proj-02',
      title: 'Aveline Brand Identity System',
      category: 'Brand Identity',
      filterCategory: 'branding',
      image: 'assets/projects/brand-identity-01.jpg',
      shortDesc: 'Complete editorial visual identity, bespoke stationery, and packaging guidelines for an artisanal design studio.',
      overview: 'Comprehensive brand identity program establishing typographic harmony, warm cream tactile paper textures, and minimal layout systems. Includes full brand guidelines, business collateral, and digital asset templates.',
      objectives: 'Construct an enduring, warm, and sophisticated identity system that conveys craftsmanship and tactile authenticity.',
      tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'InDesign'],
      role: 'Brand Identity & Visual Designer',
      year: '2023',
      behanceUrl: 'https://www.behance.net/yashveerk227b0'
    },
    {
      id: 'proj-03',
      title: 'The Art of Craft — Brand Film',
      category: 'Brand Films',
      filterCategory: 'video-editing',
      image: 'assets/projects/brand-film-01.jpg',
      shortDesc: 'Cinematic documentary brand film highlighting master artisans, delicate textures, and heritage craftsmanship.',
      overview: 'A narrative-driven commercial brand film shot in natural golden light. Follows an artisan leather craftsman with meticulous attention to pacing, sound design synchronization, and rich warm color grading.',
      objectives: 'Capture the emotional nuance of artisanal creation through intimate pacing, seamless transitions, and documentary realism.',
      tools: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Adobe After Effects', 'Audition'],
      role: 'Video Editor & Colorist',
      year: '2024',
      behanceUrl: 'https://www.behance.net/yashveerk227b0'
    },
    {
      id: 'proj-04',
      title: 'Terralumina Product Launch Campaign',
      category: 'Social Media Advertising',
      filterCategory: 'social-media',
      image: 'assets/projects/social-ads-01.jpg',
      shortDesc: 'High-conversion multi-format social campaign with motion ads, Instagram Stories, and promotional banners.',
      overview: 'An integrated multi-platform social advertising campaign for a clean skincare brand. Designed with dynamic motion graphics badges, product benefit callouts, and performance-optimized vertical video formats.',
      objectives: 'Drive brand engagement and conversion through visually cohesive, motion-rich social creatives tailored for mobile feeds.',
      tools: ['Adobe Photoshop', 'Adobe After Effects', 'Figma', 'Premiere Pro'],
      role: 'Social Media Art Director & Motion Designer',
      year: '2024',
      behanceUrl: 'https://www.behance.net/yashveerk227b0'
    },
    {
      id: 'proj-05',
      title: 'Modernism Typographic Exhibition',
      category: 'Graphic Design',
      filterCategory: 'posters',
      image: 'assets/projects/poster-design-01.jpg',
      shortDesc: 'Swiss-style typography poster series investigating grid systems, geometric hierarchy, and warm earth tones.',
      overview: 'An editorial poster design created for an architectural and typography symposium. Employs rigid Swiss modernist grid structures, bold contrasting scale, and restrained warm earth tones.',
      objectives: 'Celebrate the precision and structural purity of Swiss graphic design through minimalist geometry and expressive typographic contrast.',
      tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
      role: 'Graphic & Poster Designer',
      year: '2023',
      behanceUrl: 'https://www.behance.net/yashveerk227b0'
    },
    {
      id: 'proj-06',
      title: 'Commercial Color Grading & Rhythm',
      category: 'Video Editing',
      filterCategory: 'video-editing',
      image: 'assets/projects/video-editing-01.jpg',
      shortDesc: 'Multi-camera commercial edit, precise audio waveforms sync, and warm film emulation color pass.',
      overview: 'Technical and creative showcase of commercial video post-production. Features precision match cuts, dual-display color waveform mastering, and custom LUT development balancing warm skin tones.',
      objectives: 'Deliver polished broadcast-ready video editing with natural color fidelity and rhythmic visual storytelling.',
      tools: ['Adobe Premiere Pro', 'Adobe After Effects', 'Photoshop'],
      role: 'Senior Video Editor',
      year: '2023',
      behanceUrl: 'https://www.behance.net/yashveerk227b0'
    },
    {
      id: 'proj-07',
      title: 'Creative Flow Explainer Narrative',
      category: '2D Animation',
      filterCategory: 'animation',
      image: 'assets/projects/animation-2d-01.jpg',
      shortDesc: 'Vector character animation and fluid morphing graphic sequence illustrating the digital creative journey.',
      overview: 'An expressive 2D animated sequence combining vector illustration with fluid shape morphing. Designed to illustrate how raw creative impulses evolve into structured digital art.',
      objectives: 'Communicate abstract creative problem solving through dynamic character animation and fluid graphic transitions.',
      tools: ['Adobe After Effects', 'Adobe Illustrator', 'Lottie / Bodymovin'],
      role: '2D Motion Animator',
      year: '2024',
      behanceUrl: 'https://www.behance.net/yashveerk227b0'
    },
    {
      id: 'proj-08',
      title: 'Celestial Silhouette — Visual Exploration',
      category: 'Digital Art',
      filterCategory: 'digital-art',
      image: 'assets/projects/digital-art-01.jpg',
      shortDesc: 'Expressive digital art piece painted with gestural brushwork, swirling terracotta energy, and cosmic textures.',
      overview: 'A personal creative exploration conducted on iPad and desktop. Merges traditional gestural ink sensibilities with modern digital lighting, warm terracotta pigments, and deep espresso shadows.',
      objectives: 'Experiment with raw painterly textures and dynamic motion within a single static illustration canvas.',
      tools: ['Procreate', 'Adobe Photoshop', 'Graphic Tablet'],
      role: 'Digital Illustrator & Concept Artist',
      year: '2024',
      behanceUrl: 'https://www.behance.net/yashveerk227b0'
    }
  ];

  // ----------------------------------------------------------------------------
  // 02. CUSTOM CURSOR (DESKTOP ONLY)
  // ----------------------------------------------------------------------------
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;
    let isCursorActive = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      if (!isCursorActive) {
        isCursorActive = true;
        cursor.classList.add('visible');
        follower.classList.add('visible');
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
      follower.classList.remove('visible');
      isCursorActive = false;
    });

    document.addEventListener('mouseenter', () => {
      if (mouseX > 0 && mouseY > 0) {
        cursor.classList.add('visible');
        follower.classList.add('visible');
        isCursorActive = true;
      }
    });

    function renderCursor() {
      if (isCursorActive) {
        followerX += (mouseX - followerX) * 0.18;
        followerY += (mouseY - followerY) * 0.18;
        follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .project-card, .gallery-card, .service-card, .tool-badge');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        follower.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        follower.classList.remove('hovered');
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 03. STICKY NAVBAR & ACTIVE SECTION HIGHLIGHTING
  // ----------------------------------------------------------------------------
  const navbar = document.getElementById('main-navbar');
  const navLinks = document.querySelectorAll('.nav-link-editorial');
  const navCollapse = document.getElementById('navbarContent');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Close mobile navbar on link click
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // Active section indicator with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  // ----------------------------------------------------------------------------
  // 04. CINEMATIC DIRECTIONAL SCROLL REVEAL OBSERVER (LEFT & RIGHT SLIDE-IN)
  // Automatically attaches left/right slide entrance to cards, columns & headers
  // ----------------------------------------------------------------------------
  function initDirectionalScrollAnimations() {
    // 1. Hero Section: Left column from left, Right 3D stage from right
    const heroLeft = document.querySelector('.hero-section .hero-content-wrapper');
    const heroRight = document.querySelector('.hero-section .hero-portrait-stage-card') || document.querySelector('.hero-section .hero-stage-container');
    if (heroLeft) heroLeft.classList.add('reveal-left');
    if (heroRight) heroRight.classList.add('reveal-right');

    // 2. Section Headings: Section labels, titles, and subtitles slide in from left
    document.querySelectorAll('.section-label').forEach((el) => {
      el.classList.add('reveal-left');
    });
    document.querySelectorAll('.section-title').forEach((el) => {
      el.classList.add('reveal-left', 'delay-1');
    });
    document.querySelectorAll('.section-subtitle').forEach((el) => {
      el.classList.add('reveal-left', 'delay-2');
    });

    // 3. About Section: Portrait from Left, Bio from Right
    const aboutPortrait = document.querySelector('.about-portrait-frame');
    if (aboutPortrait) {
      aboutPortrait.classList.remove('reveal-on-scroll');
      aboutPortrait.classList.add('reveal-left');
    }
    const aboutTextCol = document.querySelector('#about .col-lg-7 > div');
    if (aboutTextCol) {
      aboutTextCol.classList.remove('reveal-on-scroll');
      aboutTextCol.classList.add('reveal-right');
    }
    document.querySelectorAll('.highlight-box').forEach((box, i) => {
      box.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right', `delay-${(i % 2) + 1}`);
    });

    // 4. Featured Work Project Cards: Alternate Left & Right
    document.querySelectorAll('#featured-work .project-card').forEach((card, i) => {
      const parentCol = card.closest('[class*="col-"]');
      const target = parentCol || card;
      target.classList.remove('reveal-on-scroll');
      target.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    });

    // 5. Complete Archive / Gallery Cards: Staggered Left & Right waves
    document.querySelectorAll('#gallery-grid .gallery-card').forEach((card, i) => {
      const parentCol = card.closest('[class*="col-"]');
      const target = parentCol || card;
      const isLeft = (i % 4 < 2);
      target.classList.add(isLeft ? 'reveal-left' : 'reveal-right', `delay-${(i % 3) + 1}`);
    });

    // 6. Services Cards: Left, Center, Right waves
    document.querySelectorAll('#services .service-card').forEach((card, i) => {
      const parentCol = card.closest('[class*="col-"]');
      const target = parentCol || card;
      target.classList.remove('reveal-on-scroll');
      if (i % 3 === 0) {
        target.classList.add('reveal-left');
      } else if (i % 3 === 1) {
        target.classList.add('reveal-up', 'delay-1');
      } else {
        target.classList.add('reveal-right', 'delay-2');
      }
    });

    // 7. Skills & Toolkit Cards: Alternate Left & Right
    document.querySelectorAll('#skills .tool-group-card').forEach((card, i) => {
      const parentCol = card.closest('[class*="col-"]');
      const target = parentCol || card;
      target.classList.remove('reveal-on-scroll');
      if (i % 2 === 0) {
        target.classList.add('reveal-left');
      } else {
        target.classList.add('reveal-right', 'delay-1');
      }
    });

    // 8. Experience Timeline: Dynamic alternating zigzag (Left / Right)
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      item.classList.remove('reveal-on-scroll');
      item.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    });

    // 9. Education & Awards: Credentials from Left, Award Hero Card from Right
    const eduCol = document.querySelector('#education .col-lg-6:first-child');
    if (eduCol) eduCol.classList.add('reveal-left');
    const awardHero = document.querySelector('.award-hero-card');
    if (awardHero) {
      awardHero.classList.remove('reveal-on-scroll');
      awardHero.classList.add('reveal-right');
    }

    // 10. Process Steps: Alternate Left & Right
    document.querySelectorAll('.process-step-card').forEach((step, i) => {
      const parentCol = step.closest('[class*="col-"]');
      const target = parentCol || step;
      target.classList.remove('reveal-on-scroll');
      if (i < 2) {
        target.classList.add('reveal-left', `delay-${i + 1}`);
      } else {
        target.classList.add('reveal-right', `delay-${i - 1}`);
      }
    });
    const proofBanner = document.querySelector('.creative-proof-banner');
    if (proofBanner) {
      proofBanner.classList.remove('reveal-on-scroll');
      proofBanner.classList.add('reveal-scale');
    }

    // 11. Contact Section: Info from Left, Form from Right
    const contactMeta = document.querySelector('.contact-meta-card');
    if (contactMeta) {
      contactMeta.classList.remove('reveal-on-scroll');
      contactMeta.classList.add('reveal-left');
    }
    const contactFormContainer = document.querySelector('.contact-form-container');
    if (contactFormContainer) {
      contactFormContainer.classList.remove('reveal-on-scroll');
      contactFormContainer.classList.add('reveal-right');
    }

    // 12. Observe all reveal elements with IntersectionObserver
    const allRevealElements = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-up, .reveal-scale'
    );

    if ('IntersectionObserver' in window && allRevealElements.length > 0) {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      });

      allRevealElements.forEach((el) => revealObserver.observe(el));
    } else {
      allRevealElements.forEach((el) => el.classList.add('revealed'));
    }

    // Reveal hero elements immediately with smooth entry on page load
    setTimeout(() => {
      if (heroLeft) heroLeft.classList.add('revealed');
      if (heroRight) heroRight.classList.add('revealed');
    }, 120);
  }

  initDirectionalScrollAnimations();

  // ----------------------------------------------------------------------------
  // 04.1 HERO DYNAMIC TYPEWRITER EFFECT
  // Cycles through: Motion Graphics, Branding, Social Media, Posters, Video Editing, Animation, Digital Art
  // ----------------------------------------------------------------------------
  function initHeroTypewriter() {
    const typewriterEl = document.getElementById('heroTypewriter');
    if (!typewriterEl) return;

    const words = [
      'Motion Graphics',
      'Branding',
      'Social Media',
      'Posters',
      'Video Editing',
      'Animation',
      'Digital Art'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        charIndex--;
        typewriterEl.textContent = currentWord.substring(0, charIndex);
      } else {
        charIndex++;
        typewriterEl.textContent = currentWord.substring(0, charIndex);
      }

      let speed = isDeleting ? 40 : 85 + Math.random() * 25;

      if (!isDeleting && charIndex === currentWord.length) {
        // Full word typed - comfortable reading pause
        speed = 1900;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Full word deleted - switch to next word with pause
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
      }

      setTimeout(type, speed);
    }

    // Start typewriter after smooth initial entry
    setTimeout(type, 750);
  }

  initHeroTypewriter();

  // ----------------------------------------------------------------------------
  // 05. COMPLETE PORTFOLIO / GALLERY FILTERING (SECTION 04)
  // ----------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 40);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ----------------------------------------------------------------------------
  // 06. PROJECT DETAIL MODAL (SECTION 03)
  // ----------------------------------------------------------------------------
  const projectDetailModalEl = document.getElementById('projectDetailModal');
  const projectDetailModal = projectDetailModalEl ? new bootstrap.Modal(projectDetailModalEl) : null;

  window.openProjectDetail = function (projectId) {
    const project = PROJECTS_DATA.find((p) => p.id === projectId);
    if (!project || !projectDetailModalEl) return;

    document.getElementById('modalProjectTitle').textContent = project.title;
    document.getElementById('modalProjectCategory').textContent = project.category;
    document.getElementById('modalProjectYear').textContent = project.year;
    document.getElementById('modalProjectRole').textContent = project.role;
    document.getElementById('modalProjectImage').src = project.image;
    document.getElementById('modalProjectImage').alt = project.title;
    document.getElementById('modalProjectOverview').textContent = project.overview;
    document.getElementById('modalProjectObjectives').textContent = project.objectives;

    // Render tools badges
    const toolsContainer = document.getElementById('modalProjectTools');
    toolsContainer.innerHTML = '';
    project.tools.forEach((tool) => {
      const span = document.createElement('span');
      span.className = 'tool-badge me-1 mb-1';
      span.innerHTML = `<i class="bi bi-cpu-fill"></i> ${tool}`;
      toolsContainer.appendChild(span);
    });

    const behanceLink = document.getElementById('modalProjectBehance');
    if (behanceLink) behanceLink.href = project.behanceUrl;

    projectDetailModal.show();
  };

  // ----------------------------------------------------------------------------
  // 07. LIGHTBOX GALLERY MODAL WITH KEYBOARD NAVIGATION (SECTION 04)
  // ----------------------------------------------------------------------------
  const lightboxModalEl = document.getElementById('lightboxModal');
  const lightboxModal = lightboxModalEl ? new bootstrap.Modal(lightboxModalEl) : null;
  let currentLightboxIndex = 0;

  window.openLightbox = function (index) {
    currentLightboxIndex = parseInt(index, 10);
    updateLightboxContent();
    if (lightboxModal) lightboxModal.show();
  };

  function updateLightboxContent() {
    if (!PROJECTS_DATA[currentLightboxIndex]) return;
    const project = PROJECTS_DATA[currentLightboxIndex];

    const img = document.getElementById('lightboxImg');
    const title = document.getElementById('lightboxTitle');
    const category = document.getElementById('lightboxCategory');
    const counter = document.getElementById('lightboxCounter');

    if (img) {
      img.src = project.image;
      img.alt = project.title;
    }
    if (title) title.textContent = project.title;
    if (category) category.textContent = project.category;
    if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${PROJECTS_DATA.length}`;
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % PROJECTS_DATA.length;
    updateLightboxContent();
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
    updateLightboxContent();
  }

  const lightboxNextBtn = document.getElementById('lightboxNext');
  const lightboxPrevBtn = document.getElementById('lightboxPrev');
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightbox);

  // Keyboard navigation for lightbox
  window.addEventListener('keydown', (e) => {
    if (lightboxModalEl && lightboxModalEl.classList.contains('show')) {
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    }
  });

  // ----------------------------------------------------------------------------
  // 08. CONTACT FORM SUBMISSION (ACCESSIBLE CLIENT-SIDE HANDLING)
  // ----------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const contactStatusAlert = document.getElementById('contactStatusAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const serviceInput = document.getElementById('contactService');
      const budgetInput = document.getElementById('contactBudget');
      const messageInput = document.getElementById('contactMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const service = serviceInput ? serviceInput.value : 'General Inquiry';
      const budget = budgetInput ? budgetInput.value : 'Flexible';
      const message = messageInput ? messageInput.value.trim() : '';

      // Simple validation
      if (!name || !email || !message) {
        showContactAlert('warning', 'Please fill in your name, email, and project message.');
        return;
      }

      // Email validation pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showContactAlert('warning', 'Please enter a valid email address.');
        return;
      }

      // Prepare mailto fallback link with prefilled details
      const subject = encodeURIComponent(`Project Inquiry: ${service} — ${name}`);
      const body = encodeURIComponent(
        `Hi Yashveer,\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Project Type: ${service}\n` +
        `Budget Range: ${budget}\n\n` +
        `Project Details:\n${message}\n\n` +
        `Best regards,\n${name}`
      );
      const recipient = 'yashveersinghprajapati@gmail.com';
      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      // Display rich accessible success state with direct mail action
      const successHtml = `
        <div class="p-3" style="background-color: #EFE7DA; border-left: 4px solid #8B5E3C; border-radius: 6px;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #292524; margin-bottom: 0.4rem;">
            <i class="bi bi-check-circle-fill" style="color: #8B5E3C;"></i> Message Prepared Successfully!
          </h4>
          <p style="font-size: 0.92rem; color: #665E59; margin-bottom: 0.9rem;">
            Thank you, <strong>${escapeHtml(name)}</strong>. Since this website runs statically without a backend, click below to open your preferred email client or copy the message.
          </p>
          <div class="d-flex flex-wrap gap-2">
            <a href="${mailtoUrl}" class="btn-editorial-primary" style="padding: 0.6rem 1.2rem; font-size: 0.88rem;">
              <i class="bi bi-envelope-arrow-up"></i> Launch Mail Client
            </a>
            <button type="button" class="btn-editorial-outline" id="copyMessageBtn" style="padding: 0.6rem 1.2rem; font-size: 0.88rem;">
              <i class="bi bi-clipboard"></i> Copy Form Details
            </button>
          </div>
          <small class="d-block mt-2 text-muted" style="font-size: 0.78rem;">
            Direct Email: <strong>${recipient}</strong> | Location: South East Delhi, Delhi, India
          </small>
        </div>
      `;

      if (contactStatusAlert) {
        contactStatusAlert.innerHTML = successHtml;
        contactStatusAlert.classList.remove('d-none');
        contactStatusAlert.focus();

        const copyBtn = document.getElementById('copyMessageBtn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            const copyText = `Name: ${name}\nEmail: ${email}\nProject: ${service}\nBudget: ${budget}\nMessage: ${message}`;
            navigator.clipboard.writeText(copyText).then(() => {
              copyBtn.innerHTML = '<i class="bi bi-check-lg"></i> Copied to Clipboard!';
              setTimeout(() => {
                copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> Copy Form Details';
              }, 2500);
            });
          });
        }
      }

      // Reset form fields
      contactForm.reset();
    });
  }

  function showContactAlert(type, text) {
    if (!contactStatusAlert) return;
    contactStatusAlert.className = `alert alert-${type === 'warning' ? 'warning' : 'info'} mt-3`;
    contactStatusAlert.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i> ${text}`;
    contactStatusAlert.classList.remove('d-none');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ----------------------------------------------------------------------------
  // 09. BACK TO TOP BUTTON
  // ----------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 10. THEME SWITCHER (REDOYANUL HAQUE OBSIDIAN DARK VS EDITORIAL LIGHT)
  // ----------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('yashveer-portfolio-theme') || 'dark';

  function applyTheme(theme) {
    const targetTheme = (theme === 'light') ? 'light' : 'dark';
    document.body.setAttribute('data-theme', targetTheme);
    localStorage.setItem('yashveer-portfolio-theme', targetTheme);

    if (themeToggleBtn) {
      if (targetTheme === 'dark') {
        themeToggleBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i> <span id="themeToggleText">Dark</span>';
        themeToggleBtn.title = 'Switch to Light Mode';
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i> <span id="themeToggleText">Light</span>';
        themeToggleBtn.title = 'Switch to Dark Mode';
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    }

    // Notify Three.js 3D scene if hook exists
    if (typeof window.update3DTheme === 'function') {
      window.update3DTheme(targetTheme);
    }
  }

  // Set initial theme on load (Dark default)
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }
});
