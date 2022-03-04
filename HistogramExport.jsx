#target photoshop


try {


	var inputFolder = Folder.selectDialog('Select the input folder', '');


	alert(inputFolder + "/ScriptLog.txt");

	// With empty second arrgument it returns all file types
	var myFilesAndFolders = scanSubFolders(inputFolder, "");

	// returns an array of File objects
	var myInputFiles = myFilesAndFolders[0];

	var numFiles = myInputFiles.length;

	alert("Files to test " + numFiles);

	var docRef;
	var logFileName;
	var logFilePath;
	// We want to store the log file at the same level as input folder, not inside the input folder
	// because this will crash the reading of files
	var logFilePathExploded = inputFolder.fullName.split("/");
	logFilePathExploded.pop();
	logFilePath = logFilePathExploded.join("/");

	alert(logFilePath + "/ScriptLog.txt");

	for(n = 0; n < numFiles; n++) {
		docRef = open(myInputFiles[n]);
		if(isFileDodgy(docRef) ) {
			// alert(docRef.fullName + " IS dodgy");

			// Log the bad files.
			// LogFile written to the same folder as was selected for the input files
			logInfo(logFileName, logFilePath, docRef.fullName);




		} else {
			// do nothing if the file is OK
			//alert(docRef.name + " IS NOT dodgy");
		}

		activeDocument.close( SaveOptions.DONOTSAVECHANGES );

	}


} catch(error) {

	alert("Error: " + error);

} // eo catch
/***********************************

	Tests to see if the histogram for the file has notches in it.
	If it has it is dodgy and isFileDodgy returns true, else false

 **********************************/
 function isFileDodgy(docRef) {

	// Returns an array of 256 numbers
	var thisHistogram = docRef.channels[0].histogram;
	var numNumbers = thisHistogram.length;

	var smallestValueInList = timMin(thisHistogram);
	var largestValueInList = timMax(thisHistogram);
	// alert(smallestValueInList + "  " + largestValueInList);

	var dynamicRange = largestValueInList - smallestValueInList;

	// if two adacent brightnesses on the x axis are geater appart than this
	// That counts as a notch 
	var notchThesholdPercent = 15; 

	// notchThesholdPercent, normalized for this particular image's dynamic range
	var notchThesholdNormalized = (notchThesholdPercent/100) * dynamicRange;

	// alert("dynamicRange: " + dynamicRange + " notchThesholdNormalized: " + notchThesholdNormalized);

	var firstSample;
	var nextSample;
	var thisDifference;
	var notchCount = 0;
	var numNotchesBeforeFileIsDodgy = 30;


	// (numNumbers - 1) so that nextSample does not go outside the thisHistogram array
	for(var n = 0; n < (numNumbers - 1); n++) {
		firstSample = n;
		nextSample = n + 1;

		// could be negative or positive so use the absolute
		thisDifference = thisHistogram[firstSample] - thisHistogram[nextSample]

		thisDifference = Math.abs(thisDifference);
		// alert("thisDifference: " + thisDifference);

		if(thisDifference > notchThesholdNormalized) {
			notchCount++;
		}

		if(notchCount > numNotchesBeforeFileIsDodgy) {
			return(true); // it is dodgey
		}


	} // eo for

	//alert("notchCount: " + notchCount);

	return(false); // it is not dodgy

 }
/***********************************
 **********************************/
 function timMin(listOfNumbers) {

 	var numNumbers = listOfNumbers.length;
 	var smallest = listOfNumbers[0];
 	var thisNum;

 	for(var n = 1; n < numNumbers; n++) {
		thisNum = listOfNumbers[n];
		if(thisNum < smallest) {
			smallest = thisNum;
		}
 	}

 	return(smallest);
 }
 /***********************************
 **********************************/
 function timMax(listOfNumbers) {

 	var numNumbers = listOfNumbers.length;
 	var largest = listOfNumbers[0];
 	var thisNum;

 	for(var n = 1; n < numNumbers; n++) {
		thisNum = listOfNumbers[n];
		if(thisNum > largest) {
			largest = thisNum;
		}
 	}

 	return(largest);
}
 /***********************************
 **********************************/
function scanSubFolders(tFolder, mask) 
{ // folder object, RegExp or string

   var sFolders = new Array();
    var allFiles = new Array();
    sFolders[0] = tFolder;

    for (var j = 0; j < sFolders.length; j++)
    { // loop through folders            
       var procFiles = sFolders[j].getFiles(); // Note returns File instances

        for (var i=0;i<procFiles.length;i++)
        { // loop through this folder contents
            if (procFiles[i] instanceof File )
            {
               // if(mask==undefined) {allFiles.push(procFiles[i].path);}// if no search mask collect all files /*  */
                if (procFiles[i].fullName.search(mask) != -1) {allFiles.push(procFiles[i]);} // otherwise only those that match mask

            }else if (procFiles[i] instanceof Folder){
               sFolders.push(procFiles[i]);// store the subfolder
                scanSubFolders(procFiles[i], mask);// search the subfolder/* */
            } 
        }
    } 

    // sFolders means subFolders
   return [allFiles,sFolders]; 
  
}
/**************************************
 * This write one line of text, then closes the log file.
***************************************/
function logInfo(logFileName, logFilePath, Txt) { 

  // Writes the file to the desktop
  var file = new File(logFilePath + "/ScriptLog.txt"); 

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






















