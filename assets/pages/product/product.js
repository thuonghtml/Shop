$(document).ready(function () {
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
        var _gender = null
        if (parseInt(CheckGender) === 1)
            _gender = true
        if (parseInt(CheckGender) === 0)
            _gender = false
        $.get('/Category/GetCategories', { gender: _gender }, function (data) {
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


});

function myFunction(input) {
    //$.each(input.files, function (i, file) {
    //    var pReader = new FileReader();
    //    pReader.addEventListener("load", function (e) {
    //        var pic = e.target;
    //        //result.append("<img class='thumbnail' src='" + pic.result + "'/>");
    //        //show();
    //        console.log(pic)
    //    });
    //    pReader.readAsDataURL(file);


    //});
    console.log($("#image_Product").prop("files"))
    var files = new Array();
    for (var i = 0; i < $("#image_Product").prop("files").length; i++) {
        var file = {};
        file.Name = $("#image_Product").prop("files")[i].name;
        file.Path = $("#image_Product").val().split(', ')[i];
        files.push(file);
    }
    console.log(files)
    
    //console.log(input.files[0].mozFullPath)
}