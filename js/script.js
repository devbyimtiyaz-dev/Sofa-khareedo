document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mainHeader = document.querySelector('.main-header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const mobileLinks = document.querySelectorAll('.mob-link');
    const navLinks = document.querySelectorAll('.nav-link');

    /* ==========================================
       1. STICKY HEADER ON SCROLL
       ========================================== */
    const handleScroll = () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scroll-active');
        } else {
            mainHeader.classList.remove('scroll-active');
        }
    };
    
    // Initial check on load
    handleScroll();
    // Scroll Event Listener
    window.addEventListener('scroll', handleScroll);

    /* ==========================================
       2. MOBILE DRAWER NAVIGATION TOGGLES
       ========================================== */
    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = ''; // Resume scrolling
    };

    // Toggle open state on hamburger click
    mobileToggle.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    // Close on X mark click
    drawerClose.addEventListener('click', closeDrawer);

    // Close on dark overlay click
    drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when any mobile link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    /* ==========================================
       3. SMOOTH NAVIGATION LINK ACTIVE HIGHLIGHTING
       ========================================== */
    // Helper to clear and set active states
    const updateActiveLink = (targetId) => {
        // Desktop Links
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Mobile Links
        mobileLinks.forEach(link => {
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Scrollspy behavior using IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -60% 0px', // Match standard offsets
        threshold: 0
    };

    const sections = document.querySelectorAll('section, header, main');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id) {
                    updateActiveLink(id);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.getAttribute('id')) {
            observer.observe(section);
        }
    });

    /* ==========================================
       4. HERO ENQUIRY FORM INTERACTIVE HANDLING
       ========================================== */
    const enquiryForm = document.getElementById('hero-enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = enquiryForm.querySelector('.btn-submit-gold');
            const responseMsg = enquiryForm.querySelector('.form-response-msg');
            const nameVal = document.getElementById('hero-name').value.trim();
            const phoneVal = document.getElementById('hero-phone').value.trim();
            const emailVal = document.getElementById('hero-email').value.trim();
            const messageVal = document.getElementById('hero-message').value.trim();

            // Direct conversion action
            if (!nameVal || !phoneVal) {
                showFeedback('Please fill out Name and Mobile fields.', 'error');
                return;
            }

            // Simple 10-digit number validation
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phoneVal)) {
                showFeedback('Please enter a valid 10-digit phone number.', 'error');
                return;
            }

            // Animate submission trigger
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Sending...`;

            // Mock backend response (timeout simulate)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Show professional success message
                showFeedback(`<i class="fa-solid fa-circle-check me-2"></i>Thank you, ${nameVal}! Your doorstep inspection is requested. Home Decor Furnitures expert will contact you shortly at ${phoneVal}.`, 'success');
                
                // Reset form fields
                enquiryForm.reset();
            }, 1200);

            function showFeedback(text, type) {
                responseMsg.innerHTML = text;
                responseMsg.className = `form-response-msg mt-3 text-center ${type}`;
                responseMsg.classList.remove('d-none');
                
                // If success, automatically hide after 8 seconds
                if (type === 'success') {
                    setTimeout(() => {
                        responseMsg.classList.add('d-none');
                    }, 8000);
                }
            }
        });
    }

    /* ==========================================
       5. GALLERY FILTER & PREMIUM LIGHTBOX SYSTEM
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.querySelector('.lightbox-modal');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxTag = document.querySelector('.lightbox-tag');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-nav-left');
    const lightboxNext = document.querySelector('.lightbox-nav-right');
    
    // Array to track currently visible items for lightbox slider navigation
    let visibleItems = Array.from(galleryItems);
    let currentLightboxIndex = 0;

    // Filter Functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add to current
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            visibleItems = []; // reset visible tracking array

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hide');
                    visibleItems.push(item);
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // Lightbox Open & Slider Controls
    const openLightbox = (index) => {
        const item = visibleItems[index];
        if (!item) return;

        const card = item.querySelector('.gallery-card');
        const img = card.querySelector('.gallery-img');
        const tag = card.querySelector('.gallery-tag').textContent;
        const title = card.querySelector('.gallery-item-title').textContent;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTag.textContent = tag;
        lightboxTitle.textContent = title;

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // stop background scrolling
        currentLightboxIndex = index;
    };

    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = ''; // restore scrolling
    };

    // Bind click listener on visible items cards
    galleryItems.forEach(item => {
        const card = item.querySelector('.gallery-card');
        card.addEventListener('click', () => {
            // Find index of clicked item inside current visibleItems array
            const visibleIndex = visibleItems.indexOf(item);
            if (visibleIndex !== -1) {
                openLightbox(visibleIndex);
            }
        });
    });

    // Navigation triggers
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        let newIndex = currentLightboxIndex - 1;
        if (newIndex < 0) {
            newIndex = visibleItems.length - 1;
        }
        openLightbox(newIndex);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        let newIndex = currentLightboxIndex + 1;
        if (newIndex >= visibleItems.length) {
            newIndex = 0;
        }
        openLightbox(newIndex);
    });

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on dark outer frame click
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Keyboard support (Escape, ArrowLeft, ArrowRight)
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        }
    });

    /* ==========================================
       6. MAIN CONTACT FORM INTERACTIVE HANDLING
       ========================================== */
    const mainContactForm = document.getElementById('footer-contact-form');
    if (mainContactForm) {
        mainContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = mainContactForm.querySelector('button[type="submit"]');
            const responseMsg = mainContactForm.querySelector('.footer-response-msg');
            const nameVal = document.getElementById('footer-name').value.trim();
            const phoneVal = document.getElementById('footer-phone').value.trim();

            if (!nameVal || !phoneVal) {
                showFeedback('Please fill out Name and Mobile fields.', 'error');
                return;
            }

            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phoneVal)) {
                showFeedback('Please enter a valid 10-digit phone number.', 'error');
                return;
            }

            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Submitting...`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                showFeedback(`<i class="fa-solid fa-circle-check me-2"></i>Thank you, ${nameVal}! Your request has been submitted successfully. Home Decor Furnitures team will contact you back in 15 minutes!`, 'success');
                mainContactForm.reset();
            }, 1200);

            function showFeedback(text, type) {
                responseMsg.innerHTML = text;
                responseMsg.className = `footer-response-msg mt-3 text-center ${type}`;
                responseMsg.classList.remove('d-none');

                if (type === 'success') {
                    setTimeout(() => {
                        responseMsg.classList.add('d-none');
                    }, 8000);
                }
            }
        });
    }

    /* ==========================================
       7. SCROLL TO TOP TRIGGER FUNCTIONALITY
       ========================================== */
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        // Toggle class based on scroll depth
        const toggleScrollTopBtn = () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        };
        
        // Listen scroll
        window.addEventListener('scroll', toggleScrollTopBtn);
        
        // Scroll back to top on click
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================
       8. DYNAMIC ENQUIRY MODAL POPUP HANDLING
       ========================================== */
    const enquiryModal = document.getElementById('enquiry-modal-popup');
    const openEnquiryTriggers = document.querySelectorAll('.open-enquiry-trigger');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const popupEnquiryForm = document.getElementById('popup-enquiry-form');

    if (enquiryModal && openEnquiryTriggers.length > 0) {
        // Open Modal Event
        openEnquiryTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                enquiryModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock background scrolling
            });
        });

        // Close Modal Event
        const closeModal = () => {
            enquiryModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore background scrolling
            
            // Clear response messages if modal is closed
            const responseMsg = popupEnquiryForm.querySelector('.modal-response-msg');
            if (responseMsg) responseMsg.classList.add('d-none');
        };

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        // Close on dark backdrop click
        enquiryModal.addEventListener('click', (e) => {
            if (e.target === enquiryModal) {
                closeModal();
            }
        });

        // Submit listener inside Modal
        if (popupEnquiryForm) {
            popupEnquiryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const submitBtn = popupEnquiryForm.querySelector('.btn-submit-gold');
                const responseMsg = popupEnquiryForm.querySelector('.modal-response-msg');
                const nameVal = document.getElementById('modal-name').value.trim();
                const phoneVal = document.getElementById('modal-phone').value.trim();
                const emailVal = document.getElementById('modal-email').value.trim();
                const messageVal = document.getElementById('modal-message').value.trim();

                if (!nameVal || !phoneVal) {
                    showFeedback('Please fill out Name and Mobile fields.', 'error');
                    return;
                }

                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(phoneVal)) {
                    showFeedback('Please enter a valid 10-digit phone number.', 'error');
                    return;
                }

                const originalBtnContent = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Submitting...`;

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    
                    showFeedback(`<i class="fa-solid fa-circle-check me-2"></i>Thank you, ${nameVal}! Your doorstep inspection is requested. Home Decor Furnitures team will contact you in 15 minutes!`, 'success');
                    popupEnquiryForm.reset();
                    
                    // Auto-close popup modal after 3 seconds
                    setTimeout(() => {
                        closeModal();
                    }, 3000);
                }, 1200);

                function showFeedback(text, type) {
                    responseMsg.innerHTML = text;
                    responseMsg.className = `modal-response-msg mt-3 text-center ${type}`;
                    responseMsg.classList.remove('d-none');
                }
            });
        }
    }

    /* ==========================================
       9. CLIENT REVIEWS SWIPER (VANILLA AUTOPLAY & HOVER PAUSE)
       ========================================== */
    const reviewsTrack = document.getElementById('reviews-track');
    const reviewsContainer = document.querySelector('.reviews-slider-container');
    const dotsContainer = document.getElementById('reviews-dots');
    
    if (reviewsTrack && reviewsContainer && dotsContainer) {
        const slides = Array.from(reviewsTrack.children);
        const totalSlides = slides.length;
        let visibleSlides = 1;
        let currentIndex = 0;
        let autoplayTimer = null;
        const autoplayDelay = 3500; // 3.5 seconds

        const updateVisibleSlidesCount = () => {
            const width = window.innerWidth;
            if (width >= 992) {
                visibleSlides = 3;
            } else if (width >= 768) {
                visibleSlides = 2;
            } else {
                visibleSlides = 1;
            }
        };

        const getMaxIndex = () => {
            return Math.max(0, totalSlides - visibleSlides);
        };

        const createDots = () => {
            dotsContainer.innerHTML = '';
            const maxIndex = getMaxIndex();
            
            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === currentIndex) {
                    dot.classList.add('active');
                }
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetAutoplay();
                });
                dotsContainer.appendChild(dot);
            }
        };

        const updateDotsActiveState = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        const goToSlide = (index) => {
            const maxIndex = getMaxIndex();
            // Bound index
            if (index < 0) {
                currentIndex = maxIndex;
            } else if (index > maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            // Calculate translation percentage
            const slideWidthPercent = 100 / visibleSlides;
            const translateAmount = -(currentIndex * slideWidthPercent);
            reviewsTrack.style.transform = `translateX(${translateAmount}%)`;
            
            updateDotsActiveState();
        };

        const startAutoplay = () => {
            if (autoplayTimer) return;
            autoplayTimer = setInterval(() => {
                const maxIndex = getMaxIndex();
                if (currentIndex >= maxIndex) {
                    goToSlide(0);
                } else {
                    goToSlide(currentIndex + 1);
                }
            }, autoplayDelay);
        };

        const stopAutoplay = () => {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        };

        const resetAutoplay = () => {
            stopAutoplay();
            startAutoplay();
        };

        // Initialize Slider
        const initSlider = () => {
            updateVisibleSlidesCount();
            const maxIndex = getMaxIndex();
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            createDots();
            goToSlide(currentIndex);
            startAutoplay();
        };

        // Event Listeners for Hover to Pause/Resume
        reviewsContainer.addEventListener('mouseenter', stopAutoplay);
        reviewsContainer.addEventListener('mouseleave', startAutoplay);

        // Touch/Swipe Support
        let startX = 0;
        let isDragging = false;

        reviewsTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            stopAutoplay();
        }, { passive: true });

        reviewsTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    const maxIndex = getMaxIndex();
                    if (currentIndex < maxIndex) {
                        goToSlide(currentIndex + 1);
                    }
                } else {
                    if (currentIndex > 0) {
                        goToSlide(currentIndex - 1);
                    }
                }
            }
            startAutoplay();
        }, { passive: true });

        // Resize Listener
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                initSlider();
            }, 100);
        });

        // Run Init
        initSlider();
    }

    /* ==========================================
       10. INTERACTIVE FAQ ACCORDIONS
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const header = item.querySelector('.faq-header');
            const body = item.querySelector('.faq-body');
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
                    const otherBody = otherItem.querySelector('.faq-body');
                    otherBody.style.maxHeight = '0px';
                    otherBody.style.opacity = '0';
                });
                
                // If the clicked item was not active, open it
                if (!isActive) {
                    item.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                    
                    // Get internal scrollHeight of body content
                    const contentHeight = body.querySelector('.faq-body-content').scrollHeight + 10;
                    body.style.maxHeight = `${contentHeight}px`;
                    body.style.opacity = '1';
                }
            });
        });
    }
});
