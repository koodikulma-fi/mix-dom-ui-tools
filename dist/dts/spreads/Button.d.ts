import { MixDOMDOMProps, SpreadFunc } from "mix-dom";
export interface ButtonProps extends MixDOMDOMProps<"button"> {
    text?: string;
    look?: "transparent" | "inline" | "";
    size?: "small" | "medium" | "large";
    className?: string;
}
export declare const Button: SpreadFunc<ButtonProps>;
