require([
    'dojo/dom',
    'dojo/parser',
    'dojo/json',
    'dijit/form/Button',
    'dijit/form/TextBox',
    'dojo/request/script',
    'dojo/domReady!'
], function(dom, parser, JSON, Button, TextBox, request) {
    // Search text field
    var dijitSearchField = new TextBox({
        name: "Google Search",
        value: ""
    }, "dijitSearchField");
    // Google Custom Search button and onClick event
    var dijitGoogleSearchButton = new Button({
        label: "Google Search",
        // When clicked, send an AJAX request to Google
        onClick: function() {
            localStorage.startCount = 0;
            request.get('https://www.googleapis.com/customsearch/v1', {
                jsonp: "callback",
                query: {
                    key: 'AIzaSyAgNwK5hmxv60pycYKz2ruQIjro3GD_tcM',
                    cx: '001834378105419952226:knlbx1__nci',
                    q: dijitSearchField.get("value")
                }
            }).then(function(data) {                
                localStorage.setItem("searchResults", JSON.stringify(data));
                while (!localStorage.getItem("searchResults")) {}
                window.open("results.html", "_blank");
            }, function(err){
                console.log("Error!");
            }, function(evt){
                console.log("Event!");
            });
        }
    }, "dijitGoogleSearchButton").startup();
    // I'm Feeling Lucky button
    var dijitImFeelingLuckyButton = new Button({
        label: "I'm Feeling Lucky",
        onClick: function(){
        }
    }, "dijitImFeelingLuckyButton").startup();
});