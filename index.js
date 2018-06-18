
/*
  Table of Contents:
  0.    Global Variables
  I.    Form Save/Load functions
  II.   Table display and helper functions
  III.  DB Functions
  IV.   UI Functions
  V.    Initialization Code
*/

/*
  0.    Global Variables
*/

/*
  The default run_obj data structure.  When the form needs to be cleared, this is used.

  It also serves as a guideline for the layout of a run_obj.
*/
var default_run = { dateval:new Date(), id:-1, distance:0, units:"Km", duration:0, comments:"" };

/*
  The "DB" of runs.
*/
var run_list = [];

/*
  I.    Form Save/Load functions
*/

/*
  function load_run_to_form( run_obj )
  
  Loads the contents of the run_obj specified into the form.

  Parameters:
    run_obj   (run_obj)
      The run_obj from which to load the data.
  Returns:
    none
  Throws:
    none
*/
function load_run_to_form( run_obj )
{
  document.getElementById('rundate').valueAsDate = new Date( run_obj.dateval );
  document.getElementById('distance_unit').value = run_obj.units;
  document.getElementById('run_id').value = run_obj.id;
  document.getElementById('distance').value = run_obj.distance;
  document.getElementById('duration').value = run_obj.duration;
  document.getElementById('comments').value = run_obj.comments;
}

/*
  function get_run_from_form()
  
  Creates a new run_obj, and populates it with the contents of the form.

  Parameters:
    none
  Returns:
    (run_obj)
      A run_obj containing the information in the form.
  Throws:
    none
*/
function get_run_from_form()
{
  run_obj = {};
  run_obj.dateval = document.getElementById('rundate').valueAsDate;
  run_obj.units = document.getElementById('distance_unit').value;
  run_obj.id = document.getElementById('run_id').value;
  run_obj.distance = document.getElementById('distance').value;
  run_obj.duration = document.getElementById('duration').value;
  run_obj.comments = document.getElementById('comments').value;
  return run_obj;
}

/*
  II.   Table display and helper functions
*/
/*
  function helper_draw_list_append_table(rlt, arr)
  
  Helper function to append a row to DOM table element RLT.
  
  Parameters:
    rlt   (DOM Table element) 
      The table to which the row will be added.
    arr   (String array)
      innerHTML for each column in the row.
  Return:
    null
  Throws:
    none
*/
function helper_draw_list_append_table(rlt, arr)
{
  if( rlt.appendChild == null )
  {
    throw "draw_list_append_table_helper: RLT is not a valid DOM object.";
  }

  var tr1 = document.createElement('tr');
  for(var k = 0; k < arr.length; ++k )
  {
    var td = document.createElement('td');
    td.innerHTML = arr[k];
    tr1.appendChild( td );
  }
  rlt.appendChild(tr1);
}

/*
  function helper_purge_element(dom_element)

  Helper function to clear sub elements from a DOM element.

  Parameters:
    dom_element   (DOM element)
      the DOM element that will have children removed.
  Return:
    null
  Throws:
    none
*/
function helper_purge_element(dom_element)
{
  while( dom_element.firstChild ) dom_element.removeChild( dom_element.firstChild );
}

/*
  function draw_list()

  populate the list box with the contents of run_list.

  Parameters:
    none
  Returns:
    none
  Throws:
    none
*/
function draw_list()
{
  var rlt = document.getElementById('run_list');
  helper_purge_element( rlt ); 
  helper_draw_list_append_table(rlt, ["ID", "Date", "Distance", "Duration", ""]);

  for( var i = 0; i < run_list.length; ++i )
  {
    helper_draw_list_append_table( rlt, [ i, run_list[i].dateval, run_list[i].distance + " " + run_list[i].units, run_list[i].duration, 
      "<button onclick=\"ui_tbutton(id);\"id=\"tb_edit_" + i + "\">Edit</button>",
      "<button onclick=\"ui_tbutton(id);\"id=\"tb_del_" + i + "\">Delete</button>" ] );
  }
}

/*
  III. DB Functions
*/
/*
  load the database of runs from the local storage into list.

  Parameters:
    none
  Returns:
    none
  Throws:
    none
*/
function load_db()
{
  run_list = JSON.parse( localStorage.getItem("run_db") );
}

/*
  save the db to local storage

  Parameters:
    none
  Returns:
    none
  Throws:
    none
*/
function save_db()
{
  localStorage.setItem("run_db", JSON.stringify( run_list ) );
}

/*
  function append_db( run_obj )

  Appends a run_obj to the db.  The run will be 
    added to the end of the list.

  Parameters:
    run_obj   (Run object)
      The run_obj to append.  ID will be ignored.
  Return:
    The new ID of the run.
  Throws:
    nothing.
*/
function append_db( run_obj )
{
  var idx = run_list.length;
  run_obj.id = idx;
  run_list[idx] = run_obj;
  return idx;
}

/*
  function update_db( run_obj ) 

  Overwrites a run_obj in the db.  
    The run at the index specified by run_obj.id will be replaced by run_obj.

  Parameters:
    run_obj   (Run object)
      The run_obj to append.  ID will be ignored.
  Return:
    The ID of the run.
  Throws:
    An exception if the ID is not in use.
*/
function update_db( run_obj )
{
  if( run_list[ run_obj.id ] == null )
  {
    throw "get_from_db(" + idx + "): ID is invalid";
  }
  run_list[ run_obj.id ] = run_obj;
  return run_obj.id;
}

/*
  function get_from_db( idx ) 

  Retrieves the run_obj at index IDX.

  Set's the ID of the resulting run_obj to be correct,
    as ID field of runs stored in the table is not guaranteed to be
    correct.

  Parameters:
    run_obj   (Run object)
      The run_obj to append.  ID will be ignored.
  Return:
    The new ID of the run.
  Throws:
    An exception when ID is invalid.
*/
function get_from_db( idx )
{
  if( run_list[ idx ] == null )
  {
    throw "get_from_db(" + idx + "): ID is invalid";
  }
  var run_obj = run_list[ idx ];
  run_obj.id = idx;
  return run_obj;
}

/*
  function delete_from_db( idx )

  Deletes the item at idx in the database.  This shifts the IDs of
  everything.

  Parameters:
    idx   (int)
      The index to remove.
  Return:
    The ID removed.
*/
function delete_from_db( idx )
{
  run_list.splice( idx, 1);
  return idx;
}

/*
    IV.   UI functions
*/
/*
  function ui_edit( idx )

  Loads the item at index idx from the database into the form,
    and displays the form.

  Parameters:
    idx   (int)
      Index in the db.
  Returns:
    null
  Throws:
    Exception from get_from_db gets thrown when idx is invalid.
*/
function ui_edit( idx )
{
  load_run_to_form( get_from_db( idx ) );
}

/*
  function ui_delete( idx )

  UI handler for delete buttons.
  -Delete item in db at position specified by idx.
  -Save the db.
  -Redraw the list.
  TODO: Put yes/no box.

  Parameters:
    idx   (int)
      The index to delete.
  Returns:
    null
  Throws:
    Nothing directly.  May have internal exception.
*/
function ui_delete( idx )
{
  delete_from_db( idx );
  save_db();
  draw_list();
}

/*
  function ui_tbutton( id )

  Parses the name of a button in the table.  The buttons may be called
    tb_edit_# or tb_del_#, where # is the ID in the DB.

  Parameters:
    id    (string)
      The id of the button.
  Returns:
    null
  Throws:
    nothing directly.
*/
function ui_tbutton( id )
{
  var sp = id.split("_");
  if( sp[0] == 'tb' )
  {
    if( sp[1] == 'edit' )
    {
      ui_edit( parseInt( sp[2] ) );
    }
    else if( sp[1] == 'del' )
    {
      ui_delete( parseInt( sp[2] ) );
    }
  }
  else
  {
    alert('button name is incorrect.');
  }
}

/*
  function ui_save_form()
  
  -Saves the form into the database
  -Saves the db
  -Clears the form
  -Draws the list.

  Parameters:
    none
  Returns:
    none
  Throws:
    none
*/
function ui_save_form()
{
  var run_obj = get_run_from_form();
  if( run_obj.id == -1 )
  {
    append_db( run_obj );
  }
  else
  {
    update_db( run_obj );
  }

  load_run_to_form( default_run );
  save_db();
  draw_list();
}

/*
  function ui_new_form()

  -Clears the form.
  TODO: Put YES/NO box.
  
  Parameters:
    none
  Returns:
    none
  Throws:
    none
*/
function ui_new_form()
{
  load_run_to_form( default_run );

}

/*
    V.   Initialization Code
*/

//Set up dialog functions.
document.getElementById('button_save_run_dlg').onclick = ui_save_form;
document.getElementById('button_new_run_dlg').onclick = ui_new_form;

//Clear the form.
load_run_to_form( default_run );

//Load the DB and draw the list.
load_db();
draw_list();

