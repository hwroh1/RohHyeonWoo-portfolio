// 이미지 개수
const imageCount = 140;

// 이미지 컨테이너
const shapesContainer = document.getElementById('shapes-container');

// 이미지 파일 목록
const imageFiles = [
    '9.png', 'Layer 100.png', 'Layer 102.png', 'Layer 104.png', 'Layer 108.png',
    'Layer 109.png', 'Layer 11.png', 'Layer 110.png', 'Layer 111.png', 'Layer 112.png',
    'Layer 113.png', 'Layer 116.png', 'Layer 12.png', 'Layer 121.png', 'Layer 126.png',
    'Layer 127.png', 'Layer 13.png', 'Layer 131.png', 'Layer 132.png', 'Layer 136.png',
    'Layer 137.png', 'Layer 138.png', 'Layer 139.png', 'Layer 142.png', 'Layer 143.png',
    'Layer 144.png', 'Layer 147.png', 'Layer 148.png', 'Layer 149.png', 'Layer 154.png',
    'Layer 155.png', 'Layer 158.png', 'Layer 159.png', 'Layer 16.png', 'Layer 160.png',
    'Layer 161.png', 'Layer 162.png', 'Layer 163.png', 'Layer 164.png', 'Layer 168.png',
    'Layer 170.png', 'Layer 171.png', 'Layer 172.png', 'Layer 173.png', 'Layer 174.png',
    'Layer 175.png', 'Layer 176.png', 'Layer 178.png', 'Layer 18.png', 'Layer 181.png',
    'Layer 182.png', 'Layer 186.png', 'Layer 187.png', 'Layer 190.png', 'Layer 191.png',
    'Layer 193.png', 'Layer 194.png', 'Layer 198.png', 'Layer 199.png', 'Layer 200.png',
    'Layer 201.png', 'Layer 202.png', 'Layer 204.png', 'Layer 209.png', 'Layer 213.png',
    'Layer 22.png', 'Layer 24.png', 'Layer 27.png', 'Layer 29.png', 'Layer 34.png',
    'Layer 35.png', 'Layer 37.png', 'Layer 38.png', 'Layer 4.png', 'Layer 42.png',
    'Layer 43.png', 'Layer 44.png', 'Layer 45.png', 'Layer 46.png', 'Layer 47.png',
    'Layer 48.png', 'Layer 52.png', 'Layer 53.png', 'Layer 55.png', 'Layer 57.png',
    'Layer 62.png', 'Layer 63.png', 'Layer 69.png', 'Layer 71.png', 'Layer 73.png',
    'Layer 74.png', 'Layer 79@2x.png', 'Layer 81.png', 'Layer 82.png', 'Layer 83.png',
    'Layer 84.png', 'Layer 85.png', 'Layer 86.png', 'Layer 87.png', 'Layer 90.png',
    'Layer 94.png', 'Layer 95.png', 'Layer 99.png', 'Portraits - Moody Blues.png', '몸통.png'
];

// 랜덤 숫자 생성 함수
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// 생성된 이미지들의 위치를 추적
const usedPositions = [];

// 충돌 감지 함수 (그리드 기반)
function isPositionValid(newX, newY, minDistance = 80) {
    for (let pos of usedPositions) {
        const distance = Math.sqrt((newX - pos.x) ** 2 + (newY - pos.y) ** 2);
        if (distance < minDistance) {
            return false;
        }
    }
    return true;
}

// 균등한 분포를 위한 위치 생성
function getRandomPosition() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 현재 생성 중인 이미지의 인덱스
    const currentIndex = usedPositions.length;
    
    // 간단한 그리드 계산 (더 많은 열과 행)
    const cols = Math.ceil(Math.sqrt(imageCount * 4)); // 4배로 늘려서 더 촘촘하게
    const rows = Math.ceil(imageCount / cols);
    
    const col = currentIndex % cols;
    const row = Math.floor(currentIndex / cols);
    
    // 기본 그리드 위치
    let x = (col / (cols - 1)) * windowWidth;
    let y = (row / (rows - 1)) * windowHeight;
    
    // 충돌 감지 및 재배치 (그리드 내에서만)
    let attempts = 0;
    while (!isPositionValid(x, y) && attempts < 30) {
        // 그리드 셀 내에서만 작은 랜덤 오프셋 추가
        const cellWidth = windowWidth / cols;
        const cellHeight = windowHeight / rows;
        const offsetX = (Math.random() - 0.5) * cellWidth * 0.8;
        const offsetY = (Math.random() - 0.5) * cellHeight * 0.8;
        
        x = Math.max(0, Math.min(windowWidth, x + offsetX));
        y = Math.max(0, Math.min(windowHeight, y + offsetY));
        attempts++;
    }
    
    usedPositions.push({ x, y });
    return { x, y };
}

// 랜덤 스케일 생성
function getRandomScale() {
    return getRandomNumber(0.1, 0.3);
}

// 마우스 위치 추적
let mouseX = 0;
let mouseY = 0;

// 마우스 움직임 이벤트
document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    
    // 모든 이미지에 대해 마우스와의 거리 확인
    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach(container => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 마우스와 이미지 중심 사이의 거리 계산
        const distance = Math.sqrt(
            Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
        );
        
        // 마우스가 가까이 오면 (100px 이내) 이미지가 도망가기
        if (distance < 100) {
            // 이미지가 로드되지 않았으면 무시
            const img = container.querySelector('img');
            if (!img || !img.complete || img.naturalWidth === 0) {
                return;
            }
            
            // 마우스와 이미지의 중심 사이의 각도 계산
            const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
            
            // 도망갈 거리와 방향 (마우스 반대편으로)
            const escapeDistance = 120;
            const moveX = Math.cos(angle + Math.PI) * escapeDistance; // 반대 방향
            const moveY = Math.sin(angle + Math.PI) * escapeDistance;
            
            // 도망가는 효과 (이동 중이어도 계속 피하기)
            container.style.transform = `translate(${moveX}px, ${moveY}px)`;
            container.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            container.style.zIndex = '10';
        }
    });
});

// 이미지 생성 함수
function createImage(imageFile) {
    const imageContainer = document.createElement('div');
    const position = getRandomPosition();
    
    // 이미지 컨테이너 클래스 추가
    imageContainer.className = 'image-container';
    
    // 위치 설정
    imageContainer.style.left = `${position.x}px`;
    imageContainer.style.top = `${position.y}px`;
    
    // 이미지 요소 생성
    const img = document.createElement('img');
        img.src = `조각/${imageFile}`;
    img.alt = 'Interactive Image';
    
    // 호버 이벤트는 제거 (마우스 움직임으로 대체)
    
    // 이미지 로드 성공 시
    img.onload = function() {
        // 컨테이너를 고정 크기로 설정 (원처럼 간단하게)
        imageContainer.style.width = '80px'; // 100px * 0.8
        imageContainer.style.height = '80px';
    };
    
    // 이미지 로드 실패 시 컨테이너 제거
    img.onerror = function() {
        console.log(`이미지 로드 실패: ${imageFile}`);
        imageContainer.remove();
        return false; // 실패한 이미지 대신 새 이미지 생성
    };
    
    imageContainer.appendChild(img);
    
    return imageContainer;
}

// 이미지들 초기화
function initializeImages() {
    // 기존 이미지들 제거
    shapesContainer.innerHTML = '';
    
    // 위치 배열 초기화
    usedPositions.length = 0;
    
    // 중복 허용하여 이미지 파일 선택 (더 많은 이미지 표시)
    const selectedImages = [];
    for (let i = 0; i < imageCount; i++) {
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        selectedImages.push(imageFiles[randomIndex]);
    }
    
    let loadedCount = 0;
    
    // 새 이미지들 생성
    for (let i = 0; i < imageCount; i++) {
        const imageContainer = createImage(selectedImages[i]);
        
        // 이미지 로드 성공 시 카운트
        const img = imageContainer.querySelector('img');
        img.onload = function() {
            loadedCount++;
            console.log(`로드된 이미지: ${loadedCount}/${imageCount}`);
        };
        
        shapesContainer.appendChild(imageContainer);
    }
    
    // 디버깅을 위한 로그
    console.log(`총 ${imageCount}개의 이미지 컨테이너가 생성되었습니다.`);
}

// 윈도우 리사이즈 시 이미지들 재배치
function handleResize() {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        initializeImages();
    }, 250);
}

// 페이지 갤러리 애니메이션 제어
function setupPageGallery() {
    const pageImages = document.querySelectorAll('.page-image');
    const galleryContainer = document.querySelector('.page-gallery-container');
    
    if (pageImages.length > 0 && galleryContainer) {
        pageImages.forEach(image => {
            image.addEventListener('mouseenter', function() {
                galleryContainer.classList.add('paused');
            });
            
            image.addEventListener('mouseleave', function() {
                galleryContainer.classList.remove('paused');
            });
        });
    }
}

// 햄버거 메뉴 제어
function setupHamburgerMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (hamburgerMenu && menuOverlay) {
        // 호버 시 메뉴 열기
        hamburgerMenu.addEventListener('mouseenter', function() {
            menuOverlay.classList.add('active');
        });
        
        // 메뉴에서 마우스가 벗어나면 닫기
        hamburgerMenu.addEventListener('mouseleave', function() {
            menuOverlay.classList.remove('active');
        });
        
        // 메뉴 오버레이에서 마우스가 벗어나면 닫기
        menuOverlay.addEventListener('mouseleave', function() {
            menuOverlay.classList.remove('active');
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeImages();
    setupPageGallery();
    setupHamburgerMenu();
    window.addEventListener('resize', handleResize);
});
