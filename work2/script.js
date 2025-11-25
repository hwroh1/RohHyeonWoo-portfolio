// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 방문 기록 저장 (work2 방문 확인)
    const viewedWorks = JSON.parse(localStorage.getItem('viewedWorks') || '[]');
    if (!viewedWorks.includes(2)) {
        viewedWorks.push(2);
        localStorage.setItem('viewedWorks', JSON.stringify(viewedWorks));
    }
    
    // 3열 컬럼 스크롤 애니메이션
    setupColumnAnimation();
    
    // 비디오 스크롤 재생
    setupVideoPlay();
    
    // 연결선 애니메이션
    setupConnectionLines();
});

// 컬럼 애니메이션 설정
function setupColumnAnimation() {
    const columnContainers = document.querySelectorAll('.column-container');
    const threeColumnsSection = document.querySelector('.three-columns-section');
    
    if (columnContainers.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    // 컬럼 애니메이션
    const columnObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    columnContainers.forEach(container => {
        columnObserver.observe(container);
    });
    
    // 선과 텍스트 애니메이션
    if (threeColumnsSection) {
        const lineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-lines');
                }
            });
        }, observerOptions);
        
        lineObserver.observe(threeColumnsSection);
    }
}

// 비디오 스크롤 재생 설정
function setupVideoPlay() {
    const video = document.querySelector('.main-video');
    const videoContainer = document.querySelector('.main-video-container');
    
    if (!video || !videoContainer) return;
    
    let isPlaying = false;
    let isWaiting = false;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    // 비디오가 끝났을 때 일정 시간 대기 후 다시 재생
    video.addEventListener('ended', function() {
        isPlaying = false;
        isWaiting = true;
        
        // 2초 대기 후 다시 재생
        setTimeout(() => {
            if (isWaiting) {
                video.currentTime = 0;
                video.play().then(() => {
                    isPlaying = true;
                    isWaiting = false;
                }).catch(err => {
                    console.log('비디오 재생 실패:', err);
                });
            }
        }, 2000); // 2초 대기 (원하시면 시간 조정 가능)
    });
    
    const videoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isPlaying && !isWaiting) {
                video.play().then(() => {
                    isPlaying = true;
                }).catch(err => {
                    console.log('비디오 재생 실패:', err);
                });
            } else if (!entry.isIntersecting && isPlaying) {
                video.pause();
                isPlaying = false;
            }
        });
    }, observerOptions);
    
    videoObserver.observe(videoContainer);
}

// 연결선 애니메이션 설정
function setupConnectionLines() {
    const expectationSection = document.querySelector('.expectation-section');
    const expectationColumns = document.querySelector('.expectation-columns');
    const connectionLinesSvg = document.querySelector('.connection-lines');
    const listItems = document.querySelectorAll('.list-item');
    const spectrumContent = document.querySelector('.spectrum-content');
    
    if (!expectationSection || !connectionLinesSvg || listItems.length === 0 || !spectrumContent) return;
    
    // SVG 크기 설정
    const updateLines = () => {
        if (!expectationColumns || !spectrumContent) return;
        
        const columnsRect = expectationColumns.getBoundingClientRect();
        const svgWidth = columnsRect.width;
        const svgHeight = columnsRect.height;
        
        connectionLinesSvg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        connectionLinesSvg.setAttribute('width', svgWidth);
        connectionLinesSvg.setAttribute('height', svgHeight);
        
        // 기존 선 제거
        connectionLinesSvg.innerHTML = '';
        
        // 오른쪽 열의 "블" 글자 위치 계산
        const spectrumText = spectrumContent.querySelector('p');
        if (!spectrumText) return;
        
        const spectrumRect = spectrumContent.getBoundingClientRect();
        const columnsRect2 = expectationColumns.getBoundingClientRect();
        const targetX = spectrumRect.left - columnsRect2.left - 5; // "블" 글자 앞 5px 간격
        const targetY = spectrumRect.top - columnsRect2.top + 10; // "블" 글자 위치 (약간 조정)
        
        // 각 리스트 항목에서 선 그리기
        listItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const columnsRect3 = expectationColumns.getBoundingClientRect();
            
            // 리스트 항목의 오른쪽 끝 위치 (p 태그의 오른쪽 끝)
            const pElement = item.querySelector('p');
            if (!pElement) return;
            
            const pRect = pElement.getBoundingClientRect();
            const startX = pRect.right - columnsRect3.left - 270; // 왼쪽으로 270px 이동
            const startY = pRect.top - columnsRect3.top + (pRect.height / 2);
            
            // 직선 경로 생성
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', `connection-line line-${index + 1}`);
            path.setAttribute('d', `M ${startX} ${startY} L ${targetX} ${targetY}`);
            path.setAttribute('stroke', '#7b7b7b');
            path.setAttribute('stroke-width', '1');
            path.setAttribute('fill', 'none');
            
            connectionLinesSvg.appendChild(path);
        });
    };
    
    // 초기 선 그리기
    setTimeout(updateLines, 100);
    
    // 윈도우 리사이즈 시 업데이트
    window.addEventListener('resize', updateLines);
}
