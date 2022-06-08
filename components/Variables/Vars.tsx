import { useContext, useEffect } from "react";
import { Var } from "./Var";
import { VarsContext } from "./context";

interface VarsProps {
  globalVars?: string[];
  pageVars?: string[];
}

export const Vars = ({ globalVars, pageVars }: VarsProps) => {
  const { addField } = useContext(VarsContext);

  useEffect(() => {
    if (Boolean(globalVars)) {
      for (const globalVar of globalVars) {
        addField(globalVar);
      }
    }
  }, [addField, globalVars]);

  useEffect(() => {
    if (Boolean(pageVars)) {
      for (const pageVar of pageVars) {
        addField(pageVar);
      }
    }
  }, [addField, pageVars]);

  const globalFields = globalVars?.map((item, iter) => {
    return (
      <li key={iter}>
        <Var name={item} needLabel />
      </li>
    );
  });

  const pageFields = pageVars?.map((item, iter) => {
    return (
      <li key={iter}>
        <Var name={item} needLabel />
      </li>
    );
  });

  return (
    <div>
      <p>
        You can fill in the variables for more comfortable use of the
        documentation
      </p>
      {Boolean(globalFields) && <ul>{globalFields}</ul>}
      {Boolean(pageFields) && <ul>{pageFields}</ul>}
    </div>
  );
};
