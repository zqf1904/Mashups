var twitter;
var original_x = new Array;
var original_y = new Array;
var area_data = {usa: "data_usa.csv", uk : "data_uk.csv", world: "data_world.csv"};

function makeWordCloud(dataset){
	$('#container').html('');

	var w = $('#container').width();
	var h = 400;

	var count = dataset.length;
	var new_x = new Array;
	var new_y = new Array;
	for (var i=0; i < count; i++){
		new_x[i]= Math.floor(original_x[i] * w / (count + 1)+35);
		new_y[i]= Math.floor(original_y[i] * h / (count + 2)+38);
	};

	var dataMin = d3.min(dataset, function(d){ return +d.volume});

	var div = d3.select("body")
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);  

	var svg = d3.select('#container')
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	svg.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.text(function(d) {
			return "#" + d.name;
		})
		.attr("text-anchor", function(d,i){
			if (new_x[i] > (w /2) ){
				return "end";
			}
			else{
				return "start";
			}
		})
		.attr("x", function(d,i) {
			return new_x[i];
		})
		.attr("y", function(d,i){
			return new_y[i];
		})
		.attr("font-family", "sans-serif")
		.attr("fill", function(d){
			return d.color;
		})
		.attr("font-size", function(d){
			return 20;
		})
		.on("click", function(d) { 
			window.open("https://twitter.com/hashtag/" +d.name + "?src=ptrn"); 
		})
		.on("mouseover", function(d){
			div.style("opacity",9);
			var volume_display = "";
			var raw_num = d.volume.replace(/[^0-9]/ig,"");
			if (raw_num < 100){
				volume_display = raw_num;
			}
			else if (raw_num >=100 && raw_num < 100000){
				volume_display = ((raw_num)/1000).toFixed(1) + "K";
			}
			else{
				volume_display = ((raw_num)/1000000).toFixed(1) + "M";
			};
			div.text("Tweet Volume: "+ volume_display)
				.style("left", (d3.event.pageX) + "px")			 
				.style("top", (d3.event.pageY-40) + "px");
		})
		.on("mouseout",function(d){
			div.style("opacity",0);
		})
		.transition().duration(1200).attr("font-size", function(d){
			var raw_num = d.volume.replace(/[^0-9]/ig,"");
			return (Math.floor(raw_num/ dataMin)+ 6) * 2;
		});
};

function collectData(area){
	d3.csv(area_data[area],function(data){
		console.log(data);
	    var length = data.length;
	    original_x = [];
	    original_y = [];
		for (var i=0; i < length; i++){
			original_x[i]= i;
			original_y[i]= i;
		};
		twitter= data;
		original_x.sort(function(){return 0.5 - Math.random();});
		original_y.sort(function(){return 0.5 - Math.random();});
		for (var i=0; i < length; i++){
			var r = Math.floor(Math.random() * 256);
			var g = Math.floor(Math.random() * 256);
			var b = Math.floor(Math.random() * 256);
			var color = 'rgb(' + r +',' + g +','+ b + ')';
			twitter[i] = {name: twitter[i].name, volume: twitter[i].volume, color: color};
		};
	    makeWordCloud(twitter);
	});
};

$(document).ready(function(){
	collectData("world");
	$(window).resize(function(){
		makeWordCloud(twitter);
	});
});

$("#us").on("click", function(){
	collectData("usa");
});

$("#uk").on("click", function(){
	collectData("uk");
});

$("#world").on("click", function(){
	collectData("world");
});