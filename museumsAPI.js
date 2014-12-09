// empty namespace for app to live on
var artApp = {};
artApp.searchFieldQuery = "";
artApp.pages = 1;
artApp.RMkey = "lnJ7Bd6c"; // rijksmuseum
artApp.thumbSize = 500;

/*===================================
=            Artapp.init            =
===================================*/

artApp.init = function() {
// init = everything for starting up the app
	$("fieldset.artSearch").on("submit",function(event){
		event.preventDefault(); // prevents form from refreshing
		artApp.searchFieldQuery = $("fieldset.artSearch input[name='searchField']").val();
		artApp.getPieces(artApp.searchFieldQuery); // calls art piece function and passes content in search field
	}); // end of artSearch event function

	// gets value of search and updates "searching for" text for user
	$("fieldset.artSearch input[name='searchField']").on("change",function(){
		var searchContent = $(this).val();
		$("span.searchTermDefault").remove(); // removes original search field name
		$("legend").html("<h3 style='text-align:center;'><span class='searchTermAppended'>" + "Searching for: " + "&nbsp;" + "</span></h3>"); // adds span for new content
		$("span.searchTermAppended").append('"' + searchContent + '"'); // appends user's search term
	});

	/* Hides Elements on Page Load */
	$("a.backToTop").hide(); // hides back to top link in footer
	$("#legend").hide();
	$("button.moreArt").hide();
};

// gets more art!
artApp.initMore = function() {
	$("button.moreArt").on("click",function(event){
		event.preventDefault(); // prevents form from refreshing
		artApp.pages++; // adds 1 to number of page results
		artApp.getPieces(artApp.searchFieldQuery); // calls art piece function and passes content in search field
	}); // end of artSearch event function
};
/*-----  End of Artapp.init  ------*/

/*==================================
=            Get Pieces            =
==================================*/

artApp.getPieces = function(query) { // create a method to go and grab the artworks API docs: http://rijksmuseum.github.io/
	// console.log("going to fetch the art");
	$.ajax({
		url : "https://www.rijksmuseum.nl/api/en/collection",
		type: 'GET',
		data: {		
			key: artApp.RMkey,
			format: "jsonp",
			p: artApp.pages,
			ps: 10, // sets number of pieces displayed
			imgonly: true,
			culture: "en",
			q: query, 
		},
		dataType : "jsonp",
		success: function(result) { // another word for success = callback
			console.log(artApp.pages);
			// $("#artwork").empty(); // clears artwork before adding new pieces
			artApp.displayPieces(result.artObjects); // when the ajax request comes back - run this code! - displayPieces function is below
			console.log(result.artObjects);
		}
	});
};
/*-----  End of Get Pieces  ------*/

/*======================================
=            Display Pieces            =
======================================*/

artApp.displayPieces = function(pieces) {

	var artModuleTmpl = $("<section class='artworkModule'><ul class='artFields'></ul></section>");
	// loop over each piece
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
		success: function(result) {  // when the ajax request comes back - run this code! (another word for success = callback)

			/*========================================================
			=            Variables for template / objects            =
			========================================================*/

			var artModuleSection = artModuleTmpl.clone();
			var artModuleUl = artModuleSection.find('ul');
			var artPiece = result.artObject; // new variable like artItem to use data from success function
			var artOpenLiSpan = "<li class='artMetaData'><span class='fieldType'>";
			var artCloseLiSpan = "</span></li>";
			
			/*-----  End of Variables for template / objects  ------*/
			
			
			/*=================================================
			=            Variables: Image Metadata            =
			=================================================*/
			
			var img = "<a href='" + artPiece.webImage.url + "'data-featherlight='image'><img class='artImage lazy' data-original='" + artPiece.webImage.url + "'" + "src='" + artPiece.webImage.url + "'><span class="fa fa-external-link"></span></a>";
			var artLink = artItem.links.web;
			var artLocation = artPiece.productionPlaces[0];
			var artTitle = artPiece.title;
			var artMedium = artPiece.physicalMedium;
			var artType = artPiece.objectTypes;
			var artMaterials = artPiece.materials.join(", ");
			var artTechnique = artPiece.techniques.join(", ");
			var artMuseum = "Rijksmuseum";

			var artMakers = ""; // empty string

			// loops over "makers" in artPiece object - gets unFixedName (last, firtst)
			for (var art = 0; art < artPiece.makers.length; art++) {
    			artMakers = artPiece.makers[art].unFixedName;
				}

			// replaces comma with ASCII code for comma (otherwise the commas mess up the data attributes)
			artMakersData = artMakers.replace(", ","&#44; "); 

			/*================================================================
			=            Variables: Image Metadata + HTML content            =
			================================================================*/	

			var artLinkTitleContent = "<h3><a target='_blank' title='View item in the Rijksmuseum collection' href=" + artLink + ">" + "<span class='title' data-title='" + artTitle + "'>" + artTitle + "</span></a></h3>";
			var artLocationContent = artOpenLiSpan + "Original Location: </span><span data-location='" + artLocation + "'>" + artLocation + artCloseLiSpan;
			var artMakerContent = artOpenLiSpan + "Maker: </span><span data-makers='" + artMakersData + "'>" + artMakersData + artCloseLiSpan;
			var artMediumContent = artOpenLiSpan + "Physical Medium: </span><span data-medium='" + artMedium + "'>" + artMedium + artCloseLiSpan;
			var artTypeContent = artOpenLiSpan + "Object Type: </span><span data-type='" + artType + "'>" + artType + artCloseLiSpan;
			var artMaterialsContent = artOpenLiSpan + "Materials: </span><span data-materials='" + artMaterials + "'>" + artMaterials + artCloseLiSpan;
			var artTechniqueContent = artOpenLiSpan + "Technique: </span><span data-technique='" + artTechnique + "'>" + artTechnique + artCloseLiSpan;
			var artMuseumContent = artOpenLiSpan + "Museum: </span><span data-museum='" + artMuseum + "'>" + artMuseum + artCloseLiSpan;
			var artMaterialsMediumContent = artOpenLiSpan + "Physical Medium, Material: </span><span data-medium='" + artMedium + "'" + "data-materials='" + artMaterials + "'>" + artMedium + artCloseLiSpan;
			var artMediumTechniqueContent = artOpenLiSpan + "Physical Medium, Technique: </span><span data-medium='" + artMedium + "' data-technique='" + artTechnique + "'>" + artMedium + artCloseLiSpan;

			/*=============================================================
			=            Appends Data Attributes to Artwork ID            =
			=============================================================*/		
			
			artModuleSection.attr('data-location',artLocation);	
			artModuleSection.attr('data-makers',artMakersData);		
			artModuleSection.attr('data-materials',artMaterials);		
			artModuleSection.attr('data-medium',artMedium);		
			artModuleSection.attr('data-museum',artMuseum);
			artModuleSection.attr('data-technique',artTechnique);
			artModuleSection.attr('data-type',artType);

			/*==========================================================
			=            Injecting Image Data Into the Page            =
			==========================================================*/

			// title (with link) + image						
			artModuleUl.before(artLinkTitleContent + img);

			// credit to museum
			artModuleUl.append(artMuseumContent); 

			// artwork creator info
			artModuleUl.append(artMakerContent); 		
			
			// injects the location only if it exists
			if (artLocation !== undefined){
				artModuleUl.append(artLocationContent); // original location
			}

			// below checks for duplicate data and changes appended content accordingly
			if (artMedium == artTechnique && artMedium !== artMaterials && artMaterials.length > 0){
				artModuleUl.append(artMaterialsContent);
			}

			// injects the type only if it exists
			if (artType.length > 0){	
				artModuleUl.append(artTypeContent); // type info
			}

			if (artMedium == artTechnique && artMedium !== artMaterials){
				artModuleUl.append(artMediumTechniqueContent);

			} else if (artTechnique.length > 0 && artMedium.length > 0 && artTechnique !== artMedium && artMedium !== artMaterials){ // injects the technique only if it exists
				artModuleUl.append(artMaterialsContent + artMediumContent + artTechniqueContent); // Technique info
				
			} else if (artTechnique.length > 0 && artMedium !== artTechnique && artMedium == artMaterials){
				artModuleUl.append(artMaterialsMediumContent + artTechniqueContent);
			}

			$("#artwork").append(artModuleSection);

				$("ul.artFields").readmore({
				  speed: 150,
				  maxHeight: 1,
				  embedCSS: false,
				  moreLink: "<button class='btn btn-default btn-sm' href='#'>View Details</button>",
				  lessLink: "<button class='btn btn-default btn-sm' href='#'>Close Details</>"
				});

				    $.filtrify("artwork", "filtrifyPlaceHolder", {
				    	block : ["data-title", "data-museum"],
				    });


			/* Inserts buttons at bottom of page after images load */
			setTimeout(function(){
			    $("a.backToTop").show();
			    $("button.moreArt").show();
			},2500); // waits 2.5 seconds before loading

			} // end success function
		}); // end ajax function
		
		$("img.lazy").lazyload();

} // end for loop

};

/*-----  End of Display Pieces  ------*/


$(document).ready(function(){
	artApp.init(); // runs init function on document is ready

	artApp.initMore();

	// artApp.init:

	// calls ALL of the code above! 

});
