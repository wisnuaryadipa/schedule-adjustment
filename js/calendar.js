// Visual Studio references

/// <reference path="jquery-1.9.1.min.js" />
/// <reference path="jquery-ui-1.10.2.min.js" />
/// <reference path="moment.min.js" />
/// <reference path="timelineScheduler.js" />

var today = moment().startOf('day');

var Calendar = {
    Periods: [
        {
            Name: '1 days',
            Label: '1 Hari',
            TimeframePeriod: (60 * 1),
            TimeframeOverall: (60 * 24 * 1),
            TimeframeHeaders: [
                'dddd, D MMMM',
                'HH'
            ],
            Classes: 'period-3day'
        },
        {
            Name: '1 week',
            Label: '1 Minggu',
            TimeframePeriod: (60 * 24),
            TimeframeOverall: (60 * 24 * 7),
            TimeframeHeaders: [
                'MMM',
                'Do'
            ],
            Classes: 'period-1week'
        },
        {
            Name: '1 month',
            Label: '1 Bulan',
            TimeframePeriod: (60 * 24 * 1),
            TimeframeOverall: (60 * 24 * 28),
            TimeframeHeaders: [
                'MMM',
                'Do'
            ],
            Classes: 'period-1month'
        }
    ],

    Items: [
        {
            id: 20,
            name: '<div>Item 1</div><div>Sub Info</div>',
            sectionID: 1,
            start: moment(today).add( 1, 'hours'),
            end: moment(today).add(3, 'hours'),
            classes: 'item-status-three',
            groupID: 1,
            step: 1,
        },
        {
            id: 21,
            name: '<div>Item 2</div><div>Sub Info</div>',
            sectionID: 3,
            start: moment(today).add(-3, 'hours'),
            end: moment(today).add(1, 'days').add(3, 'hours'),
            classes: 'item-status-one',
            groupID: 2,
            step: 1,
        },
        {
            id: 22,
            name: '<div>Item 4</div><div>Sub Info</div>',
            start: moment(today).add(7, 'hours'),
            end: moment(today).add( 9, 'hours'),
            sectionID: 2,
            classes: 'item-status-three',
            groupID: 1,
            step: 3,
        },
        {
            id: 23,
            name: '<div>Item 74</div><div>Sub Info</div>',
            start: moment(today).add(10, 'hours'),
            end: moment(today).add( 16, 'hours'),
            sectionID: 2,
            classes: 'item-status-three',
            groupID: 1,
            step: 4,
        },
        {
            id: 24,
            name: '<div>Item 3</div><div>Sub Info</div>',
            start: moment(today).add(3, 'hours'),
            end: moment(today).add( 7, 'hours'),
            sectionID: 2,
            classes: 'item-status-three',
            groupID: 1,
            step: 2,
        }
    ],

    Sections: [
        {
            id: 1,
            name: 'CETAK',
            last_date: null,
        },
        {
            id: 2,
            name: 'CETAK 2',
            last_date: null,
        },
        {
            id: 3,
            name: 'POND',
            last_date: null,
        }
    ],

    Groups: [
        {
            id: 1,
            name: 'group1',
            last_date: null,
        },
        {
            id: 2,
            name: 'group2',
            last_date: null,
        },
        {
            id: 3,
            name: 'group3',
            last_date: null,
        }
    ],

    Init: function () {
        TimeScheduler.Options.GetSections = Calendar.GetSections;
        TimeScheduler.Options.GetSchedule = Calendar.GetSchedule;
        TimeScheduler.Options.Start = today;
        TimeScheduler.Options.Periods = Calendar.Periods;
        TimeScheduler.Options.SelectedPeriod = '1 days';
        TimeScheduler.Options.Element = $('.calendar');

        TimeScheduler.Options.AllowDragging = false;
        TimeScheduler.Options.AllowResizing = false;

        TimeScheduler.Options.Events.ItemMouseEnter = Calendar.Item_Enter;
        TimeScheduler.Options.Events.ItemMouseLeave = Calendar.Item_Leave;
        TimeScheduler.Options.Events.ItemClicked = Calendar.Item_Clicked;
        TimeScheduler.Options.Events.ItemDropped = Calendar.Item_Dragged;
        TimeScheduler.Options.Events.ItemResized = Calendar.Item_Resized;

        TimeScheduler.Options.Events.ItemMovement = Calendar.Item_Movement;
        TimeScheduler.Options.Events.ItemMovementStart = Calendar.Item_MovementStart;
        TimeScheduler.Options.Events.ItemMovementEnd = Calendar.Item_MovementEnd;

        TimeScheduler.Options.Text.NextButton = '&nbsp;';
        TimeScheduler.Options.Text.PrevButton = '&nbsp;';

        TimeScheduler.Options.MaxHeight = 100;

        TimeScheduler.Init();
    },

    GetSections: function (callback) {
        callback(Calendar.Sections);
    },

    GetSchedule: function (callback, start, end) {
        callback(Calendar.Items);
    },

    Item_Clicked: function (item) {
        $('.time-sch-item').removeClass('clicked');
        $(".group-"+item.groupID).addClass('clicked');
    },

    Item_Dragged: function (item, sectionID, start, end) {
        var foundItem;

        console.log(item);
        console.log(sectionID);
        console.log(start);
        console.log(end);

        for (var i = 0; i < Calendar.Items.length; i++) {
            foundItem = Calendar.Items[i];

            if (foundItem.id === item.id) {
                foundItem.sectionID = sectionID;
                foundItem.start = start;
                foundItem.end = end;

                Calendar.Items[i] = foundItem;
            }
        }

        TimeScheduler.Init();
    },

    Item_Resized: function (item, start, end) {
        var foundItem;

        console.log(item);
        console.log(start);
        console.log(end);

        for (var i = 0; i < Calendar.Items.length; i++) {
            foundItem = Calendar.Items[i];

            if (foundItem.id === item.id) {
                foundItem.start = start;
                foundItem.end = end;

                Calendar.Items[i] = foundItem;
            }
        }

        TimeScheduler.Init();
    },

    Item_Movement: function (item, start, end) {
        var html;

        html =  '<div>';
        html += '   <div>';
        html += '       Start: ' + start.format('Do MMM YYYY HH:mm');
        html += '   </div>';
        html += '   <div>';
        html += '       End: ' + end.format('Do MMM YYYY HH:mm');
        html += '   </div>';
        html += '</div>';

        $('.realtime-info').empty().append(html);
    },

    Item_MovementStart: function () {
        $('.realtime-info').show();
    },

    Item_MovementEnd: function () {
        $('.realtime-info').hide();
    },

    Item_Enter: function (item) {
        $('.time-sch-item').css('opacity', 1);
        $('.time-sch-item').not(".group-"+item.groupID).css('opacity', 0.2);
        // console.log(item);
    },

    Item_Leave: function (item) {
        $(".time-sch-item").css('opacity', 1);
        // console.log(item);
    }
    
    
};

$(document).ready(Calendar.Init);