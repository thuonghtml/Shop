$(document).ready(function () {
    var RenderMess = function (type, mess) {
        toastr.options = { "newestOnTop": true, "showMethod": "show", "hideMethod": "hide", "progressBar": true, };
        toastr[type]("<strong>" + mess + "</strong>");
    }
    CKEDITOR.replace('Content');
    //CKEDITOR.replace('content_change');
    $('#btnSave').on('click', function (e) {
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
        }
        var myform = document.getElementById("myFromBlog");
        var form = new FormData(myform);
        if ($("#myFromBlog").valid() === true) {
            $.ajax({
                type: "POST",
                url: "/Blog/Create",
                contentType: false,
                processData: false,
                data: form,
                beforeSend: function () {
                    e.preventDefault();
                },
                success: function (data) {
                    //e.preventDefault();
                    if (data.success) {
                        RenderMess("success", data.mess)
                        $('#BlogName').val("");
                        $('#Photo').val(""); 
                        $("#Tag").val("")
                        CKEDITOR.instances.Content.setData('');
                        table.draw(false);
                    }
                    else {
                        RenderMess("error", "Xóa thất bại!");
                    }
                },
                error: function (xhr, status, errorThrown) {
                }
            })
        }
    })
    var table = $('#table_Blog').DataTable({
        //"processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/Blog/LoadDataTable",
            "data": function (d) {},
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "BlogName", "name": "BlogName", "autoWidth": true, "searchable": false },     
            {
                "data": "Photo", "name": "Photo", "autoWidth": true, "searchable": false, "orderable": false,
                "render": function (data, type, row) {
                    var htmlreturn = '<div class ="row">'; 
                        htmlreturn += '<div class="col-xl-4 col-lg-6 col-sm-6 col-xs-12" >' +
                            '<a href="' + data + '" data-toggle="lightbox">' +
                            '<img src="' + data + '" class="img-fluid" alt="">' +
                            '</a>' + '</div>'
                    
                    htmlreturn += '</div>'
                    return htmlreturn;
                }
            },
            { "data": "Tag", "name": "Tag", "autoWidth": true, "searchable": false },  
            { "data": "EmployeeName", "name": "BlogName", "autoWidth": true, "searchable": false },
            {
                "data": "TimeCreate", "type": "datetime", "name": "DateCreate", "autoWidth": true, "searchable": false, "render": function (value) {
                    if (value === null) return "";

                    var pattern = /Date\(([^)]+)\)/;
                    var results = pattern.exec(value);
                    var dt = new Date(parseFloat(results[1]));

                    return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() ;
                }
            },
            //{
            //    "data": "Status", "name": "Status", "autoWidth": true, "searchable": false, "orderable": false, "className": "text-center",
            //    "render": function (data, type, row) {
            //        if (data === 1)
            //            return "Active";
            //        else
            //            return "InActive";
            //    }
            //},
            {
                "data": "Id", "name": "Action", "autoWidth": true, "searchable": false, "orderable": false, "className": "text-center dropdown",
                "render": function (data, type, row) {
                    return '<button type="button" class="btn btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="ti-angle-double-down"></i></button>' +
                        '<div class="dropdown-menu dropdown-menu-right b-none contact-menu">' +
                        '<a class="ChangeClass dropdown-item" href="#!" data-toggle="modal" data-target="#my_modal_EditBlog"  data-id="' + data + '"><i class="icofont icofont-edit"></i>Edit</a>' +
                        '<a href="#" id="abc" data-target="#my_modal" data-toggle="modal" class="identifyingClass dropdown-item" data-id="' + data + '"><i class="icofont icofont-ui-delete"></i> Delete</a>' +
                        '</div>';
                }
            }
        ]
    })
    $(document).on('click', '.identifyingClass', function () {
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #hiddenValue").val(my_id_value);
    });
    $("#btn_OK1").on("click", function () {

        $("#my_modal").modal('hide')
        $.ajax({
            type: "GET",
            url: "/Blog/Delete",
            data: {
                id: parseInt($("#hiddenValue").val())
            },
            success: function (result) {
                //table.ajax.reload();
                if (result.success) {
                    RenderMess("success", result.mess)
                    table.draw(false);  
                }
                else {
                    RenderMess("error", "Xóa thất bại!");
                }
            },
            error: function (err) {
                console.log(err)
                RenderMess("error", "Xóa thất bại!");
            }
        })

    })
    CKEDITOR.replace('content_change');
    $(document).on('click', '.ChangeClass', function () {
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #hiddenValue_change").val(my_id_value);
        $.get('/Blog/GetInfoBlog', { id: my_id_value }, function (data) {
  
                $('#viewImageBlog_change').empty();
                $('#blogname_change').val(data.BlogName);  
                //CKEDITOR.instances.content_change.setData(data.Content);
                $("#tag_change").val(data.TagId).change();
                CKEDITOR.instances.content_change.setData(data.Content);
                var htmlreturn = ''; 
                    htmlreturn += '<div class="img-wrap col-xl-4 col-lg-6 col-sm-6 col-xs-12" >' +
                        ' <span class="close">&times;</span>' +
                        '<a href="' + data.Photo +'" data-toggle="lightbox">' +
                        '<img src="' + data.Photo + '" class="img-fluid" alt="">' +
                        '</a>' + '</div>'  
                $('#viewImageBlog_change').append(htmlreturn);  
        });
        //console.log($('#GenderRadio_tab'))

    });
    $('#btn_Save_Blog').on("click", function (e) {
        var value = CKEDITOR.instances.content_change.getData()
        var myform = document.getElementById("myFromBlog_change");
        var form = new FormData(myform);
        form.append("Id", $("#hiddenValue_change").val());
        form.append("content_change", value);
        if ($("#myFromBlog_change").valid() == true) {
            $.ajax({
                type: "POST",
                url: "/Blog/UpdateBlog",
                contentType: false,
                processData: false,
                data: form,
                beforeSend: function () {
                    e.preventDefault();
                },
                success: function (data) {
                    //e.preventDefault();
                    if (data != null && data.success) {
                        $("#my_modal_EditBlog").modal('hide')
                        $(".modal-body #Photo").val("")
                        table.draw(false);  
                        RenderMess("success", data.mess)   
                    } else if (data != null && !data.success) {   
                        RenderMess("error", "Lỗi không cập nhật thành công")
                        $(".modal-body #Photo").val("")
                    }
                },
                error: function (xhr, status, errorThrown) {  

                }
            })
        }
    })
});