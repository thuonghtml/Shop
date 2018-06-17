$(document).ready(function () {

    // Extra chart
    Morris.Area({
        element: 'morris-extra-area',
        data: [{
            period: '2010',
            iphone: 0,
            ipad: 0,
            itouch: 0
        }, {
            period: '2011',
            iphone: 100,
            ipad: 15,
            itouch: 65
        }, {
            period: '2012',
            iphone: 20,
            ipad: 135,
            itouch: 0
        }, {
            period: '2013',
            iphone: 100,
            ipad: 12,
            itouch: 25
        }, {
            period: '2014',
            iphone: 50,
            ipad: 20,
            itouch: 100
        }, {
            period: '2015',
            iphone: 25,
            ipad: 100,
            itouch: 40
        }, {
            period: '2016',
            iphone: 10,
            ipad: 10,
            itouch: 10
        }


        ],
        lineColors: ['#fb9678', '#7E81CB', '#01C0C8'],
        xkey: 'period',
        ykeys: ['iphone', 'ipad', 'itouch'],
        labels: ['Site A', 'Site B', 'Site C'],
        pointSize: 0,
        lineWidth: 0,
        resize: true,
        fillOpacity: 0.8,
        behaveLikeLine: true,
        gridLineColor: '#5FBEAA',
        hideHover: 'auto'

    });
    var myChart = echarts.init(document.getElementById('pie-chart'));

    var idx = 1;
    var option_dt = {

        timeline: {
            show: true,
            data: ['06-16', '05-16', '04-16'],
            label: {
                formatter: function (s) {
                    return s.slice(0, 5);
                }
            },
            x: 10,
            y: null,
            x2: 10,
            y2: 0,
            width: 250,
            height: 50,
            backgroundColor: "rgba(0,0,0,0)",
            borderColor: "#eaeaea",
            borderWidth: 0,
            padding: 5,
            controlPosition: "left",
            autoPlay: true,
            loop: true,
            playInterval: 2000,
            lineStyle: {
                width: 1,
                color: "#bdbdbd",
                type: ""
            },

        },

        options: [{
            color: ['#1ABC9C', '#2C3E50', '#4A6076', '#87E8C6', '#656e77', '#42E1FE'],
            title: {
                text: '',
                subtext: ''
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                show: false,
                x: 'left',
                orient: 'vertical',
                padding: 0,
                data: ['Micromax', 'Xolo', 'Lenevo', 'Sony', 'Others']
            },
            toolbox: {
                show: false,
                color: ['#1ABC9C', '#1ABC9C', '#1ABC9C', '#1ABC9C'],
                feature: {
                    mark: {show: false},
                    dataView: {show: false, readOnly: true},
                    magicType: {
                        show: true,
                        itemSize: 12,
                        itemGap: 12,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '10%',
                                width: '80%',
                                funnelAlign: 'center',
                                max: 50
                            },
                            pie: {
                                roseType: 'none',
                            }
                        }
                    },
                    restore: {show: false},
                    saveAsImage: {show: true}
                }
            },


            series: [{
                name: '06-16',
                type: 'pie',
                radius: [15, '70%'],
                roseType: 'radius',
                center: ['50%', '45%'],
                width: '50%', // for funnel
                itemStyle: {
                    normal: {label: {show: true}, labelLine: {show: true}},
                    emphasis: {label: {show: false}, labelLine: {show: false}}
                },
                data: [{value: 35, name: 'Micromax'}, {value: 16, name: 'Xolo'}, {
                    value: 27,
                    name: 'Lenevo'
                }, {value: 29, name: 'Sony'}, {value: 12, name: 'Others'}]
            }]
        }, {
            series: [{
                name: '05-16',
                type: 'pie',
                data: [{value: 42, name: 'Micromax'}, {value: 51, name: 'Xolo'}, {
                    value: 39,
                    name: 'Lenevo'
                }, {value: 25, name: 'Sony'}, {value: 9, name: 'Others'}]
            }]
        }, {
            series: [{
                name: '04-16',
                type: 'pie',
                data: [{value: 29, name: 'Micromax'}, {value: 16, name: 'Xolo'}, {
                    value: 24,
                    name: 'Lenevo'
                }, {value: 19, name: 'Sony'}, {value: 5, name: 'Others'}]
            }]
        },

        ] // end options object
    };

    myChart.setOption(option_dt);
    // Morris bar chart

    Morris.Bar({
        element: 'analythics-graph',
        barSizeRatio:0.2,
        data: [  {
            y: '2009',
            a: 75
        }, {
            y: '2010',
            a: 50
        }, {
            y: '2011',
            a: 42
        }, {
            y: '2012',
            a: 32
        }, {
            y: '2013',
            a: 56
        }, {
            y: '2014',
            a: 60
        }, {
            y: '2015',
            a: 47
        }, {
            y: '2016',
            a: 48
        }
        ],
        xkey: 'y',
        lineWidth:'10px',
        ykeys: ['a'],
        labels: ['A'],
        barColors: ['#0073AA'],
        hideHover: 'auto',
        gridLineColor: '#ddd',
        resize: true
    });
});
