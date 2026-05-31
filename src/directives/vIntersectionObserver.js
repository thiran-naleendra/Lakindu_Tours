const vIntersectionObserver = {
    mounted: (el) => {
        // Initial state
        el.classList.add('scroll-hidden');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger animation
                    el.classList.add('scroll-visible');
                    el.classList.remove('scroll-hidden');
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.1 // Trigger somewhat earlier
        });

        observer.observe(el);
    }
};

export default vIntersectionObserver;
