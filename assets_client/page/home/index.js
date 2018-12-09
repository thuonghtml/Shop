$(document).ready(function () {
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

        $(textClass + " .block2 .block2-txt .block2-txt-child1 .stext-104").each(function () {
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
    var RenderContentProduct = function (data) {
        $("#mymodal1").empty();
        $("#mymodal1").append(data)
        
        $('.js-modal1').addClass('show-modal1');
    }
    $(".js-show-modal1").click(function () {
        //debugger;
        var $buttonClicked = $(this);
        var id = $buttonClicked.attr('data-id');
        var options = { "backdrop": "static", keyboard: true };
        $.ajax({
            type: "GET",
            url: '/Home/GetProductByIdModal',
            contentType: "application/json; charset=utf-8",
            data: { "Id": id },
            datatype: "json",
            success: function (data) {
                //debugger;  
                RenderContentProduct(data);
            },
            error: function () {
                alert("Dynamic content load failed.");
            }
        });
    });
    //$(document).on('click', '.js-hide-modal1', function () {
    //    $('#mymodal1').removeClass('show-modal1');
    //})
  
   
});