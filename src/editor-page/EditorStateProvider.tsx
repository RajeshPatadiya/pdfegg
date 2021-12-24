import { useReducer } from "react";
import { DocumentOperationsProvider } from "./DocumentOperationsContext";

function EditorStateProvider({ children }: { children: React.ReactNode }) {
  const [stateHistory, stateHistoryDispatch] = useReducer(
    reducer,
    initialState
  );

  const { currentStateIndex, history } = stateHistory;
  const currentState = history[currentStateIndex];

  const pushNewState = (newState: any) =>
    stateHistoryDispatch({
      type: "PUSH_NEW_STATE",
      newState,
    });

  const undo = () =>
    stateHistoryDispatch({
      type: "UNDO",
    });

  const redo = () =>
    stateHistoryDispatch({
      type: "REDO",
    });

  return (
    <DocumentOperationsProvider
      state={currentState}
      dispatchState={pushNewState}
    >
      {history.length}
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      {children}
    </DocumentOperationsProvider>
  );
}

type StateHistory = {
  currentStateIndex: number;
  history: any[];
};
type StateHistoryAction = PushNewState | Undo | Redo;

interface PushNewState {
  type: "PUSH_NEW_STATE";
  newState: any;
}

interface Undo {
  type: "UNDO";
}

interface Redo {
  type: "REDO";
}

const initialState: StateHistory = {
  currentStateIndex: 0,
  history: [],
};

function reducer(
  state: StateHistory,
  action: StateHistoryAction
): StateHistory {
  switch (action.type) {
    case "PUSH_NEW_STATE": {
      // TODO: Handle pushing after undos
      // TODO: Limit history stack size
      const history = [...state.history, action.newState];
      return {
        currentStateIndex: history.length - 1,
        history,
      };
    }
    case "UNDO": {
      const i = state.currentStateIndex;
      if (i === 0) return state;
      return {
        ...state,
        currentStateIndex: i - 1,
      };
    }
    case "REDO": {
      const i = state.currentStateIndex;
      const length = state.history.length;
      if (i === length - 1) return state;
      return {
        ...state,
        currentStateIndex: i + 1,
      };
    }
    default: {
      return state;
    }
  }
}

export default EditorStateProvider;
