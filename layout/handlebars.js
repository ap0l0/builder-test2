/* templates for DAM Marketing */
/* @author: Corbin Rose
*/

 var allsections = [
           "hero",
           "custom_hero",
           "buttons",
           "custom_html",
           "carousel",
           "tabs",
           "assets",
           "social",
           "folders",
           "footer",
           "no_access"
        ];
        
var hb = {
    data: null,
    cssString: "",
    Images: null,
    Folders: null,
    NavLoaded: false,
    globalOption:null,
    initHandleBars: function () {
        hb.getData();
        hb.setupSections();
        hb.initSections();
        hb.hbBinding();
        hb.initOptions();
       
        hb.getNav();
        hb.checkNoAccess();
       
        hb.makeNav();
        hb.cleanup();
    },
    cleanup: function () {
        if (edit == false) {
            $("#data").remove();
            $(".page-container script").each(function () {
                if ($(this).attr("type") == "text/x-handlebars-template") {
                    var id = $(this).attr("id");
                    if (id.indexOf("option")>-1) {
                        $(this).remove();
                    }
                    
                }
            });
        }

        window.setTimeout(function () {
            $("*[data-toggle='popover']").popover();
        }, 1000)
    },
    initializeWidgets: function () {
        $(".layoutMapping section").each(function () {
            if ($(this).find("widget").length) {
 
                var id = $(this).closest("section").attr("id");
                var $parent = $(this).parent();
                var $widget = $(this).find("widget");
                var type = $widget.attr("type");
                $widget.wrap("<div class='widget' id='widget_"+type+"_"+id+"'></div>")
                
                if (type == "carousel") {
                    var size = $widget.attr("size");
                    var preview = $widget.attr("preview");
                    var slidesPerView = $widget.attr("slidesPerView");
                    var thumbsnum = $widget.attr("thumbsnum");
                    var ImageList = $widget.attr("ImageList").split(",");
                    var data = {
                        ViewID: "widget_"+type+"_"+id,
                        Show: true,
                        HasHeading: false,
                        ImageList: ImageList,
                        SectionOpts: {
                            show: true,
                            preview: preview,
                            size: size,
                            arrowColor: "#000",
                            thumbs: {
                                width: 200,
                                height: 150,
                                slidesPerView: slidesPerView,
                                thumbsnum: thumbsnum,
                                responsive: false
                            }
                        }
                    };

                    //console.log("widget data");
                    //console.log(data);

                    var template = $("#carousel_thumb_widget_preview").html();
                    var theTemplate = Handlebars.compile(template);
                    var theCompiledHtml = theTemplate(data);
                    $widget.parent().html(theCompiledHtml);
                    window.setTimeout(function () {
                        hb.sizeCarousel();
                        hb.setupCarousel();
                    }, 600)
                    

                } else {
                    //console.log("not set up yet")
                }
            }
        });
    },
    getCSSLevels: function (selector) {
        var id = selector;
        var $actual = $("section#" + id);
        var $textarea = $("aside[rel='" +id + "']").find(".cssStructure");
        stringy = "<ul>";
        stringy = "<li><span>#" + id + "</span> {  }<i class='fa fa-plus'></i></li>";
        stringy += "<li><span>#" + id + " .container </span> {  }<i class='fa fa-plus'></i></li>";
        stringy += "<li><span>&nbsp;&nbsp;#" + id + " .title </span> {  }  <i class='fa fa-plus'></i></li>";
        stringy += "<li><span>&nbsp;&nbsp;&nbsp;&nbsp;#" + id + " .title h2 </span> {  }  <i class='fa fa-plus'></i></li>";
        stringy += "<li><span>&nbsp;&nbsp;#" + id + " .description  </span> {  }<i class='fa fa-plus'></i></li>";
        stringy += "<li><span>&nbsp;&nbsp;#" + id + " .content </span> {  }<i class='fa fa-plus'></i></li>";

        //console.log("section " + id)
        var struc = {};
        $actual.find(".content").children().each(function () {

            var tagname = $(this).prop("tagName").toLowerCase();
           
            var thisClass = $(this).attr("class").split(" ");
            if (struc[thisClass[0]]) {

            } else {
                struc[thisClass[0]] = [];
            }
                
                //console.log($(this).prop("tagName") + " classes " + $(this).attr("class"));
                stringy += "<li><span>&nbsp;&nbsp;&nbsp;&nbsp;#" + id + " ." + thisClass[0] + "</span> { }<i class='fa fa-plus'></i></li>";
                var repeatCount = 0;
                $(this).children().each(function () {
                    var thisnewTag = $(this).prop("tagName").toLowerCase();
                    var nthkid = "";
                    var extra = false;
                    if ($(this).attr("class")) {
                        var thisnewClass = $(this).attr("class").split(" ");
                        if (struc[thisClass[0]].includes(thisnewClass[0])) {
                            //already there
                            repeatCount++;
                            if (repeatCount == 1) {
                                extra = true;
                                //nthkid = thisnewClass[0] + ":first-child";
                            } else {
                                
                            }
                            nthkid = thisnewClass[0] + ":nth-child(" + (repeatCount+1) + ")";
                            
                            
                        } else {
                            struc[thisClass[0]].push(thisnewClass[0]);
                            nthkid = thisnewClass[0]
                        }
                        if (extra == true) {
                            stringy += "<li><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#" + id + " ." + thisClass[0] + " " + thisnewTag + "." + thisnewClass[0] + ":first-child</span> { }<i class='fa fa-plus'></i></li>";

                        }
                        stringy += "<li><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#" + id + " ." + thisClass[0] + " " + thisnewTag + "." + nthkid + "</span> { }<i class='fa fa-plus'></i></li>";
                        
                    }
                });
            

        });
        stringy += "</ul>";
        //console.log("-------")
        console.log("struc",struc)
        $textarea.html(stringy);
    },
    cssHelpers: function () {
        $(".cssStructure").each(function () {
            var id = $(this).attr("data-id");
            if(id!="" && typeof id !=="undefined"){
                hb.getCSSLevels(id);
            }
        });
    },
    sectionRename: function (id) {
        var newText = "";
        switch (id) {
            case "global":
                newText = "Global";
                break;
            case "hero":
                newText = "Default Header";
                break;
            case "custom_hero":
                newText = "Custom Header";
                break;
            case "buttons":
                newText = "Button Section";
                break;
            case "social":
                newText = "Embedded Content";
                break;
            case "custom_html":
                newText = "Custom HTML";
                break;
            case "carousel":
                newText = "Media Carousel";
                break;
            case "tabs":
                newText = "Tabbed Content";
                break;
            case "folders":
                newText = "List of Subfolders";
                break;
            case "assets":
                newText = "Grid of Media Assets";
                break;
            case "footer":
                newText = "Footer";
                break;
            case "no_access":
                newText = "'No Access' Page";
                break;
            default:
                newText = id;
                break;
        }
        return newText;
    },
    renameOptions: function () {
        $(".themer-options-wrapper aside").each(function () {
            var id = $(this).attr("rel");
            if (id == "" || typeof id == "undefined") {
                id = "global";
            }
            var newText = hb.sectionRename(id);
            //console.log(newText)
            $(this).find(".panel-heading>span").html(newText);
        });
    },
    checkNoAccess: function () {
        if ($("body").hasClass("noaccess")) {
            var loopsies = hb.data.sections;
            var newData = {};
            for (var i = 0; i < loopsies.length; i++) {
                var id = loopsies[i].ViewID;

                if (id == "no_access") {
                    //console.log("no access:");
                    //console.log(loopsies[i])
                    if (loopsies[i].SectionOpts.hideHero) {
                        $("#hero").remove();
                    }
                }
            }
        }
       
    },
    getImageList: function (selector) {

        //set flag to wait for first ajax to complete
        if (hb.Images == null) {
            var path = $("#FolderPath").val();
            var area = $("#AreaToGetAssets").val();
            var imageURL = "https://picsum.photos/v2/list";
            $.ajax({
                url: imageURL,
                success: function (html) {
                    console.log(html);
                 
                    hb.Images = html
                    //console.log("Marketing Images: ");
                    //console.log(hb.Images);

                    hb.setupMedia('start');
                    //hb.PopulateImages(selector);
                },
                error: function () { }
            });
        } else {
            //console.log("already loaded")
            //.PopulateImages(selector);
            hb.setupMedia('start');
        }
    },
    getData: function () {
        hb.data = data;
    },
    getNav: function () {
        var ajaxurl = "getallmarketingfolders/";
        //console.log(ajaxurl);
    },
    setupCarousel: function(){
        var url = ""
        $("section").each(function () { 
            var $node = $(this);
            if ($node.find(".swiper-wrapper").length) {

                var nodeID = $node.attr("id");
                //console.log("setting up carousel for "+nodeID)
                var $swiper = $node.find(".swiper-wrapper");


                var thisType = "thumb";
                if ($node.attr("id") == "carousel") {
                    thisType = ($("#carousel").hasClass("carousel-full") ? "full" : "thumb");
                } else {
                    thisType = "thumb";
                }

                if ($(this).find(".widget").length) {
                   // console.log("loading widget")
                }
                var counter = 0;
                if (thisType == "full") {
                    if (edit == true) {
                        var wid = $(window).width() - $(".theme-option-float").outerWidth();
                        $("#carousel").width(wid);
                    } else {
                        $("#carousel").width("auto");
                    }
                    //console.log("setting up full");
                    url = "https://via.placeholder.com/350x150";
                    var swiper = new Swiper('.swiper-container', {
                        navigation: {
                            nextEl: '.swiper-button-carousel-next',
                            prevEl: '.swiper-button-carousel-prev',
                        },
                        slidesPerView: 1,
                        pagination: {
                            el: '.swiper-pagination-carousel',
                            clickable: true,
                        }
                    });
                } else {
                    if (edit == true) {
                        var wid = $(window).width() - $(".theme-option-float").outerWidth() - 100;
                        $("#carousel .container").width(wid)
                    }
                    
                    if ($(this).attr("id") == "carousel") {
                        var carousel_slidesperview = $("#carousel_slidesperview").val();
                        var carousel_thumbsnum = $("#carousel_thumbsnum").val();
                        var carousel_responsive = $("#carousel_responsive").val();
                    } else {
                        var carousel_slidesperview = $(this).find(".carousel_slidesperview").val();
                        var carousel_thumbsnum = $(this).find(".carousel_thumbsnum").val();
                        var carousel_responsive = $(this).find(".carousel_responsive").val();
                    } 
                
                    var slides = "auto";
                    if (carousel_slidesperview != "auto") {
                        slides = carousel_thumbsnum;
                    }

                    url = "https://via.placeholder.com/215x350";
                    var carouselOpts = {
                        navigation: {
                            nextEl: '.swiper-button-carousel-next',
                            prevEl: '.swiper-button-carousel-prev',
                        },
                        slidesPerView: slides,
                        spaceBetween: 30,
                        centerInsufficientSlides: true,
                        pagination: {
                            el: '.swiper-pagination-carousel',
                            clickable: true,
                        }
                    }
                    if (carousel_responsive) {
                        if (slides != "auto") {
                        
                            if (slides >= 5) {
                                var breakpoint = {
                                    1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 40,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 30,
                                    },
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 20,
                                    },
                                    320: {
                                        slidesPerView: 1,
                                        spaceBetween: 10,
                                    }
                                }
                            } else {
                                var breakpoint = {};
                                for (var i = 0; i < slides; i++) {
                                    //console.log(i + " means");
                                    var point = 0;
                                    var space = 10;
                                    switch (i) {
                                        case 0:
                                            point = 320;
                                            break
                                        case 1:
                                            point = 640;
                                            break;
                                        case 2:
                                            point = 768;
                                            break;
                                        case 3:
                                            point = 1024;
                                            break;
                                        case 4:
                                            point = 0;
                                            break;
                                        case 5:
                                            point = 0;
                                            break;
                                        default:
                                            point = 0;
                                            break;
                                    }
                                    if (point != 0) {
                                        breakpoint[point] = {
                                            slidesPerView: i+1,
                                            spaceBetween:space
                                        };
                                    }
                               
                                }
                            }
                        carouselOpts["breakpoints"] = breakpoint;
                        }
                    }

                    //console.log("carousel options");
                    //console.log(carouselOpts)
                    var swiperCarousel = new Swiper('.swiper-container', carouselOpts);

               
            }
            //$swiper.find(".swiper-slide").each(function () {
            //    var text = $(this).attr("data-mediaid");
            //    //$(this).css("background-image", "url('" + url + "?text=" + text + "')");
            //});
            // get the real images, and then load the first one
            window.setTimeout(function () {
                hb.PopulateImages("carousel");
            }, 200);
        }

        if ($node.find(".carousel-with-preview-wrapper").length) {
            var $wrap = $(".carousel-with-preview-wrapper");
            var $target = $(".preview-media-wrapper figure");
            var $first = $wrap.find(".swiper-wrapper .swiper-slide:first-child");
            // change to the image load function callback
        }

        })
    },
    setupAssets: function () {
        var $node = $("#assets");
        if ($node.find(".grid").length) {
            //console.log("assets");
            window.setTimeout(function () {
                hb.PopulateImages("assets");
            }, 200);

        }
    },
    populateFolders: function () {
        
        var object = hb.Folders;
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                // Do things here
                //console.log(object[property]);

            }
        }

        var template = $("#folder_template").html();
        var theTemplate = Handlebars.compile(template);
        // Define our data object

        var loopsies = hb.data.sections;
        var newData = {};
        for (var i = 0; i < loopsies.length; i++) {
            var id = loopsies[i].ViewID;
           
            if (id == "folders") {
                //console.log("get folders");
                //console.log(loopsies[i]);
                if (edit == true) {
                    newData = hb.updateDataForSection("folders", loopsies[i]);
                } else {
                    newData = loopsies[i];
                }
                newData.FolderList = object;
            }
        }

        //console.log(newData)
        // Pass our data to the template
        var theCompiledHtml = theTemplate(newData);
        //console.log("loading folders");
        //console.log(theCompiledHtml)
        // Add the compiled html to the page
        $('#folders').replaceWith(theCompiledHtml);

        // add button back
        if (edit == true) {
            $("#folders").append('<a href="javascript:;" class="toggleOpts btn btn-info" data-rel="folders"><i class="fa fa-gear"></i></a>');
        }

    },
    setupFolders: function () {
        var ajaxurl = 'Marketing/Site/GetUserMarketingFolders/';
        if (hb.Folders == null) {
            $.ajax({
                url: ROOT + ajaxurl,
                type: "get",
                success: function (result) {
                    //console.log(result);
                    hb.Folders = {};
                    for (var j = 0; j < result.length; j++) {
                        var item = result[j];
                        if (item.Status == 0) {
                            hb.Folders[item.FolderID] = {
                                id: item.FolderID,
                                description: item.ShortDescription,
                                security: item.SecurityPointID,
                                title: item.Title,
                                path: item.Path,
                                FolderImage: item.ImageDisplayName,
                            };
                        }
                    }
                    hb.populateFolders();
                    //console.log(hb.Folders)
                }
            });
        } else {
            //console.log(hb.Folders);
            hb.populateFolders();
        }

    },
    setupMedia: function(type) {
        //alert("type", type);
        //console.log("type: " + type)
        switch (type) {
            case "assets":
                hb.setupAssets();
                break;
            case "carousel":
                hb.sizeCarousel();
                hb.setupCarousel();
                break;
            case "folders":
                if (isMedia == true) {
                    hb.setupFolders();
                }
                break;
            default:
            console.log("setting up")
                //alert("setting up ALL");
                $("section").each(function () {
                    // look for media unset
                    var rel = $(this).attr("id");
                    switch (rel) {
                        case "assets":
                            hb.setupAssets();
                            break;
                        case "carousel":
                            hb.sizeCarousel();
                            hb.setupCarousel();
                            break;
                        case "folders":
                            if (isMedia == true) {
                                hb.setupFolders();
                            }
                            break;
                        default:

                            break;
                    }
                });
                break;
        }
       
    },
    setupSections: function () {
        var templates = ['default'];
        var l = hb.data.sections.length;
        for (var i = 0; i < l; i++)
            templates.push(hb.data.sections[i].ViewID);

        console.log(templates);

        function dynamictemplate(template, context, opts) {
            template = template.replace(/\//g, '_');

            var f = Handlebars.partials[template];
            //console.log(template);
            //console.log(context)

            if (!f) {
                return "Partial not loaded";

            } else {
                //console.log(new Handlebars.SafeString(f(context)));
                return new Handlebars.SafeString(f(context));
            }

        }

        Handlebars.registerHelper("inc", function (value, options) {
            return parseInt(value) + 1;
        });

        Handlebars.registerHelper("select", function (value, options) {
            return options.fn(this)
              .split('\n')
              .map(function (v) {
                  var t = 'value="' + value + '"'
                  return !RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
              })
              .join('\n')
        })

        Handlebars.registerHelper('dynamictemplate', dynamictemplate);

        Handlebars.registerHelper('showSectionPartial', function (viewid, context) {
            var loadedPartial = Handlebars.handlebars.partials[viewid];
            return new Handlebars.handlebars.SafeString(loadedPartial(context));
        });

        Handlebars.registerHelper('dynamicPartial', function (name, thisdata) {
            var partial = Handlebars.partials[name];
            var template = Handlebars.compile(partial);
            var output = template({ "data": thisdata });
            return new Handlebars.SafeString(output);
        });

        Handlebars.registerHelper('toLowerCase', function (str) {
            //console.log(str.toLowerCase(), typeof str.toLowerCase());
            return new Handlebars.SafeString(str.toLowerCase());
        });

        Handlebars.registerHelper('with', function (context, options) {
            return options.fn(context);
        });
        
        hb.registerPartials();
    },
    registerPartials: function () {
        Handlebars.registerPartial(
            'coolPartial',
            $("#coolPartial").html()
        );

        Handlebars.registerPartial(
            'defaultComingSoon',
            '<strong>{{ViewID}}</strong> is coming soon'
        );

        Handlebars.registerPartial(
            'custom_hero',
            '<div class="custom_hero">{{{CustomHero}}}</div>'
        );
        Handlebars.registerPartial(
            'custom_html',
            '<div class="custom_html">{{{CustomHtml}}}</div>'
        );
        Handlebars.registerPartial(
            'swiperslide',
            $("#swiper_slide_partial").html()
        );
        Handlebars.registerPartial(
            'social',
            '<div class="social"><iframe src="{{SectionOpts.IframeSrc}}" width="100%" frameborder="0" height="{{SectionOpts.IframeHeight}}"></iframe></div>'
        );
        Handlebars.registerPartial(
            'footer_links',
            '<a class="footer-link" href="{{link}}" target="{{target}}">{{{title}}}</a>'
        );
        Handlebars.registerPartial(
            'asset_grid',
            '<div class="col-sm-4 col-md-3"><a class="openupdetails" href="#" data-mediaid="{{this}}"><i class="fa fa-spinner fa-spin"></i></a></div>'
            );
        Handlebars.registerPartial(
           'asset_grid_all',
            $("#assets_all_grid_partial_template").html()
           );
        Handlebars.registerPartial(
            'button_list',
            '<a class="btn btn-default" href="{{link}}" target="{{target}}">{{title}}</a>'
        );
        Handlebars.registerPartial(
            'tab_list_tabs',

            '<li class="{{#if active}}active{{else}}{{/if}}"><a href="#{{@index}}-tab">{{title}}</a></li>'
        );
        Handlebars.registerPartial(
            'tab_list_content',
            '<div class="tab-pane {{#if active}}active{{else}}{{/if}}" id="{{@index}}-tab">{{{content}}}</div>'
        );
        Handlebars.registerPartial(
            'options_custom',
            $("#options_custom").html()
        );
        Handlebars.registerPartial(
           'no_access_options',
           $("#no_access_options").html()
        );
        Handlebars.registerPartial(
            'custom_hero_options',
            $("#custom_hero_options").html()
        );
        Handlebars.registerPartial(
           'buttons_options',
           $("#buttons_options").html()
        );
        Handlebars.registerPartial(
           'footer_options',
           $("#footer_options").html()
        );
        Handlebars.registerPartial(
           'custom_html_options',
           $("#custom_html_options").html()
        );
        Handlebars.registerPartial(
           'carousel_options',
           $("#carousel_options").html()
        );
        Handlebars.registerPartial(
           'tabs_options',
           $("#tabs_options").html()
        );
        Handlebars.registerPartial(
              'assets_options',
              $("#assets_options").html()
        );
        Handlebars.registerPartial(
             'folder_options',
             $("#folder_options").html()
        );
        Handlebars.registerPartial(
              'social_options',
              $("#social_options").html()
         );
        Handlebars.registerPartial(
             'button_option_partial_template',
             $("#button_option_partial_template").html()
        );
        Handlebars.registerPartial(
             'footer_option_partial_template',
             $("#footer_option_partial_template").html()
        );
        Handlebars.registerPartial(
            'tab_option_partial_template',
            $("#tab_option_partial_template").html()
        );
       
    },
    loadTemplate: function (template, tempData) {

        //console.log("temp data for loading");
        //console.log(tempData);
        var viewid = tempData.ViewID;
        
        if(template){
            var theTemplate = Handlebars.compile(template);
            // Define our data object
            var context = tempData;
            // Pass our data to the template
            var theCompiledHtml = theTemplate(context);
            // Add the compiled html to the page
            if ($(".body").hasClass("edit")) {
                if (viewid == "no_access") {
                    $('.section-wrapper').append(theCompiledHtml);
                } else {
                    $('.content-placeholder').append(theCompiledHtml);
                }
                
            } else {
                if (edit == true) {
                    if (viewid == "no_access") {
                        $('.section-wrapper').append(theCompiledHtml);
                    } else {
                        $('.content-placeholder').append(theCompiledHtml);
                    }
                } else {
                    if (tempData.Show == true) {

                        if (viewid == "no_access") {
                            //$('.section-wrapper').append(theCompiledHtml);
                        } else {
                            $('.content-placeholder').append(theCompiledHtml);
                        }
                    }
                }
                
            }
        }
        
    },
    loadHeaderFooter: function (template, currentData, type) {
        var thisScript = template;
        var thisTemplate = Handlebars.compile(thisScript);

        var theCompiledNode = thisTemplate(currentData);
        if (type == "header") {
            $('#header-wrapper').html(theCompiledNode);
        } else {
            if (edit == true) {
                $(theCompiledNode).insertBefore("#no_access");
            } else {
                $(".section-wrapper").append(theCompiledNode);
            }
            
        }
    },
    checkScrollLink: function (pos) {

        var adjusted = pos + 83;
        var allPos = new Array();
        $(".page-links a").each(function () {
            allPos.push($(this).attr("data-top"));
        });
        //remove all active links
        
        $("section").mouseenter(function () {
            var id = $(this).attr('id');
            $(".page-links a").removeClass('active');
            $(".page-links a[href='#" + id + "']").addClass('active');
        });

        // old way of highlighting - might need this later

        //$.each(allPos, function (index, elem) {
        //    //console.log(elem + " :::: actual :::" + adjusted);
        //    var lower = new Array();
        //    if (adjusted <= elem) {
        //        // check the next one

        //        if (adjusted > allPos[index - 1]) {
        //            // 
        //        } else {
        //            var $winner = $(".page-links a[data-top='" + elem + "']");
        //            //console.log("Winner " + $winner.text());
        //            //$winner.addClass("active");
        //        }

        //    } else if (adjusted > elem) {
        //        // this means something

        //        if (adjusted < allPos[index + 1]) {
        //            // 
        //            var $winner = $(".page-links a[data-top='" + elem + "']");
        //            //console.log("Winner " + $winner.text());
        //            //$winner.addClass("active");
        //        }
        //    } else {

        //    }
        //});
    },
    makeNav: function () {
        $(".page-links").html("");
        $("section").each(function () {
            if ($(this).hasClass("hidden") || !$(this).is(":visible")) {
                // hey
            } else {
                //console.log($(this));
                var link = $(this).attr("id");
                var title = "undefined";
                if ($(this).attr("data-title")) {
                    title = $(this).attr("data-title");
                } else {
                    title = link;
                }

                var off = $("#" + link).offset();
                var offTop = off.top;
                if (title == "Hero") {
                    title = "Welcome";
                }
                
                //maybe search for title of section?
                if ($(this).find(".title h2").length) {
                    var newTitle = $(this).find(".title h2").html();
                } else {
                    var newTitle = hb.sectionRename(title);
                }
                
               

                if (title != "hide" && title != "col-left" && title != "footer" && title != "realFooter") {

                    var stringy = "<a href='#" + link + "' class='btn btn-default' data-top='" + offTop + "'><em></em><span>" + newTitle + "</span></a>";
                    $(".page-links").append(stringy);
                }
            }
        });

        $(".page-links a:first-child").addClass("active");

        $(document).on("click", ".page-links a", function (e) {
            e.preventDefault();
            var anchor = $(this).attr("href");
            var $target = $(anchor);
            var offsets = $target.offset();
            var top = offsets.top - 83;
            //$(document).scrollTop(top);

            var body = $("html, body");
            body.stop().animate({ scrollTop: top }, 500, 'swing', function () {
                //alert("Finished animating");
            });
            
            hb.checkScrollLink(top);
        });
    },
    setGlobalOptions: function (globs) {
        //console.log("setting globals ");
        //console.log(globs)

        //name
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
    updateDataForSection: function (selector, data) {
        var newData = data;
        var $options = $("aside[rel='" + selector + "']");
        newData.LayoutTitle = $options.find(".section-title").val();
        newData.LayoutDescription = $options.find(".section-description").val();
        newData.HasHeading = ($options.find(".section-showtitle").prop("checked") ? true : false);

        newData["Align"] = $options.find(".section-alignment").val();
        var Background = {
            source: $options.find(".background-selector li .form-control").attr("data-src"),
            size: $options.find(".section-size").val(),
            repeat: $options.find(".section-repeat").val(),
            position: $options.find(".section-position").val(),
            attachment: $options.find(".section-attach").val(),
            color: $options.find(".bgColor .form-control").val(),
            text: $options.find(".textColor .form-control").val(),
        }
        newData["Show"] = true;
        newData["Background"] = Background;

        //console.log(newData);
        return newData;

    },
    updateSectionPreview: function (selector, data, template) {

    },
    initSections: function () {
        var globalOpts = null;
        // if edit mode, loop through list of all sections
        if (edit == true && false) {
            var sects = allsections;
        } else {
            var sects = hb.data.sections;
        }
        var globalOptsSet = false;
        
        for (var i = 0; i < sects.length; i++) {
            let sect = sects[i];
            let viewID = "";
            viewID = sect.ViewID;
            
            console.log("loading ", viewID)
            if (sect.CustomCSS) {
                hb.cssString += sect.CustomCSS + "\n";
            }
            if (viewID != "global" && viewID!="") {


                switch (viewID) {
                    case "custom_hero":
                        var theTemplateScript = $("#custom_hero_template").html();
                        break;
                    case "custom_html":
                        var theTemplateScript = $("#custom_html_template").html();
                        break;
                    case "social":
                        var theTemplateScript = $("#social_template").html();
                        break;
                    case "assets":
                        if (sect.ImageList[0] == "all") {
                            var newList = "";
                        }
                        var theTemplateScript = $("#assets_template").html();
                        break;
                    case "buttons":
                        var theTemplateScript = $("#buttons_template").html();
                        break;
                    case "carousel":
                        var type = "";
                        var preview = false;
                        //console.log("sect:", sect)
                        if (sect.hasOwnProperty("SectionOpts")) {
                            //console.log("carousel:")
                            type = sect.SectionOpts.size;
                            preview = sect.SectionOpts.preview;
                        } else {
                            type = "thumb";
                            preview = false;
                        }

                        //console.log(sect);
                        if (type == "full") {
                            var theTemplateScript = $("#carousel_full_template").html();
                        } else {
                            if (preview == true) {
                                //console.log("preview enabled");
                                var theTemplateScript = $("#carousel_thumb_template_preview").html();
                            } else {
                                var theTemplateScript = $("#carousel_thumb_template").html();
                            }

                        }
                        break;
                    case "footer":
                        var theTemplateScript = $("#footer_template").html();
                        break;

                    case "folders":
                        var theTemplateScript = $("#folder_template").html();

                        break;
                    case "tabs":
                        var theTemplateScript = $("#tabs_template").html();
                        break;
                    case "no_access":
                        var theTemplateScript = $("#no_access_template").html();
                        break;
                    case "default_hero":
                    case "hero":
                        sect["FolderImage"] = FolderImage;
                        //sect["Show"] = true;
                        sect["LayoutTitle"] = $("#FolderTitle").val();
                        sect["props"] = {
                            //"Show": true,
                            "LayoutTitle": $("#FolderTitle").val()
                        };
                        //console.log("default hero ");


                        var theTemplateScript = $("#default-template").html();
                        break;
                    default:
                        var theTemplateScript = $("#blank-template").html();
                        break;
                }

                //if (viewID != "no_access") {
                    hb.loadTemplate(theTemplateScript, sect);
                //}


            } else {
                // it's the global
                if (globalOptsSet == false) {
                    //console.log("load globals");
                    var globs = sect["SectionOpts"];
                    globalOpts = globs;
                    globalOptsSet = true;
                }
            }
            

           
        }
        // get footer
        var today = new Date();
        var year = today.getFullYear();
        let contextFooter = {
            "name": "Company Name Here",
            "year": year
        };
        let footerTemp = $("#realFooter_template").html();
        hb.loadHeaderFooter(footerTemp, contextFooter, "footer");


        //hb.setupMedia();
        window.setTimeout(function () { hb.getImageList("start") }, 500);
        // append CSS
        //console.log("css string: " + hb.cssString)
        $("#customCSS").html(hb.cssString);

        //if ($(".site-wrap").attr("id") != "default") {
        //    var winHeight = $(window).height();
        //    $("section:not(#footer):not(#realFooter):not(#buttons):not(#assets):not(hero.default)").each(function () {
        //        $(this).outerHeight(winHeight);
        //    });
        //}
        

        hb.initializeWidgets();

        // get the first tab to show
        if ($("#tabs").length) {
            var $active = $("#tabs .nav-tabs li:first-child");
            $active.addClass("active");
            var id = $active.find("a").attr("href");
            //alert("opening " + id)
            $("#tabs "+id).addClass("active");
        }

        // set global options
        if (globalOpts == null) {
            globalOpts = defaultGlobalOpts;
        }
        hb.globalOption = globalOpts;
        hb.setGlobalOptions(globalOpts);
        
    },
    sizeCarousel: function() {
        $(".carousel-with-preview-wrapper").each(function () {
            var $sect = $(this).closest("aside");
            var h = $sect.height();
            var w = $(window).width();
            if (w < 768) {
                w -= 30;
                $(this).find(".swiper-container-wrapper").outerWidth(w).css("margin", "0");
            } else {
                if ($(this).parents(".widget").length) {
                    $(this).find(".swiper-container-wrapper").width("auto").css("margin", "0 -50px");
                } else {
                    $(this).find(".swiper-container-wrapper").width("auto").css("margin", "0 -50px");
                }
               
            }
            
        });
    },
    PopulateImages: function (selector) {
        //console.log("about to populate " + selector);
        //make this a switch?
    

        if (selector == "assets") {
            console.log("populate images assets",hb.Images);
            
            var tempObj = hb.Images;
            
           
            $(".grid a").each(function () {
                var mediaid = $(this).attr("data-mediaid");
                console.log(mediaid)
                if (mediaid != "all") {
                    if (tempObj[mediaid] || true) {
                        //console.log(tempObj[mediaid]);
                        
                        

                        var src = "https://picsum.photos/id/" + mediaid + "/300/300";
                        $(this).css("background-image", "url('" + src + "')");
                        console.log(src)
                        $(this).attr("href", src);
                        //$(this).attr("data-content", tempObj[mediaid].content);
                        //$(this).attr("data-protect", false);
                        $(this).attr("data-fancybox", "group");
                        //$(this).attr("data-caption", tempObj[mediaid].title);
                        $(this).find(".fa-spinner").remove();
                        $(this).append('<span><i class="fa fa-search"></i></span>');
                    } else {

                    }
                } else {
                    // load all
                    //alert("load all");
            
                    /*
                    $("#assets .grid .row").html("")
                    for(var i =0; i<tempObj.length; i++){
                    console.log(tempObj[i]);
                    var id = tempObj[i].id;
                    var $wrap = $(document.createElement("div"));
                    $wrap.addClass("col-sm-3");
                    $wrap.html("<img src='https://picsum.photos/id/" + id + "/300/300' class='picsum' />")
                    $("#assets .grid .row").append($wrap);
                    */
                    var tempArray = {};
                    var oldArray = hb.Images;
                    for(var i =0; i<oldArray.length; i++){
                        var thisone = oldArray[i];
                        var tempNew = {};
                        tempArray[thisone.id] = {};
                        tempArray[thisone.id]["mediaid"] = thisone.id;
                        tempArray[thisone.id]["mediatitle"] = thisone.author;
                        tempArray[thisone.id]["content"] = "jpeg";
                        tempArray[thisone.id]["previewsrc"] = "https://picsum.photos/id/" + thisone.id + "/300/300";
                        tempArray[thisone.id]["thumbsrc"] = "https://picsum.photos/id/" + thisone.id + "/300/300";
                        
                        //tempArray[thisone.id] = tempNew;

                    }
                    //hb.Images = tempArray;

                    var template = $("#assets_all_template").html();
                   
                    
                    
                    var theTemplate = Handlebars.compile(template);
                    // Define our data object

                    var context = {ViewID: "assets", ImageList: tempArray };
                    // Pass our data to the template

                    var theCompiledHtml = theTemplate(context);
                    //console.log("loading all", theCompiledHtml);
                    
                    // Add the compiled html to the page
                    $('#assets .grid').html(theCompiledHtml);
                    
                    
                    

                    
                }
            });
            
        } else if (selector == "carousel") {
            if (hb.Images !== null) {
                //console.log("it's ready ");
                //console.log(hb.Images)
                var preview = ($(".carousel-with-preview-wrapper").length? true: false);
                var tempObj = hb.Images;
                $(".swiper-wrapper .swiper-slide").each(function (index, elem) {
                    var mediaid = $(this).attr("data-mediaid");
                    //console.log(mediaid)
                    if (tempObj[mediaid] || true) {
                        //console.log("This one worked");

                        var thumbsrc = "https://picsum.photos/id/" + mediaid+ "/900/700";
                        var previewsrc = thumbsrc;
                        if ($(".carousel-full").length) {
                            //console.log("loading full size")
                            $(this).css("background-image", "url('" + previewsrc + "')");
                        } else {
                            $(this).css("background-image", "url('" + thumbsrc + "')");
                        }

                        $(this).find(".fa-spin").remove();
                        //$(this).attr("data-content", tempObj[mediaid].content);
                        //$(this).attr("data-preview", tempObj[mediaid].previewsrc);
                        //$(this).attr("data-video", tempObj[mediaid].videosrc);
                        //$(this).attr("data-audio", tempObj[mediaid].audiosrc);
                        //console.log(index, tempObj[mediaid].content)
                        if (index == 0) {
                            if (preview==true) {
                                var id = $(this).closest(".carousel-with-preview-wrapper").attr("id");
                                var source = thumbsrc;
                                var type = $(this).attr("data-content");
                                if (type.indexOf("video")>-1) {
                                    var previewsrc = $(this).attr("data-video");
                                } else if (type.indexOf("audio") > -1) {
                                    var previewsrc = $(this).attr("data-audio");
                                } else {
                                    var previewsrc = $(this).attr("data-preview");
                                }
                                
                                //console.log(type + " loading preview: " + previewsrc);
                                hb.mediaPreview(id, "false", source, previewsrc, type);
                                //var imgsrc = "url(" + thumbsrc + ")";
                                //$(".carousel-with-preview-wrapper .preview-media-wrapper figure").css("background-image", imgsrc).find(".fa-spin").remove();
                            }
                        }
                    }

                });
               

            } else {
                //console.log("images not loaded yet");
                window.setTimeout(function () { hb.PopulateImages(selector) }, 500)
               
            }
        } else {
            // unknown yet
        }

    },
    mediaPreview: function (id, newWay, source, preview, type) {
        //console.log(id, source, type);
        var $target = $("#" + id).find(".preview-media-wrapper figure");
        $target.html("").css("background-image", "none");
        if (type.indexOf("video") > -1) {
            var videoSrc = preview;

            initVideo(videoSrc, id, newWay, source, type, $target)
            //$target.append("<br />video here");
        } else {
            $target.css("background-image", "url(" + preview + ")");
        }
        //switch (type) {
        //    case "image/jpeg":
        //    case "image/png":
        //    case "image/x-png":
        //    case "image/gif":
        //    case "application/octet-stream":
        //    case "application/postscript":
        //    case "application/illustrator":
        //    case "application/pdf":
        //    case "application/vnd.adobe.illustrator":
        //    case "application/tiff":
        //        $target.css("background-image", "url(" + preview + ")");
        //        break;
        //    case "video/mp4":
        //    case "video/extension":
        //        var videoSrc = preview;
                
        //        initVideo(videoSrc, id, newWay, source, type, $target)
        //        $target.append("<br />video here");
        //        break;
        //    default:
                
        //        $target.append("Still working on support for " + type);
        //        break;
        //}
        

    },
    loadOptionSection: function (dataobj, id, sectList) {
        // load things
        //console.log("building " + id);
        
        if (id == "global") {
            var optTemplate = $("#global_options").html();
            //console.log("loading options");
            //console.log(dataobj);
            var theTemplate = Handlebars.compile(optTemplate);
            var theCompiledHtml = theTemplate(dataobj);
        } else {
            var optTemplate = $("#options-template").html();
       
        var theTemplate = Handlebars.compile(optTemplate);
        // Define our data object

        var partial = id + "_options";
        var objLoop = hb.data.sections;
        
        //console.log("data for " + id);
        //console.log(dataobj[id]);
        var context = {};
        if (dataobj[id]) {
            context["props"] = dataobj[id];
        } else {
            context["props"] = {
                Background: {
                    color: "#fff",
                    text: "000"
                },
                HasHeading: true,
                LayoutTitle: id + " section",
                LayoutDescription: "description"
            }
        }
      
        context["id"] = id;
       
        context["partial"] = partial;

       
        for (var r = 0; r < allsections.length; r++) {
           
            var thisOne = allsections[r];
            if (sectList.includes(thisOne)) {
                if (thisOne == id) {
                    var text = true;
                } else {
                    var text = false;
                }
            } else {
                var text = false;
            }
            context[thisOne] = text;

        }
        context[id] = true;
        //console.log("this context")
        //console.log(context);
        // Pass our data to the template
        
            var theCompiledHtml = theTemplate(context);
        }
       
        // Add the compiled html to the page
        if (id == "global" || id == "no_access") {
            if (id == "global") {
                $(".themer-options-wrapper .theme-option-float .theme-options-holder").prepend(theCompiledHtml);
            } else {
                $(".themer-options-wrapper .theme-option-float .theme-options-holder").append(theCompiledHtml);
            }
           
            
        } else {
            $(".themer-options-wrapper .theme-option-float .theme-options-holder .theme-option-sections").append(theCompiledHtml);
        }

        var index = new Date().getTime();

        var $node = $(".themer-options-wrapper aside[rel='" + id + "']");

            var idx = id;
            var $text = $node.find(".textColor");
            $text.attr("id", idx + "_text_" + index);
            var $bg = $node.find(".bgColor");
            $bg.attr("id", idx + "_bg_" + index);

            //console.log("making color picker")
            /*
            $("#" + idx + "_text_" + index).colorpicker({
                format: 'hex',

            }).on('colorpickerChange colorpickerCreate', function (e) {
                updateColor(e);
            });
            $("#" + idx + "_bg_" + index).colorpicker({
                format: 'hex',

            }).on('colorpickerChange colorpickerCreate', function (e) {
                updateColor(e);
            });
            */
        

        
        // get the template and blank data
        if ($("#" + id).length) {
            //console.log(" " + id + " Section exists!!");
        } else {
            //
            //console.log("building " + id + "!");
            var templateID = "#" + id + "_template";
            if (id == "carousel") {
                templateID = "#carousel_thumb_template";
            }
            var template = $(templateID).html();
            //console.log("#" + id + "_template",template);

            var templateData = {
                ViewID: id,
                Background: {
                    color: "#fff",
                    text: "#000"
                },
                HasHeading: true,
                LayoutTitle: id + " section",
                LayoutDescription: "description",
            };
            //console.log("template data")
            //console.log(templateData)
            hb.loadTemplate(template, templateData);
        }

        // move footer to bottom;


    },
    initOptions: function () {
        //console.log("get options");
        //$(".newbread").append("<a href='javascript:;' class='btn btn-success editMode'><i class='fa fa-edit'> Toggle Edit Mode</a>")
        if (edit == true) {
           
            var s = setTimeout(function () {
                var sectList = [];
                var sectObj = {};
                var tempDataObj = hb.data.sections;
                var globals = null;
                for (var c = 0; c < tempDataObj.length; c++) {
                    var tempID = tempDataObj[c].ViewID
                    sectObj[tempID] = tempDataObj[c];
                    if (tempID == "global") {
                        globals = tempDataObj[c];
                    }
                }
                //console.log("sections");
                //console.log(sectObj)
                
                // remake the data object so we can key off of it
                $(".content-placeholder section").each(function () {
                    var id = $(this).attr("id");
                    sectList.push(id);
                   
                 
                });
                if (globals == null) {
                    var globalData = defaultGlobalOpts;
                } else {
                    var globalData =globals["SectionOpts"];
                }
                hb.loadOptionSection(globalData, "global", sectList);

                $(".section-wrapper section:not(#realFooter)").each(function () {
                    var id = $(this).attr("id");
                    var $icon = "<a href='javascript:;' class='toggleOpts btn btn-info' data-rel='" + id + "'><i class='fa fa-gear'></i></a>";
                    $(this).append($icon);
                    if( sectObj[id])  {
                        //cool
                        var send = sectObj[id];
                       send[id]= sectObj[id];
                    } else {
                        var send = {};
                    }
                   
                    hb.loadOptionSection(send, id, sectList);
                    //$("#realFooter").detach().insertAfter(".content-placeholder section:last-child");
                   
                });

                
                $(".themer-options-wrapper aside").addClass("collapsed");

                var $thumbOpts = $(".thumbOnly");
                var type = $(".carousel-size").val();
                if (type == "thumb") {
                    $thumbOpts.show()
                } else {
                    $thumbOpts.hide();
                }


                $(".themer-options-wrapper .theme-option-sections").sortable({
                    placeholder: "ui-state-highlight",
                    helper: "clone",
                    handle: ".panel-heading",
                    items: ".theme-options",
                    update: function (event, ui) {
                        console.log(ui);

                        var rightMap = [];
                        $(".theme-option-sections.ui-sortable>aside").each(function (index, elem) {
                            var rel = $(this).attr("rel");
                            rightMap.push(rel);
                        });

                        updateMappingOrder(rightMap);

                    }
                });

                // get the rest of the sections if not mapped?
                //console.log("list sections:");
                //console.log(allsections);
                for (var t = 0; t < allsections.length; t++) {
                    var thisSecName = allsections[t];
                    
                    if ($(".themer-options-wrapper aside[rel='" + thisSecName  + "']").length) {
                        //console.log("skipping " + thisSecName);
                    } else {
                        //console.log("loading " + thisSecName);
                        
                        hb.loadOptionSection(sectObj, thisSecName, sectList);
                        
                        
                        //var optTemplate = $("#options-template").html();
                        //var theTemplate = Handlebars.compile(optTemplate);
                        //var theCompiledHtml = theTemplate(context);
                        //$(".themer-options-wrapper .theme-option-float .theme-options-holder").append(theCompiledHtml);
                    }

                    
                }
                hb.renameOptions();
                hb.cssHelpers();
                $(".thumbsPerViewType").trigger("change");
                var q = setTimeout(function () {

                    //$("#no_acccess").detach().insertAfter(".content-placeholder section:last-child");
                    //$("aside[rel='no_acccess']").detach().insertAfter(".themer-options-wrapper aside:last-child");
                   //$("#realFooter").detach().insertAfter(".content-placeholder section:last-child");

                   
                }, 500);

            }, 600);
        }
    },
    hbBinding: function () {

        $(window).resize(function () {
           
            hb.sizeCarousel();
            hb.setupCarousel();
        });

        $(document).on("change", ".custom-font, .custom-font-name", function () {
            var localGlob = hb.globalOption;
            localGlob["customfont"] = $(".custom-font").val();
            localGlob["customfontname"] = $(".custom-font-name").val();
            localGlob["companyName"] = $(".company-name").val();
            localGlob["breadcrumbs"] = ($(".show-breadcrumbs").prop("checked")?true:false);
            hb.setGlobalOptions(localGlob);
        });
        
        $(document).on("click", ".carousel-with-preview-wrapper .swiper-slide", function () {
            var id = $(this).closest(".carousel-with-preview-wrapper").attr("id");
            var source = $(this).css("background-image");
            var type = $(this).attr("data-content");
            //var preview = $(this).attr("data-preview");
            if (source.indexOf("url('") > -1) {
                source = source.substring(5, source.length - 2);
            } else if(source.indexOf("url(")>-1) {
                source = source.substring(4, source.length - 1);
            } else {

            }

            if (type.indexOf("video") > -1) {
                var previewsrc = $(this).attr("data-video");
            } else if (type.indexOf("audio") > -1) {
                var previewsrc = $(this).attr("data-audio");
            } else {
                var previewsrc = $(this).attr("data-preview");
            }

            hb.mediaPreview(id, "false", source, previewsrc, type);
            $(".carousel-with-preview-wrapper .swiper-slide").removeClass("active");
            $(this).addClass("active");
        });

        $(document).on('click', '.nav-tabs a', function (e) {
            e.preventDefault()
            $(this).tab('show');
            $(this).closest(".tab-container").find(".tab-content .tab-pane").removeClass("active");
            $(this).closest(".tab-container").find(".tab-content .tab-pane" + $(this).attr("href")).addClass("active");
        });

        $(document).on("click", ".toggleProps", function () {

            $(this).closest("li").toggleClass("active");
            var ajaxurl = 'Marketing/Site/GetUserMarketingFolders/';
            $("#propsHolder").toggle();

            if (hb.NavLoaded == false) {
                hb.NavLoaded = true;

                $("#propsHolder ul").append("<li><i class='fa fa-spinner fa-spin'></i></li>");
                $.ajax({
                    url: ROOT + ajaxurl,
                    type: "get",
                    success: function (result) {
                        $("#propsHolder ul").empty();


                        $(result).each(function (i, o) {
                            if (o.Status == 0) {
                                var html = '<li class="list-group-items">'
                                html = html + '<div class="panel panel-default">'

                                html = html + '<div class="panel-heading">'
                                html = html + '<span class="name">' + o.Title + '</span>'
                                html = html + '<a href="javascript:;" style="" class="toggler btn btn-default pull-right hidden"><i class="fa-chevron-circle-down fa"></i></a>'
                                html = html + '</div>'

                                html = html + '<div class="panel-body">'
                                html = html + '<a href="/app/dam/Marketing/Site/Index/' + o.FolderID + '/" class="" pid="' + o.FolderID + '" rel="' + o.Path + '">'
                                html = html + '<img src="/$branding$/' + o.BrandingID + '/' + o.ImageDisplayName + '" class="folder">'
                                html = html + '</a>'
                                html = html + '</div>'

                                html = html + '</div>'

                                //html = html = '<a href="javascript:;" style="" class="toggler hidden"><i class="fa-chevron-circle-down fa"></i></a>'

                                html = html + '</li>'
                                //console.log(result);

                                $("#propsHolder ul").append(html);
                            }
                        });


                    },
                    error: function (e) {
                        console.log("e",e)
                    }
                }).fail(function (xhr) {
                    AjaxErrorHandler(xhr)
                    //$(this).closest("li").toggleClass("active");
                });
            }
        });

        $(document).on("click", ".toggleOpts", function () {
            var rel = $(this).attr("data-rel");
            var $target = $(".themer-options-wrapper aside[rel='" + rel + "']");
            $(".themer-options-wrapper aside .panel-body").hide();
            $(".themer-options-wrapper aside .toggler").removeClass("inverse");
            $target.find(".panel-body").show();
            $target.find(".toggler").addClass("inverse");
        });
        
        $(document).on("click", ".editMode", function () {
            var locations = window.location.href;
            if (locations.indexOf("?") > -1) {
                var newLoc = locations.substring(0, locations.indexOf("?"));
            } else {
                newLoc = locations;
            }
            var simple = newLoc;
            
            if (locations.indexOf("edit") > -1) {
                //it already has edit, so remove it
                if (locations.indexOf("noaccess") > -1) {
                    newLoc = newLoc + "?noaccess=true";
                }
            } else {
                newLoc = newLoc + "?edit=true";
                if (locations.indexOf("noaccess") > -1) {
                    locations = locations + "&noaccess=true";
                }
            }
            //newLoc = simple + "?edit=true";
            window.location.href = newLoc;
            //$("body").toggleClass("edit");
        });

        $(document).on("click", ".noaccessMode", function () {
            var locations = window.location.href;
            if (locations.indexOf("?") > -1) {
                var newLoc = locations.substring(0, locations.indexOf("?"));
            } else {
                newLoc = locations;
            }
            var simple = newLoc;
            if (locations.indexOf("noaccess") > -1) {
                
                if (locations.indexOf("edit") > -1) {
                    newLoc = newLoc + "?edit=true";
                }
            } else {
                newLoc = newLoc + "?noaccess=true";
                if (locations.indexOf("edit") > -1) {
                    newLoc = newLoc + "&edit=true";
                }
            }
            //newLoc = simple + "?noaccess=true";
            window.location.href = newLoc;
            //$("body").toggleClass("edit");
        });

        $(document).on("change", ".carousel-size, .swiper-arrow, .carousel-preview", function () {
            var type = $(this).closest("aside").find(".carousel-size").val();
            //alert("load template for " + type);
            var loopsies = hb.data.sections;
            var newData = null;

            if (type == "thumb") {
                $(".thumbOnly").show();
            } else {
                $(".thumbOnly").hide();
            }
            for (var i = 0; i < loopsies.length; i++) {
                var id = loopsies[i].ViewID;

                if (id == "carousel") {
                    newData = hb.updateDataForSection("carousel", loopsies[i]);
                }
            }
            
            if (newData == null) {

                newData = hb.updateDataForSection("carousel", {ViewID: "carousel"});
            }
            var type = $(this).closest("aside").find(".carousel-size").val();
            var arrow = $(this).closest("aside").find(".swiper-arrow").val();
            var preview = ($(this).closest("aside").find(".carousel-preview").prop("checked") ? true : false);
            newData["SectionOpts"] = {
                show: true,
                preview: preview,
                size: type,
                arrowColor: arrow
            };

            // get back the images
            var $par = $(this).closest("aside");
            var rel = $par.attr("rel");
            var allvals = $par.find(".asset-picker-button.image").attr("data-vals");
            var images = allvals.split(",");
            for (var q = 0; q < images.length; q++) {
                var img = images[q];
                //console.log(hb.Images[img]);
            }
            newData["ImageList"] = images;
            var temp = null;
            if (type == "full") {
                temp = $("#carousel_full_template").html();
            } else {
                if (preview == true) {
                    temp = $("#carousel_thumb_template_preview").html();
                }
                else {
                    temp = $("#carousel_thumb_template").html();
                }

            }
           
            //console.log("data first time");
           // console.log(newData);
            var theTemplate = Handlebars.compile(temp);
            var theCompiledHtml = theTemplate(newData);
            // Add the compiled html to the page
            //console.log("compiled", theCompiledHtml)
            $('#carousel').replaceWith(theCompiledHtml);
            hb.setupMedia("carousel");
            $('#carousel').append('<a href="javascript:;" class="toggleOpts btn btn-info" data-rel="custom_hero"><i class="fa fa-gear"></i></a>');

            window.setTimeout(function () {
                console.log("update css");
                $(this).closest("aside").find(".cssStructure .update").trigger("click");
            }, 1000);
            
        });

        $(document).on("change", ".folder-layout", function () {
            var layout = $(this).val();
            var loopsies = hb.data.sections;
            var newData = {};
            for (var i = 0; i < loopsies.length; i++) {
                var id = loopsies[i].ViewID;

                if (id == "folders") {
                    newData = hb.updateDataForSection("folders", loopsies[i]);
                    var SectionOpts = {
                        full: (layout=="list"?true:false),
                        type: layout
                    }
                    newData["SectionOpts"] = SectionOpts;
                    newData.FolderList = hb.Folders;
                }
               
            }
            var temp = $("#folder_template").html();
            var theTemplate = Handlebars.compile(temp);
            var theCompiledHtml = theTemplate(newData);
            // Add the compiled html to the page
           
            $('#folders').replaceWith(theCompiledHtml);
            $('#folders').append('<a href="javascript:;" class="toggleOpts btn btn-info" data-rel="folders"><i class="fa fa-gear"></i></a>');
        });

        $(document).on("change", ".show-breadcrumbs", function () {
            var checked = $(this).prop("checked");
            if (checked) {
                $(".newbread").removeClass("hidden");
                $(".site-wrap").removeClass("nobread");
            } else {
                $(".newbread").addClass("hidden");
                $(".site-wrap").addClass("nobread");
            }
        });

        $(document).on("change", ".section-alignment", function () {
            var align = $(this).val();
            var rel = $(this).closest("aside").attr("rel");
            $(".layoutMapping #" + rel).find(".content-wrapper").removeClass("text-right text-left text-center").addClass("text-" + align);
        });
        
        $(document).on("change", ".thumbsPerViewType", function () {
            var $aside = $(this).closest("aside");
            var val = $(this).val();
            if (val == "fixed") {
                $aside.find(".thumbSlidesFixedOnly").removeClass("hidden");
                $aside.find(".thumbSlidesAutoOnly").addClass("hidden");
                
            } else {
                $aside.find(".thumbSlidesFixedOnly").addClass("hidden");
                $aside.find(".thumbSlidesAutoOnly").removeClass("hidden");
            }
        });

        $(document).on("change", ".hero-type", function () {
            var type = $(this).val();
            //alert("load template for " + type);
            var loopsies = hb.data.sections;
            var baseData = {
                "ViewID": "custom_hero"
            }
            

            // get the custom html
            var CustomHero = $(".section-customhero").val();
            var newData = hb.updateDataForSection("custom_hero", baseData);
            var imageOnly = false;

            newData["CustomHero"] = CustomHero;

            if (type == "image") {
                imageOnly = true;
            }
            var SectionOpts = {
                imageOnly: imageOnly,
                type: type
            }
            newData["SectionOpts"] = SectionOpts;
            /*
            for(var i=0;i<loopsies.length;i++) {
                var id = loopsies[i].ViewID;
                
                if (id == "custom_hero") {
                    newData = hb.updateDataForSection("custom_hero", loopsies[i]);
                    var imageOnly = false;
              
                    if (type == "image") {
                        imageOnly = true;
                    }
                    var SectionOpts = {
                        imageOnly: imageOnly,
                        type: type
                    }
                    
                    newData["SectionOpts"] = SectionOpts;
                   
                   
                }
            }
            */
           
            //console.log("new data ");
            //console.log(newData);
            var temp = $("#custom_hero_template").html();
            var theTemplate = Handlebars.compile(temp);
            var theCompiledHtml = theTemplate(newData);
            // Add the compiled html to the page


            $('#custom_hero').replaceWith(theCompiledHtml);
            $('#custom_hero').append('<a href="javascript:;" class="toggleOpts btn btn-info" data-rel="custom_hero"><i class="fa fa-gear"></i></a>');

            var o = $(this).closest("aside");
            $(o).find(".customCSSSection .update").trigger("click");
        });

        $(document).on("click", ".updateThumbCarousel", function () {
            //console.log("update")
            var o = $(this).closest("aside");
            var type = $(o).find(".carousel-size").val();
            var preview = ($(o).find(".carousel-preview").prop("checked") ? true : false);
            //alert("load template for " + type);
            var loopsies = hb.data.sections;
            //var newData = {};
            var baseData = {
                "ViewID": "carousel"
            }
            var newData = hb.updateDataForSection("carousel", baseData);
            for (var i = 0; i < loopsies.length; i++) {
                var id = loopsies[i].ViewID;

                if (id == "carousel") {
                    newData = hb.updateDataForSection("carousel", loopsies[i]);
                    //responsive
                    var SectionOpts = {
                        show: true,
                        preview: preview,
                        size: type,
                        arrowColor: $(".swiper-arrow").val(),
                        thumbs: {
                            width: ($(o).find(".thumb-width").val() == "" ? 200 : $(o).find(".thumb-width").val()),
                            height: ($(o).find(".thumb-height").val() == "" ? 150 : $(o).find(".thumb-height").val()),
                            slidesPerView: $(o).find(".thumbsPerViewType").val(),
                            thumbsnum: ($(o).find(".thumb-num").val() == "" ? 5 : $(o).find(".thumb-num").val()),
                            responsive: ($(o).find(".thumb-responsive").prop("checked") ? true : false)
                        }
                    }
                    newData["SectionOpts"] = SectionOpts;


                }
            }
            //console.log("new data ");
            //console.log(newData);
            if(jQuery.isEmptyObject(newData)){
                //console.log("it's empty!");
            } else {
                if (type == "full") {
                    var theTemplateScript = $("#carousel_full_template").html();
                } else {
                    if (preview == true) {
                        //console.log("preview enabled");
                        var theTemplateScript = $("#carousel_thumb_template_preview").html();
                    } else {
                        var theTemplateScript = $("#carousel_thumb_template").html();
                    }

                }

                var theTemplate = Handlebars.compile(theTemplateScript);
                var theCompiledHtml = theTemplate(newData);
                // Add the compiled html to the page

                $('#carousel').replaceWith(theCompiledHtml);
                hb.sizeCarousel();
                hb.setupCarousel();

                $('#carousel').append('<a href="javascript:;" class="toggleOpts btn btn-info" data-rel="custom_hero"><i class="fa fa-gear"></i></a>');

                var o = $(this).closest("aside");
                $(o).find(".customCSSSection .update").trigger("click");
            }
            
        });
        
        $(document).on("click", ".theme-options .add-button", function () {
            var $parent = $(this).closest(".custom-options").find(".button-entry");
            var $newButton = $(document.createElement("div"));
            var iteration = 0;
            if ($parent.find(".panel").length) {
                iteration = $parent.find(".panel").size();
            }
            iteration++;
            // use template
            var partial = $("#button_option_partial_template").html();
            var template = Handlebars.compile(partial);
            var output = template({
                    "title": "New Button",
                    "link": "#",
                    "target": "_self",
                    "index": iteration
            });
            var stringyNew = Handlebars.SafeString(output);

            $parent.append(output);

            var id = $(this).closest("aside").attr("rel");
            var $preview = $(".layoutMapping #" + id + " .content .button-wrapper");
            $preview.append("<a href='#' class='btn btn-default'>New Button</a>")
        });

        $(document).on("click", ".theme-options .add-link", function () {
            var $parent = $(this).closest(".custom-options").find(".link-entry");
            var $newButton = $(document.createElement("div"));
            var iteration = 0;
            if ($parent.find(".panel").length) {
                iteration = $parent.find(".panel").size();
            }
            iteration++;
            // use template
            var partial = $("#footer_option_partial_template").html();
            var template = Handlebars.compile(partial);
            var output = template({
                "title": "New Link",
                "link": "#",
                "target": "_self",
                "index": iteration
            });
            var stringyNew = Handlebars.SafeString(output);

            $parent.append(output);

            var id = $(this).closest("aside").attr("rel");
            var $preview = $(".layoutMapping #" + id + " .content .link-wrapper");
            $preview.append("<a href='#' class='footer-link'>New Link</a>")
        });

        $(document).on("click", ".customCSSSection .toggleCssHelper", function (e) {
            var $tar = $(this).closest(".customCSSSection").find(".cssStructure");
           
            hb.getCSSLevels($tar.attr("data-id"));
            $tar.toggle();
        });

        $(document).on("mouseenter", ".cssStructure li", function () {
            var sel = $.trim($(this).find("span").text());
            //sel = sel.substring(0, sel.indexOf("{"));
            $(sel).addClass("previewed");
        });
        $(document).on("mouseout", ".cssStructure li", function () {
            var sel = $.trim($(this).find("span").text());
            //sel = sel.substring(0, sel.indexOf("{"));
            $(sel).removeClass("previewed");
        });

        $(document).on("click", ".cssStructure li", function () {
            var sel = $.trim($(this).find("span").text());
            //sel = sel.substring(0, sel.indexOf("<i"));
            //alert(sel)
            var $tar = $(this).closest(".customCSSSection").find(".section-customcss");
            var orig = $tar.val();
            orig += "\n" + sel + "{ }";
            //alert(orig)
            $tar.val(orig);
            $(this).closest(".cssStructure").hide();
        });
        
        $(document).on("click", ".customCSSSection .btn.update", function (e) {
            e.preventDefault();
            //alert("css section")
            var rel = $(this).closest("aside").attr("rel");
            var $text = $(this).closest(".customCSSSection").find("textarea");
            var $preview = $(".section-wrapper #" + rel);
            $preview.find("style").remove();
            if ($(this).hasClass("update")) {
                var css = $text.val();
                //console.log("css, ", css)
                var $style = $(document.createElement("style"));
                $style.html(css);
                $preview.append($style);
            } else {
                // clear
                var string = "section#" + rel + " { }\n";
                string += "section#" + rel + " .container { }\n";
                string += "section#" + rel + " .content { }\n";
                $text.val(string);
            }
        });

        // todo maker previewer for carousel
        $(document).on("click", ".widget-hero-viewer .widget-featured-media a", function () {
            var src = $(this).find("img").attr("src");
            $(this).closest(".widget-hero-viewer").find(".widget-video-wrapper").html("<img src='" + src + "' />");
        });

        $(document).on("click", ".grid-item a", function (e) {
            e.preventDefault();
            //console.log("e", e);
        });

        // not in use for now
        $(document).on("click", ".grid-item  .previewer", function () {

            var $self = $(this);
            var type =$self.attr("data-content");
            var ext = $self.attr("data-content");
            var contentType = $self.attr("data-content");
            ext = ext.substring(ext.indexOf("/" + 1, ext.length));
            type = type.substring(0, type.indexOf("/"));

            var mediaid = $(this).closest(".grid-item").find("img").attr("mediaid");

            var title = "";
            var image = "";
        

       

            /// decide what to do ////

            if (type == "image") {
                $("#previewModal .modal-body >div").hide();

                $("#preview-image").show();

                var imagesrc = $(this).closest(".panel").find(".panel-body figure img").attr("detailsrc");
                initViewerwithid("seadragon_" + mediaid, imagesrc, "modal");
                $("#seadragon_" + mediaid).height(600);


            } else if (type == "video") {

                $("#previewModal .modal-body >div").hide();
                $("#preview-video").html("");
                $("#preview-video").show();

                var videosrc = $(this).closest(".panel").find(".panel-body figure img").attr("videosrc");
                var poster = $(this).closest(".panel").find(".panel-body figure img").attr("src");

                initVideo(videosrc, mediaid, poster, contentType, $("#preview-video"));

            } else if (type == "audio") {

                var src = $(this).closest(".panel").find(".panel-body figure img").attr("audiosrc");
                $("#previewModal .modal-body >div").hide();
                $("#preview-audio").show();

                initAudio(src, $("#preview-audio"));

            } else {
                // other / doc
                $("#previewModal .modal-body >div").hide();

                $("#preview-image").html("");
                var imagesrc = $(this).closest(".panel").find(".panel-body figure img").attr("detailsrc");




                var pages = 4;

                if (pages > 0) {
                    var base = "/Services/asset2image.ashx?file=AFCE38B4-B709-4AEE-A71C-899103FDF2BE/zoom.xml&page=1&numPages=10&height=90&width=90&pageCount=6";
                    var sources = [];
                    for (var j = 0; j < pages; j++) {
                        var pp = j + 1;
                        var obj = {};
                        obj.type = 'image';
                        obj.url = imagesrc;
                        sources.push(obj);
                    };
                    var images = sources;

                    if ($("#seadragon_" + mediaid).length) {
                        $("#seadragon_" + mediaid).html("");
                    } else {
                        var $base = $(document.createElement("div"));
                        $base.attr("id", "seadragon_" + mediaid);
                        $base.css("width", "100%").css("background", "#000");
                        $("#preview-image").append($base);
                    }

                    if ($("#thumbnailWrapper_" + mediaid).length) {
                        $("#thumbnailWrapper_" + mediaid).html("hey");
                    } else {
                        // make it

                        var $thumbnailWrapper = $(document.createElement("div"));
                        $thumbnailWrapper.attr("id", "thumbnailWrapper_" + mediaid);
                        $thumbnailWrapper.addClass("thumbnailWrapper");
                        var $thumbInner = $(document.createElement("div"));
                        $thumbInner.addClass("thumb-inner");
                        for (var i = 0; i < pages; i++) {
                            if (images[i]) {
                                //console.log(images[i].url);
                                var $thumb = $(document.createElement("a"));
                                $thumb.attr("data-page", (i + 1));
                                $thumb.attr("href", "javascript:;");
                                var $img = $(document.createElement("img"));
                                $img.attr("src", images[i].url); // &mw=90
                                $thumb.append($img);
                                $thumbInner.append($thumb);
                            } else {
                                console.log(i);
                            }

                        }
                        $thumbnailWrapper.append($thumbInner);
                        $("#preview-image").append($thumbnailWrapper);
                    }


                    initViewerwithidMultiModal("seadragon_" + mediaid, images, "modal");

                } else {
                    if ($("#thumbnailWrapper").length) {
                        $("#thumbnailWrapper").remove();
                    }
                    initViewerwithid("seadragon_" + mediaid, imagesrc, "modal");
                }


                $("#seadragon_" + mediaid).height(600);


                $("#preview-image").show();
            }

            $("#previewModal").modal('show');

        });

        $(document).on('wheel',function(event){
            //mouseController.wheel(event);
            //return false; 

            // send to function to translatex panels
            //console.log("mouse wheel " + event)
        });

        $(document).on("click", ".saveAll", function () {
            var currentVal = $("#ultimateJSON").val();
            var returnedVal = hb.SetLayoutJSON();
            //console.log("save")
            //console.log(returnedVal)
            $("#ultimateJSON").val(returnedVal)
            var ajaxurl = 'SiteAdministration/MarketingAdmin/SaveMarketingLayoutToFolder/';
            var ajaxdata = {
                FolderGUID: $("#FolderID").val(),
                FolderPath: $("#FolderPath").val(),
                LayoutJsonData: JSON.stringify(returnedVal)
            }
            //console.log(ajaxdata);
            //console.log("to fix: send to " + ajaxurl)
            

            
            $.ajax({
                url: ROOT + ajaxurl,
                type: "post",
                data: JSON.stringify(ajaxdata),
                dataType: "json",
                contentType: 'application/json',
                success: function (result) {
                    alert(result);
                    //parent.callFromIframe();
                    //alert("MapLayoutSections: " + result)

                    //data = {
                    //   FolderGUID: $("#FolderID").val(),
                    //   LayoutID: $("#LayoutMappingSelector").val(),
                    //   FolderPath: $("#FolderPath").val()
                    //}
                    //SaveLayoutFolder(data);
                }
            }).fail(function (xhr) {
                AjaxErrorHandler(xhr)
            });
            
            

        });

        $(document).on("click", ".theme-options .panel-footer .btn-success", function () {
            var $rel = $(this).closest("aside");
            var id = $rel.attr("rel");
            
            $rel.hide();

        });

    },
    SetLayoutJSON: function () {
        
        var sects = $(".themer-options-wrapper aside");
        var idx = 0;
        MarketingLayoutMappings = new Array(sects.length - 1);
        $(sects).each(function (i, o) {

            var imagelist = [];
            var folderlist = [];
            var buttonlist = [];
            var tablist = [];

            //console.log($(this).attr("rel"))

            // basic options
            var hasHeading = false;
            if ($(o).find(".section-showtitle").prop("checked")) {
                hasHeading = $(o).find(".section-showtitle").prop("checked");
            }

            var LayoutTitle = $(o).find(".section-title").val();
            var LayoutDescription = $(o).find(".section-description").val();

            var sectionID = $(o).attr("rel");
            var visible = false;
            if ($(o).find(".visibilityToggle").hasClass("active")) {
                visible = true;
            }

            if (sectionID == null || sectionID =="") {
                sectionID = "global";
            }


            //Image List
            
            var selector = $(o).find(".asset-picker-button.image").data("vals");
            if (selector != undefined && selector != '') {
                console.log("section ",o, "selector ", selector)
                if (selector.indexOf(",") > -1) {
                    var arrdataimage = selector.split(',')
                    $(arrdataimage).each(function (iii, ooo) {
                        if (ooo != "") {
                            imagelist.push(ooo);
                        }
                    });
                } else {
                    imagelist.push(selector);
                }
            }

            //Folder list
            var selector2 = $(o).find(".asset-picker-button.folder").data("vals");
            if (selector2 != undefined && selector2 != '') {
                var arrdatafolder = selector2.split(',')
                folderlist = arrdatafolder;
            }

            // Tab List
            var tabselector = $(o).find(".tab-entry .panel:not(.removed)");
            if (tabselector.length > 0) {
                $(tabselector).each(function (iii, ooo) {
                    var tabby = {
                        title: $(ooo).find(".section-tab-tabtext").val(),
                        content: $.trim($(ooo).find(".section-tab-tabcontent").val()),
                    };
                    tablist.push(tabby);
                });
            }

            // Button List
            var buttonlinkselector = $(o).find(".button-entry .panel:not(.removed)");
            if (buttonlinkselector.length > 0) {
                $(buttonlinkselector).each(function (iiii, oooo) {
                    var button = {
                        title: $(oooo).find(".section-button-text").val(),
                        link: $(oooo).find(".section-button-link").val(),
                        target: $(oooo).find(".section-button-target").val()
                    };
                    buttonlist.push(button);
                });
            }

            // Footer Link List
            var FooterLinksList = [];

            var foooterlinkselector = $(o).find(".link-entry .panel:not(.removed)");
            if (foooterlinkselector.length > 0) {
                $(foooterlinkselector).each(function (iiii, oooo) {
                    var link = {
                        title: $(oooo).find(".section-link-text").val(),
                        link: $(oooo).find(".section-footer-link").val(),
                        target: $(oooo).find(".section-link-target").val()
                    };
                    FooterLinksList.push(link);
                });
            }
            



            switch (sectionID) {
                case "assets":
                    var prevent = false;
                    if ($(o).find(".section-preventdl").prop("checked")) {
                        prevent = true;
                    }
                    var opts = {
                        "preventDownloads": prevent,
                    }
                    break;
                case "buttons":
                    var opts = {
                        "align": "left",
                    }
                    break;
                case "custom_hero":
                    var imageOnly = false;
                    var type = $(".hero-type").val();
                    if (type == "image") {
                        imageOnly = true;
                    }
                    var opts = {
                        "type": type,
                        "imageOnly": imageOnly
                    }
                    break;
                case "carousel":
                    var opts = {
                        show: true,
                        preview: ($(o).find(".carousel-preview").prop("checked")?true: false),
                        size: $(o).find(".carousel-size").val(),
                        arrowColor: $(".swiper-arrow").val(),
                        thumbs: {
                            width: ($(o).find(".thumb-width").val()==""?200:$(o).find(".thumb-width").val()),
                            height: ($(o).find(".thumb-height").val() == "" ? 150 : $(o).find(".thumb-height").val()),
                            slidesPerView: $(o).find(".thumbsPerViewType").val(),
                            thumbsnum: ($(o).find(".thumb-num").val()==""?5:$(o).find(".thumb-num").val()),
                            responsive: ($(o).find(".thumb-responsive").prop("checked")?true:false)
                        }
                    }
                    break;
                case "folders":
                    var opts = {
                        "type": $(".folder-layout").val(),
                        "full": ($(".folder-layout").val()=="list"?true:false)
                    }
                    break;
                case "social":
                case "embed":
                    var opts = {
                        IframeSrc: $(o).find(".section-iframesrc").val(),
                        IframeHeight: $(o).find(".section-iframeheight").val(),
                    }
                    break;
                case "no_access":
                    var opts = {
                        "hideHero": ($(".hide-hero").prop("checked")?true:false)
                    }
                    break;
                case "global":
                    var opts = {
                        "companyName": $(o).find(".company-name").val(),
                        "breadcrumbs": ($(o).find(".show-breadcrumbs").prop("checked")?true:false),
                        "id": "global",
                        "customfont": $(".custom-font").val(),
                        "customfontname": $(".custom-font-name").val(),
                    }
                    break;
                default:
                    var opts = {};
                    break;
            }

            MarketingLayoutMappings[idx] = {
                FolderGUID: $("#FolderID").val(),
                ViewID: sectionID,
                Show: visible,
                Align: $(o).find(".section-alignment").val(),
                HasHeading: hasHeading,
                LayoutTitle: LayoutTitle,
                LayoutDescription: LayoutDescription,
                CustomCSS: $.trim($(o).find(".section-customcss").val()),
                Background: {
                    source: $(o).find(".background-selector li .form-control").attr("data-src"),
                    size: $(o).find(".section-size").val(),
                    repeat: $(o).find(".section-repeat").val(),
                    position: $(o).find(".section-position").val(),
                    attachment: $(o).find(".section-attach").val(),
                    color: $(o).find(".bgColor .form-control").val(),
                    text: $(o).find(".textColor .form-control").val(),
                    // need to add these
                },
                CustomHero: $.trim($(o).find(".section-customhero").val()),
                CustomHtml: $.trim($(o).find(".section-customhtml").val()),
                ImageList: imagelist,
                SectionOpts: opts,
                ButtonList: buttonlist,
                FolderList: folderlist,
                FooterLinksList: FooterLinksList,
                TabList: tablist,
                LayoutSectionGUID: $(o).find(".section-guid").val()
               
            }
            //console.log(MarketingLayoutMappings[idx])
            idx++
        });

        var obj = {
            name: "layout1",
            id: "424234",
            folderId: $("#FolderID").val(),
            sections: MarketingLayoutMappings
        };


        return obj;
    },
}




