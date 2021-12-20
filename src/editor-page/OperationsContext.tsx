import React, { createContext, useContext, useReducer } from "react";
import Operation from "../pdf-generator/operations/Operation";

type Operations = Operation[];
type OperationsAction = any;
type OperationsDispatch = React.Dispatch<OperationsAction>;

const OperationsContext = createContext<Operations>(null!);
const OperationsDispatchContext = createContext<OperationsDispatch>(null!);

export function OperationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [operations, dispatch] = useReducer(operationsReducer, []);

  return (
    <OperationsContext.Provider value={operations}>
      <OperationsDispatchContext.Provider value={dispatch}>
        {children}
      </OperationsDispatchContext.Provider>
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  return useContext(OperationsContext);
}

export function useOperationsDispatch() {
  return useContext(OperationsDispatchContext);
}

function operationsReducer(
  operations: Operations,
  action: OperationsAction
): Operations {
  switch (action.type) {
    case "ADD": {
      return [...operations, action.operation];
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
