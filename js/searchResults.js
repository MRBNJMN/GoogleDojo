require([
    'dojo/dom',
    'dojo/JSON',
    'dojo/request/script',
    'dijit/form/Button',
    'dojo/domReady!'
], function(dom,JSON, request, Button) {
    // Retrieve data from browser storage
    var searchQuery = localStorage.getItem("searchQuery");
    console.log(searchQuery);
    
    // Establish dojo pointers to nodes
    var resultTitle = dom.byId('resultTitle');
    var resultDisplay = dom.byId('resultDisplay');
    var loadMore = dom.byId('loadMore');
    
    // Establish a count for more results
    var loadMoreCount = 0;
    
    // Declare storage and make the initial API call
    var data = {
        type: "",
        results: {}
    };
    
    apiCall(searchQuery, 0, data);
    console.log(data);
    console.log(data.type);
    
    if (data.type === "errorAPI") {
        // Put the search query in the header
        resultTitle.innerHTML +=
            "<span class='resultsHeader'>" + searchQuery + "<br>";
        // Display error information
        resultDisplay.innerHTML +=
            "<span class='resultsError'>Error: " + data.results.message +
            "<br>" + "Code: " + data.results.code + "</span><br>";
    }
    else if (data.type === "results") {
        // Put the search query in the header
        resultTitle.innerHTML +=
            "<span class='resultsHeader'>" + searchQuery + "<br>";
        // Iterate through the retrieved results
        // Output to the results.html divs
        for (var i = 0; i < 10; i++) {
            resultDisplay.innerHTML +=
            "<div class='resultsItem" + i % 2 + "'>" +
            "<span class='resultsTitle'><a href='" + data.results[i].link + "'><strong>" +
            data.results[i].title + "</strong></a></span>" +
            "<span class='resultsFrom'><em> ...from " + data.results[i].displayLink +
            "</em></span><br>" +
            "<span class='resultsSnippet'>" + data.results[i].snippet + "</span><br>" +
            "</div>";
        };
        var loadMoreButton = new Button({
            label: "Load More",
            // When clicked, display the next 10 results under the current set
            onClick: function() {
                loadMoreCount = loadMoreCount + 10;
                var loadMoreData = new Object();
                apiCall(searchQuery, loadMoreCount, loadMoreData);
                if (loadMoreData.type === "errorAPI") {
                    resultDisplay.innerHTML +=
                        "<span class='resultsError'>Error: " + data.results.message +
                        "<br>" + "Code: " + data.results.code + "</span><br>";
                }
                else if (loadMoreData.type === "results") {
                    data.push(loadMoreData.results);
                    for (var i = loadMoreCount; i < (loadMoreCount + 10); i++) {
                        resultDisplay.innerHTML +=
                        "<div class='resultsItem" + i % 2 + "'>" +
                        "<span class='resultsTitle'><a href='" + data.results[i].link + "'><strong>" +
                        data.results[i].title + "</strong></a></span>" +
                        "<span class='resultsFrom'><em> ...from " + data.results[i].displayLink +
                        "</em></span><br>" +
                        "<span class='resultsSnippet'>" + data.results[i].snippet + "</span><br>" +
                        "</div>";
                    };
                }
                else {
                    resultDisplay.innerHTML +=
                        "<span class='resultsError'>Unknown error!</span><br>";
                }
            }
        }, "dijitResultPrevButton").startup();
    }
    else {
        // Put the search query in the header
        resultTitle.innerHTML +=
            "<span class='resultsHeader'>" + searchQuery + "<br>";
        // Display error information
        resultDisplay.innerHTML += JSON.stringify(data);	
            //"<span class='resultsError'>Unknown error!</span><br>";
    }
    
    function apiCall(query, startCount, objectRef) {
        if (startCount === 0) {
            request.get('https://www.googleapis.com/customsearch/v1', {
                jsonp: "callback",
                query: {
                    key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                    cx: '001834378105419952226:knlbx1__nci',
                    q: query
                }
            }).then(function(response) {
                if (response.error) {
                    var errorObj = {
                        'message': response.error.message,
                        'code': response.error.code
                    };
                    objectRef.results = errorObj;
                    objectRef.type = "errorAPI";
                } else {
                    objectRef.results = new Array();
                    for (var i = 0; i < 10; i++) {
                        objectRef.results[i] = {
                            htmlTitle: response.items[i].title,
                            displayLink: response.items[i].displayLink,
                            link: response.items[i].link,
                            snippet: response.items[i].snippet
                        };
                    };
                    objectRef.type = "results";
                }
            }, function(err) {
                console.log(err);
            }, function(evt) {
                console.log(evt);
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
            }).then(function(response) {
                if (response.error) {
                    var errorObj = {
                        'message': response.error.message,
                        'code': response.error.code
                    };
                    objectRef.results = errorObj;
                    objectRef.type = "errorAPI";
                } else {
                    objectRef.results = new Array();
                    for (var i = 0; i < 10; i++) {
                        objectRef.results[i] = {
                            htmlTitle: response.items[i].title,
                            displayLink: response.items[i].displayLink,
                            link: response.items[i].link,
                            snippet: response.items[i].snippet
                        }
                    };
                    objectRef.type = "results";
                }
            }, function(err) {
                console.log(err);
            }, function(evt) {
                console.log(evt);
            });
        }
    }
});
