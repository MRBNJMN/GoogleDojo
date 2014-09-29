require([
    'dojo/dom',
    'dojo/parser',
    'dojo/json',
    'dijit/registry',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'dijit/form/Button',
    'dojo/domReady!'
], function(dom, parser, JSON, registry, BorderContainer, ContentPane, Button) {
    // Retrieve data from browser storage
    var resultsRetrieve = localStorage.getItem("searchResults");
    var data = JSON.parse(resultsRetrieve);
    
    var key = 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM';

    // Retrieve IDs for results.html dijit divs
    var dijitResultTitle = dom.byId('dijitResultTitle');
    var dijitResultDisplay = dom.byId('dijitResultDisplay');
    var dijitResultFooter = dom.byId('dijitResultFooter');

    // Iterate through the retrieved results
    // Output to the results.html divs
    for (var i = 0; i < data.items.length; i++) {
        dijitResultDisplay.innerHTML +=
        "<span class='resultsTitle'><a href='" + data.items[i].link + "'><strong>" +
        data.items[i].htmlTitle + "</strong></a></span>" +
        "<span class='resultsFrom'><em> ...from " + data.items[i].displayLink +
        "</em></span><br>" +
        "<span class='resultsSnippet'>" + data.items[i].htmlSnippet + "</span><br><br>";
    };
    
    var dijitResultPrevButton = new Button({
        label: "Prev",
        // When clicked, send an AJAX request to Google
        onClick: function() {
            localStorage.startCount = Number(localStorage.startCount) - 10;
            request.get('https://www.googleapis.com/customsearch/v1', {
                jsonp: "callback",
                query: {
                    key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                    cx: '001834378105419952226:knlbx1__nci',
//                    q: ???
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
    
    var dijitResultNextButton = new Button({
        label: "Next",
        // When clicked, send an AJAX request to Google
        onClick: function() {
            localStorage.startCount = Number(localStorage.startCount) + 10;
            request.get('https://www.googleapis.com/customsearch/v1', {
                jsonp: "callback",
                query: {
                    key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                    cx: '001834378105419952226:knlbx1__nci',
//                    q: ???
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