
// - Imports - //

import { MixDOM, MixDOMRenderOutput, Component } from "mix-dom";
import { MixHoverSignal, MixHoverSignalInfo } from "./MixHoverSignal"; // From above.
import { MixPositionedPopup, MixPositionedPopupInfo } from "./MixPositionedPopup"; // From above.


// - Mixable component - //

interface HoverTipButtonOwnInfo {
    props: {
        /** Provide the tip here. Can be any render output, or alternatively a function: (component) => output. */
        hoverTip?: MixDOMRenderOutput | ((component: Component<HoverTipButtonInfo>) => MixDOMRenderOutput);
        className?: string; // Assuming css classes handle button styling.
    }
}
export type HoverTipButtonInfo = MixHoverSignalInfo & MixPositionedPopupInfo & HoverTipButtonOwnInfo;
/** Simple button with hovertip. */
export const HoverTipButton = MixDOM.mixFuncsWith(
    MixHoverSignal,
    MixPositionedPopup, 
    (_initProps, comp) => {
        // Connect the two separate features together.
        comp.listenTo("onHover", (isHovered) =>
            isHovered ? comp.showPopup(comp.hoverRef.getElement()) : comp.hidePopup());
        // Here we decide how to handle the content - we'll use "hoverTip" prop.
        comp.renderPopup = () => typeof comp.props.hoverTip === "function" ?
            comp.props.hoverTip(comp) : comp.props.hoverTip;
        // Return composition.
        return (props) => (
            <button _ref={comp.hoverRef} class={props.className}>
                {MixDOM.Content}
                <comp.WithTooltip/>
            </button>
        );
    }, null as any as HoverTipButtonOwnInfo
);
