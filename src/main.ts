// Get the elements from the HTML
let mainContainer: HTMLElement;
let typesOfQuoteContainer: HTMLElement;
let quoteContainer: HTMLElement;
let quote: HTMLElement;
let author: HTMLElement;
let loader: HTMLElement;

let quoteCategoryList: Array<string> = [];
let quoteCategoryCloneList: Array<string> = [];

// https://github.com/lukePeavey/quotable
const quoteURL = 'https://api.quotable.io/';

// Call the listOfQuotes function when the page is loaded
if (typeof window !== 'undefined') {
    window.addEventListener("DOMContentLoaded", async () => {
        await initializeElements();

        // Call the function to fetch and display the list of quotes
        listOfQuotes();
        // Fetch a random quote from the specified URL asynchronously
        const [randomQuote] = await fetchQuoteFromGivenURL(`${quoteURL}quotes/random`);

        // If a random quote is retrieved and it has a non-zero length, display the quote.
        randomQuote?.length && displayQuote(randomQuote);
    });
}

async function initializeElements() {
    mainContainer = document?.getElementById("mainContainer") as HTMLElement;
    typesOfQuoteContainer = document?.getElementById("typesOfQuoteContainer") as HTMLElement;
    quoteContainer = document.getElementById('quoteContainer') as HTMLElement;
    quote = document?.getElementById("quote") as HTMLElement;
    author = document?.getElementById("author") as HTMLElement;
    loader = document.getElementById('loader') as HTMLElement;
}
/**
 * Fetches a list of quote categories from the specified URL and binds them to the UI.
 */
async function listOfQuotes() {
    const quotes = await fetchQuoteFromGivenURL(`${quoteURL}tags`);
    // Extract names of categories from fetched quotes, if available
    quoteCategoryList = Array.isArray(quotes) ? [...new Set(quotes.map((y) => y.name))] : [];
    quoteCategoryCloneList = JSON.parse(JSON.stringify(quoteCategoryList));
    bindAllTheQuotesCategories();
}

// Function to generate a quote based on the selected type
async function generateQuote(e: any) {
    if (e) {
        const url = `${quoteURL}quotes/random?tags=${e.target.innerText}`;
        const [quote] = await fetchQuoteFromGivenURL(url);
        quote?.length && displayQuote(quote);
    }
}

// Function to fetch a quote from a given URL
async function fetchQuoteFromGivenURL(url: string) {
    return await (await fetch(url)).json();
}

// Function to display the quote and author
function displayQuote(quoteToBeDisplay: any) {
    if (quoteToBeDisplay?.content && quoteToBeDisplay?.author) {
        quote.innerHTML = `${quoteToBeDisplay?.content}`;
        author.innerHTML = `~ ${quoteToBeDisplay?.author}`;
        showHideLoader(false);
    }
}

/**
 * Filters the list of categories based on the provided input value and updates the quoteCategoryCloneList.
 * @param e - The event object triggered by the input field.
 */
function filterQuotes(e: any) {
    // Filters the quoteCategoryList based on whether their names include the input value, case-insensitive.
    quoteCategoryCloneList = quoteCategoryList.filter((t) => t?.toLowerCase().includes(e.target.value?.toLowerCase()));
    bindAllTheQuotesCategories();
}

/**
 * Binds all the categories of quotes to the typesOfQuoteContainer element.
 */
function bindAllTheQuotesCategories() {
    typesOfQuoteContainer.innerHTML = quoteCategoryCloneList.length ? '' : '<h2 style="margin-bottom: 1.9rem!important">No records found.</h2>';
    quoteCategoryCloneList?.forEach((type) => {
        const btn = document.createElement('button') as HTMLButtonElement;
        btn.onclick = ((e) => generateQuote(e));
        btn.id = 'typeOfQuote';
        btn.innerHTML = type;
        typesOfQuoteContainer.appendChild(btn);
    });
    showHideLoader(false);
}

/*
* Copies the text from the quote element to the clipboard and displays a toaster notification.
*/
function copyToClipBoard() {
    navigator.clipboard.writeText(quote.innerText).then(() => {
        const toaster = document.getElementById("toaster") as HTMLElement;
        toaster.style.display = "block";
        setTimeout(() => {
            toaster.style.display = "none";
        }, 2000); // Hide the toaster after 2 seconds
    });
}
/**
 * Opens a new window to tweet the displayed quote and author on Twitter.
 */
function tweetTheQuote() {
    const twitterURL = `https://twitter.com/intent/tweet?text=${quote.innerText} ${author.innerText}`
    window.open(twitterURL, "_blank");
}

// To show and hide the loader.
function showHideLoader(isShow: boolean) {
    toggleClass(loader, 'loader', isShow);
    toggleClass(mainContainer, 'd-none', isShow);
}

// To handle visibility of the loader.
function toggleClass(element: any, className: string, shouldAdd: boolean) {
    if (shouldAdd) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}