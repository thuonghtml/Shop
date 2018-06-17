'use strict';
$(document).ready(function() {

    $(window).on('resize', function() {
        dashboardEcharts();
    });

    $(window).on('load', function() {
        dashboardEcharts();
    });


    $("a[data-toggle=\"tab\"]").on("shown.bs.tab", function(e) {
        dashboardEcharts();
    });

    //line chart
    function dashboardEcharts() {
        /*line chart*/
        var myChart = echarts.init(document.getElementById('main'));
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    var date = new Date(params.value[0]);
                    var data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
                    return data + '<br/>' + params.value[1] + ', ' + params.value[2];
                },
                responsive: true
            },
            dataZoom: {
                show: true,
                start: 70
            },
            legend: {
                data: ['Profit']
            },
            grid: {
                y2: 80
            },
            xAxis: [{
                type: 'time',
                splitNumber: 10
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'Profit',
                type: 'line',
                showAllSymbol: true,
                symbolSize: function(value) {
                    return Math.round(value[2] / 10) + 2;
                },
                data: (function() {
                    var d = [];
                    var len = 0;
                    var now = new Date();
                    var value;
                    while (len++ < 200) {
                        d.push([
                            new Date(2014, 9, 1, 0, len * 10000),
                            (Math.random() * 30).toFixed(2) - 0,
                            (Math.random() * 100).toFixed(2) - 0
                        ]);
                    }
                    return d;
                })()
            }]
        };
        myChart.setOption(option);
    }



    $("a[data-toggle=\"tab\"]").on("shown.bs.tab", function(e) {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });

    //    Edit information of user-profile
    $('#edit-cancel').on('click', function() {

        var c = $('#edit-btn').find("i");
        c.removeClass('icofont-close');
        c.addClass('icofont-edit');
        $('.view-info').show();
        $('.edit-info').hide();

    });

    $('.edit-info').hide();


    $('#edit-btn').on('click', function() {
        var b = $(this).find("i");
        var edit_class = b.attr('class');
        if (edit_class == 'icofont icofont-edit') {
            b.removeClass('icofont-edit');
            b.addClass('icofont-close');
            $('.view-info').hide();
            $('.edit-info').show();
        } else {
            b.removeClass('icofont-close');
            b.addClass('icofont-edit');
            $('.view-info').show();
            $('.edit-info').hide();
        }
    });
    //edit user description
    $('#edit-cancel-btn').on('click', function() {

        var c = $('#edit-info-btn').find("i");
        c.removeClass('icofont-close');
        c.addClass('icofont-edit');
        $('.view-desc').show();
        $('.edit-desc').hide();

    });

    $('.edit-desc').hide();


    $('#edit-info-btn').on('click', function() {
        var b = $(this).find("i");
        var edit_class = b.attr('class');
        if (edit_class == 'icofont icofont-edit') {
            b.removeClass('icofont-edit');
            b.addClass('icofont-close');
            $('.view-desc').hide();
            $('.edit-desc').show();
        } else {
            b.removeClass('icofont-close');
            b.addClass('icofont-edit');
            $('.view-desc').show();
            $('.edit-desc').hide();
        }
    });


    // Minimum setup
    $('#datetimepicker1').datetimepicker({
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // Using Locales
    $('#datetimepicker2').datetimepicker({
        locale: 'ru',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // Custom Formats
    $('#datetimepicker3').datetimepicker({
        format: 'LT',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // No Icon (input field only)
    $('#datetimepicker4').datetimepicker({
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // Enabled/Disabled Dates
    $('#datetimepicker5').datetimepicker({
        defaultDate: "11/1/2013",
        disabledDates: [
            moment("12/25/2013"),
            new Date(2013, 11 - 1, 21),
            "11/22/2013 00:53"
        ],
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    // Linked Pickers
    $('#datetimepicker6').datetimepicker({
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    $('#datetimepicker7').datetimepicker({
        useCurrent: false, //Important! See issue #1075
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
    $("#datetimepicker6").on("dp.change", function(e) {
        $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker7").on("dp.change", function(e) {
        $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
    });

    // Custom icons
    $('#datetimepicker8').datetimepicker({
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down"
        }
    });

    // View Mode
    $('#datetimepicker9').datetimepicker({
        viewMode: 'years',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });

    // Min View Mode
    $('#datetimepicker10').datetimepicker({
        viewMode: 'years',
        format: 'MM/YYYY',
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        }
    });
        // Mini-color js start
        $('.demo').each(function() {
            //
            // Dear reader, it's actually very easy to initialize MiniColors. For example:
            //
            //  $(selector).minicolors();
            //
            // The way I've done it below is just for the demo, so don't get confused
            // by it. Also, data- attributes aren't supported at this time...they're
            // only used for this demo.
            //
            $(this).minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue: $(this).attr('data-defaultValue') || '',
                format: $(this).attr('data-format') || 'hex',
                keywords: $(this).attr('data-keywords') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                swatches: $(this).attr('data-swatches') ? $(this).attr('data-swatches').split('|') : [],
                change: function(value, opacity) {
                    if (!value) return;
                    if (opacity) value += ', ' + opacity;
                    if (typeof console === 'object') {
                        console.log(value);
                    }
                },
                theme: 'bootstrap'
            });

        });
    // Mini-color js ends
});
