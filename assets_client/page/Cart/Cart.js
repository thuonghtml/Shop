$(document).ready(function () {

    var ListChange = [];
    $.each(listCart, function (index, item) {
        ListChange.push(item);
    })
    //debugger;
    // Lấy biến canh sau đó so sánh có thay đổi hay không
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
        $.each(ListChange, function (index, item) {   // Cập nhật lại số lượng và total
            if (item.Key == key) {
                ListChange[index].IntoMoney = parseFloat(total);
                ListChange[index].Number = parseInt(number);
            }
        })
        if (numProduct > 1) {   // điều kiện phải lớn hơn 1
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
        $.each(ListChange, function (index, item) {    // Cập nhật lại số lượng & Total
            if (item.Key == key) {
                ListChange[index].IntoMoney = parseFloat(total);
                ListChange[index].Number = parseInt(number)
            }
        })
        var sub_total_old = $('#subtotal').attr("data-subtotal");      //lấy giá trị cũ
        var sub_total_new = parseFloat(sub_total_old) + parseFloat(price)  //công thêm giá
        $('#subtotal').attr("data-subtotal", sub_total_new)           //set lại gia trị cũ
        $('#subtotal').text(numeral(sub_total_new).format('0,0') + " VNĐ")  //hiển thị giá trị tiền
        // console.log(ListCanh, listCart)
    });
    $('.how-itemcart1').on('click', function () {        // remove line
        var key = $(this).attr("data-key")
        var Intomoney_remove = $("#row-total-" + key).attr("data-total")// Lấy số tiền remove của row
        ListChange = ListChange.filter(function (object) {
            return object.Key.toString() !== key;
        })// Remove object
        $(this).parent().parent().remove();
        var sub_total_old = $('#subtotal').attr("data-subtotal");      //lấy giá trị cũ
        var sub_total_new = parseFloat(sub_total_old) - parseFloat(Intomoney_remove)  //trừ thêm tổng tiền
        $('#subtotal').attr("data-subtotal", sub_total_new)           //set lại gia trị cũ
        $('#subtotal').text(numeral(sub_total_new).format('0,0') + " VNĐ")  //hiển thị giá trị tiền
    })
    //console.log(listCart)
    //console.log(ListCanh)
    $(document).on('click', '.js-show-modal2', function (e) {
        e.preventDefault()
        if (listCartBegin === null || listCartBegin === "") {   // Chưa order sản phẩm nào
            swal("Notification", "Chưa có sản phẩm nào được chọn!", "error");
            return false;
        }
        // console.log(listCart.length, ListCanh.length)
        if (listCartBegin.length !== ListChange.length) {  // Xóa sản phẩm
            swal("Notification", "Bạn vừa thay đổi giỏ hàng nên phải cập nhật giỏ hàng trước khi order!", "error");
            return false;
        } else {
            var checkThaydoi = []// Không xóa mà thay đổi số lượng
            //console.log(listCartBegin, ListChange)
            $.each(listCartBegin, function (index, item) {
                if (item.Number !== ListChange[index].Number) {
                    checkThaydoi.push(item);
                }
                //console.log(item.Number, ListChange[index].Number)
            })
            //console.log(checkThaydoi)
            if (checkThaydoi.length > 0) {
                swal("Notification", "Bạn vừa thay đổi giỏ hàng nên phải cập nhật giỏ hàng trước khi order!", "error");
                return false;
            }
        }
        var html = '';
        var subtotal = 0;
        var coupon = $('#coupon').attr("data-coupon") 
        $.each(listCartBegin, function (index, item) {
            subtotal += item.IntoMoney
            var size = item.Size === null ? "" : item.Size;
            var color = item.Color === null ? "" : item.Color;
            html += '<tr>'
                + '<td style="text-align:center">' + (index + 1) + '</td>'
                + '<td>' + item.ProductName + '</td>'
                + '<td style="text-align:center">' + size + '</td>'
                + '<td>' + color + '</td>'
                + '<td style="text-align:right">' + numeral(item.Price).format('0,0') + " VNĐ" + '</td>'
                + '<td style="text-align:center">' + item.Number + '</td>'
                + '<td style="text-align:right">' + numeral(item.IntoMoney).format('0,0') + " VNĐ" + '</td>'
                + '</tr>'
        })
        html += '<tr>'
            + '<td colspan="6" style="text-align:right">SubTotal:</td>'
            + '<td style="text-align:right"> ' + numeral(subtotal).format('0,0') + " VNĐ" + '</td>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="6" style="text-align:right">Coupon:</td>'
            + '<td style="text-align:right">' + numeral(coupon).format('0,0') + " VNĐ" + '</td>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="6" style="text-align:right">Total:</td>'
            + '<td style="text-align:right">' + numeral(subtotal - coupon).format('0,0') + " VNĐ" + '</td>'
            + '</tr>'
        $('#table_content_bill').html(html)
        if (!UserLogin) {
            $(location).attr('href', '/Account/Login?returnUrl=' + returnUrl)
            return false;
        }
        else {
            $.ajax({
                type: "GET",
                url: '/Home/getInfoCustomer',
                contentType: "application/json; charset=utf-8",
                data: null,
                datatype: "json",
                success: function (result) {
                    //debugger; 
                    if (result.success) {

                        $("#myFromInfoCustomer #PhoneNumber").val(result.data.PhoneNumber)
                        $("#myFromInfoCustomer #Email").val(result.data.Email)
                        $("#myFromInfoCustomer #Address").val(result.data.Address)
                        if (result.type === "Customer") {
                            $("#myFromInfoCustomer #CustomerName").val(result.data.CustomerName)
                        }
                        else {
                            $("#myFromInfoCustomer #CustomerName").val(result.data.EmployeeName)
                        }
                    }

                },
                error: function () {
                    console.log("Lỗi")
                }
            });
        }
        $('.js-modal2').addClass('show-modal2');
    })
    $('.js-hide-modal2').on('click', function () {
        $('.js-modal2').removeClass('show-modal2');
    });
    $(document).on('click', '#UpdateCart', function () {
        var data = null
        if (ListChange.length > 0) {
            data = JSON.stringify(ListChange)
        }
        $.ajax({
            type: "POST",
            url: '/Home/UpdateCart',
            contentType: "application/json; charset=utf-8",
            data: data,
            datatype: "json",
            success: function (result) {
                //debugger;             
                if (result.success == false) {
                    swal("Notification", result.mess, "error");
                }
                else {
                    if (result.count > 0) {
                        listCartBegin = result.listbegin;
                        ListChange = result.listchange;
                    }
                    else {
                        listCartBegin = []
                        ListChange = [];
                    }
                    $('#cart_icon').attr("data-notify", result.count)
                    swal("Notification", "Cập nhật giỏ hàng thành công!", "success");
                    var subtotal = $('#subtotal').attr("data-subtotal")
                    var coupon = $('#coupon').attr("data-coupon")
                    $('#total').text(numeral(subtotal - coupon).format('0,0') + " VNĐ") 
                }

            },
            error: function () {
                alert("Dynamic content load failed.");
            }
        });
    })
    $(document).on('click', '#btn_order', function (e) {
        var myform = document.getElementById("myFromInfoCustomer");
        var form = new FormData(myform);
        form.append("CouponCode", $('#coupon').attr("data-couponcode"));
        form.append("PriceCoupon", $('#coupon').attr("data-coupon"))
        if ($("#myFromInfoCustomer").valid() == true) {
            $.ajax({
                type: "POST",
                url: "/Home/Buy",
                contentType: false,
                processData: false,
                data: form,
                beforeSend: function () {
                    e.preventDefault();
                },
                success: function (data) {
                    $('#cart_icon').attr("data-notify", 0)
                    $('#table_content_bill').html("")
                    $(".table-shopping-cart .table_row").remove();
                    listCartBegin = []
                    ListChange = [];
                    $("#subtotal").html("0 VNĐ")
                    $('.js-modal2').removeClass('show-modal2');
                    $('#coupon').attr("data-coupon", 0)
                    $('#coupon').html("0 VNĐ")
                    $('#coupon').attr("data-couponcode", "")
                    $('#total').html("0 VNĐ")
                    swal("Notification", "Bạn đã đặt hàng thành công. Shop sẽ liên hệ bạn để xác nhận đơn hàng!", "success");
                },
                error: function (xhr, status, errorThrown) {
                    console.log("Lỗi")
                }
            })
        }
    })
    $(document).on('click', '#btn_coupon', function () {
        var input_coupon = $("#input_coupon").val();
        console.log(input_coupon)
        if (input_coupon.length > 0 && ListChange.length>0) {
            $.ajax({
                type: "POST",
                url: "/Home/GetCoupon",
                data: { code: input_coupon },
                success: function (result) {
                    //debugger;             
                    if (result.success == false) {
                        swal("Notification", result.mess, "warning");
                    }
                    else {
                        $('#coupon').attr("data-coupon", result.price)
                        $('#coupon').text(numeral(result.price).format('0,0') + " VNĐ")
                        var subtotal = $('#subtotal').attr("data-subtotal")
                        var coupon = $('#coupon').attr("data-coupon")
                        $('#total').text(numeral(subtotal - coupon).format('0,0') + " VNĐ")  
                        $('#coupon').attr("data-couponcode", result.couponCode)
                    }

                },
                error: function () {
                    alert("Dynamic content load failed.");
                }
            });
        }
      
    })
});