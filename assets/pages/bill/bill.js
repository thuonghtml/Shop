$(document).ready(function () {
    $("a[data-toggle=\"tab\"]").on("shown.bs.tab", function (e) {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });
    var RenderMess = function (type, mess) {
        toastr.options = { "newestOnTop": true, "showMethod": "show", "hideMethod": "hide", "progressBar": true, };
        toastr[type]("<strong>" + mess + "</strong>");
    }
    $(".js-example-responsive").select2({
        width: 'resolve' // need to override the changed default
    });
    $.each(billstatus, function (index, item) {
        $('#billstatus').append('<option value="' + item.Id + '">' + item.Description + '</option>')
    })
    var table = $('#table_bill').DataTable({
        //"processing": true,
        "serverSide": true,
        "scrollX": true,
        "scrollCollapse": true,
        "autoFill": true,
        "fixedHeader": {
            header: true
        },
        "ajax": {

            "url": "/Bill/LoadDataTable",
            "data": function (d) {
                d.status = $('#billstatus').val();
            },
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "CustomerName", "name": "CustomerName", "autoWidth": true, "searchable": true },
            { "data": "PhoneNumber", "name": "PhoneNumber", "autoWidth": true, "searchable": true },
            { "data": "Email", "name": "Email", "autoWidth": true, "searchable": true },
            { "data": "Address", "name": "Address", "autoWidth": true, "searchable": false },
            { "data": "Note", "name": "Note", "autoWidth": true, "searchable": false },
            {
                "data": "DateCreate", "name": "DateCreate", "autoWidth": true, "orderable": true, "searchable": false, "className": "text-right",
                "render": function (data, type, row) {
                    if (type === "sort" || type === "type") {
                        return data;
                    }
                    return moment(data).format("DD/MM/YYYY");
                }
            },
            { "data": "NumberOfProduct", "name": "NumberOfProduct", "autoWidth": true, "searchable": false },
            { "data": "Total", "name": "Total", "autoWidth": true, "searchable": false },
            {
                "data": "DateConfirmed", "name": "DateConfirmed", "autoWidth": true, "orderable": true, "searchable": false, "className": "text-right",
                "render": function (data, type, row) {
                    if (data !== null) {
                        if (type === "sort" || type === "type") {
                            return data;
                        }
                        return moment(data).format("DD/MM/YYYY");
                    }
                    return data;
                }
            },
            { "data": "Description", "name": "Description", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-left" },
            { "data": "EmployeeName", "name": "EmployeeName", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-left" },

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
    $('#billstatus').on('change', function () {
        table.draw(false)
    });
    // ---------------------------------------------------------------------------
    var GetSizeColor = function (data) {
        $.get('/Bill/GetSizeAndColor', { productid: data }, function (result) {
            console.log(result)
            if (result.size.length > 0) {
                var html = ""
                $.each(result.size, function (index, item) {
                    html += '<option value="' + item.size + '">Size ' + item.size + ' </option>'
                })
                $("#size").html(html);
            }
            if (result.color.length > 0) {
                var html = ""
                $.each(result.color, function (index, item) {
                    html += '<option value="' + item.color + '"> ' + item.color + ' </option>'
                })
                $("#color").html(html);
            }
        })
    }
    var getdata = function () {
        $.get('/Bill/GetProdutByGender', { gender: $('input[name=radio_list]:checked', '#GenderRadio_list').val() }, function (result) {
            $("#ProductId_list").select2({
                data: result
            })
            var data = $('#ProductId_list').val()
            GetSizeColor(data)
        })
    }
    getdata()
    $('#GenderRadio_list input').on('change', function () {
        $('#ProductId_list').val(null).trigger('change');
        $("#ProductId_list").html('').select2();
        getdata()
       
    });   
    $('#ProductId_list').on('change', function () {
        var data = $("#ProductId_list option:selected").val();
        GetSizeColor(data)
    })
});