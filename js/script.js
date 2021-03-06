function loadData(e) {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
	var search = $('#search').val();
	//appends image to body tag
	$body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + search +'">');
	//Makes api call to new york times
	var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?'+ $.param({q: search}) +'&sort=newest&api-key=' + apiKey;
    console.log('url', url)
	$.getJSON( url, function( data ) {
		
		$nytHeaderElem.text('New York Times Article About ' + search);
		var articles = data.response.docs;
		for(var i = 0; i < articles.length; i++){
			var artc = articles[i];
			$nytElem.append(
				'<li class="article">' +
				'<a href="'+ artc.web_url +'" target="_blank">' +
				artc.headline.main +
				'</a>' +
				'<p>' + artc.snippet + '</p>' +
				'</li>');
			};
		}).fail(function(){
			$nytHeaderElem.text('New York Times Article About Could Not Be Loaded');
		});
	
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+ search +'&format=json&callback=wikiCallback';
	//creates alert if wiki api call doesn't come up in time
	var wikiRequestTimeOut = setTimeout(function() {
		alert( "Wiki API call failed!");
		},8000);
	$.ajax({
    url: wikiUrl,
    dataType: 'jsonp',
    headers: { 'Api-User-Agent': 'Example/1.0' },
    success: function(data) {
		var articles = data[1];
		for(var i = 0; i < articles.length; i++){
			var artc = articles[i];
			var web_url = 'https://en.wikipedia.org/wiki/' + artc;
			$wikiElem.append(
				'<li class="article">' +
				'<a href="'+ web_url +'" target="_blank">' +
				artc +
				'</a>' +
				'</li>');
		}
		clearTimeout(wikiRequestTimeOut);
		}
	});
	return false
};

$('#form-container').submit(loadData);
