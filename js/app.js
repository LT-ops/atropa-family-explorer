// Import knownTokens from the token_data.js file
const { knownTokens } = require('./token_data.js');

// Get references to the search button and input
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

// Add an event listener to the search button
searchButton.addEventListener('click', async () => {
    const query = searchInput.value; // Get the search query from the input
    await searchTokens(query); // Search for tokens based on the query
});

// Initialize web3 with the PulseChain RPC URL
const web3 = new Web3('https://rpc.pulsechain.com');

// Define the ABI (Application Binary Interface) for the contract
const abi = [
    {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
    {"inputs":[],"name":"BBC","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"FED","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"FederalMinter","outputs":[{"internalType":"contract NT","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"ctx","type":"address"}],"name":"GetStandardTokenParent","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"ctx","type":"address"}],"name":"GetTreasuryTokenOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"IndexMinter","outputs":[{"internalType":"contract NT","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"NOTS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"Name","type":"string"},{"internalType":"string","name":"Symbol","type":"string"},{"internalType":"uint256","name":"InitialMint","type":"uint256"},{"internalType":"address","name":"Parent","type":"address"}],"name":"New","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"Name","type":"string"},{"internalType":"string","name":"Symbol","type":"string"}],"name":"NewGai","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"ONE","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"SKILLS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"ctx","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"Transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"TreasuryMinter","outputs":[{"internalType":"contract NT","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"ctx","type":"address"}],"name":"TreasuryTokens","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"}
];

// Create a contract instance
const contract = new web3.eth.Contract(abi, '0x394c3D5990cEfC7Be36B82FDB07a7251ACe61cc7');

// Function to search for tokens
async function searchTokens(query) {
    if (web3.utils.isAddress(query)) { // Check if the query is a valid address
        const token = await getTokenData(query); // Get token data for the address
        if (token) { // If token data is found
            displayTokenInfo(token); // Display the token information
            return [token]; // Return as an array for consistency
        } else {
            return []; // Return an empty array if no token data is found
        }
    } else {
        return []; // Return an empty array if the query is not a valid address
    }
}

// Function to get token data from the contract
async function getTokenData(tokenAddress) {
    try {
        const tokenParent = await contract.methods.GetStandardTokenParent(tokenAddress).call(); // Get the parent of the token
        return {
            address: tokenAddress, // Return the token address
            parent: tokenParent, // Return the parent address
        };
    } catch (error) {
        console.error("Error getting token data:", error); // Log any errors
        return null; // Return null if there's an error
    }
}

// Function to get children tokens
async function getChildrenTokens(tokenAddress) {
    const children = []; // Initialize an empty array to store children tokens

    for (const address of knownTokens) { // Iterate over known tokens
        const tokenData = await getTokenData(address); // Get token data for each known token
        if (tokenData && tokenData.parent === tokenAddress) { // If token has data and it has the specified parent
            children.push(tokenData); // Add it to the children array
        }
    }
    return children; // Return the children array
}

// Function to display token information
function displayTokenInfo(token) {
    // Get references to HTML elements
    const tokenNameElement = document.getElementById('tokenName');
    const tokenSymbolElement = document.getElementById('tokenSymbol');
    const tokenAddressElement = document.getElementById('tokenAddress');
    const parentAddressElement = document.getElementById('parentAddress');
    const parentExplorerLink = document.getElementById('parentExplorerLink');
    const tokenExplorerLink = document.getElementById('tokenExplorerLink');
    const parentTokenInfoDiv = document.getElementById('parentTokenInfo');
    const noParentInfoDiv = document.getElementById('noParentInfo');

    if (token) { // If a token is provided
        tokenNameElement.textContent = token.name || 'Unknown'; // Set token name
        tokenSymbolElement.textContent = token.symbol || 'Unknown'; // Set token symbol
        tokenAddressElement.textContent = token.address; // Set token address

        const explorerUrl = `https://midgard.wtf/tokens/${token.address}`;
        tokenExplorerLink.href = explorerUrl;
        tokenExplorerLink.textContent = token.address;

        if (token.parent === '0x0000000000000000000000000000000000000000') { // If token has no parent
            parentTokenInfoDiv.style.display = 'none'; // Hide parent info
            noParentInfoDiv.style.display = 'block'; // Show no parent info
        } else { // If token has a parent
            parentTokenInfoDiv.style.display = 'block'; // Show parent info
            noParentInfoDiv.style.display = 'none'; // Hide no parent info
            parentAddressElement.textContent = token.parent; // Set parent address
            const parentUrl = `https://midgard.wtf/tokens/${token.parent}`;
            parentExplorerLink.href = parentUrl;
            parentExplorerLink.textContent = token.parent;
        }
    }
}

// Event listener for window load
window.onload = async () => {

};
