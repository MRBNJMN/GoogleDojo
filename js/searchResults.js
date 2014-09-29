require([
    'dojo/dom',
    'dojo/parser',
    'dojo/json',
    'dojo/request/script',
    'dojo/dom-style',
    'dijit/form/Button',
    'dojo/domReady!'
], function(dom, parser, JSON, request, domStyle, Button) {
    // Retrieve data from browser storage
//    var resultsRetrieve = localStorage.getItem("searchResults");
//    var data = JSON.parse(resultsRetrieve);
    
//    localStorage.setItem("searchTerms", data.queries.nextPage[0].searchTerms);

    // Retrieve IDs for results.html dijit divs
    var dijitResultTitle = dom.byId('dijitResultTitle');
    var dijitResultDisplay = dom.byId('dijitResultDisplay');
    var dijitResultFooter = dom.byId('dijitResultFooter');
    var dijitResultPrevButton = dom.byId('dijitResultPrevButton');
    var dijitResultNextButton = dom.byId('dijitResultNextButton');

    // Iterate through the retrieved results
    // Output to the results.html divs
    dijitResultTitle.innerHTML +=
        "<span class='resultsHeader'>" + localStorage.getItem("searchTerms") + "<br>";

    for (var i = 0; i < data.items.length; i++) {
        dijitResultDisplay.innerHTML +=
        "<div class='resultsItem" + i % 2 + "'>" +
        "<span class='resultsTitle'><a href='" + data.items[i].link + "'><strong>" +
        data.items[i].htmlTitle + "</strong></a></span>" +
        "<span class='resultsFrom'><em> ...from " + data.items[i].displayLink +
        "</em></span><br>" +
        "<span class='resultsSnippet'>" + data.items[i].htmlSnippet + "</span><br>" +
        "</div>";
    };
    
    if (localStorage.startCount >= 10 && localStorage.startCount < 20) {
        var dijitResultPrevButton = new Button({
            label: "",
            // When clicked, send an AJAX request to Google
            onClick: function() {
                localStorage.startCount = Number(localStorage.startCount) - 10;
                request.get('https://www.googleapis.com/customsearch/v1', {
                    jsonp: "callback",
                    query: {
                        key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                        cx: '001834378105419952226:knlbx1__nci',
                        q: localStorage.getItem("searchTerms")
                    }
                }).then(function(data) {                
                    localStorage.setItem("searchResults", JSON.stringify(data));
                    while (!localStorage.getItem("searchResults")) {}
                    window.open("results.html", "_self");
                }, function(err){
                    console.log("Error!");
                }, function(evt){
                    console.log("Event!");
                });
            }
        }, "dijitResultPrevButton").startup();
    }
    else if (localStorage.startCount >= 20) {
        var dijitResultPrevButton = new Button({
            label: "",
            // When clicked, send an AJAX request to Google
            onClick: function() {
                localStorage.startCount = Number(localStorage.startCount) - 10;
                request.get('https://www.googleapis.com/customsearch/v1', {
                    jsonp: "callback",
                    query: {
                        key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                        cx: '001834378105419952226:knlbx1__nci',
                        q: localStorage.getItem("searchTerms"),
                        start: localStorage.startCount
                    }
                }).then(function(data) {                
                    localStorage.setItem("searchResults", JSON.stringify(data));
                    while (!localStorage.getItem("searchResults")) {}
                    window.open("results.html", "_self");
                }, function(err){
                    console.log("Error!");
                }, function(evt){
                    console.log("Event!");
                });
            }
        }, "dijitResultPrevButton").startup();
    } else {
        domStyle.set("dijitResultPrevButton", "display", "none");
    }
    
    var dijitResultNextButton = new Button({
        label: "",
        // When clicked, send an AJAX request to Google
        onClick: function() {
            localStorage.startCount = Number(localStorage.startCount) + 10;
            request.get('https://www.googleapis.com/customsearch/v1', {
                jsonp: "callback",
                query: {
                    key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                    cx: '001834378105419952226:knlbx1__nci',
                    q: localStorage.getItem("searchTerms"),
                    start: localStorage.startCount
                }
            }).then(function(data) {                
                localStorage.setItem("searchResults", JSON.stringify(data));
                while (!localStorage.getItem("searchResults")) {}
                window.open("results.html", "_self");
            }, function(err){
                console.log("Error!");
            }, function(evt){
                console.log("Event!");
            });
        }
    }, "dijitResultNextButton").startup();
});