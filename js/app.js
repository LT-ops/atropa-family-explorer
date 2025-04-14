const web3 = new Web3('https://rpc.pulsechain.com');
const contract = new web3.eth.Contract(abi, '0x394c3D5990cEfC7Be36B82FDB07a7251ACe61cc7');

export async function searchTokens(query) {
    if (web3.utils.isAddress(query)) {        
        return await getTokenData(query) || [];
    } else {
        return [];
    }
}

async function getTokenData(tokenAddress) {
    try {
        const tokenParent = await contract.methods.GetStandardTokenParent(tokenAddress).call() || null;
        
        return {
            address: tokenAddress,
            parent: tokenParent,
        };
    } catch (error) {
        console.error("Error getting token data:", error);
        return null;
    }    
}

async function getChildrenTokens(tokenAddress) {
    const children = [];
    const knownTokens = ["0x6930f802f61a5d7c87d24a031955343f4a59f717","0x29950e161c20e5c9f93b63e5648c8d5eb665f027","0xf9ffb950767043e753ab92968d8b31511e34f4e8"];

    for (const address of knownTokens) {
        const tokenData = await getTokenData(address);
        if (tokenData && tokenData.parent === tokenAddress) {
            children.push(tokenData);
        }
    }
    return children;
}
