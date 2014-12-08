// empty namespace for app to live on
var artApp = {};
artApp.RMkey = "lnJ7Bd6c"; // rijksmuseum
artApp.FGkey = "i39hegnykz7iq"; // finnish national gallery
artApp.EUkey = "HJFkApddv"; // Europeana key
artApp.thumbSize = 500;

/*===================================
=            Artapp.init            =
===================================*/

artApp.init = function() {
// init = everything for starting up the app
	$("fieldset.artSearch").on("submit",function(event){
		event.preventDefault(); // prevents form from refreshing
		var searchFieldQuery = $("fieldset.artSearch input[name='searchField']").val();
		artApp.getPieces(searchFieldQuery); // calls art piece function and passes content in search field
	}); // end of artSearch event function

	// gets value of search and updates "searching for" text for user
	$("fieldset.artSearch input[name='searchField']").on("change",function(){
		var searchContent = $(this).val();
		$("span.searchTermDefault").remove(); // removes original search field name
		$("legend").html("<span class='searchTermAppended'>" + "Searching for: " + "&nbsp;" + "</span>"); // adds span for new content
		$("span.searchTermAppended").append('"' + searchContent + '"'); // appends user's search term
	});

	/* Hides Elements on Page Load */
	$("a.backToTop").hide(); // hides back to top link in footer
	$("#legend").hide();
	$("button.moreArt").hide();
};

artApp.initMore = function() {
	$("button.moreArt").on("click",function(event){
		event.preventDefault(); // prevents form from refreshing
		var searchFieldQuery = $("fieldset.artSearch input[name='searchField']").val();
		artApp.getPieces(searchFieldQuery); // calls art piece function and passes content in search field
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
			ps: 10, // sets number of pieces displayed
			imgonly: true,
			culture: "en",
			q: query, 
		},
		dataType : "jsonp",
		success: function(result) { // another word for success = callback
			$("#artwork").empty(); // clears artwork before adding new pieces
			artApp.displayPieces(result.artObjects); // when the ajax request comes back - run this code! - displayPieces function is below
			// console.log(result);
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
	// console.log(pieces.length); // counts number of pieces retreived by API
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

			// below: important variables for template / objects
			var artModuleSection = artModuleTmpl.clone();
			var artModuleUl = artModuleSection.find('ul');
			var artPiece = result.artObject; // new variable like artItem to use data from success function
			var artOpenLiSpan = "<li class='artMetaData'><span class='fieldType'>";
			var artCloseLiSpan = "</span></li>";
			
			/*=================================================
			=            Variables: Image Metadata            =
			=================================================*/
			
			var img = "<a href='" + artPiece.webImage.url + "'data-featherlight='image'><img class='artImage lazy' data-original='" + artPiece.webImage.url + "'" + "src='" + artPiece.webImage.url + "'></a>";
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
				  moreLink: "<button href='#'>View Details</button>",
				  lessLink: "<button href='#'>Close Details</>"
				});


				$(function() {

					$("#legend").show();
				    /*
				        Simple callback function that writes a legend for all the categories and also a counter.
				        Setting "close" to true closes the panel everytime a tag is added so you can see the 
				        legend working right away.
				    */
				    $.filtrify("artwork", "filtrifyPlaceHolder", {
				    	block : ["data-title", "data-museum"],
				        close : true,
				        callback : function( query, match, mismatch ) {
				            if ( !mismatch.length ) {
				                $("#legend").html("<em>Viewing all search results.</em>");
				            } else {
				                var category, tags, i, tag, legend = "<h4>Viewing:</h4>";
				                for ( category in query ) {
				                    tags = query[category];
				                    if ( tags.length ) {
				                        legend += "<p><span>" + category + ":</span>";
				                        for ( i = 0; i < tags.length; i++ ) {
				                            tag = tags[i];
				                            legend += "<em>" + tag + "</em>";
				                        };
				                        legend += "</p>";
				                    };
				                };
				                legend += "<p><i>" + match.length + " item" + (match.length !== 1 ? "s" : "") + " found.</i></p>";
				                $("#legend").html( legend );
				            };
				        }
				    });

				}); // end filtrify function 

			/* Inserts buttons at bottom of page after images load */
			setTimeout(function(){
			    $("a.backToTop").show();
			    $("button.moreArt").show();
			},2500); // waits 2.5 seconds before loading

			} // end success function
		}); // end ajax function

		/*============================================
		=            Scroll Stop Function            =
		============================================*/

		(function(){
		 
		    var special = jQuery.event.special,
		        uid1 = 'D' + (+new Date()),
		        uid2 = 'D' + (+new Date() + 1);
		 
		    special.scrollstart = {
		        setup: function() {
		 
		            var timer,
		                handler =  function(evt) {
		 
		                    var _self = this,
		                        _args = arguments;
		 
		                    if (timer) {
		                        clearTimeout(timer);
		                    } else {
		                        evt.type = 'scrollstart';
		                        jQuery.event.handle.apply(_self, _args);
		                    }
		 
		                    timer = setTimeout( function(){
		                        timer = null;
		                    }, special.scrollstop.latency);
		 
		                };
		 
		            jQuery(this).bind('scroll', handler).data(uid1, handler);
		 
		        },
		        teardown: function(){
		            jQuery(this).unbind( 'scroll', jQuery(this).data(uid1) );
		        }
		    };
		 
		    special.scrollstop = {
		        latency: 300,
		        setup: function() {
		 
		            var timer,
		                    handler = function(evt) {
		 
		                    var _self = this,
		                        _args = arguments;
		 
		                    if (timer) {
		                        clearTimeout(timer);
		                    }
		 
		                    timer = setTimeout( function(){
		 
		                        timer = null;
		                        evt.type = 'scrollstop';
		                        jQuery.event.handle.apply(_self, _args);
		 
		                    }, special.scrollstop.latency);
		 
		                };
		 
		            jQuery(this).bind('scroll', handler).data(uid2, handler);
		 
		        },
		        teardown: function() {
		            jQuery(this).unbind( 'scroll', jQuery(this).data(uid2) );
		        }
		    };
		 
		})();
			
		/*-----  End of Scroll Stop Function  ------*/
		
		$("img.lazy").lazyload({
		  event: "scrollstop"
		});

} // end for loop

};

/*-----  End of Display Pieces  ------*/


$(document).ready(function(){
	artApp.init(); // runs init function on document is ready

	artApp.initMore();

	// artApp.init:

	// calls ALL of the code above! 

});