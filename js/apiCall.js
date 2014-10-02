require([
    'dojo/dom',
    'dojo/request/script',
    'dojo/store/Memory'
], function(dom, request, Memory) {
    function apiCall(query, startCount) {
        if (startCount === 0) {
            request.get('https://www.googleapis.com/customsearch/v1', {
                jsonp: "callback",
                query: {
                    key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                    cx: '001834378105419952226:knlbx1__nci',
                    q: query
                }
            }).then(function(data) {
                if (data.error) {
                    var errorObj = {
                        'message': data.error.message,
                        'code': data.error.code
                    };
                    return ["errorAPI", errorObj];
                } else {
                    var resultsObjs = [];
                    for (var i = 0; i < 10; i++) {
                        var currentResult = {};
                        currentResult.htmlTitle = data.items[i].title;
                        currentResult.displayLink = data.items[i].displayLink;
                        currentResult.link = data.items[i].link;
                        currentResult.snippet = data.items[i].snippet;
                        resultsObjs.push(currentResult);
                    };
                    return ["results", resultsObjs];
                }
            }, function(err) {
                return err;
            }, function(evt) {
                return evt;
            });
        } else {
            request.get('https://www.googleapis.com/customsearch/v1', {
                jsonp: "callback",
                query: {
                    key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                    cx: '001834378105419952226:knlbx1__nci',
                    q: query,
                    start: startCount
                }
            }).then(function(data) {
                if (data.error) {
                    var errorObj = {
                        'message': data.error.message,
                        'code': data.error.code
                    };
                    return ["errorAPI", errorObj];
                } else {
                    var resultsObjs = [];
                    for (var i = 0; i < data.items.length; i++) {
                        var currentResult = {};
                        currentResult.htmlTitle = data.items[i].htmlTitle;
                        currentResult.displayLink = data.items[i].displayLink;
                        currentResult.link = data.items[i].link;
                        currentResult.snippet = data.items[i].htmlSnippet;
                        resultsObjs.push(currentResult);
                    };
                    return ["results", resultsObjs];
                }
            }, function(err) {
                return err;
            }, function(evt) {
                return evt;
            });
        }
    }
});