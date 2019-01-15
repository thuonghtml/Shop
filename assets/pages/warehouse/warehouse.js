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
                        $('#ProductId').val(null).trigger('change');
                        $("#ProductId").html('').select2();
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
        $("#ProductId").html('').select2();
    });
    $('#ParentCategory-tree').on("select_node.jstree", function (e, data) { /*alert("node_id: " + data.node.id);*/
        $('#ProductId').find('option').remove().end();
        $.get('/Warehouse/GetProductByCategoryId', { id: data.node.id }, function (result) {
            $("#ProductId").select2({
                data: result
            })
        })
    })
    $('#ParentCategory-tree_list').on("select_node.jstree", function (e, data) { /*alert("node_id: " + data.node.id);*/
        $('#ProductId').find('option').remove().end();
        console.log(data.node.id)
        $.get('/Warehouse/GetProductByCategoryId', { id: data.node.id }, function (result) {
            var choose = { id: "null", text: "Choose product name" }
            result.unshift(choose)
            $("#ProductId_list").select2({
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

        if ($("#myFrom").valid() === true) {

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
                    if (data !== null && data.success) {
                        Refresh_Input_Warehouse();
                        //table.ajax.reload();
                        table.draw(false);
                        RenderMess("success", data.mess)

                    } else if (data !== null && !data.success) {
                        Refresh_Input_Warehouse();
                        RenderMess("error", data.mess)
                    }
                },
                error: function (xhr, status, errorThrown) {
                    //e.preventDefault();
                    console.log(errorThrown)
                    Refresh_Input_Warehouse();
                    RenderMess("error", errorThrown)
                }
            })
        }

    })

    var Refresh_Input_Warehouse = function () {
        Refresh_Parent_Category();
        $('#ProductId').find('option').remove().end();
        $('#ProductId').val(null).trigger('change');
        $("#ProductId").html('').select2();
        $("#Size").val("");
        $("#InputPrice").val("");
        $("#NumberOfImport").val("");
        $("#NumberOfRemaining").val("");

    }
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
                        $('#ProductId_list').val(null).trigger('change');
                        $("#ProductId_list").html('').select2();
                        table.draw(false);
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
        "fixedHeader": {
            header: true
        },
        "ajax": {

            "url": "/Warehouse/LoadDataTable",
            "data": function (d) {
                d.gender = CheckGender_list,
                d.categoryid = $('#ValueParentCategory_list').val(),
                d.productId = $('#ProductId_list').val()
            },
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "CategoryName", "name": "CategoryName", "autoWidth": true, "searchable": false },
            { "data": "ProductName", "name": "ProductName", "autoWidth": true, "searchable": true },
            { "data": "Size", "name": "Size", "autoWidth": true, "searchable": false, "className": "text-center" },
            { "data": "Color", "name": "Color", "autoWidth": true, "searchable": false, "className": "text-center" },
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
                        '<a class="ChangeClass dropdown-item" href="#!" data-toggle="modal" data-target="#my_modal_EditWarehouse"  data-id="' + data + '"><i class="icofont icofont-edit"></i>Edit</a>' +
                        '<a href="#" id="abc" data-target="#my_modal" data-toggle="modal" class="identifyingClass dropdown-item" data-id="' + data + '"><i class="icofont icofont-ui-delete"></i> Delete</a>' +
                        '</div>';
                }
            }
        ]
    })
    $('#GenderRadio_list input').on('change', function () {
        CheckGender_list = $('input[name=radio_list]:checked', '#GenderRadio_list').val() 
        GetDataCategory_list()
        $('#ProductId_list').val(null).trigger('change');
        $("#ProductId_list").html('').select2();
        //table.ajax.reload();
        table.draw(false);
    });
    $(document).on('click', '.identifyingClass', function () {
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #hiddenValue").val(my_id_value);
    });
    $("#btn_OK1").on("click", function () {
       
        $("#my_modal").modal('hide')
        $.ajax({
            type: "GET",
            url: "/Warehouse/DeleteWarehouse",
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
                    RenderMess("error", result.messs);
                }
            },
            error: function (err) {
                console.log(err)
                RenderMess("error", "Xóa thất bại!");
            }
        })

    })
    //$("#ProductId_list")
    $('#ProductId_list').on('select2:select', function (e) {
        //var data = e.params.data;
        //console.log($(this).val());
        table.draw(false)
    });
    $('#btn_Cancel_Warehouse').on("click", function () {
        $("#my_modal_EditWarehouse").modal('hide')
    })
    $(document).on('click', '.ChangeClass', function () {
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #hiddenValue_change").val(my_id_value);
        $.get('/Warehouse/GetInfoWarehouseById', { id: my_id_value }, function (data) {
            console.log(data)
            $("#category_change").val(data[0].CategoryName)
            $("#productName_change").val(data[0].ProductName)
            $("#inputPrice_change").val(data[0].InputPrice)
            $("#numberImport").val(data[0].NumberOfImport)
            $("#numberRemaining").val(data[0].NumberOfRemaining)
            $("#numberOrder").val(data[0].NumberOrder)
            $("#my_modal_EditWarehouse").modal('show')
        });   
        //console.log($('#GenderRadio_tab'))

    });
    $("#btn_Save_Warehouse").on("click", function (e) {
        var myform = document.getElementById("myFromWarehouse_change");
        var form = new FormData(myform);
        form.append("Id", $("#hiddenValue_change").val());
        //form.append("typeChange", $("#typeChange").val());
        if ($("#myFromWarehouse_change").valid() == true) {
            $.ajax({
                type: "POST",
                url: "/Warehouse/UpdateWarehouse",
                contentType: false,
                processData: false,
                data: form,
                beforeSend: function () {
                    e.preventDefault();
                },
                success: function (data) {
                    //e.preventDefault();
                    if (data != null && data.success) {
                        $("#my_modal_EditWarehouse").modal('hide')
                        table.draw(false);
                        $('.modal-body #category_change').val('')
                        $('.modal-body #productName_change').val('')
                        $('.modal-body #inputPrice_change').val('')
                        $('.modal-body #numberImport').val('')
                        $('.modal-body #numberRemaining').val('')
                        $('.modal-body #numberOrder').val('')
                        RenderMess("success", data.mess)
                    }
                    else {
                        $("#my_modal_EditWarehouse").modal('hide')
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