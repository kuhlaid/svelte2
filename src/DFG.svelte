<!--
@abstract This script is used to test the https://github.com/arabdevelop/svelte-formly
module for generating dynamic forms within Svelte.
-->
<script>
  import { strApiConfig_Produce,objAppDbConn } from './stores.js';
  import { get } from "svelte/store";
  import { valuesForm, Field } from "svelte-formly";
  let fields;
  // pull the dynamic form generation config from the local db
  function getFormFields() {
      var objectStore = $objAppDbConn.transaction([strApiConfig_Produce], 'readonly').objectStore(strApiConfig_Produce);
      var request = objectStore.get('1');

      request.onerror = function(e) {
          console.log('Error', e.target.error.name);
      };
      request.onsuccess = function(e) {
          if (request.result.fields) {
              //console.log(request.result.fields);
              fields = JSON.parse(request.result.fields);
          }
      };
  }
  getFormFields();
  
  let message = "";
  let values = {};

  function onSubmit() {
    const data = get(valuesForm);
    if (data.isValidForm) {
      message = "Congratulation! now your form is valid";
    } else {
      message = "Your form is not valid!";
    }
  }
</script>

<div>Dynamic form generation</div>
<h3 class="alert alert-warning">{message}</h3>
<form on:submit|preventDefault="{onSubmit}" class="custom-form">
  <Field {fields} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>