// empty namespace for app to live on
var artApp = {};
artApp.key = "lnJ7Bd6c";

artApp.init = function() {
// init = everything for starting up the app
	artApp.getPieces(); // calls function below
};

// create a method to go and grab the artworks API docs: http://rijksmuseum.github.io/
artApp.getPieces = function() {
	console.log("going to fetch the art");
	// go get the art
	$.ajax({
		url : "https://www.rijksmuseum.nl/api/en/collection",
		type: 'GET',
		data: {		
			key: artApp.key,
			format: "jsonp",
			ps: 10,
			imgonly: true,
			culture: "en",
			 s: {
			 	achronologic: false,
			 }
		},
		dataType : "jsonp",
		success: function(result) { // another word for success = callback
			artApp.displayPieces(result.artObjects); // when the ajax request comes back - run this code! - displayPieces function is below
			// console.log(result.artObjects);
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
				ps: 10,
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
				var artTitle = artPiece.title;
				var artMaker = artPiece.principalOrFirstMaker;
				var artLink = artItem.links.web;
				var artDescription = artPiece.description;
				var artLocation = artPiece.productionPlaces[0];
				var artMakerBorn = artPiece.principalMakers[0].dateOfBirth;
				var artMakerDied = artPiece.principalMakers[0].dateOfDeath;

				// let's inject the title & other fields into the page
				if (artPiece.webImage !== null) {	
					artModuleUl.append( "<li class='artMetaData'>" + "<h3><a target='_blank' href=" + artLink + ">" + artPiece.scLabelLine + "</a></h3></li>"); // title & link to item
				}

				// let's inject the location (only if it doesn't return as undefined) into the page
				if (artPiece.webImage !== null && artLocation !== undefined){	
					artModuleUl.append("<li class='artMetaData'><span class='fieldType'>Original Location: </span>" + artLocation +"</li>");
				}

				// let's inject the image into the page
				if (artPiece.webImage !== null) {
					artModuleUl.append("<li class='artMetaData'>" + img + "</li>");
				}

				$("#artwork").append(artModuleSection);
			}

		});



} // end for loop

};

$(document).ready(function(){
	artApp.init(); // runs init function on document is ready
});