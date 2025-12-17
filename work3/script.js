// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 방문 기록 저장 (work3 방문 확인)
    const viewedWorks = JSON.parse(localStorage.getItem('viewedWorks') || '[]');
    if (!viewedWorks.includes(3)) {
        viewedWorks.push(3);
        localStorage.setItem('viewedWorks', JSON.stringify(viewedWorks));
    }
    
    // 커서 힌트 기능
    const cursorHint = document.getElementById('cursorHint');
    if (cursorHint) {
        // 마우스 움직임 추적하여 힌트 위치 업데이트
        document.addEventListener('mousemove', function(e) {
            // 커서 위치에서 약간 오른쪽 아래로 offset
            cursorHint.style.left = (e.clientX + 15) + 'px';
            cursorHint.style.top = (e.clientY + 15) + 'px';
            cursorHint.style.opacity = '0.8';
        });
    }
    
    // 이미지 그리드 생성
    const imageGrid = document.getElementById('imageGrid');
    const modal = document.getElementById('imageModal');
    const modalMainImage = document.getElementById('modalMainImage');
    const modalSubImages = document.getElementById('modalSubImages');
    const modalText = document.getElementById('modalText');
    const modalExpanded = document.getElementById('modalExpanded');
    const expandedContent = document.getElementById('expandedContent');
    const expandButton = document.getElementById('expandButton');
    
    // 각 이미지 데이터 (텍스트는 나중에 추가 가능)
    const imageData = {
        1: { 
            text: '일어나기 싫은 매일 아침. 자취를 시작하며 산 귀여운 친구 덕분에 화장실에서 기분 좋은 하루를 시작한다. (기분 좋은 얼굴이 맞다. 부어서 그렇지.) 바로 규조토 칫솔꽂이. 저 천원짜리가 이번 학기 동안 소비한 물건 중 가장 맘에 드는 물건이다. 엄마도, 친구도 탐내는 엄청난 매력을 가지고 있다.',
            expandedText: '자취를 오래 할 생각이 없기 때문에 칫솔꽂이 같은 물건을 산다는 건 사실 좀 돈을 버리는 행동이라고 생각했는데, 동그란게 귀여워서, 그리고 컵에 칫솔을 꽂아놓고 싶지 않아서 샀다. 다이소에서 구매하고 집에와서 포장을 뜯고 칫솔을 꽂는 순간, 기분이 너무 좋았다. 칫솔을 꽂고 살짝 남는 공간에 치간 칫솔까지 쏙 들어간다. 이후 엄마가 집에 오셨을 때, 이런걸 왜 샀냐고 한 소리 하실 줄 알았거만 귀엽다며 탐을 내시길래 아주 뿌듯했다. \n\n 그리고 이후 규조토 받침도 구매했다. 그림에는 그냥 나열되어 있는 치약, 클렌징 폼, 클렌징 오일들을 물때 생기지 말라고 올려두었다. 친구가 그 세트를 보고 자기도 사다 달라고 하길래, 사서 쓰라고 했다.' // 접힌 내용은 여기에 추가
        },
        2: { text: '그림의 장소는 유어마인드라는 연세대 근처 독립 출판사다. 과제 때문에 방문해서 120% 즐기고 왔다. 처음에 길을 못찾아서 골목길을 헤메던 기억이 난다. 들어가고 얼마 되지 않아 엄청난 소나기가 쏟아졌고 비오는 날 서점이 운치있었던 기억이 난다.\n\n결국 비를 엄청 맞기는 했다.', 
            expandedText: '교수님께서 구성이 특이한 책을 가져오라는 과제를 내셔서 찾아가게 되었다. (교수님, 눈 감으세요.)사실 그렇게 가고 싶지는 않은데, 생각보다 괜찮았다. 오히려 기분전환이 되었던 것 같다. 비오는 날 서점에 가보시길. 재미있는 책들도 많았고 개인적으로 구매할까 생각한 책도 많았고 가격을 보고 내려놓은 책이 제일 많았다. 나쁜 의미로 말하는 것은 아니고, 얄팍한 지갑 사정 때문이다.\n한 일본 작가의 조그마한 엽서 모음집과 귀엽게 생긴 토끼 스티커 중 어떤 것을 살까 고민하다가 토끼 스티커를 구매했다. 구매한 날, 여기저기 나눠주고 남은건 옆에 붙어있는 거 하나다. (다 벗고 있는게 민망하다며 색을 칠해주었다. 여전히 벗고 있는 노란 토끼가 된 것 아닌가?)그리고 조그마한 책 키링도 구매했다. 이건 내용이 마음에 들었다. 피식하게 되는 귀여운 개그가 재치있는 책이다. 제목은 ‘꿈의 직장’. 여하튼 국내외의 재미있고, 귀여운 책들을 원한다면 유어마인드로. 그리고 근처 중국집이 정말 현지 중국집 같고, 맛있다.' },
        3: { text: '바쁜 일정을 소화하던 어느 날, 빨래가 더이상 미룰 수 없을 정도로 쌓였음을 깨달았다. 모든 일정을 끝내고 돌아오면 밤인데, 야심한 시각 세탁기를 돌릴 수는 없는 노릇.\n\n 난생 처음 코인세탁소로 원정을 떠났다. 새벽의 세탁소는 누군가의 빨래가 조용히 돌아가고, 아무도 없고, 서늘하고, 밖에는 어둡고….\n\n너무 좋았다. 최고.', 
            expandedText: '새벽 1시쯤, 빨래 바구니에 그대로 빨래를 담고 세탁소에 가기는 좀 그래서 나름 커다란 장바구니 같은 곳에 빨래를 담고 코인세탁소에 갔다. 돈이 아까워서 색 구분 없이 빨래를 한 세탁기에 다 밀어넣었다. 그러고나니 커다란 봉지를 파는 것도 보이길래 봉지도 하나 사고, 무인 판매점에서 음료수도 팔길래 가장 가성비 좋아보이는 토레타도 하나 사고, 기다리는 동안 심심하니 안마기에서 안마도 받아보고, 코인 세탁소를 200% 즐겼던 좋은 기억이다.\n저번에 수건을 얼마만에 세탁하느냐로 친구와 논쟁 아닌 논쟁을 한 적이 있다. 나는 심하면 한 달에 한번, 친구는 그날 한번 사용한 수건은 다시 사용하지 않는다고 했다. 한 달에 한장만 빠는 건 아니고, 1~2주 정도 사용하고 몰아서 수건을 세탁한다. 자랑은 아니지만 개인적으로 그닥 청결한 편은 아니다. 쉰내만 안나면 된다는 주의. 그래도 주변에서 왠지 집안도 깨끗할 것 같다는 소리를 듣고 사니 나름 깔끔하게 생활하고 있는게 아닐까 안일하게 생각해본다. 여러분은 수건을 얼마만에 세탁하시는지?' },
        4: { text: '다이소에서 재미로 앞머리 가발을 샀다. 그날 밤 앞머리 가발로 한시간쯤 놀고 결심했다.\n\n ‘하…. 재밌었다. 그리고 앞머리 잘라야지. ’ MBTI-J라고는 믿을 수 없는 충동적인 결정으로 2년간 없었던 앞머리를 만들었다. 미용실에서는 특이하게도 타짜를 틀어주고 있었다. 화면 속 고니의 머리를 보면 내 머리는 7배 정도 예뻐보였다.', 
            expandedText: '사실 똑단발로 자른지 얼마 안됐다. 나는 내 머리에 쉽게 질리는 편이라 앞머리라도 자를까 했는데, 이집트 벽화 같을 것 같다거나, 헬멧 쓴 것처럼 보일 것 같다거나 하는 등 친구들의 의견을 듣고 앞머리 자르는 걸 포기했었다. 그러다 유튜브에서 앞머리 가발을 보고 다이소에서 발견해 충동적으로 구매했다. 처음에 숱도 안 다듬고 그냥 부착하니 과연 레고 같은 머리였다. 숱 좀 치고 나니 나름 괜찮아서 엄마한테도 보여주고, 아빠한테도 보여주고, 고양이한테 씌워주고 재미있게 놀다가 학교에 가져갔다. 친구들에게 보여주니 잘 어울린다길래 그 길로 바로 미용실에서 머리를 잘랐다. 참고로 미용실을 부담스러워하는 나를 위해 친구가 미용실을 골라주었다. 내 머리에 물을 뿌려놓고 미용사가 한참 안 돌아와서 젖은 앞머리로 대기하고 있었는데 그 모습이 웃겼던 친구가 사진을 찍었다. 사진 속 표정을 찍지 말라는 불만의 표정이다.' },
        5: { text: '친구들과 도서관에서 밤을 샌 날이었다. 슬슬 해가 보이고, 배도 고프고, 아침을 먹을 때가 되었음을 직감하며 정리를 하던 때였다. 안그래도 간당간당해 보이던 충전 단자가 분리되었다. \n\n‘아…. 내 노트북 밥 먹여야 하는데, 내 작업도 어서 해줘야 하는데.’ \n\n 눈 앞이 막막하던 때, 결국 쿠팡 멤버십을 가입했다. 그날 저녁 노트북을 충전할 수 있었다.', 
            expandedText: '도서관에서 함께 밤을 새자는 전화를 11시 넘어서 받았다. 친구가 이렇게 야밤에 전화하며 당당히 같이 새지 않겠냐고 제안할 수 있었던 이유는 내가 거의 매번 밤을 새기 때문이다. 아침 해와 인사하고 잠들 때도 있고, 5시쯤 기절하는 날도 많고, 오전 수업에 가서 자기도 하지만 어쨌든 밤에 작업을 많이 하기 때문에 이런 나의 사정을 잘 아는 친구가 연락을 해왔다. 혼자 작업하는 것에 지쳐 흔쾌히 수락하고 타코야키 28알과 함께 도서관으로 향했다.\n야식을 제대로 먹고 들어가서 공부하려고 하니 친구는 바로 잠들었다. 새벽이 깊어지니 사람들도 하나 둘 집으로 돌아가고 4시 즈음 부터는 딱 우리 셋만 있었던 것 같다. 나중에 아침해가 떠서 국밥을 먹으러 떠나려는 순간, 충전기의 단자가 분리되며 나의 멘탈도 육신과 분리되었다. 시간 부족으로 국밥 대신 라면을 먹으며 고민하다 결국 쿠팡에서 충전 케이블을 로켓배송 시켰다. 이때 가입한 쿠팡 멤버십으로 지금까지 잘 배달시켜 먹고 있다.\n 여담으로 나는 그때 한창 물고기의 누끼 따는 알바를 하고 있었기 때문에 1000장에 가까운 물고기의 내장을 보고 있었다. 여러모로 힘든 기억이다.' },
        6: { text: '2학기 새로운 집에서 자취를 시작하면서 정리함이 필요해서 알리익스프레스에서 쇼핑을 했었다. 배송을 하려면 다른 물건도 담아야 한다길래 500 원짜리 싸구려 투명 뿔테 안경을 시켰었다. 안경알이 뿌얘서 빼놓고 다녔는데, 카페에서 음료수를 먹다 눈에 음료가 튀어서 안경 구멍으로 손을 넣는 것을 보고 친구들이 뒤집어졌었다. \n\n왜 너한테만 재밌는 일이 일어나냐며….', 
            expandedText: '투명 뿔테 안경의 원래 가격이 500원이었던 것은 아니고 첫 고객 한정 할인으로 그런 가격으로 구매할 수 있었다. 추가로 검은 백팩도 구매하고서야 배송이 되어서 일주일 정도 후 택배가 도착했다. 원래 물건을 구매했던 목적인 정리함을 뒷전으로 두고 뿔테 안경을 뜯어보았는데 아니나 다를까 안경을 쓰면 더욱 앞이 안보였다. 안경의 정의를 뒤엎은 새로운 개념의 안경이었다. 결국 안경 알은 분리수거함으로 들어가고 투명 뿔테만 끼고 다녔었다. 추레한 얼굴도 가려주고 추운 날 김도 안 생기고 좋다.\n바로 앞 장, 도서관에서 밤을 샌 날도 다음날 쓰기 위해 안경을 가져갔었다. 오전 수업 후 밥을 먹고 오후 수업 들어가기 전 카페에 갔었는데 안경 구멍 안으로 음료가 들어가 눈에 직격했다. 레몬이 들어간 음료수를 시켰던 터라 괴로움에 떠는 나를 보고 웃음을 참지 않던 두 사람이 흐린 시야 속에서도 인상이 깊게 남았다.' },
        7: { text: '한번은 구두와 정장이 필요해서 구매한 적이 있었다. 흰 구두를 신고 거울 앞에서 바지를 걷어가며 확인해보니 잘 어울리는게 마음에 들어서 저 신발을 시작으로 패션쇼를 시작했던 기억이 난다. \n\n처음에는 흰 신발에 어울리는 옷을 찾아보려고 시작했었다. 치마 입었다 바지 입었다 코트를 걸쳤다 벗었다 난리도 아니었다. 나중에 가서는 흰 구두 말고도 자취방의 신발이랑 신발은 다 신어보았다. 본가에서는 엄마한테 들킬까 쪽팔려서 못했을 텐데. 만족스럽게 약 2시간의 패션쇼를 끝냈다.', 
            expandedText: '그림에 나와있는 전신 거울은 가을에 당근으로 구매했었다. 보기보다 무게가 나가서 도움을 받았던 기억이 난다. 방학 동안 단련한 팔 근육을 믿고 혼자 갔었다가는 한참 고생했을 것이다. 비오는 날 우산도 없이 거울을 힘겹게 옮기는 사람이라, 이색 구경거리이긴 했을 것 같다. \n입고 있는 흰 티셔츠는 여름에 부평 지하 상가에서 구매한 물건이다. 부평 지하 상가에서는 옷을 시착해볼 수 없다. 눈대중으로 구매한 옷은 생각보다 더 짧아서 내 옆구리를 지켜주지 못한다. 웬만하면 밖에서 입지는 않는다. 결국 잠옷으로 자리 잡은 물건이다. \n달려있는 알전구는 아주 예전 중학생 때 구매한 물건이다. 사실은 자취하면서 장 스탠드가 사고 싶었다. 그래서 당근마켓에서 물건을 찾았다고 엄마에게 말하는 순간 그런걸 왜 사냐며 한 소리 듣고, 너 방에 있는거나 떼가라는 두 소리까지 들은 뒤, 스탠드를 포기하고 가져온 것이다. 결론적으로 잘 쓰고 있으니 됐다. 장 스탠드 사고 싶었는데…' },
        8: { text: '카페를 잘 돌아다니는 지인이 있는데 그 지인의 최애 카페 중 하나. 굉장히 좁은 곳인데 사방을 둘러싼 나무가 아늑한 느낌을 주는 곳이다. 카페 주인이 ‘월레스와 그로밋’을 좋아하는지 포스터나 인형 등 인테리어에 익숙한 캐릭터가 보이는게 기분이 좋았다. 한 번 방문해보시길.\n\n개인적으로 한라봉 뭐시기가 맛있었다.', 
            expandedText: '여기서 갑자기 공개하는 작업 과정. 그림을 그릴 때는 사진은 거의 보지 않는다. 기억에 의존에서 그리는 편이다. 여기는 기억이 안 나서 한번 더 갔었다. 아기자기하고 기억할 거리가 많았는데 집에 돌아오는 사이 다 잊어서 그리는데 애 좀 먹은 그림이다.\n이 카페에서 재미있는 일이 있었다. 그림에도 보이는 통창으로 풍경을 구경하고 있었다. 마침 초등학생 하교 시간이었는지 같은 디자인의 옷을 입은 형제가 걸어가고 있었다. 형처럼 보이는 아이가 마치 사이렌처럼 일정한 간격으로 소리를 지르고 있었다. 옆에서 동생을 활짝 웃는 표정으로 형을 보며 같이 걸어가고 있었다. 그때, 동생이 갑작스럽게 형의 뺨을 때리는 기습 공격을 했다. 아주 해맑은 얼굴이었다. 형의 사이렌 소리는 고개가 돌아가며 강제로 멈춰졌다. 그렇게 형제의 개싸움을 볼 수 있는 건가 싶었던 순간, 형은 아무렇지 해맑게 웃으며 다시 입으로 사이렌 소리를 내며 동생과 함께 내 시야에서 사라졌다.\n아주 기묘한 광경이었다.' },
        9: { text: '난생 처음 당구장에 가봤다. 늦은 밤이었는데 차근차근 큐대 잡는 법부터 배웠다. 가르쳐주던 지인이 손으로 공을 옮겨 난이도를 조절해주던게 자존심을 긁는 동시에 승부심을 자극하던 기억이 난다. 자세잡기 힘든 상황이 있었는데 멀리 카운터에서 지켜보던 주인 아저씨가 그럴 때는 다리를 올려야 한다며 말을 걸어 어정쩡하게 다리를 올렸었다.\n\n역시 나는 공이랑 안 친하다.', 
            expandedText: '나와 놀아주던 지인이 당구장에서 혼자 결제를 하고 금액을 알려주지 않길래 임의로 금액을 설정해 친구비를 냈다. 당구를 친 날, 이래저래 밤을 새고 무리를 했던 터라 몸 상태가 좋지 않았다. 집에 돌아가서 거의 기절했던 기억이 난다.\n이 날 강아지가 있는 ‘오어 낫’이라는 카페도 갔었는데 쿠앤크 같은 색의 보더콜리가 있다. 사실 당구장보다 이게 본론이다. 애견카페는 아니고 강아지가 있을 때도 있는 카페다. 특이한 음료가 많고 강아지가 귀엽다. 사람을 좋아하는지 서슴없이 다가와서 쓰다듬어 달라고 애교를 부리는데 우리집 주인님에게서는 느끼지 못했던 귀여움을 이 날 느꼈다. 한번은 다른 사람의 양말을 물어와서 당황했던 기억이 난다. 나도 모르게 ‘그거 먹는 거 아니야!’라고 했었다. \n양말 주인 분, 이렇게나마 당신의 양말을 더러운 것 취급했던 저의 어투를 사과합니다. 하지만 틀린 말도 아니었잖아요.' },
        10: { text: '다들 그렇듯이 퇴근 후 즐거움이 하나씩 있을텐데 나같은 경우 야식이다. 자주는 아니고, 가끔 먹는다. 이 날의 메뉴는 육회였다. 당연히 집 옆의 가게에서 주문했을 것이라고 생각했는데 거의 도착해 간판을 보고서야 내 피곤한 머리가 한참 떨어진 곳에 포장 주문을 한 것을 알았다. 길거리 한 가운데서 이마를 치고 반성의 시간을 갖다 결국 포장하러 갔다. \n\n육회는 맛있었다.', 
            expandedText: '이마를 치는 버릇은 고등학교 친구의 버릇이다. 이 친구는 기쁜 일이 있을 때나 슬픈 일이 있을 때나 이마를 친다. “이마를 빡빡친다.”라고 말도 하며 친다. 근묵자흑이라고 나도 옮았다. 다행히 말은 하지 않는다. 길거리에서 공허함과 허탈감, 귀찮음과 약간의 자괴감을 이마를 치는 행위로 승화시킨 후 곧이어 정신을 차리고 버스를 타고 가게로 가 포장을 해왔다. 돌아오는 길 우연히 친구들을 마주쳤다. 나는 버스에 친구들이 있는지 모르고 탑승해 육회를 소중히 품에 앉고 노래를 들으며 미래의 즐거움과 현재의 피곤함의 격차를 느끼고 있었다. 친구들은 그런 센치한 나를 몰래 찍어 전송해주었다. 사진을 받고 기겁을 하며 돌아보니 소리 없이 웃고 있는 친구들의 얼굴을 볼 수 있었다. \n이 날 육회를 처음 시켜 먹은 이후로 꽤 자주 육회를 먹고 있다. 매운 육회도 맛있다. 비싼 음식에 입맛이 들어서 지갑이 고생이다. 많은 그림의 이야기가 음식 이야기로 끝나는 것 같은데, 내 착각이기를.' },
        11: { text: '학교 근처 철길에는 커다란 셀프 사진관이 있다. 나는 잡다한 소품들을 구경하는 걸 좋아하는데 혼밥, 혼영, 심지어 놀이공원도 혼자 갈 수 있는 나도 혼자 셀프 사진관에 들어가기란 쉬운 일이 아니었다. 결국 사람이 없는 야밤에 친구와 가서 이런저런 소품으로 놀다가 혼자 사진을 찍었다. 처음에 좀 폼 잡으며 찍다가 화면 속 내가 꼴보기 싫어서 마지막에는 거의 카메라에 주먹질을 했다.\n\n사진을 본 친구 왈, 사진 잘 안 찍어본 티가 난다고 한다. 여러분이 보기에는 어떤지?', 
            expandedText: '참고로 나는 사진에 대해서 못봐줄 꼴이라고 감상평을 남겼다. 이런 저런 특이한 사진들은 잘 찍는 편이다. 발렌시아가 로고가 붙은 음식물 쓰레기 통이라던지, 챔피언 소굴이라고 쓰여진 주짓수 도장이라던지, ‘실패한요로결석제거’라고 쓰여진 병원의 창문이라던지…. 다만 내 사진을 잘 안 찍을 뿐. 그런 의미에서 뷰티 유튜버들은 대단하다. 나라면 화면 속 나를 보다 참지 못하고 모니터를 부쉈을 것이다.\n이 날 입은 옷은 앞의 흰 구두를 샀을 때 같이 샀던 옷이다. 아주 부드러운 스웨터인데, 배송을 뜯고 옷을 입었을 때 아주 파격적인 구멍이 있다는 것을 알게 되었다. 충격적인 노출에 당황한 나는 쇼핑몰에 들어가 상세 이미지를 자세히 살펴보았다. 꼼꼼히 가려진 모델을 보고서야 올이 풀린 불량품인 것을 알고 옷을 꿰메기 위해 실과 바늘을 샀는데, 만지면 만질수록 점점 커지는 구멍에 결국 교환 받았던 기억이 난다.' },
        12: { text: '이 책은 추운 겨울에 제작됐다. 그 말은 즉, 붕어빵의 계절이라는 말이다. 이 날, 근처에 사는 지인이 갑자기 붕어빵을 사주겠다고 그래서 덥썩 물었다. 원래 사주려던 곳은 문을 닫아서 학교 근처 잉어빵으로 메뉴를 변경했었다. 이날 버스를 잘못 타 길을 잃고 힘겹게 돌아와 추운 바람을 견디고 입어 넣은 잉어빵은 참 맛있었다.\n\n참고로 나는 슈붕파다.', 
            expandedText: '그림 속 내가 하고 있는 머리 장식은 공릉역 안의 가게에서 구매한 것이다. 반짝거리는 것을 좋아해서 구경하다가 흰 리본이 마음에 들어서 하나 샀다. 구두도 흰 색이고, 코트는 옅은 베이지 색이다. 나름의 드레스 코드를 흰색으로 정하고 머리부터 발끝까지 흰색으로 입었다.\n이 날 겨울이 된 기념으로 전골 요리를 먹었다. 흰 옷 때문에 앞치마를 입었었는데 그 앞치마 입은 그대로 코트를 입고 집에 갈 뻔한 게 기억난다. 아무튼 가게는 ‘호노야’라는 이자카야인데 스키야키를 파는 곳이다. 나는 겨울이 되면 몇가지 땡기는 음식이 있는데 첫번째 어묵꼬치, 두번째 스프카레, 세번째 나베 요리다. 이 때는 한 3주 전부터 스키야키를 먹고 싶었었다. 모듬 꼬치와 스키야키, 콜라를 주문하고(술은 안한다.) 야식 한번 제대로 먹었었다. 달달한 슈크림 잉어빵을 먹은 터라 들어갈까 싶었는데 다 들어가는 것을 보며 스스로도 신기했다. 마지막에 남은 국물에 우동을 못 넣어 먹은 것이 아쉬울 따름이다.\n보니까 정말 먹는 이야기밖에 없는 것 같다.' },
        13: { text: '생리통으로 진통제를 먹은 걸 깜박하고 헌혈하러 갔었다. 전자 문진을 하고 빠르게 검사하러 들어가 앉아마자 피검사를 하는 동시에 “제가, 그 진통제를 먹었는데요.” 물어보니, 그러면 헌혈을 할 수 없다는 답변들 듣고 바로 일어나서 나왔다. 들어가자마자 3분 만에 나오니 그렇게 민망할 수 없었다. 친절하게 인사해주신 경비 아저씨의 의아한 눈빛을 견디기 힘들었다.', 
            expandedText: '원래 빈혈이 있어서 헌혈을 못했다. (빈혈에도 재미있는 스토리가 있는데 여기서 풀기에는 너무 길다.) 오히려 수혈 받을 수준이었는데 이제는 건강해져서 전혈 헌혈을 할 수 있다니 감동스러울 따름이다. 이번 년도에 들어서 헌혈을 시작했는데 첫번째 시도가 실패로 돌아간 후 다음 주에 제대로 헌혈하러 갔다. \n헌혈하러 가니 고등학생들이 꽤나 있었다. 헌혈 기념품을 고르는 목소리들이 활기차서 듣기 좋았다. 기운 없는 대학생은 그저 가만히 눈동자만 굴려서 기념품 리스트를 보다가 갖고 싶은게 없어서 기부권을 선택했다. 내 선택을 듣고 나이 지긋하신 간호사 아주머니께서 “왜요? 영화권 선택해요! 아니면 상품권이나….”하시며 대신 아쉬워 하시던 게 기억난다. \n또 기억나는 건 여기 혈액원에서 근무하는 공익 요원의 머리 스타일이 특이했다는 것이다. 긴 머리를 멋들이지게 길러서 반묶음을 헀었는데 잘 어울렸다. 캐릭터가 특이해서 그림으로 그려보면 재밌겠다고 생각했었다.' },
        14: { text: '친구들이 집에 놀러와 함께 엽떡을 먹었었다. 고등학교 이후 굉장히 오랜만에 엽떡을 먹었는데 떡볶이 가게면서 같이 시킨 치킨 봉이 그렇게 맛있었던 기억이 난다. 한참 이야기를 나누다 뒷정리를 하던 때, 친구가 내 타블렛을 궁금해하길래 그림을 그리게 해줬었다. 명절에 만난 사촌 동생처럼 신나하길래 구경하러 갔다가 친구의 아방가르드한 재능을 발견했다.\n\n마음에 들었다. 리소 인쇄 포스터로 뽑을 예정.', 
            expandedText: '그림을 그리는데 사용하는 타블렛은 아빠가 내가 중학생때 어느날 갑자기 사온 물건이다. 그날 참 감동을 받았었다. 그 감동을 기억하며 아직까지 놓아주지 않고 사용하고 있다. 10년이 다 되어 가는 물건이라고 친구에게 얘기해주니 노인이라며 호칭을 정해주었다. 작업할 때마다 뭔가 못할 짓을 하는 기분이 든다.\n옆에 튀어 나와 있는 친구는 내 집을 빌리는 값이라며 나를 대신해 설거지를 해주고 있는 중이다. 내가 꼬질꼬질한 그림을 보며 즐거워 하는 소리가 들리니 “아 뭔데! 나도!”하면서도 끝까지 설거지를 해준 심성이 고운 친구다. 친구의 그림을 보며 내가 아주 마음에 들어하고 있으니 티셔츠로 뽑자고 설거지를 해주던 친구가 말했는데, 곧 설거지를 끝내고 그림을 보더니 자기는 티셔츠가 필요 없다고 말했다.\n나는 정말 마음에 드는데. 친구의 말대로 교수님께 보여드릴 예정이다. 어떤가요, 교수님.' },
        15: { text: '부끄럽지만 자랑 좀 하자면, 나는 장인이다. 혼자 놀기 장인. 내 생활 반경은 넓지 않다. 학교 아니면 집이다. 파워 I, 파워 집순이로 집에 있는게 제일 행복하다. Home, my sweet home이다. 옆에 그림에 사람이 참 많이 등장한다. 다 나다.\n\n그렇다고 해서 사람들 만나는 걸 싫어하는 건 아니고, 혼자만의 시간을 200% 즐길 뿐이다.', 
            expandedText: '그림을 보고 대체 뭐하고 있는거지 싶을 독자 분들이 있을 거라고 생각한다. 인내심을 가지고 이 페이지까지 온 여러분이라면 설명을 들을 자격이 충분하다.\n컴퓨터 앞에 앉아 있는 나는 현재 괴로운 작업 중에 있다. 여러 작업들이 있지만 과목에 맞춰서 그림을 그리고 있는 모습으로 그렸다. 서서 꿈틀거리고 있는 나는 작업하며 노래를 듣다 춤으로 괴로움을 승화시키고 있는 나다. 저번에 춤추다 벽에 주먹을 맞고 손가락에 멍이 들었었다. 거울 앞에 있는 나는 마스크 팩을 하고 있는 중이다. 의외로 피부에 관심을 가지고 있다. 침대에 누워있는 나는 죽은 게 아니다. 아마 휴대폰 중일거다. 뜨끈한 전기 장판 위에서 즐거운 시간을 보내고 있다. 바닥에 앉아 침대에 기댄 나는 치킨을 먹는 중이다. 집 근처에 치킨을 반 마리만 파는 곳이 있다. 치킨을 먹으며 내일이 오지 않기를 바라고 있다.\n이 책의 글들은 대부분 단 하루만에 작성되었다. 검토하며 다시 읽어보니 죄다 뻘소리 밖에 없는데 종이가 아까울 따름이다. 재미있게 읽었다면 다행이고, 아니라면, 뭐, 어쩌겠는가.' }
    };
    
    // 그리드에 이미지 추가
    for (let i = 1; i <= 15; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.dataset.index = i;
        
        const img = document.createElement('img');
        img.src = `./images/${i}.jpg`;
        img.alt = `Image ${i}`;
        img.loading = 'lazy';
        
        gridItem.appendChild(img);
        gridItem.addEventListener('click', () => openModal(i));
        imageGrid.appendChild(gridItem);
    }
    
    // 모달 열기
    function openModal(index) {
        // 메인 이미지 설정
        modalMainImage.src = `./images/${index}.jpg`;
        modalMainImage.alt = `Image ${index}`;
        
        // 서브 이미지 설정 (-1, -2 등)
        modalSubImages.innerHTML = '';
        
        // 서브 이미지가 있는지 확인하는 함수
        let subImageCount = 0;
        function loadSubImages(subIndex) {
            if (subIndex > 10) return; // 최대 10개까지만 확인
            
            const subImg = document.createElement('img');
            subImg.src = `./images/${index}-${subIndex}.png`;
            subImg.alt = `Image ${index}-${subIndex}`;
            
            subImg.onload = function() {
                this.style.position = 'absolute';
                // 겹쳐서 배치하기 위해 랜덤 위치
                const container = modalSubImages.parentElement;
                const randomX = (Math.random() - 0.5) * 300;
                const randomY = (Math.random() - 0.5) * 300;
                const randomRotate = (Math.random() - 0.5) * 20;
                
                // 컨테이너 중심 기준으로 배치
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight || 500; // 기본값
                
                const imgWidth = Math.min(300, containerWidth * 0.4);
                this.style.width = `${imgWidth}px`;
                this.style.height = 'auto';
                
                const left = containerWidth / 2 + randomX;
                const top = containerHeight / 2 + randomY;
                
                this.style.left = `${left}px`;
                this.style.top = `${top}px`;
                this.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;
                this.style.maxWidth = '300px';
                this.style.zIndex = subImageCount + 10;
                
                // 드래그 기능 추가
                makeDraggable(this);
                
                modalSubImages.appendChild(this);
                subImageCount++;
                // 다음 서브 이미지 확인
                loadSubImages(subIndex + 1);
            };
            
            subImg.onerror = function() {
                // 이미지가 없으면 다음으로
                loadSubImages(subIndex + 1);
            };
        }
        
        loadSubImages(1);
        
        // 드래그 가능하게 만드는 함수
        function makeDraggable(element) {
            let isDragging = false;
            let startX, startY;
            let initialLeft, initialTop;
            
            element.addEventListener('mousedown', function(e) {
                isDragging = true;
                element.classList.add('dragging');
                
                const rect = element.getBoundingClientRect();
                const containerRect = element.parentElement.getBoundingClientRect();
                
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = rect.left - containerRect.left;
                initialTop = rect.top - containerRect.top;
                
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                
                const containerRect = element.parentElement.getBoundingClientRect();
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                const newLeft = initialLeft + deltaX;
                const newTop = initialTop + deltaY;
                
                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
                // rotate는 유지하되 translate 제거
                const rotateMatch = element.style.transform.match(/rotate\([^)]+\)/);
                if (rotateMatch) {
                    element.style.transform = rotateMatch[0];
                } else {
                    element.style.transform = '';
                }
            });
            
            document.addEventListener('mouseup', function() {
                if (isDragging) {
                    isDragging = false;
                    element.classList.remove('dragging');
                }
            });
        }
        
        // 텍스트 설정
        modalText.textContent = imageData[index].text;
        
        // 접힌 내용 설정
        if (imageData[index].expandedText && imageData[index].expandedText.trim() !== '') {
            expandedContent.textContent = imageData[index].expandedText;
            expandButton.style.display = 'block';
            modalExpanded.style.display = 'none';
            expandButton.classList.remove('expanded');
        } else {
            expandButton.style.display = 'none';
            modalExpanded.style.display = 'none';
        }
        
        // 모달 표시
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 접기/펼치기 버튼 클릭 이벤트
    expandButton.addEventListener('click', function() {
        if (modalExpanded.style.display === 'none') {
            modalExpanded.style.display = 'block';
            expandButton.classList.add('expanded');
        } else {
            modalExpanded.style.display = 'none';
            expandButton.classList.remove('expanded');
        }
    });
    
    // 모달 닫기
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // 모달 배경 클릭 시 닫기 (확대된 그림 외의 부분)
    modal.addEventListener('click', function(e) {
        // modal-content 내부가 아닌 배경 부분을 클릭했을 때만 닫기
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 모달 콘텐츠 클릭 시 닫지 않도록
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});



