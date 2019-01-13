$(document).ready(function () {
    var RenderMess = function (type, mess) {
        toastr.options = { "newestOnTop": true, "showMethod": "show", "hideMethod": "hide", "progressBar": true, };
        toastr[type]("<strong>" + mess + "</strong>");
    }
    $.each(billstatus, function (index, item) {
        $('#billstatus').append('<option value="' + item.Id + '">' + item.Description + '</option>')
    })
    $('#billstatus').val(status)

    $("#btnUpdateStatusBill").on("click", function (e) {
        var st = $('#billstatus').val()
        if (st === status) {
            RenderMess("warning", "Thay đổi trạng thái mới được cập nhật!")
            return false;
        }
        if (manager === 0) {
            if (status == 0) { //Đơn hàng hủy rồi thì không được cập nhật lại
                RenderMess("warning", "Đơn hàng đã hủy không thể cập nhật lại trạng thái đơn hàng!")
                return false;
            }
            if (status > 1 && st <= 1) {  // Nếu đơn hàng Đã được xác nhận thì không được hủy
                RenderMess("warning", "Không được cập nhật trạng thái về " + $("#billstatus :selected").text() + "!")
                return false;
            }
            if (status == 1 && st == 3) {
                RenderMess("warning", "Bạn phải xác nhận đơn hàng trước khi giao!")
                return false;
            }
        }    
        if (st == 1 || st==0 && manager===1) {
            if (confirm("Bạn muốn cập nhật trạng thái đơn hàng về " + $('#billstatus option:selected').text()+'!')) {

            }
            else {
                return false;
            }
        }
        if (st == 2 || st== 3) {
            if (confirm("Bạn muốn cập nhật trạng thái đơn hàng về " + $('#billstatus option:selected').text() + '!')) {

            }
            else {
                return false;
            }
        }    
        $.ajax({
            type: "GET",
            url: "/Bill/UpdateBillStaus",
            data: {
                id: idbill, status: st
            },
            success: function (data) {
                if (data.success) {
                    status = st;
                    $('#billstatus').val(st)
                    RenderMess("success", data.mess);
                }
                else {
                    RenderMess("error", data.mess);
                }
            },
            error: function (xhr, status, errorThrown) {  
                RenderMess("error", "Lỗi Action");
            }

        })
    })
});