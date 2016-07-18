function printNews(theObj){
	var htmlString = "<li><a target='_blank' href='" + theObj.web_url + "'>";
	htmlString += theObj.headline.main + "</a></li>";
	$("#news-container").append(htmlString);
};

function printEbay(theName, theURL, theImg, thePrice){
	var htmlString = "<div class='ebaylist'><li><a target='_blank' class= 'ebaytitle' href='" + theURL + "'>";
	htmlString += theName + "</a></li>";
	htmlString += "<img class='ebayimg' src='"+ theImg +"'>";
	htmlString += "<div class= 'price'>$"+ thePrice +"</div></div>";
	$("#ebay-content").append(htmlString);
};

function getEbay(maxprice){
	var ebayURL = "http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByCategory&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=QifanZha-Currency-PRD-499eca255-8b58deb1&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&categoryId=293&paginationInput.entriesPerPage=100&sortOrder=PricePlusShippingHighest&itemFilter.name=MaxPrice&";
	var pricefilter = "itemFilter.value=" + maxprice;
	ebayURL += pricefilter;
	$.ajax({
		url: ebayURL,
		type: 'GET',
		dataType: 'json',
		error: function(err){
			console.log("We got problems..");
			console.log(err);
		},
		success: function(data){
			var ebayResult = data.findItemsByCategoryResponse[0].searchResult[0].item;
			console.log(ebayResult);
			for (var i = 0; i <4; i++){
				var n= Math.floor(Math.random() * 99 + 1)
				var ebayItemName = ebayResult[n].title;
				var ebayItemURL = ebayResult[n].viewItemURL[0];
				var ebayItemImg = ebayResult[n].galleryURL;
				var ebayPrice = ebayResult[n].sellingStatus[0].currentPrice[0].__value__;
				printEbay(ebayItemName, ebayItemURL, ebayItemImg, ebayPrice);
			};
		}
	});
};

function getRate(){
	var rateURL = "http://apilayer.net/api/live&currencies=EUR,GBP,CAD,CNY&source=USD?access_key=05a9c2cdaaebf823bea08e9293cf8952";
	$.ajax({
		url: rateURL,
		type: 'GET',
		dataType: 'jsonp',
		error: function(err){
			console.log("We got problems..");
			console.log(err);
		},
		success: function(data){
			var rates = data["quotes"];
			console.log(rates);
			$("#EUR").text((1 / rates.USDEUR).toFixed(4));
			$("#GBP").text((1 / rates.USDGBP).toFixed(4));
			$("#CAD").text((1 / rates.USDCAD).toFixed(4));
			$("#CNY").text((1 / rates.USDCNY).toFixed(4));
			$("#date").html("Updated at "+ Date(data["timestamp"]));
		}
	});
};

function getNYTimesData(){
	var date = new Date();
	var date7DaysAgo = new Date(date.getTime()-(14 * 24 * 60 * 60 * 1000));
	var month = date7DaysAgo.getMonth()+1;
	var day = date7DaysAgo.getDate();
	var searchDate = date7DaysAgo.getFullYear() + (month<10 ? '0' : '') + month + (day<10 ? '0' : '') + day;
	var nyTimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=currency&page=0&sort=newest&api-key=";
	var myNYTimesAPIKey = "f0278857e7474dfe82793aa1c2a880fc";
	var nyTimesDate = "&begin_date=" + searchDate;
	var nyTimesReqURL = nyTimesURL + myNYTimesAPIKey + nyTimesDate;
	$.ajax({
		url: nyTimesReqURL,
		type: "GET",
		dataType: "json",
		error: function(err){
			console.log(err);
		},
		success: function(data){
			var theArticles = data.response.docs;
			console.log(theArticles);
			$("#news-container").html("");
			if (theArticles.length >= 1){
				for (var i = 0; i < theArticles.length; i++){
					printNews(theArticles[i]);
				};
			}				
			else
				$("#news-container").html("<a>There is no news.</a>");
		}
	});
};

function getNews(theCurrency){
	var date = new Date();
	var date7DaysAgo = new Date(date.getTime()-(14 * 24 * 60 * 60 * 1000));
	var month = date7DaysAgo.getMonth()+1;
	var day = date7DaysAgo.getDate();
	var searchDate = date7DaysAgo.getFullYear() + (month<10 ? '0' : '') + month + (day<10 ? '0' : '') + day;
	var nyTimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?page=0&sort=newest&api-key=";
	var myNYTimesAPIKey = "f0278857e7474dfe82793aa1c2a880fc";
	var nyTimesDate = "&begin_date=" + searchDate;
	var searchNews = "&q=currency+" + theCurrency;
	var nyTimesReqURL = nyTimesURL + myNYTimesAPIKey + nyTimesDate + searchNews;
	$.ajax({
		url: nyTimesReqURL,
		type: "GET",
		dataType: "json",
		error: function(err){
			console.log(err);
		},
		success: function(data){
			var theArticles = data.response.docs;
			console.log(theArticles);
			$("#news-container").html("");
			if (theArticles.length >= 1){
				for (var i = 0; i < theArticles.length; i++){
					printNews(theArticles[i]);
				};
			}				
			else
				$("#news-container").html("<a>There is no news.</a>");
		}
	});
};

function inputCalculate(ID){
	var inputID = "#"+ ID + "input";
	var outputID = "#" + ID + "output";
	var rate = $("#"+ID).text();
	if(!isNaN($(inputID).val())){
		var resultValue = $(inputID).val() * rate;
		$(outputID).val(resultValue.toFixed(2));
	}
	else{
		$(inputID).val("");
	};
};

function outputCalculate(ID){
	var output = "#"+ ID + "output";
	var input = "#"+ ID + "input";
	var rate = $("#"+ID).text();
	if(!isNaN($(output).val())){
		var resultValue = $(output).val() / rate;
		$(input).val(resultValue.toFixed(2));
	}
	else{
		$(output).val("");
	};
};

$(document).ready(function(){
	getRate();
	getNYTimesData();
});

$("#EURinput").on("keyup",(function(){
	inputCalculate("EUR");
}));

$("#GBPinput").on("keyup",(function(){
	inputCalculate("GBP");
}));

$("#CADinput").on("keyup",(function(){
	inputCalculate("CAD");
}));

$("#CNYinput").on("keyup",(function(){
	inputCalculate("CNY");
}));

$("#EURoutput").on("keyup",(function(){
	outputCalculate("EUR");
}));

$("#GBPoutput").on("keyup",(function(){
	outputCalculate("GBP");
}));

$("#CADoutput").on("keyup",(function(){
	outputCalculate("CAD");
}));

$("#CNYoutput").on("keyup",(function(){
	outputCalculate("CNY");
}));

$("#enews").click(function(){
	getNews("Euro");
});

$("#pnews").click(function(){
	getNews("Pound");
});

$("#cnews").click(function(){
	getNews("Canada+dollar");
});

$("#ynews").click(function(){
	getNews("Yuan");
});

$("#anews").click(function(){
	getNYTimesData();
});

$("#search").click(function(){
	var amount = [$("#EURoutput").val(),$("#GBPoutput").val(),$("#CADoutput").val(),$("#CNYoutput").val()];
	var maxamount = (Math.max.apply(null, amount)).toFixed(2);
	console.log(maxamount);
	$("#ebay-content").html("");
	if (maxamount >0)
		getEbay(maxamount);
	else
		alert("Please enter an amount!");
});