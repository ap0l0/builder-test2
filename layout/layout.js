$(document).on("click", ".themer-options-wrapper .toggler", function(){
    $(this).toggleClass("inverse");
    $(this).closest(".panel").find(".panel-body").toggle();
});

function updateMappingOrder(arr) {
    var rightMap = arr;
    var leftMap = [];


    $(".content-placeholder >section").each(function (index, elem) {
        var id = $(this).attr("id");
        leftMap.push(id);
        var indexToBe = rightMap.indexOf(id);
        //console.log("index to be: " + indexToBe + " vs " + index);
        var $partner = $(".content-placeholder>section:nth-child(" + indexToBe + ")");
        //$(this).detach().insertBefore($partner);

        var cols = $(".content-placeholder>section");
        if (indexToBe < index) {
            cols.eq(index).detach().insertBefore(cols.eq(indexToBe));
        } else if (index > index) {

            cols.eq(index).detach().insertAfter(cols.eq(indexToBe));
        }
    });
    //console.log("Right Map");
    //console.log(rightMap)
}

function updateColor(event) {

    var id = $(event.currentTarget).attr("id");

    console.log("id",id)
    var section = $(event.currentTarget).closest("aside").attr("rel");
    var color = $("#" + id).find(".form-control").val();
    if (id.indexOf("text") > -1) {
        
        $("#" + section).css("color", color);
        if (id.indexOf("hero") > -1) {
            $("#" + section + " h1").css("color", color);
        }
    } else {
        $("#" + section).css("background-color", color);
    }

}

function initDropzone(id) {
    var path = "/$branding$/marketing/";
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone("#"+id, {

        autoQueue: true, // Make sure the files aren't queued until manually added
        accept: function (file, done) {
            var thumbnail = file.previewElement.querySelector(".preview");
            done();
        }
    });

    myDropzone.on("success", function (file, done) {
        var fileuploaded = file.previewElement.querySelector("[data-dz-name]").innerHTML;
        var ext = fileuploaded.substring(fileuploaded.lastIndexOf(".") + 1, fileuploaded.length);
        //console.log(fileuploaded, ext);

        console.log("done", done)
        var src = path + fileuploaded;
        var $prev = $(file.previewElement);

        var parsed = JSON.parse(done);
        var fileName = parsed.fileName;

        src = path + fileuploaded;
        src = fileName;
        src = "/$branding$/Marketing/" + src;

        var rel = $prev.closest("aside").attr("rel");
        var $wrapper = $(".content-placeholder #" + rel);
        $wrapper.css("backgroundImage", "url('" + src + "')");
        //$("#imageLogo img").attr("src", src);
        //$(".previewBox .navbar-brand img").attr("src", src);

        //console.log("preview", $prev);
        var $list = $prev.closest(".row").find(".selected-list ul");
        //console.log("list", $list);
        $list.html("");
        var singeSrc = src;
        $list.append("<li><div class='input-group'><span class='form-control disabled background-input' data-src='" + singeSrc + "'>" + fileName + "</span><span class='input-group-addon'><a href='#'><i class='fa fa-times'></i></a></span></li>");
        $prev.closest(".row").find(".selected-list").show();



    });

    myDropzone.on("complete", function (file) {
        myDropzone.removeFile(file);
    });
}

$(document).on("click", ".asset-modal-selection", function () {
    $("#assetPickerModal").modal("hide");
    var rel = $("#assetPickerModal").attr("data-rel");
    var $open = $(".asset-picker-button .fa-minus");

    var $preview = $(".layoutMapping #" + rel + " .content");
   

    var newData = null;
    var loopsies = hb.data.sections;
    for (var i = 0; i < loopsies.length; i++) {
        var id = loopsies[i].ViewID;

        if (id == rel) {
            newData = hb.updateDataForSection(rel, loopsies[i]);
            newData.Show = true;
        }
    }
    if (newData == null) {
        newData = hb.updateDataForSection(rel, { ViewID: rel});
    }

    var vals = [];
    // 3 cases: assets, carousel. folders
    if (rel == "assets" || rel == "carousel") {
        $("#assetPickerModal .modal-body .grid-item").each(function () {
            var $a = $(this).find("a");
            if ($(this).hasClass("active")) {
                var $cloney = $a.clone();
                $preview.find("ul");
                var src = $cloney.attr("detailsrc");
                vals.push($cloney.attr("mediaid"));

            }
           
            newData.ImageList = vals;
        });
    } else {
       
        $(".modal-body li:not(.unselected)").each(function () {
            var $a = $(this).find("a");
            var id = $a.attr("pid");
            vals.push(id);
            hb.Folders[id] = {
                id: id,
                description: $a.attr("description"),
                security: $a.attr("securitypointid"),
                title: $a.attr("title"),
                path: $a.attr("rel"),
                FolderImage: "",
            };
        });
        newData.FolderList = hb.Folders;

    }
   

    
    if (rel == "assets") {
        var temp = $("#" + rel + "_template").html();
    } else if (rel == "carousel") {
        //get the right template
        var $base = $("aside[rel='carousel']");
        var size = $base.find(".carousel-size").val();
        if (size == "thumb") {
            if ($base.find(".carousel-preview").prop("checked")) {
                var temp = $("#carousel_thumb_template_preview").html();
            } else {
                var temp = $("#carousel_thumb_template").html();
            }
           
            
        } else {
            var temp = $("#carousel_full_template").html();
           
        }
    } else if(rel=="folders") {
        var temp = $("#folder_template").html();
       

    } else {
        
        alert("not set up yet")

    }
    var theTemplate = Handlebars.compile(temp);
    var theCompiledHtml = theTemplate(newData);
    // Add the compiled html to the page

    console.log("new data");
    console.log(newData)
    console.log("template");
    console.log(theCompiledHtml)
    $('#' + rel).replaceWith(theCompiledHtml);

    hb.setupMedia(rel);
    $('#' + rel).append('<a href="javascript:;" class="toggleOpts btn btn-info" data-rel="' + rel + '"><i class="fa fa-gear"></i></a>');

    $open.closest(".asset-picker-button").attr("data-vals", vals.join());
    $(".asset-picker-button").removeClass("open");
    $(".asset-picker-button .fa").removeClass("fa-minus").addClass("fa-plus");
    
    
});
$(document).on("click", ".asset-modal-cancel", function () {
    $("#assetPickerModal").modal("hide");
    $(".asset-picker-button").removeClass("open");
    $(".asset-picker-button .fa").removeClass("fa-minus").addClass("fa-plus");
});

$(document).on("click", ".asset-picker-button", function () {

    var rel = $(this).closest("aside").attr("rel");
    var mediaIds = $(this).attr("data-vals");
    var folderid = $("#FolderID").val();
    var folderpath = $("#FolderPath").val();


    if (mediaIds.indexOf(",") > -1) {
        var mediaArray = mediaIds.split(",");
    } else {
        var mediaArray = [];
    }


   
  
        $(this).toggleClass("open");
        if ($(this).hasClass("open")) {

            $("#assetPickerModal").modal("show").attr("data-rel", rel);

            $(this).find("i").toggleClass("fa-plus").toggleClass("fa-minus");
       
            var $picker = $("#assetPickerModal .modal-body");
            $picker.height(300).css("overflow", "auto");
            $picker.html("<div class='text-center loading-modal'><i class='fa fa-spinner fa-spin fa-3x'></i></div>").addClass("loaded");



            if ($(this).hasClass("folder")) {
                var $node = $(".folder-tree-node-selected");
                var id = $node.attr("pid");
                var path = $("#FolderPath").val();
                var folderUrl = "/app/dam/DAMTree/GetDirectory/?folderid=" + folderid + "&folderpath=" + folderpath;
                $picker.append("<div class='row'><div class='col-sm-6 loadTree'></div></div>")
                $picker.find(".loadTree").append("Folders inside <strong>" + path + "</strong><br /><br />");

                $.ajax({
                    url: folderUrl,
                    success: function (data) {
                        $picker.find(".loadTree").append(data);
                        //console.log(data);
                        $picker.find(".loadTree li").each(function () {
                            var mediaTestId = $(this).find("a").attr("pid");
                            if (mediaArray.includes(mediaTestId)) {
                                // cool
                            } else {
                                // uh oh
                                $(this).addClass("unselected");
                            }
                        });
                        
                        $picker.find(".loading-modal").remove();
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });

            } else {//string path, int page = 1, int view = 1, string sort = "", bool reload = false, int pgsize=0
                var url = "/app/dam/Administrator/Assets/LoadMediaAssetsForFolder/?path=" + folderpath + "&page=1&view=1&reload=false&pgsize=10000";
                $.ajax({
                    url: url,
                    success: function (data) {

                        $(data).find(".grid .grid-item").each(function () {
                            var $figClone = $(this).find("figure a").clone();
                            var $fullClone = $(this).clone();
                            /*
                            $fullClone.find("figure a").removeAttr("id").removeClass("openupdetails");
                            var $figClone = $fullClone.find("figure a");
                            var mediaTestId = $figClone.attr("mediaid");
                            if (mediaArray.includes(mediaTestId)) {
                                $figClone.addClass("selected");
                            }
    
                            $picker.append($fullClone);
                            */
                            var selectedClass = "normal";
                            var $headingClone = $(this).find(".panel-heading").clone();
                            $headingClone.find(".preview").remove();
                            var mediaTestId = $figClone.attr("mediaid");
                            if (mediaArray.includes(mediaTestId)) {
                                //$figClone.addClass("selected");
                                selectedClass = "active";
                            }

                            $figClone.removeAttr("id");
                            $figClone.attr("href", "#");
                            $figClone.width(150).height(150);
                            $figClone.removeClass("openupdetails");
                            $figClone.find("i").removeClass().addClass("fa fa-check");
                            var $fig = $(document.createElement("figure"));
                            $fig.addClass("grid-item").addClass(selectedClass);
                            $fig.append("<div class='panel panel-default'><div class='panel-heading modal-panel-heading'></div><div class='panel-body'></div></div>")
                            $fig.find(".panel-body").append($figClone);
                            $fig.find(".panel-heading").html($headingClone.html());
                            $fig.find(".panel-heading").addClass(selectedClass);
                            if (selectedClass == "active") {
                                $fig.find(".panel-heading input").attr("checked", "checked");
                            }
                            $picker.append($fig);

                        });

                        $picker.find(".loading-modal").remove();
                    }
                });
            }

           
        
        } else {

            $("#assetPickerModal").modal("hide");
            $(this).find("i").toggleClass("fa-plus").toggleClass("fa-minus");
       
        }

    
});

/*

$(document).on("click", ".asset-picker .asset-display a", function () {
    if ($(this).closest(".asset-picker").hasClass("single") || $(this).hasClass("no-image")) {
        $(this).closest(".asset-picker .asset-display").find("figure a").removeClass("selected");
        var src = $(this).attr("detailsrc");

        $(this).toggleClass("selected");
        if ($(this).hasClass("selected")) {
           // moved to button click

        } else {

        }
    } else {
        // multi
        $(this).toggleClass("selected");
    }
    
});
*/

$(document).on("click", ".modal-body li", function () {
    $(this).toggleClass("unselected");
});
$(document).on("click", ".themer-options-wrapper .removeBtn", function () {
    var $panel = $(this).closest(".panel");
    var $input = $panel.find("input.realTimeEditable");
    var selector = $input.attr("data-selector");
    var rel = $panel.closest("aside").attr("rel");
    //alert("remove " + rel + " " + selector);
    var $removal = $(".content-placeholder #" + rel + " " + selector);
    if (rel == "tabs") {
        // modify the preview element selector
        $removal.hide().addClass("removed");
    } else {
        // remove the <a> of the button list
        $removal.hide().addClass("removed");
    }

    //reset selector
    if ($("#button-section").length) {

    }
    $panel.hide().addClass("removed");
    
});

$(document).on("click", "#assetPickerModal .modal-body  a", function () {
    var $tar = $(this).closest(".grid-item");
        //var src = $(this).attr("detailsrc");
        //$(this).toggleClass("selected");
    $tar.toggleClass("active").find(".panel-heading").toggleClass("active");
    if($tar.hasClass("active")){
        $tar.find("input").prop("checked", true);
    } else {
        $tar.find("input").prop("checked", false);
    }
    
});


$(document).on("click", "#assetPickerModal .modal-body .panel-heading input", function () {
    var checked = $(this).prop("checked");
    var $tar = $(this).closest(".grid-item");
    //var src = $(this).attr("detailsrc");
    //$(this).toggleClass("selected");
    if (checked == true) {
        $tar.addClass("active").find(".panel-heading").addClass("active");
    } else {
        $tar.removeClass("active").find(".panel-heading").removeClass("active");
    }
   
   

});

$(document).on("click", ".theme-options .btn-group .btn", function () {
    var $parent = $(this).closest(".btn-group");
    var property = $parent.attr("rel");
    $parent.find(".btn").removeClass("active");
    $(this).addClass("active");
    if (property !== "none") {
        var value = $(this).attr("data-val");
        var id = $(this).closest("aside").attr("rel");
        var $target = $(".layoutMapping #" + id);
        $target.css(property, value);
       
    }
});

$(document).on("change", ".theme-options .cssDropdown", function () {
   
    var property = $(this).attr("rel");
    var text = $(this).find("option[value='" + $(this).val() + "']");
    $(this).addClass("active");
    if (property !== "none") {
        var value = $(this).val();
        var id = $(this).closest("aside").attr("rel");
        var $target = $(".layoutMapping #" + id);
        $target.css(property, value);
        
    }
});

$(document).on("change", ".swiper-arrow", function () {
    var id = $(this).closest("aside").attr("rel");
    var $target = $(".layoutMapping #" + id ).find(".swiper-button-nav");
    var val = $(this).val();
    $target.removeClass("swiper-button-black").removeClass("swiper-button-white");
    $target.addClass(val)
});

$(document).on("change", ".heroType", function () {
    var id = $(this).closest("aside").attr("rel");
    var $target = $(".layoutMapping #" + id);
    var val = $(this).val();
    if (val == 0) {

    }
});


$(document).on("click", ".theme-options .input-group-addon input[type=checkbox]", function () {
    var id = $(this).closest("aside").attr("rel");
    var $target = $(".layoutMapping #" + id);
    $target.find(".heading").toggleClass("enabled");
});



$(document).on("click", ".theme-options .add-tab", function () {
    var $parent = $(this).closest(".custom-options").find(".tab-entry");
    var $newButton = $(document.createElement("div"));
    var iteration = 0;
    iteration = $parent.find(".panel").size();
    iteration++;
    var stringy = '<div class="panel panel-default">' +
                                '<div class="panel-heading editableTitle">' +
                                    '<span>New Tab</span>' +
                                    '<button class="btn btn-default toggler"><i class="fa fa-chevron-down"></i></button>' +
                                '</div>' +
                                '<div class="panel-body" style="display: block;">' +
                                    '<label>Tab Text</label>' +
                                    '<input type="text" class="form-control realTimeEditable titleContent section-tab-tabtext" vale="New Tab" data-selector=".nav-tabs>li:nth-child(' + iteration + ') a">' +
                                    '<label>Tab Content</label>' +
                                    '<textarea class="form-control realTimeEditable section-tab-tabcontent" placeholder="new content" data-selector=".tab-content>.tab-pane:nth-child(' + iteration + ')" ></textarea>' +
                                    '<br /><br/>' +
                                    '<a href="#" class=" btn btn-sm btn-danger removeBtn"><i class="fa fa-times"></i> Remove</a>' +
                                '</div>' +
                           ' </div>';
    $parent.append(stringy);

    var id = $(this).closest("aside").attr("rel");
    var $preview = $(".layoutMapping #" + id );
    $preview.find(".nav-tabs").append("<li><a href='#tab-" + iteration + "'>New Tab</a></li>");
    $preview.find(".tab-content").append("<div class='tab-pane' id='tab-" + iteration + "'>Content " + iteration + "</div>");


    $preview.find(".nav-tabs a").click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
});


//$(document).on("click", ".theme-options .add-link", function () {
//    var $parent = $(this).closest(".custom-options").find(".link-entry");
//    var $newButton = $(document.createElement("div"));
//    var iteration = 0;
//    iteration = $parent.find(".panel").size();
//    iteration++;
//    var stringy = '<div class="panel panel-default">' +
//                                '<div class="panel-heading editableTitle">' +
//                                    '<span>New Link</span>' +
//                                    '<button class="btn btn-default toggler inverse"><i class="fa fa-chevron-down"></i></button>' +
//                                '</div>' +
//                                '<div class="panel-body" style="display: block;">' +
//                                    '<label>Text</label>' +
//                                    '<input type="text" class="form-control realTimeEditable titleContent" vale="New Button" data-selector=".link-wrapper a:nth-child(' + iteration + ')" name="linkText[' + iteration + ']">' +
//                                    '<label>Link</label>' +
//                                    '<input type="text" class="form-control" name="linkLink[' + iteration + ']">' +
//                                    '<label>Target</label>' +
//                                    '<div class="btn-group" rel="none" name="linkTarget[' + iteration + ']">' +
//                                        '<a class="btn btn-default active" data-val="_self">Normal</a>' +
//                                        '<a class="btn btn-default " data-val="_blank">New Window</a>' +
//                                    '</div>' +
//                                    '<br /><br/>' +
//                                    '<a href="#" class=" btn btn-sm btn-danger removeBtn"><i class="fa fa-times"></i> Remove</a>' +
//                                '</div>' +
//                           ' </div>';
//    $parent.append(stringy);

//    var id = $(this).closest("aside").attr("rel");
//    var $preview = $(".layoutMapping #" + id + " .link-wrapper");
//    $preview.append("<a href='#' class='footer-link'>New Link</a>")
//});



// bindings
$(document).on("click", ".visibilityToggle", function () {
    $(this).toggleClass("active");
    $(this).find(".fa").toggleClass("fa-eye fa-eye-slash");
    //var $buddy = $("#" + $(this).closest(".section").attr("rel"));
    var $buddy = $("#" + $(this).closest("aside").attr("rel"));
    if ($(this).hasClass("active")) {
        $buddy.show();
    } else {
        $buddy.hide();
    }
});


$(document).on("click", ".btn-json", function () {

    var mappings = Folder.SetLayoutJSON();

    var obj = {
        name: "layout1",
        id: "424234",
        folderId: $("#FolderID").val(),
        sections: mappings
    };


    var $active = $("#toptestbot .folder-tree-node-selected");
    var pid = $active.attr("pid");
    console.log($active);
    var method = $("#FolderAdminModalSaveMethod").val()

    var sects = $("#FolderAdminModal").find(".themer-options-wrapper").find(".section");

    $(".jsonpreview").remove();
    $("#FolderAdminModal .modal-body").append("<div class='jsonpreview'><pre></pre><a href='#' class='btn btn-danger btn-close'><i class='fa fa-times'></i></a></div>");
    console.log("this is the object");
    console.log(obj);
    console.log(mappings);

    var json = JSON.stringify(obj)
    $("textarea.section-customhero").html("").html("<pre>" + json + "</pre>");
    $("#MarketingfolderJsonBlob").val("<pre>" + json + "</pre>");
    $("#FolderAdminModal .modal-body .jsonpreview pre").html(JSON.stringify(obj, undefined, 4));
});

$(document).on("click", ".jsonpreview a", function () {
    $(this).closest(".jsonpreview").remove();
});

$(document).on("click", ".section-showtitle", function () {
    var id = $(this).closest("aside").attr("rel");
    var $target = $(".section-wrapper #" + id).find(".title");
    if ($target.length) {

    } else {
        var $base = $(".section-wrapper #" + id + " .content-wrapper");
        var $title = $(document.createElement("div"));
        $title.addClass("title");
        var title = $(this).closest("aside").find(".section-title").val();
        $title.append("<h2>" + title + "</h2>");
        $base.prepend($title)
    }
    var check = false;
    if ($(this).prop("checked")) {
        check = $(this).prop("checked")
    }
    if (check == false) {
        //alert("it is checked");
        $target.addClass("hidden");
    } else {
        //alert("it is not checked");
        $target.removeClass("hidden");
    }
});


$(document).on("keyup", ".realTimeEditable", function () {
    var val = $(this).val();

    var selector = $(this).attr("data-selector");
    
    var id = $(this).closest("aside").attr("rel");
    var isNoAccess = false;
    if (id == "no_access") {
        isNoAccess = true;
    }
    console.log("id: ", id)
    if ($(this).hasClass("external")) {
        $(selector).html(val);
        if (selector == "#footerCompanyName") {
            var orig = $("head title").html();
            orig = orig.substring(orig.indexOf("|"), orig.length);
            $("head title").html(val + " " + orig)
        }
    } else {
        // check if you need to rename the section (like with buttons)
        if ($(this).closest(".panel").find(".panel-heading").hasClass("editableTitle") && $(this).hasClass("titleContent")) {
            $(this).closest(".panel").find(".panel-heading span").html(val);
        }
        
            var $target = $(".section-wrapper #" + id);
        
        

        if (id == "social") {
            if ($(this).attr("type") == "number") {
                $target.find(selector).css("height", val + "px");
            } else if ($(this).hasClass("section-title")) {
                $target.find(selector).html(val);
            } else if ($(this).hasClass("section-description")) {
                $target.find(selector).html(val);
            } else {
                // it's the source
                var isIframe = false;
                if (val.indexOf("iframe") > -1) {
                    isIframe = true;
                    var newSrc = $(val).attr("src");
                    var newHeight = $(val).attr("height");

                    val = newSrc;
                   
                }
                $target.find(selector).attr("src", val);

                if (isIframe == true) {
                   $(this).val(val)
                }
                
            }

        } else {
            $target.find(selector).html(val);
        }
    }
   

});

$(document).on("click", ".btnUpload", function () {
    var d = new Date();
    var n = d.getTime();
    var id = "dropzone_" + n;
    var form = '<form action="/app/dam/SiteAdministration/Branding/UploadSiteSettingLogo/marketing/?name=mappify"' +
                  'class="dropzone"'+
                  'enctype="multipart/form-data"'+
                  'id="'+id+'">'+
                '<input type="file" name="uploadFile[]" id="" class="form-control" />'+
            '</form>';
    $(this).parent().find(".uploadForm").prepend(form);
    initDropzone(id);
           

});

$(document).on("click", ".uploadForm .selected-list .input-group-addon", function () {
    var id = $(this).closest("aside").attr("rel");
    $(this).closest("li").remove();
    var $preview = $(".layoutMapping #" + id);
    $preview.css("backgroundImage", "none");
});


$(document).on("click", ".asset-actions .btn", function () {
    
    var $parent = $(this).closest(".asset-picker");
    var $target = $parent.parent().find(".selected-list");
    $target.show();
    var list = [];
    var id = $(this).closest("aside").attr("rel");
    var $preview = $(".layoutMapping #" + id);
    var $list = $parent.parent().find(".selected-list ul");
    $list.html("");
    var singeSrc = "";
    $parent.find("a.selected").each(function () {
        list.push($(this));
        singleSrc = $(this).attr("detailsrc");
        $list.append("<li><div class='input-group'><span class='form-control disabled' data-src='"+  $(this).attr("thumbsrc") +"'>" + $(this).attr("name") + "</span><span class='input-group-addon'><a href='#'><i class='fa fa-times'></i></a></span></li>");
    });
    var id = $(this).closest("aside").attr("rel");
    if($parent.hasClass("single")){
        // apply background


       
        //console.log(id);
        $preview.css("background-image", "url(" + singleSrc + ")");

    } else {
        // get list
        
        if (id == "assets") {
            var $target = $preview.find(".grid");
            $target.html("");

        } else {
            var $target = $preview.find(".content .swiper-wrapper");
        }
        $parent.find("a.selected").each(function () {
          
            var src = $(this).attr("thumbsrc");
            //console.log(src);

            if (id == "assets") {
                
                var string = '<div class="grid-item2 col-sm-3"><a href="#"><img src="' + src + '" /></a></div>';
                $target.append(string);

            } else {

               
                var string = '<div class="swiper-slide item" >' +
                                '<img class="preview-carousel " mediaid="2916192" src="' + src + '">' +
                            '</div>';
                $preview.find(".content .swiper-wrapper").append(string);
                
            }

        });

        if (id == "assets") {
            // masonry
        } else {
            var swiperTest = new Swiper('.swiper-container-carousel', {
                navigation: {
                    nextEl: '.swiper-button-carousel-next',
                    prevEl: '.swiper-button-carousel-prev',
                },
                slidesPerView: 5,
                spaceBetween: 30,
                breakpoints: {
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
                },
                pagination: {
                    el: '.swiper-pagination-carousel',
                    clickable: true,
                },


            });
        }
    }
    

    $parent.parent().find(".asset-picker-button").click();
    
});


$(document).on("click", ".layoutMapping .themer-layout-wrapper section", function () {
    var id = $(this).attr("id");
    $(".theme-options section .toggler").removeClass("inverse");
    $(".theme-options section .panel-body:visible").hide();
    $(".theme-options section[rel='" + id + "'] >.panel>.panel-heading .toggler").addClass("inverse");
    $(".theme-options section[rel='" + id + "'] >.panel>.panel-body").show();
});





function loadMappifier(id) {
    var loading = '<div class="loadinggif" style="display:block; position: absolute;">' +
                            '<img class="spinnergif" src="/app/dam/Images/spinner.gif" />' +
                            '<span class="sr-only">Loading...</span>' +
                        '</div>';

    $(".themer-row.main").css("position", "relative").html(loading);

    var path = $("#FolderPath").val()


    var ajaxurl = 'SiteAdministration/MarketingAdmin/GetMappifierForFolder/' + id + "?path=" + path;
    var jsonData = null;
    console.log("ajax", ajaxurl)
    $.ajax({
        url: ROOT + ajaxurl,
        type: "get",
        contentType: 'text/html',
        success: function (results) {

            $(".layoutMapping").find(".themer-row.main").html(results);
            $("section[rel='folders'], #folders").remove();
            var $home = $(".layoutMapping .themer-layout-wrapper .section#custom_hero");
            if (true) {
                var heroContent = $home.find(".hero-content").html();

                var $optionBuddy2 = $(".themer-options-wrapper section[rel='custom_hero']");

                //find the json
                var jsonny = $home.find(".hero-content pre").text();
                if (jsonny.charAt(0) == "{") {
                    jsonData = JSON.parse(jsonny);

                    //console.log(jsonData);
                    //console.log("sections");

                    var rightMap = [];

                    var sects = jsonData.sections;
                    for (var k = 0; k < sects.length; k++) {
                        console.log(sects[k]);
                        var showwy = sects[k].Show;
                        var id = sects[k].ViewID;
                        rightMap.push(id);

                        if (showwy) {

                            //console.log(sects[k].ViewID + " show ");
                            $("section[rel='" + id + "']").find(".visibilityToggle").addClass("active");
                            $("section[rel='" + id + "']").find(".visibilityToggle .fa").addClass("fa-eye").removeClass("fa-eye-slash");
                        } else {

                            //console.log(sects[k].ViewID + " hide ");
                            $("section[rel='" + id + "']").find(".visibilityToggle").removeClass("active");
                            $("section[rel='" + id + "']").find(".visibilityToggle .fa").removeClass("fa-eye").addClass("fa-eye-slash");
                            $("section.section#" + id).hide();
                        }


                        var thisBG = sects[k].Background;
                        var bgColor = (thisBG.hasOwnProperty("color") ? thisBG.color : "inherit");
                        var txtColor = (thisBG.hasOwnProperty("text") ? thisBG.text : "#333");

                        //console.log(bgColor)
                        $("#" + id).css("background-color", bgColor).css("color", txtColor);
                        var $colorBuddy = $("section.section[rel='" + id + "']");
                        $colorBuddy.find(".textColor .form-control").val(txtColor);
                        $colorBuddy.find(".textColor .input-group-addon i").css("background-color", txtColor);
                        $colorBuddy.find(".bgColor .form-control").val(bgColor);
                        $colorBuddy.find(".bgColor .input-group-addon i").css("background-color", bgColor);

                        if (id == "footer") {
                            console.log("repopulate footer");
                            var footerLinks = (sects[k].hasOwnProperty("FooterLinksList") ? sects[k].FooterLinksList : []);

                            // rebuild preview
                            var $linkWrap = $("#footer .link-wrapper");
                            if (footerLinks.length > 0) {
                                for (var f = 0; f < footerLinks.length; f++) {
                                    var indexy = f + 1;
                                    console.log("footer link #" + f)
                                    console.log(footerLinks[f]);
                                    var title = footerLinks[f].title;
                                    var link = footerLinks[f].link;
                                    var target = footerLinks[f].target;

                                    if ($linkWrap.find("a:nth-child(" + indexy + ")").length) {
                                        //console.log("footer text: " + title);
                                        var $target = $linkWrap.find("a:nth-child(" + indexy + ")");
                                        $target.html(title);
                                        $target.attr("href", link);
                                        $target.attr("target", target);

                                        if ($(".themer-options-wrapper .link-entry>.panel:nth-child(" + indexy + ")").length) {
                                            var $optionSection = $(".themer-options-wrapper .link-entry>.panel:nth-child(" + indexy + ")");
                                            $optionSection.find(".panel-heading span").html(title);
                                            $optionSection.find(".titleContent").val(title);
                                            $optionSection.find(".titleLink").val(link);
                                            $optionSection.find(".linkTarget a").removeClass("active");
                                            $optionSection.find(".linkTarget a[data-val='" + target + "']").addClass("active");
                                        }

                                    } else {
                                        //create
                                        console.log("make link");
                                        var $newLink = $(document.createElement("a"));
                                        $newLink.attr("href", link);
                                        $newLink.html(title);
                                        $newLink.attr("target", target);
                                        $linkWrap.append($newLink);

                                        //and backfill again
                                        $panny = $(document.createElement("div"));
                                        $panny.addClass("panel panel-default");

                                        var $panelHead = $(document.createElement("div"));
                                        $panelHead.addClass("panel-heading editableTitle");
                                        $panelHead.html("<span>" + title + "</span>");
                                        $panelHead.append('<button class="btn btn-default toggler inverse"><i class="fa fa-chevron-down"></i></button>');
                                        var $panelBody = $(document.createElement("div"));
                                        $panelBody.addClass("panel-body");
                                        var targetClassSelf = "";
                                        var targetClassBlank = "";
                                        if (target == "_self") {
                                            targetClassSelf = "active";
                                        } else {
                                            targetClassBlank = "active";
                                        }
                                        var stringy = '<label>Link Text</label>' +
                                            '<input type="text" class="form-control realTimeEditable titleContent" value="' + title + '" data-selector=".content .link-wrapper a:nth-child(' + indexy + ')">' +
                                            '<label>Link</label>' +
                                            '<input type="text" class="form-control titleLink" value="' + link + '" data-selector=".content .link-wrapper a:nth-child(' + indexy + ')">' +
                                            '<label>Target</label>' +
                                            '<div class="btn-group linkTarget" rel="none" name="buttonTarget[' + indexy + ']" data-selector=".content .link-wrapper a:nth-child(' + indexy + ')">' +
                                                '<a class="btn btn-default ' + targetClassSelf + '" data-val="_self">Normal</a>' +
                                                '<a class="btn btn-default ' + targetClassBlank + '" data-val="_blank">New Window</a>' +
                                            '</div>' +
                                            '<br><br>' +
                                            '<a href="#" class="removeBtn btn btn-sm btn-danger"><i class="fa fa-times"></i> Remove</a>';
                                        $panelBody.append(stringy);

                                        $panny.append($panelHead, $panelBody);
                                        $(".themer-options-wrapper .link-entry").append($panny);

                                    }
                                }
                            }
                        }
                    }


                    $(".themer-options-wrapper .theme-options section").each(function (index, elem) {
                        var id = $(this).attr("rel");

                        var indexToBe = rightMap.indexOf(id);
                        //console.log("index to be: " + indexToBe + " vs " + index);
                        //var $partner = $(".layout-preview-wrapper>section:nth-child(" + indexToBe + ")");
                        //$(this).detach().insertBefore($partner);

                        var cols = $(".themer-options-wrapper .theme-options section");
                        if (indexToBe < index) {
                            cols.eq(index).detach().insertBefore(cols.eq(indexToBe));
                        } else if (index > index) {

                            cols.eq(index).detach().insertAfter(cols.eq(indexToBe));
                        }
                    });

                    // more prepopulation, like order
                    updateMappingOrder(rightMap);


                } else {
                    // not valid json
                }
            }

            $.getScript("/app/dam/Scripts/Plugins/colorpicker/js/bootstrap-colorpicker.min.js", function (data, textStatus, jqxhr) {
                //console.log(data); // Data returned
                //console.log(textStatus); // Success
                //console.log(jqxhr.status); // 200
                //console.log("Load of colorpicker was performed.");
                var $css = $(document.createElement("link"));
                $css.attr("href", "/app/dam/Scripts/Plugins/colorpicker/css/bootstrap-colorpicker.css");
                $css.attr("rel", "stylesheet");
                $("head").append($css);

                //copy prepopulation to options side
                $(".layoutMapping .themer-layout-wrapper .section").each(function () {
                    var id = $(this).attr("id");
                    $optionBuddy = $(".themer-options-wrapper section[rel='" + id + "']");
                    var $node = $(this);
                    // heading?
                    var $head = $(this).find(".heading");
                    if ($head.hasClass("enabled")) {
                        var title = $head.find("h1").text();
                        //alert(title);
                        $optionBuddy.find(".section-title").val(title);
                        $optionBuddy.find(".section-showtitle").prop("checked", true);
                    }
                    //desc
                    var $desc = $(this).find(".description");
                    var desc = $.trim($desc.html());
                    if (desc != "") {
                        $optionBuddy.find(".section-description").val(desc);
                    }

                    var backgroundSrc = $(this).css("background-image");
                    if (backgroundSrc != "none" && backgroundSrc.indexOf("url") > -1) {
                        backgroundSrc = backgroundSrc.substring(5, backgroundSrc.length - 2);
                        //console.log("background for " + id + ": " + backgroundSrc);

                        $optionBuddy.find(".background-selector").show().find(".background-input").html("Image Loaded").attr("data-src", backgroundSrc).show();

                        var backgroundRepeat = $(this).css("background-repeat");
                        $optionBuddy.find(".section-repeat").val(backgroundRepeat);

                        var backgroundSize = $(this).css("background-size");
                        $optionBuddy.find(".section-size").val(backgroundSize);
                        //TODO
                        //background-position not being saved

                    }




                    if (id == "buttons") {
                        var idx = 1;
                        $(this).find(".content .btn-default").each(function () {
                            var text = $.trim($(this).html());
                            var link = $(this).attr("href");
                            var target = $(this).attr("target");
                            var $panel = $optionBuddy.find("#button-section .button-entry>div.panel:nth-child(" + idx + ")");

                            if ($panel.length) {
                                console.log("button got it");
                            } else {
                                console.log("button no exist");
                                $panel = $(document.createElement("div"));
                                $panel.addClass("panel panel-default");
                                var stringy = '<div class="panel-heading editableTitle">' +
                                        '<span>title</span>' +
                                        '<button class="btn btn-default toggler inverse"><i class="fa fa-chevron-down"></i></button>' +
                                    '</div>' +
                                    '<div class="panel-body" style="display: block;">' +
                                        '<label>Text</label>' +
                                        '<input type="text" class="form-control realTimeEditable titleContent section-button-text" value="New Button" data-selector=".button-wrapper .btn:nth-child(' + idx + ')" name="buttonText[0]">' +
                                        '<label>Link</label>' +
                                        '<input type="text" class="form-control section-button-link" name="buttonLink[' + idx + ']">' +
                                        '<div class="form-group">' +
                                            '<label>Target</label>' +
                                            '<div class="btn-group section-button-target" rel="none" name="buttonTarget[' + idx + ']">' +
                                                '<a class="btn btn-default" data-val="_self">Normal</a>' +
                                                '<a class="btn btn-default active" data-val="_blank">New Window</a>' +
                                            '</div>' +
                                        '</div>' +
                                        '<br><br>' +
                                        '<a href="#" class="removeBtn btn btn-sm btn-danger"><i class="fa fa-times"></i> Remove</a>' +
                                    '</div>';
                                $panel.html(stringy);
                                $optionBuddy.find("#button-section .button-entry").append($panel);
                            }
                            $panel.find(".section-button-text").val(text);
                            $panel.find(".panel-heading span").text(text);
                            $panel.find(".section-button-link").val(link);
                            $panel.find(".section-button-target a").removeClass("active");
                            $panel.find(".section-button-target a[data-val='" + target + "']").addClass("active");

                            idx++;
                        });
                    }
                    if (id == "custom_html") {
                        var customHTML = $.trim($(this).find(".content").html());
                        $optionBuddy.find(".section-customhtml").html(customHTML);
                        //console.log(customHTML);
                    }

                    var styleContent = $.trim($(this).find("style.custom").html());
                    //styleContent = styleContent.replace(/^\s+|\s+$/gm, '');
                    //console.log(id, styleContent);
                    $optionBuddy.find(".section-customcss").html(styleContent);

                    var $framey = $(this).find("iframe");

                    var iframeSrc = $framey.attr("src");
                    var iframeHeight = $framey.height();
                    //iframeHeight = parseInt(iframeHeight.substring(0, iframeHeight.length - 2));
                    $optionBuddy.find(".section-iframesrc").val(iframeSrc);
                    $optionBuddy.find(".section-iframeheight").val(iframeHeight);



                    if (id == "tabs") {
                        var $panelWrapper = $optionBuddy.find(".tab-entry");
                        var counter1 = 1;
                        var $tabNode = $(this);
                        $(this).find(".tab-container .nav-tabs li").each(function () {
                            var linkText = $(this).find("a").text();
                            $(this).attr("data-count", counter1 - 1);

                            var $panel = $panelWrapper.find(".panel:nth-child(" + counter1 + ")");
                            if ($panel.length) {
                                //console.log("got this tab");
                                $panel.find(".panel-heading span").text(linkText);
                                $panel.find(".section-tab-tabtext").val(linkText);
                            } else {
                                //console.log("doesn't exist");
                                $optionBuddy.find(".add-tab").trigger("click");
                                $tabNode.find(".tab-container .nav-tabs li:last-child").remove();
                                $panel = $panelWrapper.find(".panel:nth-child(" + counter1 + ")");
                                $panel.find(".panel-heading span").text(linkText);
                                $panel.find(".section-tab-tabtext").val(linkText);
                            }
                            //console.log($panel);
                            //console.log(linkText);


                            $panel = $panelWrapper.find(".panel:nth-child(" + counter1 + ")");
                            var $content = $tabNode.find(".tab-content .tab-pane:nth-child(" + counter1 + ")");
                            $content.attr("data-count", counter1 - 1);
                            var tabContent = $content.html();
                            //tabContent = tabContent.replace(/\s/g, '');
                            //console.log(tabContent);
                            $panel.find(".section-tab-tabcontent").html(tabContent);
                            counter1++;
                        });
                    }

                    if ($(this).find(".sub-shortcut-list").length) {
                        var dataVals = "";

                        $(this).find(".sub-shortcut-element").each(function () {
                            var id = $(this).find("a.sub-maincontext-link").attr("data-page");
                            dataVals += id + ",";
                        });
                        dataVals = dataVals.substring(0, dataVals.length - 1);
                        $optionBuddy.find(".asset-picker-button.folder").attr("data-vals", dataVals);
                    }

                    // init sorting
                    $(".themer-options-wrapper .theme-options").sortable({
                        placeholder: "ui-state-highlight",
                        helper: "clone",
                        handle: ".panel-heading",
                        items: ".section",
                        update: function (event, ui) {
                            console.log(ui);

                            var rightMap = [];
                            $(".theme-options.ui-sortable>section").each(function (index, elem) {
                                var rel = $(this).attr("rel");
                                rightMap.push(rel);
                            });

                            updateMappingOrder(rightMap);

                        }
                    });

                    if (id == "assets") {
                        var dataVals = "";
                        $("#assets .grids a").each(function () {
                            var mediaid = $(this).attr("data-id");
                            dataVals += mediaid + ",";
                        });
                        dataVals = dataVals.substring(0, dataVals.length - 1);
                        $(".asset-picker-button").attr("data-vals", dataVals);
                    }

                    if (id == "carousel") {

                        var dataVals = "";
                        $(this).find(".swiper-wrapper .swiper-slide img").each(function () {
                            dataVals += $(this).attr("mediaid") + ",";
                        });
                        dataVals = dataVals.substring(0, dataVals.length - 1);
                        $optionBuddy.find(".asset-picker-button.image").attr("data-vals", dataVals);

                        var swiperTest = new Swiper('.swiper-container-carousel', {
                            navigation: {
                                nextEl: '.swiper-button-carousel-next',
                                prevEl: '.swiper-button-carousel-prev',
                            },
                            slidesPerView: 2,
                            spaceBetween: 30,
                            breakpoints: {
                                1024: {
                                    slidesPerView: auto,
                                    spaceBetween: 40,
                                },
                                768: {
                                    slidesPerView: auto,
                                    spaceBetween: 30,
                                },
                                640: {
                                    slidesPerView: auto,
                                    spaceBetween: 20,
                                },
                                320: {
                                    slidesPerView: auto,
                                    spaceBetween: 10,
                                }
                            },
                            pagination: {
                                el: '.swiper-pagination-carousel',
                                clickable: true,
                            },


                        });
                    }



                    // colorpickers

                    $(".themer-options-wrapper section.section").each(function (index, elem) {
                        var idx = $(this).attr("rel");
                        var $text = $(this).find(".textColor");
                        $text.attr("id", idx + "_text_" + index);
                        var $bg = $(this).find(".bgColor");
                        $bg.attr("id", idx + "_bg_" + index);

                        //console.log("making color picker")
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
                    });





                });
                // size the modal
                var height = $(window).height();
                $(".layoutModal .themer-row.main");


                $("#FolderAdminModal .modal-footer").append("<button class='btn btn-default btn-json'>Gimme Json</button>");
                // add json button
                var folderID = $("#FolderID").val();
                $("#FolderAdminModal .modal-footer").append("<a class='btn btn-default btn-preview pull-left' href='/app/dam/Marketing/Site/Index/" + folderID + "' target='_blank'>Preview Folder</a>");


            });

        }

    }).fail(function (xhr) {
        AjaxErrorHandler(xhr)
    });
    return false;
}