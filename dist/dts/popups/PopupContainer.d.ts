import { HAlign, VAlign, Rect, Margin } from "../fitting/FitBoxAlgoritms";
export interface PopupContainerProps {
    getElement?: () => HTMLElement | null;
    getContainerRect?: () => Rect;
    hAlign?: HAlign;
    vAlign?: VAlign;
    /** Margin from container rect. */
    margin?: Margin;
    /** Margin from element (by getElement) if provided. */
    elementMargin?: Margin;
}
export declare const PopupContainer: import("mix-dom").ComponentFunc<{
    props: PopupContainerProps;
}>;
