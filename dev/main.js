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
let mainContainer;
let typesOfQuoteContainer;
let quoteContainer;
let quote;
let author;
let loader;
let quoteCategoryList = [];
let quoteCategoryCloneList = [];
// https://github.com/lukePeavey/quotable
const quoteURL = 'https://api.quotable.io/';
// Call the listOfQuotes function when the page is loaded
if (typeof window !== 'undefined') {
    window.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
        yield initializeElements();
        // Call the function to fetch and display the list of quotes
        listOfQuotes();
        // Fetch a random quote from the specified URL asynchronously
        const [randomQuote] = yield fetchQuoteFromGivenURL(`${quoteURL}quotes/random`);
        // If a random quote is retrieved and it has a non-zero length, display the quote.
        (randomQuote === null || randomQuote === void 0 ? void 0 : randomQuote.length) && displayQuote(randomQuote);
    }));
}
function initializeElements() {
    return __awaiter(this, void 0, void 0, function* () {
        mainContainer = document === null || document === void 0 ? void 0 : document.getElementById("mainContainer");
        typesOfQuoteContainer = document === null || document === void 0 ? void 0 : document.getElementById("typesOfQuoteContainer");
        quoteContainer = document.getElementById('quoteContainer');
        quote = document === null || document === void 0 ? void 0 : document.getElementById("quote");
        author = document === null || document === void 0 ? void 0 : document.getElementById("author");
        loader = document.getElementById('loader');
    });
}
/**
 * Fetches a list of quote categories from the specified URL and binds them to the UI.
 */
function listOfQuotes() {
    return __awaiter(this, void 0, void 0, function* () {
        const quotes = yield fetchQuoteFromGivenURL(`${quoteURL}tags`);
        // Extract names of categories from fetched quotes, if available
        quoteCategoryList = Array.isArray(quotes) ? [...new Set(quotes.map((y) => y.name))] : [];
        quoteCategoryCloneList = JSON.parse(JSON.stringify(quoteCategoryList));
        bindAllTheQuotesCategories();
    });
}
// Function to generate a quote based on the selected type
function generateQuote(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e) {
            const url = `${quoteURL}quotes/random?tags=${e.target.innerText}`;
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
        showHideLoader(false);
    }
}
/**
 * Filters the list of categories based on the provided input value and updates the quoteCategoryCloneList.
 * @param e - The event object triggered by the input field.
 */
function filterQuotes(e) {
    // Filters the quoteCategoryList based on whether their names include the input value, case-insensitive.
    quoteCategoryCloneList = quoteCategoryList.filter((t) => { var _a; return t === null || t === void 0 ? void 0 : t.toLowerCase().includes((_a = e.target.value) === null || _a === void 0 ? void 0 : _a.toLowerCase()); });
    bindAllTheQuotesCategories();
}
/**
 * Binds all the categories of quotes to the typesOfQuoteContainer element.
 */
function bindAllTheQuotesCategories() {
    typesOfQuoteContainer.innerHTML = quoteCategoryCloneList.length ? '' : '<h2 style="margin-bottom: 1.9rem!important">No records found.</h2>';
    quoteCategoryCloneList === null || quoteCategoryCloneList === void 0 ? void 0 : quoteCategoryCloneList.forEach((type) => {
        const btn = document.createElement('button');
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
        const toaster = document.getElementById("toaster");
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
    const twitterURL = `https://twitter.com/intent/tweet?text=${quote.innerText} ${author.innerText}`;
    window.open(twitterURL, "_blank");
}
// To show and hide the loader.
function showHideLoader(isShow) {
    toggleClass(loader, 'loader', isShow);
    toggleClass(mainContainer, 'd-none', isShow);
}
// To handle visibility of the loader.
function toggleClass(element, className, shouldAdd) {
    if (shouldAdd) {
        element.classList.add(className);
    }
    else {
        element.classList.remove(className);
    }
}
