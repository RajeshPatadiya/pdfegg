import { useEffect, useReducer } from "react";
import { DocumentOperationsProvider } from "./DocumentOperationsContext";

const maxHistoryStackSize = 100;

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

  const ctrlZListener = (e: KeyboardEvent) => {
    const ctrl = e.ctrlKey || e.metaKey;
    const alt = e.altKey;
    const shift = e.shiftKey;
    const z = e.key === "z";

    if (ctrl && !alt && !shift && z) {
      undo();
    }
  };

  const ctrlShiftZListener = (e: KeyboardEvent) => {
    const ctrl = e.ctrlKey || e.metaKey;
    const alt = e.altKey;
    const shift = e.shiftKey;
    const z = e.key === "z";

    if (ctrl && !alt && shift && z) {
      redo();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", ctrlZListener);
    document.addEventListener("keydown", ctrlShiftZListener);

    return () => {
      document.removeEventListener("keydown", ctrlZListener);
      document.removeEventListener("keydown", ctrlShiftZListener);
    };
  });

  return (
    <DocumentOperationsProvider
      state={currentState}
      dispatchState={pushNewState}
    >
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
  history: [null],
};

function reducer(
  state: StateHistory,
  action: StateHistoryAction
): StateHistory {
  switch (action.type) {
    case "PUSH_NEW_STATE": {
      const i = state.currentStateIndex;
      const history = [...state.history.slice(0, i + 1), action.newState].slice(
        -maxHistoryStackSize
      );
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
