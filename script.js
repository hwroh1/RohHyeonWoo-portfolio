// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.gacha-container');
    const floorLine = document.getElementById('floorLine');
    
    if (!container) return;
    
    // 기존 canvas 제거 (동적으로 생성할 것이므로)
    const existingCanvas = document.getElementById('gachaSphere');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    const sphereSize = 400;
    const radius = sphereSize / 2;
    const numSpheres = 3; // 구체 개수
    
    // 바닥선 위치 설정 함수
    function updateFloorLine() {
        if (floorLine) {
            const floorHeight = window.innerHeight + 8;
            floorLine.style.top = `${floorHeight - 60}px`;
        }
    }
    
    // 초기 바닥선 위치 설정
    updateFloorLine();
    
    // 물리 상수
    const gravity = 0.5;
    const bounce = 0.7;
    const friction = 0.98;
    const minVelocity = 0.1;
        
    // 3D 점을 2D로 투영하는 함수
    function project3D(x, y, z, centerX, centerY, distance) {
        const scale = distance / (distance + z);
        return {
            x: centerX + x * scale,
            y: centerY + y * scale,
            z: z
        };
    }
    
    // 3D 점을 회전시키는 함수
    function rotate3D(x, y, z, rotX, rotY, rotZ) {
        // X축 회전
        let newY = y * Math.cos(rotX) - z * Math.sin(rotX);
        let newZ = y * Math.sin(rotX) + z * Math.cos(rotX);
        y = newY;
        z = newZ;
        
        // Y축 회전
        let newX = x * Math.cos(rotY) + z * Math.sin(rotY);
        newZ = -x * Math.sin(rotY) + z * Math.cos(rotY);
        x = newX;
        z = newZ;
            
        // Z축 회전
        newX = x * Math.cos(rotZ) - y * Math.sin(rotZ);
        newY = x * Math.sin(rotZ) + y * Math.cos(rotZ);
        x = newX;
        y = newY;
        
        return { x, y, z };
    }
    
    // 구체 클래스
    class GachaSphere {
        constructor(index) {
            this.index = index;
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'sphere';
            this.canvas.id = `gachaSphere${index}`;
            container.appendChild(this.canvas);
            
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = sphereSize;
            this.canvas.height = sphereSize;
            this.canvas.style.width = `${sphereSize}px`;
            this.canvas.style.height = `${sphereSize}px`;
            
            // 각 구체마다 다른 시작 위치와 속도
            const startXPositions = [0.40, 0.60, 0.80]; // 화면의 40%, 60%, 80% 위치
            this.x = window.innerWidth * startXPositions[index % startXPositions.length];
            this.y = -100 - (index * 300); // 시간차를 두고 떨어지도록 (더 큰 간격)
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = 0;
            this.rotationX = 0;
            this.rotationY = 0;
            this.rotationZ = 0;
            
            // 클릭 이벤트
            this.canvas.addEventListener('click', () => {
                document.body.style.transition = 'opacity 0.5s ease-out';
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = 'work1/index.html';
                }, 500);
            });
            
            // 마우스 호버 시 약간의 상승 효과
            this.canvas.addEventListener('mouseenter', () => {
                this.vy -= 2;
            });
        }
        
        drawSphere() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const viewDistance = 400;
            const sphereRadius = 134;
            
            // 회전 각도를 라디안으로 변환
            const rotX = (this.rotationX * Math.PI) / 180;
            const rotY = (this.rotationY * Math.PI) / 180;
            const rotZ = (this.rotationZ * Math.PI) / 180;
            
            // 위도선 그리기 (수평 원들) - 가운데만
            const lat = 0;
            const points = [];

            const pointCount = 60;
            for (let j = 0; j < pointCount; j++) {
                const lon = (j / pointCount) * Math.PI * 2;
                
                const px = sphereRadius * Math.cos(lat) * Math.cos(lon);
                const py = sphereRadius * Math.sin(lat);
                const pz = sphereRadius * Math.cos(lat) * Math.sin(lon);
                
                const rotated = rotate3D(px, py, pz, rotX, rotY, rotZ);
                const projected = project3D(rotated.x, rotated.y, rotated.z, centerX, centerY, viewDistance);
                points.push({ ...projected, z: rotated.z });
            }
            
            this.ctx.beginPath();
            this.ctx.setLineDash([]);
            this.ctx.globalAlpha = 1;
            for (let k = 0; k < points.length; k++) {
                const p = points[k];
                if (k === 0) {
                    this.ctx.moveTo(p.x, p.y);
                } else {
                    this.ctx.lineTo(p.x, p.y);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
                
            // 경도선 그리기 (수직 원들)
            const longitudeCount = 4;
            for (let i = 0; i < longitudeCount; i++) {
                const lon = (i / longitudeCount) * Math.PI * 2;
                const points = [];
                
                const pointCount = 60;
                for (let j = 0; j < pointCount; j++) {
                    const lat = (j / pointCount - 0.5) * Math.PI;
                
                    const px = sphereRadius * Math.cos(lat) * Math.cos(lon);
                    const py = sphereRadius * Math.sin(lat);
                    const pz = sphereRadius * Math.cos(lat) * Math.sin(lon);
                    
                    const rotated = rotate3D(px, py, pz, rotX, rotY, rotZ);
                    const projected = project3D(rotated.x, rotated.y, rotated.z, centerX, centerY, viewDistance);
                    points.push({ ...projected, z: rotated.z });
                }
                
                this.ctx.beginPath();
                this.ctx.setLineDash([]);
                this.ctx.globalAlpha = 1;
                for (let k = 0; k < points.length; k++) {
                    const p = points[k];
                    if (k === 0) {
                        this.ctx.moveTo(p.x, p.y);
                    } else {
                        this.ctx.lineTo(p.x, p.y);
                    }
                }
                this.ctx.stroke();
            }
            
            // 중앙 링 그리기 (적도)
            const ringPoints = [];
            const ringPointCount = 120;
            for (let i = 0; i < ringPointCount; i++) {
                const angle = (i / ringPointCount) * Math.PI * 2;
                const px = sphereRadius * Math.cos(angle);
                const py = 0;
                const pz = sphereRadius * Math.sin(angle);
                
                const rotated = rotate3D(px, py, pz, rotX, rotY, rotZ);
                const projected = project3D(rotated.x, rotated.y, rotated.z, centerX, centerY, viewDistance);
                ringPoints.push({ ...projected, z: rotated.z });
            }
            
            this.ctx.beginPath();
            this.ctx.lineWidth = 2.5;
            this.ctx.setLineDash([]);
            this.ctx.globalAlpha = 1;
            for (let k = 0; k < ringPoints.length; k++) {
                const p = ringPoints[k];
                if (k === 0) {
                    this.ctx.moveTo(p.x, p.y);
                } else {
                    this.ctx.lineTo(p.x, p.y);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();

            // 구체의 외곽 원형 테두리
            const outlineRadius = sphereRadius;
            const projectedRadius = (viewDistance / (viewDistance + 0)) * outlineRadius;
            
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, projectedRadius, 0, Math.PI * 2);
            this.ctx.lineWidth = 2.5;
            this.ctx.setLineDash([]);
            this.ctx.globalAlpha = 1;
            this.ctx.strokeStyle = '#000000';
            this.ctx.stroke();
            
            // 스타일 리셋
            this.ctx.setLineDash([]);
            this.ctx.globalAlpha = 1;
            this.ctx.lineWidth = 2;
        }
        
        animate() {
            // 중력 적용
            this.vy += gravity;
            
            // 위치 업데이트
            this.x += this.vx;
            this.y += this.vy;
            
            // 회전 효과
            this.rotationX += this.vy * 0.5;
            this.rotationY += this.vx * 0.5;
            this.rotationZ += (this.vx + this.vy) * 0.3;
            
            // 바닥 충돌 감지
            const floorHeight = window.innerHeight + 8;
            if (this.y + radius >= floorHeight) {
                this.y = floorHeight - radius;
                this.vy = -this.vy * bounce;
                this.vx *= friction;
                
                if (Math.abs(this.vy) < minVelocity) {
                    this.vy = 0;
                }
            }
            
            // 좌우 벽 충돌 감지
            if (this.x - radius <= 0) {
                this.x = radius;
                this.vx = -this.vx * bounce;
            } else if (this.x + radius >= window.innerWidth) {
                this.x = window.innerWidth - radius;
                this.vx = -this.vx * bounce;
            }
            
            // 천장 충돌 감지
            if (this.y - radius <= 0) {
                this.y = radius;
                this.vy = -this.vy * bounce;
            }
            
            // 구체 위치 적용
            this.canvas.style.left = `${this.x - radius}px`;
            this.canvas.style.top = `${this.y - radius}px`;
            
            // 구체 그리기
            this.drawSphere();
        }
    }
    
    // 구체들 생성
    const spheres = [];
    for (let i = 0; i < numSpheres; i++) {
        spheres.push(new GachaSphere(i));
    }
    
    // 각 구체마다 독립적인 애니메이션 루프 (시간차를 두고 시작)
    function startSphereAnimation(sphere, delay) {
        setTimeout(() => {
            function animate() {
                sphere.animate();
                requestAnimationFrame(animate);
            }
            animate();
        }, delay);
    }
    
    // 각 구체를 시간차를 두고 애니메이션 시작
    spheres.forEach((sphere, index) => {
        startSphereAnimation(sphere, index * 500); // 0.5초씩 차이
    });
    
    // 윈도우 리사이즈 시 위치 조정
    window.addEventListener('resize', function() {
        spheres.forEach((sphere, index) => {
            const startXPositions = [0.40, 0.60, 0.80];
            if (sphere.x < 0 || sphere.x > window.innerWidth) {
                sphere.x = window.innerWidth * startXPositions[index % startXPositions.length];
            }
            if (sphere.y < 0 || sphere.y > window.innerHeight) {
                sphere.y = window.innerHeight / 2;
            }
        });
        updateFloorLine();
    });
    
    // 초기 페이드 인 효과 제거 - 처음부터 정상 크기와 투명도로 시작
    
    // 작품 썸네일 활성화 체크 함수
    function checkWorksViewed() {
        const workThumbnails = document.getElementById('workThumbnails');
        if (!workThumbnails) return;
        
        // 테스트용: 일단 모두 본 것으로 간주
        // TODO: 실제 배포 시에는 아래 주석을 해제하고 이 부분을 제거
        workThumbnails.classList.add('active');
        return;
        
        /* 실제 로직 (현재 주석 처리)
        // localStorage에서 방문한 작품 확인
        const viewedWorks = JSON.parse(localStorage.getItem('viewedWorks') || '[]');
        const requiredWorks = [1, 2, 3, 4, 5, 6, 7];
        
        // 모든 작품을 방문했는지 확인
        const allViewed = requiredWorks.every(workNum => viewedWorks.includes(workNum));
        
        if (allViewed) {
            workThumbnails.classList.add('active');
        } else {
            workThumbnails.classList.remove('active');
        }
        */
    }
    
    // 페이지 로드 시 썸네일 활성화 상태 확인
    checkWorksViewed();
    
    
    // 스토리지 변경 감지 (다른 탭에서 방문한 경우)
    window.addEventListener('storage', function(e) {
        if (e.key === 'viewedWorks') {
            checkWorksViewed();
        }
    });
    
    // WORKS 텍스트 클릭 시 스크롤을 맨 아래로 이동 (ease-in-out)
    const worksText = document.getElementById('worksText');
    if (worksText) {
        worksText.addEventListener('click', function() {
            const targetScroll = document.documentElement.scrollHeight;
            const startScroll = window.pageYOffset || document.documentElement.scrollTop;
            const distance = targetScroll - startScroll;
            const duration = 2500; // 1.5초
            let start = null;
            
            function easeInOut(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            }
            
            function animateScroll(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const progressRatio = Math.min(progress / duration, 1);
                const ease = easeInOut(progressRatio);
                
                window.scrollTo(0, startScroll + distance * ease);
                
                if (progress < duration) {
                    requestAnimationFrame(animateScroll);
                }
            }
            
            requestAnimationFrame(animateScroll);
        });
    }
});