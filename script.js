// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gachaSphere');
    const container = document.querySelector('.gacha-container');
    const floorLine = document.getElementById('floorLine');
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    const sphereSize = 400;
    const radius = sphereSize / 2;
    
    // 바닥선 위치 설정 함수
    function updateFloorLine() {
        if (floorLine) {
            // 구체가 실제로 충돌하는 바닥 높이에 맞춰서 설정
            // 충돌 조건: y + radius >= floorHeight
            // 충돌 시: y = floorHeight - radius
            // canvas.style.top = y - radius = (floorHeight - radius) - radius = floorHeight - 2*radius
            // canvas의 하단 = canvas.style.top + sphereSize = (floorHeight - 2*radius) + 2*radius = floorHeight
            // 하지만 실제로는 canvas의 하단이 구체의 바닥이므로, 바닥선은 floorHeight에 맞춰야 함
            // 사용자가 너무 아래라고 하니, 구체가 보이는 바닥 부분에 맞춤
            const floorHeight = window.innerHeight + 8;
            // 구체의 중심이 충돌 위치에 있을 때의 canvas 하단 위치
            // 충돌 시 y = floorHeight - radius
            // canvas.style.top = y - radius = floorHeight - 2*radius
            // canvas의 하단 = canvas.style.top + sphereSize = floorHeight - 2*radius + 2*radius = floorHeight
            // 하지만 실제로는 구체가 보이는 바닥 부분이 약간 위에 있을 수 있으므로 조정
            // 스크롤과 함께 움직이지 않도록 실제 바닥 높이에 맞춤
            floorLine.style.top = `${floorHeight - 60}px`;
            console.log('바닥선 위치:', floorHeight - 60, '실제 바닥:', floorHeight, '구체 반지름:', radius);
        }
    }
    
    // 초기 바닥선 위치 설정
    updateFloorLine();
    
    // Canvas 크기 설정
    canvas.width = sphereSize;
    canvas.height = sphereSize;
    canvas.style.width = `${sphereSize}px`;
    canvas.style.height = `${sphereSize}px`;
        
    // 물리 시뮬레이션 변수
    let x = window.innerWidth * 0.60; // 많이 오른쪽으로
    let y = -100; // 더 위에서부터 시작
    let vx = (Math.random() - 0.5) * 2;
    let vy = 0;
        let rotationX = 0;
        let rotationY = 0;
    let rotationZ = 0;
    
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
    
    // 구체 그리기 함수
    function drawSphere() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const viewDistance = 400;
        const sphereRadius = 134;
        
        // 회전 각도를 라디안으로 변환
        const rotX = (rotationX * Math.PI) / 180;
        const rotY = (rotationY * Math.PI) / 180;
        const rotZ = (rotationZ * Math.PI) / 180;
        
        // 위도선 그리기 (수평 원들) - 가운데만
        const lat = 0; // 적도 (가운데)
        const points = [];

        // 각 위도선의 점들 생성
        const pointCount = 60;
        for (let j = 0; j < pointCount; j++) {
            const lon = (j / pointCount) * Math.PI * 2; // 0 ~ 2π
            
            // 구면 좌표를 3D 직교 좌표로 변환
            const px = sphereRadius * Math.cos(lat) * Math.cos(lon);
            const py = sphereRadius * Math.sin(lat);
            const pz = sphereRadius * Math.cos(lat) * Math.sin(lon);
            
            // 회전 적용
            const rotated = rotate3D(px, py, pz, rotX, rotY, rotZ);
            
            // 투영
            const projected = project3D(rotated.x, rotated.y, rotated.z, centerX, centerY, viewDistance);
            points.push({ ...projected, z: rotated.z });
        }
        
        // 선 그리기 (모두 실선)
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        for (let k = 0; k < points.length; k++) {
            const p = points[k];
            if (k === 0) {
                ctx.moveTo(p.x, p.y);
            } else {
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.closePath();
        ctx.stroke();
            
        // 경도선 그리기 (수직 원들)
        const longitudeCount = 4;
        for (let i = 0; i < longitudeCount; i++) {
            const lon = (i / longitudeCount) * Math.PI * 2;
            const points = [];
            
            // 각 경도선의 점들 생성
            const pointCount = 60;
            for (let j = 0; j < pointCount; j++) {
                const lat = (j / pointCount - 0.5) * Math.PI;
            
                // 구면 좌표를 3D 직교 좌표로 변환
                const px = sphereRadius * Math.cos(lat) * Math.cos(lon);
                const py = sphereRadius * Math.sin(lat);
                const pz = sphereRadius * Math.cos(lat) * Math.sin(lon);
                
                // 회전 적용
                const rotated = rotate3D(px, py, pz, rotX, rotY, rotZ);
                
                // 투영
                const projected = project3D(rotated.x, rotated.y, rotated.z, centerX, centerY, viewDistance);
                points.push({ ...projected, z: rotated.z });
            }
            
            // 선 그리기 (모두 실선)
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
            for (let k = 0; k < points.length; k++) {
                const p = points[k];
                if (k === 0) {
                    ctx.moveTo(p.x, p.y);
                } else {
                    ctx.lineTo(p.x, p.y);
                }
            }
            ctx.stroke();
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
        
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        for (let k = 0; k < ringPoints.length; k++) {
            const p = ringPoints[k];
            if (k === 0) {
                ctx.moveTo(p.x, p.y);
            } else {
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.closePath();
        ctx.stroke();

        // 구체의 외곽 원형 테두리 (항상 보이는 원)
        // 구체의 반지름만큼의 원을 항상 그림 (회전에 상관없이)
        const outlinePointCount = 180;
        const outlineRadius = sphereRadius;
        
        // 투영된 반지름 계산 (구체가 회전해도 반지름은 동일)
        const projectedRadius = (viewDistance / (viewDistance + 0)) * outlineRadius;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, projectedRadius, 0, Math.PI * 2);
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        
        // 스타일 리셋
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
    }
    
    // 애니메이션 함수
    function animate() {
        // 중력 적용
        vy += gravity;
        
        // 위치 업데이트
        x += vx;
        y += vy;
        
        // 회전 효과
        rotationX += vy * 0.5;
        rotationY += vx * 0.5;
        rotationZ += (vx + vy) * 0.3;
        
        // 바닥 충돌 감지 (바닥을 조금 위로)
        const floorHeight = window.innerHeight + 8;
        if (y + radius >= floorHeight) {
            y = floorHeight - radius;
            vy = -vy * bounce;
            vx *= friction;
            
            if (Math.abs(vy) < minVelocity) {
                vy = 0;
            }
        }
        
        // 좌우 벽 충돌 감지
        if (x - radius <= 0) {
            x = radius;
            vx = -vx * bounce;
        } else if (x + radius >= window.innerWidth) {
            x = window.innerWidth - radius;
            vx = -vx * bounce;
        }
        
        // 천장 충돌 감지
        if (y - radius <= 0) {
            y = radius;
            vy = -vy * bounce;
                }
        
        // 구체 위치 적용
        canvas.style.left = `${x - radius}px`;
        canvas.style.top = `${y - radius}px`;
        
        // 구체 그리기
        drawSphere();
        
        // 계속 애니메이션
        requestAnimationFrame(animate);
    }
    
    // 애니메이션 시작
    animate();
    
    // 클릭 이벤트
    canvas.addEventListener('click', function() {
        // 페이드아웃 효과
        document.body.style.transition = 'opacity 0.5s ease-out';
        document.body.style.opacity = '0';
        
        // 페이드아웃 후 페이지 이동
        setTimeout(function() {
            window.location.href = 'work1/index.html';
        }, 500);
    });
    
    // 마우스 호버 시 약간의 상승 효과
    canvas.addEventListener('mouseenter', function() {
        vy -= 2;
    });
    
    // 윈도우 리사이즈 시 위치 조정
    window.addEventListener('resize', function() {
        if (x < 0 || x > window.innerWidth) {
            x = window.innerWidth / 2;
        }
        if (y < 0 || y > window.innerHeight) {
            y = window.innerHeight / 2;
        }
        // 바닥선 위치 업데이트
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
});