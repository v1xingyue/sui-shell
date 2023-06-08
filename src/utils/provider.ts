import { JsonRpcProvider, devnetConnection, mainnetConnection, testnetConnection } from "@mysten/sui.js";
import { SuiMainnetChain, SuiTestnetChain, useWallet } from "@suiet/wallet-kit"

export const SuiProvider = () => {
    const { chain } = useWallet();
    let connection = devnetConnection;
    if (chain === SuiTestnetChain) {
        connection = testnetConnection;
    } else if (chain === SuiMainnetChain) {
        connection = mainnetConnection;
    }
    return new JsonRpcProvider(connection);
}