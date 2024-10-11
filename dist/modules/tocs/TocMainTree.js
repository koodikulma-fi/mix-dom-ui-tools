// - Imports - //
import { MixDOM } from "mix-dom";
import { TocTreeItems } from "./TocTree";
import { Button } from "../spreads/Button";
import { classNames } from "dom-types";
;
export const TocMainTree = (_props, component) => {
    // Local state and callback.
    component.state = {
        uncollapsed: null,
    };
    const onCollapseToggle = () => {
        // If selected, toggle between false and null (= will be shown).
        const item = component.props.item;
        if (component.props.selectedMain === (item.main === undefined ? item.tocKey : item.main))
            component.setInState("uncollapsed", component.state.uncollapsed !== false ? false : null);
        // If unselected, toggle between true and null (= won't be shown).
        else
            component.setInState("uncollapsed", !component.state.uncollapsed || null);
    };
    // Renderer.
    return () => {
        // Parse.
        const { selectedMain, selectedTocKey, item, index, className, level } = component.props;
        // Special states.
        const isSelected = selectedMain === (item.main === undefined ? item.tocKey : item.main);
        const isCollapsed = component.state.uncollapsed ? false : component.state.uncollapsed === false || !isSelected;
        // Correct the state immediately.
        // .. In MixDOM this is perfectly fine: it will simply set the state and immedialy call the render method again.
        // .. You can control it in settings.maxReRenders, default is to allow 1 re-render.
        if (!isSelected && component.state.uncollapsed === false)
            component.setInState("uncollapsed", null);
        // <-- Another approach would be to use a local variable (and then force update on the special occasion).
        // ... But this looks like much better coding practice than hacky extra stuff.
        // Prepare.
        const path = isCollapsed ? "M 6.5,2 3.5,5 6.5,8" : "M 2,3.5 5,6.5 8,3.5";
        // Render.
        // .. Note that we don't pass treeHandler or useNumbering any further.
        const onItemClick = (_e) => component.props.onSelect(component.props.item);
        return (MixDOM.def("li", { class: classNames("ui-toc-sub-tree", "level-" + level.toString(), "toc-main-level", "style-panel", isSelected && "selected", className) },
            MixDOM.def("div", { class: classNames("main-tree-title flex-row flex-align-items-stretch flex-justify-content-start", isSelected && (!selectedTocKey || item.tocKey === selectedTocKey) && "selected") },
                MixDOM.def(Button, { look: "transparent", onClick: onItemClick, className: "flex-grow" },
                    MixDOM.def("span", { class: "index" }, (index + 1).toString() + ". "),
                    MixDOM.def("span", { class: "title" }, item.title)),
                MixDOM.def(Button, { class: "tree-collapse", look: "transparent", onClick: onCollapseToggle },
                    MixDOM.def("svg", { viewBox: "0 0 10 10" },
                        MixDOM.def("path", { d: path, fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linejoin": "round", "stroke-linecap": "round" })))),
            !isCollapsed && item.children ? (MixDOM.def("ul", null,
                MixDOM.def(TocTreeItems, { items: item.children, onSelect: component.props.onSelect, level: level + 1, selectedTocKey: isSelected ? component.props.selectedTocKey : undefined }))) : null));
    };
};
