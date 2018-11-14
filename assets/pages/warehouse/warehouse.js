﻿$(document).ready(function () {
    var RenderMess = function (type, mess) {
        toastr.options = { "newestOnTop": true, "showMethod": "show", "hideMethod": "hide", "progressBar": true, };
        toastr[type]("<strong>" + mess + "</strong>");
    }
    $(".js-example-responsive").select2({
        width: 'resolve' // need to override the changed default
    });
    $("#divParentSearch_list").width($("#divParentCategory").width());
    $("#divParentSearch").width($("#divParentCategory").width());
    $(window).resize(function () {
        $("#divParentSearch").width($("#divParentCategory").width());
        $("#divParentSearch_list").width($("#divParentCategory_list").width());
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
            var datas = []
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
        $('#ProductId').val(null).trigger('change');
        $(".js-example-responsive").html('').select2();
    });
    $('#ParentCategory-tree').on("select_node.jstree", function (e, data) { /*alert("node_id: " + data.node.id);*/
        $('#ProductId').find('option').remove().end();
        $.get('/Warehouse/GetProductByCategoryId', { id: data.node.id }, function (result) {
            $(".js-example-responsive").select2({
                data: result
            })
        })
    })
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $('#btnSave').on('click', function (e) {

        var productId = $('#ProductId').val()
        var myform = document.getElementById("myFrom");
        var fd = new FormData(myform);
        if (productId === null || productId === undefined || productId === "") {
            RenderMess("error", "Please select product name")
            return false;
        }

        if ($("#myFrom").valid() == true) {

            $.ajax({
                type: "POST",
                url: "/Warehouse/AddWarehouse",
                contentType: false,
                processData: false,
                data: fd,
                beforeSend: function () {
                    e.preventDefault();
                },
                success: function (data) {
                    //e.preventDefault();
                    if (data != null && data.success) {
                        RenderMess("success", data.mess)

                    } else if (data != null && !data.success) {
                        RenderMess("error", data.mess)
                    }
                },
                error: function (xhr, status, errorThrown) {
                    //e.preventDefault();
                    RenderMess("error", errorThrown)
                }
            })
        }

    })

    //---------------------------------------------------------------
    var Refresh_Parent_Category_list = function () {
        $('#inputCategory_list').val("Select Parent Category Name")
        $('#ValueParentCategory_list').val('');
        $('#ParentCategory-tree_list').jstree("deselect_all");
        $('#ParentCategory-tree_list').jstree("close_all");
        $('#divParentSearch_list').hide();
    }
    var Render_Category_Tree_list = function () {
        $('#divParentSearch_list').hide();
        $('#inputCategory_list').click(function () {
            $('#divParentSearch_list').toggle();
            $('#searchCategory_list').focus();
        });
        $("#refreshCategory_list").click(function () {
            Refresh_Parent_Category_list();
        });
        var to = false;
        $('#searchCategory_list').keyup(function () {
            if (to) { clearTimeout(to); }
            to = setTimeout(function () {
                var v = $('#searchCategory_list').val();
                $('#ParentCategory-tree_list').jstree(true).search(v);
            }, 250);
        });
    };
    Render_Category_Tree_list()
    var CheckGender_list = $('input[name=radio_list]:checked', '#GenderRadio_list').val() // 1 - Nam : 0 - Nữ : 2 - Couple
    var GetCategory_list = function (CheckGender_list) {
        $.get('/Category/GetCategories', { gender: CheckGender_list }, function (data) {
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
                $('#ParentCategory-tree_list').on('changed.jstree', function (e, data) {
                    var i, j, r = [];
                    for (i = 0, j = data.selected.length; i < j; i++) {
                        r.push({
                            'Id': data.instance.get_node(data.selected[i]).id,
                            'Text': data.instance.get_node(data.selected[i]).text
                        });
                    }
                    if (r.length > 0) {

                        $('#inputCategory_list').val(r[0].Text)
                        $('#ValueParentCategory_list').val(r[0].Id);

                        $('#divParentSearch_list').hide();
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
    GetCategory_list(CheckGender_list);
    var GetDataCategory_list = function () {
        var datas = []
        $.get('/Category/GetCategories', { gender: CheckGender_list }, function (data) {
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
            $('#ParentCategory-tree_list').jstree(true).settings.core.data = datas
            $('#ParentCategory-tree_list').jstree(true).refresh();
            Refresh_Parent_Category_list();
        });
    }
    var table = $('#tableWarehouse').DataTable({
        //"processing": true,
        "serverSide": true,
        "scrollX": true,
        "scrollCollapse": true,
        "ajax": {

            "url": "/Warehouse/LoadDataTable",
            "data": function (d) {
                d.gender = CheckGender_list,
                d.categoryid = $('#ValueParentCategory_list').val()
            },
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "CategoryName", "name": "CategoryName", "autoWidth": true, "searchable": false },
            { "data": "ProductName", "name": "ProductName", "autoWidth": true, "searchable": true },
            { "data": "Size", "name": "Size", "autoWidth": true, "searchable": false, "className": "text-center" },
            { "data": "InputPrice", "name": "InputPrice", "autoWidth": true, "searchable": false, "className": "text-right", "render": $.fn.dataTable.render.number(',') },
            { "data": "NumberOfImport", "name": "NumberOfImport", "autoWidth": true, "searchable": false, "className": "text-center" },
            { "data": "NumberOfRemaining", "name": "NumberOfRemaining", "autoWidth": true, "searchable": false, "className": "text-center" },
            {
                "data": "DateCreate", "type": "datetime", "name": "DateCreate", "autoWidth": true, "searchable": false, "render": function (value) {
                    if (value === null) return "";

                    var pattern = /Date\(([^)]+)\)/;
                    var results = pattern.exec(value);
                    var dt = new Date(parseFloat(results[1]));

                    return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + " " + dt.getHours() + ":"+dt.getMinutes();
                }
            },
            {
                "data": "Id", "name": "Action", "autoWidth": true, "searchable": false, "orderable": false, "className": "text-center dropdown",
                "render": function (data, type, row) {
                    return '<button type="button" class="btn btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="ti-angle-double-down"></i></button>' +
                        '<div class="dropdown-menu dropdown-menu-right b-none contact-menu">' +
                        '<a class="ChangeClass dropdown-item" href="#!" data-toggle="modal" data-target="#my_modal_EditProduct"  data-id="' + data + '"><i class="icofont icofont-edit"></i>Edit</a>' +
                        '<a href="#" id="abc" data-target="#my_modal" data-toggle="modal" class="identifyingClass dropdown-item" data-id="' + data + '"><i class="icofont icofont-ui-delete"></i> Delete</a>' +
                        '</div>';
                }
            }
        ]
    })
    $('#GenderRadio_list input').on('change', function () {
        CheckGender_list = $('input[name=radio_list]:checked', '#GenderRadio_list').val()
        GetDataCategory_list()
        table.ajax.reload();
    });
});

//$('#tree').on("select_node.jstree", function (e, data) { alert("node_id: " + data.node.id); })
//function myFunction() {
//    var input, filter, table, tr, td, i;
//    input = document.getElementById("myInputSearch");
//    filter = input.value.toUpperCase();
//    table = document.getElementById("myTableWarehouse");
//    tr = table.getElementsByTagName("tr");
//    for (i = 0; i < tr.length; i++) {
//        td = tr[i].getElementsByTagName("td")[2];
//        if (td) {
//            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
//                tr[i].style.display = "";
//            } else {
//                tr[i].style.display = "none";
//            }
//        }
//    }
//}
//$("#myInputSearch").on('keyup change', function () {
//    myFunction()
//})