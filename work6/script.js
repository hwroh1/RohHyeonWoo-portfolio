// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 방문 기록 저장 (work6 방문 확인)
    const viewedWorks = JSON.parse(localStorage.getItem('viewedWorks') || '[]');
    if (!viewedWorks.includes(6)) {
        viewedWorks.push(6);
        localStorage.setItem('viewedWorks', JSON.stringify(viewedWorks));
    }
    
    // 비디오 자동재생 설정
    const making1 = document.getElementById('making1');
    
    if (making1) {
        // 비디오 재생 속도를 1.5배로 설정
        making1.playbackRate = 1.5;
        
        // 1번 비디오 자동 재생 시도 (muted 상태로)
        making1.play().catch(function(error) {
            console.log('비디오 자동재생이 차단되었습니다:', error);
        });
    }
});

