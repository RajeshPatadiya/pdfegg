import React, { createContext, useContext } from "react";
import Operation from "../pdf-generating/operations/Operation";

const PageOperationsContext = createContext<Operation[]>(null!);
const PageOperationsDispatchContext = createContext<PageOperationsDispatch>(
  null!
);

export function usePageOperations() {
  return useContext(PageOperationsContext);
}

export function usePageOperationsDispatch() {
  return useContext(PageOperationsDispatchContext);
}

export function PageOperationsProvider({
  pageOperations,
  dispatchPageOperationsUpdate,
  children,
}: {
  pageOperations: Operation[];
  dispatchPageOperationsUpdate: (updatedOperations: Operation[]) => void;
  children: React.ReactNode;
}) {
  const dispatch: PageOperationsDispatch = (action) => {
    const updatedOperations = reducer(pageOperations, action);
    dispatchPageOperationsUpdate(updatedOperations);
  };

  return (
    <PageOperationsContext.Provider value={pageOperations}>
      <PageOperationsDispatchContext.Provider value={dispatch}>
        {children}
      </PageOperationsDispatchContext.Provider>
    </PageOperationsContext.Provider>
  );
}

type PageOperationsDispatch = (action: PageOperationsAction) => void;
type PageOperationsAction = AddPageOperation;

interface AddPageOperation {
  type: "ADD";
  operation: Operation;
}

function reducer(
  operations: Operation[],
  action: PageOperationsAction
): Operation[] {
  switch (action.type) {
    case "ADD": {
      return [...operations, action.operation];
    }
    default: {
      return operations;
    }
  }
}
