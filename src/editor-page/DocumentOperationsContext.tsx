import React, { createContext, useContext } from "react";
import Operation from "../pdf-generating/operations/Operation";

const DocumentOperationsContext = createContext<DocumentOperationsState>(null!);
const DocumentOperationsDispatchContext =
  createContext<DocumentOperationsDispatch>(null!);

export function useDocumentOperations() {
  return useContext(DocumentOperationsContext);
}

export function useDocumentPageOperations(pageNumber: number) {
  return useContext(DocumentOperationsContext).operationsPerPage[pageNumber];
}

export function useDocumentOperationsDispatch() {
  return useContext(DocumentOperationsDispatchContext);
}

export function DocumentOperationsProvider({
  state,
  dispatchState,
  children,
}: {
  state: DocumentOperationsState;
  dispatchState: (newState: DocumentOperationsState) => void;
  children: React.ReactNode;
}) {
  state = state || initialState;

  const dispatch: DocumentOperationsDispatch = (action) => {
    const newState = reducer(state, action);
    dispatchState(newState);
  };

  return (
    <DocumentOperationsContext.Provider value={state}>
      <DocumentOperationsDispatchContext.Provider value={dispatch}>
        {children}
      </DocumentOperationsDispatchContext.Provider>
    </DocumentOperationsContext.Provider>
  );
}

// Contains document manipulations that can be undone/redone.
type DocumentOperationsState = {
  operationsPerPage: {
    [pageNumber: number]: Operation[];
  };
};
type DocumentOperationsDispatch = React.Dispatch<DocumentOperationsAction>;
type DocumentOperationsAction = UpdatePageOperations;

interface UpdatePageOperations {
  type: "UPDATE_PAGE_OPERATIONS";
  pageNumber: number;
  updatedOperations: Operation[];
}

const initialState: DocumentOperationsState = {
  operationsPerPage: {},
};

function reducer(
  state: DocumentOperationsState,
  action: DocumentOperationsAction
): DocumentOperationsState {
  switch (action.type) {
    case "UPDATE_PAGE_OPERATIONS": {
      return {
        ...state,
        operationsPerPage: {
          ...state.operationsPerPage,
          [action.pageNumber]: action.updatedOperations,
        },
      };
    }
  }
}
