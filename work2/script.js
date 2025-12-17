// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 방문 기록 저장 (work7 방문 확인)
    const viewedWorks = JSON.parse(localStorage.getItem('viewedWorks') || '[]');
    if (!viewedWorks.includes(7)) {
        viewedWorks.push(7);
        localStorage.setItem('viewedWorks', JSON.stringify(viewedWorks));
    }
});



