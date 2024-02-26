

function getCookie(cm) {
    var m = cm + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(m) == 0) {
            return c.substring(m.length, c.length);
        }
    }
    return "";
}


function setCookie(m,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = m + "=" + (value || "")  + expires + "; path=/";
}

function eraseCookie(m, paths) {
    var expires = new Date(0).toUTCString();
    document.cookie = m + '=; expires=' + expires;

    for (var i = 0, l = paths.length; i < l; i++) {
        document.cookie = m + '=; path=' + paths[i] + '; expires=' + expires;
    }
}

if(!window.locale){
    var search = location.search.substring(1);

    if (search) {
        var queryObject = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
        if (queryObject['configUrl']) {
            window.configUrl = queryObject['configUrl'];
        }
        if (queryObject['specificUrl']) {
            window.specificUrl = queryObject['specificUrl'];
        }
    }
}
if(!window.locale){
    // old implementation of locale - Yanko
    // if (getCookie('locale')) {
    //     window.locale = getCookie('locale');
    // }
    // else {
    //     window.locale = "bg";
    //Not yet....
    //window.locale = navigator.language.substr(0, 2);
    //}  
}

if (!Object.entries) {
    Object.entries = function (obj){
        var ownms = Object.keys(obj),
            i = ownms.length,
            resArray = new Array(i);
        while (i--)
            resArray[i] = [ownms[i], obj[ownms[i]]];
    
        return resArray;
    };
}

function getUrlParams() {
    var resultParams = {};
    var url = window.location.href;
    var splittedUrl = url.split("?");
    var urlParams = splittedUrl[1];
    if (urlParams) {
        var splittedUrlParams = urlParams.split("&");
        for (var i = 0; i < splittedUrlParams.length; i++) {
            var paramStr = splittedUrlParams[i];
            var spittedParamStr = paramStr.split('=');
            var key = spittedParamStr[0];
            var value = spittedParamStr[1];
            if (key && value) {
                resultParams[key] = value;
            }
        }
    }
    return resultParams;
}
