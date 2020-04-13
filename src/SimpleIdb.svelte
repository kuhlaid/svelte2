<script>
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const employeeData = [{
    id: "00-01",
    name: "gopal",
    age: 35,
    email: "gopal@tutorialspoint.com"
}, {
    id: "00-02",
    name: "prasad",
    age: 32,
    email: "prasad@tutorialspoint.com"
}];

var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
    loadTable();
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("employee", {
        keyPath: "id"
    });

    for (var i in employeeData) {
        objectStore.add(employeeData[i]);
    }
}

function loadTable() {
    var employees = "";
    $('.employee').remove();

    var objectStore = db.transaction("employee").objectStore("employee");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            employees = employees.concat(
                '<tr class="employee">' +
                '<td class="ID">' + cursor.key + '</td>' +
                '<td class="Name">' + cursor.value.name + '</td>' +
                '<td class="Age">' + cursor.value.age + '</td>' +
                '<td class="Email">' + cursor.value.email + '</td>' +
                '</tr>');

            cursor.continue(); // wait for next event
        } else {
            $('.header').after(employees); // no more events
        }
    };
}

function addEmployee() {
    var employeeID = $('#add_id').val();
    var name = $('#add_name').val();
    var age = $('#add_age').val();
    var email = $('#add_email').val();
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            id: employeeID,
            name: name,
            age: age,
            email: email
        });

    request.onsuccess = function (event) {
        loadTable();
        clearButtons();
    };

    request.onerror = function (event) {
        alert("error");
    }
}

function deleteEmployee() {
    var employeeID = $('#delete_id').val();
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .delete(employeeID);

    request.onsuccess = function (event) {
        loadTable();
        clearButtons();
    };
}

function clearButtons() {
    $('#add_id').val("");
    $('#add_name').val("");
    $('#add_age').val("");
    $('#add_email').val("");
    $('delete_id').val("");
}

</script>