import { useEffect, useState } from "react";
import { SuiProvider } from "../utils/provider";
import { useWallet } from "@suiet/wallet-kit";
import { CallTarget, StructType } from "../utils";
import { TransactionBlock } from "@mysten/sui.js";
import { GlobalID } from "../utils/const";

const Hello = () => {
  const [userName, updateUserName] = useState("");
  const [userId, updateUserId] = useState("");
  const [userInfo, updateUserinfo] = useState({});
  const [publicKey, updatePublicKey] = useState("");

  const [transactionResult, updateTransactionResult] = useState({});
  const [memberRegistered, updateStatus] = useState(false);
  const provider = SuiProvider();
  const { address, signAndExecuteTransactionBlock } = useWallet();
  useEffect(() => {
    (async () => {
      if (address) {
        const currentInfo = await provider.getOwnedObjects({
          owner: address,
          filter: {
            StructType: StructType("member", "MemberInfo"),
          },
          options: {
            showType: true,
            showContent: true,
            showDisplay: true,
          },
        });

        if (currentInfo.data.length === 0) {
          updateStatus(false);
        } else {
          if (currentInfo.data[0].data && currentInfo.data[0].data.content) {
            const content = currentInfo.data[0].data.content as any;
            updateUserId(currentInfo.data[0].data.objectId);
            updateUserinfo(content);
            if (content.fields && content.fields.pub_key) {
              const tmp = new Uint8Array(content.fields.pub_key);
              updatePublicKey(new TextDecoder().decode(tmp));
            }
          }
          updateStatus(true);
        }
      }
    })();
  }, [address]);

  const doRegister = async () => {
    console.log(`you input ${userName}`);
    const tx = new TransactionBlock();
    tx.moveCall({
      target: CallTarget("member", "register") as any,
      arguments: [tx.pure(GlobalID), tx.pure(userName), tx.pure("0x6")],
    });
    console.log(tx);
    const result = await signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
    });
    console.log(result);
    updateTransactionResult(result);
  };

  const displayUserName = (info: any) => {
    if (info.fields && info.fields.name) {
      const tmp = new Uint8Array(info.fields.name);
      return new TextDecoder().decode(tmp);
    } else {
      return "";
    }
  };

  const savePublicKey = async () => {
    // const member_info_id = userInfo.
    console.log(`you will save public key ${publicKey} for ${userId}`);
    const tx = new TransactionBlock();
    tx.moveCall({
      target: CallTarget("member", "update_public_key") as any,
      arguments: [tx.pure(userId), tx.pure(publicKey)],
    });
    console.log(tx);
    const result = await signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
    });
    console.log(result);
    updateTransactionResult(result);
  };

  return (
    <>
      {memberRegistered ? (
        <>
          <p>welcome back : {displayUserName(userInfo)} </p>
          <div>
            <textarea
              value={publicKey}
              onChange={(e) => {
                updatePublicKey(e.target.value);
              }}
              className="textarea textarea-bordered h-72 w-5/12 mt-3"
              placeholder="your publicKey"
            />
          </div>
          <div className="mt-3">
            <button onClick={savePublicKey} className="btn btn-primary">
              Save your public key!
            </button>
          </div>
          {/* <pre>{JSON.stringify(userInfo, null, 2)}</pre> */}
        </>
      ) : (
        <div>
          {JSON.stringify(transactionResult)}
          <p>You need register : </p>
          <input
            type="text"
            value={userName}
            placeholder="Input your Name"
            className="input input-bordered input-info w-full max-w-xs mt-2 mr-3"
            onChange={(e) => updateUserName(e.target.value)}
          />
          <button onClick={doRegister} className="btn btn-info">
            Register
          </button>
        </div>
      )}
    </>
  );
};

export default Hello;
