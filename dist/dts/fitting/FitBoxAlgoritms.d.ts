export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}
export type Align = {
    horizontal?: HAlign;
    vertical?: VAlign;
};
export type Offset = {
    top?: number;
    left?: number;
};
export type Margin = number | [number, number] | MarginSides;
export type Size = {
    width: number;
    height: number;
};
export interface MarginSides {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
}
export type HAlign = "left" | "center" | "right";
export type VAlign = "top" | "center" | "bottom";
export type FittingAlgoritm = "push" | "anchored";
export declare enum FitLocks {
    Left = 1,
    Top = 2,
    Right = 4,
    Bottom = 8,
    Horizontal = 5,
    Vertical = 10,
    None = 0,
    All = 15
}
export declare const cleanMargin: (margin: Margin | null | undefined) => {
    top: number;
    left: number;
    right: number;
    bottom: number;
};
export declare class FitBoxAlgoritms {
    static fitToSize(targetRect: Rect, containerRect: Rect, fitLocks?: FitLocks, hAlgoritm?: FittingAlgoritm, vAlgoritm?: FittingAlgoritm): Rect;
    static axisFitPush(tStart: number, tSize: number, cStart: number, cSize: number): [number, number];
    static axisFitAnchored(tStart: number, tSize: number, cStart: number, cSize: number, allowStart?: boolean, allowEnd?: boolean): [number, number];
}
