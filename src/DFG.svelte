<!--
@abstract This script is used to test the https://github.com/arabdevelop/svelte-formly
module for generating dynamic forms within Svelte.
-->
<script>
  import { get } from "svelte/store";
  import { valuesForm, Field } from "svelte-formly";

  const fields = [
    {
      type: "color",
      name: "color",
      id: "color",
      label: "Color Form"
    },
    {
      type: "text",
      name: "firstname",
      label: "First name:",
      value: "",
      id: "firstname",
      class: ["form-control"],
      placeholder: "Tap your first name",
      validation: ["required", "min:6"],
      messages: {
        required: "Firstname field is required!",
        min: "First name field must have more that 6 caracters!"
      },
      description: {
        class: ["custom-class-desc"],
        text: "(this needs something)"
      }
    },
    {
      prefix: {
        class: ["custom-form-group"]
      },
      type: "text",
      name: "lastname",
      value: "",
      id: "lastname",
      placeholder: "Tap your lastname",
      description: {
        class: ["custom-class-desc"],
        text: "Custom text for description"
      }
    },
    {
      type: "email",
      name: "email",
      value: "",
      id: "email",
      placeholder: "Tap your email",
      validation: ["required", "email"]
    },
    {
      type: "radio",
      name: "gender",
      items: [
        {
          id: "female",
          value: "female",
          title: "Female"
        },
        {
          id: "male",
          value: "male",
          title: "Male"
        }
      ]
    },
    {
      type: "select",
      name: "city",
      id: "city",
      label: "City",
      validation: ["required"],
      options: [
        {
          value: null,
          title: "-- Select a city --"
        },
        {
          value: 1,
          title: "Agadir"
        },
        {
          value: 2,
          title: "Casablanca"
        }
      ]
    }
  ];

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

<h1>Svelte Formly</h1>
<h3 class="alert alert-warning">{message}</h3>
<form
  on:submit|preventDefault="{onSubmit}"
  class="custom-form"
>
  <Field {fields} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>