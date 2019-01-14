$(document).ready(function () {
    $("#btn_summit_contact").on("click", function (e) {
        var myform = document.getElementById("myFromConversation");
        var form = new FormData(myform);
        if ($("#myFromConversation").valid() === true) {
            $.ajax({
                type: "POST",
                url: "/Contact/Create",
                contentType: false,
                processData: false,
                data: form,
                beforeSend: function () {
                    e.preventDefault();
                },
                success: function (data) {
                    //e.preventDefault();
                    $("#Message").val("");
                    $("#Email").val("");
                    swal("Notification", "Đã gửi thành công! Shop sẽ phản hồi sớm nhất có thể!", "success");
                },
                error: function (xhr, status, errorThrown) {
                }
            })
        }
    })

})