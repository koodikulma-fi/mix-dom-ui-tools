
// - Imports - //

import { MixDOM, MixDOMRenderOutput } from "mix-dom";
import { MixEnabled } from "./MixEnabled";              // From above.
import { MixEscEnabled } from "./MixEscEnabled";        // From above.
import { MixPopupEnabled } from "./MixPopupEnabled";    // From above.


// - Final component - //

export const PopupButtonMixed = MixDOM.mixFuncsWith(
    MixEnabled,
    MixEscEnabled,
    MixPopupEnabled,
    (_initProps, component) => {
        // Here we combine the features together with a renderer function.
        // .. We simply render a button, attach onClick to open popup, and pass the content.
        // .. So when the popup is opened the passed content from parent chain gets grounded.
        // .. As a refine, we use MixDOM.WithContent to only insert when content is not null-like.
        return (props) => 
            <button onClick={component.toggleEnabled}>
                {props.text}
                <MixDOM.WithContent>
                    <component.WithPopup>{MixDOM.Content}</component.WithPopup>
                </MixDOM.WithContent>
            </button>;
}, {} as { props: { text?: MixDOMRenderOutput; }} ); // Extra info for the composer.
