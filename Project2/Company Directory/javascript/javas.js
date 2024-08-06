$(document).ready(function () {
    function fillpersonneltable(result) {
        var frag = document.createDocumentFragment();

        result.data.forEach(person => {
            var row = document.createElement("tr");

            var name = document.createElement("td");
            name.className = "align-middle text-nowrap";
            name.textContent = `${person.lastName}, ${person.firstName}`;
            row.appendChild(name);

            var department = document.createElement("td");
            department.className = "align-middle text-nowrap d-none d-md-table-cell";
            department.textContent = person.department;
            row.appendChild(department);

            var location = document.createElement("td");
            location.className = "align-middle text-nowrap d-none d-md-table-cell";
            location.textContent = person.location;
            row.appendChild(location);

            var email = document.createElement("td");
            email.className = "align-middle text-nowrap d-none d-md-table-cell";
            email.textContent = person.email;
            row.appendChild(email);

            var actions = document.createElement("td");
            actions.className = "text-end text-nowrap";

            var editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "btn btn-primary btn-sm me-1";
            editButton.setAttribute("data-bs-toggle", "modal");
            editButton.setAttribute("data-bs-target", "#editPersonnelModal");
            editButton.setAttribute("data-id", person.id);
            var editIcon = document.createElement("i");
            editIcon.className = "fa-solid fa-pencil fa-fw";
            editButton.appendChild(editIcon);
            actions.appendChild(editButton);

            var deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "deleteemployeebtn btn btn-primary btn-sm";
            deleteButton.setAttribute("data-id", person.id);
            deleteButton.setAttribute("data-type", "personnel");
            deleteButton.setAttribute("data-name", `${person.firstName} ${person.lastName}`);
            var deleteIcon = document.createElement("i");
            deleteIcon.className = "fa-solid fa-trash fa-fw";
            deleteButton.appendChild(deleteIcon);
            actions.appendChild(deleteButton);

            row.appendChild(actions);

            frag.appendChild(row);
        });

        $("#personnelTableBody").append(frag);
    }

    var savedactivebtn;

    $("#searchInp").on("keyup", function () {
        $("#departmentTableBody, #personnelTableBody, #locationTableBody").each(function () {
            $(this).empty();
        });

        $("#personnelBtn").removeClass("active");
        $("#departmentsBtn").removeClass("active");
        $("#locationsBtn").removeClass("active");

        var url = "libs/php/SearchAll.php";
        var timestamp = new Date().getTime();
        var queryString = "?t=" + timestamp;
        url += queryString;
        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            dataType: 'json',
            data: {
                txt: $('#searchInp').val(),
            },
            success: function (result) {
                if (result.status.code == 200) {
                    $("#searchTableBody").empty(); // Clear existing rows
                    fillpersonneltable(result);

                } else if (result.status.code == 404) {
                    $("#searchTableBody").html("No match found!!");

                }
                else {
                    alert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Database error: ${textStatus}`);
            }
        });

    });
    refreshActiveTable();


    function refreshPersonnelTable() {
        var url = "libs/php/getAll.php";
        var timestamp = new Date().getTime();
        var queryString = "?t=" + timestamp;
        url += queryString;
        savedactivebtn = document.querySelector('.active');
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                if (result.status.code == 200) {
                    $('#searchInp').val("");
                    $("#searchTableBody").empty();
                    $("#personnelTableBody").empty(); // Clear existing rows
                    fillpersonneltable(result);


                } else {
                    alert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Database error: ${textStatus}`);
            }
        });
        // var select = document.querySelector('select');
        let preloader = document.querySelector('#preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                preloader.remove()
            });
            preloader.remove();

        }
    }
    function refreshDepartmentsTable() {
        var url = "libs/php/getAllDepartments.php";
        var timestamp = new Date().getTime();
        var queryString = "?t=" + timestamp;
        url += queryString;
        savedactivebtn = document.querySelector('.active');
        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                if (result.status.code == 200) {
                    $('#searchInp').val("");
                    $("#searchTableBody").empty();
                    $("#departmentTableBody").empty(); // Clear existing rows
                    var frag = document.createDocumentFragment();

                    result.data.forEach(department => {
                        var row = document.createElement("tr");

                        var nameCell = document.createElement("td");
                        nameCell.className = "align-middle text-nowrap";
                        nameCell.textContent = department.name;
                        row.appendChild(nameCell);

                        var locationCell = document.createElement("td");
                        locationCell.className = "align-middle text-nowrap";
                        locationCell.textContent = department.locationName;
                        row.appendChild(locationCell);

                        var actionsCell = document.createElement("td");
                        actionsCell.className = "text-end text-nowrap";

                        var editButton = document.createElement("button");
                        editButton.type = "button";
                        editButton.className = "btn btn-primary btn-sm me-1";
                        editButton.setAttribute("data-bs-toggle", "modal");
                        editButton.setAttribute("data-bs-target", "#editDepartmentModal");
                        editButton.setAttribute("data-id", department.id);
                        var editIcon = document.createElement("i");
                        editIcon.className = "fa-solid fa-pencil fa-fw";
                        editButton.appendChild(editIcon);
                        actionsCell.appendChild(editButton);

                        var deleteButton = document.createElement("button");
                        deleteButton.type = "button";
                        deleteButton.className = "deleteDepartmentBtn btn btn-primary btn-sm";
                        deleteButton.setAttribute("data-id", department.id);
                        deleteButton.setAttribute("data-name", department.name);
                        deleteButton.setAttribute("data-type", "department");
                        var deleteIcon = document.createElement("i");
                        deleteIcon.className = "fa-solid fa-trash fa-fw";
                        deleteButton.appendChild(deleteIcon);
                        actionsCell.appendChild(deleteButton);

                        row.appendChild(actionsCell);

                        frag.appendChild(row);
                    });

                    $("#departmentTableBody").append(frag);

                } else {
                    alert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Database error: ${textStatus} `);
            }
        });
    }
    function refreshLocationsTable() {
        var url = "libs/php/getallLocations.php";
        var timestamp = new Date().getTime();
        var queryString = "?t=" + timestamp;
        url += queryString;
        savedactivebtn = document.querySelector('.active');
        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                if (result.status.code == 200) {
                    $('#searchInp').val("");
                    $("#searchTableBody").empty();
                    $("#locationTableBody").empty(); // Clear existing rows
                    var frag = document.createDocumentFragment();

                    result.data.forEach(location => {
                        var row = document.createElement("tr");
                        var name = document.createElement("td");
                        name.className = "align-middle text-nowrap";
                        name.textContent = location.name;
                        row.appendChild(name);
                        var actionsCell = document.createElement("td");
                        actionsCell.className = "text-end text-nowrap";

                        var editButton = document.createElement("button");
                        editButton.type = "button";
                        editButton.className = "btn btn-primary btn-sm me-1";
                        editButton.setAttribute("data-bs-toggle", "modal");
                        editButton.setAttribute("data-bs-target", "#editLocationModal");
                        editButton.setAttribute("data-id", location.id);
                        var editIcon = document.createElement("i");
                        editIcon.className = "fa-solid fa-pencil fa-fw";
                        editButton.appendChild(editIcon);
                        actionsCell.appendChild(editButton);

                        var deleteButton = document.createElement("button");
                        deleteButton.type = "button";
                        deleteButton.className = "deletelocationbtn btn btn-primary btn-sm";
                        deleteButton.setAttribute("data-id", location.id);
                        deleteButton.setAttribute("data-name", location.name);
                        deleteButton.setAttribute("data-type", "location");
                        var deleteIcon = document.createElement("i");
                        deleteIcon.className = "fa-solid fa-trash fa-fw";
                        deleteButton.appendChild(deleteIcon);
                        actionsCell.appendChild(deleteButton);

                        row.appendChild(actionsCell);

                        frag.appendChild(row);
                    });
                    $("#locationTableBody").append(frag);

                } else {
                    alert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Database error: ${textStatus} `);
            }
        });
    }



    function refreshActiveTable() {
        if ($("#personnelBtn").hasClass("active")) {
            document.getElementById("filterBtn").style.display = "block";
            refreshPersonnelTable();
        } else if ($("#departmentsBtn").hasClass("active")) {
            document.getElementById("filterBtn").style.display = "none";
            refreshDepartmentsTable();
        } else {
            document.getElementById("filterBtn").style.display = "none";
            refreshLocationsTable();
        }
    }

    $("#refreshBtn").click(function () {
        if (savedoption) {
            savedoption = false;
        }
        if (savedactivebtn) {
            savedactivebtn = $.trim(String(savedactivebtn.id));
            $("#" + savedactivebtn).addClass("active");
            savedactivebtn = null;
        }
        if ($("#personnelBtn").hasClass("active")) {
            refreshPersonnelTable();
        } else {
            if ($("#departmentsBtn").hasClass("active")) {
                refreshDepartmentsTable();
            } else {
                refreshLocationsTable();
                $("#locationsBtn").addClass("active");

            }
        }
    });

    $("#filterBtn").click(function () {
        $("#filterModal").modal("show");
        // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location

    });

    $("#addBtn").click(function () {

        // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
        if ($("#personnelBtn").hasClass("active")) {
            $("#addPersonnelModal").modal("show");
        } else {
            if ($("#departmentsBtn").hasClass("active")) {
                $("#addDepartmentModal").modal("show");
            } else {
                $("#addLocationModal").modal("show");
            }
        }
    });

    $("#personnelBtn").click(function () {
        $("#personnelBtn").addClass("active");
        $("#departmentsBtn").removeClass("active");
        $("#locationsBtn").removeClass("active");
        refreshActiveTable();

    });

    $("#departmentsBtn").click(function () {
        $("#departmentsBtn").addClass("active");
        $("#personnelBtn").removeClass("active");
        $("#locationsBtn").removeClass("active");
        refreshActiveTable();

        // Call function to refresh department table

    });

    $("#locationsBtn").click(function () {
        $("#locationsBtn").addClass("active");
        $("#personnelBtn").removeClass("active");
        $("#departmentsBtn").removeClass("active");
        refreshActiveTable()


        // Call function to refresh location table

    });

    $("#editPersonnelModal").on("show.bs.modal", function (e) {
        $.ajax({
            url: "libs/php/getPersonnelByID.php",
            type: "POST",
            cache: false,
            dataType: "json",
            data: {
                // Retrieve the data-id attribute from the calling button
                // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
                // for the non-jQuery JavaScript alternative
                id: $(e.relatedTarget).attr("data-id")
            },
            success: function (result) {
                var resultCode = result.status.code;

                if (resultCode == 200) {

                    // Update the hidden input with the employee id so that
                    // it can be referenced when the form is submitted

                    $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
                    $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
                    $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
                    $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
                    $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
                    $("#editPersonnelDepartment").html("");

                    $.each(result.data.department, function () {
                        $("#editPersonnelDepartment").append(
                            $("<option>", {
                                value: this.id,
                                text: this.name
                            })
                        );
                    });

                    $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);

                } else {
                    $("#editPersonnelModal .modal-title").replaceWith(
                        "Error retrieving data"
                    );
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#editPersonnelModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        });

    });
    $("#editPersonnelForm").on("submit", function (e) {
        e.preventDefault(); // Stop the default form submission

        $.ajax({
            url: "libs/php/updatePersonnel.php",
            type: "POST",
            cache: false,
            dataType: "json",
            data: {
                id: $('#editPersonnelEmployeeID').val(),
                first: $('#editPersonnelFirstName').val(),
                last: $('#editPersonnelLastName').val(),
                email: $('#editPersonnelEmailAddress').val(),
                job: $('#editPersonnelJobTitle').val(),
                depID: $("#editPersonnelDepartment").val()
            },
            success: function (result) {
                if (result.status.code == 200) {
                    showAlert('Personnel updated successfully');
                    // Optionally refresh the personnel table
                    $("#refreshBtn").click();
                    $("#editPersonnelModal").modal('hide');
                } else {
                    showAlert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert(`Database error: ${textStatus} `);
            }
        });
    });
    $("#editDepartmentModal").on("show.bs.modal", function (e) {
        $.ajax({
            url: "libs/php/getDepartmentByID.php",
            type: "POST",
            cache: false,
            dataType: "json",
            data: {
                // Retrieve the data-id attribute from the calling button
                // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
                // for the non-jQuery JavaScript alternative
                id: $(e.relatedTarget).attr("data-id")
            },
            success: function (result) {
                var resultCode = result.status.code;

                if (resultCode == 200) {

                    // Update the hidden input with the employee id so that
                    // it can be referenced when the form is submitted

                    $("#editDepartmentID").val(result.data[0].id);
                    $("#editDepartmentName").val(result.data[0].name);
                    $("#editLocation").html("");

                    $.each(result.data.location, function () {
                        $("#editLocation").append(
                            $("<option>", {
                                value: this.id,
                                text: this.name
                            })
                        );
                    });
                    $("#editLocation").val(result.data[0].locationID);
                } else {
                    $("#editPersonnelModal .modal-title").replaceWith(
                        "Error retrieving data"
                    );
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#editDepartmentModal.modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        });

    });
    $("#editDepartmentForm").on("submit", function (e) {
        e.preventDefault(); // Stop the default form submission
        console.log('Submitting form with ID:', $('#editPersonnelEmployeeID').val(), $('#editPersonnelFirstName').val(), $('#editPersonnelLastName').val());

        $.ajax({
            url: "libs/php/updateDepartment.php",
            type: "POST",
            cache: false,
            dataType: "json",
            data: {
                id: $('#editDepartmentID').val(),
                name: $('#editDepartmentName').val(),
                locID: $("#editLocation").val()
            },
            success: function (result) {
                // console.log('Server response:', result);
                if (result.status.code == 200) {
                    showAlert('Department updated successfully');
                    $("#refreshBtn").click();
                    $("#editDepartmentModal").modal('hide');
                } else {
                    showAlert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert(`Database error: ${textStatus} `);
            }
        });
    });
    $("#editLocationModal").on("show.bs.modal", function (e) {
        $.ajax({
            url: "libs/php/getLocationByID.php",
            type: "POST",
            cache: false,
            dataType: "json",
            data: {
                // Retrieve the data-id attribute from the calling button
                // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
                // for the non-jQuery JavaScript alternative
                id: $(e.relatedTarget).attr("data-id")
            },
            success: function (result) {
                var resultCode = result.status.code;

                if (resultCode == 200) {

                    // Update the hidden input with the employee id so that
                    // it can be referenced when the form is submitted

                    $("#editLocationID").val(result.data[0].id);
                    $("#editLocationName").val(result.data[0].name);

                } else {
                    $("#editPersonnelModal .modal-title").replaceWith(
                        "Error retrieving data"
                    );
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#editDepartmentModal.modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        });

    });
    $("#editLocationForm").on("submit", function (e) {
        e.preventDefault(); // Stop the default form submission

        $.ajax({
            url: "libs/php/updateLocation.php",
            type: "POST",
            cache: false,
            dataType: "json",
            data: {
                id: $('#editLocationID').val(),
                name: $('#editLocationName').val(),

            },
            success: function (result) {
                // console.log('Server response:', result);
                if (result.status.code == 200) {
                    showAlert('Location updated successfully');
                    $("#refreshBtn").click();
                    $("#editLocationModal").modal('hide');
                } else {
                    showAlert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert(`Database error: ${textStatus} `);
            }
        });
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////



    var deleteType;
    var deleteId;
    var deleteitem;

    $("#deleteConfirmationModal").on("show.bs.modal", function (e) {


        if (deleteType === "personnel") {
            var deleteMessage = `< b > Are you sure ?</b > <br>Do you really want to remove<br> ${deleteitem}`;
        } else if (deleteType === "department") {
            var deleteMessage = `<b>Are you sure?</b><br>Do you really want to remove<br> ${deleteitem}`;
        } else if (deleteType === "location") {
            var deleteMessage = `<b>Are you sure?</b><br>Do you really want to remove<br> ${deleteitem}`;
        }
        $("#deleteConfirmationMessage").html(deleteMessage);
        // $("#deleteConfirmationModal").modal("show");
    });

    $("#confirmDeleteBtn").on("click", function () {
        var deleteUrl;
        if (deleteType === "personnel") {
            deleteUrl = "libs/php/deletePersonnel.php";
            deletepersonnel(deleteUrl);
        } else if (deleteType === "department") {
            deleteUrl = "libs/php/deleteDepartmentByID.php";
            deletedepartment(deleteUrl);
        } else if (deleteType === "location") {
            deleteUrl = "libs/php/deleteLocationByID.php";
            deletelocation(deleteUrl);
        }
    });



    $('#personnelTableBody').on('click', '.deleteemployeebtn', function () {

        deleteType = $(this).attr("data-type");
        deleteId = $(this).attr("data-id");
        deleteitem = $(this).attr("data-name");

        $("#deleteConfirmationModal").modal("show");


    });
    $('#departmentTableBody').on('click', '.deleteDepartmentBtn', function () {

        deleteType = $(this).attr("data-type");
        deleteId = $(this).attr("data-id");
        deleteitem = $(this).attr("data-name");
        $.ajax({
            url:
                "libs/php/checkdepartmentUse.php",
            type: "POST",
            dataType: "json",
            data: {
                deptId: $(this).attr("data-id") // Retrieves the data-id attribute from the calling button
            },
            success: function (result) {
                if (result.status.code == 200) {
                    if (result.data[0].personnelCount == 0) {
                        // $("#areYouSureDeptName").text(result.data[0].departmentName);
                        $("#deleteConfirmationModal").modal("show");
                    } else {
                        dname = result.data[0].departmentName;
                        count = result.data[0].personnelCount;
                        var msg = `<b>Can't Delete!</b><br>You cannot remove the entry for ${dname} because it has ${count} employees assigned to it.`;
                        showAlert(msg);
                    }
                } else {
                    showAlert("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert("Error retrieving data");
            }
        });
    });
    $('#locationTableBody').on('click', '.deletelocationbtn', function () {

        deleteType = $(this).attr("data-type");
        deleteId = $(this).attr("data-id");
        deleteitem = $(this).attr("data-name");
        $.ajax({
            url:
                "libs/php/checkLocationUse.php",
            type: "POST",
            dataType: "json",
            data: {
                locId: $(this).attr("data-id") // Retrieves the data-id attribute from the calling button
            },
            success: function (result) {
                if (result.status.code == 200) {
                    if (result.data[0].departmentCount == 0) {
                        // $("#areYouSureDeptName").text(result.data[0].departmentName);
                        $("#deleteConfirmationModal").modal("show");
                    } else {
                        dname = result.data[0].locationName;
                        count = result.data[0].departmentCount;
                        var msg = `<b>Can't Delete!</b><br>You cannot remove the entry for ${dname} because it has ${count} departments assigned to it.`;
                        showAlert(msg);
                    }
                } else {
                    showAlert("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert("Error retrieving data");
            }
        });
    });
    function deletepersonnel(deleteUrl) {
        $.ajax({
            url: deleteUrl,
            type: "POST",
            cache: false,
            dataType: "json",
            data: { id: deleteId },
            success: function (result) {
                if (result.status.code == 200) {
                    showAlert('Deleted successfully!');
                    $("#deleteConfirmationModal").modal("hide");
                    $("#refreshBtn").click();
                } else {
                    showAlert('Error: ' + result.status.description);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert(`Database error: ${textStatus}`);
                $("#deleteConfirmationModal").modal("hide");
            }
        });
    }
    function deletedepartment(deleteUrl) {
        $.ajax({
            url: deleteUrl,
            type: "POST",
            cache: false,
            dataType: "json",
            data: { departmentId: deleteId },
            success: function (result) {
                if (result.status.code == 200) {
                    showAlert('Deleted successfully!');
                    $("#deleteConfirmationModal").modal("hide");
                    $("#refreshBtn").click();

                } else {
                    showAlert('Error: ' + result.status.description);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert(`Database error: ${textStatus}`);
                $("#deleteConfirmationModal").modal("hide");
            }
        });
    }
    function deletelocation(deleteUrl) {
        $.ajax({
            url: deleteUrl,
            type: "POST",
            cache: false,
            dataType: "json",
            data: { locationId: deleteId },
            success: function (result) {
                if (result.status.code == 200) {
                    showAlert('Deleted successfully!');
                    $("#deleteConfirmationModal").modal("hide");
                    $("#refreshBtn").click();
                }
                else {
                    showAlert('Error: ' + result.status.description);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert(`Database error: ${textStatus}`);
                $("#deleteConfirmationModal").modal("hide");
            }
        });
    }
    /////FILTER MODAL///////////////////////////////////////////////// /////////////////////////////////////////////////
    function getPersonnelByDepartment(DepartmentID) {

        $.ajax({
            url: "libs/php/getPersonnelByDepartment.php",
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {
                depId: DepartmentID
            },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#searchInp').val("");
                    $("#searchTableBody").empty();
                    $("#personnelTableBody").empty(); // Clear existing rows
                    fillpersonneltable(result);
                } else {
                    alert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Database error: ${textStatus}`);
            }
        });
    }

    function getPersonnelByLocation(locationID) {

        $.ajax({
            url: "libs/php/getPersonnelByLocation.php",
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {
                locationId: locationID
            },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#searchInp').val("");
                    $("#searchTableBody").empty();
                    $("#personnelTableBody").empty(); // Clear existing rows
                    fillpersonneltable(result);
                } else {
                    alert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Database error: ${textStatus}`);
            }
        });
    }

    $("#filterModal").on("show.bs.modal", function () {
        // Fetch departments and populate the dropdown
        const departmentSelect = document.getElementById('filterPersonnelByDepartment');
        const locationSelect = document.getElementById('filterPersonnelByLocation');
        // Clear existing options
        departmentSelect.innerHTML = '<option value="0">All</option>';
        locationSelect.innerHTML = '<option value="0">All</option>';
        fetch('libs/php/getAllDepartments.php')
            .then(response => response.json())
            .then(result => {
                result.data.forEach(department => {
                    const option = document.createElement('option');
                    option.value = department.id;
                    option.textContent = department.name;
                    departmentSelect.appendChild(option);
                });
                // Set the saved option if it exists
                if (savedoption && lastoption == "department") {
                    departmentSelect.value = savedoption;
                    getPersonnelByDepartment(savedoption);
                }
            });

        // Fetch locations and populate the dropdown
        fetch('libs/php/getallLocations.php')
            .then(response => response.json())
            .then(result => {
                result.data.forEach(location => {
                    const option = document.createElement('option');
                    option.value = location.id;
                    option.textContent = location.name;
                    locationSelect.appendChild(option);
                });
                // Set the saved option if it exists
                if (savedoption && lastoption == "location") {
                    locationSelect.value = savedoption;
                    getPersonnelByLocation(savedoption);
                }

            });
    });
    var savedoption;
    var lastoption;
    $("#filterPersonnelByDepartment").change(function () {

        if (this.value > 0) {
            savedoption = $(this).val();
            lastoption = "department";
            $("#filterPersonnelByLocation").val(0);
            const depId = $(this).val();
            getPersonnelByDepartment(depId);
        }
    })

    $("#filterPersonnelByLocation").change(function () {

        if (this.value > 0) {
            savedoption = $(this).val();
            lastoption = "location";
            $("#filterPersonnelByDepartment").val(0);
            const locId = $(this).val();
            getPersonnelByLocation(locId);
        }
    })

    ////////////////////// Function to show alert message
    function showAlert(message) {
        $("#ConfirmationMessage").html(message);
        $('#customModal').modal('show');
    }
    $("#addPersonnelModal").on("show.bs.modal", function (e) {
        $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: "POST",
            cache: false,
            dataType: "json",
            success: function (result) {
                var resultCode = result.status.code;
                if (resultCode == 200) {
                    $("#addPersonnelFirstName").val("");
                    $("#addPersonnelLastName").val("");
                    $("#addPersonnelJobTitle").val("");
                    $("#addPersonnelEmailAddress").val("");
                    $("#addPersonnelDepartment").html("");
                    $.each(result.data, function () {
                        $("#addPersonnelDepartment").append(
                            $("<option>", {
                                value: this.id,
                                text: this.name
                            })
                        );
                    });

                    // $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);

                } else {
                    $("#addPersonnelModal.modal-title").replaceWith(
                        "Error retrieving data"
                    );
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#addPersonnelModal.modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        });

    });
    $("#addPersonnelForm").on("submit", function (e) {
        e.preventDefault(); // Stop the default form submission

        $.ajax({
            url: "libs/php/insertPersonnel.php",
            type: "POST",
            cache: false,
            dataType: "json",
            data: {
                first: $('#addPersonnelFirstName').val(),
                last: $('#addPersonnelLastName').val(),
                email: $('#addPersonnelEmailAddress').val(),
                job: $('#addPersonnelJobTitle').val(),
                depID: $("#addPersonnelDepartment").val()
            },
            success: function (result) {
                if (result.status.code == 200) {
                    showAlert('Personnel added successfully');
                    // Optionally refresh the personnel table
                    $("#refreshBtn").click();
                    $("#addPersonnelModal").modal('hide');
                } else {
                    showAlert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert(`<b>Sorry</b><br>Cannot add! Try another email!`);
            }
        });
    });
    $("#addDepartmentModal").on("show.bs.modal", function (e) {
        $.ajax({
            url: "libs/php/getallLocations.php",
            type: "POST",
            cache: false,
            dataType: "json",
            success: function (result) {
                var resultCode = result.status.code;
                if (resultCode == 200) {
                    $("#addDepartmentName").val("");
                    $("#addLocation").html("");
                    $.each(result.data, function () {
                        $("#addLocation").append(
                            $("<option>", {
                                value: this.id,
                                text: this.name
                            })
                        );
                    });

                    // $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);

                } else {
                    $("#addDepartmentModal .modal-title").replaceWith(
                        "Error retrieving data"
                    );
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#addDepartment.modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        });

    });
    $("#addDepartmentForm").on("submit", function (e) {
        e.preventDefault(); // Stop the default form submission
        $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: "POST",
            cache: false,
            dataType: "json",
            success: function (result) {
                var resultCode = result.status.code;
                if (resultCode == 200) {
                    dpt_array = [];
                    $.each(result.data, function () {
                        dpt_array.push(this.name + ", " + this.locationID);
                    })
                    console.log(dpt_array);
                    if (!dpt_array.includes((capitalize($('#addDepartmentName').val()) + ", " + String($("#addLocation").val())))) {
                        $.ajax({
                            url: "libs/php/insertDepartment.php",
                            type: "POST",
                            dataType: "json",
                            data: {
                                name: capitalize($('#addDepartmentName').val()),
                                locationID: $("#addLocation").val()
                            },
                            success: function (result) {
                                if (result.status.code == 200) {
                                    showAlert('Department added successfully');
                                    // Optionally refresh the personnel table
                                    $("#refreshBtn").click();
                                    $("#addDepartmentModal").modal('hide');
                                } else {
                                    showAlert('Error: ' + result.status.description);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                showAlert(`Database error: ${textStatus}`);
                            }
                        });

                    } else {
                        console.log('false');
                        $("#addDepartmentModal").modal('hide');
                        showAlert("<b>Sorry</b><br>This department already exists at this location.")
                    }
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#addDepartmentModal.modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        });



    });
    function capitalize(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    $("#addLocationForm").on("submit", function (e) {
        e.preventDefault(); // Stop the default form submission

        $.ajax({
            url: "libs/php/insertLocation.php",
            type: "POST",
            cache: false,
            dataType: "json",
            data: {
                name: capitalize(String($('#addLocationName').val())),

            },
            success: function (result) {
                if (result.status.code == 200) {
                    showAlert('Location added successfully');
                    // Optionally refresh the personnel table
                    $("#addLocationName").val("");
                    $("#refreshBtn").click();
                    $("#addLocationModal").modal('hide');
                } else {
                    showAlert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#addLocationName").val("");
                $("#addLocationModal").modal('hide');
                showAlert(`<b>Sorry</b><br>Cannot add! Try with another name!`);
            }
        });
    });

});




