document.getElementById('generate').addEventListener('click', function() {

	// read text from textarea
	var inputData = document.getElementById('data').value;
	
	// workaround for null values
	var NULL = 'xxxnullxxx';
	var resultWithWrongNulls = '';

	var finalResult = '';
	var firstLine = '';
	var isFirst = true;

	// split lines
	lines = inputData.split(/\r?\n/);
	for (line of lines) {
		if (line.trim() === '') {
			continue;
		}
		if(isFirst) {
			// remove postgres log prefixes (e.g. '2015-10-20 15:57:52 CET LOG:' etc.)
			if(line.indexOf('INSERT INTO') != -1) {
				line = line.substring(line.indexOf('INSERT INTO'));
			} else if(line.indexOf('DELETE FROM') != -1) {
				line = line.substring(line.indexOf('DELETE FROM'));
			} else if(line.indexOf('UPDATE') != -1) {
				line = line.substring(line.indexOf('UPDATE'));
			} else {
				alert('ERROR! Could not parse line: ' + line);
			}
			// Same as: firstLine = line.replace('$1','\'${$1}\'').replace('$2','\'${$2}\'').replace(...) ... and so on;
			firstLine = line.replace(/\$([0-9]+)/g, '\'${$$$1}\'');
		} else {
			// remove postgres log prefixes (e.g. '2015-10-20 15:57:52 CET LOG:' etc.)
			if(line.indexOf('$') != -1) {
				line = line.substring(line.indexOf('$'));
			} else {
				alert('ERROR! Could not parse line: ' + line);
			}
			resultWithWrongNulls += line + ';' + 'finalResult += `' + firstLine + ';\n`;';
		}
		isFirst = !isFirst;
	}
	
	eval(resultWithWrongNulls);
	finalResult = finalResult.replace(/\'xxxnullxxx\'/g, 'NULL');
	document.getElementById('result').textContent = finalResult;
});