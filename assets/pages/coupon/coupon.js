'use strict';
$(document).ready(function () {
    var RenderMess = function (type, mess) {
        toastr.options = { "newestOnTop": true, "showMethod": "show", "hideMethod": "hide", "progressBar": true, };
        toastr[type]("<strong>" + mess + "</strong>");
    }
    $("a[data-toggle=\"tab\"]").on("shown.bs.tab", function (e) {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });
    $('#DateBegin').datetimepicker({
        format: 'MM/DD/YYYY',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    $('#DateEnd').datetimepicker({
        format: 'MM/DD/YYYY',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    var table_coupon = $('#table_Coupon').DataTable({
        //"processing": true,
        "serverSide": true,
        "scrollX": true,
        "scrollCollapse": true,
        "autoFill": true,
        "fixedHeader": {
            header: true
        },
        "ajax": {

            "url": "/Coupon/LoadDataTable",
            "data": function (d) {
            },
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "CouponCode", "name": "CouponCode", "autoWidth": true, "searchable": false },
            {
                "data": "DateBegin", "name": "DateBegin", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-right",
                "render": function (data, type, row) {
                    if (type === "sort" || type === "type") {
                        return data;
                    }
                    return moment(data).format("DD/MM/YYYY");
                }
            },
            {
                "data": "DateEnd", "name": "DateEnd", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-right",
                "render": function (data, type, row) {
                    if (type === "sort" || type === "type") {
                        return data;
                    }
                    return moment(data).format("DD/MM/YYYY");
                }
            }, 
            { "data": "Price", "name": "Price", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-right", "render": $.fn.dataTable.render.number(',') },
            { "data": "Quantity", "name": "Quantity", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-center" },
            { "data": "QuantityRemaining", "name": "QuantityRemaining", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-center" },
            {
                "data": "DateCreate", "name": "DateCreate", "autoWidth": true, "orderable": false, "searchable": false, "className": "text-right",
                "render": function (data, type, row) {
                    if (type === "sort" || type === "type") {
                        return data;
                    }
                    return moment(data).format("DD/MM/YYYY");
                }
            },     
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
                        '<a class="ChangeClassCoupon dropdown-item" href="#!" data-toggle="modal" data-target="#myEditCoupon"  data-id="' + data + '"><i class="icofont icofont-edit"></i>Edit</a>' +
                        '<a href="#" id="abc" data-target="#my_modal" data-toggle="modal" data-type="1" class="identifyingClass dropdown-item" data-id="' + data + '"><i class="icofont icofont-ui-delete"></i> Delete</a>' +
                        '</div>';
                }
            }
        ]
    })
    $("#btn_create_coupon").on("click", function () {
        $("#modalLabel").text("Create Coupon")
        $('#CouponCode').prop('readonly', false);
        $(".modal-body #typeChange").val(1);
        $('.modal-body #CouponCode').val("");
        $('.modal-body #DateBegin').val("");
        $('.modal-body #DateEnd').val("");
        $('.modal-body #Price').val("");
        $('.modal-body #Quantity').val("");
        $('.modal-body #QuantityRemaining').val("");
    })
    $("#btnSave_modal").on("click", function (e) {
        var myform = document.getElementById("myFromCoupon");
        var form = new FormData(myform);
        form.append("Id", $("#hiddenValue_change").val());
        //form.append("typeChange", $("#typeChange").val());
        if ($("#myFromCoupon").valid() == true) {
            $.ajax({
                type: "POST",
                url: "/Coupon/CreateOrUpdate",
                contentType: false,
                processData: false,
                data: form,
                beforeSend: function () {
                    e.preventDefault();
                },
                success: function (data) {
                    //e.preventDefault();
                    if (data != null && data.success) {
                        $("#myEditCoupon").modal('hide')
                        table_coupon.draw(false);
                        $('.modal-body #hiddenValue_change').val("");
                        $('.modal-body #CouponCode').val("");
                        $('.modal-body #DateBegin').val("");
                        $('.modal-body #DateEnd').val("");
                        $('.modal-body #Price').val("");
                        $('.modal-body #Quantity').val("");
                        $('.modal-body #QuantityRemaining').val("");
                        RenderMess("success", data.mess)

                    } else if (data != null && !data.success) {
                        $("#myEditCoupon").modal('hide')
                        $('.modal-body #hiddenValue_change').val("");
                        $('.modal-body #CouponCode').val("");
                        $('.modal-body #DateBegin').val("");
                        $('.modal-body #DateEnd').val("");
                        $('.modal-body #Price').val("");
                        $('.modal-body #Quantity').val("");
                        $('.modal-body #QuantityRemaining').val("");
                        RenderMess("error", data.mess)
                    }
                },
                error: function (xhr, status, errorThrown) {
                    $("#myEditCoupon").modal('hide')
                    $('.modal-body #hiddenValue_change').val("");
                    $('.modal-body #CouponCode').val("");
                    $('.modal-body #DateBegin').val("");
                    $('.modal-body #DateEnd').val("");
                    $('.modal-body #Price').val("");
                    $('.modal-body #Quantity').val("");
                    $('.modal-body #QuantityRemaining').val("");
                    RenderMess("error", errorThrown)
                }
            })
        }
    })
    $(document).on('click', '.ChangeClassCoupon', function () {
        
        $("#modalLabel").text("Change Coupon")
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #hiddenValue_change").val(my_id_value);
        $(".modal-body #typeChange").val(2); //Change Coupon
        $('#CouponCode').prop('readonly', true);
        $.get('/Coupon/GetInfoCoupon', { id: my_id_value }, function (data) {  
            $('.modal-body #CouponCode').val(data.CouponCode);
            $('.modal-body #DateBegin').val(moment(data.DateBegin).format("MM/DD/YYYY"));
            $('.modal-body #DateEnd').val(moment(data.DateEnd).format("MM/DD/YYYY"));
            $('.modal-body #Price').val(data.Price);
            $('.modal-body #Quantity').val(data.Quantity);
            $('.modal-body #QuantityRemaining').val(data.QuantityRemaining);
            //$('input[name=radio_list]:checked', '#GenderRadio_list').val()
        })
    })
    $(document).on('click', '.identifyingClass', function () {
        var my_id_value = $(this).attr('data-id')
        $('#id_delete').val(my_id_value)
    })
    $("#btn_OK1").on("click", function () {
        var my_id_value = $("#id_delete").val()   
        $.ajax({
            type: "GET",
            url: "/Coupon/Delete",
            data: {
                id: my_id_value
            },
            success: function (result) {
                //table.ajax.reload();
                if (result.success) {
                    table_coupon.draw(false);
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
