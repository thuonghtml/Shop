$(document).ready(function () {
    $("a[data-toggle=\"tab\"]").on("shown.bs.tab", function (e) {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });
    var RenderMess = function (type, mess) {
        toastr.options = { "newestOnTop": true, "showMethod": "show", "hideMethod": "hide", "progressBar": true, };
        toastr[type]("<strong>" + mess + "</strong>");
    }
    var table = $('#table_Contact').DataTable({
        //"processing": true,
        "serverSide": true,
        "scrollX": true,
        "scrollCollapse": true,
        "fixedHeader": {
            header: true
        },
        "ajax": {

            "url": "/Contact/LoadDataTable",
            "data": function (d) { },
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "Email", "name": "ProductName", "autoWidth": true, "searchable": true },
            { "data": "Message", "name": "Size", "autoWidth": true, "searchable": false, "className": "text-left" },
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
                "data": "Id", "name": "Action", "autoWidth": true, "searchable": false, "orderable": false, "className": "text-center dropdown",
                "render": function (data, type, row) {
                    return '<button type="button" class="Reply btn btn-primary" data-toggle="modal" data-target="#my_modal_Reply"  data-id="' + data + '"><i class="ti-comment-alt"></"></i></button>';;
                }
            }
        ]
    })
   
    $(document).on("click", ".Reply", function () {
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #hiddenValue_change").val(my_id_value);
        $("#my_modal_Reply").modal("show");
    })
    $("#btn_reply_mess").on("click", function (e) {
        var myform = document.getElementById("myFromReply");
        var form = new FormData(myform);
        form.append("Id", $("#hiddenValue_change").val());
        if ($("#myFromReply").valid() === true) {
            $.ajax({
                type: "POST",
                url: "/Contact/Reply",
                contentType: false,
                processData: false,
                data: form,
                beforeSend: function () {
                    e.preventDefault();
                },
                success: function (result) {
                    //e.preventDefault();
                    if (result.success === true) {
                        $("#my_modal_Reply").modal("hide");
                        RenderMess("success", result.data);
                        table.draw(false)
                    }
                    else {
                        $("#my_modal_Reply").modal("hide");
                        RenderMess("error", result.data);
                    }
                },
                error: function (xhr, status, errorThrown) {
                }
            })
        }
    })
})