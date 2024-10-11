// - Imports - //
import { classNames } from "dom-types";
import { MixDOM } from "mix-dom";
export const TocPoint = MixDOM.spread((props) => MixDOM.def("hr", { class: classNames("ui-toc-point", props.invisible ? "invisible" : "visible", (props.targetable || !props.invisible) && "targetable"), data: { tocKey: props.tocKey } }));
