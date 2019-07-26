<ul class="list-group AvailableToolbars">
	<li class="AvailableToolbar ui-sortable-handle list-group-item" data-id="section" toolbarcode="add_markup">
        <div class="headerBar">
            <a href="#" class="btn btn-default btn-sm mover">
                <i class="fa fa-arrows-v"></i>
            </a>
            <span class="title">Section</span>
            <a href="javascript:;" class="btn btn-default removeItem btn-sm">
                <i class="fa fa-times text-danger"></i>
            </a>
            <input type="text" class="ValueBox form-control" value="section_" onchange="LabelChanged(this);">
            
        </div>
        <ul class="VisibleToolbarList">
            <li class="initial">Add content</li>
        </ul>

        <span class="ShowOnAvail">Add Section</span>
        <a class="ShowOnUse btn btn-default default-sm mover" style="display:none;">
            <i class="fa fa-arrows-v"></i>
            
        </a>
        <a onclick="RemoveMenuItem(this);" href="javascript:;" class="ShowOnUse btn btn-default btn-sm" style="display:none;">
            <i class="fa fa-times text-danger"></i>

        </a>
    </li>
    <li class="AvailableToolbar ui-sortable-handle list-group-item" data-id="columns" toolbarcode="add_markup">
        
        <div class="headerBar">
            <a href="#" class="btn btn-default btn-sm mover">
                <i class="fa fa-arrows-v"></i>
               
            </a>
            
            <input type="text" class="ValueBox" value="Authorize" onchange="LabelChanged(this);">
            <a onclick="RemoveMenuItem(this);" href="javascript:;" class="btn btn-default btn-sm">
                <i class="fa fa-times text-danger"></i>
         
            </a>
        </div>
        <ul class="VisibleToolbarList">
            <li class="initial">Add content</li>
        </ul>

        <span class="ShowOnAvail">Add Columns</span>
        <a class="ShowOnUse btn btn-default default-sm mover" style="display:none;">
            <i class="fa fa-arrows-v"></i>
           
        </a>
        <input type="text" class="ValueBox ShowOnUse" style="display:none;" value="Add Comments..." onchange="LabelChanged(this);">
        <a onclick="RemoveMenuItem(this);" href="javascript:;" class="ShowOnUse btn btn-default btn-sm" style="display:none;">
            <i class="fa fa-times text-danger"></i>
    
        </a>
    </li>
</ul>