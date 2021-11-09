// ==UserScript==
// @name          please space next auto pager
// @namespace     https://anemochore.github.io/please-space-next-auto-pager/
// @version       0.5.5
// @description   press space at the end of page to load next page
// @author        fallensky@naver.com
// @include       *
// @updateURL     https://raw.githubusercontent.com/anemochore/please-space-next-auto-pager/master/main2.js
// @downloadURL   https://raw.githubusercontent.com/anemochore/please-space-next-auto-pager/master/main2.js
// @grant         GM_getResourceText
// @resource      SETTING https://raw.githubusercontent.com/anemochore/please-space-next-auto-pager/master/settings.json
// ==/UserScript==


// ver 0.1 @ 2019-12-09
//    first experiment. fuzzy setting not implemented
// ver 0.2 @ 2019-12-10
//    small fixes
// ver 0.3 @ 2019-12-12
//    activates only when the focus is on 'body'
// ver 0.4 @ 2019-12-21
//    setting 'paramWithoutEqual' added
// ver 0.4b @ 2019-12-21
//    replaced fetch() with GM_xmlhttpRequest() to bypass SOP
// ver 0.5 @ 2019-12-21
//    small edit to see how auto-update works
// ver 0.5.1 @ 2020-04-18
//    small fix
// ver 0.5.2 @ 2020-11-07
//    works regardless of www in url
// ver 0.5.3 @ 2021-10-05
//    fixed a bug that wrongly decodes url when url contains url-encoded strings (like non-latin query strings)
// ver 0.5.4 @ 2021-10-22
//    fixed a bug of v0.5.3
// ver 0.5.5 @ 2021-11-9
//    fixed a bug of v0.5.4 (non-working when on first page)


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

    //fuzzy settings
    let FUZZY = [];
    FUZZY = [
      'page',        //not used for now
    ];  //todo

    let host = location.host;
    let setting = SETTING[host];

    if(!host.startsWith('www.') && !setting) {
      host = 'www.' + host;
      setting = SETTING[host];
    }
    else if(host.startsWith('www.') && !setting) {
      host = host.slice(4);
      setting = SETTING[host];
    }

    if(!setting) {
      //fuzzy mode. todo
      console.info('this site is not included in setting.json');
      return;
    }
    else if(setting.isPageInTheURL) {
      let curPage, nextPage, newUrl;
      if(setting.param) {
        let possibleParams = FUZZY.slice() || [];
        if(setting.param && possibleParams.indexOf(setting.param) == -1)
           possibleParams.unshift(setting.param);

        const url = new URL(document.URL);
        const params = url.searchParams;
        let idx;
        for(idx=0; idx<possibleParams.length; idx++) {
          curPage = params.get(possibleParams[idx]);
          if(curPage) break;
        }

        if(!curPage) {
          nextPage = 2;
          idx = 0;  //try first param only to prevent probably unsuccessful loading and checking. todo: ...
        }
        else {
          nextPage = parseInt(curPage) + 1;
        }

        //params.toString() won't work when url contains url-encoded strings (like non-latin query strings)
        let search = url.search;
        const reg = new RegExp(`(&|\\?)${possibleParams[idx]}=${curPage}(&?)`);
        const matches = search.match(reg);

        if(matches && matches[2])
          search = search.replace(reg, '&');
        else
          search = search.replace(reg, '');

        if(search.trim().endsWith('&')) search = search.slice(0, -1);
        const paramsString = search + '&' + possibleParams[idx] + '=' + nextPage;
        newUrl = location.origin + location.pathname + paramsString;
        console.log(newUrl);
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
