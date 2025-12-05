// select html elements

const button = document.querySelector('#quoteBtn');
const quoteText = document.querySelector('#quoteText');
const quoteAuthor = document.querySelector('#quoteAuthor');

const url = 'https://api.adviceslip.com/advice';


button.addEventListener('click', getQuote);

async function getQuote(){
    

    try {
            let response = await fetch(url);

            if (!response.ok) {
                throw new Error('error');
            }

            // put returned object data into elements

            let data = await response.json();

            quoteText.textContent = data.slip.advice;
            quoteAuthor.textContent = "_Advice API";

    }catch (error) {
        console.log(error);
    }

}