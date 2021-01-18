<script>
/**
@abstract This script is used to test the https://github.com/arabdevelop/svelte-formly
module for generating dynamic forms within Svelte.

interesting JSON template transformer for mapping data to a template
https://selecttransform.github.io/site/
*/
  import { objAppDbConn } from './stores.js';
  import { get } from "svelte/store";
  import { valuesForm, Field } from "svelte-formly";

  const objRecord = JSON.parse(sessionStorage.getItem("objRecord"));
  const ssrecordId = objRecord.uuid;
  let fieldConfigId = objRecord.apiid;
  let fields;
  let fieldsRaw;  // for editing records
  let tableName;

  // pull the dynamic form generation config from the local db
  function getFormFields() {
    console.log(fieldConfigId);
      var objectStore = $objAppDbConn.transaction(["FormConfig"], 'readonly').objectStore("FormConfig");
      var request = objectStore.get(fieldConfigId);

      request.onerror = function(e) {
          console.log('Error', e.target.error.name);
      };
      request.onsuccess = function(e) {
          if (request.result.fields) {
            tableName = request.result.name;  // get the table name
            if (ssrecordId) {
              console.log('buildForm edit entry'+ssrecordId);
              // edit form (for this we do not want to assign the fields constant until we have filled the values in the fields)
              fieldsRaw = JSON.parse(request.result.fields);
              getRecord();
            }
            else {
              console.log('buildForm new entry');
              // new entry
              fields = JSON.parse(request.result.fields);
            }
          }
      };
  }

  // retrieve record for editing
  function getRecord(){
      var objectStore = $objAppDbConn.transaction([tableName], 'readwrite').objectStore(tableName);
      var request = objectStore.get(ssrecordId);

      request.onerror = function(e) {
          console.log('Error', e.target.error.name);
      };
      request.onsuccess = function(e) {
          if (request.result) {
            //console.log(request.result);
            var dataArray = request.result;

            // foreach record element
            for( var key in dataArray ) {
              //console.log("record " + key + ", value is=" + dataArray[key]);
              // check to see if it exists in the form configuration
              // foreach raw field object, get the name key and value, plus the value key and value then compare to our data record
              fieldsRaw.forEach(function(fieldRaw) {
                  if (fieldRaw.name === key) {
                      fieldRaw.value = dataArray[key];
                  }
              });
            }
            //console.log(fieldsRaw);
            fields = fieldsRaw; // edit record
          }
      };
  }

  
    // simple $objAppDbConn connection
    function addItem() {
        var transaction = $objAppDbConn.transaction([tableName], 'readwrite');
        var store = transaction.objectStore(tableName);
        var item = {
            uuid: uuidv1(),
            name: 'banana',
            price: '$2.99',
            description: 'It is a purple banana!',
            created: new Date().getTime()
        };

        var request = store.add(item);

        request.onerror = function(e) {
            console.log('Error', e.target.error.name);
        };
        request.onsuccess = function(e) {
            console.log('Woot! Did it');
            getProduce();// would like to update the ProduceList now
        };
    }
 
  // setup the form
  // function buildForm(){
  //   if (ssrecordId!='') {
  //     console.log('buildForm edit entry'+ssrecordId);
  //     // edit form (for this we do not want to assign the fields constant until we have filled the values in the fields)
  //     getFormFields();
  //   }
  //   else {
  //     console.log('buildForm new entry');
  //     // new entry
  //     getFormFields();
  //   }
  // }
  getFormFields();
  
  let message = "";
  let values = {};

  function onSubmit() {
    const data = get(valuesForm);
    console.log('onSubmit()');
    console.log(data);
    if (data.isValidForm) {
      message = "Congratulation! now your form is valid";
      addItem();
    } else {
      message = "Your form is not valid!";
    }
  }
</script>

<div>Dynamic form generation</div>
<h3 class="alert alert-warning">{message}</h3>
<form on:submit|preventDefault="{onSubmit}" class="custom-form">
  <Field {fields} />
  <button class="btn btn-primary" type="submit">Save</button>
</form>
