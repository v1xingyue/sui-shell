import { useWallet } from "@suiet/wallet-kit";
import {
  JsonRpcProvider,
  TransactionBlock,
  devnetConnection,
} from "@mysten/sui.js";
import { useEffect, useState } from "react";
import { CallTarget, ObjectLink, StructType } from "../utils";
import { useParams } from "react-router-dom";

const Acl = () => {
  const { tableId, serverId } = useParams();
  const [adminCap, updateAdminCap] = useState("");

  const { chain, address, signAndExecuteTransactionBlock } = useWallet();
  const [aclList, updateAclList] = useState<Array<any>>([]);
  const provider = new JsonRpcProvider(devnetConnection);
  const [transaction, updateTransaction] = useState({});

  useEffect(() => {
    const asyncCall = async () => {
      console.log(`load server acl ${tableId} for ${serverId}`);
      const result = await provider.getDynamicFields({
        parentId: tableId as string,
      });
      const aclIds = result.data.map((item: any) => item.objectId);
      console.log(aclIds);
      const aclRaw = await provider.multiGetObjects({
        ids: aclIds,
        options: {
          showType: true,
          showContent: true,
        },
      });
      const aclObjects = aclRaw.map((item: any) => {
        const fields = item.data.content.fields;
        console.log(`before map ${fields}`);
        return {
          name: fields.name,
          value: fields.value,
        };
      });

      console.log("aclObjects list : ", aclObjects);

      updateAclList(aclObjects);
    };
    asyncCall();
  }, []);

  const passApply = async (member: any) => {
    console.log(`pass apply ${serverId} with user: ${member}`);
    const capResult = await provider.getOwnedObjects({
      owner: address as any,
      filter: {
        StructType: StructType("server", "ServerAdminCap"),
      },
      options: {
        showType: false,
        showContent: true,
        showDisplay: false,
      },
    });

    const filterCap = capResult.data.filter((item: any) => {
      console.log(item.data.content.fields.server_info_id);
      return item.data.content.fields.server_info_id === serverId;
    });

    if (filterCap.length > 0) {
      const serverCap = filterCap[0];
      console.log("current serverCap : ", serverCap.data?.objectId);
      if (serverCap.data) {
        updateAdminCap(serverCap.data?.objectId);
      }
      const tx = new TransactionBlock();
      tx.moveCall({
        target: CallTarget("server", "pass_member") as any,
        arguments: [
          tx.pure(serverCap.data?.objectId),
          tx.pure(serverId),
          tx.pure(member),
        ],
      });
      // console.log(signAndExecuteTransactionBlock, tx);

      const resData = await signAndExecuteTransactionBlock({
        transactionBlock: tx as any,
      });

      console.log(resData);
      updateTransaction(resData);
    }
  };

  return (
    <>
      <p>{JSON.stringify(chain)}</p>
      <p className="mt-3 font-bold">tableId : {tableId}</p>
      <p className="mt-3 font-bold">serverId : {serverId}</p>
      <p className="mt-3 font-bold">Admin : {adminCap}</p>

      <div className="ml-3">
        {aclList.map((acl: any) => {
          return (
            <div key={acl.name} className="mt-3 ">
              <ul>
                <li>
                  <a
                    className="link link-info"
                    href={ObjectLink(acl.name)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {acl.name}
                  </a>
                  <span className="ml-3">status: {acl.value}</span>

                  {acl.value === 1 ? (
                    <button
                      className="btn btn-primary ml-3"
                      onClick={(e) => {
                        passApply(acl.name);
                      }}
                    >
                      Pass
                    </button>
                  ) : null}
                </li>
              </ul>
            </div>
          );
        })}
      </div>

      <p>{JSON.stringify(transaction)}</p>
    </>
  );
};

export default Acl;
