
// - Helpers - //

export function computeSnappedValue(snapStep: number, value: number): number {
    if (!snapStep)
        return value;
    // For better float rounding, use `/ (1.0 / snapStep)` instead of `* snapStep`.
    return snapStep ? Math.round(value / snapStep) / (1.0 / snapStep) : value;
}
