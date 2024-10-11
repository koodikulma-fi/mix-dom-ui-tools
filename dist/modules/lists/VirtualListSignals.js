// .. NOT DONE YET..!
// From MixDOM.
import { areEqual, createDataTrigger, numberRange } from "data-memo";
import { classNames } from "dom-types";
import { MixDOM } from "mix-dom";
import { VirtualRow } from "./VirtualRow";
;
// Row scroller component.
// .. Provides very simple virtual scrolling feature based on fixed row height.
// .. Utilizes native behaviour directly, simply uses overflow: auto on the parent and padding-bottom on the scrollable content.
// .. Elements are not given as children, but rendered when needed by index (-> more performant), and each is positioned accordingly (with position: absolute).
// .. Uses resizeObserver as well as onScroll listeners to check whether needs to refresh (mainly if iStart or iEnd has changed).
// .. Note. When rendering the row, uses "rowKey", "rowClassName" and "rowStyle" props of the returned react element to apply on the parent, if found.
export const VirtualListSignals = MixDOM.component(q => {
    q.state = {
        height: 0,
        iStart: -1,
        iEnd: -1
    };
    const containerRef = new MixDOM.Ref();
    // - Upon resizing - //
    // Handle resizing - we want the anchor the scrolling during resizing.
    // .. Otherwise it feels like we're scrolling all over the place.
    // .. Let's implement this as a toggleable feature by using createDataTrigger.
    const onResize = createDataTrigger(() => {
        // Create observer and attach to onDomMount.
        let observer = null;
        const mountListener = (domNode) => {
            observer = new ResizeObserver(onRefresh);
            observer.observe(domNode);
            q.setState({ height: domNode.offsetHeight });
        };
        containerRef.listenTo("domDidMount", mountListener);
        // On unmount.
        const unmountResizer = () => {
            // Remove callbacks.
            containerRef.unlistenTo("domDidMount", mountListener);
            containerRef.unlistenTo("domWillUnmount", unmountResizer);
            // Disconnect observer.
            if (observer)
                observer.disconnect();
            // Clear flags.
            observer = null;
        };
        containerRef.listenTo("domWillUnmount", unmountResizer);
        // Return unmountResizer - will be run if removed.
        return unmountResizer;
    });
    // - Refresh - //
    const onRefresh = () => {
        // Figure out.
        const container = containerRef.getElement();
        const scrollTop = (container === null || container === void 0 ? void 0 : container.scrollTop) || 0;
        const nTolerance = q.props.rowTolerance !== undefined ? q.props.rowTolerance : 2;
        const iMax = q.props.nRows - 1;
        const iStart = Math.min(Math.max(0, Math.floor(scrollTop / q.props.rowHeight - nTolerance)), iMax);
        const iEnd = Math.min(Math.floor((scrollTop + q.state.height) / q.props.rowHeight + nTolerance), iMax);
        const height = (container === null || container === void 0 ? void 0 : container.offsetHeight) || 0;
        // Update - we use shallow check already here, to stop the flow even earlier.
        // .. Note that even if we didn't, we still would not re-render due to default comparison checks.
        const newState = { iStart, iEnd, height };
        if (!areEqual(newState, q.state, 1))
            q.setState(newState);
    };
    const onRowsChanged = createDataTrigger(onRefresh, [q.props.rowHeight, q.props.nRows, q.props.rowTolerance]);
    // - Rendering - //
    // Return renderer.
    return (props) => {
        // Run the effect - to enable / disable resizing.
        onResize(props.handleResizing !== false);
        // Recheck on every render if related props have changed.
        // .. For state, we don't need to check.
        // .. It won't change unless props change or then resize / scrolling (both handled already).
        onRowsChanged([props.rowHeight, props.nRows, props.rowTolerance]);
        // Render rows by callback.
        const nRows = props.nRows;
        const rows = numberRange(q.state.iStart, q.state.iEnd + 1).map(iRow => {
            // Call to render the row - if empty, don't render anything.
            let rowContent = props.renderRow(iRow, nRows, props.rowHeight);
            return rowContent && props.autoWrap !== false ?
                MixDOM.def(VirtualRow, { iRow: iRow, nRows: nRows, rowHeight: props.rowHeight, _key: iRow }, rowContent)
                : rowContent;
        });
        // Render the whole thing.
        return (MixDOM.def("div", { _ref: containerRef, className: classNames("ui-virtual-list", q.props.className), style: Object.assign({ overflow: "auto", display: "flex", flexDirection: "column" }, (q.props.style || {})), onScroll: onRefresh },
            MixDOM.def("div", { className: "list-content", style: Object.assign({ position: "relative", paddingBottom: (nRows * q.props.rowHeight) + "px" }, (q.props.contentStyle || {})) }, rows)));
    };
});
