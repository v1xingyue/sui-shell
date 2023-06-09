import { useWallet } from "@suiet/wallet-kit";
import { JsonRpcProvider, devnetConnection } from "@mysten/sui.js";
import { useEffect, useState } from "react";
import { GlobalID } from "../utils/const";

const Server = () => {
  const { chain } = useWallet();
  const [global, updateGlobal] = useState({});
  const provider = new JsonRpcProvider(devnetConnection);

  useEffect(() => {
    const asyncCall = async () => {
      const result = await provider.getObject({
        id: GlobalID,
        options: {
          showType: true,
          showContent: true,
          showDisplay: true,
        },
      });
      console.log(result);
      updateGlobal(result);
    };
    asyncCall();
  }, []);

  return (
    <>
      <p>{JSON.stringify(chain)}</p>
      <p>{JSON.stringify(global, null, 2)}</p>
    </>
  );
};

export default Server;
