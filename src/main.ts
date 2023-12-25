// Get the elements from the HTML
const mainContainer = document?.getElementById("mainContainer") as HTMLElement;
const typesOfQuoteContainer = document?.getElementById("typesOfQuoteContainer") as HTMLElement;
const quoteContainer = document.getElementById('quoteContainer') as HTMLElement;
const quote = document?.getElementById("quote") as HTMLElement;
const author = document?.getElementById("author") as HTMLElement;
const loader = document.getElementById('loader') as HTMLElement;

let categoriesList: Array<string> = [];
let categoriesCloneList: Array<string> = [];

// Call the listOfQuotes function when the page is loaded
window.addEventListener("load", async () => {
    listOfQuotes();
    const [randomQuote] = await fetchQuoteFromGivenURL('https://api.quotable.io/quotes/random');
    randomQuote?.length && displayQuote(randomQuote);
});


// Function to fetch the list of quote types
async function listOfQuotes() {
    const quotes = await fetchQuoteFromGivenURL('https://api.quotable.io/tags');
    categoriesList = Array.isArray(quotes) ? quotes.map((y) => y.name) : [];
    categoriesCloneList = JSON.parse(JSON.stringify(categoriesList));
    bindAllTheQuotesCategories();
}

// Function to generate a quote based on the selected type
async function generateQuote(e: any) {
    if (e) {
        const url = `https://api.quotable.io/quotes/random?tags=${e.target.innerText}`;
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
        toggleClass(loader, 'loader', false);
        toggleClass(mainContainer, 'd-none', false);
    }
}

// Function to add or remove the class.
function toggleClass(element: any, className: string, shouldAdd: boolean) {
    if (shouldAdd) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

function filterQuotes(e: any) {
    categoriesCloneList = categoriesList.filter((t) => t?.toLowerCase().includes(e.target.value?.toLowerCase()));
    bindAllTheQuotesCategories();
}

function bindAllTheQuotesCategories() {
    typesOfQuoteContainer.innerHTML = categoriesCloneList.length ? '' : '<h2 style="margin-bottom: 1.9rem!important">No records found.</h2>';
    categoriesCloneList?.forEach((type) => {
        let btn = document.createElement('button') as HTMLButtonElement;
        btn.onclick = ((e) => generateQuote(e));
        btn.id = 'typeOfQuote';
        btn.innerHTML = type;
        typesOfQuoteContainer.appendChild(btn);
    });
    toggleClass(loader, 'loader', false);
    toggleClass(mainContainer, 'd-none', false);
}

function copyToClipBoard() {
    navigator.clipboard.writeText(quote.innerText).then(() => {
        const toaster = document.getElementById("toaster") as HTMLElement;
        toaster.style.display = "block";
        setTimeout(() => {
          toaster.style.display = "none";
        }, 2000); // Hide the toaster after 2 seconds
    });
}