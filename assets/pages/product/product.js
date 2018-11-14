var fileImageChange = [];
var listImgDelete = [];
$(document).ready(function () {
    var RenderMess = function (type, mess) {
        toastr.options = { "newestOnTop": true, "showMethod": "show", "hideMethod": "hide", "progressBar": true, };
        toastr[type]("<strong>" + mess + "</strong>");
    }
    // #region -- Begin Tab Insert Product ---
    $("#divParentSearch_list").width($("#divParentCategory").width());
    $("#divParentSearch").width($("#divParentCategory").width());
    $(window).resize(function () {
        $("#divParentSearch").width($("#divParentCategory").width());
        $("#divParentSearch_list").width($("#divParentCategory_list").width());
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
        var datas = []
        $.get('/Category/GetCategories', { gender: CheckGender }, function (data) {
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
    var Refresh_InputAddProduct = function () {
        Refresh_Parent_Category();
        $('#productName').val("");
        $('#productInfo').val("");
        $('#productPrice').val("");
        $('#statusProduct').val(1);
        $('#image_Product').val("");
    }
    $("#btnSave").on('click', function () {
        var formData = new FormData();
        var gender = CheckGender = $('input[name=radio]:checked', '#GenderRadio').val();
        var categoryId = $('#ValueParentCategory').val();
        var productName = $('#productName').val();
        var productInfo = $('#productInfo').val();
        var productPrice = $('#productPrice').val();
        var statusProduct = $('#statusProduct').val();
        if (categoryId === "" || categoryId === undefined || categoryId === null) {
            RenderMess("warning", "Bạn chưa chọn loại sản phẩm!")
            return false;
        }
        formData.append("gender", gender);
        formData.append("categoryId", categoryId);
        formData.append("productName", $('#productName').val());
        formData.append("productInfo", productInfo);
        formData.append("productPrice", productPrice);
        formData.append("statusProduct", statusProduct);
        var totalFiles = document.getElementById("image_Product").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("image_Product").files[i];
            formData.append("image_Product", file);
        }
        $.ajax({
            type: "POST",
            url: "/Product/AddProduct",
            contentType: false,
            processData: false,
            data: formData,
        }).done(function () {
            Refresh_InputAddProduct();
            $("#viewImageProduct").empty();
            RenderMess("success", "Thêm sản phẩm: " + productName + " thành công!")
        }).fail(function (xhr, status, errorThrown) {
            RenderMess("error", "Thêm sản phẩm: " + productName + " thất bại!")
        })
        //console.log(formData)

    })
    $('#btnCancel').on('click', function () {
        Refresh_InputAddProduct();
    })
    // #endregion -- End Tab Insert Product ---
    //---------------------------------------------------------------------------------------------------------
    // #region -- Begin Tab list product
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
    var table = $('#tableProduct').DataTable({
        //"processing": true,
        "serverSide": true,
        "ajax": {

            "url": "/Product/LoadDataTable",
            "data": function (d) {
                d.gender = CheckGender_list
            },
            "type": "POST",
            "datatype": "json",
        },
        "columns": [
            { "data": "Id", "name": "Id", "autoWidth": true, "searchable": false, "className": "text-center", },
            { "data": "CategoryName", "name": "CategoryName", "autoWidth": true, "searchable": false },
            { "data": "ProductName", "name": "ProductName", "autoWidth": true, "searchable": true },
            { "data": "NewPrice", "name": "NewPrice", "autoWidth": true, "searchable": false, "className": "text-right", "render": $.fn.dataTable.render.number(',') },
            
            {
                "data": "ImageList", "name": "ImageList", "autoWidth": true, "searchable": false, "orderable": false,
                "render": function (data, type, row) {
                    var htmlreturn = '<div class ="row">';
                    var file = data.toString().split(",")
                    $.each(file, function (index, item) {
                        var img = item.toString().split(" - ")
                        htmlreturn += '<div class="col-xl-4 col-lg-6 col-sm-6 col-xs-12" >' +
                            '<a href="' + img[1] + '" data-id="' + img[0] + '" data-toggle="lightbox">' +
                            '<img src="' + img[1] + '" data-id = "' + img[0] + '" class="img-fluid" alt="">' +
                            '</a>' + '</div>'
                    })
                    htmlreturn += '</div>'
                    return htmlreturn;
                }
            },
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

    //$.get('/Product/LoadDataTable', { gender: gender_list }, function (data) {
    //    console.log(data)
    //})
    $(document).on('click', '.img-wrap .close', function () {
        //console.log($(this).closest('.img-wrap').find('img'))
        $(this).closest('.img-wrap').remove();
        var id = $(this).closest('.img-wrap').find('img').data('id');
        if (id.toString().slice(0, 1) === 'I') {
            fileImageChange = $.grep(fileImageChange, function (el, idx) { return el.id == id }, true)
        }
        else {
            listImgDelete.push(parseInt(id));
        }
        //console.log(listImgDelete)
        //console.log(fileImageChange);
        //alert('remove picture: ' + id);
    });

    // --Begin Load data Modal Change
    $(document).on('click', '.ChangeClass', function () {
        var my_id_value = $(this).attr('data-id')
        $(".modal-body #hiddenValue_change").val(my_id_value);
        $.get('/Product/GetInfoProductById', { id: my_id_value }, function (data) {
            if (data !== null && data !== undefined && data !== "" && data.length > 0) {

                //console.log(data);
                $('#viewImageProduct_change').empty();
                $('#productName_change').val(data[0].ProductName);
                $('#productPrice_change').val(data[0].NewPrice);
                $('#productInfo_change').val(data[0].Description);
                $('#statusProduct_change').val(data[0].Status);
                var htmlreturn = '';
                var file = data[0].ImageList.toString().split(",")
                $.each(file, function (index, item) {
                    var img = item.toString().split(" - ")
                    htmlreturn += '<div class="img-wrap col-xl-4 col-lg-6 col-sm-6 col-xs-12" >' +
                        ' <span class="close">&times;</span>' +
                        '<a href="' + img[1] + '" data-id="' + img[0] + '" data-toggle="lightbox">' +
                        '<img src="' + img[1] + '" data-id = "' + img[0] + '" class="img-fluid" alt="">' +
                        '</a>' + '</div>'
                })
                $('#viewImageProduct_change').append(htmlreturn);
                //console.log(fileImageChange)
            }
            else {
                console.log('Lỗi load data')
            }
        });
        //console.log($('#GenderRadio_tab'))

    });
    // --End Load data Modal Change

    $('#btn_Save_Product').on("click", function () {
        var formData = new FormData();
        formData.append("Id", $("#hiddenValue_change").val());
        formData.append("productName", $('#productName_change').val());
        formData.append("productInfo", $('#productInfo_change').val());
        formData.append("productPrice", $('#productPrice_change').val());
        formData.append("statusProduct", $('#statusProduct_change').val());
        formData.append("listimgdelete", JSON.stringify(listImgDelete));
        for (var i = 0; i < fileImageChange.length; i++) {
            formData.append("image_Product_change", fileImageChange[i].file, fileImageChange[i].file.name);
        }
        $.ajax({
            type: "POST",
            url: "/Product/UpdateProduct",
            contentType: false,
            processData: false,
            data: formData,
        }).done(function () {
            $("#my_modal_EditProduct").modal('hide')
            table.draw(false);
            listImgDelete = [];
            fileImageChange = [];
            RenderMess("success", "Cập nhật sản phẩm: " + $('#productName_change').val() + " thành công!")
        }).fail(function (xhr, status, errorThrown) {
            $("#my_modal_EditProduct").modal('hide')
            listImgDelete = [];
            fileImageChange = [];
            RenderMess("error", "Cập nhật sản phẩm: " + $('#productName_change').val() + " thất bại!")
        })
    })
    $('#btn_Cancel_Product').on("click", function () {
        listImgDelete = [];
        fileImageChange = [];
        $("#my_modal_EditProduct").modal('hide')
    })
});

function myFunction(f) {
    $("#viewImageProduct").empty()
    $.each(f.files, function (index, item) {
        var l_File_Size = f.files[index].size;
        if (l_File_Size > 10485760) {
            $(f).val('');
            alert('Cảnh báo: Chỉ cho upload file có dung lượng <10MB! (' + l_File_Size + ' bytes)');
            return;
        }
        var l_File_Name = f.files[index].name;
        var l_File_Name_Str = l_File_Name.replace('.', '');
        if (/^[\w ]*$/.test(l_File_Name_Str) == false) {
            $(f).val('');
            alert('Cảnh báo: Tên file phải không dấu, không khoảng trắng và không có kí tự đặc biệt!');
            return;
        }
        else {
            var inValid = /\s/;
            if (inValid.test(l_File_Name_Str)) {
                $(f).val('');
                alert('Cảnh báo: Tên file không để khoảng trắng!');
                return;
            }
        }
    });

    $.each(f.files, function (i, file) {
        var pReader = new FileReader(); // load image
        pReader.addEventListener("load", function (e) {
            var pic = e.target;
            var openEnderContent = '<div class="col-xl-4 col-lg-6 col-sm-6 col-xs-12">' +
                '<a href="' + pic.result + '" data-toggle="lightbox" data-gallery="example-set">' +
                '<img src="' + pic.result + '" class="img-fluid" alt="">' +
                '</a>' + '</div>'
            $('#viewImageProduct').append(openEnderContent);
        });
        pReader.readAsDataURL(file);
    });

}
function myFunction_change(f) {
    $.each(f.files, function (index, item) {
        var l_File_Size = f.files[index].size;
        if (l_File_Size > 10485760) {
            $(f).val('');
            alert('Cảnh báo: Chỉ cho upload file có dung lượng <10MB! (' + l_File_Size + ' bytes)');
            return;
        }
        var l_File_Name = f.files[index].name;
        var l_File_Name_Str = l_File_Name.replace('.', '');
        if (/^[\w ]*$/.test(l_File_Name_Str) == false) {
            $(f).val('');
            alert('Cảnh báo: Tên file phải không dấu, không khoảng trắng và không có kí tự đặc biệt!');
            return;
        }
        else {
            var inValid = /\s/;
            if (inValid.test(l_File_Name_Str)) {
                $(f).val('');
                alert('Cảnh báo: Tên file không để khoảng trắng!');
                return;
            }
        }
    });

    $.each(f.files, function (i, file) {
        var pReader = new FileReader(); // load image

        //console.log(fileImageChange)
        pReader.addEventListener("load", function (e) {
            var pic = e.target;
            var d = new Date();
            var id = d.getMilliseconds();
            //console.log(pic)
            var openEnderContent =

                '<div class="img-wrap col-xl-4 col-lg-6 col-sm-6 col-xs-12" >' +
                ' <span class="close">&times;</span>' +
                '<a href="' + pic.result + '" data-id="Img' + id.toString() + '" data-toggle="lightbox">' +
                '<img src="' + pic.result + '" data-id = "Img' + id.toString() + '" class="img-fluid" alt="">' +
                '</a>' + '</div>'
            $('#viewImageProduct_change').append(openEnderContent);
            fileImageChange.push({
                id: "Img" + id.toString(),
                file: file
            });
            //console.log(fileImageChange)
        });
        pReader.readAsDataURL(file);

    });
    $('#image_Product_change').val('');
}
