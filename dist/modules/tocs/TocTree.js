// - Imports - //
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
import { Button } from "../spreads/Button";
export const TocTreeItems = MixDOM.spread(props => props.items.map((dataItem, index) => {
    if (dataItem.children) {
        const TreeClass = props.treeHandler || TocSubTree;
        const passProps = { item: dataItem, level: props.level || 1, index, onSelect: props.onSelect, treeHandler: props.treeHandler };
        if (!props.treeHandler)
            passProps.selectedTocKey = props.selectedTocKey;
        return MixDOM.def(TreeClass, Object.assign({}, passProps));
    }
    return (MixDOM.def(TocItem, { dataItem: dataItem, selected: dataItem.tocKey === props.selectedTocKey, onSelect: props.onSelect, index: index }));
}));
// Let's use a full component to cut extra updates.
// .. With just a spread, we'd flow down all, but instead the point is to use the treeHandler with a wrapper component.
// .. This way, our data also stays clean. The handler can receive extra props.
export const TocTree = (props, _comp) => {
    const { className } = props, passProps = __rest(props, ["className"]);
    return (MixDOM.def("div", { class: classNames("ui-toc-tree", "wrapper", className) },
        MixDOM.def("ul", null,
            MixDOM.def(TocTreeItems, Object.assign({}, passProps)))));
};
export const TocSubTree = MixDOM.component(component => {
    const onItemClick = (_e) => component.props.onSelect(component.props.item);
    return (props) => {
        return (MixDOM.def("li", { class: classNames("ui-toc-sub-tree", "level-" + props.level.toString(), props.className) },
            MixDOM.def("div", { class: classNames("sub-tree-title", props.selectedTocKey === props.item.tocKey && "selected") },
                MixDOM.def(Button, { look: "transparent", text: props.item.title, onClick: onItemClick })),
            props.item.children ? (MixDOM.def("ul", null,
                MixDOM.def(TocTreeItems, { items: props.item.children, onSelect: props.onSelect, level: props.level + 1, selectedTocKey: props.selectedTocKey }))) : null));
    };
});
export const TocItem = function (_initProps, component) {
    const onItemClick = (_e) => component.props.onSelect(component.props.dataItem);
    return (props) => (MixDOM.def("li", { class: classNames("ui-toc-item", this.props.selected && "selected") },
        MixDOM.def(Button, { look: "transparent", text: props.dataItem.title, onClick: onItemClick })));
};
