// - INTERFACES - //
export var FitLocks;
(function (FitLocks) {
    FitLocks[FitLocks["Left"] = 1] = "Left";
    FitLocks[FitLocks["Top"] = 2] = "Top";
    FitLocks[FitLocks["Right"] = 4] = "Right";
    FitLocks[FitLocks["Bottom"] = 8] = "Bottom";
    // Shortcuts.
    FitLocks[FitLocks["Horizontal"] = 5] = "Horizontal";
    FitLocks[FitLocks["Vertical"] = 10] = "Vertical";
    FitLocks[FitLocks["None"] = 0] = "None";
    FitLocks[FitLocks["All"] = 15] = "All";
})(FitLocks || (FitLocks = {}));
export const cleanMargin = (margin) => {
    const cMargin = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    if (typeof margin === "number")
        cMargin.top = cMargin.left = cMargin.bottom = cMargin.right = margin;
    else if (margin && margin.constructor === Array) {
        cMargin.left = cMargin.right = margin[0] || 0;
        cMargin.top = cMargin.bottom = margin[1] || 0;
    }
    else if (margin) {
        const m = margin;
        cMargin.left = m.left || 0;
        cMargin.right = m.right || 0;
        cMargin.top = m.top || 0;
        cMargin.bottom = m.bottom || 0;
    }
    return cMargin;
};
export class FitBoxAlgoritms {
    // Static fitting main method.
    static fitToSize(targetRect, containerRect, fitLocks = FitLocks.None, hAlgoritm = "push", vAlgoritm = "push") {
        // Prepare outcome.
        const newRect = Object.assign({}, targetRect);
        // Resize and reposition horizontally.
        if ((fitLocks & FitLocks.Horizontal) !== FitLocks.Horizontal) {
            // Calc.
            let left = newRect.left;
            let width = newRect.width;
            if (hAlgoritm === "anchored")
                [left, width] = FitBoxAlgoritms.axisFitAnchored(newRect.left, newRect.width, containerRect.left, containerRect.width, !(fitLocks & FitLocks.Left), !(fitLocks & FitLocks.Right));
            else if (hAlgoritm === "push")
                [left, width] = FitBoxAlgoritms.axisFitPush(newRect.left, newRect.width, containerRect.left, containerRect.width);
            // Apply.
            newRect.left = left;
            newRect.width = width;
        }
        // Resize and reposition vertically.
        if ((fitLocks & FitLocks.Vertical) !== FitLocks.Vertical) {
            // Calc.
            let top = newRect.top;
            let height = newRect.height;
            if (vAlgoritm === "anchored")
                [top, height] = FitBoxAlgoritms.axisFitAnchored(newRect.top, newRect.height, containerRect.top, containerRect.height, !(fitLocks & FitLocks.Top), !(fitLocks & FitLocks.Bottom));
            else if (vAlgoritm === "push")
                [top, height] = FitBoxAlgoritms.axisFitPush(newRect.top, newRect.height, containerRect.top, containerRect.height);
            // Apply.
            newRect.top = top;
            newRect.height = height;
        }
        // Return new rect.
        return newRect;
    }
    // Static push-based fitting algoritm for one axis.
    static axisFitPush(tStart, tSize, cStart, cSize) {
        // Squeeze to fit the container size.
        if (tSize > cSize)
            tSize = cSize;
        // Push towards the start.
        const tEnd = tStart + tSize;
        const cEnd = cStart + cSize;
        if (tEnd > cEnd)
            tStart -= tEnd - cEnd;
        // Push towards the end.
        if (tStart < cStart)
            tStart = cStart;
        // Return.
        return [tStart, tSize];
    }
    // Static anchor-lock-based fitting algoritm for one axis.
    static axisFitAnchored(tStart, tSize, cStart, cSize, allowStart = true, allowEnd = true) {
        // Prepare.
        const cEnd = cStart + cSize;
        let startEdge = tStart;
        let endEdge = tStart + tSize;
        let leftOver = 0;
        // 1. Align the end side towards start (edge).
        if (allowEnd && (endEdge > cEnd)) {
            const newEdge = cEnd;
            leftOver = newEdge - endEdge;
            endEdge = newEdge;
        }
        // 2. Align the start side towards end (edge + leftover from end).
        if (allowStart && (startEdge + leftOver < cStart)) {
            const newEdge = cStart;
            leftOver = newEdge - (startEdge + leftOver);
            startEdge = newEdge;
        }
        // 3. Realign the end side towards start (edge + leftover from start).
        if (leftOver > 0 && allowEnd && (endEdge + leftOver > cEnd)) {
            endEdge = cEnd;
            leftOver = 0;
        }
        // Apply.
        return [startEdge, endEdge - startEdge];
    }
}
