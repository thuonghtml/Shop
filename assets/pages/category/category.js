$(document).ready(function () {
    // Begin Tag Add Category
    $("#divParentSearch").width($("#divParentCategory").width());
    $(window).resize(function () {
        $("#divParentSearch").width($("#divParentCategory").width());

    });

    var CheckGender = $('input[name=radio]:checked', '#GenderRadio').val() // 1 - Nam : 0 - Nữ : 2 - Couple
    var Refresh_Parent_Category = function () {
        $('#inputCategory').val("Select Parent Category Name")
        $('#ValueParentCategory').val('');
        $('#ParentCategory-tree').jstree("deselect_all");
        $('#ParentCategory-tree').jstree("close_all");
        $('#divParentSearch').hide();
    }
    var Render_Category_Tree = function () {
        $('#divParentSearch').hide();
        $('#inputCategory').click(function () {
            $('#divParentSearch').toggle();
            $('#searchRegion').focus();
        });
        $("#refreshCategory").click(function () {
            Refresh_Parent_Category();
        });
        var to = false;
        $('#searchCategory').keyup(function () {
            if (to) { clearTimeout(to); }
            to = setTimeout(function () {
                var v = $('#searchCategory').val();
                $('#ParentCategory-tree').jstree(true).search(v);
            }, 250);
        });
    };
    Render_Category_Tree();
    var GetCategory = function (CheckGender) {
        var _gender = null
        if (parseInt(CheckGender) === 1)
            _gender = true
        if (parseInt(CheckGender) === 0)
            _gender = false
        $.get('/Category/GetCategories', { gender: _gender }, function (data) {
            if (data !== null && data !== undefined && data !== "") {
                dataCatrgories = data;
                var datas = []
                $.each(dataCatrgories, function (index, item) {
                    datas.push({
                        id: item.Id,
                        parent: item.ParentId,
                        text: item.CategoryName,
                        type: item.Type
                    });
                });
                $('#ParentCategory-tree').on('changed.jstree', function (e, data) {
                    var i, j, r = [];
                    for (i = 0, j = data.selected.length; i < j; i++) {
                        r.push({
                            'Id': data.instance.get_node(data.selected[i]).id,
                            'Text': data.instance.get_node(data.selected[i]).text
                        });
                    }
                    if (r.length > 0) {
                        $('#inputCategory').val(r[0].Text)
                        $('#ValueParentCategory').val(r[0].Id);
                        $('#divParentSearch').hide();
                    }
                }).jstree({
                    'core': { 'data': datas, },
                    "plugins": [
                        "search",
                        "types",
                        "wholerow",],
                    "types": {
                        "ao": {
                            "icon": "/assets/icon/IconCategory/Ao.png"
                        },
                        "quan": {
                            "icon": "/assets/icon/IconCategory/Quan.png"
                        },
                        "giay": {
                            "icon": "/assets/icon/IconCategory/Giay.jpg"
                        },
                        "phukien": {
                            "icon": "/assets/icon/IconCategory/PK.jpg"
                        }
                    },
                });

            }

        });
    }
    GetCategory(CheckGender);
    var GetDataCategory = function () {
        var datas = []
        var _gender = null
        if (parseInt(CheckGender) === 1)
            _gender = true
        if (parseInt(CheckGender) === 0)
            _gender = false
        $.get('/Category/GetCategories', { gender: _gender }, function (data) {
            if (data !== null && data !== undefined && data !== "") {
                dataCatrgories = data;
                $.each(dataCatrgories, function (index, item) {
                    datas.push({
                        id: item.Id,
                        parent: item.ParentId,
                        text: item.CategoryName,
                        type: item.Type
                    });
                });

            }
            $('#ParentCategory-tree').jstree(true).settings.core.data = datas
            $('#ParentCategory-tree').jstree(true).refresh();
            Refresh_Parent_Category();
        });
    }
    $('#GenderRadio input').on('change', function () {
        CheckGender = $('input[name=radio]:checked', '#GenderRadio').val()
        GetDataCategory()
    });
    function notify(from, align, icon, type, animIn, animOut, title, mess) {
        $.growl({
            icon: icon,
            title: title,
            message: mess,
            url: ''
        }, {
                element: 'body',
                type: type,
                allow_dismiss: true,
                placement: {
                    from: from,
                    align: align
                },
                offset: {
                    x: 30,
                    y: 30
                },
                spacing: 10,
                z_index: 999999,
                delay: 2500,
                timer: 1000,
                url_target: '_blank',
                mouse_over: false,
                animate: {
                    enter: animIn,
                    exit: animOut
                },
                icon_type: 'class',
                template: '<div data-growl="container" class="alert" role="alert">' +
                '<button type="button" class="close" data-growl="dismiss">' +
                '<span aria-hidden="true">&times;</span>' +
                '<span class="sr-only">Close</span>' +
                '</button>' +
                '<span data-growl="icon"></span>' +
                '<span data-growl="title"></span>' +
                '<span data-growl="message"></span>' +
                '<a href="#" data-growl="url"></a>' +
                '</div>'
            });
    };
    $('#btnSave').on('click', function () {
        var category = $('#input_Category').val(),
            parentId = $('#ValueParentCategory').val() === "" ? '#' : $('#ValueParentCategory').val();
        if (category !== null && category !== undefined && category !== "") {
            var _gender = null;
            if (parseInt(CheckGender) === 1)
                _gender = true
            if (parseInt(CheckGender) === 0)
                _gender = false
            $.ajax({
                type: "POST",
                url: "/Category/AddCategory",
                data: {
                    parentId: parentId,
                    categoryName: category,
                    gender: _gender
                },
                //contentType: "application/json; charset=utf-8",
                //dataType: "json",
                success: function (msg) {
                    notify("top", "right", "fa fa-check", "success", "animated fadeInRight", "animated fadeOutRight", "AddCategory: ", msg);
                    CheckGender = $('input[name=radio]:checked', '#GenderRadio').val()
                    GetDataCategory()
                    category = $('#input_Category').val('');
                },
                error: function (err) {
                    notify("top", "right", "fa fa-check", "danger", "animated fadeInRight", "animated fadeOutRight", "Add Category: ", err);
                }
            });
        }
        else
            notify("top", "right", "fa fa-check", "warning", "animated fadeInRight", "animated fadeOutRight", "Add Category: ", "Bạn phải nhập Category Name");
    });
    // End Tag Add Category

    //----------------------------

    // Begin Tag List Category
    var gender_tab = true
    var table = $('#tableCategory').DataTable({
        //"processing": true,
        "serverSide": true,
        "ajax": {

            "url": "/Category/LoadDataTable",
            "data": function (d) {
                d.gender = gender_tab
            },
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "ParentName", "name": "ParentName", "autoWidth": true, "searchable": false },
            { "data": "CategoryName", "name": "CategoryName", "autoWidth": true, "searchable": true },
            {
                "data": "Gender", "name": "Gender", "autoWidth": true, "orderable": false, "searchable": false
                , "render": function (data, type, row) {
                    if (data === true)
                        return "Nam";
                    else if (data === false)
                        return "Nữ";
                    else return "Couple";
                }
            },
            {
                "data": "Status", "name": "Status", "autoWidth": true, "searchable": false,"orderable": false, "className": "text-center",
                "render": function (data, type, row) {
                    if (data === true)
                        return "Active";
                    else
                        return "InActive";
                }
            },
            {
                "data": "Id", "name": "Status", "autoWidth": true, "searchable": false, "orderable": false, "className": "text-center dropdown",
                "render": function (data, type, row) {
                    return '<button type="button" class="btn btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="ti-angle-double-down"></i></button>' +
                        '<div class="dropdown-menu dropdown-menu-right b-none contact-menu">' +
                        '<a class="dropdown-item" href="#!" data-toggle="modal" data-target="#myEditCustomer"><i class="icofont icofont-edit"></i>Edit</a>' +
                        '<a href="#" id="abc" data-target="#my_modal" data-toggle="modal" class="identifyingClass dropdown-item" data-id="' + data + '"><i class="icofont icofont-ui-delete"></i> Delete</a>' +
                        '</div>';
                }
            }
        ]
    })
    $('#GenderRadio_tab input').on('change', function () {
        var _CheckGender = $('input[name=radio_tab]:checked', '#GenderRadio_tab').val()
        if (parseInt(_CheckGender) === 1) {
            gender_tab = true
        }
        else if (parseInt(_CheckGender) === 0) {
            gender_tab = false
        }
        else {
            gender_tab = null
        }

        table.ajax.reload();
    });

    $(document).on('click', '.identifyingClass', function () {
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #hiddenValue").val(my_id_value);
    });

    $("#btn_OK").on("click", function () {
        console.log($("#hiddenValue").val())
        $("#my_modal").modal('hide')
        $.ajax({
            type: "GET",
            url: "/Category/DeleteCategory",
            data: {
                categoryId: parseInt($("#hiddenValue").val())
            },
            success: function (mess) {
                //table.ajax.reload();
                table.draw(false);
                notify("top", "right", "icofont icofont-ui-check", "success", "animated fadeInRight", "animated fadeOutRight", '  ', mess);
                GetDataCategory();
            },
            error: function (err) {
                console.log(err)
                notify("top", "right", "icofont icofont-ui-close", "danger", "animated fadeInRight", "animated fadeOutRight", '  ', 'Xóa thất bại!');
            }
        })
       
    })
    // End Tag List Category
    
});