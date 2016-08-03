var l;
var empId;
$(document).ready(function() {
    //Search Employee By Name
    $(".searchEmployeeButton").click(function() {
        searchEmpFunc();
    });

    // Search all Employees
    var start;
    $(".searchAllEmployeesButton").click(function() {
        start = 0;
        searchAllEmployees(start);
    });
    $(".next").click(function() {
        start = start + 100;
        searchAllEmployees(start);
    });
    $(".previous").click(function() {
        console.log(start);
        if (start == 0) {
            $(".alert-message").html("No previous records are there..");
        } else {
            $(".next").css('display','block');
            start = start - 100;
            searchAllEmployees(start);
        }
    });

    //Add Employee operation
    $(".addEmpButton").click(function() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/Employees',
            dataType: 'json',
            success: function(jsonData) {
                empId = jsonData[jsonData.length - 1].employeeId + 1;
                initializeEmpDetails(empId);
                $('#myModal').modal('hide');
                initializeFormContents();
            }
        });
    });
});//End Document ready function

// Initialize form details with empty values
function initializeFormContents() {
    $('#ageText').val("");
    $('#nameText').val("");
    $('#emailText').val("");
    $('#addressText').val("");
    $('#phoneText').val("");
    $('#companyText').val("");
}

//Search Employee by Name function
function searchEmpFunc() {
    $(".table-Section").css('display', 'none');
    $(".updateDeleteCombo").css('display', 'none');
    $(".operations").css('display', 'block');
    $("#myTable").find("tr:not(:first)").remove();
    l = 0;
    var tempVariable = $(".textClass").val();
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/Employees?name_like=' + tempVariable,
        dataType: 'json',
        success: function(jsonData) {
            var status = false;
            json = jsonData;
            $(json).each(function(i, val) {
                $.each(val, function(k, v) {
                    if (l < json.length) {
                        status = true;
                        var table = document.getElementById("myTable");
                        var row = table.insertRow();
                        var cell = [];
                        for (var i = 0; i < 9; i++) {
                            cell[i] = row.insertCell(i);
                        }
                        var idForBtn = json[l].id;
                        cell[8].innerHTML = '<a href="#myUpdateModal" role="button" class="btn btn-default updateButton" data-toggle="modal" id="' + idForBtn + '">Update Record</a><br>' +
                            '<button type="button" class="btn btn-default deleteButton" id="' + idForBtn + '">Delete Record</button>';

                        cell[0].innerHTML = json[l].employeeId;
                        cell[2].innerHTML = json[l].age;
                        cell[1].innerHTML = json[l].name;
                        cell[3].innerHTML = json[l].gender;
                        cell[4].innerHTML = json[l].company;
                        cell[5].innerHTML = json[l].email;
                        cell[6].innerHTML = json[l].phone;
                        cell[7].innerHTML = json[l].address;
                        $(".table-Section").css('display', 'block');
                        $(".updateDeleteCombo").css('display', 'block');
                    }
                    l = l + 1;
                });
            });
            if (status == false) {
                alert("No records found");
            }
            //Delete operation
            $(".deleteButton").click(function() {
                var flag = confirm("Are you sure you want to delete this record?");
                if (flag == true) {
                    var id = $(this).attr('id');
                    $.ajax({
                        type: 'DELETE',
                        url: 'http://localhost:8080/Employees/' + id,
                        dataType: 'json',
                        success: function(jsonData) {
                            alert("Record deleted successfully");
                            $('#' + id).closest('tr').remove();
                        },
                        error: function() {
                            alert('Error in Loading');
                        }

                    });
                }
            });
            //Update operation
            $(".updateButton").click(function() {
                var idUpdate = $(this).attr('id');
                var eid;
                l = 0;
                $(json).each(function(i, val) {
                    $.each(val, function(k, v) {
                        if (l < json.length) {
                            if (json[l].id == idUpdate) {
                                eid = json[l].employeeId;
                                $('#ageUpdateText').val(json[l].age);
                                $('#nameUpdateText').val(json[l].name);
                                $('#emailUpdateText').val(json[l].email);
                                $('#addressUpdateText').val(json[l].address);
                                $('#phoneUpdateText').val(json[l].phone);
                                $('#companyUpdateText').val(json[l].company);
                                if (json[l].gender == "male" || json[l].gender == "Male") {
                                    $("#maleUpdateRadio").prop("checked", true);
                                } else if (json[l].gender == "female" || json[l].gender == "Female") {
                                    $("#femaleUpdateRadio").prop("checked", true);
                                } else {
                                    $("#femaleUpdateRadio").prop("checked", false);
                                    $("#maleUpdateRadio").prop("checked", false);
                                }
                            }
                        }
                        l = l + 1;
                    });
                });

                $(".updateEmpButton").one('click', function() {
                    var updateData = {
                        "employeeId": eid,
                        "age": $('#ageUpdateText').val(),
                        "name": $('#nameUpdateText').val(),
                        "gender": $("input[name=optradio]:checked").val(),
                        "company": $('#companyUpdateText').val(),
                        "email": $('#emailUpdateText').val(),
                        "phone": $('#phoneUpdateText').val(),
                        "address": $('#addressUpdateText').val()
                    };
                    $.ajax({
                        type: 'PUT',
                        url: 'http://localhost:8080/Employees/' + idUpdate,
                        'content-type': 'application/json',
                        data: updateData,
                        success: function(jsonData) {
                            alert("Successfully Updated");
                            $('#myUpdateModal').modal('hide');
                            searchEmpFunc();
                        },
                        error: function() {
                            alert("Error Occurred!!")
                        }
                    });
                });
            });
        },
        error: function() {
            alert('Error in Loading');
        }

    });
}

//Search all employees function
function searchAllEmployees(offset) {
    $(".table-Section").css('display', 'none');
    $(".updateDeleteCombo").css('display', 'none');
    $("#myTable").find("tr:not(:first)").remove();
    l = 0;
    var tempVariable = $(".textClass").val();
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/Employees?_start=' + offset + '&_limit=100',
        dataType: 'json',
        success: function(jsonData) {
            json = jsonData;
            if(json.length==0 || json.length<100)
            {
                $(".alert-message").html("No more records are there..");
                $(".next").css('display','none');
            }
            else
            {
                $(".alert-message").html("");
                $(json).each(function(i, val) {
                    $.each(val, function(k, v) {
                        if (l < json.length) {
                            var table = document.getElementById("myTable");
                            var row = table.insertRow();
                            var cell = [];
                            for (var i = 0; i < 9; i++) {
                                cell[i] = row.insertCell(i);
                            }
                            cell[0].innerHTML = json[l].employeeId;
                            cell[1].innerHTML = json[l].name;
                            cell[2].innerHTML = json[l].age;
                            cell[3].innerHTML = json[l].gender;
                            cell[4].innerHTML = json[l].company;
                            cell[5].innerHTML = json[l].email;
                            cell[6].innerHTML = json[l].phone;
                            cell[7].innerHTML = json[l].address;
                            $(".table-Section").css('display', 'block');
                            $(".updateDeleteCombo").css('display', 'block');
                            $(".operations").css('display', 'none');
                            $(".pagination").css('display', 'block');
                        }
                        l = l + 1;
                    });
                });
            }
            
        },
        error: function() {
            alert('Error in Loading');
        }
    });
}

// Initialize employee details
function initializeEmpDetails(empId) {
    var data = {
        "employeeId": empId,
        "age": $('#ageText').val(),
        "name": $('#nameText').val(),
        "gender": $("input[name=optradio]:checked").val(),
        "company": $('#companyText').val(),
        "email": $('#emailText').val(),
        "phone": $('#phoneText').val(),
        "address": $('#addressText').val()
    };
    saveEmpData(data);
}

// Save employee data
function saveEmpData(data) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/Employees',
        'content-type': "application/json",
        data: data,
        success: function(jsonData) {
            alert("Successfully Added");
        },
        error: function() {
            alert("Error Occurred!!")
        }
    });
}
