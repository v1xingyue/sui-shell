import {
  JsonRpcProvider,
  devnetConnection,
  mainnetConnection,
  testnetConnection,
} from "@mysten/sui.js";
import { useWallet, SuiChainId } from "@suiet/wallet-kit";
import { useEffect } from "react";
import { GlobalID } from "../utils/const";

const Server = () => {
  const { address, chain } = useWallet();
  let connection = devnetConnection;
  if (chain?.id === SuiChainId.TEST_NET) {
    connection = testnetConnection;
  } else if (chain?.id === SuiChainId.MAIN_NET) {
    connection = mainnetConnection;
  }

  useEffect(() => {
    (async () => {
      const provider = new JsonRpcProvider(connection);
      console.log("get data from :", GlobalID, connection);
      const global = await provider.getObject({
        id: GlobalID,
      });
      console.log(global);
      // if (global.error) {
      //   alert(global.error);
      // }
      // console.log("global info ", global);
    })();
  }, [address]);

  return <>{address}</>;
};

export default Server;
