

var calenderDumies =[];

var custCalendar = {
    
    Init: function(){
        custCalendar.AddOrder();
        custCalendar.AddOrderCustom();
        custCalendar.TambahItemCustom();
    },

    TambahItemCustom : function(){
        
    },

    TambahItemCustomClicked : function(){
        startDateSplited = ($('#mulai-tgl').val()).split('/');
        endDateSplited = ($('#selesai-tgl').val()).split('/');
        item = {
            id: 25,
            name: '<div>'+$('#nama-order').val()+'</div><div>'+$('#customer').val()+'</div>',
            start: moment(startDateSplited[2]+'-'+startDateSplited[0]+'-'+startDateSplited[1]+'-'+$('#mulai-jam').val(), 'YYYY-MM-DD-h'),
            end: moment(endDateSplited[2]+'-'+endDateSplited[0]+'-'+endDateSplited[1]+'-'+$('#selesai-jam').val(), 'YYYY-MM-DD-h'),
            sectionID: $('#mesin').val(),
            classes: 'item-status-three',
            groupID: $('#no-nota').val(),
            step: $('#step').val(),
        };
        console.log(item);
        custCalendar.PushEvent(item);
        TimeScheduler.Init();
    },

    AddOrderCustom : function(){
        $(document.createElement('a'))
        .addClass('time-sch-time-button time-sch-time-button-addOrderCustom time-sch-button')
        .attr({
                href: '#',
                title: "TambahOrderCustom",
                'data-toggle': "modal",
                'data-target': "#exampleModal",
            })
        .click(custCalendar.AddOrderCustomClicked)
        .append("TambahOrderCustom")
        .insertBefore(".time-sch-time-button-addOrder");
    },

    AddOrder : function(){
        $(document.createElement('a'))
        .addClass('time-sch-time-button time-sch-time-button-addOrder time-sch-button')
        .attr({
                href: '#',
                title: "TambahOrder"
            })
        .click(custCalendar.AddOrderClicked)
        .append("TambahOrder")
        .insertBefore(".time-sch-time-button-goto");
    },

    AddOrderCustomClicked : function(){

    },

    AddOrderClicked : function(){

        item = {
            id: 25,
            name: '<div>Item 2</div><div>Sub Info</div>',
            start: moment(today).add(3, 'hours'),
            end: moment(today).add( 6, 'hours'),
            sectionID: 3,
            classes: 'item-status-three',
            groupID: 1,
            step: 2,
        };
        custCalendar.PushEvent(item);
        TimeScheduler.Init();
    },

    PushEvent : function(item){
        
        // const range1 = moment.range( item.start, item.end);
        // var range2 = moment.range(Calendar.Items[1].start, Calendar.Items[1].end);
        // console.log(range1.overlaps(range2, { adjacent: false }))
        
        custCalendar.PushNewItem(item);
        
        Calendar.Items = custCalendar.IsScheduleOverlaping(item);
        console.log(Calendar.Items);
        
    },

    IsScheduleOverlaping : function(itemz, idx = null, newOrder = null){
        var result = false;

        grups = Calendar.Groups;
        sections = Calendar.Sections;
        
        const section1 = itemz.sectionID;
        const dumm = _.cloneDeep(Calendar.Items);
        indxCount = (idx) ? idx+1 : 0;
        orderedCalendar = _.orderBy(dumm, ['groupID', 'step','start'], ['asc', 'asc', 'asc']);
        
        for (let index = 0; index < orderedCalendar.length; index++) {
            var item = null;
            // console.log(index);
            for (let index1 = 0; index1 < orderedCalendar.length; index1++) {
                if(index1 !== index){
                    
                    addTime = custCalendar.CountHoursDiff(orderedCalendar[index],orderedCalendar[index1]);
                    
                    const range1 = moment.range( orderedCalendar[index].start, orderedCalendar[index].end);
                    const range2 = moment.range( orderedCalendar[index1].start, orderedCalendar[index1].end);
                    
                    if (orderedCalendar[index].groupID == orderedCalendar[index1].groupID) {
                        if ( range1.overlaps(range2, { adjacent: false }) ) {

                            result = false;
                            var itemDump = orderedCalendar;

                            // console.log(moment(addTime).format('hours'));
                            // console.log(range1.diff('hours'));
                            // console.log(moment(itemDump[index].start).format("MMMM Do YYYY, h:mm:ss a"));
                            // console.log(moment(itemDump[index].end).format("MMMM Do YYYY, h:mm:ss a"));

                            orderedCalendar[index1].start = orderedCalendar[index1].start + addTime;
                            orderedCalendar[index1].end = orderedCalendar[index1].end + addTime;
                            // custCalendar.IsScheduleOverlaping(orderedCalendar[index], index);
                        // console.log(index1);
                        } else {
                        // console.log(index1);
                            result = true;

                        }
                    } else {
                        if ( range1.overlaps(range2, { adjacent: false }) && orderedCalendar[index].sectionID == orderedCalendar[index1].sectionID) {
                            
                            result = false;
                            var itemDump = orderedCalendar;

                            // console.log(moment(addTime).format('hours'));
                            // console.log(range1.diff('hours'));
                            // console.log(moment(itemDump[index].start).format("MMMM Do YYYY, h:mm:ss a"));
                            // console.log(moment(itemDump[index].end).format("MMMM Do YYYY, h:mm:ss a"));

                            orderedCalendar[index1].start = orderedCalendar[index1].start + addTime;
                            orderedCalendar[index1].end = orderedCalendar[index1].end + addTime;
                            // custCalendar.IsScheduleOverlaping(orderedCalendar[index], index);
                        // console.log(index1);
                        } else {
                        // console.log(index1);
                            result = true;

                        }
                    }

                }
            }

            
        }

        console.log(orderedCalendar);
        return orderedCalendar;
    },

    CountHoursDiff : function(item, item2) {
        var result = 0;
            if (item.start > item2.start) {
                result = moment.range(item.start,item.end) + moment.range(item2.start, item.start);
            } else if (item.start == item2.start) {
                result = moment.range(item.start,item.end);
            } else if(item2.start > item.start && item2.end < item.start){
                result = moment.range(item2.start,item.end);
            } else {
                result = moment.range(item2.start, item.end);
            }
        
        

        return result;
    },

    PushNewItem : function(item) {

        for (let index = 0; index < Calendar.Items.length; index++) {
            if (Calendar.Items[index].groupID == item.groupID && Calendar.Items[index].step >= item.step) {
                Calendar.Items[index].step = Calendar.Items[index].step + 1;
                
            }
        }
        
        Calendar.Items.push(item);
    }
}