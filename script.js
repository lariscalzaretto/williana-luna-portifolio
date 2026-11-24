document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica do Modal de Vídeos
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const closeVideoBtn = document.getElementById('close-video-modal');

    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const carouselContainer = wrapper.closest('.carousel-container');

        wrapper.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 900;

            if (isMobile) {
                modalVideo.src = video.getAttribute('src');
                videoModal.classList.add('active');
                modalVideo.play();
            } else {
                if (video.paused) {
                    document.querySelectorAll('.video-wrapper video').forEach(v => {
                        v.pause();
                        v.parentElement.classList.remove('is-playing');
                        const otherContainer = v.closest('.carousel-container');
                        if(otherContainer) otherContainer.classList.remove('is-paused');
                    });
                    
                    video.play();
                    wrapper.classList.add('is-playing');
                    if(carouselContainer) carouselContainer.classList.add('is-paused');
                } else {
                    video.pause();
                    wrapper.classList.remove('is-playing');
                    if(carouselContainer) carouselContainer.classList.remove('is-paused');
                }
            }
        });

        video.addEventListener('ended', () => {
            wrapper.classList.remove('is-playing');
            if(carouselContainer) carouselContainer.classList.remove('is-paused');
        });
    });

    const closeAndClearVideoModal = () => {
        videoModal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = ''; 
    };

    closeVideoBtn.addEventListener('click', closeAndClearVideoModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeAndClearVideoModal();
    });
    modalVideo.addEventListener('ended', closeAndClearVideoModal);

    // 2. Lógica do Modal de Imagens (Feed)
    const feedImages = document.querySelectorAll('.feed-img');
    const imageModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeImageBtn = document.getElementById('close-image-modal');

    feedImages.forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.getAttribute('src');
            imageModal.classList.add('active');
        });
    });

    const closeAndClearImageModal = () => {
        imageModal.classList.remove('active');
        modalImg.src = '';
    };

    closeImageBtn.addEventListener('click', closeAndClearImageModal);
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) closeAndClearImageModal();
    });

    // 3. Lógica de Auto-Scroll Híbrido no Mobile
    if (window.innerWidth <= 900) {
        const carousels = document.querySelectorAll('.carousel-container');
        
        carousels.forEach(container => {
            let isTouching = false;
            const track = container.querySelector('.carousel-track');
            const isReverse = container.classList.contains('reverse-scroll');
            let currentScroll = 0; // Armazena a posição de forma flutuante para fluidez

            // Pausa o giro quando o usuário interage
            container.addEventListener('touchstart', () => isTouching = true, {passive: true});
            container.addEventListener('touchend', () => {
                setTimeout(() => isTouching = false, 1500); // Retoma 1.5s após soltar
            });
            
            // Sincroniza a posição atual quando arrastado com o dedo (inércia do mobile)
            container.addEventListener('scroll', () => {
                if (isTouching) currentScroll = container.scrollLeft;
            }, {passive: true});

            // Ajuste inicial para carrosséis reversos
            if (isReverse) {
                setTimeout(() => {
                    currentScroll = track.scrollWidth / 2;
                    container.scrollLeft = currentScroll;
                }, 100);
            }

            function autoScroll() {
                // Roda automaticamente apenas se os modais não estiverem abertos
                if (!isTouching && !videoModal.classList.contains('active') && !imageModal.classList.contains('active')) {
                    const maxScroll = track.scrollWidth / 2;
                    const speed = 0.6; // Velocidade constante
                    
                    if (isReverse) {
                        currentScroll -= speed;
                        if (currentScroll <= 0) currentScroll = maxScroll;
                    } else {
                        currentScroll += speed;
                        if (currentScroll >= maxScroll) currentScroll = 0;
                    }
                    container.scrollLeft = currentScroll;
                }
                requestAnimationFrame(autoScroll);
            }
            requestAnimationFrame(autoScroll);
        });
    }
});
// 4. Serviços: lista interativa (abre um por vez)
document.querySelectorAll('.service-head').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.service');
        const willOpen = !item.classList.contains('open');
        document.querySelectorAll('.service.open').forEach(o => {
            o.classList.remove('open');
            o.querySelector('.service-head').setAttribute('aria-expanded', 'false');
        });
        if (willOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});
