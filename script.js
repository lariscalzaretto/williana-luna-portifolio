document.addEventListener('DOMContentLoaded', () => {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    const modal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const closeModal = document.querySelector('.modal-close');

    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const carouselContainer = wrapper.closest('.carousel-container'); // Mapeia o carrossel pai

        wrapper.addEventListener('click', () => {
            // Verifica a largura da tela (900px é o ponto de quebra do seu CSS mobile)
            const isMobile = window.innerWidth <= 900;

            if (isMobile) {
                // Comportamento Mobile: Abre no Popup (Modal)
                modalVideo.src = video.getAttribute('src');
                modal.classList.add('active');
                modalVideo.play();
            } else {
                // Comportamento Desktop: Play/Pause in-line
                if (video.paused) {
                    // Pausa todos os outros vídeos e destrava os outros carrosséis
                    document.querySelectorAll('.video-wrapper video').forEach(v => {
                        v.pause();
                        v.parentElement.classList.remove('is-playing');
                        const otherContainer = v.closest('.carousel-container');
                        if(otherContainer) otherContainer.classList.remove('is-paused');
                    });
                    
                    video.play();
                    wrapper.classList.add('is-playing');
                    if(carouselContainer) carouselContainer.classList.add('is-paused'); // Trava o carrossel atual
                } else {
                    video.pause();
                    wrapper.classList.remove('is-playing');
                    if(carouselContainer) carouselContainer.classList.remove('is-paused'); // Destrava o carrossel
                }
            }
        });

        // Retoma o giro do carrossel automaticamente quando o vídeo chegar ao fim
        video.addEventListener('ended', () => {
            wrapper.classList.remove('is-playing');
            if(carouselContainer) carouselContainer.classList.remove('is-paused');
        });
    });

    // Função central para fechar e limpar o modal (Mobile)
    const closeAndClearModal = () => {
        modal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = ''; // Limpa o src para parar o carregamento em background
    };

    // Fechar ao clicar no botão X
    closeModal.addEventListener('click', closeAndClearModal);

    // Fechar ao clicar na área escura fora do vídeo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAndClearModal();
        }
    });

    // Fechar automaticamente quando o vídeo do modal terminar
    modalVideo.addEventListener('ended', closeAndClearModal);
});