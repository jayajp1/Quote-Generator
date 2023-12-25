"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Get the elements from the HTML
const mainContainer = document === null || document === void 0 ? void 0 : document.getElementById("mainContainer");
const typesOfQuoteContainer = document === null || document === void 0 ? void 0 : document.getElementById("typesOfQuoteContainer");
const quoteContainer = document.getElementById('quoteContainer');
const quote = document === null || document === void 0 ? void 0 : document.getElementById("quote");
const author = document === null || document === void 0 ? void 0 : document.getElementById("author");
const loader = document.getElementById('loader');
let categoriesList = [];
let categoriesCloneList = [];
// Call the listOfQuotes function when the page is loaded
window.addEventListener("load", () => __awaiter(void 0, void 0, void 0, function* () {
    listOfQuotes();
    const [randomQuote] = yield fetchQuoteFromGivenURL('https://api.quotable.io/quotes/random');
    (randomQuote === null || randomQuote === void 0 ? void 0 : randomQuote.length) && displayQuote(randomQuote);
}));
// Function to fetch the list of quote types
function listOfQuotes() {
    return __awaiter(this, void 0, void 0, function* () {
        const quotes = yield fetchQuoteFromGivenURL('https://api.quotable.io/tags');
        categoriesList = Array.isArray(quotes) ? quotes.map((y) => y.name) : [];
        categoriesCloneList = JSON.parse(JSON.stringify(categoriesList));
        bindAllTheQuotesCategories();
    });
}
// Function to generate a quote based on the selected type
function generateQuote(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e) {
            const url = `https://api.quotable.io/quotes/random?tags=${e.target.innerText}`;
            const [quote] = yield fetchQuoteFromGivenURL(url);
            (quote === null || quote === void 0 ? void 0 : quote.length) && displayQuote(quote);
        }
    });
}
// Function to fetch a quote from a given URL
function fetchQuoteFromGivenURL(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (yield fetch(url)).json();
    });
}
// Function to display the quote and author
function displayQuote(quoteToBeDisplay) {
    if ((quoteToBeDisplay === null || quoteToBeDisplay === void 0 ? void 0 : quoteToBeDisplay.content) && (quoteToBeDisplay === null || quoteToBeDisplay === void 0 ? void 0 : quoteToBeDisplay.author)) {
        quote.innerHTML = `${quoteToBeDisplay === null || quoteToBeDisplay === void 0 ? void 0 : quoteToBeDisplay.content}`;
        author.innerHTML = `~ ${quoteToBeDisplay === null || quoteToBeDisplay === void 0 ? void 0 : quoteToBeDisplay.author}`;
        toggleClass(loader, 'loader', false);
        toggleClass(mainContainer, 'd-none', false);
    }
}
// Function to add or remove the class.
function toggleClass(element, className, shouldAdd) {
    if (shouldAdd) {
        element.classList.add(className);
    }
    else {
        element.classList.remove(className);
    }
}
function filterQuotes(e) {
    categoriesCloneList = categoriesList.filter((t) => { var _a; return t === null || t === void 0 ? void 0 : t.toLowerCase().includes((_a = e.target.value) === null || _a === void 0 ? void 0 : _a.toLowerCase()); });
    bindAllTheQuotesCategories();
}
function bindAllTheQuotesCategories() {
    typesOfQuoteContainer.innerHTML = categoriesCloneList.length ? '' : '<h2 style="margin-bottom: 1.9rem!important">No records found.</h2>';
    categoriesCloneList === null || categoriesCloneList === void 0 ? void 0 : categoriesCloneList.forEach((type) => {
        let btn = document.createElement('button');
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
        const toaster = document.getElementById("toaster");
        toaster.style.display = "block";
        setTimeout(() => {
            toaster.style.display = "none";
        }, 2000); // Hide the toaster after 2 seconds
    });
}
