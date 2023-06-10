import { useWallet } from "@suiet/wallet-kit";
import {
  JsonRpcProvider,
  TransactionBlock,
  devnetConnection,
} from "@mysten/sui.js";
import { useEffect, useState } from "react";
import { GlobalID } from "../utils/const";
import { CallTarget, ObjectLink, StructType, TryDecodeString } from "../utils";

const Server = () => {
  const { chain, signAndExecuteTransactionBlock, address } = useWallet();
  const [servers, updateServers] = useState<Array<any>>([]);
  const provider = new JsonRpcProvider(devnetConnection);
  const [serverName, updateServerName] = useState("");
  const [serverDescription, updateDescription] = useState("");
  const [transactionResult, updateTransactionResult] = useState({});

  useEffect(() => {
    const asyncCall = async () => {
      const result = await provider.getObject({
        id: GlobalID,
        options: {
          showType: true,
          showContent: true,
          showDisplay: false,
        },
      });

      if (result.data && result.data.content) {
        const content = result.data.content as any;
        const serverTableId = content.fields.all_servers.fields.id.id as string;
        const serverTableData = await provider.getDynamicFields({
          parentId: serverTableId,
        });

        const serverIds = serverTableData.data.map((item: any) => {
          return item.name.value;
        });
        console.log("serverids filter: ", serverIds);

        const serverData = await provider.multiGetObjects({
          ids: serverIds,
          options: {
            showType: true,
            showContent: true,
            showDisplay: false,
          },
        });

        const servers = serverData.map((item: any) => {
          const fields = item.data.content.fields;
          return {
            id: fields.id.id,
            name: TryDecodeString(fields.name),
            description: TryDecodeString(fields.description),
            member_acl: fields.member_acl.fields.id.id,
          };
        });

        updateServers(servers);
      }
    };
    asyncCall();
  }, []);

  const doAddServer = async (_event: any) => {
    console.log(
      `you will register this server ${serverName} ${serverDescription}`
    );

    const tx = new TransactionBlock();
    tx.moveCall({
      target: CallTarget("server", "register_server") as any,
      arguments: [
        tx.pure(serverName),
        tx.pure(serverDescription),
        tx.pure(GlobalID),
      ],
    });
    console.log(tx);
    const result = await signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
    });
    console.log(result);
    updateTransactionResult(result);
  };

  const applyUsage = async (server: string) => {
    const info = await provider.getOwnedObjects({
      owner: address as string,
      filter: {
        StructType: StructType("member", "MemberInfo"),
      },
      options: {
        showType: false,
        showContent: false,
        showDisplay: false,
      },
    });
    const infoId = info.data[0].data?.objectId;

    const tx = new TransactionBlock();
    tx.moveCall({
      target: CallTarget("server", "apply_server") as any,
      arguments: [tx.pure(server), tx.pure(infoId)],
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
      <p>{JSON.stringify(chain)}</p>

      <div className="ml-3">
        {servers.map((server: any) => {
          return (
            <div key={server.id} className="mt-3 ">
              <ul>
                <li>
                  <a
                    className="link link-info"
                    href={ObjectLink(server.id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {server.name}
                  </a>
                </li>
                <li>description: {server.description}</li>
                <li>
                  <a
                    className="link link-info"
                    href={`/acl/${server.member_acl}/${server.id}`}
                  >
                    ACL : {server.member_acl}
                  </a>
                </li>
                <button
                  onClick={() => applyUsage(server.id)}
                  className="btn btn-info"
                >
                  Apply for usage
                </button>
              </ul>
            </div>
          );
        })}
      </div>

      <div className="card w-5/12 bg-base-100 shadow-xl m-3">
        <div className="card-title">Register New server:</div>
        <div className="card-body">
          <input
            type="text"
            value={serverName}
            placeholder="Input your Server Name"
            className="input input-bordered input-info w-full"
            onChange={(e) => updateServerName(e.target.value)}
          />
          <input
            type="text"
            value={serverDescription}
            placeholder="Input your Server Description"
            className="input input-bordered input-info w-full"
            onChange={(e) => updateDescription(e.target.value)}
          />
          <button onClick={doAddServer} className="btn btn-info">
            Register New Server
          </button>
        </div>
      </div>

      <pre>{JSON.stringify(transactionResult, null, 2)}</pre>
    </>
  );
};

export default Server;
