/*=============================
=            Notes            =
=============================

(December 3, 2014)

- artApp.init runs on document ready
	- artApp.getpieces runs inside of artApp.init
		- artApp.displayPieces runs inside artApp.getpieces

So essentially, they all run on document ready, and this is controlled by the init function. 

-----  End of Notes  ------*/

// empty namespace for app to live on
var artApp = {};
artApp.key = "lnJ7Bd6c";

artApp.init = function() {
// init = everything for starting up the app
	$("fieldset.artSearch").on("submit",function(event){
		event.preventDefault(); // prevents form from refreshing
		var searchFieldQuery = $("fieldset.artSearch input[name='searchField']").val();
		artApp.getPieces(searchFieldQuery); // calls art piece function and passes content in search field
	}); // end of artSearch event function

	$("fieldset.artSearch input[name='searchField']").on("change",function(){
		var searchContent = $(this).val();
		$("span.searchTermDefault").remove(); // removes original search field name
		$("legend").html("<span class='searchTermAppended'>" + "Searching for: " + "&nbsp;" + "</span>"); // adds span for new content
		$("span.searchTermAppended").append(searchContent); // appends user's search term
		console.log(searchContent);
		console.log("New content in search field!")
	});
};

artApp.getPieces = function(query) { // create a method to go and grab the artworks API docs: http://rijksmuseum.github.io/
	console.log("going to fetch the art");
	$.ajax({
		url : "https://www.rijksmuseum.nl/api/en/collection",
		type: 'GET',
		data: {		
			key: artApp.key,
			format: "jsonp",
			ps: 50,
			imgonly: true,
			culture: "en",
			q: query, 
		},
		dataType : "jsonp",
		success: function(result) { // another word for success = callback
			$("#artwork").empty(); // clears artwork before adding new pieces
			artApp.displayPieces(result.artObjects); // when the ajax request comes back - run this code! - displayPieces function is below
		}
	});
};

artApp.displayPieces = function(pieces) {

	var artModuleTmpl = $('<section class="artworkModule"><ul class="artFields"></ul></section>');
	// loop over each piece
	console.log(pieces.length); // counts number of pieces retreived by API
	for (var i = 0; i < pieces.length; i++) { // for loop

		var artItem = pieces[i]; // variable for easier calling of looped items
		
		$.ajax({
			url : "https://www.rijksmuseum.nl/api/en/collection/" + artItem.objectNumber,
			type: 'GET',
			data: {
				key: artApp.key,
				format: "jsonp",
				imgonly: true,
				culture: "en",
			},
			dataType : "jsonp",
			success: function(result) { // another word for success = callback
				// when the ajax request comes back - run this code!
				console.log(result); // console logs each artwork (using variable)

				// below: important variables for template / objects
				var artModuleSection = artModuleTmpl.clone();
				var artModuleUl = artModuleSection.find('ul');
				var artPiece = result.artObject; // new variable like artItem to use data from success function
				
				// below: variables for use in displaying image metadata
				var img = "<img class='artImage' src='" + artPiece.webImage.url + "'>"
				var artLink = artItem.links.web;
				var artLocation = artPiece.productionPlaces[0];

				var artTitle = artPiece.title;
				console.log(artTitle);
				var artMaker = artPiece.principalOrFirstMaker;
				var artColours = artPiece.colors;
				console.log(artColours);

				if (artPiece.webImage !== null) {// injects the title (linked to item), and creator
					artModuleUl.append( "<li class='artMetaData'>" + "<h3><a target='_blank' title='View item in the Rijksmuseum collection' href=" + artLink + ">" + "<span class='title' data-title='" + artTitle + "'>" + artTitle + "</span></a></h3></li>"); // title & link to item
					artModuleUl.append("<li class='artMetaData'><span class='fieldType'>Creator: </span><span class='creator' data-creatorName='" + artMaker + "'>" + artMaker + "</span></li>");
				}		
				if (artPiece.webImage !== null && artLocation !== undefined){	// injects the location only if it exists
					artModuleUl.append("<li class='artMetaData'><span class='fieldType'>Original Location: </span><span class='location' data-location='" + artLocation + "'>" + artLocation + "</span></li>");
				}
				if (artPiece.webImage !== null && artColours !== undefined && artColours !== null && artColours !== Array[0]){	// injects the location only if it exists
					artModuleUl.append("<li class='artMetaData'><span class='fieldType'>Colours: </span><span class='colours' data-colours='" + artColours + "style=background-color:" + artColours + ";'" + artColours + "</span></li>");
				}
				if (artPiece.webImage !== null) { // injects the image into the page
					artModuleUl.append("<li class='artMetaData'>" + img + "</li>");
				}

				$("#artwork").append(artModuleSection);
			} // end success function
		}); // end ajax function

} // end for loop

};

$(document).ready(function(){
	artApp.init(); // runs init function on document is ready

	// artApp.init:

	// calls ALL of the code above! 

});

/*========================================
=            Extra Code Stuff            =
========================================

// below: variables - commented out because they are not currently in use (storing for later)

// var artMakerBorn = artPiece.principalMakers[0].dateOfBirth;
// var artMakerDied = artPiece.principalMakers[0].dateOfDeath;
// var artMakerVal = artPiece.principalOrFirstMaker.val();
// var artDescription = artPiece.description;



-----  End of Extra Code Stuff  ------*/