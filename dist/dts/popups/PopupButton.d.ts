import { ComponentFunc, ComponentTypeAny } from "mix-dom";
import { ButtonProps } from "../spreads/Button";
export interface PopupButtonInfo {
    props: ButtonProps & {
        ContentComponent?: string | ComponentTypeAny | null;
        container?: HTMLElement;
        fallbackToBody?: boolean;
    };
    state: {
        opened: boolean;
    };
}
/**
 * - This uses props.content (= Component) to display the contents when toggled open.
 * - Define the Button using ButtonProps (including using MixDOM.Content for its content). */
export declare const PopupButton: ComponentFunc<PopupButtonInfo>;
