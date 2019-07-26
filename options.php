<ul class="list-group AvailableToolbars">
	<li class="AvailableToolbar ui-sortable-handle list-group-item" data-id="section" toolbarcode="add_markup">
        <div class="optionWrapper panel panel-default">
            <div class="panel-display">
               
                <span class="title">Section</span>
            </div>
            <div class="panel-heading">
             <a href="#" class="btn btn-default btn-sm mover">
                <i class="fa fa-arrows-v"></i>
            </a>
            <span class="title">Section</span>
            <a href="javascript:;" class="btn btn-default removeItem btn-sm">
                <i class="fa fa-times text-danger"></i>
            </a>
            <input type="text" class="ValueBox form-control" value="section_" onchange="LabelChanged(this);">
            </div>

            <div class="panel-body">


                <ul class="VisibleToolbarList">
                    <li class="initial">Add content</li>
                </ul>

                
                <a class="ShowOnUse btn btn-default default-sm mover" style="display:none;">
                    <i class="fa fa-arrows-v"></i>
                    
                </a>
                <a onclick="RemoveMenuItem(this);" href="javascript:;" class="ShowOnUse btn btn-default btn-sm" style="display:none;">
                    <i class="fa fa-times text-danger"></i>

                </a>

            </div>
        </div>
    </li>
    <li class="AvailableToolbar ui-sortable-handle list-group-item" data-id="columns" toolbarcode="add_markup">
        
        <div class="optionWrapper panel panel-default">
            <div class="panel-display">
                
                <span class="title">Columns</span>
            </div>
            
            <div class="panel-heading">
            <a href="#" class="btn btn-default btn-sm mover">
                    <i class="fa fa-arrows-v"></i>
                </a>
                <span class="title">Columns</span>
                <a onclick="RemoveMenuItem(this);" href="javascript:;" class=" removeItem btn btn-default btn-sm">
                    <i class="fa fa-times text-danger"></i>
                </a>
                <input type="text" class="ValueBox" value="Authorize" onchange="LabelChanged(this);">
            </div>

            <div class="panel-body">
                <div class="panel-options">
                    options
                </div>
                <div class="realContent">
                    <div class="row columnWrapper" >
                        <div class="col-sm-6">
                            <ul class="VisibleToolbarList">
                                <li class="initial">Add content</li>
                            </ul>
                        </div>
                        <div class="col-sm-6">
                            <ul class="VisibleToolbarList">
                                <li class="initial">Add content</li>
                            </ul>   
                        </div>
                    </div>
        

       
                    <a class="ShowOnUse btn btn-default default-sm mover" style="display:none;">
                        <i class="fa fa-arrows-v"></i>
                       
                    </a>
                    
                    <a onclick="RemoveMenuItem(this);" href="javascript:;" class="ShowOnUse btn btn-default btn-sm" style="display:none;">
                        <i class="fa fa-times text-danger"></i>
                
                    </a>

                </div>

         </div>
        </div>

    </li>
</ul>