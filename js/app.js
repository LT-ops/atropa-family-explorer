import { tokenData } from './token_data.js';

console.log(tokenData);

function searchTokens(query) {
    const lowerCaseQuery = query.toLowerCase();
    const foundTokens = [];

    for (const key in tokenData) {
        const token = tokenData[key];
        if (
            token.name.toLowerCase().includes(lowerCaseQuery) ||
            token.symbol.toLowerCase().includes(lowerCaseQuery) ||
            token.address.toLowerCase().includes(lowerCaseQuery)
        ) {
            foundTokens.push(token);
        }
    }

    return foundTokens;
}