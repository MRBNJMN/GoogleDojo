require([
    'dojo/dom',
    'dojo/on',
    'dojo/keys',
    'dijit/form/Button',
    'dijit/form/TextBox',
    'dojo/domReady!'
], function(dom, on, keys, Button, TextBox) {
    
    // Search text field
    var dijitSearchField = new TextBox({
        name: 'Google Search',
        value: ''
    }, 'dijitSearchField');
    
    // Event monitor for pressing enter in the search field
    on(dijitSearchField, 'keypress', function(evt) {
        var charOrCode = evt.charCode || evt.keyCode;
        
        // On enter, perform the same actions as clicking Google Search
        if (charOrCode === keys.ENTER) {
            localStorage.setItem('searchQuery', dijitSearchField.get('value'));
            window.open('results.html', '_blank', 'width=1200, height=950');
        };
    });
    
    // Google Search button and onClick event
    var dijitGoogleSearchButton = new Button({
        label: 'Google Search',
        // When clicked, store the input to localStorage
        // Open results.html on a new page
        onClick: function() {
            localStorage.setItem('searchQuery', dijitSearchField.get('value'));
            window.open('results.html', '_blank', 'width=1200, height=950');
        }
    }, 'dijitGoogleSearchButton').startup();
    
    // I'm Feeling Lucky button (mostly for appearances)
    var dijitImFeelingLuckyButton = new Button({
        label: "I'm Feeling Lucky",
        onClick: function() {}
    }, 'dijitImFeelingLuckyButton').startup();
});