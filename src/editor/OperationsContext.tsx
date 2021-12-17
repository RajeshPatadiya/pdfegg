import React, { createContext, useContext, useReducer } from "react";

const OperationsContext = createContext<any[]>(null!);
const OperationsDispatchContext = createContext<React.Dispatch<any>>(null!);

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

function operationsReducer(operations: any[], action: any) {
  switch (action.type) {
    case "ADD": {
      return [...operations, action.operation];
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
