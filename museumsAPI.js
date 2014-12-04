// =============================
// =            Notes            =
// =============================

// (December 3, 2014)

// - artApp.init runs on document ready
// 	- artApp.getpieces runs inside of artApp.init
// 		- artApp.displayPieces runs inside artApp.getpieces

// So essentially, they all run on document ready, and this is controlled by the init function. 

// -----  End of Notes  ------*/

// empty namespace for app to live on
var artApp = {};
artApp.RMkey = "lnJ7Bd6c"; // rijksmuseum
artApp.FGkey = "i39hegnykz7iq"; // finnish national gallery
artApp.EUkey = "HJFkApddv"; // Europeana key

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
		$("span.searchTermAppended").append('"' + searchContent + '"'); // appends user's search term
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
			key: artApp.RMkey,
			format: "jsonp",
			ps: 20,
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
			key: artApp.RMkey,
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

			var img = artPiece.webImage.url;
			var artLink = artItem.links.web;
			var artLocation = artPiece.productionPlaces[0];
			var artTitle = artPiece.title;
			var artMaker = artPiece.principalOrFirstMaker;
			var artMedium = artPiece.physicalMedium;
			var artType = artPiece.objectTypes;
			var artMaterials = artPiece.materials.join(", ");
			var artTechnique = artPiece.techniques;
			var artMuseum = "Rijksmuseum";

			// below: variables for appending image metadata (with html)

			var imgContent = "<li class='artMetaData'>" + "<img class='artImage' src='" + img + "'>" + "</li>";
			var artLinkTitleContent = "<li class='artMetaData'>" + "<h3><a target='_blank' title='View item in the Rijksmuseum collection' href=" + artLink + ">" + "<span class='title' data-title='" + artTitle + "'>" + artTitle + "</span></a></h3></li>";
			var artLocationContent = "<li class='artMetaData'><span class='fieldType'>Original Location: </span><span class='location' data-location='" + artLocation + "'>" + artLocation + "</span></li>";
			// var artTitleContent = ;
			var artMakerContent = "<li class='artMetaData'><span class='fieldType'>Maker: </span><span class='maker' data-makerName='" + artMaker + "'>" + artMaker + "</span></li>";
			var artMediumContent = "<li class='artMetaData'><span class='fieldType'>Physical Medium: </span><span class='physicalMedium' data-physicalMedium='" + artMedium + "'>" + artMedium + "</span></li>";
			var artTypeContent = "<li class='artMetaData'><span class='fieldType'>Type: </span><span class='artType' data-artType='" + artType + "'>" + artType + "</span></li>";
			var artMaterialsContent = "<li class='artMetaData'><span class='fieldType'>Materials: </span><span class='artMaterials' data-artMaterials='" + artMaterials + "'>" + artMaterials + "</span></li>";
			var artTechniqueContent = "<li class='artMetaData'><span class='fieldType'>Technique: </span><span class='artTechnique' data-artTechnique='" + artTechnique + "'>" + artTechnique + "</span></li>";
			var artMuseumContent = "<li class='artMetaData'><span class='fieldType'>Museum: </span><span class='museum' data-museum='" + artMuseum + "'>" + artMuseum + "</span></li>";
			var artMaterialsMediumContent = "<li class='artMetaData'><span class='fieldType'>Physical Medium & Materials: </span><span class='physicalMediumAndMaterials' data-physicalMediumAndMaterials='" + artMedium + "'>" + artMedium + "</span></li>";

			// injects the image into the page
			if (img !== null) { 
				artModuleUl.append(imgContent);
			}
		
			// injects the title (linked to item), museum and creator
			if (img !== null) {
				artModuleUl.append(artLinkTitleContent); // title & link to item
				artModuleUl.append(artMuseumContent); // credit to museum
				artModuleUl.append(artMakerContent);
			}
			
			// injects the location only if it exists
			if (img !== null && artLocation !== undefined){
				artModuleUl.append(artLocationContent); // original location
				console.log("Location exists!");
			}

			// checks that medium & materials exist, then checks if they are the same
			if (img !== null && artMedium !== null && artMedium.length > 0 && artMaterials.length > 0 && artMedium === artMaterials){
				artModuleUl.append(artMaterialsMediumContent); // original location
				console.log("Medium === Materials: medium is " + artMedium + "materials are: " + artMaterials);
			}

			// injects the materials only if it exists
			if (img !== null && artMaterials.length > 0){	
				artModuleUl.append(artMaterialsContent); // materials info
			}

			// injects the type only if it exists
			if (img !== null && artType.length > 0){	
				artModuleUl.append(artTypeContent); // type info
			}		

			// injects the technique only if it exists
			if (img !== null && artTechnique.length > 0){	
				artModuleUl.append(artTechniqueContent); // Technique info
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
//  var artColours = artPiece.colors;

// if (artPiece.webImage !== null && artColours !== undefined && artColours !== null && artColours !== Array[0]){	// injects the location only if it exists
// 	artModuleUl.append("<li class='artMetaData'><span class='fieldType'>Colours: </span><span class='colours' data-colours='" + artColours + "style=background-color:" + artColours + ";'" + artColours + "</span></li>");
// }

art colours variable = appends list of hexcodes - need to split them all to play with colours

// var artInscriptions = artPiece.inscriptions;
// var artVIP = artPiece.historicalPersons;
// var artLabel = artPiece.label;


// console.log("Inscription: " + artInscriptions);
// console.log("VIPs: " + artVIP);
// console.log("Label: " + artLabel);


// console.log("Physical Medium: " + artMedium)
// console.log("Type: " + artType);
// console.log("Materials: " + artMaterials);
// console.log("Technique: " + artTechnique);


-----  End of Extra Code Stuff  ------*/