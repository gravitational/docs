import { useContext } from "react";
import { Var } from "./Var";
import { VarsContext } from "./context";

interface VarsProps {
  globalVars?: string[];
  pageVars?: string[];
}

export const Vars = ({ globalVars, pageVars }: VarsProps) => {
  const { addField } = useContext(VarsContext);

  const globalFields = globalVars?.map((item, iter) => {
    addField(item);
    return (
      <li key={iter}>
        <Var name={item} />
      </li>
    );
  });

  const pageFields = pageVars?.map((item, iter) => {
    addField(item);
    return (
      <li key={iter}>
        <Var name={item} />
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
