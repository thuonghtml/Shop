$(document).ready(function () {
    $("a[data-toggle=\"tab\"]").on("shown.bs.tab", function (e) {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });
    var table = $('#tableBill').DataTable({
        //"processing": true,
        "serverSide": true,
        "scrollX": true,
        "scrollCollapse": true,
        "fixedHeader": {
            header: true
        },
        "searching": false,
        "ajax": {

            "url": "/Bill/LoadDataTableHome",
            "data": function (d) {             
            },
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "CustomerName", "name": "CustomerName", "autoWidth": true, "searchable": false },
            { "data": "Address", "name": "Address", "autoWidth": true, "searchable": true },
            { "data": "PhoneNumber", "name": "PhoneNumber", "autoWidth": true, "searchable": true },
            { "data": "Email", "name": "Email", "autoWidth": true, "searchable": false, "className": "text-center" },
            { "data": "Note", "name": "Note", "autoWidth": true, "searchable": false, "className": "text-center" },
            { "data": "NumberOfProduct", "name": "NumberOfProduct", "autoWidth": true, "searchable": false, "className": "text-right", },
            { "data": "Total", "name": "Total", "autoWidth": true, "searchable": false, "className": "text-center", "render": $.fn.dataTable.render.number(',')},
            { "data": "CouponCode", "name": "CouponCode", "autoWidth": true, "searchable": false, "className": "text-center" }, 
            { "data": "Description", "name": "Description", "autoWidth": true, "searchable": false, "className": "text-center" },
            {
                "data": "DateCreate", "type": "datetime", "name": "DateCreate", "autoWidth": true, "searchable": false, "render": function (value) {
                    if (value === null) return "";

                    var pattern = /Date\(([^)]+)\)/;
                    var results = pattern.exec(value);
                    var dt = new Date(parseFloat(results[1]));

                    return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes();
                }
            },
            {
                "data": "DateConfirmed", "type": "datetime", "name": "DateCreate", "autoWidth": true, "searchable": false, "render": function (value) {
                    if (value === null) return "";

                    var pattern = /Date\(([^)]+)\)/;
                    var results = pattern.exec(value);
                    var dt = new Date(parseFloat(results[1]));

                    return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes();
                }
            },
            {
                "data": { "Id":"Id","Status":"Status"}, "name": "Action", "autoWidth": true, "searchable": false, "orderable": false, "className": "text-center dropdown",
                "render": function (data, type, row) {
                    if (data.Status > 1 || data.Status === 0) {
                        return '<button type="button" class="btn btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">  <i class="material-icons">add</i></button>' +
                            '<div class="dropdown-menu dropdown-menu-right b-none contact-menu">' +
                            '<a class="js-show-modal2 ChangeClass dropdown-item" href="#!" data-toggle="modal" data-target="#my_modal_Bill"  data-id="' + data.Id + '"><i class="icofont icofont-edit"></i>View</a>' +
                            '</div>';
                    }
                    else {
                        return '<button type="button" class="btn btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">  <i class="material-icons">add</i></button>' +
                            '<div class="dropdown-menu dropdown-menu-right b-none contact-menu">' +
                            '<a class="js-show-modal2 ChangeClass dropdown-item" href="#!" data-toggle="modal" data-target="#my_modal_Bill"  data-id="' + data.Id + '"><i class="icofont icofont-edit"></i>View</a>' +
                            '<a href="#" id="abc" data-target="#my_modal" data-toggle="modal" class="identifyingClass dropdown-item" data-id="' + data.Id + '"><i class="icofont icofont-ui-delete"></i>Cancelling invoice</a>' +
                            '</div>';
                    }
                }
            }
        ]
    })
    $('.js-hide-modal3').on('click', function () {
        $('.js-modal3').removeClass('show-modal3');
    });
    $(document).on('click', '.js-show-modal2', function (e) {
        var id = $(this).attr("data-id");
        $.ajax({
            type: "GET",
            url: '/Bill/BillDetailHome',
            contentType: "application/json; charset=utf-8",
            data: { id: id },
            datatype: "json",
            success: function (result) {
                //debugger;
                var subtotal = 0
                var html =""
                $.each(result, function (index, item) {
                    subtotal += item.ToMoney
                    var size = item.Size === null ? "" : item.Size;
                    var color = item.Color === null ? "" : item.Color;
                    html += '<tr>'
                        + '<td style="text-align:center">' + (index + 1) + '</td>'
                        + '<td>' + item.ProductName + '</td>'
                        + '<td style="text-align:center">' + size + '</td>'
                        + '<td>' + color + '</td>'
                        + '<td style="text-align:right">' + numeral(item.Price).format('0,0') + " VNĐ" + '</td>'
                        + '<td style="text-align:center">' + item.Quantity + '</td>'
                        + '<td style="text-align:right">' + numeral(item.ToMoney).format('0,0') + " VNĐ" + '</td>'
                        + '</tr>'
                })
                html += '<tr>'
                    + '<td colspan="6" style="text-align:right">SubTotal:</td>'
                    + '<td style="text-align:right"> ' + numeral(subtotal).format('0,0') + " VNĐ" + '</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td colspan="6" style="text-align:right">Coupon:</td>'
                    + '<td style="text-align:right">' + numeral(result[0].Coupon).format('0,0') + " VNĐ" + '</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td colspan="6" style="text-align:right">Total:</td>'
                    + '<td style="text-align:right">' + numeral(subtotal - result[0].Coupon).format('0,0') + " VNĐ" + '</td>'
                    + '</tr>'
                $('#table_bill_details').html(html) 
            },
            error: function () {
                console.log("Lỗi")
            }
        });
        $('.js-modal3').addClass('show-modal3');
    })

    $(document).on("click", ".identifyingClass", function () {
        var id = $(this).attr("data-id");
        swal({
            title: "Are you sure?",
            text: "Bạn muốn hủy đơn hàng!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    $.ajax({
                        type: "GET",
                        url: "/Bill/UpdateBillStaus",
                        data: {
                            id: id, status: 0
                        },
                        success: function (data) {
                            if (data.success) {
                                swal("Đã hủy đơn hàng thành công!", {
                                    icon: "success",    
                                });
                                table.draw(false);
                            }
                            else {
                                swal("Hủy đơn hàng không thành công!", {
                                    icon: "error",
                                });
                            }
                        },
                        error: function (xhr, status, errorThrown) {
                           
                        }

                    })
                    
                }
            });
    })
})



