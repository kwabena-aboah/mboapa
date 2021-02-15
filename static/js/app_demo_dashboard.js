"use strict";

var app_demo_dashboard = {    
    rickshaw: function(){

        if($("#dashboard-chart-line").length > 0){
            // line chart
            var data1 = [
                {x: 0, y:14},{x: 1, y:12},{x: 2, y:18},{x: 3, y:17},{x: 4, y:15}, {x: 5, y:11},{x: 6, y:15},{x: 7, y:13},{x: 8, y:16},{x: 9, y:18,},{x: 10, y:16},
                {x: 11, y:18},{x: 12, y:16},{x: 13, y:15},{x: 14, y:15},{x: 15, y:15}, {x: 16, y:17},{x: 17, y:16},{x: 18, y:19},{x: 19, y:20},{x: 20, y:22,},{x: 21, y:23},
                {x: 22, y:21},{x: 23, y:18},{x: 24, y:19},{x: 25, y:15},{x: 26, y:16}, {x: 27, y:17},{x: 28, y:19},{x: 29, y:22},{x: 30, y:24}
            ];
            
            var data2 = [
                {x: 0, y:12},{x: 1, y:10},{x: 2, y:14},{x: 3, y:15},{x: 4, y:11}, {x: 5, y:9},{x: 6, y:14},{x: 7, y:12},{x: 8, y:13},{x: 9, y:16,},{x: 10, y:15},
                {x: 11, y:16},{x: 12, y:13},{x: 13, y:10},{x: 14, y:8},{x: 15, y:11}, {x: 16, y:13},{x: 17, y:15},{x: 18, y:16},{x: 19, y:19},{x: 20, y:20,},{x: 21, y:19},
                {x: 22, y:17},{x: 23, y:14},{x: 24, y:15},{x: 25, y:12},{x: 26, y:14}, {x: 27, y:13},{x: 28, y:15},{x: 29, y:18},{x: 30, y:21}
            ];

            var rlp = new Rickshaw.Graph({
                element: document.getElementById("dashboard-chart-line"),
                renderer: 'lineplot',
                min: 5,
                max: 25,
                padding: {top: 10},
                series: [{data: data1, color: '#2D3349', name: "Purchase click"},{data: data2, color: '#76AB3C', name: "Sales"}]
            });

            var xTicks = new Rickshaw.Graph.Axis.X({
                graph: rlp,                
                orientation: "bottom",
                element: document.querySelector("#xaxis")
            });
            var yTicks = new Rickshaw.Graph.Axis.Y({
                graph: rlp,                
                orientation: "left",
                element: document.querySelector("#yaxis")
            });

            new Rickshaw.Graph.HoverDetail({
                graph: rlp,
                formatter: function(series, x, y) {                    
                    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                    var content = swatch + series.name + ": " + parseInt(y) + '<br>';
                    return content;
                }
            });

            rlp.render();
            
            var rlp_resize = function () {
                rlp.configure({
                    width: $("#dashboard-chart-line").width(),
                    height: $("#dashboard-chart-line").height()
                });
                rlp.render();
            }
                                    
            window.addEventListener('resize', rlp_resize);
            rlp_resize();
            // eof lineplot
        }
    },
    map: function(){        
        if($("#dashboard-map").length > 0){
            
            var data = [];
                data.names = ["Shopnumone","Best Shoptwo","Third Awesome","Alltranding","Shop Name"];                
                data.sales = ["135","121","107","83","77"];            
            
            $("#dashboard-map").vectorMap({
                map: "us_aea_en", 
                backgroundColor: "#FFF",
                regionsSelectable: false,
                regionStyle: {
                    selected: {fill: "#2D3349"},
                    initial: {fill: "#DBE0E4"}
                },
                markers: [
                    [61.18, -149.53],
                    [21.18, -157.49],
                    [40.66, -73.56],
                    [41.52, -87.37],
                    [35.22, -80.84]                    
                ],
                markerStyle: {
                    initial: {
                        fill: '#2D3349',
                        stroke: '#2D3349'
                    }
                },                
                onMarkerTipShow: function(event, label, index){
                  label.html(
                    '<b>'+data.names[index]+'</b><br/>'+
                    '<b>Sales: </b>'+data.sales[index]+'</br>'                    
                  );
                }
            });
        }
    }
};

$(function(){    
    app_demo_dashboard.rickshaw();
    app_demo_dashboard.map();
});