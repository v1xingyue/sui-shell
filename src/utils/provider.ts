import { JsonRpcProvider, devnetConnection, mainnetConnection, testnetConnection } from "@mysten/sui.js";
import { SuiMainnetChain, SuiTestnetChain, useWallet } from "@suiet/wallet-kit"
import {GlobalID} from "./const";

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

export const FetchGlobal = async()=>{
    const provider = SuiProvider();
    return provider.getObject({id: GlobalID});
}