import { useState, useCallback } from "react";

interface VarProps {
  name: string;
}

export const Var = ({ name }: VarProps) => {
  const [value, setValue] = useState<string>(name);

  const onChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  return (
    <label>
      {name}:
      <input type="text" name={name} placeholder={name} onChange={onChange} />
    </label>
  );
};
