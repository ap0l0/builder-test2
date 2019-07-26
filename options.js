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
    html: "<textarea class='form-control'></textarea>",
    heading: "<input type='text' class='form-control' />"

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


