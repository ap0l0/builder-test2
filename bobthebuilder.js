
var layout = {
    checkForDups: function(){
         var ids = [];
        $(".options .AvailableToolbars li").each(function(){
            var thisID = $(this).attr("data-id");
            ids.push(thisID);
        });

        for (var i = 0; i < ids.length; i++){
            for (var j = i + 1 ; j < ids.length; j++) {
                if (ids[i]==ids[j]) { 
                    // got the duplicate element 
                    console.log("dup:",ids[i]);
                    $(".options li[data-id='" + ids[i] + "']:last-child").remove()
                } 
            } 
        }
    },
    ConfigAllSortables: function () {
    $(".AvailableToolbars").sortable({
        connectWith: ".VisibleToolbarList",
        forcePlaceholderSize: false,
        helper: function (e, li) {
            copyHelper = li.clone().insertAfter(li);
            return li.clone();
        },
        stop: function (e, ui) {
            //copyHelper && copyHelper.remove();
            console.log("fire here");
            window.setTimeout(function(){
                var $tar = $(e.target);
                //console.log("sort target", $tar);
                /*
                if($tar.parents(".droppableContainer").length){
                    console.log("in the right place")
                } else {
                    console.log("do not drop");
                    //console.log("removing")
                    $(ui.item[0]).remove();
                } 
                */
                layout.checkForDups();
            },200);  
        },
        sort: function(e, ui) {
            
            
        }
    });
    $(".VisibleToolbarList").sortable({
        connectWith: ".VisibleToolbarList",
        receive: function (e, ui) {
            
            var thisTitle = $(ui.item[0]).attr("data-id");
            //console.log(thisTitle, "at", e, ui)
            var $tar = $(e.target);
            var currentDate = new Date();
            var mod = currentDate.getTime();
            $(ui.item[0]).find(".ValueBox").val(thisTitle+"_"+mod)
 
           
            //The clones elements need to be setup as sortables, so reset sortable on everything
            layout.ConfigAllSortables();
        },
        sort: function(e, ui) {
            //Changing the sort on a single item can screw with the sort values for all of the items, so mark them all at updated
            $(ui.item[0]).parent().find("li").find(".Data_Modified").val("1");
            $(ui.item[0]).parent().find("li").addClass("ItemUpdated");
        }
    });

    $(".VisibleToolbarList").disableSelection();
    },
    buildOption: function(name, data){
        console.log(data)
        var stringy = '<li class="AvailableToolbar ui-sortable-handle list-group-item" data-id="' + name + '">'+
        '<div class="optionWrapper panel panel-default">'+
            '<div class="panel-display">'+
                '<span class="title"><i class="fa ' + data.icon + '"></i> '+name+'</span>'+
            '</div>'+
            '<div class="panel-heading">'+
            '<a href="#" class="btn btn-default btn-sm mover">'+
                '<i class="fa fa-arrows-v"></i>'+
            '</a>'+
            '<span class="title">'+name+'</span>'+
            '<div class="btn-group pull-right buttonRow">';

               var buttons = data.buttons;
               var appendy = "";
               for (var key in buttons) {
                    if (buttons.hasOwnProperty(key)) {
                        var thisButton = buttons[key];
                        console.log("button",thisButton);
                        if(thisButton["type"]=="select"){
                            appendy += '<select class="form-control">';
                            for(var q = 0; q<thisButton['options'].length; q++){
                                var thisVal =thisButton['options'][q];

                            appendy += '<option value="'+thisVal+'">' + thisVal +'</option>';
                            }
                            appendy+= '</select>';

                        } else {
                            appendy += '<button class="btn btn-sm btn-default ' + key + '">';
                            appendy += '<i class="fa ' + thisButton.icon + '"></i></button>'
                        }
                        
                    }
                }
                stringy += appendy;
               stringy +='<a href="javascript:;" class="btn btn-default removeItem btn-sm">'+
                    '<i class="fa fa-times text-danger"></i>'+
                '</a>'+
            '</div>'+
            '<input type="text" class="ValueBox form-control" value="section_">'+
            '</div>'+
            '<div class="panel-body">'+
                '<ul class="VisibleToolbarList">'+
                    '<li class="initial">Add content</li>'+
                '</ul>'+
                '<a class="ShowOnUse btn btn-default default-sm mover" style="display:none;">'+
                    '<i class="fa fa-arrows-v"></i>'+  
                '</a>'+
                '<a href="javascript:;" class="ShowOnUse btn btn-default btn-sm" style="display:none;">'+
                    '<i class="fa fa-times text-danger"></i>'+
                '</a>'+
            '</div>'+
        '</div>'+
        '</li>';
        //console.log(stringy)
        $(".options>ul").append(stringy)
    },
    getOptions: function(){
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                //console.log(key + " -> " + options[key]);
                var thisOpt = options[key];
                layout.buildOption(key, thisOpt);

            }
        }
        layout.ConfigAllSortables();
    }
}


layout.getOptions();
