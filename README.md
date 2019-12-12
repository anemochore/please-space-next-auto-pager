# please-space-next-auto-pager

파폭에 space next라는 확장기능이 있었다. 여러 페이지 사이트(구글이라든가)에서 스크롤을 다 내린 다음 스페이스를 누르면 다음 페이지로 넘어가게 해주는 아주 편리한 녀석이었는데, 언제부턴가 보이지 않음. 그래서 탬퍼멍키용으로 만들었다.

현재 구글, 네이버 검색, 네이버 쇼핑, 다나와, 교보문고, 예스24, 다음 검색, 깃허브, 알라딘, 반디앤루니스, 스택오버플로 지원. 앞으로 사용하면서 필요한 사이트는 [`settings.json`](https://anemochore.github.io/please-space-next-auto-pager/settings.json) 파일에 추가할 예정이다.

## 기능
검색 결과가 여러 페이지일 때, 스페이스를 마구 눌러서 아래로 내려가다 쪼끄만 '다음 페이지' 클릭하는 게 너무 귀찮을 때, 그냥 스페이스 한 번만 더 누르면 다음 페이지로 이동함.

## 원리
1. URL에 `page` 등의 매개변수(parameter)가 있으면 그걸 이용해 다음 페이지로 이동한다.
2. URL에 페이지 숫자가 없는 사이트(구글)는 '다음 페이지' 버튼이 있으면 그걸 누른다.
3. 몇몇 사이트는 아예 js로 페이지를 넘어가게 해놨는데, 그 경우 그 함수를 직접 실행한다.

물론 2번과 3번은 해당 DOM 요소와 js 함수명을 알아야 함. 검사기로 찍어보면 다 나옴.

## 설치
1. 탬퍼멍키가 없다면 설치한다. 참고로 파폭에서만 테스트했다. [파폭](https://addons.mozilla.org/ko/firefox/addon/tampermonkey/), [크롬](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ko)
2. 탬퍼멍키에 [`main2.js`](https://anemochore.github.io/please-space-next-auto-pager/main2.js) 파일을 추가한다(새 유저 스크립트 > 내용 복붙). 다른 설정은 바꿀 것 없다.
3. 이후 종종 업데이트를 확인하자.

## todo
1. 사이트별 설정을 만들어주는 마법사를 만들자.
2. `settings.json`의 설정 문서화하기.
3. 마법사로 생성한 json 설정을 사용자들이 이슈로 올리면, 봇을 돌려 통합하면 좋을까 싶은데 가능할지 모르겠다.
4. 뭔가 사이트를 일일이 수동으로 지정하지 않고도 자동으로 인식할 방법이 있으면 얼마나 좋을까 싶음.
5. 의문. 현재 모든 사이트에서 작동하게 해놨는데, 지원하는 사이트에서만 작동하게 바꿔야 할까?
6. 설치를 이렇게 복붙으로 하지 말고 뭔가 공식적인 방법으로 하게 해야...
