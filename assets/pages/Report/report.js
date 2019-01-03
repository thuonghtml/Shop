$(document).ready(function () {
    var RenderMess = function (type, mess) {
        toastr.options = { "newestOnTop": true, "showMethod": "show", "hideMethod": "hide", "progressBar": true, };
        toastr[type]("<strong>" + mess + "</strong>");
    }
    lineChart();
    //areaChart();
    //donutChart();

    $(window).on('resize', function () {
        window.lineChart.redraw();
        //window.areaChart.redraw();
        //window.donutChart.redraw();
    });

    $("#btn_month").on("click", function () {
        var date = $("#input_date").val();
        if (date === null || date === "") {
            RenderMess("warning", "Bạn chưa chọn dữ liệu để xem")
        }
        else {
            console.log(date)
            $("#title").text("Báo Cáo Doanh Thu Tháng " + date.substr(5, 2))
            $.get("/Report/DataChart", { date: date, type: 1 }, function (result) {
                if (result.length > 0) {
                    window.lineChart.setData(result);
                }
                else {
                    RenderMess("success", "Không có kết quả báo cáo")
                }
              
            })
        }  
    })
    $("#btn_year").on("click", function () {
        var date = $("#input_date").val();
        if (date === null || date === "") {
            RenderMess("warning", "Bạn chưa chọn dữ liệu để xem")
        }
        else {
            $("#title").text("Báo Cáo Doanh Thu Năm " + date.substr(0, 4))
            $.get("/Report/DataChart", { date: date, type: 2 }, function (result) {
                if (result.length > 0) {
                    window.lineChart.setData(result);
                }
                else {
                    RenderMess("success", "Không có kết quả báo cáo")
                }
            })
        }
    })
});

function lineChart() {
    window.lineChart = Morris.Line({
        element: 'line-example',
        data: [],
        xkey: 'y',
        redraw: true,
        parseTime: false,
        ykeys: ['Total'],
        hideHover: 'auto',
        labels: ['Doanh Thu'],
        lineColors: ['#B4C1D7', '#FF9F55']
    });
}