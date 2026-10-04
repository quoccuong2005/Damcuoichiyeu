/* ====================================
   Noble VIP Wedding Theme - JavaScript
   ==================================== */

(function () {
    'use strict';

    // ====================================
    // ✨ Premium Invitation Opening Experience ✨
    // - Golden floating particles
    // - Cinematic envelope opening
    // - Elegant card reveal
    // ====================================
    function initPremiumInvitation() {
        const overlay = document.getElementById('grandInvitation');
        const envelope = document.getElementById('luxuryEnvelope');
        const card = document.getElementById('openingCard');
        const cta = document.getElementById('ctaContainer');
        const particlesContainer = document.getElementById('particlesContainer');

        if (!overlay || !envelope || !card) return;

        // Create floating golden particles
        createParticles(particlesContainer, 30);

        let isAnimating = false;

        function openInvitation() {
            if (isAnimating) return;
            isAnimating = true;

            // Play music immediately
            const audio = document.getElementById('weddingMusic');
            const musicBtn = document.getElementById('musicControl');
            if (audio) {
                audio.volume = 0.5;
                audio.play().catch(e => console.log("Autoplay blocked:", e));
            }

            // Hide CTA
            if (cta) cta.classList.add('hidden');

            // Stage 1: Open envelope flap (0-800ms)
            envelope.classList.add('opening');

            // Stage 2: Show card and hide envelope (800-1600ms)
            setTimeout(() => {
                envelope.classList.add('hidden');
                card.classList.add('visible');

                // Add extra particles burst
                createParticleBurst(particlesContainer, 20);
            }, 800);

            // Stage 3: Card zoom effect (1600-2200ms)
            setTimeout(() => {
                card.classList.add('zoom-in');
            }, 1800);

            // Stage 4: Fade out overlay (2500ms+)
            setTimeout(() => {
                overlay.classList.add('finished');

                // Show music control
                if (musicBtn) {
                    musicBtn.classList.add('visible');

                    // Music toggle event
                    musicBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (audio.paused) {
                            audio.play();
                            musicBtn.classList.remove('paused');
                        } else {
                            audio.pause();
                            musicBtn.classList.add('paused');
                        }
                    }, { once: true }); // Prevent multiple listeners if clicked fast, actually better to add listener outside
                }
            }, 2800);

            // Remove from DOM
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            }, 4000);
        }

        // Add music listener globally to prevent duplication
        const musicBtn = document.getElementById('musicControl');
        if (musicBtn) {
            musicBtn.addEventListener('click', () => {
                const audio = document.getElementById('weddingMusic');
                if (audio) {
                    if (audio.paused) {
                        audio.play();
                        musicBtn.classList.remove('paused');
                    } else {
                        audio.pause();
                        musicBtn.classList.add('paused');
                    }
                }
            });
        }

        // Click to open
        overlay.addEventListener('click', openInvitation);

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isAnimating && overlay.parentNode) {
                e.preventDefault();
                openInvitation();
            }
        });
    }

    // Create floating hearts and petals - romantic theme
    function createParticles(container, count) {
        if (!container) return;

        // Romantic symbols: hearts, petals, flowers
        const symbols = ['💗', '🌸', '💕', '🌷', '💖', '🌹', '✿', '❀'];

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = Math.random() * 5 + 6;
            const size = Math.random() * 10 + 12;

            particle.textContent = symbol;
            particle.style.cssText = `
                left: ${left}%;
                font-size: ${size}px;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;

            container.appendChild(particle);
        }
    }

    // Create heart burst effect when card appears
    function createParticleBurst(container, count) {
        if (!container) return;

        const hearts = ['💗', '💕', '💖', '❤️', '🌸'];

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const heart = hearts[Math.floor(Math.random() * hearts.length)];
            const size = Math.random() * 8 + 14;

            // Start from center
            const startX = 50 + (Math.random() - 0.5) * 15;
            const startY = 45;

            particle.textContent = heart;
            particle.style.cssText = `
                left: ${startX}%;
                top: ${startY}%;
                font-size: ${size}px;
                animation: none;
                opacity: 1;
                transition: all 1.8s ease-out;
            `;

            container.appendChild(particle);

            // Animate outward
            setTimeout(() => {
                const endX = startX + (Math.random() - 0.5) * 80;
                const endY = startY + (Math.random() - 0.5) * 60;
                particle.style.left = `${endX}%`;
                particle.style.top = `${endY}%`;
                particle.style.opacity = '0';
                particle.style.transform = 'scale(0.5)';
            }, 50);

            // Remove after animation
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }

    // Initialize premium invitation immediately
    initPremiumInvitation();


    // ====================================
    // Countdown Timer
    // ====================================
    function initCountdown() {
        const countdown = document.getElementById('countdown');
        if (!countdown) return;

        const weddingDate = new Date(
            `${countdown.dataset.weddingDate}T${countdown.dataset.weddingTime || '00:00'}:00`
        ).getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ====================================
    // Photo Carousel (Mobile Album)
    // ====================================
    function initPhotoCarousel() {
        const carousel = document.getElementById('photoCarousel');
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const dotsContainer = document.getElementById('carouselDots');
        const thumbnailsContainer = document.getElementById('carouselThumbnails');

        if (!carousel || !track) return;

        const slides = track.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        // Thumbnails handling
        let thumbItems = [];
        if (thumbnailsContainer) {
            thumbItems = thumbnailsContainer.querySelectorAll('.thumb-item');
            thumbItems.forEach((thumb, index) => {
                thumb.addEventListener('click', () => {
                    goToSlide(index);
                });
            });
        }

        // Create indicator dots (keep for fallback)
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            // Update thumbnails
            if (thumbItems.length > 0) {
                thumbItems.forEach((thumb, index) => {
                    thumb.classList.toggle('active', index === currentIndex);
                    // Scroll thumbnail into view (Disabled to prevent page jump)
                    /*
                    if (index === currentIndex && thumbnailsContainer) {
                        // Logic disabled to prevent page jump
                        // const thumbLeft = thumb.offsetLeft;
                        // const thumbWidth = thumb.offsetWidth;
                        // const containerWidth = thumbnailsContainer.offsetWidth;
                        // let scrollPos = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
                        // thumbnailsContainer.scrollTo({ left: scrollPos, behavior: 'smooth' });
                    }
                    */
                });
            }
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        // Navigation buttons
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Touch/Swipe support
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentX = startX; // Initialize currentX to avoid tap-as-swipe bug
            isDragging = true;
            track.style.transition = 'none';
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const offset = -currentIndex * 100 + (diff / carousel.offsetWidth) * 100;
            track.style.transform = `translateX(${offset}%)`;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.4s ease-out';

            const diff = currentX - startX;
            const threshold = carousel.offsetWidth * 0.15; // Reduced threshold for easier swiping

            // Only trigger swipe if there was actual movement
            if (Math.abs(diff) > 5) {
                if (diff > threshold) {
                    prevSlide();
                } else if (diff < -threshold) {
                    nextSlide();
                } else {
                    updateCarousel();
                }
            } else {
                updateCarousel();
            }
        });

        // Auto-play (optional - every 5 seconds)
        let autoPlayInterval = setInterval(nextSlide, 5000);

        carousel.addEventListener('touchstart', () => {
            clearInterval(autoPlayInterval);
        });

        carousel.addEventListener('touchend', () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        });
    }

    // ====================================
    // Guest Encoding/Decoding
    // ====================================
    function encodeGuest(name, side, showGift = true) {
        const data = JSON.stringify({ n: name, s: side, g: showGift });
        return btoa(unescape(encodeURIComponent(data)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // URL-safe Base64
    }

    function decodeGuest(code) {
        try {
            // Restore standard Base64
            let base64 = code.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) base64 += '=';
            const data = JSON.parse(decodeURIComponent(escape(atob(base64))));
            return {
                name: data.n,
                side: data.s,
                showGift: data.g !== undefined ? data.g : true // Default to true if not specified
            };
        } catch (e) {
            return null;
        }
    }

    // ====================================
    // Guest Name Handler (with encoded links)
    // ====================================
    function handleGuestName() {
        const urlParams = new URLSearchParams(window.location.search);

        let guestName = null;
        let guestSide = null;
        let showGift = true; // Default to show gift section

        // Check for encoded guest param first (?g=encoded)
        const gParam = urlParams.get('g');
        if (gParam) {
            const guestData = decodeGuest(gParam);
            if (guestData) {
                guestName = guestData.name;
                guestSide = guestData.side;
                showGift = guestData.showGift;
            }
        }

        // Fallback to old query param format for backward compatibility
        if (!guestName) {
            const qParam = urlParams.get('q');
            if (qParam) {
                guestName = decodeURIComponent(qParam.replace(/\+/g, ' '));
            }
        }

        if (guestName) {
            // Show guest greeting section
            const guestGreetingSection = document.getElementById('guestGreetingSection');
            const guestNameElement = document.getElementById('guestName');

            if (guestGreetingSection && guestNameElement) {
                guestNameElement.textContent = guestName;
                guestGreetingSection.style.display = 'block';
            }

            // Auto-fill RSVP form and hide name field
            const nameFieldGroup = document.getElementById('nameFieldGroup');
            const guestInfoDisplay = document.getElementById('guestInfoDisplay');
            const rsvpNameInput = document.getElementById('rsvpName');
            const rsvpGuestName = document.getElementById('rsvpGuestName');

            if (nameFieldGroup && guestInfoDisplay && rsvpNameInput && rsvpGuestName) {
                nameFieldGroup.style.display = 'none';
                rsvpNameInput.removeAttribute('required');
                guestInfoDisplay.style.display = 'block';
                rsvpGuestName.textContent = guestName;
                rsvpNameInput.value = guestName;
            }
        }

        // Conditional display based on guest side
        applyGuestSideFilter(guestSide);

        // Conditional display for gift section
        applyGiftSectionFilter(showGift);
    }

    // ====================================
    // Apply Gift Section Filter (show/hide gift box)
    // ====================================
    function applyGiftSectionFilter(showGift) {
        const giftSection = document.querySelector('.gift-section');

        if (!giftSection) return;

        if (showGift === false) {
            giftSection.style.display = 'none';
        } else {
            // Default: show the gift section
            giftSection.style.display = '';
        }
    }

    // ====================================
    // Apply Guest Side Filter (show/hide based on side)
    // ====================================
    function applyGuestSideFilter(side) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const nhaTrai = document.getElementById('nha-trai');
        const nhaGai = document.getElementById('nha-gai');
        const groomGiftCard = document.getElementById('groomGiftCard');
        const brideGiftCard = document.getElementById('brideGiftCard');

        if (!side) {
            // No side specified - show everything (default)
            return;
        }

        if (side === 'nha-trai') {
            // Hide Nhà Gái tab and card
            tabBtns.forEach(btn => {
                if (btn.dataset.tab === 'nha-gai') btn.style.display = 'none';
            });
            if (nhaGai) nhaGai.style.display = 'none';
            if (brideGiftCard) brideGiftCard.style.display = 'none';
            // Ensure Nhà Trai is active
            if (nhaTrai) nhaTrai.classList.add('active');
        } else if (side === 'nha-gai') {
            // Hide Nhà Trai tab and card
            tabBtns.forEach(btn => {
                if (btn.dataset.tab === 'nha-trai') btn.style.display = 'none';
            });
            if (nhaTrai) nhaTrai.style.display = 'none';
            if (groomGiftCard) groomGiftCard.style.display = 'none';
            // Ensure Nhà Gái is active
            if (nhaGai) {
                nhaGai.classList.add('active');
                nhaGai.style.display = 'block';
            }
        }
    }

    // ====================================
    // Attendance Card Selection Handler
    // ====================================
    function initAttendanceCards() {
        const attendanceCards = document.querySelectorAll('.attendance-card');

        attendanceCards.forEach(card => {
            const radio = card.querySelector('input[type="radio"]');

            // Handle click on card
            card.addEventListener('click', () => {
                // Remove selected from all cards
                attendanceCards.forEach(c => c.classList.remove('selected'));
                // Add selected to clicked card
                card.classList.add('selected');
            });

            // Handle radio change (for keyboard navigation)
            if (radio) {
                radio.addEventListener('change', () => {
                    attendanceCards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                });
            }
        });
    }

    // ====================================
    // Flip Book Functionality
    // ====================================
    function initFlipBook() {
        const flipBook = document.getElementById('flipBook');
        if (!flipBook) return;

        const pages = flipBook.querySelectorAll('.page');
        const prevBtn = document.getElementById('flipPrev');
        const nextBtn = document.getElementById('flipNext');
        const currentPageEl = document.getElementById('currentPage');
        const totalPagesEl = document.getElementById('totalPages');

        let currentPage = 0;
        const totalPages = pages.length;

        // Update total pages display
        if (totalPagesEl) {
            totalPagesEl.textContent = totalPages;
        }

        // Update page indicator and button states
        function updateControls() {
            if (currentPageEl) {
                currentPageEl.textContent = currentPage + 1;
            }

            if (prevBtn) {
                prevBtn.disabled = currentPage === 0;
            }

            if (nextBtn) {
                nextBtn.disabled = currentPage >= totalPages - 1;
            }
        }

        // Flip to next page
        function flipNext() {
            if (currentPage < totalPages - 1) {
                const page = pages[currentPage];
                page.classList.add('flipped');

                // Update z-index for proper stacking
                page.style.zIndex = totalPages + currentPage;

                currentPage++;
                updateControls();
            }
        }

        // Flip to previous page
        function flipPrev() {
            if (currentPage > 0) {
                currentPage--;
                const page = pages[currentPage];
                page.classList.remove('flipped');

                // Reset z-index
                page.style.zIndex = totalPages - currentPage;

                updateControls();
            }
        }

        // Initialize z-index for pages (reverse order for proper stacking)
        pages.forEach((page, index) => {
            page.style.zIndex = totalPages - index;
        });

        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', flipNext);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', flipPrev);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Only handle if book is visible
            const bookSection = document.querySelector('.flip-book-section');
            if (!bookSection || window.getComputedStyle(bookSection).display === 'none') {
                return;
            }

            if (e.key === 'ArrowRight') {
                flipNext();
            } else if (e.key === 'ArrowLeft') {
                flipPrev();
            }
        });

        // Click on page to flip
        pages.forEach((page, index) => {
            page.addEventListener('click', () => {
                if (index === currentPage) {
                    flipNext();
                }
            });
        });

        // Initial state
        updateControls();
    }

    // ====================================
    // RSVP Form Handler with Google Sheets
    // ====================================
    async function handleRSVP(event) {
        event.preventDefault();

        const submitButton = event.target.querySelector('button[type="submit"]');
        const successMessage = document.getElementById('rsvpSuccess');
        const errorMessage = document.getElementById('rsvpError');

        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        const formData = {
            name: document.getElementById('rsvpName').value,
            phone: document.getElementById('rsvpPhone').value,
            attendance: document.querySelector('input[name="attendance"]:checked').value,
            message: document.getElementById('rsvpMessage').value,
            timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
        };

        // Save to localStorage as backup
        let rsvpList = JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
        rsvpList.push(formData);
        localStorage.setItem('wedding_rsvp', JSON.stringify(rsvpList));

        // Send to Google Sheets
        // Replace this URL with your Google Apps Script Web App URL
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySE1KYyhMyNaC_-rsgD3VAiwPL2YLnK3H16V33TcfdsNSDvrc_55wm_eEvF4AoQmnl/exec';

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(formData)
            });

            // Note: no-cors mode doesn't allow reading response, so we assume success
            successMessage.style.display = 'block';
            document.getElementById('rsvpForm').reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

        } catch (error) {
            console.error('Error submitting RSVP:', error);
            errorMessage.style.display = 'block';

            // Hide error message after 5 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi Xác Nhận';
        }
    }

    // ====================================
    // Scroll Animations (Intersection Observer)
    // ====================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('.invitation-section, .gallery-section, .timeline-section, .rsvp-section, .location-section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Observe gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            setTimeout(() => {
                observer.observe(item);
            }, index * 100);
        });
    }

    // ====================================
    // Smooth Scroll for anchor links
    // ====================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ====================================
    // Invitation Tabs Functionality
    // ====================================
    function initInvitationTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        if (tabButtons.length === 0) return;

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // Remove active from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active to clicked button and corresponding content
                button.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // ====================================
    // Admin Panel - Password Hashing
    // ====================================
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // ====================================
    // Admin Panel - Authentication
    // ====================================
    async function handleLogin(event) {
        event.preventDefault();

        const passwordInput = document.getElementById('adminPassword');
        const errorMessage = document.getElementById('errorMessage');
        const password = passwordInput.value;

        const hashedPassword = await hashPassword(password);

        // Default password: "admin123"
        const correctHash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

        if (hashedPassword === correctHash) {
            localStorage.setItem('wedding_admin_auth', 'true');
            showAdminPanel();
            errorMessage.style.display = 'none';
            passwordInput.value = '';
        } else {
            errorMessage.textContent = 'Mật khẩu không đúng!';
            errorMessage.style.display = 'block';
        }
    }

    // ====================================
    // Admin Panel - Show/Hide
    // ====================================
    function showAdminPanel() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadGuestList();
    }

    function handleLogout() {
        localStorage.removeItem('wedding_admin_auth');
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('adminPassword').value = '';
    }

    // ====================================
    // Guest Management
    // ====================================
    function getGuests() {
        const guestsData = localStorage.getItem('wedding_guests');
        return guestsData ? JSON.parse(guestsData) : [];
    }

    function saveGuests(guests) {
        localStorage.setItem('wedding_guests', JSON.stringify(guests));
    }

    function addGuest(name, side, showGift = true) {
        const guests = getGuests();
        const code = encodeGuest(name, side, showGift);
        const guest = {
            id: Date.now(),
            name: name,
            side: side,
            showGift: showGift,
            code: code,
            link: generateGuestLink(code),
            createdAt: new Date().toISOString()
        };
        guests.unshift(guest);
        saveGuests(guests);
        return guest;
    }

    function deleteGuest(id) {
        let guests = getGuests();
        guests = guests.filter(guest => guest.id !== id);
        saveGuests(guests);
    }

    function generateGuestLink(code) {
        const baseUrl = window.location.origin;
        return `${baseUrl}/?g=${code}`;
    }

    function loadGuestList() {
        const guests = getGuests();
        const guestListContainer = document.getElementById('guestListContainer');

        if (!guestListContainer) return;

        if (guests.length === 0) {
            guestListContainer.innerHTML = '<div class="empty-state">Chưa có khách mời nào được thêm.</div>';
            return;
        }

        let html = '';
        guests.forEach(guest => {
            const sideLabel = guest.side === 'nha-trai' ? '🤵' : (guest.side === 'nha-gai' ? '👰' : '');
            html += `
                <div class="guest-item" data-id="${guest.id}">
                    <div class="guest-info">
                        <strong>${sideLabel} ${escapeHtml(guest.name)}</strong>
                        <div class="guest-link">${escapeHtml(guest.link)}</div>
                    </div>
                    <div class="guest-actions">
                        <button class="btn-small btn-qr" onclick="window.weddingApp.showQR('${escapeHtml(guest.link)}', '${escapeHtml(guest.name)}')">
                            <i class="fas fa-qrcode"></i> QR
                        </button>
                        <button class="btn-small btn-copy" onclick="window.weddingApp.copyLink('${escapeHtml(guest.link)}')">
                            <i class="far fa-copy"></i> Copy
                        </button>
                        <button class="btn-small btn-delete" onclick="window.weddingApp.removeGuest(${guest.id})">
                            <i class="far fa-trash-alt"></i> Xóa
                        </button>
                    </div>
                </div>
            `;
        });

        guestListContainer.innerHTML = html;
    }

    function handleAddGuest(event) {
        event.preventDefault();

        const guestNameInput = document.getElementById('guestName');
        const guestSideSelect = document.getElementById('guestSide');
        const showGiftCheckbox = document.getElementById('showGiftBox');
        const successMessage = document.getElementById('successMessage');
        const guestName = guestNameInput.value.trim();
        const guestSide = guestSideSelect ? guestSideSelect.value : 'nha-trai';
        const showGift = showGiftCheckbox ? showGiftCheckbox.checked : true;

        if (!guestName) {
            alert('Vui lòng nhập tên khách mời!');
            return;
        }

        addGuest(guestName, guestSide, showGift);
        guestNameInput.value = '';

        const sideLabel = guestSide === 'nha-trai' ? '🤵 Nhà Trai' : '👰 Nhà Gái';
        const giftLabel = showGift ? '🎁 Có Quà' : '❌ Không Quà';
        successMessage.textContent = `Đã thêm khách mời: ${guestName} (${sideLabel}, ${giftLabel})`;
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

        loadGuestList();
    }

    function showQR(link, name) {
        const modal = document.getElementById('qrModal');
        const qrDisplay = document.getElementById('qrcodeDisplay');
        const nameDisplay = document.getElementById('qrGuestName');

        if (!modal || !qrDisplay) return;

        qrDisplay.innerHTML = '';
        if (nameDisplay) nameDisplay.textContent = name;

        try {
            new QRCode(qrDisplay, {
                text: link,
                width: 200,
                height: 200,
                colorDark: "#5e3023",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            modal.style.display = 'flex';
        } catch (e) {
            console.error("QR Generation failed", e);
            alert("Lỗi tạo mã QR. Hãy thử tải lại trang.");
        }
    }

    function copyLink(link) {
        // Fallback for older browsers or non-secure contexts
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(link);
            return;
        }

        navigator.clipboard.writeText(link).then(() => {
            showCopySuccess(event.target);
        }).catch(err => {
            console.warn('Clipboard API failed, trying fallback:', err);
            fallbackCopyTextToClipboard(link);
        });
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Ensure textarea is not visible but part of DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopySuccess(event.target);
            } else {
                console.error('Fallback copy failed.');
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
        }

        document.body.removeChild(textArea);
    }

    function showCopySuccess(button) {
        const btn = button.closest('button') || button;
        if (!btn) return;

        const originalText = btn.innerHTML;
        const originalBg = btn.style.background;

        btn.innerHTML = '<i class="fas fa-check"></i> Đã copy!';
        btn.style.background = '#28a745';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = originalBg;
        }, 2000);
    }

    function removeGuest(id) {
        if (confirm('Bạn có chắc muốn xóa khách mời này?')) {
            deleteGuest(id);
            loadGuestList();
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ====================================
    // Initialize
    // ====================================
    function init() {
        // Initialize countdown timer
        if (document.getElementById('countdown')) {
            initCountdown();
        }

        // Handle guest name
        handleGuestName();

        // Initialize scroll animations
        initScrollAnimations();

        // Initialize smooth scroll
        initSmoothScroll();

        // Initialize invitation tabs
        initInvitationTabs();

        // Initialize attendance card selection
        initAttendanceCards();

        // Initialize flip book
        initFlipBook();

        // Initialize photo carousel (Mobile)
        initPhotoCarousel();

        // RSVP Form
        const rsvpForm = document.getElementById('rsvpForm');
        if (rsvpForm) {
            rsvpForm.addEventListener('submit', handleRSVP);
        }

        // Admin panel event listeners
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        const addGuestForm = document.getElementById('addGuestForm');
        if (addGuestForm) {
            addGuestForm.addEventListener('submit', handleAddGuest);
        }

        // QR Modal close
        const qrModal = document.getElementById('qrModal');
        const closeQrBtn = document.querySelector('.close-qr-modal');
        if (qrModal && closeQrBtn) {
            closeQrBtn.addEventListener('click', () => {
                qrModal.style.display = 'none';
            });
            window.addEventListener('click', (e) => {
                if (e.target === qrModal) {
                    qrModal.style.display = 'none';
                }
            });
        }

        // Gift Box interaction
        const giftBox = document.getElementById('giftBox');
        const giftReveal = document.getElementById('giftReveal');
        if (giftBox && giftReveal) {
            giftBox.addEventListener('click', () => {
                giftBox.classList.add('opened');
                giftReveal.classList.add('show');
            });
        }

        // Check if already logged in
        const isLoggedIn = localStorage.getItem('wedding_admin_auth') === 'true';
        if (isLoggedIn && document.getElementById('adminPanel')) {
            showAdminPanel();
        }
    }

    // Expose functions to global scope
    window.weddingApp = {
        copyLink: copyLink,
        removeGuest: removeGuest,
        showQR: showQR
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
