import { useCallback, useContext, useEffect } from "react";
import { VarsContext } from "./context";

interface VarProps {
  name: string;
  needLabel?: boolean;
}

export const Var = ({ name, needLabel }: VarProps) => {
  const { fields, setField } = useContext(VarsContext);

  const onChange = useCallback(
    (event) => {
      setField(name, event.target.value);
    },
    [name, setField]
  );

  useEffect(() => {}, [fields]);

  const input = (
    <input
      type="text"
      name={name}
      placeholder={name}
      onChange={onChange}
      value={fields[name] || ""}
    />
  );

  if (needLabel) {
    return (
      <label>
        {name}:{input}
      </label>
    );
  }

  return <>{input}</>;
};
