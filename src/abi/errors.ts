
// Errors 0-127 are reserved for VM errors
// Errors 128-255 are reserved for contract errors
export const contractErrors = {
    null: { id: 128, message: 'Null reference exception' },
    invalidPrefix: { id: 129, message: 'Invalid serialization prefix' },
    invalidMessage: { id: 130, message: 'Invalid incoming message' },
    constraintsError: { id: 131, message: 'Constraints error' },
    accessDenied: { id: 132, message: 'Access denied' },
    contractStopped: { id: 133, message: 'Contract stopped' },
    invalidArgument: { id: 134, message: 'Invalid argument' },
}