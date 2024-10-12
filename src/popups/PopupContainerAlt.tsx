
// - Imports - //

import { MixDOM, ComponentFunc, ComponentRemoteType } from "mix-dom";


// - Popup container - //

export interface PopupContainerAltProps {
    /** The element to hold the popup for a portal, or a remote component. */
    container?: Node | ComponentRemoteType | null;
    /** The source element that triggered the tooltip. Used for positioning and sizing. */
    sourceElement?: Element | null;
}
// A spread function is enough to do the common composition.
export const PopupContainerAlt = (props: PopupContainerAltProps) => {
    // Content.
    const content = (
        <div
            class="popup-container"
            style="position: absolute; inset: 0; z-index: 10; pointer-events: none; overflow: hidden;"
        >
            <FitBox source={props.sourceElement}>
                <div
                    class="popup-content"
                    style="border: .1em solid #666; background: #000; color: #aaa; padding: .2em .5em;"
                >
                    {MixDOM.Content}
                </div>
            </FitBox>
        </div>
    );
    // Insert into a portal or remote.
    // .. If the popupContainer is a DOM node, then use portal - also if no container given.
    return !props.container || props.container instanceof Node ? 
        <MixDOM.Portal container={props.container as Node | null || document.body}>
            {content}
        </MixDOM.Portal>
    // Otherwise it's a ComponentRemote. (Could check props.container.MIX_DOM_CLASS === "Remote".)
    : <props.container>{content}</props.container>;
};

// Let's create a super simple position handler - the point is the mixables.
const FitBox: ComponentFunc<{ props: { source?: Element | null; } }> = (initProps, comp) => {
    // Set constant props - if the source changes, we'll be unmounted and remounted.
    comp.setConstantProps({ source: true });
    // Let's get the position once.
    const rect = initProps.source ?
        initProps.source.getBoundingClientRect() : { bottom: 0, left: 0 };
    // Then use a renderer.
    return () => <div style={{
        position: "absolute",
        top: (rect.bottom + 10).toString(),
        left: rect.left.toString()
    }}>{MixDOM.Content}</div>;
}
