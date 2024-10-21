// ==UserScript==
// @name          please space next auto pager
// @namespace     https://github.com/anemochore/please-space-next-auto-pager/
// @version       0.6.2
// @description   press space at the end of page to load next page
// @author        fallensky@naver.com
// @include       *
// @updateURL     https://anemochore.github.io/please-space-next-auto-pager/main2.js
// @downloadURL   https://anemochore.github.io/please-space-next-auto-pager/main2.js
// @grant         GM_getResourceText
// @resource      SETTING https://anemochore.github.io/please-space-next-auto-pager/settings.json
// ==/UserScript==


// ver 0.1 @ 2019-12-09
//    first experiment. fuzzy setting not implemented
// ver 0.2 @ 2019-12-10
//    small fixes
// ver 0.3 @ 2019-12-12
//    activates only when the focus is on 'body'
// ver 0.4 @ 2019-12-21
//    setting 'paramWithoutEqual' added
// ver 0.5 @ 2019-12-21
//    small edit to see how auto-update works
// ver 0.6.0 @ 2024-10-04
//    add rough fuzzy mode
// ver 0.6.1 @ 2024-10-07
//    wrap-up
// ver 0.6.2 @ 2024-10-07
//    fix bug


document.onkeydown = evt => {
  evt = evt || window.event;
  let isSpace = false;
  if('key' in evt) isSpace = (evt.key == ' ' || evt.key == 'Spacebar');
  else isSpace = (evt.code == 32);

  let isFocusOnBody = false;
  let curEl = document.activeElement;
  if(curEl && curEl.tagName.toLowerCase() == 'body') isFocusOnBody = true;

  if(isSpace && isFocusOnBody && window.innerHeight + window.pageYOffset + 1 >= document.body.scrollHeight) {
    //init
    const SETTING = JSON.parse(GM_getResourceText('SETTING'));
    //let isFuzzyMode = false;

    let host = location.host;
    let setting = SETTING[host];

    if(!setting) {
      host = host + '/' + location.pathname.split('/')[1];
      setting = SETTING[host];
    }

    if(!setting) {
      if(!host.startsWith('www.')) host = 'www.' + host;
      else host = host.slice(4);
      setting = SETTING[host];
    }

    if(!setting) {
      //fuzzy mode
      console.log('this site is not included in settings.json. Fuzzy mode enabled.');
      setting = SETTING['default'];
      //isFuzzyMode = true;
    }

    const possibleParams = [];
    if(setting.isPageInTheURL) {
      let curPage, nextPage, newUrl;
      if(setting.param) {
        
        if(setting.param && !possibleParams.includes(setting.param))
           possibleParams.unshift(setting.param);

        const url = new URL(document.URL);
        const params = url.searchParams;
        let idx;
        for(idx=0; idx<possibleParams.length; idx++) {
          curPage = params.get(possibleParams[idx]);
          if(curPage) break;
        }

        let search = url.search, isQuestionMark = false;

        if(!curPage) {
          nextPage = 2;
          idx = 0;  //try first param only to prevent probably unsuccessful loading and checking. todo: ...
          
          if(search == "") isQuestionMark = true;
        }
        else {
          //params.toString() won't work when url contains url-encoded strings (like non-latin query strings)
          let reg = new RegExp(`&${possibleParams[idx]}=${curPage}(&?)`);
          let matches = search.match(reg);
          if(!matches) {
            reg = new RegExp(`\\?${possibleParams[idx]}=${curPage}(&?)`);
            matches = search.match(reg);
            if(matches) isQuestionMark = true;
          }
          console.log(matches, search);

          if(matches && matches[1]) search = search.replace(reg, '&');
          else                      search = search.replace(reg, '');

          nextPage = parseInt(curPage) + 1;
        }

        if(search.trim().endsWith('&')) search = search.trim().slice(0, -1);
        const paramsString = search + (isQuestionMark ? '?' : '&') + possibleParams[idx] + '=' + nextPage;
        newUrl = location.origin + location.pathname + paramsString;
        console.log('result1:', isQuestionMark, search, location.pathname, paramsString);
      }
      else if(setting.paramWithoutEqual) {
        let pathname = new URL(document.URL).pathname;
        if(pathname.indexOf(setting.paramWithoutEqual) == -1) {
          nextPage = 2;
          newUrl = location.origin + location.pathname + '/' + setting.paramWithoutEqual + nextPage;
        }
        else {
          let pageIdx = pathname.indexOf(setting.paramWithoutEqual);
          curPage = pathname.slice(pageIdx).slice(setting.paramWithoutEqual.length);
          nextPage = parseInt(curPage) + 1;
          newUrl = location.origin + pathname.slice(0, pageIdx) + setting.paramWithoutEqual + nextPage;
        }
        console.log('result2:', newUrl);
      }

      if(newUrl) window.location.href = newUrl;
      return;
    }
    else if(!setting.isPageInTheURL) {
      let curPage = setting.curPage;
      let nextPageEl = setting.nextPageEl;
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
        if(target.value) 
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

  }

};
