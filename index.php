<!DOCTYPE html>
<html class=" js flexbox canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="icon" type="image/x-icon" class="js-site-favicon" href="icon.png">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="google-translate-customization" content="2b4bd1c495140789-38d576b19769d098-g14813c245c3ff107-e">

<title>MyMediaBox PA</title>		

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

<link rel="stylehseet" href="swiper-4.4.2/dist/css/swiper.css" />
<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/black-tie/jquery-ui.css" />

<link rel="stylesheet" href="lib/swiper.css" />
<link rel="stylesheet" href="lib/swiper-custom.css" />

<link rel="stylesheet" href="marketing2.css" />
  <!-- libs -->
  <script src="lib/swiper.js"></script>
</head>
<body>

<div class="container-fluid">
<div class="row mainRow">
	<div class="col-sm-3 options">
    <div class="btn btn-group optionRow">
      <button class="btn btn-success saveJSON" type="button">
        <i class="fa fa-check"></i> Save JSON
      </button>
      <button class="btn btn-default toggleEdit" type="button">
        <i class="fa fa-eye"></i> Preview Mode
      </button>
    </div>
		<ul class="list-group AvailableToolbars">

    </ul>
	</div>
	<div class="col-sm-9 mainContent">

<div class="droppableContainer">
	<article class="SaveDataContainer VisibleToolbarList ToolbarItem" auth="admin" foldername="needs-approval">
	<?php //include "sections.php"; ?>
  	</article>                                            
</div>

	</div>
</div>
</div>

<div id="optionModal" data-type="" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title"><span></span> Options</h4>
      </div>
      <div class="modal-body">
        <p><i class="fa fa-spinner fa-spin"></i></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button class="btn btn-success saveModal"><i class="fa fa-check"></i> Save</button>
      </div>
    </div>

  </div>
</div>
<script>
var edit = <?php if(isset($_REQUEST['edit'])){echo "true";}else {echo "false";} ?>;
</script>
<script
  src="https://code.jquery.com/jquery-2.2.4.min.js"
  integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
  crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script
  src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"
  integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU="
  crossorigin="anonymous"></script>
  <script src="sample.js"></script>
  <script src="newsample.js"></script>
  <script src="options.js"></script>
  <script src="bobthebuilder.js"></script>


</body>
</html>
