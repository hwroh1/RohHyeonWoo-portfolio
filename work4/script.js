// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 방문 기록 저장 (work4 방문 확인)
    const viewedWorks = JSON.parse(localStorage.getItem('viewedWorks') || '[]');
    if (!viewedWorks.includes(4)) {
        viewedWorks.push(4);
        localStorage.setItem('viewedWorks', JSON.stringify(viewedWorks));
    }
    
    // Charts 비디오 시간차 재생 설정
    setupChartsVideo();
});

// Charts 비디오 시간차 재생 설정
function setupChartsVideo() {
    const chartsVideo = document.querySelector('.charts-video');
    if (chartsVideo) {
        chartsVideo.addEventListener('ended', function() {
            // 비디오가 끝나면 3초 대기 후 다시 재생
            setTimeout(() => {
                this.currentTime = 0;
                this.play();
            }, 3000);
        });
    }
}
