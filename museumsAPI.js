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
			ps: 200,
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
	if(!pieces[i].webImage) {
	    continue; // skip this one there is no image
	  }

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

			var artOpenLiSpan = "<li class='artMetaData'><span class='fieldType'>";
			var artCloseLiSpan = "</span></li>";
			
			/*=================================================
			=            Variables: Image Metadata            =
			=================================================*/
			
			var img = "<img class='artImage' src='" + artPiece.webImage.url + "'>";
			var artLink = artItem.links.web;
			var artLocation = artPiece.productionPlaces[0];
			var artTitle = artPiece.title;
			var artMaker = artPiece.principalOrFirstMaker;
			var artMedium = artPiece.physicalMedium;
			var artType = artPiece.objectTypes;
			var artMaterials = artPiece.materials.join(", ");
			var artTechnique = artPiece.techniques;
			var artMuseum = "Rijksmuseum";

			/*================================================================
			=            Variables: Image Metadata + HTML content            =
			================================================================*/	

			var artLinkTitleContent = "<li class='artMetaData'>" + "<h3><a target='_blank' title='View item in the Rijksmuseum collection' href=" + artLink + ">" + "<span class='title' data-title='" + artTitle + "'>" + artTitle + "</span></a></h3></li>";
			var artLocationContent = artOpenLiSpan + "Original Location: </span><span class='location' data-location='" + artLocation + "'>" + artLocation + artCloseLiSpan;
			var artMakerContent = artOpenLiSpan + "Maker: </span><span class='maker' data-makerName='" + artMaker + "'>" + artMaker + artCloseLiSpan;
			var artMediumContent = artOpenLiSpan + "Physical Medium: </span><span class='physicalMedium' data-physicalMedium='" + artMedium + "'>" + artMedium + artCloseLiSpan;
			var artTypeContent = artOpenLiSpan + "Object Type: </span><span class='artType' data-artType='" + artType + "'>" + artType + artCloseLiSpan;
			var artMaterialsContent = artOpenLiSpan + "Materials: </span><span class='artMaterials' data-artMaterials='" + artMaterials + "'>" + artMaterials + artCloseLiSpan;
			var artTechniqueContent = artOpenLiSpan + "Technique: </span><span class='artTechnique' data-artTechnique='" + artTechnique + "'>" + artTechnique + artCloseLiSpan;
			var artMuseumContent = artOpenLiSpan + "Museum: </span><span class='museum' data-museum='" + artMuseum + "'>" + artMuseum + artCloseLiSpan;
			var artMaterialsMediumContent = artOpenLiSpan + "Physical Medium, Material: </span><span class='physicalMediumAndMaterials' data-physicalMediumAndMaterials='" + artMedium + "'>" + artMedium + artCloseLiSpan;
			var artMediumTechniqueContent = artOpenLiSpan + "Physical Medium, Technique: </span><span class='physicalMediumAndMaterials' data-physicalMediumAndMaterials='" + artMedium + "'>" + artMedium + artCloseLiSpan;

			/*==========================================================
			=            Injecting Image Data Into the Page            =
			==========================================================*/

			// image						
			artModuleUl.append("<li class='artMetaData'>" + img + "</li>");

			// art title & link to content
			artModuleUl.append(artLinkTitleContent); // title & link to item

			// credit to museum
			artModuleUl.append(artMuseumContent); 

			// artwork creator info
			artModuleUl.append(artMakerContent); 		
			
			// injects the location only if it exists
			if (artLocation !== undefined){
				artModuleUl.append(artLocationContent); // original location
			}

			// injects the type only if it exists
			if (artType.length > 0){	
				artModuleUl.append(artTypeContent); // type info
			}

			if (artMedium == artTechnique){
				artModuleUl.append(artMediumTechniqueContent);
				artModuleUl.append("Medium & Technique are the same");
				console.log("Medium == Technique");
				console.log("Medium: " + artMedium);
				console.log("Technique: " + artTechnique);
			}
			else if (artTechnique.length > 0 && artMedium.length > 0 && artTechnique !== artMedium && artMedium !== artMaterials){ // injects the technique only if it exists
				artModuleUl.append(artMediumContent + artTechniqueContent + artMaterialsContent); // Technique info
				artModuleUl.append(("Medium, Technique, Materials are all different");
			} 

			else if (artTechnique !== artMedium && artMaterials == artMedium){
				artModuleUl.append(artMaterialsMediumContent);
				artModuleUl.append("Technique & Medium == different, Materials && Medium == same ");
				console.log("Technique !== Medium, Materials == Medium");
				console.log("Medium: " + artMedium);
				console.log("Materials: " + artMaterials);
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