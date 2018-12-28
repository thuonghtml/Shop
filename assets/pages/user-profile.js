'use strict';
$(document).ready(function () {
    var RenderMess = function (type, mess) {
        toastr.options = { "newestOnTop": true, "showMethod": "show", "hideMethod": "hide", "progressBar": true, };
        toastr[type]("<strong>" + mess + "</strong>");
    }
    $("a[data-toggle=\"tab\"]").on("shown.bs.tab", function (e) {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });

    //    Edit information of user-profile
    $('#edit-cancel').on('click', function () {

        var c = $('#edit-btn').find("i");
        c.removeClass('icofont-close');
        c.addClass('icofont-edit');
        $('.view-info').show();
        $('.edit-info').hide();

    });

    $('.edit-info').hide();


    $('#edit-btn').on('click', function () {
        var b = $(this).find("i");
        var edit_class = b.attr('class');
        if (edit_class == 'icofont icofont-edit') {
            b.removeClass('icofont-edit');
            b.addClass('icofont-close');
            $('.view-info').hide();
            $('.edit-info').show();
        } else {
            b.removeClass('icofont-close');
            b.addClass('icofont-edit');
            $('.view-info').show();
            $('.edit-info').hide();
        }
    });
    //edit user description
    $('#edit-cancel-btn').on('click', function () {

        var c = $('#edit-info-btn').find("i");
        c.removeClass('icofont-close');
        c.addClass('icofont-edit');
        $('.view-desc').show();
        $('.edit-desc').hide();

    });

    $('.edit-desc').hide();


    $('#edit-info-btn').on('click', function () {
        var b = $(this).find("i");
        var edit_class = b.attr('class');
        if (edit_class == 'icofont icofont-edit') {
            b.removeClass('icofont-edit');
            b.addClass('icofont-close');
            $('.view-desc').hide();
            $('.edit-desc').show();
        } else {
            b.removeClass('icofont-close');
            b.addClass('icofont-edit');
            $('.view-desc').show();
            $('.edit-desc').hide();
        }
    });


    // Minimum setup
    $('#datetimepicker1').datetimepicker({
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // Using Locales
    $('#datetimepicker2').datetimepicker({
        locale: 'ru',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // Custom Formats
    $('#datetimepicker3').datetimepicker({
        format: 'LT',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // No Icon (input field only)
    $('#datetimepicker4').datetimepicker({
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // Enabled/Disabled Dates
    $('#datetimepicker5').datetimepicker({
        defaultDate: "11/1/2013",
        disabledDates: [
            moment("12/25/2013"),
            new Date(2013, 11 - 1, 21),
            "11/22/2013 00:53"
        ],
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // Linked Pickers
    $('#datetimepicker6').datetimepicker({
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    $('#datetimepicker7').datetimepicker({
        useCurrent: false, //Important! See issue #1075
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    $("#datetimepicker6").on("dp.change", function (e) {
        $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker7").on("dp.change", function (e) {
        $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
    });

    // Custom icons
    $('#datetimepicker8').datetimepicker({
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down"
        }
    });

    // View Mode
    $('#datetimepicker9').datetimepicker({
        viewMode: 'years',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });

    // Min View Mode
    $('#datetimepicker10').datetimepicker({
        viewMode: 'years',
        format: 'DD/MM/YYYY',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    $('#datetimepickerBirthDate').datetimepicker({
        format: 'DD/MM/YYYY',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // Mini-color js start
    $('.demo').each(function () {
        //
        // Dear reader, it's actually very easy to initialize MiniColors. For example:
        //
        //  $(selector).minicolors();
        //
        // The way I've done it below is just for the demo, so don't get confused
        // by it. Also, data- attributes aren't supported at this time...they're
        // only used for this demo.
        //
        $(this).minicolors({
            control: $(this).attr('data-control') || 'hue',
            defaultValue: $(this).attr('data-defaultValue') || '',
            format: $(this).attr('data-format') || 'hex',
            keywords: $(this).attr('data-keywords') || '',
            inline: $(this).attr('data-inline') === 'true',
            letterCase: $(this).attr('data-letterCase') || 'lowercase',
            opacity: $(this).attr('data-opacity'),
            position: $(this).attr('data-position') || 'bottom left',
            swatches: $(this).attr('data-swatches') ? $(this).attr('data-swatches').split('|') : [],
            change: function (value, opacity) {
                if (!value) return;
                if (opacity) value += ', ' + opacity;
                if (typeof console === 'object') {
                    console.log(value);
                }
            },
            theme: 'bootstrap'
        });

    });
    // Mini-color js ends
    $('#changeAvartar').on('click', function (e) {
        $('#inputChangeAvartar').trigger('click')
    });
    $('#inputChangeAvartar').change(function () {
        $('#imageAvartar').attr('src', $(this).val())
    });
    //--------------------------------------------------------------
    var table_emp = $('#table_Employee').DataTable({
        //"processing": true,
        "serverSide": true,
        "scrollX": true,
        "scrollCollapse": true,
        "autoFill": true,
        "fixedHeader": {
            header: true
        },
        "ajax": {

            "url": "/EmpAndCus/LoadTableEmployee",
            "data": function (d) {
            },
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "EmployeeName", "name": "EmployeeName", "autoWidth": true, "searchable": false },
            {
                "data": "Birthday", "name": "Birthday", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-right",
                "render": function (data, type, row) {
                    if (type === "sort" || type === "type") {
                        return data;
                    }
                    return moment(data).format("DD/MM/YYYY");
                }
            },
            {
                "data": "Gender", "name": "Gender", "autoWidth": true, "orderable": false, "searchable": false
                , "render": function (data, type, row) {
                    if (data === true)
                        return "Nam";
                    else
                        return "Nữ";

                }
            },
            { "data": "Email", "name": "Email", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-left" },
            { "data": "PhoneNumber", "name": "PhoneNumber", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-left" },
            { "data": "Address", "name": "Address", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-left" },


            {
                "data": "Status", "name": "Status", "autoWidth": true, "searchable": false, "orderable": false, "className": "text-center",
                "render": function (data, type, row) {
                    if (data === 1)
                        return "Active";
                    else
                        return "InActive";
                }
            },
            {
                "data": "Id", "name": "Action", "autoWidth": true, "searchable": false, "orderable": false, "className": "text-center dropdown",
                "render": function (data, type, row) {
                    return '<button type="button" class="btn btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="ti-angle-double-down"></i></button>' +
                        '<div class="dropdown-menu dropdown-menu-right b-none contact-menu">' +
                        '<a class="ChangeClassEmployee dropdown-item" href="#!" data-toggle="modal" data-target="#myEditCustomer"  data-id="' + data + '"><i class="icofont icofont-edit"></i>Edit</a>' +
                        '<a href="#" id="abc" data-target="#my_modal" data-toggle="modal" data-type="1" class="identifyingClass dropdown-item" data-id="' + data + '"><i class="icofont icofont-ui-delete"></i> Delete</a>' +
                        '</div>';
                }
            }
        ]
    })
    var table_cus = $('#table_Customer').DataTable({
        //"processing": true,
        "serverSide": true,
        "scrollX": true,
        "scrollCollapse": true,
        "autoFill": true,
        "fixedHeader": {
            header: true
        },
        "ajax": {

            "url": "/EmpAndCus/LoadTableCustomer",
            "data": function (d) {
            },
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "CustomerName", "name": "CustomerName", "autoWidth": true, "searchable": false },
            {
                "data": "Birthday", "name": "Birthday", "autoWidth": true, "searchable": false, "orderable": false, "className": "text-right",
                "render": function (data, type, row) {
                    if (type === "sort" || type === "type") {
                        return data;
                    }
                    if (data !== "" && data !== null) {
                        return moment(data).format("DD/MM/YYYY");
                    }
                    else {
                        return "";
                    }
                   
                }
            },
            {
                "data": "Gender", "name": "Gender", "autoWidth": true, "orderable": false, "searchable": false
                , "render": function (data, type, row) {
                    if (data === true)
                        return "Nam";
                    else if (data === false)
                        return "Nữ";
                    else return "";

                }
            },
            { "data": "Email", "name": "Email", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-left" },
            {
                "data": "PhoneNumber", "name": "PhoneNumber", "autoWidth": true, "searchable": false, "className": "text-left",
                "render": function (data, type, row) {
                    if (data === null)
                        return "";
                    else
                        return data;
                }
            },
            {
                "data": "Address", "name": "Address", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-left",
                "render": function (data, type, row) {
                    if (data === null)
                        return "";
                    else
                        return data;
                }
            },


            {
                "data": "Status", "name": "Status", "autoWidth": true, "orderable": false, "searchable": false, "orderable": false, "className": "text-center",
                "render": function (data, type, row) {
                    if (data === 1)
                        return "Active";
                    else
                        return "InActive";
                }
            },
            {
                "data": "Id", "name": "Action", "autoWidth": true, "searchable": false, "orderable": false, "className": "text-center dropdown",
                "render": function (data, type, row) {
                    return '<button type="button" class="btn btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="ti-angle-double-down"></i></button>' +
                        '<div class="dropdown-menu dropdown-menu-right b-none contact-menu">' +
                        '<a class="ChangeClassCustomer dropdown-item" href="#!" data-toggle="modal" data-target="#myEditCustomer"  data-id="' + data + '"><i class="icofont icofont-edit"></i>Edit</a>' +
                        '<a href="#" id="abc" data-target="#my_modal" data-toggle="modal" data-type="2" class="identifyingClass dropdown-item" data-id="' + data + '"><i class="icofont icofont-ui-delete"></i> Delete</a>' +
                        '</div>';
                }
            }
        ]
    })
    //table_emp.column(0).visible(false);
    $($.fn.dataTable.tables(true)).DataTable()
        .columns.adjust();
    //$('#button1').on('click', function () {
    //    $('#openModal').show();
    //});
    $('#datetimepickerBirthDate_emp').datetimepicker({
        format: 'DD/MM/YYYY',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    $("#btn_create_customer").on("click", function () {
        $("#modalLabel").text("Create Customer")
        $(".modal-body #typeChange").val(4);
    })
    $("#btn_create_employee").on("click", function () {
        $("#modalLabel").text("Create Employee")
        $(".modal-body #typeChange").val(3);
    })
    $(document).on('click', '.ChangeClassEmployee', function () {
        $("#modalLabel").text("Change Employee")
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #hiddenValue_change").val(my_id_value);
        $(".modal-body #typeChange").val(1); //Change Emp
        $.get('/EmpAndCus/GetInfoEmpOrCust', { type: 1, id: my_id_value }, function (data) {
            $("#EmployeeName").val(data.EmployeeName)
            $('#datetimepickerBirthDate_emp').val(moment(data.Birthday).format("DD/MM/YYYY"))
            $('#Email').val(data.Email)
            $("#PhoneNumber").val(data.PhoneNumber)
            $("#Address").val(data.Address)
            if (data.Gender) {
                $('#male').prop('checked', true);
            }
            else {
                $('#female').prop('checked', true);
            }
            //$('input[name=radio_list]:checked', '#GenderRadio_list').val()
        })
    })
    $(document).on('click', '.ChangeClassCustomer', function () {
        $("#modalLabel").text("Change Customer")
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #typeChange").val(2); //Change Cus
        $(".modal-body #hiddenValue_change").val(my_id_value);
        $.get('/EmpAndCus/GetInfoEmpOrCust', { type: 2, id: my_id_value }, function (data) {
            $("#EmployeeName").val(data.CustomerName)
            $('#datetimepickerBirthDate_emp').val(moment(data.Birthday).format("DD/MM/YYYY"))
            $('#Email').val(data.Email)
            $("#PhoneNumber").val(data.PhoneNumber)
            $("#Address").val(data.Address)
            if (data.Gender) {
                $('#male').prop('checked', true);
            }
            else {
                $('#female').prop('checked', true);
            }
        })
    })
    $("#btnSave_modal").on("click", function (e) {
        var myform = document.getElementById("myFromEmpAndCus");
        var form = new FormData(myform);
        form.append("Id", $("#hiddenValue_change").val());
        //form.append("typeChange", $("#typeChange").val());
        if ($("#myFromEmpAndCus").valid() == true) {
            $.ajax({
                type: "POST",
                url: "/EmpAndCus/UpdateEmpOrCus",
                contentType: false,
                processData: false,
                data: form,
                beforeSend: function () {
                    e.preventDefault();
                },
                success: function (data) {
                    //e.preventDefault();
                    if (data != null && data.success) {
                        $("#myEditCustomer").modal('hide')
                        table_emp.draw(false);
                        table_cus.draw(false);
                        $('.modal-body #hiddenValue_change').val("");
                        $('.modal-body #EmployeeName').val("");
                        $('.modal-body #datetimepickerBirthDate_emp').val("");
                        $('.modal-body #Email').val("");
                        $('.modal-body #PhoneNumber').val("");
                        $('.modal-body #Address').val("");
                        RenderMess("success", data.mess)

                    } else if (data != null && !data.success) {
                        $(".modal-body #myEditCustomer").modal('hide')
                        $('.modal-body #hiddenValue_change').val("");
                        $('.modal-body #EmployeeName').val("");
                        $('.modal-body #datetimepickerBirthDate_emp').val("");
                        $('.modal-body #Email').val("");
                        $('.modal-body #PhoneNumber').val("");
                        $('.modal-body #Address').val("");
                        RenderMess("error", data.mess)
                    }
                },
                error: function (xhr, status, errorThrown) {
                    $(".modal-body #myEditCustomer").modal('hide')
                    $('.modal-body #hiddenValue_change').val("");
                    $('.modal-body #EmployeeName').val("");
                    $('.modal-body #datetimepickerBirthDate_emp').val("");
                    $('.modal-body #Email').val("");
                    $('.modal-body #PhoneNumber').val("");
                    $('.modal-body #Address').val("");
                    RenderMess("error", errorThrown)
                }
            })
        }
    })
    $(document).on('click', '.identifyingClass', function () {
        var my_id_value = $(this).attr('data-id')
        var type = $(this).attr('data-type')
        $("#id_delete").val(my_id_value)
        $("#type_delete").val(type)
    })
    $("#btn_OK1").on("click", function () {
        var my_id_value = $("#id_delete").val()
        var type = $("#type_delete").val()
        $.ajax({
            type: "GET",
            url: "/EmpAndCus/Delete",
            data: {
                id: my_id_value, type: type
            },
            success: function (result) {
                //table.ajax.reload();
                if (result.success) {
                    table_cus.draw(false);
                    table_emp.draw(false);
                    $("#my_modal").modal('hide')
                    RenderMess("success", result.mess)
                }
                else {
                    $("#my_modal").modal('hide')
                    RenderMess("error", "Xóa thất bại!");
                }
            },
            error: function (err) {
                console.log(err)
                RenderMess("error", "Xóa thất bại!");
            }
        })

    })
});
