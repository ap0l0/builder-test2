var optionMarkup = {
	background: '<div class=""><input type="text" class="form-control backgroundSource cssDropdown" rel="background-image" '+
	' value="https://picsum.photos/1200/800" /></div>'+
	'<div class="row">'+
	    '<div class="col-sm-6">'+
	        '<span class="labeltext">Background size</span>'+
	        '<select class="form-control cssDropdown" rel="background-size">'+
	            '<option value="contain">Stretch to Fit</option>'+
	            '<option value="cover">Stretch to Fill</option>'+
	            '<option value="inherit" selected="">Default</option>'+
	        '</select>'+
	    '</div>'+
	    '<div class="col-sm-6">'+
	        '<span class="labeltext">Background Repeat</span>'+
	        '<select class="form-control cssDropdown" rel="background-repeat">'+
	            '<option value="repeat" selected="">All</option>'+
	            '<option value="no-repeat">None</option>'+
	            '<option value="repeat-x">Horizontal</option>'+
	            '<option value="repeat-y">Vertical</option>'+
	        '</select>'+
	    '</div>'+
	    '<div class="col-sm-6">'+
	        '<span class="labeltext">Background Position</span>'+
	        '<select class="form-control cssDropdown" rel="background-position">'+
	            '<option value="top left">Top Left</option>'+
	            '<option value="top center">Top Center</option>'+
	            '<option value="top right">Top Right</option>'+
	            '<option value="center left">Center Left</option>'+
	            '<option value="center center">Center Center</option>'+
	            '<option value="center right">Center Right</option>'+
	            '<option value="bottom left">Bottom Left</option>'+
	            '<option value="bottom center">Bottom Center</option>'+
	            '<option value="bottom right">Bottom Right</option>'+
	        '</select>'+
	    '</div>'+
	    '<div class="col-sm-6">'+
	        '<span class="labeltext">Background Attachment</span>'+
	        '<select class="form-control cssDropdown" rel="background-attachment">'+
	            '<option value="fixed">Fixed</option>'+
	            '<option value="inherit" selected="">Default</option>'+
	        '</select>'+
	    '</div>'+
	'</div>',
	colors: '<div class="row"><div class="col-sm-6"><label>Background-color</label>' +
	'<input type="text" class="form-control cssDropdown bgColor" rel="background-color">' +
	'</div><div class="col-sm-6"><label>Text Color</label>'+
	'<input type="text" class="form-control cssDropdown color" rel="color" /></div></div>'
}
var optionPopulation=  {
	background: function(data){
		var $thisNode = $(".modal-body");
		for (var key in data) {
            if (data.hasOwnProperty(key)) {
            	var propVal = data[key];
            	$thisNode.find(".cssDropdown[rel='" + key + "']").val(propVal)
            }
        }
	},
}

var templateActions = {
	background: function(node,buttonId){
		console.log(node, buttonId);
		var $thisNode = $("#"+node);
		var source = $(".modal-body .backgroundSource").val();
		var size = $(".modal-body .cssDropdown[rel='background-size']").val();
		var repeat = $(".modal-body .cssDropdown[rel='background-repeat']").val();
		var position = $(".modal-body .cssDropdown[rel='background-position']").val();
		var attachment = $(".modal-body .cssDropdown[rel='background-attachment']").val();
		var opts = {
			"background-image": source,
			"background-size": size,
			"background-repeat": repeat,
			"background-position": position,
			"background-attachment": attachment,
		}
		
		for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
            	if(key == "background-image"){
				$thisNode.css("background-image", "url('" + opts[key] + "')");
            	} else{
            		$thisNode.css(key, opts[key]);
            	}
            }
        }
		$thisNode.attr("data-options", JSON.stringify(opts));
		$thisNode.addClass("background")
		console.log(opts);
		$("#optionModal").modal("hide");
	},
	colors: function(node, buttonId){
		var bgColor = $(".modal-body .bgColor").val();
		var color = $(".modal-body .color").val();
		var $thisNode = $("#"+node);
		var opts = {
			"background-color": bgColor,
			"color": color
		}
		for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
            	$thisNode.css(key, opts[key]);
            }
        }
        //var currentOpts = $thisNode.attr("data-options");
        //var editable = JSON.parse(currentOpts);

		//$thisNode.attr("data-options", JSON.stringify(opts));
		$("#optionModal").modal("hide");

	}
}
var templates = {
	placeholder: "<article class='VisibleToolbarList'><section class='initial'>Add Content</section></article>",
	columns: '<div class="row columnWrapper" >'+
        '<div class="col-sm-6">'+
            '<article class="VisibleToolbarList">'+
                '<section class="initial">Add content</section>'+
            '</article>'+
        '</div>'+
        '<div class="col-sm-6">'+
            '<article class="VisibleToolbarList">'+
                '<section class="initial">Add content</section>'+
            '</article>'+   
        '</div>'+
    '</div>',
    html: "<textarea class='form-control htmlValue'></textarea>",
    heading: "<input type='text' class='headingValue form-control' />",
    initial: "Add Content",
    section: ""

}

var buildingBlocks = {
	html: function(data) {
		//console.log("building html", data)
		return "<section class='html AvailableToolbar' data-type='html'>" + data + "</section>";
	},
	columns: function(data){
		console.log("building columns", data)
		var cols = data;
		var num = data.content.length;

		console.log("columns", num ,cols)
		var colString = "<section class='AvailableToolbar columns' data-type='columns'><div class='row columns'>";
		var className = "col-sm-6";
		switch(num){
			case 1: className="col-sm-12"; break;
			case 2: className="col-sm-6"; break;
			case 3: className="col-sm-4"; break;
			case 4: className="col-sm-3"; break;
			default: className="col-sm-6"; break;
		}

		for(var i = 0; i<num; i++){

			
			var thisCol = data.content[i];


			colString += "<div class='" + className + "' id='column_" + data.content[i].id + "'>";
			//colString += "Column " + (i+1);
			
			if(thisCol["content"]){
				console.log("thisCol content", thisCol["content"]);
				var returnString ="<article class='VisibleToolbarList'>";
				for (var key in thisCol["content"]) {
		            if (thisCol["content"].hasOwnProperty(key)) {
		                var thisContent = thisCol["content"][key];  
		                //console.log(":' ",key,"'", thisCol["content"]);
		                returnString+= buildingBlocks[key](thisContent);
		            } 
		        } 
		        returnString += "</article>";
		        colString +=returnString;    

			}
			else {
				// blank
			}
			
			colString += "</div>";		
		}
		colString += "</div></section>";
		return colString;
	},
	heading: function(data){
		console.log("building heading");
		return "<section class='heading AvailableToolbar' data-type='heading'><h2>" + data + "</h2></section>";
	},
	initial: function(data){
		console.log("building initial section");
		return "<section class='initial AvailableToolbar' data-type='initial'>Add Content</section>";
	},
	section: function(data){
		console.log("building section");
		return "<section class='AvailableToolbar section' data-type='section'>Section</section>";
	},
	tabs: function(data){
		console.log("building tabs");
		
		return "<section class='AvailableToolbar tabs' data-type='tabs'>" + data + "</section>";
	}
}

var options = {
	"section": {
		"icon": "fa-th",
		"buttons": {
			"colors": {
				"type": "button",
				"icon":"fa-paint-brush",
			},
			"background": {
				"type": "button",
				"icon":"fa-picture-o",
			}
		},
		"content": templates.placeholder
	},
	"columns": {
		"icon": "fa-columns",
		"buttons": {
			"columnNum": {
				"type": "select",
				"icon":null,
				"options": [2,3,4],
				"alt": "Select Number of Columns"
			}
		},
		"content": templates.columns

	},
	"html": {
		"icon": "fa-code",
		"content": templates.html
	},
	"heading": {
		"icon": "fa-header",
		"content": templates.heading
	},
	"initial": {
		"icon": "fa-globe",
		"content": templates.initial
	}
};


