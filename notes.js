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


// =============================
// =            Notes            =
// =============================

// (December 3, 2014)

// - artApp.init runs on document ready
// 	- artApp.getpieces runs inside of artApp.init
// 		- artApp.displayPieces runs inside artApp.getpieces

// So essentially, they all run on document ready, and this is controlled by the init function. 

// -----  End of Notes  ------*/