// Libraries.
import { createDataTrigger } from "data-memo";
import { MixDOM } from "mix-dom";
// From our local examples.
import { Button } from "../spreads/Button";
// The actual rendering source.
export const ItemList = MixDOM.component((component) => {
    // To reuse callbacks we can use a trigger with a named dictionary.
    // .. Whenever the names have changed, we create new callbacks, reusing old ones if found.
    let callbacks = {};
    const rebuildCallbacks = createDataTrigger(() => {
        callbacks = component.props.names.reduce((cum, name) => (cum[name] = callbacks[name] || (() => component.props.onSelect && component.props.onSelect(name))
            , cum), {});
    });
    // Return renderer.
    return (props) => {
        // Run the callbacks trigger.
        rebuildCallbacks(props.names);
        // Render.
        const Item = props.renderItem || Button;
        return (MixDOM.def("div", { class: "ui-item-list" }, props.names.map(name => MixDOM.def(Item, { text: name, onClick: callbacks[name] }))));
    };
});
