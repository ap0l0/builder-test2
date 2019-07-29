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
	colors: 'background|text'
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
	colors: function(){}
}
var templates = {
	placeholder: "<ul class='VisibleToolbarList'><li class='initial'>Add Content</li></ul>",
	columns: '<div class="row columnWrapper" >'+
        '<div class="col-sm-6">'+
            '<ul class="VisibleToolbarList">'+
                '<li class="initial">Add content</li>'+
            '</ul>'+
        '</div>'+
        '<div class="col-sm-6">'+
            '<ul class="VisibleToolbarList">'+
                '<li class="initial">Add content</li>'+
            '</ul>'+   
        '</div>'+
    '</div>',
    html: "<textarea class='form-control htmlValue'></textarea>",
    heading: "<input type='text' class='headingValue form-control' />"

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
};


