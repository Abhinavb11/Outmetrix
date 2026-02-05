document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => {
        observer.observe(el);
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Particle Background (Canvas) ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2; // Small delicate particles
            this.speedX = (Math.random() * 1) - 0.5; // Slow floaty movement
            this.speedY = (Math.random() * 1) - 0.5;
            this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(0, 255, 221, '; // Electric Blue or Teal
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Boundary Check
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = (canvas.width * canvas.height) / 15000; // Density
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        // Connect particles (Constellation effect)
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    if (opacityValue > 0) {
                        ctx.strokeStyle = 'rgba(0, 240, 255,' + (opacityValue * 0.1) + ')'; // Very subtle connection lines
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    initParticles();
    animateParticles();

    // --- Ultra Smooth 3D Tilt Effect ---
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        let rect = null;
        let mouseX = 0;
        let mouseY = 0;
        let rafId = null;

        const update = () => {
            if (!rect) return;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((mouseY - centerY) / centerY) * -8;
            const rotateY = ((mouseX - centerX) / centerX) * 8;

            card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(1.04, 1.04, 1.04)
    `;

            rafId = requestAnimationFrame(update);
        };

        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
            card.style.transition = 'transform 0.08s ease-out';
            rafId = requestAnimationFrame(update);
        });

        card.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        card.addEventListener('mouseleave', () => {
            cancelAnimationFrame(rafId);
            rafId = null;
            rect = null;

            card.style.transition = 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)';
            card.style.transform = `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;
        });
    });

    // --- Smooth Anchor Scrolling (Optional polisher) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open (optional implementation if mobile menu logic existed)
            }
        });
    });
});
