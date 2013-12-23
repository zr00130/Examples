var styleSheet = null;
var db = null;
var defaultExample = { name: "default", css: "h3 { color: red; }", html: "<h3>TEST</h3>" };

function cssValueChanged(el, text) {
    el.text(text);
    el.focus();
    //keep track of last caret position
    var savedPosition = getCaretPosition(el[0]);

    var content = el.text();
    if (content.length < savedPosition) savedPosition = content.length;
    el.text(content);

    styleSheet.innerHTML = content;
    localStorage["CssInput"] = content;

    hljs.highlightBlock(el[0]);

    //since replacing text, set caret position back
    setCaretPosition(el[0], savedPosition);
}

function htmlValueChanged(el, text) {
    el.text(text);
    el.focus();
    //keep track of last caret position
    var savedPosition = getCaretPosition(el[0]);

    var content = el.text();
    if (content.length < savedPosition) savedPosition = content.length;
    el.text(content);

    try {
        $('#output').html(content);
    } finally {
        localStorage["HtmlInput"] = content;

        hljs.highlightBlock(el[0]);

        //since replacing text, set caret position back
        setCaretPosition(el[0], savedPosition);
    }
}

$(document).ready(function () {
    //create dynamic stylesheet
    styleSheet = document.createElement('style');
    styleSheet.innerHTML = "";
    $('.partial.sandbox').append(styleSheet);

    //Sandbox IndexedDB init
    openDB();
});

$('body').on('change', '#menuExamples', function () {
    //selected option
    var option = $(this).find('option:selected');

    //get bound content and change the text
    var item = option.data('content');
    cssValueChanged($('#cssInput code'), item['css']);
    htmlValueChanged($('#htmlInput code'), item['html']);
});

function openDB() {
    var request = indexedDB.open('sandbox', 3);

    request.onupgradeneeded = function (event) {
        var db = request.result;
        if (event.oldVersion < 1) {
            //create initial version of Sandbox DB
            var store = db.createObjectStore("examples", { keyPath: "name" });
            var nameIndex = store.createIndex("by_name", "name", { unique: true });
        }
        if (event.oldVersion < 2) {
            //add default entry
            try{
                var store = request.transaction.objectStore('examples');
                store.put(defaultExample);
            } finally { }
        }
    };

    request.onsuccess = function () {
        db = request.result;

        var storeName = 'examples';
        var trans = db.transaction(storeName, 'readwrite');
        var store = trans.objectStore(storeName);
        store.put(defaultExample);

        getAllItems(storeName, function (items) {
            var $examples = $('#menuExamples');
            $examples.empty();
            var $opt = $('<option>locally saved</option>');
            $opt.data('content', { name: 'locally saved', css: localStorage["CssInput"], html: localStorage["HtmlInput"] });
            $examples.append($opt);
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                var $opt = $('<option>' + item["name"] + '</option>');
                $opt.data('content', item);
                $examples.append($opt);
            }

            //fire off change event for initial selected item (local storage)
            $('#menuExamples').trigger('change');
        });
    };
}

function getAllItems(storeName, callback) {
    var trans = db.transaction(storeName, 'readonly');
    var store = trans.objectStore(storeName);
    var items = [];

    trans.oncomplete = function (event) {
        callback(items);
    };

    var cursorRequest = store.openCursor();

    cursorRequest.onerror = function (err) {
        console.log(error);
    };

    cursorRequest.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            items.push(cursor.value);
            cursor.continue();
        }
    };
}

//already exists, just update css and html
function updateExample() {
    var $examples = $('#menuExamples');
    var $option = $examples.find('option:selected');
    var item = $option.data('content');

    var updatedItem = { name: item["name"], css: localStorage["CssInput"], html: localStorage["HtmlInput"] };
    //save in memory
    $option.data('content', updatedItem);

    //update to the db
    var trans = db.transaction('examples', 'readwrite');
    var store = trans.objectStore('examples');
    var request = store.put(updatedItem);

    request.onerror = function (err) {
        console.log(err);
    };
}

//create a new entry, prompt for name and save css and html
function newExample() {
    var $examples = $('#menuExamples');

    //request name
    var name = prompt("Enter example name", "example" + ($examples.children().length));

    var exists = false;
    $('option', $examples).each(function () {
        if (!exists && $(this).text() == name) {
            alert('That name already exists!');
            exists = true;
        }
    });

    if (!exists) {
        var updatedItem = { name: name, css: localStorage["CssInput"], html: localStorage["HtmlInput"] };

        //update to the db
        var trans = db.transaction('examples', 'readwrite');
        var store = trans.objectStore('examples');
        var request = store.put(updatedItem);
    }

    request.onsuccess = function () {
        var $option = $('<option>' + name + '</option>');
        $option.data('content', updatedItem);
        $examples.append($option);
        $option.prop('selected', 'selected');
    };

    request.onerror = function (err) {
        console.log(err);
    };
}

function deleteExample() {
    var $examples = $('#menuExamples');
    var $option = $examples.find('option:selected');
    var item = $option.data('content');

    if (item['name'] == 'locally saved') return;

    //update to the db
    var trans = db.transaction('examples', 'readwrite');
    var store = trans.objectStore('examples');
    var request = store.delete(item['name']);

    request.onsuccess = function () {
        $option.remove();
    };

    request.onerror = function (err) {
        console.log(err);
    };
}

//stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022
function getCaretPosition(element) {
    var caretOffset = 0;
    if (typeof window.getSelection != "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

function getTextNodesIn(node) {
    var textNodes = [];
    if (node.nodeType == 3) {
        textNodes.push(node);
    } else {
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
        }
    }
    return textNodes;
}

function setCaretPosition(el, start) {
    var end = start;
    if (document.createRange && window.getSelection) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var textNodes = getTextNodesIn(el);
        var foundStart = false;
        var charCount = 0, endCharCount;

        for (var i = 0, textNode; textNode = textNodes[i++];) {
            endCharCount = charCount + textNode.length;
            if (!foundStart && start >= charCount
                    && (start < endCharCount ||
                    (start == endCharCount && i < textNodes.length))) {
                range.setStart(textNode, start - charCount);
                foundStart = true;
            }
            if (foundStart && end <= endCharCount) {
                range.setEnd(textNode, end - charCount);
                break;
            }
            charCount = endCharCount;
        }

        //when editing and deleting the last character make sure it doesn't error out
        if (!foundStart && textNodes.length > 0) {
            range.setStartAfter(textNodes[textNodes.length - 1]);
            range.setEndAfter(textNodes[textNodes.length - 1]);
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(true);
        textRange.moveEnd("character", end);
        textRange.moveStart("character", start);
        textRange.select();
    }
}