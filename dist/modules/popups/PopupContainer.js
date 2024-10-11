import { MixDOM } from "mix-dom";
import { cleanMargin } from "../fitting/FitBoxAlgoritms";
import { FitBox } from "../fitting/FitBox";
export const PopupContainer = MixDOM.component(component => {
    // Prepare getter for whole - this is a popup container who should overlap the entire window.
    const getContainerRect = () => component.props.getContainerRect && component.props.getContainerRect() || ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight });
    // We only get the offset once - by design.
    // ... Tho...
    // ... Could later also allow it to be updated....
    const offset = {
        top: 0,
        left: 0
    };
    const align = {
        horizontal: component.props.hAlign || "center",
        vertical: component.props.vAlign || "center"
    };
    const element = component.props.getElement && component.props.getElement() || null;
    if (element) {
        const rect = element.getBoundingClientRect();
        const whole = getContainerRect();
        const margin = cleanMargin(component.props.elementMargin == null ? 0 : component.props.elementMargin);
        // <-- Verify margin sides...!
        // align.horizontal = component.props.hAlign || "center"; // (rect.left + rect.width * .5 > whole.width * .5 ? "right" : "left");
        align.vertical = component.props.vAlign || (rect.top + rect.height * .5 > whole.height * .5 ? "bottom" : "top");
        offset.left = rect.left + (align.horizontal === "right" ? -margin.right + rect.width : align.horizontal === "center" ? rect.width * .5 : margin.left);
        offset.top = rect.top + (align.vertical === "top" ? margin.bottom + rect.height : align.vertical === "center" ? rect.height * .5 : -margin.top);
    }
    // Renderer.
    return (props) => {
        return (MixDOM.def("div", { class: "ui-popup-container" },
            MixDOM.def(FitBox, { offset: offset, getContainerRect: getContainerRect, align: align, margin: props.margin },
                MixDOM.def("div", { class: "popup-content" }, MixDOM.Content))));
    };
});
