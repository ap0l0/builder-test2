function nameReplace(str,replaceWhat,replaceTo){
    var newstr = str.replace(new RegExp(replaceWhat, 'g'),replaceTo);
    return newstr;
}
var layout = {
    buildNodeParent: $(".droppableContainer>article"),
    templateFunctions: {
        background: function(parent, buttonId, nodeId){
            $("#optionModal").attr("data-node", nodeId)
            $("#optionModal .modal-body").html(optionMarkup[buttonId]);
            var data = null;
            if($(parent).attr("data-options")){
                data  = $(parent).attr("data-options");
            }
            layout.populateOptions(buttonId, data);
            $("#optionModal").modal("show");
            
            //var temp = "https://picsum.photos/1200/800";
            //$(parent).css("background-image", "url('" + temp + "')");

        },
        colors: function(parent, buttonId, nodeId){
            $("#optionModal").attr("data-node", nodeId)
            $("#optionModal .modal-body").html(optionMarkup[buttonId]);
            $("#optionModal").modal("show");
           
        }
    },
    checkForDups: function(){
         var ids = [];
        $(".options .AvailableToolbars>section").each(function(){
            var thisID = $(this).attr("data-id");
            ids.push(thisID);
        });
        console.log("ids", ids)
        for (var i = 0; i < ids.length; i++){
            for (var j = i + 1 ; j < ids.length; j++) {
                if (ids[i]==ids[j]) { 
                    // got the duplicate element 
                    //console.log("dup:",ids[i], ".options .AvailableToolbars>li[data-id='" + ids[i] + "']");
                    var count = $(".options .AvailableToolbars>section[data-id='" + ids[i] + "']").size();
                    var loopCount = 1;
                    $(".options .AvailableToolbars>section[data-id='" + ids[i] + "']").each(function(){
                        //console.log($(this).text(), count, loopCount)
                        if(loopCount == count){
                            console.log("equal");
                            $(this).remove();
                        }
                        loopCount++;

                    });
                } 
            } 
        }
    },
    populateOptions: function(type, data){
        if(data!=null){
            if(optionPopulation[type]){
                optionPopulation[type](JSON.parse(data));
            }
        }
        console.log("populating options for", type, "with", data);
    },
    buttonBinding: function(){
        $(document).on("click", "a.removeItem", function(){
            var $sect = $(this).closest(".AvailableToolbar");
            $sect.remove();
        });
        $(document).on("click", ".buttonRow button", function(){
            var buttonId = $(this).attr("data-type");
            var $par = $(this).closest(".AvailableToolbar ");
            var nodeId = $par.attr("id")
            $("#optionModal").attr("data-type", buttonId);
            $("#optionModal .modal-title span").text(buttonId);
            
            if(layout.templateFunctions[buttonId]){
                layout.templateFunctions[buttonId]($par, buttonId, nodeId);
            } else {
                alert("no method " + buttonId)
            }
            
        });
        $(document).on("click", "button.saveJSON", function(){
            layout.updateJSON();
        });
        $(document).on("change", "select.colNum", function(){
            var num = $(this).val();
            var $sect = $(this).closest(".AvailableToolbar");
            var $tar = $sect.find(".columnWrapper");
            // find data in json? 
            // or create a new data obj to pass
            var dat = {
                type: "columns",
                id: $sect.attr("id")+"_sub",
                options: "{'num':" + num + "}",
                content: {
                    
                }
            }
            layout.buildSection(dat,$tar, true)
            //$tar.append("<div class='col-sm-12'>update to " + num + " columns</div>");

        });
        $(document).on("click", "button.saveModal", function(){
            var type = $(this).closest(".modal").attr("data-type");
            var node = $(this).closest(".modal").attr("data-node");
            console.log(type, node, "modal")
            if(templateActions[type]){
                templateActions[type](node, type)
            }
            //alert("save "+type)
        });
        

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
                //console.log("fire here");
                window.setTimeout(function(){
                    /*
                    var $tar = $(e.target);
                    console.log("target",$tar)
                    var currentDate = new Date();
                    var mod = currentDate.getTime();
                    var dataid  = $(ui.item[0]).attr("data-id");
                    var newName = dataid+"_"+mod;
                    */
                    
                    layout.checkForDups();
                },200);  
            },
            sort: function(e, ui) {
                
                
            }
        });
        $(".VisibleToolbarList").sortable({
            connectWith: ".VisibleToolbarList",
            handle: ".mover",
            receive: function (e, ui) {
                
                var thisTitle = $(ui.item[0]).attr("data-id");
                //console.log(thisTitle, "at", e, ui)
                var $tar = $(e.target);
                var currentDate = new Date();
                var mod = currentDate.getTime();
                
                
                var t = setTimeout(function(){
                    //console.log("updating "+mod + " at ",$(ui.item[0]));
                    $(ui.item[0]).attr("id",thisTitle+"_"+mod);
                }, 300)
               
                //The clones elements need to be setup as sortables, so reset sortable on everything
                layout.ConfigAllSortables();
            },
            sort: function(e, ui) {
                //Changing the sort on a single item can screw with the sort values for all of the items, so mark them all at updated
                $(ui.item[0]).parent().find("section").find(".Data_Modified").val("1");
                $(ui.item[0]).parent().find("section").addClass("ItemUpdated");
            }
        });

        $(".VisibleToolbarList").disableSelection();
    },
    buildSection: function(data, parent, edit){
        var type=data.type;
        var id = data.id;
        if(id==null){
            id= data.ViewID;
        }
        var show = true;
        if(data["Show"]!=null){
            show = data.Show;
        }
        var options = data.options;
        if(options==null){
            options = data.SectionOpts;
        }
        if(type=="global"){

        } else {
            //console.log(type, "show", show)
            if(show==true){
                
                if(typeof options == "string"){
                    if(options[options.length-1] =="\""){
                        
                        options  = options.substring(0, options.length-1)
                    }
                    
                    var opts = JSON.parse(options);
                } else {
                    var opts = options;
                    opts["background"] = data["Background"];
                }
                //console.log("options", options);
                var d = new Date();
                var timestamp = d.getTime();
                var sectionID = id + "_" + timestamp;

                var cssContent = data.CustomCSS;
                if(cssContent){
                    /*
                    var lines = cssContent.split("}");
                    console.log(id, lines)
                    var newCSScontent = "";
                    for(var j=0; j<lines.length; j++){
                        var linereplace = lines[j];
                        linereplace.replace(id, sectionID)
                        newCSScontent += "#" + sectionID + " " + linereplace + ";\n";
                    } 
                    */

                    var newCSScontent = nameReplace(cssContent, "#" + id, "#" + sectionID)
                    //cssContent.replace(/#`id`/g, "#" + sectionID);

                } else {
                    var newCSScontent = "";
                }
                //console.log(newCSScontent)
                var appendCSS = "<style id='" + sectionID + "_css'>" + newCSScontent + "</style>";
                var stringy = "<section class='section AvailableToolbar list-group-item' id='" + sectionID +"'' data-type='" + type + "'";
                var bgsrc = "";
                var bgPos = "";
                var bgAttach = "";
                var bgRepeat = "";
                if(opts["background-image"]){
                    bgsrc = opts["background-image"];
                    stringy +="style=\"";
                    stringy += options;
                    stringy += "\"";
                } else if (opts["background"]){
                    bgsrc = options.background.source;
                    //console.log(typeof bgsrc);
                    if(bgsrc != ""){
                        stringy = stringy.replace("AvailableToolbar", "AvailableToolbar background");
                    }
                    bgPos = options.background.position;
                    bgAttach = options.background.attachment;
                    bgRepeat = options.background.repeat;
                    bgSize = options.background.size;
                    bgColor = options.background.color;
                    bgText = options.background.text;
                    stringy +="style=\"";
                    stringy += "background-image:url('" + bgsrc + "');";
                    stringy += "background-position: " + bgPos + ";";
                    stringy += "background-attachment: " + bgAttach + ";";
                    stringy += "background-repeat: " + bgRepeat + ";";
                    stringy += "background-size: " + bgSize + ";";
                    if(bgColor!=""){
                        stringy+= "background-color:" + bgColor + ";"; 
                    }
                    if(bgText!=""){
                        stringy+= "color:" + bgText + ";"; 
                    }
                    stringy += "\"";
                } else {

                }
                //console.log("bg src",bgsrc)
                
                stringy +=">";
                stringy += appendCSS;
                stringy+="</section>";
                //console.log("data", data);
                $(parent).append(stringy);
                // make header
              
                layout.getEditHeader(sectionID, "section", data);
                //layout.insertEditBar(sectionID, "section", data);
                
            }
        }
    },
    buildContent: function(id, data){
        var content = data.content;
        var returnString ="";
        console.log(id, data);
        if(!content){
            if(data.CustomHero!=""){
                returnString+= buildingBlocks["html"](data.CustomHero);
            } 
            if(data.CustomHtml!=""){
                returnString+= buildingBlocks["html"](data.CustomHtml);
            }
            if(data.TabList.length>0){
                console.log("tabs!", data.TabList);
                returnString+= buildingBlocks["tabs"](data.TabList);
            }
            if(data.FooterLinksList.length>0){
                var footerLinks = data.FooterLinksList;
                var returnVal = "<div class='link-wrapper'>";
                for(var t=0; t<footerLinks.length; t++){
                    var thisOne = footerLinks[t];
                    var title = thisOne.title;
                    var tlink=  thisOne.link;
                    var target = thisOne.target;
                    returnVal += "<a  class='link' href='" + tlink +"' target='"  + target + "'>" + title + "</a>";
                }
                returnVal +="</div>";
                returnString+= buildingBlocks["footer"](returnVal);
            }

        } else {
            //console.log("here is content", content)
            for (var key in content) {
                if (content.hasOwnProperty(key)) {
                    var thisContent = content[key];  
                    console.log("fn buildContent:' ",key,"'", thisContent);
                    returnString+= buildingBlocks[key](thisContent);
                } 
            }     
        }
        
        return returnString;
    },
    insertEditBar: function(id, type, data){
        var stringy = '<div class="panel-heading">'+
            '<a href="#" class="btn btn-default btn-sm mover">'+
                '<i class="fa fa-arrows-v"></i>'+
            '</a><span class="title">'+ type + '</span>'+
            '<div class="btn-group pull-right buttonRow">'+
            '<button class="btn btn-sm btn-default colors" data-type="colors">'+
            '<i class="fa fa-paint-brush"></i>'+
            '</button>'+
            '<button class="btn btn-sm btn-default background" data-type="background">'+
            '<i class="fa fa-picture-o"></i></button>'+
            '<a href="javascript:;" class="btn btn-default removeItem btn-sm" data-external="true">'+
            '<i class="fa fa-times text-danger"></i></a></div>'+
            '<input type="text" class="ValueBox form-control" value="section_1565271675" onchange="LabelChanged(this);">'+
        '</div>';
        $("#"+id).prepend(stringy)
    },
    getEditHeader: function(id, type, data){
        if(edit==true){
            var stringy = '<div class="optionWrapper panel panel-default">'+
            '<div class="panel-heading">'+
                '<a href="#" class="btn btn-default btn-sm mover">'+
                    '<i class="fa fa-arrows-v"></i>'+
                '</a><span class="title">'+ type + '</span>'+
                '<div class="btn-group pull-right buttonRow">'+
                '<button class="btn btn-sm btn-default colors" data-type="colors">'+
                '<i class="fa fa-paint-brush"></i>'+
                '</button>'+
                '<button class="btn btn-sm btn-default background" data-type="background">'+
                '<i class="fa fa-picture-o"></i></button>'+
                '<a href="javascript:;" class="btn btn-default removeItem btn-sm" data-external="true">'+
                '<i class="fa fa-times text-danger"></i></a></div>'+
                '<input type="text" class="ValueBox form-control" value="section_1565271675" onchange="LabelChanged(this);">'+
            '</div><div class="panel-body section-content"><div class="container-custom"><div class="VisibleToolbarList ">';
            // get content recursively?
        } else {
            var stringy = '<div class="section-content"><div class="container-custom"><div class="content">';
        }

        if(data.HasHeading!=false){
           stringy += "<div class='title'><h2>" + data.LayoutTitle + "</h2></div>"; 
        }
        if(data.LayoutDescription!=""){
           stringy += "<div class='description'>" + data.LayoutDescription + "</div>"; 
        }

        stringy+= layout.buildContent(id, data);
        //stringy += '<br /><br /><Br />';
        stringy +='</div></div></div>';
        $("#"+id).append(stringy);
    },
    buildOption: function(name, data){
        // modularize the toolbar?

        var stringy = '<section class="AvailableToolbar ui-sortable-handle list-group-item" data-id="' + name + '">'+
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
                        //console.log("button",thisButton);
                        if(thisButton["type"]=="select"){
                            appendy += '<select class="form-control colNum">';
                            for(var q = 0; q<thisButton['options'].length; q++){
                                var thisVal =thisButton['options'][q];

                            appendy += '<option value="'+thisVal+'">' + thisVal +'</option>';
                            }
                            appendy+= '</select>';

                        } else {
                            appendy += '<button class="btn btn-sm btn-default ' + key + '" data-type="' + key+ '">';
                            appendy += '<i class="fa ' + thisButton.icon + '"></i></button>'
                        }
                        
                    }
                }
                stringy += appendy;
               stringy +='<a href="javascript:;" class="btn btn-default removeItem btn-sm">'+
                    '<i class="fa fa-times text-danger"></i>'+
                '</a>'+
            '</div>'+
            '<input type="text" class="ValueBox form-control" value="'+ name + '">'+
            '</div>'+
            '<div class="panel-body">';
                stringy+= data['content'];
                stringy +='<a class="ShowOnUse btn btn-default default-sm mover" style="display:none;">'+
                    '<i class="fa fa-arrows-v"></i>'+  
                '</a>'+
                '<a href="javascript:;" class="ShowOnUse btn btn-default btn-sm" style="display:none;">'+
                    '<i class="fa fa-times text-danger"></i>'+
                '</a>'+
            '</div>'+
        '</div>'+
        '</section>';
        //console.log(stringy)
        $(".options>ul").append(stringy)
    },
    getOptions: function(){
       // get options
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                //console.log(key + " -> " + options[key]);
                var thisOpt = options[key];
                layout.buildOption(key, thisOpt);

            }
        }
    },
    init: function(){
        if(edit==true){
            layout.getOptions();
            $("body").addClass("edit");
        } else {
            $(".options").hide();

        }
        
        layout.buttonBinding();
        layout.preloadLayout(sample);
        if(edit==true){
            layout.ConfigAllSortables();
        }
    },
    preloadLayout: function(dat){
        console.log("loading ",dat.sections);
        var sects = dat.sections;

        for (var i=0; i<sects.length; i++) {
           var thisSect = sects[i];
           layout.buildSection(thisSect, layout.buildNodeParent, false)
        }
        
    },
    updateJSON:function(){
        var $tar = $(".droppableContainer>.SaveDataContainer");
        var json = {};
        var d = new Date();
        json["updated"] = d.getTime();
        json["sections"] = [];
        $tar.find(">.AvailableToolbar").each(function(){
            var $node = $(this);

            var background = {
                source: $node.css("background-image"),
                size: $node.css("background-size"),
                position: $node.css("background-position"),
                repeat: $node.css("background-repeat"),
                attachment: $node.css("background-attachment"),
                color: $node.css("background-color"),
                text: $node.css("color"),
            };
            var thisSection = {
                id: $node.attr("id"),
                Background: background,
                type: $node.attr("data-type")

            };
            json["sections"].push(thisSection)
        });
        console.log("to save")
        console.log(json)
    }
}


layout.init();
