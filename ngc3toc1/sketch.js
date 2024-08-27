// This code converts boolean queries in NGC3 to C1.
// Define global arrays to store tokens and processed
// results
// NGC_list will have the input in a tokenised form
// Error_list will have the list of errors.
//
 let NGC3_list = [];
 let Error_list = [];

// Initialize stack. This will be used to check queries.
// Mainly to push and pop parenthesis and see if there are 
// mismatched parenthesis.
  let stack = [];

// Array that will hold all common words encountered. For 
// later use in the function parseLongPhrases
  let encounteredCommonPhrases = [];  

// This variable is used to decide if a space should be
// printed before the tokens in the function populateDiv. 
// We do not need an extra space when the previous token 
// is a ( or any keyword that ends in a :
 let spaceNeeded = false;

// VERSION 25 CHANGES BEGIN
// This variable is set to true if the tk_filter "Market
// Research Reports" is encountered. This is because, this
// filter had a *. The phrases with the * (instead of the
// whole filter content) should be flagged as an error. 
// And only that phrase should be printed differently: 
// only that phrase (instead of the whole filter content)
// should be in red in the output area.
  let marketResearchReportsFlag = false;
// VERSION 25 CHANGES END

// **** Literal declaration region ****
// Used to avoid hardcoding of strings, numbers and special 
// characters. 

// File names of the filters that will be loaded in the
// preload function.
 const masterExclusiveFileName = 'master_exclusive.txt';
 const dealsCouponsFileName = 'deals_coupons.txt';
 const earningsStockNewsFileName = 'earnings_stock_news.txt';
 const jobPostingsFileName = 'job_postings.txt';
 const pressReleaseFileName = 'press_release.txt';
 const obituariesFileName = 'Obituaries.txt';
 const sportsFileName = 'Sports.txt';
 const marketResearchReportsFileName = 'Market Research Reports.txt';
 const ISO639LanguageCodesCSVName = 'ISO 639-1 language codes.csv';

// Tokens used in NGC3 and C1.
 const notToken = 'not';
 const NOTToken = 'NOT';
 const andToken = 'and';
 const ANDToken = 'AND';
 const orToken = 'or';
 const ORToken = 'OR';
 const unlessToken = 'UNLESS';
 const seoToken = 'seo';
 const sentimentToken = 'sentiment';
 const impactToken = 'impact';
 const tk_locationToken = 'tk_location';
 const locationToken = 'location';
 const countryToken = 'country';
 const stateToken = 'state';
 const cityToken = 'city';
 const sourcelocationcountryToken = 'sourcelocationcountry';
 const sourcelocationstateToken = 'sourcelocationstate';
 const mediatypeToken = 'mediatype';
 const mediumToken = 'medium';
 const broadcast_mediatype_lToken = 'broadcast_mediatype_l';
 const tk_languageToken = 'tk_language';
 const languageToken = 'language';
 const langToken = 'lang';
 const leftParenthesisValue = '(';
 const rightParenthesisValue = ')';
 const tk_filterToken = 'tk_filter';
 const filterToken = 'filter';
 const tk_customToken = 'tk_custom';
 const url_directToken = 'url_direct';
 const urlToken = 'url';
 const site_urls_llToken = 'site_urls_ll';
 const tildeToken = '~';
 const hyphenToken = '-';
 const plusToken = '+';
 const frequent_termsToken = 'frequent_terms';
 const textToken = 'text';
 const textcase_sensitiveToken = 'text.case_sensitive';
 const authorToken = 'author'; 
 const headlineToken = 'headline';
 const titleToken = 'title';
 const articleIdToken = 'article_id';
 const seqIdToken = 'seq_id';
 const dataSourceToken = 'data_source_s';
 const tk_competitorToken = 'tk_competitor';
 const publisherToken = 'publisher';
 const searchIdToken = 'search_id';
 const tagToken = 'tag';
 const url_path_sectionsToken = 'url_path_sections';
 const tk_companyToken = 'tk_company';
 const seoImpactToken = 'seo_impact';
 const tkReadershipToken = 'tk_readership';

// Tokens used in C1 with a colon
 const locationTokenC1 = 'location:';
 const language_codesTokenC1 = 'language_codes:';
 const urlTokenC1 = 'url:';
 const atleastTokenC1 = ' ATLEAST/3)';
 const textcase_sensitiveTokenC1 = 'text.case_sensitive:';
 const authorTokenC1 = 'author:'; 
 const mediumTokenC1 = 'medium:';
 const sentimentTokenC1 = 'sentiment:';
 const impact_score_gradeTokenC1 = 'impact_score_grade:';
 const seoTokenC1 = 'seo:';
 const titleTokenC1 = 'title:';

// These are used in the populateDiv function and in calls
// to that.
 const normalMode = 'Normal';
 const errorMode = 'Error';
// VERSION 29 CHANGES BEGIN
 const highlightMode = 'Highlight';
 const highlightErrMode = 'HighlightErr';
// VERSION 29 CHANGES END

// These are the valid values of the sentiment: NGC3 keyword
 const positiveValue = 'positive';
 const neutralValue = 'neutral';
 const negativeValue = 'negative';

// These are the valid values of the seo: NGC3 keyword
 const excellentValue = 'excellent';
 const ExcellentValue = 'Excellent';
 const strongValue = 'strong';
 const StrongValue = 'Strong';
 const goodValue = 'good';
 const GoodValue = 'Good';
 const averageValue = 'average'; 
 const AverageValue = 'Average'; 
 const lowValue = 'low';
 const LowValue = 'Low';

// These are the valid values of the impact: NGC3 keyword
 const highValue = 'high';
 const HighValue = 'High';
 const mediumValue = 'medium';
 const MediumValue = 'Medium';

// These are the valid values of the mediatype: and the 
// broadcast_mediatype_l: keywords of NGC3.
 const NewsValue = 'News';
 const BlogValue = 'Blog';
 const BlogsValue = 'Blogs';
 const blogValue = 'blog';
 const blogsValue = 'blogs';
 const PodcastValue = 'Podcast';
 const podcastValue = 'podcast';
 const BroadcastValue = 'Broadcast';
 const broadcastValue = 'broadcast';
 const number1 = '1';
 const number2 = '2';
 const NewsLicensedValue = 'NewsLicensed';
 const BlogLicensedValue = 'BlogLicensed';
 const blogLicensedValue = 'blogLicensed';
 const PrintLicensedValue = 'PrintLicensed';
 const PrintValue = 'Print';

// These are the valid values for medium in C1
 const onlineValue = 'Online';
 const TVOrRadioValue = '(TV OR Radio)';
 const printOrMagazineValue = '(Print OR Magazine)';
 const TVValue = 'TV';
 const radioValue = 'Radio';

// These are the valid values for tk_filter and filter.
 const masterExclusiveValue = 'Master Exclusive';
 const dealsCouponsValue = 'Deals & Coupons';
 const earningsStockNewsValue = 'Earnings & Stock News';
 const jobPostingsValue = 'Job Postings';
 const marketResearchReportsValue = 'Market Research Reports';
 const tvShowsValue = 'TV Shows';
 const pressReleaseValue = 'Press Release';
 const topTierReadershipValue = 'Top Tier Readership';

// These are the values for tk_custom.
 const obituariesFilterValue = 'Obituaries Filter';
 const sportsFilterValue = 'Sports Filter';
 const keywordsValue = 'Keywords';
 const realEstateListingsValue = 'Real Estate Listings';

// These are the error messages
 const sentimentCodeError = 'Unknown code used for sentiment: ';
 const seoCodeError = 'Unknown code used for SEO: ';
 const impactCodeError = 'Unknown code used for impact: ';
 const languageCodeError = "Unknown language used for tk_language: ";
 const XXValue = 'XX';
 const mediatypeError = 'Unknown mediatype used: ';
 const mediatypeC1Error = 'No known equivalent for mediatype in C1: ';
 const mediatypeMediumError = 'medium used instead of mediatype at token: ';
 const tk_filterC1Error = 'tk_filter can not be converted: ';
 const tk_filterError = 'Unknown filter used for tk_filter: ';
 const tk_customError = 'Unknown filter for tk_custom: ';
 const tk_customC1Error = 'Can not be converted: ';
 const plusError = 'Converted to AND token: ';
 const tk_companyError = 'Conversion method not shared for tk_company: ';
 const url_directError = 'Invalid URL used for url_direct:';
 const noInputError = "No input found";
 const strayRangeError = 'Stray numeric range encountered: ';
 const tildeError = 'At least 2 words expected before ~';
 const frequent_termsError = 'ATLEAST can not handle multiple values enclosed in parenthesis';
 const sentimentError = 'No equivalent exists for sentiment';
 const seoError = 'No equivalent exists for seo';
 const conversionError = 'Conversion method not shared for token: ';
 const missingValueError = 'missing value after token: ';
 const unknownTokenError = 'Unknown keyword or token: ';
 const wildcardStarError = 'Wildcard * encountered in ';
 const wildcardQmarkError = 'Wildcard ? encountered in ';
 const parenthesisError = 'Mismatched parenthesis in the query';
 const noErrors = 'No errors encountered';
 const wildcardStarMRRError = 'Wildcard * encountered in Market Research Reports Token: ';
 const unmatchedRightParenthesisError = 'Unmatched right parenthesis at token: ';
 const booleanLowercaseError = 'Boolean operator ${currentToken} should be uppercase at token: ';
 const tooFewTildeWordsError = 'At least 2 words expected before ~';
 const tildeNaNError = 'Whole number expected after ~';
 const nonNumericRangeError = 'Range should be numeric for ';
 const rangeError = '2nd number should be bigger than the 1st number for ';
 const rangeFormatError = '"TO" missing between the range in ';
 const textCaseSensitiveError = 'text.case_sensitive used instead of text ';
 const urlTokenError = 'url used instead of site_urls_ll ';
 const invalidURLError = 'Invalid URL used for ';

// Define constants used in setup to avoid hard-coding
 const leftMargin = '100px';
 const h1PageHeading = 'NGC3 to C1 Conversion';
 const h5PageHeading = 'Version 28, Build Date August 20, 2024';
 const h3InputHeading = 'Enter the NGC3 Query Here';
 const h3ErrorHeading = 'Corrections Needed';
 const h3OutputDivHeading = 'Converted C1 Query';
 const colorCode = '#000080';
 const centerAlign = 'center';
 const leftAlign = 'left';
 const widthValue = '100%';
 const boxWidth = '1000px';
 const boxHeight = '150px';
 const paddingSize = '10px';
 const borderColor = '1px solid #ccc';
 const submitButtonName = 'Submit Query';
 const checkButtonName = 'Check Query';
 const clearButtonName = 'Clear Screen';
 const checkAndClearButtonMargin = '20px';
 const errorBoxHeight = '100px';
 const backgroundColor = 'white';
 const copyButtonName = 'Copy to Clipboard';

// Other values
 const parseMode = 'Parse';
 const checkMode = 'Check';

function preload() {
// Load each file and assign it to a variable
// Each of these loaded files have the boolean queries for
// tk_filter/filter and tk_custom filters. 
// Source of these queries:
// GU-SUBJECT EXCLUSIONS for C1-250524-020203

    masterExclusiveContent = loadStrings(masterExclusiveFileName);
    dealsCouponsContent = loadStrings(dealsCouponsFileName);
    earningsStockNewsContent = loadStrings(earningsStockNewsFileName);
    jobPostingsContent = loadStrings(jobPostingsFileName);
    pressReleaseContent = loadStrings(pressReleaseFileName);
    obituariesContent = loadStrings(obituariesFileName);
    sportsContent = loadStrings(sportsFileName);
    marketResearchReportsContent = loadStrings(marketResearchReportsFileName);

// Load the CSV file
    languageTable = loadTable(ISO639LanguageCodesCSVName, 'csv', 'header');
}	

function setup() {
  noCanvas();
  
// Create a heading for the page and define the color,
// alignment and width.
  
 let pageHeading = createElement('h1', h1PageHeading);
 pageHeading.style('color', colorCode); 
 pageHeading.style('text-align', centerAlign); 
 pageHeading.style('width', widthValue); 

// Add a 2nd heading to display the version number and build date
 let pageHeading5 = createElement('h5', h5PageHeading);
 pageHeading5.style('color', colorCode); 
 pageHeading5.style('text-align', centerAlign); 
 pageHeading5.style('width', widthValue); 
  
// Create a heading for the input box and define the color,
// alignment, left margin and width.
//
 let inputHeading = createElement('h3', h3InputHeading);
 inputHeading.style('color', colorCode); 
 inputHeading.style('text-align', leftAlign); 
 inputHeading.style('width', widthValue); 
 inputHeading.style('margin-left', leftMargin);
  
// Create a textarea HTML element for the input, define
// the size of the box and the left margin.
//

 userInput = createElement('textarea');
 userInput.style('width', boxWidth);  
 userInput.style('height', boxHeight);
 userInput.style('overflow', 'hidden');
 userInput.style('resize', 'none');  
 userInput.style('margin-left', leftMargin);
 userInput.style('padding', paddingSize);       
 userInput.style('border', borderColor);  
 userInput.style('box-sizing', 'border-box');  
 userInput.style('white-space', 'pre-wrap');  

// Adjust the height of the textarea dynamically. The minimum
// size (height) of the box us 150px. But the size should increase
// if the query is bigger. The box size should be as big as the
// query. This event listener will wait for users to enter a
// query in the input box, then automatically adjust the size.
 userInput.elt.addEventListener('input', adjustInputHeight);
  
 function adjustInputHeight() {
// An inline function to adjust height
  userInput.elt.style.height = 'auto'; 
  
// Make sure height never reduces too much. The minimum size of the
// input box is 150 px. Set the height to the scrollHeight, as long
// as it does not go below 150px.
  if (userInput.elt.scrollHeight < 150) {
  userInput.elt.style.height = boxHeight; 
  }
  
  else {
  userInput.elt.style.height = userInput.elt.scrollHeight + 'px';  
  }
}
  
function resetInputHeight () {
// An inline function to reset height. This will be called when
// "Clear Screen" is pressed.
  userInput.elt.style.height = 'auto'; 
  userInput.elt.style.height = boxHeight; 
}
  
// Create a line break after the textarea
 let br = createElement('br');
  
// Get user input
//
 userInput.input(() => {

 });

// Create a "submit" button for the users and define the
// left margin.
//
 const submitButton = createButton(submitButtonName);
 submitButton.style('margin-left', leftMargin);

// Action to be taken when the submit button is clicked.
// Call a set of functions to tokenise the input, store it 
// in NGG3_list, parse it, display the converted query and
// the corrections needed in the appropriate textareas.
//
  submitButton.mousePressed(() => {
// Tokenize input and store in NGC3_list
    NGC3_list = tokenize(userInput.value()); 
// VERSION 26 CHANGES BEGIN
// Clear the Output DIV and the Error areas
    while (Error_list.length !== 0) {
       Error_list.pop();
    }
    
// Clear the conent of the DIV area
    outputDiv.html('');
    
// Try in another way
    span = createSpan('');
    span.parent(outputDiv);
// VERSION 26 CHANGES END
// Proceed only if there was any input.
    if (userInput.value() !== "") {
       parseNGC3toC1();  
    }
    else {
      Error_list.push(noInputError);
    }
    
// Display the errors, if any.
    displayErrorList();  
    
// Dispatch the custom contentChanged event. We want the output
// box to be at least 150px, but become bigger if the output 
// query is bigger. Dispatching this event will call a function 
// that will adjust the output box size.
    let event = new Event('contentChanged');
    outputDiv.elt.dispatchEvent(event);
  });
 
// Create a "Check" button for the users. This button is used to 
// check the syntax of the NGC3 query.
  const checkButton = createButton(checkButtonName);
  checkButton.style('margin-left', checkAndClearButtonMargin);
  
// Action to be taken when the check button is clicked.
// Call a set of functions to tokenise the input, store it 
// in NGG3_list, check the syntax, display corrections
// needed in the appropriate textareas.
//
  checkButton.mousePressed(() => {
// Tokenize input and store in NGC3_list
    NGC3_list = tokenize(userInput.value());  
    
// Proceed only if there was any input.
    if (userInput.value() !== "") {
// Parse the token list to C1 format
       checkSyntax();  
    }
    
    else {
      Error_list.push(noInputError);
    }
    
// Display the errors, if any.
    displayErrorList();  
  });
  
// Create a button to clear the screen.
  const clearButton = createButton(clearButtonName);
  checkButton.style('margin-left', checkAndClearButtonMargin);
  checkButton.style('margin-right', checkAndClearButtonMargin);
  
// Action to be taken when the clear button is clicked.
// Erase everything in the input area, error area and the 
// output DIV.
  
  clearButton.mousePressed(() => {
    
// Clear the content of the input and error textareas
    userInput.value(''); 
    errorArea.value(''); 
// clear the contents of the error array
// VERSION 26 CHANGES BEGIN
//  Error_list.pop();
// Erase all the contents of Error_list
    while (Error_list.length !== 0) {
       Error_list.pop();
    }
// VERSION 26 CHANGES END
    
// Reset the height of the input area
    resetInputHeight();

// Clear the conent of the DIV area
    outputDiv.html('');
    
// Try in another way
    span = createSpan('');
    span.parent(outputDiv);

// Reset the height of the output DIV
    resetOutputHeight();
  });
  
// Create a heading for the error box and define the color,
// alignment, left margin and width.
//
  let errorHeading = createElement('h3', h3ErrorHeading);
  errorHeading.style('color', colorCode); 
  errorHeading.style('text-align', leftAlign); 
  errorHeading.style('width', widthValue); 
  errorHeading.style('margin-left', leftMargin);
  
// Create a HTML textarea for error, define the size 
// of the box and the left margin.
//
  let errorArea = createElement('textarea');
  errorArea.id('errorArea');
  errorArea.style('width', boxWidth);    
  errorArea.style('height', errorBoxHeight); 
  errorArea.style('resize', 'none');  
  errorArea.style('margin-left', leftMargin);
  
// Apply additional CSS for error area. Define the border.
//
  errorArea.style('border', borderColor);  
  errorArea.style('box-sizing', 'border-box');  
  
// Create a heading for the DIV box and define the 
// color, alignment, left margin and width.

  let outputDivHeading = createElement('h3', h3OutputDivHeading);
  outputDivHeading.style('color', colorCode); 
  outputDivHeading.style('text-align', leftAlign); 
  outputDivHeading.style('width', widthValue); 
  outputDivHeading.style('margin-left', leftMargin);
  
// Creating a sample DIV area so that text with color can
// be displayed here. A textarea will not display text in color.
//
  const outputDiv = createDiv('');
  outputDiv.id('outputDiv');
  outputDiv.style('width', boxWidth);
  outputDiv.style('height', boxHeight);
  outputDiv.style('overflow', 'hidden');
  outputDiv.style('margin-left', leftMargin);
  outputDiv.style('border', borderColor);
  outputDiv.style('box-sizing', 'border-box'); 
  outputDiv.style('overflow-y', 'auto');
  outputDiv.style('background-color', backgroundColor);
  outputDiv.style('font-family', 'monospace');
  outputDiv.style('resize', 'none');  
 
// Listen for custom content change event. This event is needed
// adjust the size of the output box, depending on the size of
// the output query.
  outputDiv.elt.addEventListener('contentChanged', adjustOutputHeight);
    
  function adjustOutputHeight() {

// Inline function to resize the DIV area when the contents change
  outputDiv.elt.style.height = 'auto'; // Reset the height
  
// Maintain the miimum size of the box to 150px.
  if (outputDiv.elt.scrollHeight < 150) {
     outputDiv.elt.style.height = boxHeight; 
  }
    
  else {
// Set the height to the scrollHeight
     outputDiv.elt.style.height = outputDiv.elt.scrollHeight + 'px';
  }
}
  
// Create an inline function to reset the DIV. This will be
// called when the clear screen button is pressed.
 function resetOutputHeight() {
   outputDiv.elt.style.height = 'auto'; // Reset the height
   outputDiv.elt.style.height = boxHeight; 
 }
  
// Create a button for copying text. Users can press this
// to copy the converted query in the C1 format.
//
  let copyButton = createButton(copyButtonName);
  copyButton.style('margin-left', leftMargin);

// Sepcify the action to be taken when the button is pressed. 
// In order to access the contents of the DIV area, we shoud 
// copy it to a textarea first. Create a temporary textarea every
// time the copy button is pressed, then delete it after use.
  
  copyButton.mousePressed(() => {
    
// Retrieve the text from the DIV 
    const textData = select('#outputDiv').elt.innerText; 
    
// Create a temporary textarea
    const tempTextarea = document.createElement('textarea');  
    tempTextarea.style.position = 'absolute';  
    tempTextarea.style.left = '-9999px';
    
// Append it to the body of the document
    document.body.appendChild(tempTextarea);   
    
// Now select and copy the contents of the temporary textarea.
// Note that the color will not be copied: only the content.
    tempTextarea.value = textData;  
    tempTextarea.select();  
    document.execCommand('copy');  
    
// Remove the textarea from the document
    document.body.removeChild(tempTextarea);  
  });
  
}

//
// Individual functions start here. 
//

// Tokenizes input based on specified token types
// At the end of this function, input will be converted
// to tokens and loaded into NGC3_list[]
//
function tokenize(input) {
// This regex will:
// - Capture text enclosed in double quotes
// - Capture individual parentheses and tilde
// - Capture sequences of digits (numbers)
// - Capture words that end with a colon
// - Capture words not enclosed by quotes
// - Text enclosed in single quotes
// Does not consider a . in a quoted word as a delimiter
// Captures + and - as separate tokens

// OLD REGEX WHICH DOD NOT COVER CURLY QUOTES  
//    return input.match(/(?:[()[\]~+\-])|(?:"[^"]*"|'[^']*')|\w+(:?\.\w+)*|\d*\.?\d+/g);
// VERSION 24 CHANGES BEGIN
// Ensure * does not get stripped when not enclosed in
// quotes
//    return input.match(/(?:[()[\]~+\-])|(?:"[^"]*"|'[^']*'|“[^”]*”|‘[^’]*’)|\w+(:?\.\w+)*|\d*\.?\d+/g);
    return input.match(/(?:[()[\]~+\-])|(?:"[^"]*"|'[^']*'|“[^”]*”|‘[^’]*’)|\w+(\.\w+)*[\*?]?|\d*\.?\d+/g);
// VERSION 24 CHANGES END

}

// Parse tokens from NGC3 format to C1 format. Depending
// on the encountered token, take suitable action for
// conversion.
// 
function parseNGC3toC1() {
// Loop thru all the tokens loaded into NGC3_list[]. 
// Initialize loop counter.
  let NGC3_counter = 0;
  
  while (NGC3_counter < NGC3_list.length) {

// token has the current token being processed.
    const token = NGC3_list[NGC3_counter];

// For checkTokenStream
    let valueCount = 0;
    
// For TK_Custom_Processing
    let valCount = 0;
    
// For checkTildeStorm
    let moveIndex = 0;
    
// Handling tokens that are words enclosed in double quotes 
// when the next token is not a ~.
// In NGC3, 2 words in double quotes followed by a ~ and a
// number will be translated as the NEAR token. But if a
// phrase between double quotes doesn't have a ~ next to
// it, no processing is needed. That's the code in this
// nested IF.
// Note that these words can be enclosed in single, double,
// single curly or double curly quotes too.
  
    if ((token.startsWith('"') && token.endsWith('"')) ||
       (token.startsWith("'") && token.endsWith("'")) || 
       (token.startsWith('‘') && token.endsWith('’')) ||
       (token.startsWith('“') && token.endsWith('”'))) {

// Check if the next token is a tilde. If not, just push the word
// to the output without processing.
// VERSION 24 CHANGES BEGIN
//         if (NGC3_list[NGC3_counter+1] !== '~') {
         if (NGC3_list[NGC3_counter+1] !== tildeToken) {
// VERSION 24 CHANGES END
            wordTokenProcessing(NGC3_counter);
         }
      
         NGC3_counter++;
         continue; // Skip to the next token
    }
    
// Some tokens may have 1 or more - (hyphens), but may not
// be enclosed in single or double quotes. These are considered
// hyphenated words. String these tokens together as a single word.
// No processing needed.
// - (hyphen) should be treated carefully: because when it
// appears between numbers, it represents a range and it will be
// enclosed in square brackets.
//

// Check for a hypen first.
// VERSION 24 CHANGES BEGIN hyphenToken
//    if (NGC3_list[NGC3_counter+1] === '-') {
    if (NGC3_list[NGC3_counter+1] === hyphenToken) {
// VERSION 24 CHANGES END
// If the current token and the token after the hyphen are
// not numbers, string these 3 as a word, then skip the
// processing of all 3 tokens.

// If the function hyphenWordProcessing finds a hyphenated 
// word, it will push it to the output. If a stray number range
// is detected, it will push it to the output and flag an error.
// This function has 2 modes: Parse and Check. In the 
// Parse mode, it will also write to the output list.
//
// VERSION 24 CHANGES BEGIN
//        numericOrString = hyphenWordProcessing(token, //NGC3_counter, "Parse");
//        if (numericOrString === "String") {
// stray range not connected to a keyword encountered, Flag an
// error, but push the numbers out.
//        NGC3_counter+=3;
//        continue;
//        }
      hyphenWordProcessing(token, NGC3_counter, parseMode);
// Skip 3 tokens. These have been processed.
        NGC3_counter+=3;
        continue;
      }
// VERSION 24 CHANGES END

    switch (token) {
// VERSION 24 CHANGES BEGIN
 //     case 'AND':
 //     case 'and':
      case andToken:
      case ANDToken:
// VERSION 24 CHANGES BEGIN
// Check if the next token is a NOT. In that case, it will become
// an UNLESS. If a NOT is encountered, valCount will be 2. 
// Otherwise, it will be 1.
        valCount = unlessProcessing(NGC3_counter);
        NGC3_counter = NGC3_counter + valCount;
        break;
// VERSION 24 CHANGES BEGIN
//      case '(':
//      case ')':
//      case 'OR':
//      case 'NOT':
      case leftParenthesisValue:
      case rightParenthesisValue:
      case ORToken:
      case NOTToken:
// VERSION 24 CHANGES END
// VERSION 27 CHANGES BEGIN
// No processing needed for parenthesis, AND, NOT. Just add 
// them to the DIV area. But if it is a nested OR string, 
// further checking is needed.
//        populateDiv(token, normalMode);
//        NGC3_counter++;
// valCount returns the number of tokens involved in a
// nested OR.
// A nested OR is when all words within parenthesis have
// common elements and an OR connecting them. For example:
// ("Health" OR "Health’s" OR "Health's" ) 
// This should be replaced by ("Health")
// If valCount = 0, there's no nested OR. 
        valCount = nestedORProcessing(token, NGC3_counter, "Mixed");
        if (valCount === 0) {
           populateDiv(token, normalMode);
           NGC3_counter++;         
        }
        else {
// Contents have already been moved to the output DIV.
          NGC3_counter = NGC3_counter+ valCount;
        }
// VERSION 27 CHANGES END
        break;
// VERSION 24 CHANGES BEGIN
//     case 'or':
//     case 'not':
     case orToken:
     case notToken:
// VERSION 24 CHANGES END
// Syntax errors. Convert these to uppercase and push it
// in without flagging as errors.
        populateDiv(token.toUpperCase(0), normalMode);
        NGC3_counter++;
        break;
// VERSION 24 CHANGES BEGIN
//     case '+':
     case plusToken:
// VERSION 24 CHANGES END
// This should be treated as AND. Make an information
// statement.
        populateDiv(ANDToken, normalMode);
        NGC3_counter++;
        Error_list.push(plusError + token);
        break;
// VERSION 24 CHANGES BEGIN
//     case '~':
      case tildeToken:
// VERSION 24 CHANGES END       
// If you encounter a ~, proceed with NEAR conversion.
// moveIndex is the value returned by the function 
// checkTildestorm. It indicates how many tokens have already
// been processed. The +2 indicates the current token ~ and the
// number that comes after that.
//
       let moveIndex = nearProcessing(NGC3_counter);
        
       if (moveIndex !== 0) {
// WARNING: Should this not be NGC3_counter+moveindex+2?
// DEBUG BEGIN
          NGC3_counter = moveIndex+2;
// Fix not working
//          NGC3_counter = NGC3_counter+moveIndex+2;
// DEBUG END
        }
        else {
          NGC3_counter+=2;
        }
        break;
        
// VERSION 24 CHANGES BEGIN
//      case 'site_urls_ll:':
//      case 'site_urls_ll':
//      case 'url_direct:':
//      case 'url_direct':
//      case 'url':
//      case 'url:':
      case url_directToken:
      case site_urls_llToken:
      case urlToken:
// VERSION 24 CHANGES END
// These will be converted to url:
// Sometimes the NGC3 query has url instead of site_urls_ll
// Letting it pass thru without displaying an error.
// VERSION 24 CHANGES BEGIN
//        populateDiv('url:', normalMode);  
        populateDiv(urlTokenC1, normalMode);  
// VERSION 24 CHANGES END
        NGC3_counter++;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'tk_language':
//      case 'tk_language:':
//      case 'language':
//      case 'language:':
//      case 'lang':
//      case 'lang:':
        case tk_languageToken:
        case languageToken:
        case langToken:
// VERSION 24 CHANGES END
// Convert languages to C1 codes
// Sometimes the language code may be enclosed in parenthesis.
// In that case, a total of 4 tokens should be skipped. Else,
// only 2 tokens should be skipped.
//        languageProcessing(NGC3_counter);
        valCount = languageProcessing(NGC3_counter);
// Skip the tokens already processed
//        NGC3_counter += 2; 
          NGC3_counter = NGC3_counter + valCount;
        break;
// VERSION 24 CHANGES BEGIN
//      case  'frequent_terms:':
//      case  'frequent_terms':
      case frequent_termsToken:
// VERSION 24 CHANGES END
// Convert frequent_terms to ATLEAST.
// frequent_terms may have multiple values enclosed in parenthesis
// but C1's ATLEAST/X can not handle this. Check how many values
// are present after frequent_terms.
         valCount = frequentProcessing(NGC3_counter);
         NGC3_counter = NGC3_counter+ valCount;
         break;
// VERSION 24 CHANGES BEGIN
//      case 'tk_location':
//      case 'location':
//      case 'country':
//      case 'city':
//      case 'state':
//      case 'sourcelocationcountry':
//      case 'sourcelocationstate':
//      case 'tk_location:':
//      case 'location:':
//      case 'country:':
//      case 'city:':
//      case 'state:':
//      case 'sourcelocationcountry:':
//      case 'sourcelocationstate:':
      case tk_locationToken:
      case locationToken:
      case countryToken:
      case cityToken:
      case stateToken:
      case sourcelocationcountryToken:
      case sourcelocationstateToken:
// VERSION 24 CHANGES END
// All these will be converted to location: in C1.
	     locationProcessing(NGC3_counter);
         NGC3_counter+=2;
         break;
// VERSION 24 CHANGES BEGIN
//       case 'text':
//       case 'text.case_sensitive':
//       case 'text:':
//       case 'text.case_sensitive:':
       case textToken:
       case textcase_sensitiveToken:
// VERSION 24 CHANGES END
// Convert text: to text.case_sensitive: in C1.
// Sometimes the input NGC3 query has errors and it has
// text.case_sensitive instead of text. Just letting it
// pass thru. 
// VERSION 24 CHANGES BEGIN
//        populateDiv('text.case_sensitive:', 'Normal'); 
        populateDiv(textcase_sensitiveTokenC1, normalMode);  
// VERSION 24 CHANGES END
        NGC3_counter++;
        break;
// author will be retained as such 
// VERSION 24 CHANGES BEGIN
//       case 'author':
//       case 'author:':
       case authorToken:
//        populateDiv('author:', 'Normal');
//        populateDiv(NGC3_list[NGC3_counter+1], 'Normal');
        populateDiv(authorTokenC1, normalMode);
        populateDiv(NGC3_list[NGC3_counter+1], normalMode);
// VERSION 24 CHANGES END
        NGC3_counter+=2;
        break;
// VERSION 24 CHANGES BEGIN
//       case 'mediatype:':
//       case 'mediatype':
//       case 'medium':
//       case 'medium:':
//       case 'broadcast_mediatype_l:':
//       case 'broadcast_mediatype_l':
       case mediatypeToken:
       case mediumToken:
       case broadcast_mediatype_lToken:
// mediatype and broadcast_mediatype become medium in C1.
// Sometimes the input NGC3 query has medium instead of
// mediatype. Letting it pass thru without flagging an
// error. broadcast_mediatype_l will also be converted to medium
// but it has an additional token of 1 or 2.
// Call the media_type_processing function. valCount is the number
// of tokens that have been processed
        valCount = media_Type_Processing(NGC3_counter);  
        NGC3_counter = NGC3_counter+valCount;
// VERSION 24 CHANGES END
        break;
// VERSION 24 CHANGES BEGIN
//      case 'sentiment':
//      case 'sentiment:':
      case sentimentToken:
// VERSION 24 CHANGES END
// As of now, no changes will be made to this keyword or
// its values. This is wrong according to Kathryn Howell. C1 has
// no equivalent to this.
// VERSION 24 CHANGES BEGIN 
//        populateDiv('sentiment:', 'Error'); 
        populateDiv(sentimentTokenC1, errorMode); 
//        Error_list.push(`No equivalent exists for token: 
// ${token}`);
        Error_list.push(sentimentError);
// the sentiment value will also be pushed without changes
//        populateDiv(NGC3_list[NGC3_counter+1], 'Error');
        populateDiv(NGC3_list[NGC3_counter+1], errorMode);
// VERSION 24 CHANGES END
        NGC3_counter+=2;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'impact:':
//      case 'impact':
      case impactToken:
// VERSION 24 CHANGES END
// GU-CisionOne vs. NGC3 BOOLEAN Comparison-250524-015152
// With that as reference, impact will be converted to
// impact_score_grade.
// 
// VERSION 24 CHANGES BEGIN
//        populateDiv('impact_score_grade:', 'Normal');
//        populateDiv(NGC3_list[NGC3_counter+1], normalMode);
// Check if correct impact codes have been used
        impactProcessing(NGC3_counter+1);
// VERSION 24 CHANGES END
        NGC3_counter+=2;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'seo:':
//      case 'seo':
      case seoToken:
// According to Kathryn Howell, seo has no equivalent in C1.
//        populateDiv('seo:', 'Error');
//        Error_list.push(`No equivalent exists for token: ${token}`);
        populateDiv(seoTokenC1, errorMode);
        Error_list.push(seoError);
// VERSION 24 CHANGES END
// the seo value will also be pushed without changes
        populateDiv(NGC3_list[NGC3_counter+1], errorMode);
        NGC3_counter+=2;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'headline:':
//      case 'headline':
      case headlineToken:
// VERSION 24 CHANGES END        
// This will be converted to a combination of title: and 
// text.case_sensitive: in C1
// valCount is the number of tokens to skip
        valCount = headlineProcessing(NGC3_counter+1);
        NGC3_counter = NGC3_counter+ valCount+1;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'title:':
//      case 'title':
      case titleToken:
// This will be translated as title
//        populateDiv('title:', 'Normal');
        populateDiv(titleTokenC1, normalMode);
// VERSION 24 CHANGES END   
// the title/headline will also be pushed without changes
// VERSION 28 CHANGES BEGIN
// Let us do a nestedOR processing of the title elements
//        populateDiv(NGC3_list[NGC3_counter+1], 
// normalMode);
//        NGC3_counter+=2;
        NGC3_counter++;
// VERSION 28 CHANGES END
        break;
// VERSION 24 CHANGES BEGIN
//      case 'tk_filter':
//      case 'tk_filter:':
//      case 'filter':
//      case 'filter:':
      case tk_filterToken:
      case filterToken:
// VERSION 24 CHANGES BEGIN
// filter considered a synonym of tk_filter
// Usually, valCount = 2. 1 for tk_filter and 1 for the filter 
// after that. But if paterns like tk_filter:"WM Heartland | 
// Exclusions"  OR "11340208 is WM Heartland | Exclusions" is 
// encountered, valCount will be 4.
//
        valCount = TK_Filter_Processing(NGC3_counter);
        NGC3_counter = NGC3_counter + valCount;  
        break;
// VERSION 24 CHANGES BEGIN
//      case 'tk_custom':
//      case 'tk_custom:':
      case tk_customToken:
// VERSION 24 CHANGES END       
// Usually, valCount = 2. 1 for tk_custom and 1 for the
// filter after that. But if tk_custom:"Keywords" or  
// patterns like tk_custom:'WM Phoenix Open'" OR "820742 
// = WM Phoenix Open", valCount will be 4.
//
        valCount = TK_Custom_Processing(NGC3_counter);
        NGC3_counter = NGC3_counter + valCount;  
        break;
// CHANGES FOR VERSION 24 BEGIN
//      case 'tk_company:':
//      case 'tk_company':
      case tk_companyToken:
// CHANGES FOR VERSION 24 END
// tk_company may have 1 value or be in the format:
// tk_company:"WM: Earned Media Coverage" OR "498518 = WM | 
// All Coverage" 
// We have to flag everything that comes after tk_company
// as an error.
//
        valCount = TK_Company_Processing(NGC3_counter);
        NGC3_counter = NGC3_counter + valCount;  
        break;
// VERSION 24 CHANGES BEGIN
//      case 'tk_competitor':
//      case 'tk_competitor:':
//      case 'publisher':
//      case 'publisher:':
//      case 'search_id:':
//      case 'search_id':
//      case 'seq_id':
//      case 'seq_id:':
//      case 'article_id:':
//      case 'article_id':
//      case 'data_source_s':
//      case 'data_source_s:':
//      case 'tag:':
//      case 'tag':
//      case 'url_path_sections':
//      case 'url_path_sections:':
        case tk_competitorToken:
        case publisherToken:
        case searchIdToken:
        case seqIdToken:
        case articleIdToken:
        case dataSourceToken:
        case tagToken:
        case url_path_sectionsToken:
// Details of how to process these keywords has not yet
// been shared for all the above keywords. 
// 
//        Error_list.push(`Conversion method not shared for token: ${token}`);
          Error_list.push(conversionError + token);
// VERSION 24 CHANGES END
// There maybe more than 1 value, maybe a stream of tokens
        valueCount = checkTokenStream(token,NGC3_counter);
// Display keywords for which there is no conversion in C1 as
// an error in the DIV area.
        populateTokenStream(NGC3_counter, valueCount);
// Adding + 1 for the currentToken also
        NGC3_counter = NGC3_counter+valueCount+1;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'seo_impact:':
//      case 'seo_impact':
//      case 'tk_readership:':
//      case 'tk_readership':
      case seoImpactToken:
      case tkReadershipToken:
// VERSION 24 CHANGES END
// Details of how to process these keywords has not yet
// been shared for all the above keywords.These 2 have a
// range specified in square brackets.
//
// VERSION 24 CHANGES BEGIN
//        Error_list.push(`Conversion method not shared for token: //${token}`);
        Error_list.push(conversionError + token);
// VERSION 24 CHANGES END
// At NGC3_counter: seo_impact or tk_readership
// NGC3_counter+1: [ (opening square bracket)
// NGC3_counter+ 2: low number for the range
// NGC3_counter+3: - (hyphen)
// NGC3_counter+4: high number of the range
// NGC3_counter+5: ] (closing square bracket)
//
// Display keywords for which there is no conversion in C1 as
// an error in the DIV area.
        populateTokenStream(NGC3_counter, 5);
        NGC3_counter+=6;
        break;
      default:
// This is not a known token. This could still be valid,
// since websites and single word searches may not be
// enclosed in quotes. Check if this is such a case. 
// Otherwise, its an error.
        singleWordProcessing(NGC3_counter);
        NGC3_counter++;
        break;
    }
  }
}

// Near processing. In NGC3, 2 or more words in double quotes 
// followed by a ~ and a number is converted to NEAR in C1.
// - 2 words in doubles quotes "First Second"~n will be converted
// to ("First" NEAR/n "Second")
//
// - If there are 3-4 words before a ~, the query will  be checked 
// for a tilde stream. A tilde stream is a query like this:
// "Common Phrase Word1 Word2"~n OR "Common Phrase Word3"~n OR 
// "Common Phrase Word4 Word5 Word6"~n
// Or:
// "Word1 Word2 Common Phrase"~n OR "Word3 Common Phrase"~n OR 
// "Word4 Word5 Word6 Common Phrase"~n
//
// To be a tilde stream, query segments with ~ should be unbroken
// and continuous, have same number "n" after the ~ and all of them
// must have the same "Common Phrase". 
//
// - A tilde stream will be converted as: ("Commomon Phrase" NEAR/n // ("Word1 Word2" OR "Word3" OR "Word4 Word5"))
// - If a phrase is 3-4 characters long, has a ~ but it is not 
// part of a tilde stream, it will be converted differently.
//

function nearProcessing(index) {
// At the position "index" = tilde.
// Position index-1 = Phrase before the ~
// Position index+1 = Number after the ~
// Position index+ 2 = possibly OR, ( or )
  
  const wordToken = NGC3_list[index - 1];
  const currentToken = NGC3_list[index];
  const numberToken = NGC3_list[index + 1];
  
// This will be the value returned from the function
// checkTildeStorm. Essentially, it is the number of tokens
// that can be skipped.
  let moveIndex =0;
  
// Find the number of words in the wordToken 
// Split the string at each space and find the number of words
  let words = wordToken.split(' ');  
  let wordCount = words.length;

  if (wordCount === 2) {
// This means there were exactly 2 words before the ~
  let firstWord = words[0];  // Assign the first word
  let secondWord = words[1];  // Assign the second word

// Construct the NEAR query and push it into the DIV area
// Strip single quotes, double quotes and curly quotes 
    firstWord = firstWord.replace(/["'“”‘’]/g, '');
    secondWord = secondWord.replace(/["'“”‘’]/g, '');
  
// VERSION 24: Complex Function Note:
// Leaving the hard-coding as it is for now. 
    let nearString = '("' + firstWord + '"' + " NEAR/" + numberToken + ' "' + secondWord + '")';
    
    populateDiv(nearString, normalMode);
  }
  
  else if (wordCount < 2) {
// This means there were  < 2 words before the ~
     Error_list.push(tildeError);
  }
  
// If there are more than 2 words, check if there's a tilde
// stream.
 else if (wordCount > 2) {
// moveIndex is the number of tokens already processed by the
// function checkTildeStorm.   
   moveIndex = checkTildeStorm(index, wordToken, numberToken);
 }
 
 return(moveIndex);
}

function checkTildeStorm(index, wordToken, numberToken) {
// Here is where the presence of a tilde storm is detected and
// processed

// Declare list that will hold the possible tilde storm
   let tildeStorm = [];
  
// Pool all phrases here to find the common phrase
   let phrases = [];
  
// Initialize common phrase.
  let commonPhrase = "";
  
  let printBooleanOperator = true;
  
// This matrix will have 1 flag per phrase. It will indicate
// which of the phrases have the common words and which do not.
  let commonPhraseMatrix=[];

// Loop as long as you find the ~ in the same spot, the number
// token next to the ~ is the same and the end of tokens in
// NGC3_list is not reached.
//
  while ((index+5) < NGC3_list.length && NGC3_list[index + 4] === '~' && NGC3_list[index + 5] === numberToken) {
// Push this wordToken, ~ and numberToken to a list. This could
// We will process the storm later.
// Index -1 points to the phrase
// index points to the ~
// index +1 points to the number token
// index + 2 points to the boolean operator
//
       tildeStorm.push (NGC3_list[index - 1]);
       tildeStorm.push (NGC3_list[index]);
       tildeStorm.push (NGC3_list[index + 1]);
       tildeStorm.push (NGC3_list[index + 2]); 
    
// Move the phrase 
       phrases.push(NGC3_list[index - 1]);
    
// Go to the next entry
    index += 4;
  }  // Looping thru tokens in NGC3_list ends here

// End of loop reached. We still haven't pushed the last entry
// to the tildeStorm list. We can push it if there are other 
// entries in the list. Otherwise, this could be a lone ~ and
// should be parsed differently. 
//
  if (tildeStorm.length !== 0) {
    tildeStorm.push (NGC3_list[index - 1]);
    tildeStorm.push (NGC3_list[index]);
    tildeStorm.push (NGC3_list[index + 1]);
    tildeStorm.push (NGC3_list[index + 2]);

// Move the phrase to the phrases list
    phrases.push(NGC3_list[index - 1]);
    
// At this point, tileStorm[] has all the tokens involved in
// the storm. Find the common words.
   let results = findCommonWordsMaster(phrases);
   commonPhrase = results.commonWords;
   commonPhraseMatrix = results.commonWordsMatrix;
// Push common words to an array for later use in the function
// parseLongPhrases
    encounteredCommonPhrases.push(commonPhrase);   
}
  else {
// lone tilde entry. Parse it as a long phrase
    parseLongPhrases(index, wordToken, numberToken);
    
// Return this in the case of parsing long phrases
      return(index);
}

// Control will come here only when tildeStorm has at least
// 2 entries.
// Check if commonPhrase is empty. If yes, tildeStorm has a
// series of long phrases.
    if (!commonPhrase) {
// This could be multiple tilde entries or a lone tilde entry.
// But they don't have any phrases in common, even if there are
// multiple entries.
//
// longPhraseCounter points to the ~
//
      let longPhraseCounter = 1;
      
       while (longPhraseCounter < tildeStorm.length) {
// Loop thru all the long phrases. Pass the phrase and the 
// number token
          parseLongPhrases(index, tildeStorm[longPhraseCounter-1], tildeStorm[longPhraseCounter+1]);

// Push the boolean query operator. Do not push it if this is
// the last phrase
         if ((longPhraseCounter+4) < tildeStorm.length) {
            populateDiv(tildeStorm[longPhraseCounter+2], 'Normal');          
         }
         
// Increment loop counter
         longPhraseCounter = longPhraseCounter+4;
       }
      
// Return this in the case of parsing long phrases
        return(index);
    }
    
// commonPhrase is not empty
    else {
// Loop to convert and push to DIV area
      let loopCounter = 0;

// Set first time flag
      let firstEntry = true;

// Set tilde loop counter to 0
      let tildeLoopCounter = 0;

// Check if this particular phrase has the common word
      while (loopCounter < commonPhraseMatrix.length) {
// Does this phrase have the common word?
          if (commonPhraseMatrix[loopCounter] === 'Y') {
// Find the remaining words in the current token
          let wordTokenRemaining = removeCommonWords(tildeStorm[tildeLoopCounter], commonPhrase);
      
// Check if this is the 1st time entry into this while loop
             if (firstEntry) {
               firstEntry = false;
// Push the prelude to the tilde conversion
               populateDiv(`("${commonPhrase}" NEAR/${numberToken} ("${wordTokenRemaining}" `, 'Normal');
             }
      
             else { 
               populateDiv(`${tildeStorm[tildeLoopCounter +3]} "${wordTokenRemaining}" `, 'Normal'); 
// Add a )) if the next phrase does not have the common phrase or
// if this is the last phrase
                 if (commonPhraseMatrix[loopCounter+1] === 'N' || typeof commonPhraseMatrix[loopCounter+1] === 'undefined') {
                  populateDiv(`))`, 'Normal');
               }
// Add a boolean operator if there's a long phrase after this
                 if (commonPhraseMatrix[loopCounter+1] === 'N') {
                  populateDiv(` ${tildeStorm[tildeLoopCounter +3]} `, 'Normal');
               }
             }
          }
      
          else {
// This entry does not have the common phrase
// Treat this as a long phrase. 
            parseLongPhrases(index, tildeStorm[tildeLoopCounter], tildeStorm[tildeLoopCounter+2]);
// Push the boolean query operator. 
            populateDiv(tildeStorm[tildeLoopCounter+3], 'Normal');
            
// Indicate that you have printed this boolean operator
            printBooleanOperator = false;
          }

// Increment the while loop
          loopCounter++;

// Increment the tilde array index
          tildeLoopCounter = tildeLoopCounter +4;
       } 

// See if there's another OR.
// In tildeStorm[], the boolean operator is in position 
// tildeLoopCounter+3. Before the final tildeLoopCounter = 
// tildeLoopCounter+4, that is. So we have to look for OR 
// at position tildeLoopCounter+3-4. Which is tildeLoopCounter - 1.
//
      if (tildeStorm[tildeLoopCounter - 1] === 'OR' && printBooleanOperator) {
// DEBUG BEGIN
//        printBooleanOperator = true;
        printBooleanOperator = false;
// DEBUG END
        populateDiv(tildeStorm[tildeLoopCounter -1], 'Normal');
      }
  }
  
// Return the difference between the final value of the index and
// the entry value. 
  return(index +1);
}   

function parseLongPhrases(index, wordToken, numberToken) {
// This is to parse phrases with a ~ and 3-6 words in the
// phrase. At this point:
// - index points to the ~
// 

// Split the phrase at blanks and find the number of words.
  let words = wordToken.split(" ");
  let wordCount = words.length;
  
// When the number of words is 3:
// firstPart will have the 1st word.
// secondPart will have the next 2 words.
// 
// When the number of words is 4:
// firstPart will have the 1st 2 words.
// secondPart will have the next 2 words.
  
// When the number of words is 5:
// firstPart will have the 1st 2 words.
// secondPart will have the next 3 words.
// 
// When the number of words is 6:
// firstPart will have the 1st 3 words.
// secondPart will have the next 3 words.
  
  let firstPart, secondPart;
  
// Constructed output string
  let outputString;
  
// First check if a part of the phrase under scrutiny was used
// as a commonPhrase thus far.
  loopCounter = 0;

// Strip single quotes, double quotes and curly quotes 
   let newWordToken = wordToken.replace(/["'“”‘’]/g, '');
  
// Set match found flag to false
  let matchFound = false;
  
  while (loopCounter < encounteredCommonPhrases.length) {
// Check if the wordToken starts with or ends with any of the
// encountered common phrases
    if (newWordToken.startsWith(encounteredCommonPhrases[loopCounter])) {
// Match with a prior common phrase found
    secondPart = removeCommonWords(newWordToken,encounteredCommonPhrases[loopCounter]);
    matchFound = true;
    break;
    }
    else if (newWordToken.endsWith(encounteredCommonPhrases[loopCounter])) {
// Match with a prior common phrase found
    secondPart = removeCommonWords(newWordToken,encounteredCommonPhrases[loopCounter]);
    matchFound = true;
    break;
    }
    else {
// Do nothing
    }
    loopCounter++;
  }
  
  if (matchFound) {
    populateDiv(`("${encounteredCommonPhrases[loopCounter]}" NEAR/${numberToken} "${secondPart}")`);
  }
//  if (wordCount === 3) {
  else if (wordCount === 3) {
    firstPart = words[0]; 
    secondPart = words[1] + " " + words[2]; 
    
// Push the output to the DIV area
    populateDiv(`(${firstPart}" NEAR/${numberToken} "${secondPart})`, 'Normal');
  } 
  
  else if (wordCount === 4) {
    firstPart = words[0] + " " + words[1]; 
    secondPart = words[2] + " " + words[3]; 
// VERSION 26 CHANGES BEGIN
// Incorrect placement of double quotes corrected
//    populateDiv(`"(${firstPart}" NEAR/${numberToken} //${secondPart})`, 'Normal');
// Construct the output string
    outputString = '(' + firstPart + '" NEAR/' + numberToken + ' "'+ secondPart + ')';
    populateDiv(outputString, 'Normal');
// VERSION 26 CHANGES END
  } 
  
  else if (wordCount === 5) {
    firstPart = words[0] + " " + words[1];
    secondPart = words[2] + " " + words[3] + " " + words[4]; 
// VERSION 26 CHANGES BEGIN
// Incorrect placement of double quotes corrected
//    populateDiv(`"(${firstPart}" NEAR/${numberToken} //${secondPart})`, 'Normal');
    outputString = '(' + firstPart + '" NEAR/' + numberToken + ' "'+ secondPart + ')';
    populateDiv(outputString, 'Normal');
// VERSION 26 CHANGES END
  } 
  
  else if (wordCount === 6) {
    firstPart = words[0] + " " + words[1] + " " + words[2];
    secondPart = words[3] + " " + words[4] + " " + words[5]; 
// VERSION 26 CHANGES BEGIN
// Incorrect placement of double quotes corrected
//    populateDiv(`"(${firstPart}" NEAR/${numberToken} 
// ${secondPart})`, 'Normal');
    outputString = '(' + firstPart + '" NEAR/' + numberToken + ' "'+ secondPart + ')';
    populateDiv(outputString, 'Normal');
// VERSION 26 CHANGES END
  } 
  
  else {
    Error_list.push("Too many words before ~");
  }
  
}

function findCommonWords(phrases) {

// This array will hold all the 1st words of each phrase
let firstWords = [];

// This array will hold all the 1st two words of each phrase
let firstTwoWords = [];

// This array will hold all the 1st three words of each phrase
let firstThreeWords = [];

// This array will hold all the last words of each phrase
let lastWords = [];
  
// This array will hold all the last two words of each phrase
let lastTwoWords = [];

// temporary word
let tempWord;

// populate the arrays
let loopIndex = 0;

while (loopIndex < phrases.length) {
   tempWord = phrases[loopIndex].split(' ');

// Check the length of the current phrase in tempword
// Strip single quotes, double quotes and curly quotes 
    firstWords[loopIndex] = tempWord[0].replace(/["'“”‘’]/g, '');
    firstTwoWords[loopIndex] = tempWord[0].replace(/["'“”‘’]/g, '') + ' '+ tempWord[1].replace(/["'“”‘’]/g, '');
  
  if (tempWord.length >= 5) {
// Strip single quotes, double quotes and curly quotes 
    firstThreeWords[loopIndex] = tempWord[0].replace(/["'“”‘’]/g, '') + ' '+ tempWord[1].replace(/["'“”‘’]/g, '') + ' '+tempWord[2].replace(/["'“”‘’]/g, '');
  }
  else if (tempWord.length > 3) {
// Strip single quotes, double quotes and curly quotes 
    lastWords[loopIndex] = tempWord[tempWord.length-1].replace(/["'“”‘’]/g, '');
    lastTwoWords[loopIndex] = tempWord[tempWord.length-2].replace(/["'“”‘’]/g, '') + ' '+ tempWord[tempWord.length-1].replace(/["'“”‘’]/g, '');
  }
  else if (tempWord.length === 3) {
// Strip single quotes, double quotes and curly quotes 
    lastWords[loopIndex] = tempWord[tempWord.length-1].replace(/["'“”‘’]/g, '');  
    lastTwoWords[loopIndex] = "";
  }
  else {
    lastWords[loopIndex] = "";
    lastTwoWords[loopIndex] = "";
  }
  
  loopIndex++;
}
  
// Intialize counters
let firstWordsCount = 0;
let firstTwoWordsCount = 0;
let firstThreeWordsCount = 0;
let lastWordsCount = 0;
let lastTwoWordsCount = 0;
  
let maxCount = 0;
let maxString;

// These are the return values
let commonFirstWord;
let commonFirstTwoWords;
let commonFirstThreeWords;
let commonLastWord;
let commonLastTwoWords;
  
// Loop thru the first words. We are trying to see which word
// was used the most.
loopIndex = 0;

while (loopIndex < firstWords.length) {
   
   innerLoopIndex = 0;
   firstWordsCount = 0;

   while(innerLoopIndex < firstWords.length) {
       if (firstWords[innerLoopIndex].startsWith(firstWords[loopIndex]) && firstWords[loopIndex] !== "") {
           firstWordsCount++;
       }

       innerLoopIndex++;
   }

// Check if this count is higher than the previous maximum
   if (firstWordsCount > maxCount) {
      maxCount = firstWordsCount;
      maxString = firstWords[loopIndex];
   }

   loopIndex++;
}

commonFirstWord = maxString;
  
// Loop thru the first two words. We are trying to see which word
// was used the most.
loopIndex = 0;

maxCount = 0;
maxString = "";

while (loopIndex < firstTwoWords.length) {
   
   innerLoopIndex = 0;
   firstTwoWordsCount = 0;

   while(innerLoopIndex < firstTwoWords.length) {
       if (firstTwoWords[innerLoopIndex].startsWith(firstTwoWords[loopIndex])&& firstTwoWords[loopIndex] !== "") {
           firstTwoWordsCount++;
       }

       innerLoopIndex++;
   }

// Check if this count is higher than the previous maximum
   if (firstTwoWordsCount > maxCount) {
      maxCount = firstTwoWordsCount;
      maxString = firstTwoWords[loopIndex];
   }

   loopIndex++;
}

commonFirstTwoWords = maxString;

// Loop thru the first three words. We are trying to see which word
// was used the most.
loopIndex = 0;

maxCount = 0;
maxString = "";

while (loopIndex < firstThreeWords.length) {
   
   innerLoopIndex = 0;
   firstThreeWordsCount = 0;

   while(innerLoopIndex < firstThreeWords.length) {
       if(typeof firstThreeWords[loopIndex] !== 'undefined' && typeof firstThreeWords[innerLoopIndex] !== 'undefined') {
       if (firstThreeWords[innerLoopIndex].startsWith(firstThreeWords[loopIndex]) && firstThreeWords[loopIndex] !== "") {
           firstThreeWordsCount++;
       }
       }
       innerLoopIndex++;
   }

// Check if this count is higher than the previous maximum
   if (firstThreeWordsCount > maxCount) {
      maxCount = firstThreeWordsCount;
      maxString = firstThreeWords[loopIndex];
   }

   loopIndex++;
}

commonFirstThreeWords = maxString;
  
// Loop thru the last words. We are trying to see which word
// was used the most.
loopIndex = 0;

maxCount = 0;
maxString = "";

while (loopIndex < lastWords.length) {
   
   innerLoopIndex = 0;
   lastWordsCount = 0;

   while(innerLoopIndex < lastWords.length) {
// Do not proceed with lastWords[innerLoopIndex] is empty
       if (lastWords[innerLoopIndex]) {
          if (lastWords[innerLoopIndex].endsWith(lastWords[loopIndex]) && lastWords[loopIndex]!== "")     {
             lastWordsCount++;
          }
       }

       innerLoopIndex++;
   }

// Check if this count is higher than the previous maximum
   if (lastWordsCount > maxCount) {
      maxCount = lastWordsCount;
      maxString = lastWords[loopIndex];
   }

   loopIndex++;
}

commonLastWord = maxString;

// Loop thru the unique last two words
loopIndex = 0;

maxCount = 0;
maxString = "";

while (loopIndex < lastTwoWords.length) {
   
   innerLoopIndex = 0;
   lastTwoWordsCount = 0;

   while(innerLoopIndex < lastTwoWords.length) {
// Do not proceed with lastTwoWords[innerLoopIndex] is empty
       if (lastTwoWords[innerLoopIndex]) {
          if (lastTwoWords[innerLoopIndex].endsWith(lastTwoWords[loopIndex] && lastTwoWords[loopIndex]!==""))     {
             lastTwoWordsCount++;
          }
       }

       innerLoopIndex++;
   }

// Check if this count is higher than the previous maximum
   if (lastTwoWordsCount > maxCount) {
      maxCount = lastTwoWordsCount;
      maxString = lastTwoWords[loopIndex];
   }

   loopIndex++;
}

commonLastTwoWords = maxString;
  
return {
mostCommonFirstWord: commonFirstWord,
mostCommonFirstTwoWords: commonFirstTwoWords, 
mostCommonFirstThreeWords: commonFirstThreeWords, 
mostCommonLastWord: commonLastWord,
mostCommonLastTwoWords: commonLastTwoWords, 
};

}

function removeCommonWords(original, common) {
  
// Strip single quotes, double quotes and curly quotes 
 originalNoQuotes = original.replace(/["'“”‘’]/g, '');
 commonNoQuotes = common.replace(/["'“”‘’]/g, '');
  
 let words = originalNoQuotes.split(" ");
 let commonWords = commonNoQuotes.split(" ");
 let remainingWords = words.filter(word => !commonWords.includes(word));

  return remainingWords.join(" ");
}

function languageProcessing(index) {
// Load and process language settings. The translation code
// for languages was picked up from the PDF: 
// GU-CisionOne vs. NGC3 BOOLEAN Comparison-250524-015152

// Default return value of this function
   valCount = 2;
  
// index points to the token "tk_language". 
// index+ 1 points to the NGC3 language.
  let NGC3_language = NGC3_list[index + 1];

// VERSION 24 CHANGES BEGIN
// Sometimes, language maybe enclosed in parenthesis. Skip that.
  if (NGC3_language === leftParenthesisValue) {
    NGC3_language = NGC3_list[index + 2];

// 4 tokens should be skipped in this case.
    valCount = 4;
  }
// VERSION 24 CHANGES END
  
// Strip single quotes, double quotes and curly quotes 
  let NGC3_languageNoQuotes = NGC3_language.replace(/["'“”‘’]/g, "");

// This will hold the result from the function
  let C1_language;
  
// NGC3_languageNGC3 language will will be converted to C1 language
// codes. The function readLanguageCodesCSV reads the CSV file
// that lists NGC3 and its C1 equivalent.
//
  C1_language = readLanguageCodesCSV(NGC3_languageNoQuotes);
  
// Check the output. If it is null, it is an unsupported
// language.
  
  if (C1_language) {
    populateDiv(language_codesTokenC1, normalMode);
    populateDiv(C1_language, normalMode);
  }
  
  else {
    populateDiv(language_codesTokenC1, errorMode);
    populateDiv(XXValue, errorMode);
    
// Flag an error. An unsupported NGC3 language was
// encountered.
    Error_list.push(languageCodeError + NGC3_language);
  }
  
  return(valCount);
}

function frequentProcessing(index) {
// Load and process frequent settings
  let termToken = NGC3_list[index + 1];
  
// Sometimes, frequent_terms has multiple values enclosed 
// in parenthesis. The ATLEAST token in C1 can not handle 
// multiple values. This should be caught and flagged as 
// an error.
  
// Return value that indicates how many tokens should be
// skipped. Initial value is 1.
  let valCount = 1;
  
// Check if the token is a parenthesis.
  if (termToken === leftParenthesisValue ) {
    
// VERSION 28 CHANGES BEGIN
// Check how many values are enclosed between parenthesis. 
// If there is only 1 value, process it. Otherwise,
// Flag everything as an error.
     if (NGC3_list[index+3] === rightParenthesisValue) {
        termToken = NGC3_list[index+2];
        populateDiv(leftParenthesisValue, normalMode);
        populateDiv(termToken, normalMode);
        populateDiv(atleastTokenC1, normalMode);
// Indicate that 3 values after frequent_terms was
// encountered,
        valCount = valCount+3;
     }
     else {
// VERSION 28 CHANGES END
        while (termToken !== rightParenthesisValue) {
           populateDiv(termToken, errorMode);
           index++;
           valCount++;
           termToken = NGC3_list[index + 1];
        }
    
// Add 1 more for the last parenthesis.
        valCount++;
    
// Push ATLEAST instead of the last parenthesis. Push
// ATLEAST as an error.
        populateDiv(atleastTokenC1, errorMode);
    
// Indicate that there were too many values for
// frequent_terms and that it can not be converted into 
// its C1 equivalent.
        Error_list.push(frequent_termsError);
     }
// VERSION 28 CHANGES BEGIN
  }
// VERSION 28 CHANGES END
  else {
// Push a left parenthesis
      populateDiv(leftParenthesisValue, normalMode);
      populateDiv(termToken, normalMode);
    
// ATLEAST should always be converted to ATLEAST/3 according 
// to Kathryn Howell.
      populateDiv(atleastTokenC1, normalMode);
    
// Indicate that only 1 value after frequent_terms was
// encountered,
      valCount++;
  }   
  
// Return the value of the number of tokens that can be
// skipped.
  return(valCount);
}

function locationProcessing(index) {
// Load and process location settings. 
// Assumption: Location in NGC3 will not have multiple
// values in parenthesis.
  
// Value at index+1 is the location
  const locationValue = NGC3_list[index + 1];
  
// No processing will be done. We will translate the NGC3
// keyword to C1. But the location value will be pushed as
// it is.
// VERSION 29 CHANGES BEGIN
//  populateDiv(locationTokenC1, normalMode);
//  populateDiv(locationValue, normalMode);
  populateDiv(locationTokenC1, highlightMode);
  populateDiv(locationValue, highlightMode);
// VERSION 29 CHANGES END
}

function Media_Type_Detailed_Processing(index) {
// Load and process mediatype settings
  const thisMediaType = NGC3_list[index + 1];
  
// Strip single quotes, double quotes and curly quotes
  const thisMediaTypeNoQuotes = thisMediaType.replace(/["'“”‘’]/g, '');
  
  switch (thisMediaTypeNoQuotes) {
      case NewsValue:
// VERSION 29 CHANGES BEGIN
//          populateDiv(onlineValue, normalMode);
          populateDiv(onlineValue, highlightMode);
// VERSION 29 CHANGES END
          break;
      case PodcastValue:
      case podcastValue:
// VERSION 29 CHANGES BEGIN
//          populateDiv(PodcastValue, normalMode);
          populateDiv(PodcastValue, highlightMode);
// VERSION 29 CHANGES END
          break;
      case BroadcastValue:
      case broadcastValue:
// VERSION 29 CHANGES BEGIN      
//          populateDiv(TVOrRadioValue, normalMode);
          populateDiv(TVOrRadioValue, highlightMode);
// VERSION 29 CHANGES END
          break;  
      case PrintValue:
      case NewsLicensedValue:
      case PrintLicensedValue:
// VERSION 29 CHANGES BEGIN  
//          populateDiv(printOrMagazineValue, normalMode);
          populateDiv(printOrMagazineValue, highlightMode);
// VERSION 29 CHANGES END      
          break;
      case number1:
// This means the previous token was broadcast_mediatype
// VERSION 29 CHANGES BEGIN       
//          populateDiv(TVValue, normalMode);
          populateDiv(TVValue, highlightMode);
// VERSION 29 CHANGES END       
          break;
      case number2:
// This means the previous token was broadcast_mediatype
// VERSION 29 CHANGES BEGIN       
//          populateDiv(radioValue, normalMode);
          populateDiv(radioValue, highlightMode);
// VERSION 29 CHANGES END       
          break;
        case BlogValue:
        case BlogsValue:
        case blogValue:
        case blogsValue:
        case BlogLicensedValue:
        case blogLicensedValue:
          Error_list.push(mediatypeC1Error + thisMediaType);
// VERSION 29 CHANGES BEGIN 
//          populateDiv(thisMediaType, errorMode);
          populateDiv(thisMediaType, highlightErrMode);
// VERSION 29 CHANGES END  
          break;
      default: 
          Error_list.push(mediatypeError + thisMediaType);
// VERSION 29 CHANGES BEGIN     
//          populateDiv(thisMediaType, errorMode);
          populateDiv(thisMediaType, highlightErrMode);
// VERSION 29 CHANGES END  
      break;
  }
}

function TK_Filter_Processing(index) {
// Process filters based on the type. There are a few anomalies.
// For example:
// tk_filter:"WM Heartland | Exclusions"  OR "11340208 
// is WM Heartland | Exclusions" 
// Such cases should be flagged as errors.
//
  const filterType = NGC3_list[index + 1];
  
// Initialize return value. This is the number of tokens to skip.
// 1 for tk_filter and 1 for the token. However, for variants,
// the number of tokens to skip will be higher.
  let valCount = 2;
  
// Initialize array that will hold the variant's value.
  let finalToken = [];
  
// Strip single quotes, double quotes and curly quotes 
  const filterTypeNoQuotes = filterType.replace(/["'“”‘’]/g, '');
  
  switch (filterTypeNoQuotes) {
// VERSION 24 CHANGES BEGIN
//    case 'Master Exclusive':
    case masterExclusiveValue:
// VERSION 24 CHANGES END
      populateDiv(masterExclusiveContent.join(' '), normalMode); 
      break;
// VERSION 24 CHANGES BEGIN
//    case 'Deals & Coupons':
    case dealsCouponsValue:
// VERSION 24 CHANGES END
      populateDiv(dealsCouponsContent.join(' '), normalMode);
      break;
// VERSION 24 CHANGES BEGIN      
//    case 'Earnings & Stock News':
    case earningsStockNewsValue:
// VERSION 24 CHANGES END
      populateDiv(earningsStockNewsContent.join(' '), normalMode);
      break;
// VERSION 24 CHANGES BEGIN        
//    case 'Job Postings':
    case jobPostingsValue:
// VERSION 24 CHANGES END     
      populateDiv(jobPostingsContent.join(' '), normalMode); 
      break;
// VERSION 24 CHANGES BEGIN       
//    case 'Press Release':
    case pressReleaseValue:
// VERSION 24 CHANGES END        
      populateDiv(pressReleaseContent.join(' '), normalMode); 
      break;
    case marketResearchReportsValue:
// VERSION 25 CHANGES BEGIN
      marketResearchReportsFlag = true;
// VERSION 25 CHANGES END
      populateDiv(marketResearchReportsContent.join(' '), normalMode); 
      break;
    default:
// These are errors. Check what kind of error first. If 
// tk_filter has a variant like tk_filter:"WM Heartland"  
// OR "11340208 is WM Heartland", index+3 will have a 
// number. Check that now. 
// Load index+3 into a temporary string. Then, strip single
// quotes, double quotes and curly quotes from the token.
//
// VERSION 25 CHANGES BEGIN
// Check if there is a valid value at NGC3_list[index+3]
      if (NGC3_list[index+3]) {
// VERSION 25 CHANGES END
        tempToken = NGC3_list[index+3].replace(/["'“”‘’]/g, '');
      
// Now, if this is a variant, tempToken will have something
// like 11340208 is WM Heartland
// split at blank spaces and load to the array.
        finalToken = tempToken.split(' ');

// VERSION 25 CHANGES BEGIN
      }
// VERSION 25 CHANGES BEGIN
// Move to a constant for typecasting to avoid run-time
// errors in the next if.
      const numValue = Number(finalToken[0]);
      
// Check if numValue is an integer. If yes, we have a 
// variant.
      if (Number.isInteger(numValue)) {
         const errorString = NGC3_list[index] + ':' + filterType+ " " + NGC3_list[index+2] + " " + NGC3_list[index+3]; 
        
         Error_list.push(tk_filterC1Error, errorString);
        
// The return value this time will be 4.
         valCount = 4;
         populateTokenStream(index, 3);
      }
      
      else {
// This is an error, but not a variant.
         Error_list.push(tk_filterError, filterTypeNoQuotes);
         populateTokenStream(index, 1);
      }
      break;
  }
  
  return (valCount);
}

function TK_Custom_Processing(index) {
// Process custom filters based on the type
  const filterType = NGC3_list[index + 1];
 
// This is used for the error messages in DIV
  let filterTypeWithQuotes;
  
  populateDiv(filterTypeWithQuotes, 'Error');
  
// Strip single quotes, double quotes and curly quotes
  const filterTypeNoQuotes = filterType.replace(/["'“”‘’]/g, '');
  
// Initialize the value of the return variable.
// This will usually be 2. 1 for tk_custom and 1 for the
// filter. But if the filter is "Keywords", there are 2
// extra values that appear after that. Then, tk_custom looks 
// like this:
// tk_custom:'Keywords' OR "3655606 = Keywords"
// There are a few more anomalies:
// tk_custom:'WM Phoenix Open'" OR "820742 = WM Phoenix 
// Open"  
// tk_custom:"WM | Regional Business Units" OR "5615525 = 
// WM | Regional Business Units"  
// All these should be flagged as errors.
  let valCount = 2;
  
// Initialize array that will hold the values, in the check for a
// variant.
  let finalToken = [];
  
  switch (filterTypeNoQuotes) {
// VERSION 24 CHANGES BEGIN
//    case 'Obituaries Filter':
    case obituariesFilterValue:
// VERSION 24 CHANGES END
      populateDiv(obituariesContent.join(' '), normalMode); 
      break;
// VERSION 24 CHANGES BEGIN
//    case 'Sports Filter': 
    case sportsFilterValue:
// VERSION 24 CHANGES END
      populateDiv(sportsContent.join(' '), normalMode);  
      break;
// VERSION 24 CHANGES BEGIN
//    case 'Keywords:':
//    case 'Keywords':
    case keywordsValue:
// VERSION 24 CHANGES END
    default:
// These are errors. Check what kind of error first. if index+3 
// has a number, we have a variant.
      
// Load index+3 into a temporary string. Then, strip single
// quotes, double quotes and curly quotes from the token.
//
// VERSION 25 CHANGES BEGIN
// Check if there is a valid value at NGC3_list[index+3]
       if (NGC3_list[index+3]) {
// VERSION 25 CHANGES END
          tempToken = NGC3_list[index+3].replace(/["'“”‘’]/g, '');
      
// split at blank spaces and load to the array.
          finalToken = tempToken.split(' ');
// VERSION 25 CHANGES BEGIN
       }
// VERSION 25 CHANGES BEGIN
// Move to a constant for typecasting to avoud run-time errors
       const numValue = Number(finalToken[0]);
      
// Check if numValue is an integer
      if (Number.isInteger(numValue)) {
         const errorString = NGC3_list[index] + ':' + filterType+ " " + NGC3_list[index+2] + " " + NGC3_list[index+3]; 
         Error_list.push(tk_customC1Error + errorString);
        
// The return value this time will be 4.
         valCount = 4;
// Push the erroneous keywords to the output and flag it as an
// error.
         populateTokenStream(index, 3);
      }
      
      else {
// There was no variant. Just a single token after tk_custom, 
// but that's an unrecognized token.
         Error_list.push(tk_customError + filterTypeNoQuotes);

// Push the erroneous keywords to the output and flag it as an
// error.
         populateTokenStream(index, 1);
      }
      break;
  }
  return (valCount);
}

function displayErrorList() {
// Display the final error list. At this point, Error_list
// has a list of all corrections needed.

  const dateTimePrefix = 'Current Date and Time:';
  const versionPrefix = " Program Version: ";
  
// At this point, check if there's any parenthesis left in 
// the stack
  if (stack.length !== 0) {
    Error_list.push(parenthesisError);
  }
  
// Join the list's contents into a single string with a 
// space as separator. Join with a comma for clear separation
    const errorString = Error_list.join(', ');  
  
// Display the current date and time in the error window
  let now = new Date();  // Create a new Date object that represents the current time
  let dateString = now.toLocaleDateString();  // Format the date
  let timeString = now.toLocaleTimeString();  // Format the time
  let dateTimeString = dateTimePrefix + dateString + " " + timeString

// VERSION 25 CHANGES BEGIN
// Contents are getting overwritten. Try something new.
//  select('#errorArea').value(dateTimeString);
// VERSION 25 CHANGES END

// Display the current version of the program
  let programName = h1PageHeading + versionPrefix + h5PageHeading;
  
// VERSION 25 CHANGES BEGIN
// Contents are getting overwritten. Try something new.
//  select('#errorArea').value(programName);
    consolidatedString = dateTimeString + '\n' + programName + '\n';
// VERSION 25 CHANGES END
  
// VERSION 26 CHANGES BEGIN
// Add a hard return
  consolidatedString = consolidatedString + '\n';
// VERSION 26 CHANGES END

// See if there were any errors
  if (errorString === "") {
// VERSION 25 CHANGES BEGIN
//    select('#errorArea').value(noErrors);
    consolidatedString = consolidatedString + noErrors;
// VERSION 25 CHANGES END
  } 
  else {
// VERSION 25 CHANGES BEGIN
//    select('#errorArea').value(errorString);
    consolidatedString = consolidatedString + errorString;
  }
  
  select('#errorArea').value(consolidatedString);
// VERSION 25 CHANGES END
}

 function wordTokenProcessing(index) {
// Directly add word tokens to DIV area. No further processing
// needed
 populateDiv(NGC3_list[index], normalMode);
 }

function hyphenWordProcessing(token, index, mode) {
// If the current token and the token after the hyphen are
// not numbers, string these 3 as a word, then skip the
// processing of all 3 tokens.
//
  const hyphenToken = NGC3_list[index+1];
  const nextNextToken = NGC3_list[index+2];
  
// VERSION 24 CHANGES - COMPLETE REWRITE - BEGIN
// FOR OLDER VERSION OF THE CODE, REFER ARCHIVES
// This will hold the collective value of the 3 tokens
  let consolidatedToken;
  
  if (isNaN(parseInt(token)) || isNaN(parseInt(nextNextToken))) {
// Check if we're parsing. If yes, we should construct
// the string and populate the output list. If we're
// merely checking, we don't have to populate the DIV area.

    if (mode === parseMode) {
// String the 3 tokens together and embed it in double
// quotes
    consolidatedToken = '"' + token + hyphenToken + nextNextToken + '"';
      
// Push it into the output list
    populateDiv(consolidatedToken, normalMode);
    }
  }
  
  else {
    
// This is a possible range. String it together and push it to the
// output. Flag it as an error.
    consolidatedToken = token + hyphenToken + nextNextToken;
    
    if (mode === parseMode) {
// Push it into the output list
      populateDiv(consolidatedToken, errorMode);
      }
// Flag an error
      Error_list.push(strayRangeError + consolidatedToken);
  }
// VERSION 24 CHANGES - COMPLETE REWRITE - END
}

function checkSyntax() {
// This function is called when the "Check Query" button is 
// pressed.
// Loop for all the elements in the list NGC3_list.
  let NGC3_counter = 0

// To hold the return value from the function 
// checkTokenStream
  let valueCount = 0;
  
// For checkTKCustom and checkTKFilter
  let valCount = 0;
  
  while (NGC3_counter < NGC3_list.length) {
    
    const currentToken = NGC3_list[NGC3_counter];
    const nextToken = NGC3_list[NGC3_counter+1];
 
// Handling tokens that are words enclosed in double quotes, single
// quotes, single curly or double curly quotes.
// Skip all such words. No checking needed.
// VERSION 25 CHANGES BEGIN
//    if (currentToken.startsWith('"') && //currentToken.endsWith('"'))     {
    if 
      ((currentToken.startsWith('"') && currentToken.endsWith('"')) ||
       (currentToken.startsWith("'") && currentToken.endsWith("'")) || 
       (currentToken.startsWith('‘') && currentToken.endsWith('’')) ||
      (currentToken.startsWith('“') && currentToken.endsWith('”')))     {
// VERSION 25 CHANGES END
      NGC3_counter++;
      continue; // Skip to the next token
    }

// VERSION 25 CHANGES BEGIN    
//    if (NGC3_list[NGC3_counter+1] === '-') {
    if (NGC3_list[NGC3_counter+1] === hyphenToken) {
// VERSION 25 CHANGES END
// If the current token and the token after the hyphen are
// not numbers, string these 3 as a word, then skip the
// processing of all 3 tokens. 
//
// This function has 2 modes: Parse and Check. In the 
// Parse mode, it will also write to the output list.
//
// VERSION 24 CHANGES BEGIN
//        numericOrString = hyphenWordProcessing(currentToken, //NGC3_counter, "Check");
        hyphenWordProcessing(currentToken, NGC3_counter, checkMode);
//        if (numericOrString === "String") {
           NGC3_counter+=2;
        continue;
//        }
// VERSION 24 CHANGES END
    }

    switch (currentToken) {
// VERSION 25 CHANGES BEGIN
//      case '(':
//      case ')':
      case leftParenthesisValue:
      case rightParenthesisValue:
// VERSION 25 CHANGES END
// Check if the parenthesis match
        checkParenthesis(currentToken,NGC3_counter);
        break;
// VERSION 25 CHANGES BEGIN
//      case 'or':
//      case 'and':
//      case 'not':
//      case 'OR':
//      case 'AND':
      case 'NOT':
      case orToken:
      case andToken:
      case notToken:
      case ORToken:
      case ANDToken:
      case NOTToken:
//        if (['or','and','not'].includes(currentToken)) {
        if ([orToken,andToken,notToken].includes(currentToken)) {
// VERSION 25 CHANGES END 
// These should be in uppercase
          Error_list.push(booleanLowercaseError + NGC3_counter);
        }
// Check if there's a valid token after these. Otherwise
// its an error.
        checkNextToken(currentToken, NGC3_counter);
// Not adding 1 to NGC3_counter here, since we need to
// parse the next token
        break;
// VERSION 25 CHANGES BEGIN 
//      case '~':
      case tildeToken:
// VERSION 25 CHANGES END 
        checkTilde(NGC3_counter);
        NGC3_counter++;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'tk_filter':
//      case 'tk_filter:':
//      case 'filter:':
//      case 'filter':
      case tk_filterToken:
      case filterToken:
// VERSION 24 CHANGES END
// Check if the next token is valid
// tk_filter and filter are considered synonyms.
// valCount is usually 1. If variants like tk_filter:"WM Heartland
// | Exclusions"  OR "11340208 is WM  Heartland | Exclusions"  are
// encountered, it will be 3.
        valCount = checkTKFilter(nextToken, NGC3_counter);
        NGC3_counter=NGC3_counter+valCount;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'tk_custom':
//      case 'tk_custom:':
      case tk_customToken:
// VERSION 24 CHANGES END
// Check if the next token is valid. 
// valCount is usually 1. if tk_custom:"Keywords" or variants like
// tk_custom:'WM Phoenix Open'" OR "820742 = WM Phoenix Open" are
// encountered, it will be 3.
        valCount = checkTKCustom(nextToken, NGC3_counter);
        NGC3_counter=NGC3_counter+valCount;
        break;
// VERSION 24 CHANGES BEGIN
// broadcast_mediatype_l will also be converted to medium
// but it has an additional token of 1 or 2.
// Even though medium: is an error in NGC3, let us process
// the values after that in the input stream.It will be flagged as
// an error too.
//      case 'mediatype':
//      case 'mediatype:':
//      case 'medium':
//      case 'medium:':
//      case 'broadcast_mediatype_l':
//      case 'broadcast_mediatype_l:'
      case mediatypeToken:
      case mediumToken:
      case broadcast_mediatype_lToken:
//        if (currentToken === 'medium') {
        if (currentToken === mediumToken) {
// VERSION 24 CHANGES END
// mediatype is the correct keyword for NGC3
          Error_list.push(mediatypeMediumError, NGC3_counter);
        }
// Check if the next token is valid. Sometimes, there could be
// multiple values of mediatype enclosed in parenthesis.
        valCount = checkMediatype(nextToken,NGC3_counter+1);
        NGC3_counter = NGC3_counter+valCount;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'tk_language':
//      case 'tk_language:':
//      case 'language':
//      case 'language:':
//      case 'lang':
//      case 'lang:':
      case tk_languageToken:
      case languageToken:
      case langToken:
// VERSION 24 CHANGES END
        checkTKLanguage(nextToken);
        NGC3_counter++;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'tk_location':
//      case 'location':
//      case 'country':
//      case 'state':
//      case 'city':
//      case 'sourcelocationcountry':
//      case 'sourcelocationstate':
//      case 'tk_location:':
//      case 'location:':
//      case 'country:':
//      case 'state:':
//      case 'city:':
//      case 'sourcelocationcountry:':
//      case 'sourcelocationstate:':
      case tk_locationToken:
      case locationToken:
      case countryToken:
      case cityToken:
      case stateToken:
      case sourcelocationcountryToken:
      case sourcelocationstateToken:
// VERSION 24 CHANGES END
// Expecting 1 or several values in parenthesis after
// these tokens
        valueCount = checkTokenStream(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
// VERSION 24 CHANGE BEGINS        
//      case 'impact':
//      case 'impact:':
      case impactToken:
// VERSION 24 CHANGE ENDS        
        checkImpact(nextToken);
        NGC3_counter++;
        break;
// VERSION 24 CHANGE BEGINS
//      case 'seo':
//      case 'seo:':
      case seoToken:
// VERSION 24 CHANGE ENDS
        checkSEO(nextToken);
        NGC3_counter++;
        break;
// VERSION 24 CHANGE BEGINS
//      case 'sentiment':
//      case 'sentiment:':
      case sentimentToken:
// VERSION 24 CHANGE ENDS
        checkSentiment(nextToken);
        NGC3_counter++;
        break;
// VERSION 24 CHANGE BEGINS
//      case 'seo_impact':
//      case 'seo_impact:':
//      case 'tk_readership':
//      case 'tk_readership:':
      case seoImpactToken:
      case tkReadershipToken:
// VERSION 24 CHANGE ENDS
// At NGC3_counter: seo_impact or tk_readership
// NGC3_counter+1: [ (opening square bracket)
// NGC3_counter+ 2: low number for the range
// NGC3_counter+3: TO 
// NGC3_counter+4: high number of the range
// NGC3_counter+5: ] (closing square bracket)
        checkRange(currentToken, NGC3_counter);
        NGC3_counter+=5;
        break;
// VERSION 24 CHANGE BEGINS
//      case 'title:':
//      case 'title':
//      case 'headline':
//      case 'headline:':
//      case 'seq_id':
//      case 'seq_id:':
//      case 'article_id:':
//      case 'article_id':
//      case 'data_source_s:':
//      case 'data_source_s':
//      case 'tag:':
//      case 'tag':
//      case 'url_path_sections':
//      case 'url_path_sections:':
      case titleToken:
      case headlineToken:
      case seqIdToken:
      case articleIdToken:
      case dataSourceToken:
      case tagToken:
      case url_path_sectionsToken:
// VERSION 24 CHANGE ENDS
// Expecting 1 or several values in parenthesis after
// these tokens
        valueCount = checkTokenStream(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
// tk_company handled differently, since it may have multiple
// values
// VERSION 24 CHANGES BEGIN
//      case 'tk_company':
//      case 'tk_company:':
      case tk_companyToken:
// VERSION 24 CHANGES END
        valueCount = checkTKCompany(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'publisher':
//      case 'publisher:':
//      case 'author':
//      case 'author:':
      case publisherToken:
      case authorToken:
// VERSION 24 CHANGES END
        checkNextToken(currentToken, NGC3_counter);
        NGC3_counter++;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'text':
//      case 'text:':
//      case 'text.case_sensitive':
//      case 'text.case_sensitive:':
      case textToken:
      case textcase_sensitiveToken:
// VERSION 24 CHANGES END
// Even though text.case_sensitive: is an error in NGC3,
// let us process the values after that in the input 
// stream. The keyword will be flagged as an error first.
// 
// VERSION 24 CHANGES BEGIN
//        if (currentToken === 'text.case_sensitive') {
        if (currentToken === textcase_sensitiveToken) {
// VERSION 24 CHANGES END
// text is the correct keyword for NGC3
          Error_list.push(textCaseSensitiveError);
        }
// Expecting 1 or several values in parenthesis after
// these tokens
        valueCount = checkTokenStream(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'frequent_terms':
//      case 'frequent_terms:':
      case frequent_termsToken:
// VERSION 24 CHANGES END
// Expecting 1 or several values in parenthesis after
// these tokens
        valueCount = checkTokenStream(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'search_id':
//      case 'search_id:':
      case searchIdToken:
// VERSION 24 CHANGES END
        checkNextToken(currentToken, NGC3_counter);
        NGC3_counter++;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'url_direct':
//      case 'url_direct:':
      case url_directToken:
// VERSION 24 CHANGES END
// Check if this is a valid URL
        checkURL(currentToken, NGC3_counter);
        NGC3_counter++;
        break;
// VERSION 24 CHANGES BEGIN
//      case 'site_urls_ll':
//      case 'site_urls_ll:':
//      case 'url':
//      case 'url:':
      case site_urls_llToken:
      case urlToken:
// VERSION 24 CHANGES ENurlTokenD
// Even though url: is an error in NGC3, let us process
// the values after that in the input stream.The keyword
// will be flagged as an error first.
// VERSION 24 CHANGES BEGIN
//        if (currentToken === 'url') {
        if (currentToken === urlToken) {
// VERSION 24 CHANGES END
// site_urls_ll is the correct keyword for NGC3
          Error_list.push(urlTokenError);
        }
// Check if this is a valid URL, but add https:// first.
// Expecting 1 URL - or more URLs enclosed in parenthesis.
        valueCount = checkDomainStream(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
      default:
// This is not a known token. This could still be valid,
// since websites and single word searches may not be
// enclosed in quotes. Check if this is such a case. 
// Otherwise, its an error.
        checkSingleWord(NGC3_counter);
        break;
    }
// Go to the next token
    NGC3_counter++
  }
}

function checkParenthesis(token, index) {
// Push the position of every '(' into the stack.Whenever 
// a ')' is encountered, pop from the stack.
// If the stack is empty
// at the end of processing, all the parenthesis are 
// matched.
//
    if (token === leftParenthesisValue) {
      stack.push(index);
    } 
    else if (token === rightParenthesisValue) {
// If a ')' is encountered when the stack length is 0,
// its an error. 
      if (stack.length === 0) {
        Error_list.push(unmatchedRightParenthesisError + index);
      } 
      else {
        stack.pop();
      }
    }
}

function checkNextToken(token, index) {
// Check if there's a valid token after these. Otherwise
// its an error.
  
  const nextToken = NGC3_list[index+1];

  if (!nextToken) {
    Error_list.push(missingValueError + token);
  }
}

function checkTokenStream(token, index) {
// Check if there's a valid token after the current token. 
// Otherwise its an error. Also, instead of a single value, there
// could be multiple values separated by NOT AND or OR provided
// within parenthesis.
  
  let nextToken = NGC3_list[index+1];
  
// This is the number of tokens after the current token. 
  let valueCount = 0;
  
  if (!nextToken) {
    Error_list.push(missingValueError + token);
  }
  
// If the next token is a parenthesis, see how many values
// are provided.
  
// VERSION 24 CHANGES BEGIN
//  if (nextToken === '(') {
  if (nextToken === leftParenthesisValue) {
// VERSION 24 CHANGES END
// Push the position in the stack
    stack.push(index);
    
// VERSION 24 CHANGES BEGIN
//    while (nextToken !== ')') {
    while (nextToken !== rightParenthesisValue) {
// VERSION 24 CHANGES END
      valueCount++;
      index++;
      nextToken = NGC3_list[index];
    }
    
// Check if a right parenthesis was found. If yes, pop
// the stack.
// VERSION 24 CHANGES BEGIN
//    if (nextToken === ')') {
    if (nextToken === rightParenthesisValue) {
// VERSION 24 CHANGES END
      stack.pop();
    }
  }
  else {
// At least 1 value was found
    valueCount++;
  }
//
// These many values were found after the keyword
//
  return(valueCount);
}

function checkTilde(index) {
// At the position index is the ~
// Before the tilde, there should be a phrase in double
// quotes with at least 2 words. After the tilde should be 
// a positive whole number.
//
  const wordToken = NGC3_list[index-1];
  const numberToken = parseInt(NGC3_list[index+1]);

// Split the string at each space
  let words = wordToken.split(' ');  

  if (words.length >= 2) {
// No action needed
  }
  
  else {
// This means there were < 2 words before the ~
     Error_list.push(tooFewTildeWordsError);
  }
  
  if (!Number.isInteger(numberToken)) {
// This means there wasn't a whole number after the ~
// Flag an error.
     Error_list.push(tildeNaNError);
  }
  
}

function checkTKFilter(token, index) {  
// This function checks if approved filters are used
// Strip all quotes from the token
// Treating tk_filter and filter as synonyms.

// Strip single quotes, double quotes and curly quotes 
  let strippedToken = token.replace(/["'“”‘’]/g, '');

// This will hold the final token after tk_filter.
  let finalToken = [];
  
// The default number of tokens after tk_filter is 1.
    let valueCount = 1;
  
// This differs when vafriants like tk_filter:"WM Heartland |
// Exclusions"  OR "11340208 is WM Heartland | Exclusions"  are 
// encountered.
  
// First check if known, standard filters are used.

// VERSION 24 CHANGES BEGIN
//if (!['Master Exclusive','Deals & Coupons', 'Earnings & Stock //News', 'Job Postings', 'Market Research Reports', 'TV Shows', //'Press Release', 'Top Tier Readership'].includes(strippedToken)) //{
if (![masterExclusiveValue, dealsCouponsValue, earningsStockNewsValue, jobPostingsValue, marketResearchReportsValue, tvShowsValue, pressReleaseValue, topTierReadershipValue].includes(strippedToken)) {
// VERSION 24 CHANGES END
  
// Find out if this is a variant of this kind:
// tk_filter:"WM Heartland"  OR "11340208 is WM Heartland"
// For such variants, index+3 has a number. We need to do this
// because we should find out how many tokens to skip.
  
// Load index+3 into a temporary string. Then, strip single
// quotes, double quotes and curly quotes from the token.
// Now tempToken will have something like 11340208 is WM Heartland.
// Note that the above is an example syntax.
//
// VERSION 25 CHANGES BEGIN
// Check if there is a valid value at NGC3_list[index+3]
  if (NGC3_list[index+3]) {
// VERSION 25 CHANGES END
     tempToken = NGC3_list[index+3].replace(/["'“”‘’]/g, '');
  
// split at blank spaces and load to the array.
     finalToken = tempToken.split(' ');
// VERSION 25 CHANGES BEGIN
  }
// VERSION 25 CHANGES BEGIN
  
// Now finalToken[0] will have the number, if this is a variant.
// Move to a constant for typecasting to avoid run-time errors.
  const numValue = Number(finalToken[0]);
  
// Find out if finalToken[0] is a number. 
  if (Number.isInteger(numValue)) {
    
// Form the full value that tk_filter has.
     const errorString = NGC3_list[index] + ':' + token+ " " + NGC3_list[index+2] + " " + NGC3_list[index+3]; 
    
     Error_list.push(tk_filterC1Error, errorString);
// This is the number of tokens to skip in checkSyntax.
     valueCount = 3;
  }
  else {
    Error_list.push(tk_filterError, token);
  }
}
  
// Return the numer of tokens found after tk_filter.
  return(valueCount);
}

function checkTKCustom(token, index) {
// This function checks if approved filters are used
  
// Strip single quotes, double quotes and curly quotes 
let strippedToken = token.replace(/["'“”‘’]/g, '');

// This will hold the final token for the supposed variant.
  let finalToken = [];
  
// This is the default number of tokens after tk_custom.
// This differs when tk_custom:"Keywords" is encountered. And
// when instances like tk_custom:"WM Phoenix Open'" OR 
// "820742 = WM Phoenix Open" are encountered.

let valueCount = 1;
  
// VERSION 24 CHANGES BEGIN
// if (!["Sports Filter","Real Estate Listings","Obituaries 
// Filter", "Keywords"].includes(strippedToken)) {
  if (![sportsFilterValue,realEstateListingsValue,obituariesFilterValue, keywordsValue].includes(strippedToken)) {
// VERSION 24 CHANGES END
  
// If this is a variant, index+3 will be a number. 
// Load index+3 into a temporary string. Then, strip single
// quotes, double quotes and curly quotes from the token.
// VERSION 25 CHANGES BEGIN
// Check if there is a valid value at NGC3_list[index+3]
  if (NGC3_list[index+3]) {
// VERSION 25 CHANGES END
     tempToken = NGC3_list[index+3].replace(/["'“”‘’]/g, '');
  
// split at blank spaces and load to the array.
     finalToken = tempToken.split(' ');
  
// VERSION 25 CHANGES BEGIN
  }
// VERSION 25 CHANGES BEGIN
// Move to a constant for typecasting to avoid run-time errors.
  const numValue = Number(finalToken[0]);
  
// Find out if finalToken[0] is a number. 
  if (Number.isInteger(numValue)) {
     const errorString = NGC3_list[index] + ':' + token+ " " + NGC3_list[index+2] + " " + NGC3_list[index+3]; 
     Error_list.push(tk_customC1Error + errorString);
     valueCount = 3;
  }
  else {
    Error_list.push(tk_customError + token);
  }
}

// Return the numer of tokens found after tk_custom.
  return(valueCount);
}

function checkMediatype(token, index) {
  
// This function checks if approved mediatypes are used.
// This is 1 of the functions called when the "Check Query" button
// is pressed.
  
// token points to the mediatype. It could also point to a (,
// if multiple mediatypes are mentioned together.
  
// Strip single quotes, double quotes and curly quotes
  let strippedToken = token.replace(/["'“”‘’]/g, '');
  
// This is the default return value. This indicates how many
// tokens should be skipped.
  valCount = 1;
  
// There could be multiple values of mediatype, enclosed in 
// parenthesis. Check if this is an opening parenthesis.

   if (strippedToken === leftParenthesisValue) {
     valCount++;
     
// Take up the next token
    strippedToken = NGC3_list[index+1].replace(/["'“”‘’]/g, '');

// Check in a loop, till the ending parenthesis is found.
     while (strippedToken !== rightParenthesisValue) {
       
       checkMediaTypeToken();
       index++;
       valCount++;
       
// Take up the next token
       strippedToken = NGC3_list[index+1].replace(/["'“”‘’]/g, '');
     }
     
// Increment valCount for the ending parenthesis
     valCount++;
   }
  
   else {
// token is not a parenthesis. Check the mediatype.
     checkMediaTypeToken();
   }
  
// Return the appropriate value
  return(valCount);

// Define inline function. We are using an inline function because
// we want to access the variables of the main function. Also, this
// is not a generic function.
//
  function  checkMediaTypeToken() {

// 1 and 2 are values used by broadcast_mediatype_l.
//
   if (![NewsValue, BlogValue, BlogsValue, blogValue, blogsValue, PodcastValue, podcastValue, BroadcastValue, broadcastValue, number1, number2,NewsLicensedValue, BlogLicensedValue, blogLicensedValue, PrintLicensedValue, PrintValue].includes(strippedToken))    {
       Error_list.push(mediatypeError, token);
   }
 }
}

function checkTKLanguage(token) {
// This function checks if approved languages are used.
// This is 1 of the functions invoked when the "Check Query"
// button is pressed.
  
// At this point, token has the NGC3 language code used.
// Strip single quotes, double quotes and curly quotes 
  let strippedToken = token.replace(/["'“”‘’]/g, '');
 
// VERSION 24 CHANGES BEGIN
//  if (!["English",'French',"Spanish", "Greek", "Korean", //"Chinese", "Japanese", "German", "Italian", "Danish", 
// "Portuguese"].includes(strippedToken)) {
    
// The function readLanguageCodesCSV reads the CSV file
// that lists NGC3 and its C1 equivalent.
//
  C1_language = readLanguageCodesCSV(NGC3_languageNoQuotes);

// Check the output. If it is null, it is an unsupported
// language.
  
  if (!C1_language) {
    Error_list.push(languageCodeError, token);
// VERSION 24 CHANGES END
  }
}

function checkImpact(token) {
// This function check if correct impact codes are used

// Strip single quotes, double quotes and curly quotes 
  let strippedToken = token.replace(/["'“”‘’]/g, '');
  
// These are the right impact codes
  if (![highValue, HighValue, mediumValue, MediumValue, lowValue, LowValue].includes(strippedToken)) {
    
// Push error message
    Error_list.push(impactCodeError + token);
  }
 }
  
function checkSEO(token) {
// This function checks if correct SEO codes are used
  
// Strip single quotes, double quotes and curly quotes 
  let strippedToken = token.replace(/["'“”‘’]/g, '');
  
// Check if valid values for seo: were used.
  if (![excellentValue, ExcellentValue, strongValue, StrongValue, goodValue, GoodValue, averageValue, AverageValue, lowValue, LowValue].includes(strippedToken)) {
    Error_list.push(seoCodeError + token);
  }
 }
  
function checkSentiment(token) {
// This function check if correct sentiment codes are used
// This is called by checkSyntax.
  
// token has the value next to the sentiment: keyword.
// Strip single quotes, double quotes and curly quotes 
  let strippedToken = token.replace(/["'“”‘’]/g, '');

// Check if a valid value is used for the sentiment: keyword.
  if (![positiveValue,neutralValue, negativeValue].includes(strippedToken)) {
    Error_list.push(sentimentCodeError + token);
  }
 }
  
function checkRange(token, index) {
// This function will check if a range is given for 
// seo_impact and readership. At position index+2 will be 
// the - (hyphen) symbol.
// At index: seo_impact or tk_readership
// index+1: [ (opening square bracket)
// index+ 2: low number for the range
// index+3: TO
// index+4: high number of the range
// index+5: ] (closing square bracket)
//
  const lowNumber = NGC3_list[index+2];
  const highNumber = NGC3_list[index+4];
  const rangeWord = NGC3_list[index+3];
  
// Check if both are integers. Otherwise, issue an error.
  if (/^\d+$/.test(lowNumber.trim()) && /^\d+$/.test(highNumber.trim())) {
    
// Both are integers. Check if highNumber > lowNumber.
    if (highNumber > lowNumber) {
// Check if the word TO is between them.
      if (rangeWord.toUpperCase() !== 'TO') {
         Error_list.push(rangeFormatError + token);
      }
    }
    
    else {
      Error_list.push(rangeError + token);
    }
  }
  else {
    Error_list.push(nonNumericRangeError + token);
  }
 }

function checkURL(token, index) {
// This function checks if valid URLs have been provided for
// url_direct and site_urls_ll.
  const urlString = NGC3_list[index+1];
  
// Strip single quotes, double quotes and curly quotes 
  let strippedToken = urlString.replace(/["'“”‘’]/g, '');
  
// Using the try/catch pair to avoid run-time errors.
  try {
    result = new URL(strippedToken);
  } 
  catch(e) {
    result = false;
  }
    
  
  if (!result) {
    Error_list.push(url_directError, urlString);
  }
}

function checkDomainStream(token, index) {
// Check if there's a valid token after these. Otherwise
// its an error.
// Also, instead of a single value, there could be 
// multiple values separated by NOT AND or OR,
// provided within parenthesis.
//
  let nextToken = NGC3_list[index+1];
  let valueCount = 0;
  
  if (!nextToken) {
    Error_list.push(missingValueError+ token);
  }
  
// If the next token is a parenthesis, see how many values
// are provided.
  
// VERSION 24 CHANGES BEGIN
//  if (nextToken === '(') {
  if (nextToken === leftParenthesisValue) {
// VERSION 24 CHANGES END
// Push the position in the stack
    stack.push(index);
    
// VERSION 24 CHANGES BEGIN
//    while (nextToken !== ')') {
    while (nextToken !== rightParenthesisValue) {
// VERSION 24 CHANGES END
      valueCount++;
      index++;
      nextToken = NGC3_list[index];
      checkDomain(nextToken);
    }
// Check if a right parenthesis was found. If yes, pop
// the stack.
// VERSION 24 CHANGES BEGIN
//    if (nextToken === ')') {
    if (nextToken === rightParenthesisValue) {
// VERSION 24 CHANGES END
      stack.pop();
    }
  }
  else {
// At least 1 value was found
    checkDomain(nextToken);
    valueCount++;
  }
//
// These many values were found after the keyword
//
  return(valueCount);
}

function checkDomain(token) {
// Check if the domain exists. But first, prefix it with
// https:// and stripping the quotes
  const urlString = token;

// This is the prefix for the URL.
  const urlPrefix = 'https://';
  
// Strip single quotes, double quotes and curly quotes 
  let strippedToken = urlString.replace(/["'“”‘’]/g, '');
  
// VERSION 25 CHANGES BEGIN
// Proceed only when the token is not a parenthesis or a boolean
// keword
  if (![leftParenthesisValue, rightParenthesisValue, ORToken, orToken, ANDToken, andToken, NOTToken, notToken].includes(strippedToken)) {
//     const secureURL = "https://".concat(strippedToken);
     const secureURL = urlPrefix.concat(strippedToken);
// VERSION 25 CHANGES END
  
     try {
// VERSION 25 CHANGES BEGIN
//       result = new URL(strippedToken);
       result = new URL(secureURL);
// VERSION 25 CHANGES END
     } 
     catch(e) {
       result = false;
     }
  
     if (!result) {
       Error_list.push(invalidURLError + token + ":" + urlString);
     }
// VERSION 25 CHANGES BEGIN
  }
// VERSION 25 CHANGES END
}

function singleWordProcessing(index) {
// This function is called when a word not enclosed in 
// quotes is encountered. This word is not one of the
// NGC3 keywords either. This is either an error or a 
// word that should be enlosed in couble quotes and 
// pushed into the output list.
  
  currentToken = NGC3_list[index];
// Let us check if the previous token and the next token
// are boolean keywords; Or they can be an opening or a 
// closing parenthesis; Or this is the last word in the
// query. Sometimes this can be the only word in the query.
// In all these cases, declare this a valid word, enclose it in
// double quotes and push it to DIV area.
//
  prevToken = NGC3_list[index-1];
// If this is the first word, prevToken will be undefined.
// Assign null to it.
//
  if (prevToken === undefined) {
    prevToken = "";
  }
  
  nextToken = NGC3_list[index+1];
// If this is the last word, nextToken will be undefined.
// Assign null to it.
//
  if (nextToken === undefined) {
    nextToken = "";
  }
  
// VERSION 24 CHANGES BEGIN
//  switch (prevToken, nextToken) {
  switch (prevToken.toUpperCase(), nextToken.toUpperCase()) {
//    case '(', ')':
//    case '(', 'NOT':
//    case '(', 'AND':
//    case '(', 'OR':
//    case 'NOT', ')':
//    case 'AND', ')':
//    case 'OR', ')':
//    case "", "":
//    case "", 'NOT':
//    case "", 'AND':
//    case "", 'OR':
//    case 'NOT', "":
//    case 'AND', "":
//    case 'OR', "":
    case leftParenthesisValue, rightParenthesisValue:
    case leftParenthesisValue, NOTToken:
    case leftParenthesisValue, ANDToken:
    case leftParenthesisValue, ORToken:
    case NOTToken, rightParenthesisValue:
    case ANDToken, rightParenthesisValue:
    case ORToken, rightParenthesisValue:
    case "", "":
    case "", NOTToken:
    case "", ANDToken:
    case "", ORToken:
    case NOTToken, "":
    case ANDToken, "":
    case ORToken, "":
// VERSION 24 CHANGES END 
      let quotedToken = "\"" + currentToken + "\"";  // Escaping double quotes
      populateDiv(quotedToken, normalMode);
      break;
    default:
// VERSION 25 CHANGES BEGIN
// We must push the wrong token to the output, and pad it with a 
// space.
      populateDiv(currentToken+' ', errorMode);
// VERSION 25 CHANGES END
      Error_list.push(unknownTokenError + currentToken);
      break;
  }
}

function checkSingleWord(index) {
// This function is called when a word not enclosed in 
// quotes is encountered. This word is not one of the
// NGC3 keywords either. This is either an error or an 
// acceptable word.
  
  currentToken = NGC3_list[index];
// Let us check if the previous token and the next token
// are boolean keywords; Or they can be an opening or a 
// closing parenthesis; Or this is the last word in the
// query. In all these cases, declare this a valid word.
//
  prevToken = NGC3_list[index-1];
// If this is the first word, prevToken will be undefined.
// Assign null to it.
//
  if (prevToken === undefined) {
    prevToken = "";
  }
  
  nextToken = NGC3_list[index+1];
// If this is the last word, nextToken will be undefined.
// Assign null to it.
//
  if (nextToken === undefined) {
    nextToken = "";
  }
  
  switch (prevToken.toUpperCase(), nextToken.toUpperCase()) {
// VERSION 24 CHANGES BEGIN
//    case '(', ')':
//    case '(', 'NOT':
//    case '(', 'AND':
//    case '(', 'OR':
//    case 'NOT', ')':
//    case 'AND', ')':
//    case 'OR', ')':
//    case "", "":
//    case "", 'NOT':
//    case "", 'AND':
//    case "", 'OR':
//    case 'NOT', "":
//    case 'AND', "":
//    case 'OR', "":
    case leftParenthesisValue, rightParenthesisValue:
    case leftParenthesisValue, NOTToken:
    case leftParenthesisValue, ANDToken:
    case leftParenthesisValue, ORToken:
    case NOTToken, rightParenthesisValue:
    case ANDToken, rightParenthesisValue:
    case ORToken, rightParenthesisValue:
    case "", "":
    case "", NOTToken:
    case "", ANDToken:
    case "", ORToken:
    case NOTToken, "":
    case ANDToken, "":
    case ORToken, "":
// VERSION 24 CHANGES END
// Do nothing
      break;
    default:
      Error_list.push(unknownTokenError + currentToken);
      break;
  }
}

// This function is for debugging. Mainly for string
// comparisons. 
// How to use this function:
// let diff = compareStrings(str1, str2);
// console.log("Differences: ", diff);
//
function compareStrings(a, b) {
  let maxLength = max(a.length, b.length);
  let differences = [];
  
  for (let i = 0; i < maxLength; i++) {
    if (a[i] !== b[i]) {
      differences.push(`Difference at position ${i}: ${a[i]} vs ${b[i]}`);
    }
  }
  
  return differences;
}

function populateDiv(printText, mode) {
// This function will add text to the output DIV area.
// Items needing attention will be in a different color.
  
  const wildcardStar = '*';
  const wildcardQmark = '?';
  let normalColor = 'black';
  let errorColor = 'red';
// VERSION 29 CHANGES BEGIN
  let highlightColor = 'cyan';
// VERSION 29 CHANGES END
  let tempArray = [];
  
  if (printText === undefined || printText === null) {
// Do nothing
  }
  
  else {
// Check if the token has a wildcard
      if (printText.includes(wildcardStar)) {
// Wildcard found, signal error.
        mode = errorMode;
        
// VERSION 29 CHANGES BEGIN
// The following code has been commented out on VERSION 29
// Quick and dirty fix: Market Research Reports has 1 token
// with a star. Makes no sense to tag entire content of that
// tk_filter in red in the output area. Also makes no sense
// to tag the entire content of that tk_filter as an error
// in the error area.
        
// Check if the flag marketResearchReportsFlag is set to
// true. This means the current token is Market Research
// Reports.
//
//        if (marketResearchReportsFlag) {
// Turn the flag to false, the tk_filter has been handled.
//          marketResearchReportsFlag = false;

// Tokenize the contents of the current token into array
// elements.
//          tempArray = tokenize(printText);

// Find the element in the array that contains '*'
//          let elementWithAsterisk = tempArray.find(element => element.includes('*'));
          
// Find the index of the element with '*'
//          let index = tempArray.indexOf(elementWithAsterisk);

// Indicate that a wildcard was encountered in the narket
// research reports filter.       
//          Error_list.push(wildcardStarMRRError + elementWithAsterisk);
//        }
//        else {
// No special processing needed if that tk_filter was not 
// encountered
           Error_list.push(wildcardStarError + printText);
//        }
// VERSION 29 CHANGES END
      }
  
// Check if wildcard ? is present
      if (printText.includes(wildcardQmark)) {
// Wildcard found, signal error.
        mode = errorMode;
        Error_list.push(wildcardQmarkError+ printText);
      }
    
// Declare variable for printing
     let spacedText;

// Note that spaceNeeded is a global variable. Its initial 
// value is set to false. Space will ve printed only for
// boolean operators and UNLESS.
    if (printText !== ORToken && printText !== ANDToken && printText !== NOTToken && printText !== unlessToken) {
      spaceNeeded = false;
    }
    else {
      spaceNeeded = true;
    }

    if (spaceNeeded) {
      spacedText = " " + printText + " ";
      spaceNeeded = false;
    }
    else {
       spacedText = printText;
    }
    
    let span = createSpan(spacedText);
    let color = normalColor;
  
// VERSION 29 CHANGES BEGIN
    let highlight = 'highlight-none';
    
// Check if a highlight color was specified
    if (mode === highlightMode || mode === highlightErrMode) {
      highlight = highlightColor;
    }
// VERSION 29 CHANGES END
    
// If mode is normal, the default value of color
// will remain black.
// otherwise, the color will be red.
// VERSION 29 CHANGES BEGIN
//    if (mode === errorMode) {
// highlightErrMode = highlight + error
    if (mode === errorMode || mode === highlightErrMode) {
// VERSION 29 CHANGES END
       color = errorColor;
    }
    
    span.style('color', color);
// VERSION 29 CHANGES BEGIN
    span.style('background-color', highlight); 
// VERSION 29 CHANGES END
    span.parent(outputDiv);
  }
}

function populateTokenStream(index, valueCount) {
// This function is used to display unhandled tokens and 
// their values in red in the DIV area.
  
// Some tokens may have multiple values. If the
// token is not handled by C1, these tokens will be
// shown in red in the DIV area
//
   let loopCounter = 0;

// Push the token with a : first
   let token = NGC3_list[index+loopCounter]+ ':';
   populateDiv(token, errorMode);
   loopCounter++;

   while (loopCounter < valueCount+1) {
      populateDiv(NGC3_list[index+loopCounter], errorMode);
      loopCounter++;
   }
}

function findCommonWordsMaster(phrases) {
// To store common words between adjacent phrases
    let commonWords;  
    let commonWordsMatrix = [];
  
// To indicate which of the phrases have the common words and
// which do not.
    let commonFirstWordMatrix = [];  
    let commonFirstTwoWordsMatrix = [];  
    let commonFirstThreeWordsMatrix = [];  
    let commonLastWordMatrix = [];  
    let commonLastTwoWordsMatrix = [];  

// See if there are common words
  let results = findCommonWords(phrases);
  let commonFirstWord = results.mostCommonFirstWord;
  let commonFirstTwoWords = results.mostCommonFirstTwoWords;
  let commonFirstThreeWords = results.mostCommonFirstThreeWords;
  let commonLastWord = results.mostCommonLastWord;
  let commonLastTwoWords = results.mostCommonLastTwoWords;
  
  let loopIndex;

  let tempWord;
  
// If there's no common first word or a common last word, 
// there's no tilde storm.
  if (!commonFirstWord && !commonLastWord) {
// Do nothing. Nulls will be returned.
     }
  
  else {
// Go thru the phrases 1 by 1 to see if they have the common 
// first word
       loopIndex = 0;

       while (loopIndex < phrases.length) {
// Strip single quotes, double quotes and curly quotes 
          tempWord = phrases[loopIndex].replace(/["'“”‘’]/g, '');
         
          if (tempWord.startsWith(commonFirstWord)) {
            commonFirstWordMatrix[loopIndex] = 'Y'
          }
          else {
            commonFirstWordMatrix[loopIndex] = 'N'
          }
          loopIndex++;
       }
    
// Now see which entries have the common first 2 words
       loopIndex = 0;
    
       while (loopIndex < phrases.length) {
// Strip single quotes, double quotes and curly quotes          
          tempWord = phrases[loopIndex].replace(/["'“”‘’]/g, '');
         
          if (tempWord.startsWith(commonFirstTwoWords)) {
            commonFirstTwoWordsMatrix[loopIndex] = 'Y'
          }
          else {
            commonFirstTwoWordsMatrix[loopIndex] = 'N'
          }
          loopIndex++;
       }
  
// Now see which entries have the common first 3 words
       loopIndex = 0;
    
       while (loopIndex < phrases.length) {
// Strip single quotes, double quotes and curly quotes 
          tempWord = phrases[loopIndex].replace(/["'“”‘’]/g, '');
         
          if (tempWord.startsWith(commonFirstThreeWords) && commonFirstThreeWords !== "") {
            commonFirstThreeWordsMatrix[loopIndex] = 'Y'
          }
          else {
            commonFirstThreeWordsMatrix[loopIndex] = 'N'
          }
          loopIndex++;
       }
       
// Now see which entries have the common last word
       loopIndex = 0;
    
       while (loopIndex < phrases.length) {
// Strip single quotes, double quotes and curly quotes 
          tempWord = phrases[loopIndex].replace(/["'“”‘’]/g, '');
         
          if (tempWord.endsWith(commonLastWord) && commonLastWord!== "") {
            commonLastWordMatrix[loopIndex] = 'Y'
          }
          else {
            commonLastWordMatrix[loopIndex] = 'N'
          }
          loopIndex++;
       }
    
// Now see which entries have the common last 2 words
       loopIndex = 0;
    
       while (loopIndex < phrases.length) {
// Strip single quotes, double quotes and curly quotes 
          tempWord = phrases[loopIndex].replace(/["'“”‘’]/g, '');
         
          if (tempWord.endsWith(commonLastTwoWords) && commonLastTwoWords !== "") {
            commonLastTwoWordsMatrix[loopIndex] = 'Y'
          }
          else {
            commonLastTwoWordsMatrix[loopIndex] = 'N'
          }
          loopIndex++;
       }
     }

// We are at the end. Find out if commonFirstWordMatrix, 
// commonFirstTwoWordsMatrix and commonLastWordMatrix and 
// commonLastTwoWordsMatrix have the same number of Ys.
//
  if (commonFirstWord || commonLastWord) {
    const countFirstWord = countConsecutiveYs(commonFirstWordMatrix);
    const countFirstTwoWords = countConsecutiveYs(commonFirstTwoWordsMatrix);
        const countFirstThreeWords = countConsecutiveYs(commonFirstThreeWordsMatrix);
    const countLastWord = countConsecutiveYs(commonLastWordMatrix);
    const countLastTwoWords = countConsecutiveYs(commonLastTwoWordsMatrix);

// Send in whichever is bigger
    if (countFirstThreeWords >= countFirstWord && countFirstThreeWords >= countFirstTwoWords && countFirstThreeWords >= countLastWord && countFirstThreeWords >= countLastTwoWords && countFirstThreeWords > 0) {
      commonWords = commonFirstThreeWords;
      commonWordsMatrix = commonFirstThreeWordsMatrix;
    }
    else if (countFirstTwoWords >= countFirstThreeWords && countFirstTwoWords >= countFirstWord && countFirstTwoWords >= countLastWord && countFirstTwoWords >= countLastTwoWords && countFirstTwoWords > 0) {
      commonWords = commonFirstTwoWords;
      commonWordsMatrix = commonFirstTwoWordsMatrix;
    }
    else if (countFirstWord >= countFirstThreeWords && countFirstWord >= countFirstTwoWords && countFirstWord >= countLastWord && countFirstWord >= countLastTwoWords && countFirstWord > 0) {
      commonWords = commonFirstWord;
      commonWordsMatrix = commonFirstWordMatrix;
    }
    else if (countLastTwoWords >= countFirstWord && countLastTwoWords >= countFirstTwoWords && countLastTwoWords >= countFirstThreeWords && countLastTwoWords >= countLastWord && countLastTwoWords > 0) {
      commonWords = commonLastTwoWords;
      commonWordsMatrix = commonLastTwoWordsMatrix;
    }
    else if (countLastWord >= countFirstWord && countLastWord >= countFirstTwoWords && countLastWord >= countFirstThreeWords && countLastWord >= countLastTwoWords && countLastWord > 0) {
      commonWords = commonLastWord;
      commonWordsMatrix = commonLastWordMatrix;
    }
    else {
      commonWords = "";
      commonWordsMatrix = "";
    }
  }
  
  return {
    commonWords: commonWords,
    commonWordsMatrix: commonWordsMatrix
  };
  
// Inline function to count consecutive Ys in the matrices
function countConsecutiveYs(array) {
  let maxCount = 0;
  let currentCount = 0;

  array.forEach(element => {
    if (element === 'Y') {
      currentCount++;
      if (currentCount > maxCount) {
        maxCount = currentCount;
      }
    } else {
      currentCount = 0; // Reset count when encountering a non-'Y' character
    }
  });

  return maxCount;
}

}

function TK_Company_Processing(index) {
// This function will find out how many values appear
// after the keyword tk_company. All these will be marked
// as errors. The format could be simple like:
//  tk_company:"Casella Waste Systems, Inc." or
// tk_company:"WM: Earned Media Coverage" OR "498518 
// = WM | All Coverage" 
  
// currentToken will be tk_company.
  let currentToken = NGC3_list[index];
  
// Find the token next to tk_company
  let nextToken = NGC3_list[index+1];
  
// Initialize return token. This indicates how many tokens should
// be skipped.
  let valCount = 2;

// This will hold the final token, in case tk_company has variants
  let finalToken = [];
  
// In case of a variant, index+3 will have a numeric value.
// Load index+3 into a temporary string. Then, strip single
// quotes, double quotes and curly quotes from the token.
// VERSION 25 CHANGES BEGIN
// Check if there is a valid value at NGC3_list[index+3]
  if (NGC3_list[index+3]) {
// VERSION 25 CHANGES END
     tempToken = NGC3_list[index+3].replace(/["'“”‘’]/g, '');
  
// split at blank spaces and load to the array.
     finalToken = tempToken.split(' ');

// VERSION 25 CHANGES BEGIN
  }
// VERSION 25 CHANGES BEGIN
// Move to a constant for typecasting to avoid run-time errors.
// Position 0 has the number.
  const numValue = Number(finalToken[0]);
  
// Find out if finalToken[0] is a number. 
  if (Number.isInteger(numValue)) {
    
// Flag the boolean operator, number token and the next
//token as errors.
    populateTokenStream(index, 3);
    
// Populate an appropriate error message
    Error_list.push(tk_companyError + nextToken + ' ' + ORToken + ' ' + tempToken);
    
// Set return value
    valCount = 4;
  }
  
  else {
// Populate DIV area. No variant was found.
    populateTokenStream(index, 1);

// Populate an appropriate error message
    Error_list.push(tk_companyError + nextToken);
  }
  
  return(valCount);
}

function checkTKCompany(token, index) {
// This function checks if tk_company has a single
// value or multiple values in the format
// tk_company:"WM: Earned Media Coverage" OR "498518 = 
// WM | All Coverage" 
//

// Strip single quotes, double quotes and curly quotes 
  let strippedToken = token.replace(/["'“”‘’]/g, '');
  
// This will hold the final token, which could be a variant
  let finalToken = [];
  
// This is the default number of tokens after tk_company.
// This differs when instances like tk_company:"WM Phoenix Open" 
// OR "820742 = WM Phoenix Open" are encountered.
//
  let valueCount = 1;
  
// If this is a variant, index+3 will have a number. Load 
// index+3 into a temporary string. Then, strip single
// quotes, double quotes and curly quotes from the token.

// VERSION 25 CHANGES BEGIN
// Check if there is a valid value at NGC3_list[index+3]
  if (NGC3_list[index+3]) {
// VERSION 25 CHANGES END
     tempToken = NGC3_list[index+3].replace(/["'“”‘’]/g, '');
  
// split at blank spaces and load to the array.
     finalToken = tempToken.split(' ');
  
// VERSION 25 CHANGES BEGIN
  }
// VERSION 25 CHANGES BEGIN
// Move to a constant for typecasting to avoid run-time errors
// at the next if.
  const numValue = Number(finalToken[0]);
  
// Find out if finalToken[0] is a number. If yes, tk_company
// has multiple values after it. 
  if (Number.isInteger(numValue)) {
     valueCount = 3;
  }

// Return the numer of tokens found after tk_custom.
  return(valueCount);
}
  
function headlineProcessing(index) {
// This function is used to convert the NGC3 keyword
// headline: to C1. headline: is converted to a combination
// of title: and text_case.sensitive. To handle this, we
// will follow a 2-fold approach. headline: may or may not
// have multiple values in parenthesis.
  
// 1. We will convert all the values to lower-case
// temporarily and use only the unique values for the 
// title: keyword. This is because, the title: keyword is
// case-agnostic.

// 2. Then, we will compare all the values and use only the
// unique values for the text.case_sensitive keyword.
// This is the approach recommended by Kathryn Howell.
  
// 3. We will accomplish part of our task by invoking the
// function nestedORProcessing()
  
// At this point, index points to the 1st value of headline.
// Not stripping quotes, since it is stripping apostrophes
// too.
  let token = NGC3_list[index];

// Return value of at least 2. 1 for headline: and 1 for the
// value next to it. If there are more values in a 
// parenthesis, valCount will be bigger.
  let valCount = 2;
  
// Array to hold all the values
  let valuesArray = [];
  let valuesLowerCaseArray = [];

// Initialize the array counters
  let loopCounter = 0;
  
// Check if the token is a parenthesis.
  if (token === leftParenthesisValue) {
  
// VERSION 28 CHANGES BEGIN
// This means there are multiple values for headline
// We should move each value to an array.
//    token = NGC3_list[index+1];

//    while (token !== rightParenthesisValue) {
      
// Check if this is an OR. Push only when it is not a
// boolean operator
//      if (token !== ORToken && token !== orToken) {
//         valuesArray.push(token);
      
// Move all values in lower case to the
// valuesLowerCaseArray. We will use this for title: 
// down the line.
//         valuesLowerCaseArray.push(token.toLowerCase());
//      }
// Increment index
//      index++;
      
// Get the next array value into the token
//      token = NGC3_list[index+1];
      
// Increment return value
//      valCount++;
//    }
    
// 1 more for the closing parenthesis
//    valCount++;

// Now we need to find the unique values for 
// text.case_sensitive
//   let uniqueTextCaseSet = valuesArray.reduce((unique, //item) => {
//      if (!unique.includes(item)) {
//        unique.push(item);
//      }
//   return unique;
//   }, []);
    
// Invoke the function nestedORProcessing to find the 
// values for the title: keyword
    populateDiv(titleTokenC1, normalMode);
    valCount = nestedORProcessing(token, index, "Mixed");
    
// Let us find the unique values for title:
// Now we need to find the unique values for
// text.case_sensitive
//   let uniqueTitleSet = //valuesLowerCaseArray.reduce((unique, item) => {
//      if (!unique.includes(item)) {
//        unique.push(item);
//      }
//   return unique;
//   }, []);
    
// Invoke the function nestedORProcessing to find the 
// values for the text.case_sensitive keyword
    populateDiv(ANDToken, normalMode);
    populateDiv(textcase_sensitiveTokenC1, normalMode);
    valCount = nestedORProcessing(token, index, "LowerCase");

// Populate the output titles first
//    populateDiv(leftParenthesisValue, normalMode);
//    populateDiv(titleTokenC1, normalMode);
//    populateDiv(leftParenthesisValue, normalMode);
    
// Initialize the array counter
//    loopCounter = 0;
    
//    while (loopCounter < uniqueTitleSet.length) {
//      populateDiv(uniqueTitleSet[loopCounter], 
//normalMode);
//      loopCounter++;
      
// Do not push the OR if this is the last entry
//      if (loopCounter !== uniqueTitleSet.length) {
//         populateDiv(ORToken, normalMode);
//      }
//    }

// Push the final parenthesis
//    populateDiv(rightParenthesisValue, normalMode);
    
// Populate the output text.case_sensitive values now. 
// Push the AND first.
//    populateDiv(ANDToken, normalMode);
//    populateDiv(textcase_sensitiveTokenC1, normalMode);
//    populateDiv(leftParenthesisValue, normalMode);
    
// Initialize the array counter
//    loopCounter = 0;
    
//    while (loopCounter < uniqueTextCaseSet.length) {
//      populateDiv(uniqueTextCaseSet[loopCounter], 
// normalMode);
//      loopCounter++;
      
// Do not push the OR if this is the last entry
//      if (loopCounter !== uniqueTextCaseSet.length) {
//         populateDiv(ORToken, normalMode);
//      }
//    }
    
// Push the final parentheses
//    populateDiv(rightParenthesisValue, normalMode);
//    populateDiv(rightParenthesisValue, normalMode);
// VERSION 28 CHANGES END
  }
  else {

// This means there's a single value for headline. 
// Construct the output. titleTokenC1
    populateDiv(leftParenthesisValue, normalMode);
    populateDiv(titleTokenC1, normalMode);
    populateDiv(token, normalMode);
    populateDiv(ANDToken, normalMode);
    populateDiv(textcase_sensitiveTokenC1, normalMode);
    populateDiv(token, normalMode);
    populateDiv(rightParenthesisValue, normalMode);
  }
    
// Return how many tokens should be skipped
  return(valCount);
}

function readLanguageCodesCSV(token) {

// This is the return value. Initialize it to nulls.
 let language_code = "";
  
// Find the row for this tk_language by looping thru the 
// language table.
 for (let r = 0; r < languageTable.getRowCount(); r++) {
      
// Check if tk_language value matches the column named
// NGC3 tk_language: If it does, we are at the correct row.
// Get the C1 equivalent from the columnn language code.
// 
    if (languageTable.getString(r, 'NGC3 tk_language:') === token) {
      let resultRow = languageTable.getRow(r);
      language_code = resultRow.getString('language code');
    }
}

// Return the language code
return(language_code);
   
}

function unlessProcessing (index) {
// This function will be called when an AND is encountered.
// If the next token is a NOT, AND NOT will be converted to 
// UNLESS in C1.
  
// Initialize the return value
  let valCount = 1;

// Strip quotes from the next token
  nextToken = NGC3_list[index+1].replace(/["'“”‘’]/g, '');
  
// Check if the next token is a NOT
  if (nextToken === notToken || nextToken === NOTToken) {
    populateDiv(unlessToken, normalMode);
    
// Indicate that the next toke must be skipped.
    valCount = 2;
  }
  
  else {
// This is not an UNLESS. Push the AND to the output.
    populateDiv(ANDToken, normalMode);
  }
//  Return the number of tokens to be skipped
  return(valCount);
}

function media_Type_Processing(index) {
// This function does the pre-processing before
// media_Type_Detailed_Processing is called.

// Push the C1 token to the output.
// VERSION 29 CHANGES BEGIN
// populateDiv(mediumTokenC1, normalMode);
 populateDiv(mediumTokenC1, highlightMode);
// VERSION 29 CHANGES END

// Save the entry value of index
 const entryIndex = index;

// Sometimes, there could be multiple mediatypes within parenthesis
// Check if the next character is a '('
 if (NGC3_list[index+1] === leftParenthesisValue) {
// First, push this parenthesis
// VERSION 29 CHANGES BEGIN
//    populateDiv(leftParenthesisValue, normalMode);
    populateDiv(leftParenthesisValue, highlightMode);
// VERSION 29 CHANGES END
// Continue conversion till all mediatype tokens have been
// exhausted
    index++;

    while (NGC3_list[index+1] !== rightParenthesisValue) {
        Media_Type_Detailed_Processing(index);
        index++;

// Check the next token. If it is OR, push it to Div.
        if (NGC3_list[index+1] === ORToken) {
// Push this OR
// VERSION 29 CHANGES BEGIN
//           populateDiv(NGC3_list[index+1], normalMode);
           populateDiv(NGC3_list[index+1], highlightMode);
// VERSION 29 CHANGES END
           index++;
        }
    }
// Add the final right parenthesis
// VERSION 29 CHANGES BEGIN
//    populateDiv(rightParenthesisValue, normalMode);
    populateDiv(rightParenthesisValue, highlightMode);
// VERSION 29 CHANGES END
    index++;
 }
 else {
    Media_Type_Detailed_Processing(index);
    index+=2;
 }

// Return the value of index
  return(index - entryIndex);
 }

function impactProcessing(index) {

// index points to the impact code used. Strip all kinds of quotes.
 let impactCode = NGC3_list[index].replace(/["'“”‘’]/g, '');

// VERSION 26 CHANGES BEGIN
// This variable will have the impact code in sentence case
   let impactCodeSentenceCase = impactCode.charAt(0).toUpperCase() + impactCode.slice(1);
// VERSION 26 CHANGES END
// Push the C1 token to the output
 populateDiv(impact_score_gradeTokenC1, normalMode);

// Check if the impact code is valid
 if ([highValue, HighValue, mediumValue, MediumValue, lowValue, LowValue].includes(impactCode)) {
// Push the impact code to the output
// VERSION 26 CHANGES BEGIN
//   populateDiv(impactCode, normalMode); 
// Ensure the output is uppercase
   populateDiv(impactCodeSentenceCase, normalMode); 
// VERSION 26 CHANGES END
 }
 else {
// Push the impact code to the output and flag an error
  populateDiv(impactCode, errorMode); 

// Push error message
  Error_list.push(impactCodeError + impactCode);
 }

}

function nestedORProcessing(token, index, conversionCase) {
// A nested OR is when some of the words within parenthesis
// have common elements with an OR connecting them. For
// example: ("Health" OR "Health’s" OR "Health's" OR
// "Doctors" OR "Nurses") 
// This should be replaced by ("Health"  OR "Doctors" 
// OR "Nurses").
  
// ("University of Maryland" OR "University of Maryland
// College of Education" OR "University of Maryland College
// of Information Studies" OR "Microbiology" OR
// "Microbiology Department") 
// should be rendered as
// ("University of Maryland" OR "Microbiology").
  
// Essentially, this function will remove redundant searches
// with apostrophe and redundant compound phrases within a
// bracketed/nested group if the base search is already in
// the group. 

// Save the entry value of the index
  let entryIndex = index;
  
// Initialise the return value
  valCount = 0;
  
// Indicate that this could be a nested OR.
  let nestedOR = true;
  
// Declare the variable used in the loop
  let nextToken;
  
// Declare the array that will hold the words found between
// parenthesis
  let foundWords = [];

// Declare the array that will hold the all the common words
// and phrases found between parenthesis
  let outputWords = [];
  
// Declare the variable that will hold the smallest word or
// phrase in the nested OR.
  let smallestWord = "";
  
// Check if this token is a left parenthesis and 2 tokens
// after that is an OR.
  if (token === leftParenthesisValue) {
// Initialise the loop counter
   let loopCounter = 0;

// Increment index so that it points to the phrase
   index++;
    
// Reload token and nextToken and strip the quotes.
   token = NGC3_list[index].replace(/["'“”‘’]/g, '');
   nextToken = NGC3_list[index+1];
    
// Loop till the right parenthesis is found
    while (nextToken !== rightParenthesisValue) {
      
       if (nextToken.toUpperCase() === ORToken) {
// Move the word to the array after stripping the quotes
// If the last character is any kind of quote, strip it
         token = token.replace(/[‘’"”']$/, '');
         foundWords[loopCounter] = token;

// Increment loop counter
         loopCounter++;
      
// Increment the index
         index = index+2;
      
// Reload token and nextToken. Strip the quotes at the
// end of token. Also strip 's and ’s
         token = NGC3_list[index].replace(/(^["'“”‘’]|["'“”‘’]$)/g, '');
         if (token.endsWith("'s") || token.endsWith("’s"))            {
// Remove the trailing 's and ’s
            token = token.slice(0, -2);
          }
          if (token.endsWith("'") || token.endsWith("’"))            {
// Remove the trailing ' and ’
            token = token.slice(0, -1);
          }
         nextToken = NGC3_list[index+1];
       }
      else {
// Quit the loop, indicate that processing should be stopped
        nestedOR = false;
        break;
      }
    }

// End of loop. if nestedOR = true, load the last word
// before the right parenthesis 
    if (nestedOR) {
       foundWords[loopCounter] = token;
      
// Sort the array. Use a set to remove duplicates. 
// But first check if the array should be converted to 
// lower-case. This can happen when headlineProcessing
// invokes the function.
      if (conversionCase === 'LowerCase') {
        foundWords = Array.from(new Set(foundWords.map(word => word.toLowerCase()))).sort();
      }
      else {
        foundWords = Array.from(new Set(foundWords)).sort();
      }
      
// Array loaded and sorted. Now we need to find what the
// base searches are (if any) in the array elements. Note
// that there could be more than 1 base search. Any base
// search will be loaded into smallestWord and pushed as
// output.
      
// Initialize the loopcounter for the array outputWords
       outputCounter = 0;
      
// Initialize the loopcounter for the array foundWords
       loopCounter = 0;
      
// Initialize smallestWord
//       smallestWord = foundWords[loopCounter];
      
// Loop thru the array elements
       while(loopCounter < foundWords.length) {
// The if case may not execute at all, because we are 
// already eliminating duplicates, slicing the quote and
// curly quotes and 's and 's.
         if (
foundWords[loopCounter].startsWith(smallestWord+" ") ||     foundWords[loopCounter].startsWith(smallestWord+'’') ||
foundWords[loopCounter].startsWith(smallestWord+"'") ||  foundWords[loopCounter].startsWith(smallestWord+'’s') ||
foundWords[loopCounter].startsWith(smallestWord+"'s")) {
// If the same word was encountered with or without quotes
// and with or without an extra space, do nothing.
         }
         
         else if (foundWords[loopCounter].endsWith(smallestWord+"s")) {
// Check if a plural form of the smallest wird was
// encountered. In which case, push it out but do not 
// update smallest word.
           outputWords[outputCounter] = foundWords[loopCounter];
           outputCounter++;
         }
         
         else {
// New word or phrase found. Move the new word or phrase to
// smallestWord
           smallestWord = foundWords[loopCounter];
           
// Move the new smallestWord to the output buffer array
           outputWords[outputCounter] = smallestWord;
           outputCounter++;
         }

// Increment loop counter
         loopCounter++;
       }
    }
    
// At this point, if nestedOR is true, outputWords has the
// list of all phrases that should be output. 
    if (nestedOR) {
// Initialize the loopcounter for the array outputWords
      outputCounter = 0;
      
// Start with the left parenthesis
      populateDiv(leftParenthesisValue, normalMode);
      
      while (outputCounter < outputWords.length) {
// Pad the base searches word with double quotes
         outputWords[outputCounter] = '"' + outputWords[outputCounter] + '"';
         populateDiv(outputWords[outputCounter], normalMode);

// Add an OR token if this not the last word in the array
         if (outputCounter+1 < outputWords.length) {
            populateDiv(ORToken, normalMode);
         }
         outputCounter++;
      }
      
// End with the right parenthesis
      populateDiv(rightParenthesisValue, normalMode);
      
// Set valCount to indicate how many tokens to skip.
      valCount = index - entryIndex+2;
    }
  }
  
// Return the number of tokens to be skipped
  return(valCount);
}