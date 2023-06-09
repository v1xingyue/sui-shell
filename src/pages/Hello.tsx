import { useEffect, useState } from "react";
import { SuiProvider } from "../utils/provider";
import { useParams } from "react-router-dom";

const Hello = () => {
  const provider = SuiProvider();
  const [result, updateResult] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const asyncAction = async () => {
      const result = await provider.getDynamicFields({
        parentId: id as string,
      });
      updateResult(result);
    };
    asyncAction();
  }, []);

  return (
    <>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  );
};

export default Hello;
