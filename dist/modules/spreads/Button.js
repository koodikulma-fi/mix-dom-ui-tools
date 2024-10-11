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
import { classNames } from "dom-types";
import { MixDOM } from "mix-dom";
// Let's create it as a spread - it's just a simple composition.
export const Button = (props) => {
    // Parse.
    const { text, look, size, className } = props, passProps = __rest(props, ["text", "look", "size", "className"]);
    const finalClass = classNames("app-button", size, className, look, look === "inline" && "transparent");
    // We use a wrapper only if there is content with MixDOM.WithContent.
    return (MixDOM.def("button", Object.assign({}, passProps, { className: finalClass }),
        text ? MixDOM.def("span", { class: "text" }, text) : null,
        MixDOM.def(MixDOM.WithContent, null,
            MixDOM.def("span", { class: "content" }, MixDOM.Content))));
};
