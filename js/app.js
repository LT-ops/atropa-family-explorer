const web3 = new Web3('https://rpc.pulsechain.com');

export function searchTokens(query) {
    if (!globalThis.realTokenData || Object.keys(globalThis.realTokenData).length === 0) {
        return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    const foundTokens = [];

    for (const key in globalThis.realTokenData) {
        const token = globalThis.realTokenData[key];
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

const contract = new web3.eth.Contract(abi, '0x394c3D5990cEfC7Be36B82FDB07a7251ACe61cc7');

async function getAllTokens() {
    const allTokens = [];
    // Assuming TreasuryTokens function returns an array of token addresses directly
    // and not a mapping of owner to token address.
    // The actual implementation might require adjustments based on the contract's behavior.
    const treasuryTokens = await contract.methods.TreasuryTokens('0xBF182955401aF3f2f7e244cb31184E93E74a2501').call();
    
    // Assuming treasuryTokens is already an array of addresses
    treasuryTokens.forEach(tokenAddress => {
        allTokens.push(tokenAddress);
    });

    const realTokenData = {};

    for (const tokenAddress of allTokens) {
        const tokenOwner = await contract.methods.GetTreasuryTokenOwner(tokenAddress).call();

        if (tokenOwner.toLowerCase() === '0xBF182955401aF3f2f7e244cb31184E93E74a2501'.toLowerCase()) {
            const parent = await contract.methods.GetStandardTokenParent(tokenAddress).call();
            realTokenData[tokenAddress] = {
                address: tokenAddress,
                parent: parent,
            };
        }
    }

    globalThis.realTokenData = realTokenData;
}

getAllTokens();