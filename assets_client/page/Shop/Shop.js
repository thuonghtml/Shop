$(document).ready(function () {

    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    var type = getUrlVars().type
    $.get("/Home/GetProductCategoryId", { categoryId: type }, function (data) {
        $("#contentFrame").html(data)
    })  
    $("#search-product").on("keyup", function () {
        var isotopeButton = $('.filter-tope-group button');
        var textClass = ''
        $(isotopeButton).each(function (index, item) {
            if (item.classList.contains('how-active1')) {
                var filterValue = $(this).attr('data-filter');
                if (filterValue === '*') {
                    textClass = '.isotope-item'
                    //console.log(textClass+'1');
                }
                else {
                    textClass = filterValue
                    //console.log(textClass + '2');
                }

            }

        });

        var g = $(this).val().toLowerCase();
        console.log(g)
        $(textClass +" .block2 .block2-txt .block2-txt-child1 .stext-104").each(function () {
            var s = $(this).text().toLowerCase();
            var i = s.indexOf(g);
            if (i === -1) {
                $(this).closest('.isotope-item').css('display', 'none');
            }
            else {
                $(this).closest('.isotope-item').css('display', 'block')
            }
            var $grid = $('.isotope-grid').each(function () {
                $(this).isotope({
                    itemSelector: '.isotope-item',
                    layoutMode: 'fitRows',
                    percentPosition: true,
                    animationEngine: 'best-available',
                    masonry: {
                        columnWidth: '.isotope-item'
                    }
                });
            });
        });
    });

    //$.ajax({
    //    type: "GET",
    //    url: '/Home/GetProductCategoryId',
    //    contentType: "application/json; charset=utf-8",
    //    data: { "categoryId": 2 },
    //    datatype: "json",
    //    success: function (data) {
    //        //debugger;  
    //        console.log(data)
    //    },
    //    error: function () {
    //        alert("Dynamic content load failed.");
    //    }
    //});
});