import React, {
  useContext,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { InformationFlowContextType } from "./index.d";

const Context = React.createContext<InformationFlowContextType | null>(null);

export const useInformationFlowContext = () => {
  const values = useContext(Context);
  if (values === null) {
    throw Error("values为null");
  }

  return values;
};

export const InformationFlowContext: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [sizes, setSizes] = useState<Record<number, number>>();

  const values = useMemo(() => {
    return {
      sizes,
      setSizes,
    };
  }, [sizes]);

  return <Context.Provider value={values}>{children}</Context.Provider>;
};
