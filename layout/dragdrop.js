var templates = {
  image: function(){
    var string = "<div class='template_image well'>"+
    "<i class='fa fa-picture-o'></i> Image"+
    "</div>";
    return string;
  },
  row: function(){
    var string = "<div class='template_html well droppable sortableWrapper'>"+
    "<i class='fa fa-th'></i> Row<div>...</div><div>,,,</div>"+
    "</div>";
    return string;
  },
  html: function(){
    var string = "<div class='template_html well'>"+
    "<i class='fa fa-code'></i> Html"+
    "</div>";
    return string;
  }
}


 function ConfigAllSortables() {
            $(".AvailableToolbars").sortable({
              helper: "clone",
                connectWith: ".VisibleToolbarList",
                forcePlaceholderSize: false,
                helper: function (e, li) {
                    copyHelper = li.clone().insertAfter(li);
                    return li.clone();
                },
                stop: function (e, li) {
                    //copyHelper && copyHelper.remove();
                    //$(ui.helper).clone(true).removeClass('box ui-draggable ui-draggable-dragging').addClass('box-clone').appendTo('body');
                    //$(this).sortable('cancel');
                }
            });
            $(".VisibleToolbarList").sortable({
                connectWith: ".VisibleToolbarList",
                receive: function (e, ui) {
                    var foldername = $(".mainbar .nav-tabs li.active").attr("secfilter");
                    var thisTitle = $(ui.item[0]).attr("id")
                    
                    var $cell = $(ui.item[0]).closest(".mainCell");
                    var mainMatch = false;
                    var matchCount = 0;
                    $cell.find("ul[foldername='" + foldername + "']").find(".Data_ID").each(function () {
                        console.log("val: " + $(this).val() + " (" + $(this).parent().find(".ValueBox").val() + ")  vs " + thisTitle);
                        if (thisTitle == $(this).val()) {
                            mainMatch = true;
                            matchCount++;
                        }
                    });

                    console.log("matchcount " + matchCount)
                    if (matchCount==1) {

                        $(ui.item[0]).removeClass("AvailableToolbar");
                        copyHelper = null;

                        var $node = $(ui.item[0]);

                        $("ul[foldername='" + foldername + "']").each(function () {

                            var $georgeCloney = $node.clone();
                            var title = $georgeCloney.find(".Data_ID").val();
                            // check if it already existst
                            //alert(title);
                            var match = false;
                            $(this).find(".Data_ID").each(function () {
                                
                                if ($(this).val() == title) {
                                    match = true;
                                }
                            });
                            if (match == false) {
                              $(this).append($georgeCloney);
                            } else {
                                //alert("already exists")
                            }
                        });
                    } else {
                        //$(ui.item[0]).remove();
                        //alert("already exists");

                    }
                    //The clones elements need to be setup as sortables, so reset sortable on everything
                    ConfigAllSortables();
                },
                sort: function(e, ui) {
                    //Changing the sort on a single item can screw with the sort values for all of the items, so mark them all at updated
                    $(ui.item[0]).parent().find("li").find(".Data_Modified").val("1");
                    $(ui.item[0]).parent().find("li").addClass("ItemUpdated");
                }
            });
        }


$( function() {

  ConfigAllSortables();
    /*
    $( ".draggable" ).draggable({
      containment: "document",
      helper: "clone",
    });

    $( ".sortableWrapper" ).sortable({
      placeholder: "ui-state-highlight",
    });
    $( ".droppable" ).droppable({
      drop: function( event, ui ) {
        console.log(event, ui);
        var id = $(ui.draggable).attr("id");
        console.log("dropped " + id);
        // $(this) is the droppable 
        if($(this).find(".initial").length){
          $(this).find(".initial").hide();
        }

        if(templates[id]){
        $( this ).addClass( "ui-state-highlight" )
        .append(templates[id]());

          $( ".sortableWrapper" ).sortable({
          placeholder: "ui-state-highlight",
          });
        }

      }
    });
    */
  } );