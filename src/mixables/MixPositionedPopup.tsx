
// - Imports - //

import { MixDOM, ComponentFunc, ComponentRemoteType, ComponentTypeAny, MixDOMRenderOutput } from "mix-dom";
import { PopupContainerAlt } from "../popups/PopupContainerAlt";


// - Mixable component - //

export interface MixPositionedPopupInfo {
    state: {
        popupOpened: boolean;
    };
    class: {
        // For renderer.
        /** To insert the content. */
        WithTooltip: ComponentTypeAny;
        /** This should be assigned to provide the popup content. */
        renderPopup?(): MixDOMRenderOutput;

        // API.
        /** Feature to show a popup. */
        showPopup(byElement: Element | null): void;
        /** Feature to hide a popup, if opened. */
        hidePopup(): void;

        // Options.
        /** Where to insert the popup. Internally defaults to document.body */
        popupContainer?: Element | ComponentRemoteType | null;
    };
}
/** Provides popup feature with auto positioning. Renderer should include <comp.WithTooltip/>. */
export const MixPositionedPopup: ComponentFunc<MixPositionedPopupInfo> = (_initProps, comp) => {
    // Init state.
    comp.state = { popupOpened: false };
    // Create features.
    let popupSourceEl: Element | null = null;
    comp.showPopup = (byElement) => {
        popupSourceEl = byElement;
        comp.setInState("popupOpened", true);
    }
    comp.hidePopup = () => {
        popupSourceEl = null;
        if (comp.state.popupOpened)
            comp.setInState("popupOpened", false);
    }
    // Let's create a spread func that'll return null unless should show the popup.
    // .. Could also add animation support here - but for simplicity just instant on / off.
    comp.WithTooltip = () => {
        // Emptiness.
        if (!comp.state.popupOpened)
            return null;
        // Get content.
        const content = comp.renderPopup ? comp.renderPopup() : null;
        if (content == null)
            return null;
        // Render with sizing support.
        return (
            <PopupContainerAlt
                container={comp.popupContainer}
                sourceElement={popupSourceEl}
            >
                {content}
            </PopupContainerAlt>
        );
    }
    // Nothing to render.
    return null;
};
