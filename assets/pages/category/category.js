$(document).ready(function () {
    var RenderMess = function (type, mess) {
        toastr.options = { "newestOnTop": true, "showMethod": "show", "hideMethod": "hide", "progressBar": true, };
        toastr[type]("<strong>" + mess + "</strong>");
    }
    // Begin Tag Add Category
    $("#divParentSearch").width($("#divParentCategory").width());
    $("#divParentSearch_change").width($("#divParentCategory_change").width());
    $(window).resize(function () {
        $("#divParentSearch").width($("#divParentCategory").width());
        $("#divParentSearch_change").width($("#divParentCategory_change").width());
    });

    var CheckGender = $('input[name=radio]:checked', '#GenderRadio').val() // 1 - Nam : 2 - Nữ : 3 - Couple
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
            $('#searchCategory').focus();
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
        $.get('/Category/GetCategories', { gender: CheckGender }, function (data) {
            if (data !== null && data !== undefined && data !== "") {
                dataCatrgories = data;
                //console.log(dataCatrgories)
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
                        "wholerow",
                        "search",
                        "types",
                        ],
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
        $.get('/Category/GetCategories', { gender: CheckGender }, function (data) {
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
    $('#btnSave').on('click', function () {
        var category = $('#input_Category').val(),
            parentId = $('#ValueParentCategory').val() === "" ? '#' : $('#ValueParentCategory').val();
        if (category !== null && category !== undefined && category !== "") {
            $.ajax({
                type: "POST",
                url: "/Category/AddCategory",
                data: {
                    parentId: parentId,
                    categoryName: category,
                    gender: CheckGender
                },
                //contentType: "application/json; charset=utf-8",
                //dataType: "json",
                success: function (msg) {
                    RenderMess("success", msg)
                    CheckGender = $('input[name=radio]:checked', '#GenderRadio').val()
                    GetDataCategory()
                    category = $('#input_Category').val('');
                },
                error: function (err) {
                    RenderMess("error", err)
                }
            });
        }
        else
            RenderMess("error", "Bạn phải nhập Category Name");
    });
    // End Tag Add Category

    //----------------------------

    // Begin Tag List Category - Delete Category

    var _CheckGender = $('input[name=radio_tab]:checked', '#GenderRadio_tab').val()
    var table = $('#tableCategory').DataTable({
        //"processing": true,
        "serverSide": true,
        "ajax": {

            "url": "/Category/LoadDataTable",
            "data": function (d) {
                d.gender = _CheckGender
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
                    if (data === 1)
                        return "Nam";
                    else if (data === 2)
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
                        '<a class="ChangeClass dropdown-item" href="#!" data-toggle="modal" data-target="#my_modal_EditCategory"  data-id="' + data + '"><i class="icofont icofont-edit"></i>Edit</a>' +
                        '<a href="#" id="abc" data-target="#my_modal" data-toggle="modal" class="identifyingClass dropdown-item" data-id="' + data + '"><i class="icofont icofont-ui-delete"></i> Delete</a>' +
                        '</div>';
                }
            }
        ]
    })
    $('#GenderRadio_tab input').on('change', function () {
        _CheckGender = $('input[name=radio_tab]:checked', '#GenderRadio_tab').val()

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
                RenderMess("success", mess)
                GetDataCategory();
            },
            error: function (err) {
                console.log(err)
                RenderMess("error", "Xóa thất bại!");
            }
        })
       
    })
    // End Tag List Category - Delete Category

    // Begin Modal Change Category
    $(document).on('click', '.ChangeClass', function () {
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #hiddenValue_change").val(my_id_value);
        $.get('/Category/GetCategoryById', { CategoryId: my_id_value }, function (data) {
            if (data !== null && data !== undefined && data !== "" && data.length >0) {
                $('#GenderRadio_change input[name=radio_change]').each(function (index, item) {
                    var val = parseInt($(this).attr('value'));
                    //console.log(val)
                    //console.log(data[0].Gender)
                    if (data[0].Gender === val) {
                        $(this).attr('checked', true);
                        GetCategory_Change($(this).attr('value'));
                        GetDataCategory_Change($(this).attr('value'))    
                    }
                    else {
                        $(this).attr('checked', false);
                    }
                })
                $('#input_Category_change').val(data[0].CategoryName);
                $('#ValueParentCategory_change').val(data[0].ParentId);
                $('#inputCategory_change').val(data[0].ParentName !== "" ? data[0].ParentName : "Không có phân cấp!");
            }
            else {
                console.log('Lỗi load data')
            }
        });
        //console.log($('#GenderRadio_tab'))

    });
    $('#my_modal_EditCategory').on('shown.bs.modal', function () {
        //console.log($("#divParentCategory_change").width())
        $("#divParentSearch_change").width($("#divParentCategory_change").width())
    });
    var Refresh_Parent_Category_Change = function () {
        $('#inputCategory_change').val("Select Parent Category Name")
        $('#ValueParentCategory_change').val('');
        $('#ParentCategory-tree_change').jstree("deselect_all");
        $('#ParentCategory-tree_change').jstree("close_all");
        $('#divParentSearch_change').hide();
    }
    var Render_Category_Tree_Change = function () {
        $('#divParentSearch_change').hide();
        $('#inputCategory_change').click(function () {
            $('#divParentSearch_change').toggle();
            $('#searchCategory_change').focus();
        });
        $("#refreshCategory_change").click(function () {
            Refresh_Parent_Category_Change();
        });
        var to = false;
        $('#searchCategory_change').keyup(function () {
            if (to) { clearTimeout(to); }
            to = setTimeout(function () {
                var v = $('#searchCategory_change').val();
                $('#ParentCategory-tree_change').jstree(true).search(v);
            }, 250);
        });
    };
    Render_Category_Tree_Change();
    var CheckGender_change = $('input[name=radio_change]:checked', '#GenderRadio_change').val()
    var GetCategory_Change = function (CheckGender_change) {
        $.get('/Category/GetCategories', { gender: CheckGender_change }, function (data) {
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
                $('#ParentCategory-tree_change').on('changed.jstree', function (e, data) {
                    var i, j, r = [];
                    for (i = 0, j = data.selected.length; i < j; i++) {
                        r.push({
                            'Id': data.instance.get_node(data.selected[i]).id,
                            'Text': data.instance.get_node(data.selected[i]).text
                        });
                    }
                    if (r.length > 0) {
                        $('#inputCategory_change').val(r[0].Text)
                        $('#ValueParentCategory_change').val(r[0].Id);
                        $('#divParentSearch_change').hide();
                    }
                }).jstree({
                    'core': { 'data': datas, },
                    "plugins": [
                        "wholerow",
                        "search",
                        "types",
                        ],
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
    var GetDataCategory_Change = function (CheckGender_change) {
        console.log(CheckGender_change)
        var datas = []
        $.get('/Category/GetCategories', { gender: CheckGender_change }, function (data) {
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
            $('#ParentCategory-tree_change').jstree(true).settings.core.data = datas
            $('#ParentCategory-tree_change').jstree(true).refresh();
            //Refresh_Parent_Category_Change();
        });
    }

    $('#GenderRadio_change input').on('change', function () {
         CheckGender_change = $('input[name=radio_change]:checked', '#GenderRadio_change').val()
        //console.log(CheckGender_change)
        GetDataCategory_Change(CheckGender_change)
        Refresh_Parent_Category_Change();
    });

    $("#btn_Save_Category").on("click", function () {
        var parentId = $('#ValueParentCategory_change').val() === "" ? '#' : $('#ValueParentCategory_change').val(),
            categoryName = $('#input_Category_change').val(),
            Id = $('#hiddenValue_change').val(),
            gender = $('input[name=radio_change]:checked', '#GenderRadio_change').val()
        console.log(parentId, categoryName, Id, gender)
        //console.log(parentId + " " + Id + " " + categoryName + " " + gender)
        $("#my_modal_EditCategory").modal('hide')
        $.ajax({
            type: "POST",
            url: "/Category/UpdateCategoryById",
            data: {
                Id: Id,
                parentId: parentId,
                categoryName: categoryName,
                gender: gender
            },
            success: function (succ) {
                //table.ajax.reload();
                table.draw(false);
                RenderMess("success","Sửa đổi thành công!")
                GetDataCategory();
            },
            error: function (err) {
                console.log(err)
                RenderMess("error", "Sửa đổi thất bại!")
            }
        })
    })
    // End Modal Change Category
});