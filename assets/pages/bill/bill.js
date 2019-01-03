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
                    return '<a href="/Bill/BillDetail/' + data + '" class="btn btn-primary btn-square"><i class="icofont icofont-eye-alt"></i>View</a>';
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

            if (result.size.length > 0) {
                var html = ""
                $.each(result.size, function (index, item) {
                    if (item.size === null) {
                        html += '<option value=""> ' + "Tùy Chọn" + ' </option>'
                    }
                    else {
                        html += '<option value="' + item.size + '">Size ' + item.size + ' </option>'
                    }
                })
                $("#size").html(html);
            }
            if (result.color.length > 0) {
                var html = ""
                $.each(result.color, function (index, item) {
                    if (item.color === null) {
                        html += '<option value=""> ' + "Tùy Chọn" + ' </option>'
                    }
                    else {
                        html += '<option value="' + item.color + '"> ' + item.color + ' </option>'
                    }

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
    //----------------------------------------------------------
    var listbillDetails = []
    var a = 0;
    $('#btnAdd').on("click", function (e) {
        e.preventDefault()
        var productid = $('#ProductId_list').val();
        var color = $('#color').val();
        var size = $('#size').val();
        var quantity = $('#quantity').val()
        if (listbillDetails.length > 0) {
            var checktrung = []
            $.each(listbillDetails, function (index, item) {
                console.log(item.ProductId == productid && item.Size == size && item.Color == color)
                if (item.ProductId == productid && item.Size == size && item.Color == color) {
                    checktrung.push(item);
                }
            })
          
            if (checktrung.length > 0) {
                RenderMess("error", "Sản phẩm đã tồn tại")
                return false
            }
        }
        if (productid !== "" &&productid !== null) {
            $.ajax({
                type: "GET",
                url: "/Bill/AddBillDetails",
                contentType: "application/json; charset=utf-8",
                data: {
                    "productid": productid,
                    "color": color,
                    "size": size,
                    "number": quantity,
                    "key": a++
                },
                success: function (result) {
                    //debugger;
                    if (result.success) {
                        listbillDetails.push(result.billdetails)
                        var html = ""
                        $.each(listbillDetails, function (index, item) {
                            html += '<tr id="' + (index + 1) + '">'
                                + '    <td>' + (index + 1) + '</td> '
                                + '    <td>' + item.ProductName + '</td>  '
                                + '    <td>' + item.Size + '</td>      '
                                + '    <td>' + item.Color + '</td>   '
                                + '    <td>' + numeral(item.Price).format('0,0') + " VNĐ" + '</td> '
                                + '    <td>' + item.Number + '</td>  '
                                + '    <td>' + numeral(item.IntoMoney).format('0,0') + " VNĐ" + '</td>  '
                                + '    <td><button data-key="' + item.Key + '" class="deleteclasss btn btn-danger">Delete</button></td>   '
                                + '</tr>   '
                        })
                        $('#contentbill').html(html)
                        RenderMess("success", "Đã thêm thànhcông!")
                    }
                    else {
                        RenderMess("error", result.mess)
                    }
                },
                error: function () {
                    RenderMess("error", "Lỗi");
                }
            })
        }
        
    })
    
    $(document).on('click', '.deleteclasss', function (e) {
        var key = $(this).attr("data-key")
        listbillDetails = listbillDetails.filter(function (object) {
            return object.Key.toString() !== key;
        })
        var html = ""
        $.each(listbillDetails, function (index, item) {
            html += '<tr id="' + (index + 1) + '">'
                + '    <td>' + (index + 1) + '</td> '
                + '    <td>' + item.ProductName + '</td>  '
                + '    <td>' + item.Size + '</td>      '
                + '    <td>' + item.Color + '</td>   '
                + '    <td>' + numeral(item.Price).format('0,0') + " VNĐ" + '</td> '
                + '    <td>' + item.Number + '</td>  '
                + '    <td>' + numeral(item.IntoMoney).format('0,0') + " VNĐ" + '</td>  '
                + '    <td><button data-key="' + item.Key + '" class="deleteclasss btn btn-danger">Delete</button></td>  '
                + '</tr>   '
        })
        $('#contentbill').html(html)
    })
});