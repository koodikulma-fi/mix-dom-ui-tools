
// From MixDOM.
import { CSSProperties } from "dom-types";
import { MixDOM } from "mix-dom";

// Default row renderer.
export interface VirtualRowProps {
	iRow: number;
	nRows: number;
	rowHeight: number;
}
// export const VirtualRow: ComponentFunc<{ props: VirtualRowProps }> = (_props, _component) => {
// 	return (props) => {
// export const VirtualRow: SpreadFunc<VirtualRowProps> = (props) => {
export const VirtualRow = (props: VirtualRowProps) => {
	// Prepare style.
	const rowStyle: CSSProperties = {
		position: "absolute",
		top: (props.rowHeight * props.iRow) + "px",
		height: props.rowHeight,
		width: "100%"
	};
	// Wrap.
	return (
		<div class="ui-virtual-row" style={rowStyle} >
			{MixDOM.Content}
		</div>
	);
}
// }
