
var SMM = {
    
    streamChannel : {
        contentDiv : '#content',
        trackBtn : '#track',
        kwInput : '#keyords',
        stream : io.connect('/stream'),
        
        listen: function(){
            SMM.stream.on('stream_update', function(data) {
                $(SMM.streamChannel.contentDiv).append('<p>' + data.polarity + ' : ' + data.text + '</p>');
            });

            $(SMM.streamChannel.trackBtn).click(function() {
                $(SMM.streamChannel.contentDiv).html('');
                stream.emit('track', $(SMM.streamChannel.kwInput).val());
            });

            setInterval(function() {
                stream.emit('ping')
            }, 2000);
        }
    },
    streamData: {
        positive: [],
        negative: [],
        
        getData: function() {
            var d = [
                {key: 'Positve', color: "green", values: SMM.streamData.positive},
                {key: 'Negative', color: "red",  values: SMM.streamData.negative}
            ];
            
            return d;
        },
        
        genRandom: function() {
            var points = 1;
            var now = new Date();
            
            if (SMM.streamData.positive.length > 20) {
		SMM.streamData.positive.shift();
            }
            
            if (SMM.streamData.negative.length > 20) {
		SMM.streamData.negative.shift();
            }
            
            for (j = 0; j < points; j++) {
                var d = {
                    y: Math.random(),
                    x: now,
                    size: 0.2
                };
                SMM.streamData.positive.push(d);

                d = {
                    y: Math.random()*-1,
                    x: now,
                    size: 0.2
                };
                SMM.streamData.negative.push(d);
            }
        }

    },
    
    charts : {
        polartyChartContainer : '#chart svg',
        updateInt : 2000, 
        init : function(){
            nv.addGraph(function() {
                
                chart = nv.models.scatterChart()
                        .showDistX(true)
                        .showDistY(true);
                
                chart.xAxis.tickFormat(d3.format('.02f')).axisLabel('Time');
                chart.yAxis.tickFormat(d3.format('.02f')).axisLabel('Polarity');
                chart.tooltipContent(function(key) {
                    return "<h3>" + key + "</h3>";
                });

                d3.select(SMM.charts.polartyChartContainer).datum(SMM.streamData.getData()).transition().duration(500).call(chart);
                nv.utils.windowResize(chart.update);
                setInterval(function() { SMM.charts.redraw(chart) }, SMM.charts.updateInt);
                SMM.charts.polartyCahrt = chart;
            });
            
        },
        
        redraw: function(chart) {
            SMM.streamData.genRandom();
            chart.update();
        }
    }
    
};
