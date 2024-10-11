// NOT INCLUDED CURRENTLY..
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { MixDOM } from "mix-dom";
import { Button } from "../spreads/Button";
/**
 * - This uses props.content (= Component) to display the contents when toggled open.
 * - Define the Button using ButtonProps (including using MixDOM.Content for its content). */
export const PopupButton = MixDOM.component(component => {
    // State.
    component.state = {
        opened: false
    };
    const togglePopup = () => component.setInState("opened", !component.state.opened);
    // Renderer.
    return (props) => {
        const { ContentComponent } = props, passProps = __rest(props, ["ContentComponent"]);
        return (MixDOM.def(Button, Object.assign({}, passProps, { onClick: togglePopup }),
            MixDOM.Content,
            component.state.opened && props.ContentComponent ?
                MixDOM.def(MixDOM.Portal, { container: props.container || props.fallbackToBody !== false && document.body || null }, props.ContentComponent ? typeof props.ContentComponent === "string" ? MixDOM.def("span", null, props.ContentComponent) : MixDOM.def(props.ContentComponent, null) : null)
                : null));
    };
});
