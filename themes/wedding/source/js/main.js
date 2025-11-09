/* ====================================
   Noble VIP Wedding Theme - JavaScript
   ==================================== */

(function() {
    'use strict';

    // ====================================
    // Countdown Timer
    // ====================================
    function initCountdown() {
        // Set wedding date - Change this to your actual wedding date
        const weddingDate = new Date('2025-12-25T10:00:00').getTime();

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
    // Guest Name Handler
    // ====================================
    function handleGuestName() {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('q');

        if (guestName) {
            const decodedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
            const guestGreetingSection = document.getElementById('guestGreetingSection');
            const guestNameElement = document.getElementById('guestName');

            if (guestGreetingSection && guestNameElement) {
                guestNameElement.textContent = decodedName;
                guestGreetingSection.style.display = 'block';
            }
        }
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
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQ1PSnB8CaaTzlOWvZqMhStO5xcNg1y4on7VgEJDIprUG_F5sP3TXx6VD0UjeD8KxT/exec';

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
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
        const correctHash = 'f81694f43f442b16589c907bd55747459b5b8d9ee3c1121a670aa31ef4d4ba25';

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

    function addGuest(name) {
        const guests = getGuests();
        const guest = {
            id: Date.now(),
            name: name,
            link: generateGuestLink(name),
            createdAt: new Date().toISOString()
        };
        guests.push(guest);
        saveGuests(guests);
        return guest;
    }

    function deleteGuest(id) {
        let guests = getGuests();
        guests = guests.filter(guest => guest.id !== id);
        saveGuests(guests);
    }

    function generateGuestLink(name) {
        const encodedName = encodeURIComponent(name).replace(/%20/g, '+');
        const baseUrl = window.location.origin;
        return `${baseUrl}/?q=${encodedName}`;
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
            html += `
                <div class="guest-item" data-id="${guest.id}">
                    <div class="guest-info">
                        <strong>${escapeHtml(guest.name)}</strong>
                        <div class="guest-link">${escapeHtml(guest.link)}</div>
                    </div>
                    <div class="guest-actions">
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
        const successMessage = document.getElementById('successMessage');
        const guestName = guestNameInput.value.trim();

        if (!guestName) {
            alert('Vui lòng nhập tên khách mời!');
            return;
        }

        addGuest(guestName);
        guestNameInput.value = '';

        successMessage.textContent = `Đã thêm khách mời: ${guestName}`;
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

        loadGuestList();
    }

    function copyLink(link) {
        navigator.clipboard.writeText(link).then(() => {
            const btn = event.target.closest('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Đã copy!';
            btn.style.background = '#28a745';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        }).catch(err => {
            alert('Không thể copy link. Vui lòng copy thủ công.');
        });
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

        // Check if already logged in
        const isLoggedIn = localStorage.getItem('wedding_admin_auth') === 'true';
        if (isLoggedIn && document.getElementById('adminPanel')) {
            showAdminPanel();
        }
    }

    // Expose functions to global scope
    window.weddingApp = {
        copyLink: copyLink,
        removeGuest: removeGuest
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
