const web3 = new Web3('https://rpc.pulsechain.com');
const contract = new web3.eth.Contract(abi, '0x394c3D5990cEfC7Be36B82FDB07a7251ACe61cc7');

export async function searchTokens(query) {
    if (web3.utils.isAddress(query)) {
        const tokenData = await getTokenData(query);
        if (tokenData) {
            return [tokenData];
        } else {
            return [];
        }
    } else {
        return [];
    }
}

async function getTokenData(tokenAddress) {
    try {
        const tokenOwner = await contract.methods.GetTreasuryTokenOwner(tokenAddress).call();

        if (tokenOwner !== '0xBF182955401aF3f2f7e244cb31184E93E74a2501') {
            return null;
        }

        const tokenParent = await contract.methods.GetStandardTokenParent(tokenAddress).call();

        return {
            address: tokenAddress,
            parent: tokenParent,
        };
    } catch (error) {
        console.error("Error getting token data:", error);
        return null;
    }
}
