import { CSSProperties } from "dom-types";
import { MixDOMRenderOutput } from "mix-dom";
export interface VirtualListSignalsInfo {
    props: {
        rowHeight: number;
        nRows: number;
        renderRow: (iRow: number, nRows: number, rowHeight: number) => MixDOMRenderOutput;
        autoWrap?: boolean;
        handleResizing?: boolean;
        rowTolerance?: number;
        className?: string;
        style?: CSSProperties;
        contentStyle?: CSSProperties;
    };
    state: {
        height: number;
        iStart: number;
        iEnd: number;
    };
}
export declare const VirtualListSignals: import("mix-dom").ComponentFunc<VirtualListSignalsInfo>;
