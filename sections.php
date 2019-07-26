<li class="AvailableToolbar list-group-item ui-sortable-handle" toolbarcode="add_markup" style="display: block;">
        <div class="headerBar">
            <a href="#" class="btn btn-default btn-sm mover">
                <i class="fa fa-arrows-v"></i>
            </a>
            <span class="title">Section</span>
            <a href="javascript:;" class="btn btn-default btn-sm removeItem">
                <i class="fa fa-times text-danger"></i>

            </a>
            <input type="text" class="ValueBox form-control" value="section_234" onchange="LabelChanged(this);">
            
        </div>
    <ul class="VisibleToolbarList ui-sortable" style="">
        <li class="initial ui-sortable-handle">Add content</li>
    </ul>

        <span class="ShowOnAvail">Add Section</span>
        <a class="ShowOnUse btn btn-default default-sm mover" style="display:none;">
            <i class="fa fa-arrows-v"></i>
            <img src="/Images/Move.png" style="width:16px;" class="hidden">
        </a>
        <input type="text" class="ValueBox ShowOnUse" style="display:none;" value="Add Comments..." onchange="LabelChanged(this);">
        <a onclick="RemoveMenuItem(this);" href="javascript:;" class="ShowOnUse btn btn-default btn-sm" style="display:none;">
            <i class="fa fa-times text-danger"></i>
        <img src="/Images/Delete.png" style="width:16px;" class="hidden">
        </a>
    </li>