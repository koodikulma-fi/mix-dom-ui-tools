import { Align, Margin, Offset, Rect } from "./FitBoxAlgoritms";
export interface FitBoxProps {
    className?: string;
    lockHorizontal?: boolean;
    lockVertical?: boolean;
    margin?: Margin;
    offset?: Offset;
    align?: Align;
    getContainerRect?: () => Rect;
    onMaxSize?: (width: number, height: number) => void;
}
interface FitBoxState extends Rect {
}
export interface FitBoxInfo {
    props: FitBoxProps;
    state: FitBoxState;
}
export declare const FitBox: import("mix-dom").ComponentFunc<FitBoxInfo>;
export {};
