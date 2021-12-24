import React, { createContext, useContext, useReducer } from "react";
import Operation from "../pdf-generating/operations/Operation";

const DocumentOperationsContext = createContext<DocumentOperationsState>(null!);
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
  const [documentOperations, dispatch] = useReducer(reducer, initialState);

  return (
    <DocumentOperationsContext.Provider value={documentOperations}>
      <DocumentOperationsDispatchContext.Provider value={dispatch}>
        {children}
      </DocumentOperationsDispatchContext.Provider>
    </DocumentOperationsContext.Provider>
  );
}

type DocumentOperationsState = {
  selectedPageNumber: number;
  operationsPerPage: {
    [pageNumber: number]: Operation[];
  };
};
type DocumentOperationsDispatch = React.Dispatch<DocumentOperationsAction>;
type DocumentOperationsAction = ChangeSelectedPage | UpdatePageOperations;

interface ChangeSelectedPage {
  type: "CHANGE_SELECTED_PAGE";
  newSelectedPageNumber: number;
}

interface UpdatePageOperations {
  type: "UPDATE_PAGE_OPERATIONS";
  pageNumber: number;
  updatedOperations: Operation[];
}

const initialState: DocumentOperationsState = {
  selectedPageNumber: 1,
  operationsPerPage: {},
};

function reducer(
  state: DocumentOperationsState,
  action: DocumentOperationsAction
): DocumentOperationsState {
  switch (action.type) {
    case "CHANGE_SELECTED_PAGE": {
      return {
        ...state,
        selectedPageNumber: action.newSelectedPageNumber,
      };
    }
    case "UPDATE_PAGE_OPERATIONS": {
      return {
        ...state,
        operationsPerPage: {
          ...state.operationsPerPage,
          [action.pageNumber]: action.updatedOperations,
        },
      };
    }
    default: {
      return state;
    }
  }
}
