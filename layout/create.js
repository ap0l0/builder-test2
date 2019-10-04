var cr = {
	data: null,
	wrapper: "",
	cssString: "",
	init: function(options){
		cr.data = options.data;
		if(options.wrapper){
			cr.wrapper = options.wrapper;
		}
		cr.build();
		cr.editMode();
	},
	build: function(){
		console.log(cr.data);
		var sects = cr.data.sections;
		for(var q=0; q<sects.length;q++){
			var thisSection = sects[q];
			var viewid = thisSection.ViewID;
			var SectionType = "";
			if(thisSection.SectionType){
			 SectionType = thisSection.SectionType;
			}

			var cssSnippet = thisSection.CustomCSS;
			if(cssSnippet!="" && typeof cssSnippet !="undefined"){
				cr.cssString += cssSnippet;
			}

			if(SectionType!=="global"){
				if(thisSection.Show == true || edit==true){
					var template = '<div class="container">'+
					'<div class="content-wrapper"><div class="content">'+
					'</div></div></div>';
					

					var $newSection = $(document.createElement("section"));
					$newSection.addClass("initial").attr("id", viewid);
					$newSection.attr("sectionguid", thisSection.SectionGUID)
					cr.baseStyles($newSection, thisSection);
					if(thisSection.CustomClasses){
						console.log("custom: ", thisSection.CustomClasses)
						$newSection.addClass(thisSection.CustomClasses)
					}
					$newSection.append(template);
					cr.headings($newSection, thisSection);
					cr.sectionOpts($newSection, thisSection);

					var layout = null;
					if(thisSection.Layout){
						layout = thisSection.Layout;
					}
					if(layout!=null) {
						console.log(viewid, ":", layout);

						var myArray = layout.split(",")
						console.log(myArray);
						for(var j=0; j<myArray.length;j++){
							var func = myArray[j];
							console.log("call function: ",myArray[j])
							if(cr.widgets[func]){
								cr.widgets[func]($newSection, thisSection)
							} else {
								console.log("cannot find function ",cr.widgets[func])
							}

						}
						//cr.widgets.hero($newSection, thisSection);
						//cr.widgets.customHTML($newSection, thisSection);
						//cr.widgets.buttonList($newSection, thisSection);
					} else {
						// put nothing there?
					}
					var isImageOnly = cr.backgroundOrForegroundImage($newSection, thisSection);

					$(cr.wrapper).append($newSection);
				}
			} else {
				// apply styles
				console.log(viewid, thisSection)
				cr.setGlobalOptions(thisSection.SectionOpts)
			}
		}

		$("#customCSS").html(cr.cssString)
	},
	headings: function(section, dataObj){
		if(dataObj.HasHeading == true){
			var LayoutTitle = dataObj.LayoutTitle;
			var LayoutDescription = dataObj.LayoutDescription;
			if(LayoutDescription!=""){
				var desc = "<div class='description'><p>" + LayoutDescription + "</p></div>";
				$(section).find(".content-wrapper").prepend(desc);
			}
			var title = "<div class='title'><h2>" + LayoutTitle + "</h2></div>";
			$(section).find(".content-wrapper").prepend(title);
		}
	},
	sectionOpts: function(section, dataObj){
		var opts = JSON.stringify(dataObj.SectionOpts, true, 4);
		if(opts!="{}"){
		//$(section).find(".content").append("<pre>" +  opts+ "</pre>");
		}
	},
	baseStyles: function(section, dataObj){
		var background = dataObj.Background;
		$(section).css("background-color", background.color);
		$(section).css("background-image", "url(" + background.source + ")");
		$(section).css("background-repeat", background.repeat);
		$(section).css("background-size", background.size);
		$(section).css("background-position", background.position);
		$(section).css("background-attachment", background.attachment);

		$(section).css("color", background.text)
		$(section).css("text-align", dataObj.Align)
	},
	backgroundOrForegroundImage: function(section, dataObj){
		var SectionOpts = dataObj.SectionOpts;
		var isImageOnly = false;
		if(SectionOpts["type"]){
			var type = SectionOpts["type"];
			if(type=="image"){
				console.log("destroy the contents!");
				var image = "<img src='" + dataObj.Background.source + "' />";
				$(section).html(image).addClass("fullImage");
				isImageOnly = true;
			} else {
				// content
			}
		}
		return isImageOnly;
	},
	widgets: {
		blank: function(){
			return '<div class="container"><div class="content-wrapper"><div class="title blank"><h2>Enter A Heading</h2></div><div class="description blank"><p>And a subtitle</p></div><div class="content"></div></div></div>';
		},
		new: function(section, dataObj){
			console.log("new section");
			var template = "<div class='container'><h2>New Section</h2><div class='row'>";
			//$(section).addClass("initial");
			template += "<div class='col-sm-4'><a href='#' class='sectionType' data-type='CustomHtml'><i class='fa fa-code'></i> Custom Html</a></div>";
			template += "<div class='col-sm-4'><a href='#' class='sectionType' data-type='banner'><i class='fa fa-picture-o'></i> Image Banner</a></div>";
			template += "<div class='col-sm-4'><a href='#' class='sectionType' data-type='iframe'><i class='fa fa-youtube'></i> Media</a></div>";
			template += "</div></div>";
			$(section).html(template);

		},
		folders: function(section, dataObj){
			$(section).find(".content").append("folder");
		},
		assets: function(section, dataObj){
			var template = "<div class='grid'><div class='row'></div></div>";
			var num = 37;
			$(section).find(".content").append(template);
			for(var k=13; k<num; k++){
				var src = "https://picsum.photos/id/"+k+"/400/200";
				var $divvy = $(document.createElement("div"));
				$divvy.addClass("col-sm-4");
				var $img = $(document.createElement("img"));
				$img.attr("src",src);
				$divvy.append($img);
				$(section).find(".grid .row").append($divvy)
			}
		},
		tabs:function(section, dataObj){
			var tabOpts = dataObj.tabs;
			console.log("tabs", tabOpts);
			var $wrap = $(section).find(".content");
			$wrap.append("<ul class='nav nav-tabs'></ul>");
			$wrap.append("<div class='tab-content'></div>");
			var index =0;
			for(var t=0; t<tabOpts.length; t++){
				var thisTab = tabOpts[t];
				var title = thisTab.title;
				var content = thisTab.content;
				var activeClass = "";
				
				if(index==0){
					activeClass == "active";
				}
				console.log("t",t, activeClass)
				var tab = "<li class='" + activeClass + "'><a href='#tab_" + t + "'>" + title+ "</a></li>";
				$wrap.find("ul").append(tab);

				var contentstring = "<div class='tab-pane " + activeClass + "' id='tab_" + t + "'>" + content + "</div>";
				$wrap.find(".tab-content").append(contentstring);
				index++;
			}

			$(section).find(".nav-tabs li:first-child").addClass("active")
			$(section).find(".tab-content .tab-pane:first-child").addClass("active")

		},
		hero:function(section, dataObj){
			var title = dataObj.LayoutTitle;
			$(section).addClass("hero default");
			$(section).find(".container").prepend("<h1>" + title + "</h1>");
			$(section).find(".container").prepend("<img src=" + FolderImage + " />");
		},
		CustomHtml: function(section, dataObj){
			if(dataObj.CustomHtml.blank){
				var content = "<strong>Enter Custom HTML</strong><br /><textarea class='form-control CustomHtml'>Enter your html</textarea>";
			} else {
				var content = dataObj.CustomHtml;
			}
			$(section).find(".content").append(content);
		},
		banner: function(section, dataObj){
			if(dataObj.banner.blank){
				var content = "Add Image +";
			} else {
				var content = "load the image";
			}
			$(section).find(".content").append(content);
		},
		iframe: function(section, dataObj){
			var iframeOpts = dataObj.iframe;
			if(iframeOpts.blank){
				$(section).find(".content").append("load iframe")
			} else {
				if(iframeOpts.embed){
					$(section).find(".content").append("<div class='embedded'>" + iframeOpts.embed + "</div>");
				} else {
					var $iframe = $(document.createElement("iframe"));
					$iframe.attr("src", iframeOpts.IframeSrc);
					$iframe.attr("frameborder", "0");
					$iframe.attr("height", iframeOpts.IframeHeight);
					$iframe.attr("width", iframeOpts.IframeWidth);
					//$iframe.width("100%")
					$(section).find(".content").append($iframe);
				}
			}
		},
		carousel: function(section, dataObj){

			var template = '<div class="swiper-container-wrapper">'+
			'<div class="swiper-container">'+
			'<div class="swiper-wrapper">'+
			'</div></div></div>';
			$(section).find(".content").append(template)
			var classes="swiper-slide swiper-slide-next";
			var carouselOpts = dataObj.carousel;
			var $wrap = $(section).find(".swiper-wrapper");
			var images = dataObj.ImageList;
			for(var p=0; p<images.length;p++){
				var img = images[p];
				var $item = $(document.createElement("div"));
				$item.addClass(classes);
				var src = "https://picsum.photos/id/" + img + "/700/500";
				$item.css("background-image", "url(" +src+ ")");
				$item.css("height", "200px")
				$wrap.append($item);
			}
			$(section).find(".swiper-container").append("<div class='swiper-button-next swiper-button-carousel-next swiper-carousel-next'></div>")
			$(section).find(".swiper-container").append("<div class='swiper-button-prev swiper-button-carousel-prev swiper-carousel-prev'></div>")
			$(section).find(".swiper-container").append("<div class='swiper-pagination-carousel swiper-pagination swiper-pagination-container swiper-pagination-clickable swiper-pagination-bullets'></div>")
			window.setTimeout(function(){

				var swiper = new Swiper('.swiper-container', {
                navigation: {
                    nextEl: '.swiper-button-carousel-next',
                    prevEl: '.swiper-button-carousel-prev',
                },
                slidesPerView: 3,
                pagination: {
                    el: '.swiper-pagination-carousel',
                    clickable: true,
                }
            });
			}, 400)
			//set up
		},
		ButtonList: function(section, dataObj){
			var template = '<div class="button-wrapper"></div>';
			$(section).find(".content").prepend(template);
			var $wrap = $(section).find(".button-wrapper");
			var buttons = dataObj.ButtonList;
			if(buttons){
				for(var b=0;b<buttons.length; b++){
					var thisButt = buttons[b];
					//console.log(thisButt);
					var $link = $(document.createElement("a"));
					$link.attr("href", thisButt.link);
					$link.addClass("btn btn-default");
					$link.attr("target", thisButt.target);
					$link.html(thisButt.title);
					$wrap.append($link);

				}
			}

		},
	},
	setGlobalOptions: function(globs){

		var name = (typeof globs["companyName"] === "undefined" ? "MyMediabox" : globs["companyName"]);
        
        $("#footerCompanyName").html(name);

        var origin = $("head title").html();
        if (origin.indexOf("|") > -1) {
            origin = origin.substring(origin.indexOf("|"), origin.length)
        }
        $("head title").html(name + " " + origin);

        //breadcrumbs
        if (globs["breadcrumbs"] == true || typeof globs["breadcrumbs"] === "undefined") {
            //console.log("remove nobread")
            $(".newbread").removeClass("hidden");
            $(".site-wrap").removeClass("nobread");
        } else {
            $(".newbread").addClass("hidden");
            $(".site-wrap").addClass("nobread");
        }
        // font
        //console.log("what is the custom font? it is '" + globs["customfont"] + "' actually");
        if (globs["customfont"] != "" && typeof globs["customfont"] !== "undefined") {
            var url= globs["customfont"];
            if (url.indexOf("href=") > -1) {
                url = url.substring(url.indexOf("href=") + 6, url.length);
                url = url.substring(0, url.indexOf('"'));
                //alert(url);
            }
            if($("#customfont").length){
                $("#customfont").attr("href", url);
            } else {
                var $link=$(document.createElement("link"));
                $link.attr("rel", "stylesheet");
                $link.attr("id", "customfont");
                $link.attr("href", url);
                $("head").prepend($link)
            }
            
            var name = globs["customfontname"];
            if (name.indexOf("font-family:") > -1) {
                var rule = name + "!important;";
            } else {
                var rule = "font-family: " + name + "!important;";
            }
            var stylecontent = "body .section-wrapper {" + rule + "}";
            if ($("#customfontdef").length) {
                $("#customfontdef").html(stylecontent);
            } else {
                var $style = $(document.createElement("style"));
                $style.attr("type", "text/css");
                $style.attr("id", "customfontdef");
                $style.html(stylecontent);
                $style.insertAfter($("#customfont"));
            }
            
        }
	},
	uuidv4:function() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	    return v.toString(16);
	  });
	},
	getTimeStamp: function(){
		var t = new Date();
		return t.getTime();
	},
	addAddButton: function(section){
		var $add = $(document.createElement("div"));
		$add.addClass("add");
		var $addButton = $(document.createElement("a"));
		$addButton.addClass("btn btn-default");
		$addButton.html("<i class='fa fa-plus'></i>");
		$add.append($addButton);
		$(section).append($add);
	},
	editMode: function(){
		if(edit==true){
			$(".layoutMapping section").each(function(){
				cr.addAddButton($(this));
			});
			$(document).on("click", ".sectionType", function(e){
				e.preventDefault();
				var whichType = $(this).attr("data-type");
				//alert("change type in array");
				var $sect = $(this).closest("section")
				var guid = $sect.attr("sectionguid");
				for(var k=0; k<data.sections.length; k++){
					if(data.sections[k].SectionGUID == guid){
						data.sections[k].Layout = whichType;
						
						console.log("loading", "cr.widget['" + whichType + "']");
						data.sections[k][whichType] = {
							"blank": true
						};
						var content = cr.widgets.blank();
						$sect.html(content);
						cr.addAddButton($sect);
						cr.widgets[whichType]($sect, data.sections[k]);
					}
				}
			});
			$(document).on("click", ".add a", function(){
				
				var $thisSection = $(this).closest("section");
				var prevGUID = $thisSection.attr("sectionguid");

				var index = 0;
				var newguid = cr.uuidv4();
				var item = {
					"SectionGUID": newguid,
					"ViewID": "new_" + cr.getTimeStamp(),
					"Show": true,
					"Align": "left",
				    "HasHeading": true,
				    "CustomClasses": "new",
				    "Layout": "new",
				    "LayoutTitle": "New Section",
				    "LayoutDescription": "",
				    "CustomCSS": "." + newguid + " {}",
				};

				var newSection = "<section sectionguid='" + item.SectionGUID + "'>New Section</section>";
				
				$(newSection).insertAfter($thisSection);
				var target = $(".layoutMapping section[sectionguid='" + item.SectionGUID + "']");
				//console.log("target", target)
				cr.widgets["new"](target, item);

				var sects = data.sections;
				for (var i = 0; i <sects.length; i++) {
					var thisRow = sects[i];
					var guid = thisRow.SectionGUID;
					//console.log(guid);
					if(guid == prevGUID){
						index = i;
					}
				}
				data.sections.splice(index, 0, item);

				console.log(data);
			});
		}
	}
}