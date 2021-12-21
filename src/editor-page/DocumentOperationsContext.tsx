import React, { createContext, useContext, useReducer } from "react";
import Operation from "../pdf-generating/operations/Operation";

const DocumentOperationsContext = createContext<DocumentOperations>(null!);
const DocumentOperationsDispatchContext =
  createContext<DocumentOperationsDispatch>(null!);

export function useDocumentOperations() {
  return useContext(DocumentOperationsContext);
}

export function useDocumentOperationsDispatch() {
  return useContext(DocumentOperationsDispatchContext);
}

export function DocumentOperationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [documentOperations, dispatch] = useReducer(
    documentOperationsReducer,
    {}
  );

  return (
    <DocumentOperationsContext.Provider value={documentOperations}>
      <DocumentOperationsDispatchContext.Provider value={dispatch}>
        {children}
      </DocumentOperationsDispatchContext.Provider>
    </DocumentOperationsContext.Provider>
  );
}

export type DocumentOperations = {
  [pageNumber: number]: Operation[];
};
type DocumentOperationsDispatch = React.Dispatch<DocumentOperationsAction>;
type DocumentOperationsAction = UpdatePageOperations;

interface UpdatePageOperations {
  type: "UPDATE_PAGE_OPERATIONS";
  pageNumber: number;
  updatedOperations: Operation[];
}

function documentOperationsReducer(
  state: DocumentOperations,
  action: DocumentOperationsAction
): DocumentOperations {
  switch (action.type) {
    case "UPDATE_PAGE_OPERATIONS": {
      return { ...state, [action.pageNumber]: action.updatedOperations };
    }
    default: {
      return state;
    }
  }
}
