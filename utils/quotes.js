'use strict';
const axios = require('axios');

module.exports = getQuote;

async function getQuote(options) {
    if(options === undefined) {
        var quote = await axios.get('https://animechan.vercel.app/api/random')
    } else {
        var quote = await axios.get(`https://animechan.vercel.app/api/quotes/character?name=${options}&page=1`)
    }
    return quote.data
}