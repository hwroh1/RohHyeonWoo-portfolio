// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 방문 기록 저장 (work5 방문 확인)
    const viewedWorks = JSON.parse(localStorage.getItem('viewedWorks') || '[]');
    if (!viewedWorks.includes(5)) {
        viewedWorks.push(5);
        localStorage.setItem('viewedWorks', JSON.stringify(viewedWorks));
    }
    
    // Poster 섹션 클릭 시 조명 켜기
    const posterSection = document.getElementById('posterSection');
    const clickHint = document.getElementById('clickHint');
    
    if (posterSection && clickHint) {
        // 마우스 움직임 추적하여 click 힌트 위치 업데이트
        posterSection.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 커서 위치에서 약간 오른쪽 아래로 offset
            clickHint.style.left = (x + 15) + 'px';
            clickHint.style.top = (y + 15) + 'px';
            clickHint.style.opacity = '0.8';
        });
        
        // 마우스가 벗어나면 숨기기
        posterSection.addEventListener('mouseleave', function() {
            clickHint.style.opacity = '0';
        });
        
        // 클릭 시 조명 켜기 및 스크롤 활성화
        posterSection.addEventListener('click', function() {
            this.classList.add('light-on');
            document.body.classList.add('scroll-enabled');
        });
    }
});


