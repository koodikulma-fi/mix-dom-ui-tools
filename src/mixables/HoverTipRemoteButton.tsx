
// - Imports - //

import { MixDOM, MixDOMRenderOutput, Component } from "mix-dom";
import { MixHoverSignal, MixHoverSignalInfo } from "./MixHoverSignal"; // From above.
import { MixPositionedPopup, MixPositionedPopupInfo } from "./MixPositionedPopup"; // From above.


// - Remote component - //

// Create a remote. Insert it somewhere with: AppTipRemote.Content
export const AppTipRemote = MixDOM.remote();


// - Mixable component - //

interface HoverTipButtonRemoteOwnInfo {
    props: {
        /** Provide the tip here. Can be any render output, or alternatively a function: (component) => output. */
        hoverTip?: MixDOMRenderOutput | ((component: Component<HoverTipButtonRemoteInfo>) => MixDOMRenderOutput);
        className?: string; // Assuming css classes handle button styling.
    }
}
export type HoverTipButtonRemoteInfo = MixHoverSignalInfo & MixPositionedPopupInfo & HoverTipButtonRemoteOwnInfo;
/** Simple button with hovertip. */
// Create the hover tip button - with access to the remote.
export const AppHoverTipButtonRemote = MixDOM.mixFuncsWith(MixHoverSignal, MixPositionedPopup, (_, comp) => {
    // Use our app based component remote.
    comp.popupContainer = AppTipRemote;
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
}, null as any as HoverTipButtonRemoteOwnInfo);
