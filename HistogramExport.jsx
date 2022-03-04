#target photoshop


try {

	var filePath = "C:\\Users\\timot\\Tim\\Computing\\For Frank\\205 JSX Photoshop\\HistogramExport\\IWM_Histo_TestFixed.tif";
	var fileInst1 = new File (filePath);


	if ( fileInst1 instanceof File ) {
		alert("That IS a File object");
	} else {
		alert("That IS NOT a File object");
	}

	var docRef = open(fileInst1);

	// Returns an array of 256 numbers
	var thisHistogram = docRef.channels[0].histogram;

	for(n = 0; n < thisHistogram.length; n++) {
		logInfo(thisHistogram[n]);
	}


} catch(error) {

	alert(error);

} // eo catch

/**************************************
***************************************/
function logInfo(Txt) { 

  // Writes the file to the desktop
  var file = new File(Folder.desktop + "/ScriptLog.txt"); 

  file.open("e", "TEXT", "????"); 

  file.seek(0,2); 

  // After wring a line, gives it the correct lineFeed - what eytime a line is written?
  if($.os.search(/windows/i)  != -1 ) {
    file.lineFeed = 'windows';
  } else {
    file.lineFeed = 'macintosh'; 
  }

  file.writeln(Txt); 

  file.close(); 

}; 









