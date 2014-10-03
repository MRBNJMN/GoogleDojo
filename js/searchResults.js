require([
    'dojo/dom',
    'dojo/json',
    'dojo/request/script',
    'dijit/form/Button',
    'dojo/domReady!'
], function(dom, JSON, request, Button) {
    
    // Retrieve data from browser storage
    var searchQuery = localStorage.getItem("searchQuery");
    
    // Establish dojo pointers to search result divs
    var resultTitle = dom.byId('resultTitle');
    var resultDisplay = dom.byId('resultDisplay');
    
    // Establish a tracker to display more results
    var resultIndex = 0;
    
    // Declare result storage
    var data = {
        "type": "",
        "results": {}
    };
    
    // Make the API call for initial results
    apiCall(searchQuery, resultIndex, data);
    
    // Delay the display of results until the API can respond
    setTimeout(apiWait, 1000);
    
    // Display the initial set of results
    // Load a button for more results at the bottom
    function apiWait() {
        
        // If we've exceeded our query limit
        if (data.type === "errorAPI") {
            // Put the search query in the header
            resultTitle.innerHTML +=
                "<span class='resultsHeader'>" + searchQuery + "<br>";
            // Display error information from Google
            resultDisplay.innerHTML +=
                "<span class='resultsError'>Error: " + data.results.message +
                "<br>" + "Code: " + data.results.code + "</span><br>";
        }
        
        // Else if we received results
        else if (data.type === "results") {
            // Put the search query in the header
            resultTitle.innerHTML +=
                "<span class='resultsHeader'>" + searchQuery + "<br>";
            // Iterate through the retrieved results
            // Output to the resultDisplay div, ready for CSS formatting
            for (var i = 0; i < 10; i++) {
                resultDisplay.innerHTML +=
                "<div class='resultsItem" + i % 2 + "'>" + // For alternating color BG
                "<span class='resultsTitle'><a href='" + data.results[i].link + "'><strong>" +
                data.results[i].title + "</strong></a></span>" +
                "<span class='resultsFrom'><em>  from " + data.results[i].displayLink +
                "</em></span><br>" +
                "<span class='resultsSnippet'>" + data.results[i].snippet + "</span><br>" +
                "</div>";
            };
            // Provide a button to make another call and load more results
            var loadMoreButton = new Button({
                label: "Load More",
                // Increase the result index
                // Pass it as the new startCount
                // Load the new results after 1 second
                onClick: function() {
                    resultIndex = resultIndex + 10;
                    apiCall(searchQuery, resultIndex, data);
                    setTimeout(apiLoadMoreWait, 1000);
                }
            }, "loadMore").startup();
        }
        
        // Else, something unexpected happened
        else {
            // Put the search query in the header
            resultTitle.innerHTML +=
                "<span class='resultsHeader'>" + searchQuery + "<br>";
                // Display unknown error message
                "<span class='resultsError'>Unknown error!</span><br>";
        }
    } // End apiWait()
    
    // Display additional results after Load More is clicked
    // These results will print neatly between the last results and the Load More button
    function apiLoadMoreWait() {
        
        // If we've exceeded our query limit
        if (data.type === "errorAPI") {
            resultDisplay.innerHTML +=
                "<span class='resultsError'>Error: " + data.results.message +
                "<br>" + "Code: " + data.results.code + "</span><br>";
        }
        
        // Else if we received results
        else if (data.type === "results") {
            for (var i = resultIndex; i < (resultIndex + 10); i++) {
                resultDisplay.innerHTML +=
                "<div class='resultsItem" + i % 2 + "'>" + // For alternating color BG
                "<span class='resultsTitle'><a href='" + data.results[i].link + "'><strong>" +
                data.results[i].title + "</strong></a></span>" +
                "<span class='resultsFrom'><em>  from " + data.results[i].displayLink +
                "</em></span><br>" +
                "<span class='resultsSnippet'>" + data.results[i].snippet + "</span><br>" +
                "</div>";
            };
        }
        
        // Else, something unexpected happened
        else {
            resultDisplay.innerHTML +=
                "<span class='resultsError'>Unknown error!</span><br>";
        }
    } // End apiLoadMoreWait()
    
    // Make an API call to Google Custom Search Engine
    // Params are query from localStorage, startCount for the result index,
    // and objectRefCall as a reference to data{}
    function apiCall(query, startCount, objectRefCall) {
        
        // If we don't need &start in our HTTP request
        if (startCount === 0) {
            request.get('https://www.googleapis.com/customsearch/v1', {
                // Use jsonp for cross-domain HTTP request
                jsonp: "callback",
                // Pass API key, search engine reference, and user query
                // as parameters
                query: {
                    key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                    cx: '001834378105419952226:knlbx1__nci',
                    q: query
                }
            // Then call a function that returns function(results)
            }).then(apiResponse(objectRefCall, startCount),
            function(err) { console.log(err); },
            function(evt) { console.log(evt); }
            );
        }
        // If we DO need &start in our HTTP request (results requested > 10)
        else {
            request.get('https://www.googleapis.com/customsearch/v1', {
                jsonp: "callback",
                query: {
                    key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                    cx: '001834378105419952226:knlbx1__nci',
                    q: query,
                    start: startCount // The only difference between else and if
                }
            }).then(apiResponse(objectRefCall, startCount),
            function(err) { console.log(err); },
            function(evt) { console.log(evt); }
            );
        }
    } // End apiCall()
    
    // Do something with the results
    // Params are a reference to data{} and resultIndex
    function apiResponse(objectRefResp, startCount) {
        
        // Return what dojo/request expects for then()
        return function(response) {
            // If we get an API error from Google
            if (response.error) {
                objectRefResp.results = {
                    'message': response.error.message,
                    'code': response.error.code
                };
                objectRefResp.type = "errorAPI";
            }
            // Else, if we get results back
            else {
                // Store the results to individual objects in
                // the results array
                for (var i = 0; i < 10; i++) {
                    objectRefResp.results[startCount + i] = {
                        title: response.items[i].title,
                        displayLink: response.items[i].displayLink,
                        link: response.items[i].link,
                        snippet: response.items[i].snippet
                    };
                };
                objectRefResp.type = "results";
            }
        };
    } // End apiResponse()
});
