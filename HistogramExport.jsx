#target photoshop


try {


	var inputFolder = Folder.selectDialog('Select the input folder', '');

	// With empty second arrgument it returns all file types
	var myFilesAndFolders = scanSubFolders(inputFolder, "");

	// returns an array of File objects
	var myInputFiles = myFilesAndFolders[0];

	var numFiles = myInputFiles.length;

	alert("Files to test " + numFiles);

	var docRef;
	for(n = 0; n < numFiles; n++) {
		docRef = open(myInputFiles[n]);
		isFileDodgy(docRef);
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

	var smallestValueInList = timMin(thisHistogram);
	var largestValueInList = timMax(thisHistogram);
	alert(smallestValueInList + "  " + largestValueInList);

	var dynamicRange = largestValueInList - smallestValueInList;

	// if two adacent brightnesses on the x axis are geater appart than this
	// That counts as a notch 
	var notchThesholdPercent = 15; 

	var notchThesholdAbsolute = (notchThesholdPercent/100) * dynamicRange;

	alert("notchThesholdAbsolute " + notchThesholdAbsolute);

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























