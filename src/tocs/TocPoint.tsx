
// - Imports - //

import { classNames } from "dom-types";
import { MixDOM } from "mix-dom";


// - TocPoint (scroll to) - //

export interface TocPointProps { tocKey: string; invisible?: boolean; targetable?: boolean; }
export const TocPoint = MixDOM.spread((props: TocPointProps) => <hr class={classNames("ui-toc-point", props.invisible ? "invisible" : "visible", (props.targetable || !props.invisible) && "targetable")} data={{tocKey: props.tocKey}} />);
