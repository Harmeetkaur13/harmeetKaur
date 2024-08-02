$(document).ready(function () {
    function fillpersonneltable(result) {
        result.data.forEach(person => {
            let row = `
        <tr>
        <td class="align-middle text-nowrap">
            ${person.lastName}, ${person.firstName}
        </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
            ${person.department}
        </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
            ${person.location}
        </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
            ${person.email}
        </td>
        <td class="text-end text-nowrap">
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                data-bs-target="#editPersonnelModal" data-id="${person.id}">
                <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                data-bs-target="#deleteConfirmationModal" data-id="${person.id}" data-type="personnel">
                <i class="fa-solid fa-trash fa-fw"></i>
            </button>
        </td>
        </tr>`;
            $("#personnelTableBody").append(row);
            // console.log(person.id);
        });
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
                    console.log(result);


                    result.data.found.forEach(person => {
                        let row = `
                    <tr>
                        <td class="align-middle text-nowrap">
                            ${person.lastName}, ${person.firstName}
                        </td>
                        <td class="align-middle text-nowrap d-none d-md-table-cell">
                            ${person.departmentName}
                        </td>
                        <td class="align-middle text-nowrap d-none d-md-table-cell">
                            ${person.locationName}
                        </td>
                        <td class="align-middle text-nowrap d-none d-md-table-cell">
                            ${person.email}
                        </td>
                        
                        <td class="text-end text-nowrap">
                           <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                             data-bs-target="#editPersonnelModal" data-id="${person.id}">
                             <i class="fa-solid fa-pencil fa-fw"></i>
                           </button>
                           <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                             data-bs-target="#deleteConfirmationModal" data-id="${person.id}" data-type="personnel">
                             <i class="fa-solid fa-trash fa-fw"></i>
                           </button>
                        </td>
                    </tr>
                `;

                        $("#searchTableBody").append(row);


                    });
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
                    // console.log(result);

                    result.data.forEach(department => {
                        let row = `
                        <tr>
                            <td class="align-middle text-nowrap">
                                ${department.name}
                            </td>
                             <td class="align-middle text-nowrap">
                                ${department.locationName}
                            </td>
                            <td class="text-end text-nowrap">
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#editDepartmentModal" data-id="${department.id}">
                                    <i class="fa-solid fa-pencil fa-fw"></i>
                                </button>
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#deleteConfirmationModal" data-id="${department.id}" data-type="department">
                                    <i class="fa-solid fa-trash fa-fw"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                        $("#departmentTableBody").append(row);
                    });
                } else {
                    alert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Database error: ${textStatus}`);
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
                    console.log(result);

                    result.data.forEach(location => {
                        let row = `
                                <tr>
                                    <td class="align-middle text-nowrap">
                                        ${location.name}
                                    </td>
                                      <td class="text-end text-nowrap">
                                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#editLocationModal" data-id="${location.id}">
                                    <i class="fa-solid fa-pencil fa-fw"></i>
                                    </button>
                                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                        data-bs-target="#deleteConfirmationModal" data-id="${location.id}" data-type="location">
                                        <i class="fa-solid fa-trash fa-fw"></i>
                                    </button>
                                </td>
                                    
                                </tr>
                            `;

                        $("#locationTableBody").append(row);
                    });
                } else {
                    alert('Error: ' + result.status.description);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Database error: ${textStatus}`);
            }
        });
    }



    function refreshActiveTable() {
        if ($("#personnelBtn").hasClass("active")) {
            refreshPersonnelTable();
        } else if ($("#departmentsBtn").hasClass("active")) {
            refreshDepartmentsTable();
        } else {
            refreshLocationsTable();
        }
    }

    $("#refreshBtn").click(function () {
        if (savedactivebtn) {
            // Ensure x is a string and remove any extra whitespace
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
                showAlert(`Database error: ${textStatus}`);
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
                showAlert(`Database error: ${textStatus}`);
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
                showAlert(`Database error: ${textStatus}`);
            }
        });
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////



    var deleteType;
    var deleteId;
    $("#deleteConfirmationModal").on("show.bs.modal", function (e) {
        deleteType = $(e.relatedTarget).attr("data-type");
        deleteId = $(e.relatedTarget).attr("data-id");
        var deleteMessage = `<b>Are you sure?</b><br>Do you really want to delete this `;
        if (deleteType === "personnel") {
            deleteMessage += "employee?";
        } else if (deleteType === "department") {
            deleteMessage += "department?";
        } else if (deleteType === "location") {
            deleteMessage += "location?";
        }
        $("#deleteConfirmationMessage").html(deleteMessage);
        // $("#deleteConfirmationModal").modal("show");
    });
    $("#confirmDeleteBtn").on("click", function () {
        var deleteUrl;
        var msg;
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
                } else if (result.status.description = "dependency") {
                    var msg = `<b>Can't Delete!</b><br>Sorry, this department cannot be deleted because of dependencies.`;
                    $("#deleteConfirmationModal").modal("hide");
                    showAlert(msg);
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
                } else if (result.status.description = "dependency") {
                    var msg = `<b>Can't Delete!</b><br>Sorry, this Location cannot be deleted because of dependencies.`;
                    $("#deleteConfirmationModal").modal("hide");
                    showAlert(msg);
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

    // Function to handle selection from department or location
    function handleSelection(type, id) {
        // Remove active class from all items and add to the selected one
        if (type === 'department') {
            $('#department-list .list-group-item').removeClass('bg-primary text-white');
            $('#department-list .list-group-item[value="' + id + '"]').addClass('bg-primary text-white');
            getPersonnelByDepartment(id);
        } else if (type === 'location') {
            $('#location-list .list-group-item').removeClass('bg-primary text-white');
            $('#location-list .list-group-item[value="' + id + '"]').addClass('bg-primary text-white');
            getPersonnelByLocation(id);
        }
    }

    // Event listener for department selection
    $('#department-list').on('click', '.list-group-item', function () {

        const deptId = $(this).val();
        handleSelection('department', deptId);
    });

    // Event listener for location selection
    $('#location-list').on('click', '.list-group-item', function () {

        const locId = $(this).val();
        handleSelection('location', locId);
    });

    $("#filterModal").on("show.bs.modal", function () {
        // Fetch departments and populate the dropdown
        fetch('libs/php/getAllDepartments.php')
            .then(response => response.json())
            .then(result => {
                const departmentList = document.getElementById('department-list');
                departmentList.innerHTML = ''; // Clear previous content
                result.data.forEach(department => {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'list-group-item list-group-item-action';
                    button.value = department.id;
                    button.textContent = department.name;
                    departmentList.appendChild(button);
                });
            });

        // Fetch locations and populate the dropdown
        fetch('libs/php/getallLocations.php')
            .then(response => response.json())
            .then(result => {
                const locationList = document.getElementById('location-list');
                locationList.innerHTML = ''; // Clear previous content
                result.data.forEach(location => {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.value = location.id;
                    button.className = 'list-group-item list-group-item-action';
                    button.textContent = location.name;
                    locationList.appendChild(button);
                });
            });
    });


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

