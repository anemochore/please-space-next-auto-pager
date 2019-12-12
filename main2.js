// ==UserScript==
// @name          please space next auto pager
// @namespace     https://anemochore.github.io/please-space-next-auto-pager/
// @version       0.3
// @description   press space at the end of page to load next page
// @author        fallensky@naver.com
// @include       *
// @updateURL     https://anemochore.github.io/please-space-next-auto-pager/main2.js
// @downloadURL   https://anemochore.github.io/please-space-next-auto-pager/main2.js
// @grant         none
// ==/UserScript==

// ver 0.1 @ 2019-12-09
//    first experiment. fuzzy setting not implemented
// ver 0.2 @ 2019-12-10
//    small fixes
// ver 0.3 @ 2019-12-12
//    activates only when the focus is on 'body'


//(() => {
  document.onkeydown = evt => {
    evt = evt || window.event;
    let isSpace = false;
    if('key' in evt) isSpace = (evt.key == ' ' || evt.key == 'Spacebar');
    else if ('code' in evt) isSpace = (evt.code == 32);
    
    let isFocusOnBody = false;
    let curEl = document.activeElement;
    if(curEl && curEl.tagName.toLowerCase() == 'body') isFocusOnBody = true;

    if(isSpace && isFocusOnBody && window.innerHeight + window.pageYOffset >= document.body.scrollHeight) {
      //init
      fetch('https://anemochore.github.io/please-space-next-auto-pager/settings.json')
      .then(response => response.json())
      .then(SETTING => {

        //fuzzy settings
        let FUZZY = [];
        FUZZY = [
          'page',        //not used for now
        ];  //todo

        let setting = SETTING['default'];
        let host = location.host;
        if(host in SETTING) setting = SETTING[host];

        if('isPageInTheURL' in setting && setting.isPageInTheURL) {
          let possibleParams = FUZZY.slice();
          if(setting.param && possibleParams.indexOf(setting.param) == -1)
             possibleParams.unshift(setting.param);

          let params = new URL(document.URL).searchParams;
          let curPage, idx;
          for(idx=0; idx<possibleParams.length; idx++) {
            curPage = params.get(possibleParams[idx]);
            if(curPage) break;
          }

          let nextPage;
          if(!curPage) {
            nextPage = 2;
            idx = 0;  //try first param only to prevent probably unsuccessful loading and checking. todo: ...
          }
          else {
            nextPage = parseInt(curPage) + 1;
          }
          params.set(possibleParams[idx], nextPage);
          window.location.href = location.origin + location.pathname + '?' + params.toString(); //no error check
          return;
        }
        else if('isPageInTheURL' in setting && !setting.isPageInTheURL) {
          let curPage = ('curPage' in setting && setting.curPage);
          let nextPageEl = ('nextPageEl' in setting && setting.nextPageEl);
          if(curPage && nextPageEl) {
            console.log('space next: both curPage and nextPageEl cannot be allowed. exit...');
            return;
          }

          let exec = 'click';
          if(setting.func) {
            exec = setting.func.trim();
            if(exec.endsWith('()')) exec = exec.slice(0, -2);
          }

          if(curPage) {
            let target = document.querySelector(curPage);
            let nextPage;
            if('value' in target) 
              nextPage = parseInt(target.value) + 1;
            else 
              nextPage = parseInt(target.innerText) + 1;
            let func = eval(exec);
            func(nextPage);
          }
          else {
            let target = document.querySelector(nextPageEl);
            let func = target[exec];
            func.apply(target);
          }
        }
      });
    }

  };
//})();