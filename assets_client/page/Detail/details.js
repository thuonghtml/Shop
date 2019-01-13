$(document).ready(function () {
    //$('.js-addcart-detail').each(function () {
    //    var nameProduct = $(this).parent().parent().parent().parent().find('.js-name-detail').html();
    //    $(this).on('click', function () {
    //        swal(nameProduct, "is added to cart !", "success");
    //    });
    //});
    $('.js-addcart-detail').each(function () {
        var nameProduct = $(this).parent().parent().parent().parent().find('.js-name-detail').html();
        $(this).on('click', function () {

            var productId = $(this).attr("data-id");
            var size_product = '', color_product = '';
            if ($('#color_product').length > 0) {
                color_product = $("#color_product").val();
                if (color_product === '') {
                    swal("Color", "Bạn chưa chọn màu sản phẩm!", "error");
                    return false;
                }
            }
            if ($('#size_product').length > 0) {
                size_product = $("#size_product").val();
                if (size_product === '') {
                    swal("Color", "Bạn chưa chọn size sản phẩm!", "error");
                    return false;
                }
            }   
            var number = $('#num_product').val();
            console.log(productId, size_product, color_product, number)
            $.ajax({
                type: "GET",
                url: "/Home/AddToCart",
                contentType: "application/json; charset=utf-8",
                data: {
                    "productId": productId,
                    "color": color_product,
                    "size": size_product,
                    "number": number
                },
                success: function (result) {
                    //debugger;
                    if (result.success) {
                        swal(nameProduct, "is added to cart !", "success");
                        $('#cart_icon').attr("data-notify", result.count)
                    }
                    else {
                        swal(nameProduct, result.mess, "error");
                    }
                },
                error: function () {
                    swal("Lỗi", "Có lỗi khi thêm giỏ hàng", "error");
                }
            })

        });
    });

});