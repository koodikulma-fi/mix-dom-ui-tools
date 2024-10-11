// SYNTAX HIGHLIGHTING / PRISM ALTERNATIVES:
// https://react.libhunt.com/react-syntax-highlighter-alternatives
// https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/
import { MixDOM } from "mix-dom";
const toDigits = (num, digits, empty = " ", allowOverflow = true) => {
    let str = num.toString();
    const nStr = str.length;
    if (nStr >= digits)
        return allowOverflow ? str : str.slice(0, digits);
    for (let i = nStr; i < digits; i++)
        str = empty + str;
    return str;
};
export const Code = MixDOM.spread((props) => {
    const lang = props.lang || "tsx";
    const lOffset = typeof props.numbering === "number" ? props.numbering : props.numbering ? 1 : null;
    let code = Prism.highlight(props.code, Prism.languages[lang], lang);
    if (lOffset !== null)
        code = code.split("\n").map((c, i) => "<span class='line'><span class='line-number'>" + toDigits(i + lOffset, 3) + ". </span>" + c + "</span>").join("\n");
    return MixDOM.def("pre", { class: "style-panel scrollable" }, MixDOM.defHTML(code, "code", { class: lOffset !== null ? "show-numbering" : "" }));
});
export const InlineCode = MixDOM.spread((props) => {
    const lang = props.lang || "tsx";
    return MixDOM.defHTML(Prism.highlight(props.code, Prism.languages[lang], lang), "code", { class: "inline style-panel" });
});
export const Inline = InlineCode;
export const Small = MixDOM.spread(function (props) {
    return MixDOM.def("span", { class: "small" },
        props.text,
        MixDOM.Content);
});
export const VerySmall = MixDOM.spread(function (props) {
    return MixDOM.def("span", { class: "very-small" },
        props.text,
        MixDOM.Content);
});
export const Big = MixDOM.spread(function (props) {
    return MixDOM.def("span", { class: "big" },
        props.text,
        MixDOM.Content);
});
