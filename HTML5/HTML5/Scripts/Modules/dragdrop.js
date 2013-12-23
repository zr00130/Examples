//the element that is dragging
var dragSrcEl = null;

$('.partial.children .thumbnail').prop('draggable', true).prop('title', 'Drag Me!');

/*
Draggable Element Events
*/
/** Begin Dragging */
$('.partial.children').on('dragstart', '.thumbnail', function (e) {
    var evnt = e.originalEvent;
    this.style.opacity = '0.25';
    $('div.row hgroup .droppable').addClass('dropShow');
    dragSrcEl = this;
});

/** End Dragging */
$('.partial.children').on('dragend', '.thumbnail', function () {
    this.style.opacity = '1.0';
    $('div.row hgroup .droppable').removeClass('dropShow');
});

/*
Droppable Element Events
*/
/** When a draggable element enters a droppable element */
$('div.row hgroup').on('dragenter', '.droppable', function () {
    $(this).addClass('over');
});

/** When dragging an element over the droppable element */
$('div.row hgroup').on('dragover', '.droppable', function (e) {
    var evnt = e.originalEvent;
    if (evnt.preventDefault) {
        evnt.preventDefault();
    }

    return false;
});

/** When a draggable element drops on a droppable element */
$('div.row hgroup').on('drop', '.droppable', function (e) {
    var evnt = e.originalEvent;
    if (evnt.stopPropagation) {
        evnt.stopPropagation();
    }

    //no dropping on yourself
    if (dragSrcEl != this) {
        //when a draggable thumbnail nav is dropped on the page header, navigate to that page
        window.location = $(dragSrcEl).prop('href');
    }

    return false;
});

/** When a draggable element leaves a droppable element */
$('div.row hgroup').on('dragleave', '.droppable', function () {
    $(this).removeClass('over');
});