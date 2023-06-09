import { NETWORK, SUI_PACKAGE } from "./const";

const ExplorerBase = "https://suiexplorer.com";

export const TransacitonLink = (digest: string, module: string) => {
  return `${ExplorerBase}/txblock/${digest}?module=${module}&network=${NETWORK}`;
};

export const ObjectLink = (objectId: string) => {
  return `${ExplorerBase}/object/${objectId}?network=${NETWORK}`;
};

export const PackageLink = () => {
  return `${ExplorerBase}/object/${SUI_PACKAGE}?network=${NETWORK}`;
};

export const CallTarget = (module:string,name:string)=>{
    return `${SUI_PACKAGE}::${module}::${name}`;
}

export const StructType = (module:string,name:string)=>{
  return `${SUI_PACKAGE}::${module}::${name}`;
}