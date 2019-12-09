{
  "default": {
    "isPageInTheURL": true,
    "param": "p"
  },
  "www.google.com": {
    "isPageInTheURL": false,
    "nextPageEl": "a#pnnext"
  },
  "search.naver.com": {
    "isPageInTheURL": false,
    "nextPageEl": "a.next"
  },
  "search.shopping.naver.com": {
    "isPageInTheURL": true,
    "param": "pagingIndex"
  },
  "prod.danawa.com": {
    "isPageInTheURL": false,
    "curPage": 'a[onclick="return false"]',
    "func": "movePage()"
  },
  "www.kyobobook.co.kr": {
    "isPageInTheURL": false,
    "curPage": 'input[name="pageNumber"]',
    "func": "_go_targetPage()"
  }
}