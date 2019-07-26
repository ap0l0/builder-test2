function checkWidth(){

}
function checkForDups(){
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
}
var matchCount = 0;
function ConfigAllSortables() {
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
                checkForDups();
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
            ConfigAllSortables();
        },
        sort: function(e, ui) {
            //Changing the sort on a single item can screw with the sort values for all of the items, so mark them all at updated
            $(ui.item[0]).parent().find("li").find(".Data_Modified").val("1");
            $(ui.item[0]).parent().find("li").addClass("ItemUpdated");
        }
    });

    $(".VisibleToolbarList").disableSelection();
}
ConfigAllSortables();