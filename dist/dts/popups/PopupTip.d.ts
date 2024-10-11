import { DOMTags } from "dom-types";
import { MixDOMDOMProps, ComponentTypeAny, ComponentRemoteType } from "mix-dom";
import { Margin } from "../fitting/FitBoxAlgoritms";
export interface PopupTipInfo {
    props: MixDOMDOMProps & {
        /** Define the dom tag or a component to render at the root - it should accept onMouseEnter and onMouseLeave props (or onClick alternatively). */
        tag?: DOMTags | ComponentTypeAny;
        renderTip?: string | ComponentTypeAny;
        /** Defaults to 500ms. */
        tipTimeout?: number;
        tipFadeIn?: number;
        tipFadeOut?: number;
        tipContainer?: Element | null;
        /** Alternative to using tipContainer (or its document.body default), can use a Remote component. */
        TipRemote?: ComponentRemoteType;
        /** Extra class to put the positioned tip container (inside the popup). */
        tipClass?: string;
        /** Whether toggles the tip by click event (using onClick prop). */
        tipClickToggle?: boolean;
        /** Whether disables using onMouseEnter and onMouseLeave. */
        tipDisableHover?: boolean;
        margin?: Margin;
        elementMargin?: Margin;
    };
    state: {
        showTip: boolean | "forced";
    };
    timers: "waiting" | "fade-delay" | "fade-in" | "fade-out";
}
/** PopupTip allows to add hover tip functionality to any dom element / component by "tag" prop (defaults to "div").
 * Note that when using components, they must pass the props (or otherwise catch and implement) for onMouseEnter and onMouseLeave. */
export declare const PopupTip: import("mix-dom").ComponentFunc<PopupTipInfo>;
