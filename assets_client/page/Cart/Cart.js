$(document).ready(function () {

    var listcartbegin = listCart;   // Lấy biến canh sau đó so sánh có thay đổi hay không
    $('.btn-num-product-down').on('click', function () {

        var numProduct = Number($(this).next().val());
        if (numProduct > 1) {
            $(this).next().val(numProduct - 1)

        };
        var key = $(this).parent().attr("data-key")
        var price = $('#row-price-' + key).attr("data-price")
        var number = $('#number-' + key).val()
        var total = number * price;
        $('#row-total-' + key).attr("data-total", total)
        $('#row-total-' + key).text(numeral(total).format('0,0') + " VNĐ")
        $.each(listcartbegin, function (index, item) {   // Cập nhật lại số lượng và total
            if (item.Key == key) {
                listcartbegin[index].IntoMoney = total;
                listcartbegin[index].Number = number;
            }
        })
        if (numProduct  > 1) {   // điều kiện phải lớn hơn 1
            var sub_total_old = $('#subtotal').attr("data-subtotal");  //lấy giá trị cũ
            var sub_total_new = parseFloat(sub_total_old) - parseFloat(price) //trừ thêm giá
            $('#subtotal').attr("data-subtotal", sub_total_new)        //set lại gia trị cũ
            $('#subtotal').text(numeral(sub_total_new).format('0,0') + " VNĐ") //hiển thị giá trị tiền
        }

    });

    $('.btn-num-product-up').on('click', function () {
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
        var key = $(this).parent().attr("data-key")
        var price = $('#row-price-' + key).attr("data-price")
        var number = $('#number-' + key).val()
        var total = number * price;
        $('#row-total-' + key).attr("data-total", total)
        $('#row-total-' + key).text(numeral(total).format('0,0') + " VNĐ")
        $.each(listcartbegin, function (index, item) {    // Cập nhật lại số lượng & Total
            if (item.Key == key) {
                listcartbegin[index].IntoMoney = total;
                listcartbegin[index].Number = number
            }
        })
        var sub_total_old = $('#subtotal').attr("data-subtotal");      //lấy giá trị cũ
        var sub_total_new = parseFloat(sub_total_old) + parseFloat(price)  //công thêm giá
        $('#subtotal').attr("data-subtotal", sub_total_new)           //set lại gia trị cũ
        $('#subtotal').text(numeral(sub_total_new).format('0,0') + " VNĐ")  //hiển thị giá trị tiền

    });
    $('.how-itemcart1').on('click', function () {        // remove line
        var key = $(this).attr("data-key")
        var Intomoney_remove = $("#row-total-" + key).attr("data-total")// Lấy số tiền remove của row
        listcartbegin = listcartbegin.filter(function (object) {
            return object.Key.toString() !== key;
        })// Remove object
        $(this).parent().parent().remove();
        var sub_total_old = $('#subtotal').attr("data-subtotal");      //lấy giá trị cũ
        var sub_total_new = parseFloat(sub_total_old) - parseFloat(Intomoney_remove)  //trừ thêm tổng tiền
        $('#subtotal').attr("data-subtotal", sub_total_new)           //set lại gia trị cũ
        $('#subtotal').text(numeral(sub_total_new).format('0,0') + " VNĐ")  //hiển thị giá trị tiền
    })
    console.log(listCart)
});