const header = document.querySelector('header');

function updateHeaderSurface() {
    if (!header) {
        return;
    }

    header.classList.toggle('is-scrolled', window.scrollY > 8);
}

updateHeaderSurface();
window.addEventListener('scroll', updateHeaderSurface, { passive: true });

document.querySelectorAll('.phone-carousel').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.phone-carousel-slide'));
    const dots = Array.from(carousel.querySelectorAll('.phone-carousel-dot'));
    const frame = carousel.querySelector('.phone-placeholder');
    let activeIndex = 0;
    let touchStartX = 0;
    let pointerStartX = 0;

    function setActiveSlide(index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === activeIndex);
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle('is-active', isActive);

            if (isActive) {
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
            }
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => setActiveSlide(index));
    });

    if (frame) {
        frame.addEventListener('touchstart', (event) => {
            touchStartX = event.changedTouches[0].clientX;
        }, { passive: true });

        frame.addEventListener('touchend', (event) => {
            const touchEndX = event.changedTouches[0].clientX;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) < 35) {
                return;
            }

            setActiveSlide(activeIndex + (swipeDistance < 0 ? 1 : -1));
        }, { passive: true });

        frame.addEventListener('pointerdown', (event) => {
            if (event.pointerType === 'touch') {
                return;
            }

            pointerStartX = event.clientX;
        });

        frame.addEventListener('pointerup', (event) => {
            if (event.pointerType === 'touch') {
                return;
            }

            const swipeDistance = event.clientX - pointerStartX;

            if (Math.abs(swipeDistance) < 35) {
                return;
            }

            setActiveSlide(activeIndex + (swipeDistance < 0 ? 1 : -1));
        });
    }

    setActiveSlide(0);
});
