import { MixDOM } from "mix-dom";
// export const VirtualRow: ComponentFunc<{ props: VirtualRowProps }> = (_props, _component) => {
// 	return (props) => {
// export const VirtualRow: SpreadFunc<VirtualRowProps> = (props) => {
export const VirtualRow = (props) => {
    // Prepare style.
    const rowStyle = {
        position: "absolute",
        top: (props.rowHeight * props.iRow) + "px",
        height: props.rowHeight,
        width: "100%"
    };
    // Wrap.
    return (MixDOM.def("div", { class: "ui-virtual-row", style: rowStyle }, MixDOM.Content));
};
// }
