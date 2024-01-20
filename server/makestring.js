function processString(inputString) {
    // Remove all whitespace characters (spaces, tabs, newlines)
    const stringWithoutWhitespace = inputString.replace(/\s+/g, '');
  
    // Convert the string to lowercase
    const lowercaseString = stringWithoutWhitespace.toLowerCase();
  
    // Convert a multi-line string to a single-line string
    const singleLineString = lowercaseString.replace(/\n/g, '');
  
    return singleLineString;
  }

 
module.exports = processString;