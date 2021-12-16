import { createContext, useContext, useReducer } from "react";

const OperationsContext = createContext(null);
const OperationsDispatchContext = createContext(null);

export function OperationsProvider({ children }) {
    const [operations, dispatch] = useReducer(
        operationsReducer,
        []
    );

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

function operationsReducer(operations, action) {
    switch (action.type) {
        case 'ADD': {
            return [...operations, action.operation];
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}