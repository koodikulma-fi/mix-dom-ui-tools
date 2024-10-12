
// - Imports - //

import { MixDOM, ReadComponentInfo } from "mix-dom";
import { computeSnappedValue } from "../common/numericHelpers";
import { MixOnEscape } from "./MixOnEscape";
import { MixMouseMove } from "./MixMouseMove";
import { MixNumberSlider } from "./MixNumberSlider";


// - Final component - //

export interface NumberSliderOwnInfo {
    props: {
        onValue?(value: number): void;
        showValue?: boolean; // Defaults to true.
        snapStep?: number | null;
    };
}
export const NumberSlider = MixDOM.mixFuncsWith(
    MixOnEscape,
    MixMouseMove,
    MixNumberSlider,
    (_initProps, comp) => {
        // Connect the features together.
        const origSetter = comp.setValue;
        comp.setValue = (value) => {
            // Snap and set.
            const props = comp.props;
            if (props.snapStep)
                value = computeSnappedValue(props.snapStep, value);
            origSetter(value); // To support classes: origSetter.call(comp, value);
            // Call out with props - we use signals for internal.
            props.onValue && props.onValue(value);
        };
        comp.listenTo("onMouseStart", () => comp.useEscape(true));
        comp.listenTo("onMouseEnd", () => comp.useEscape(false));
        comp.listenTo("onEscape", comp.cancelMouse);
        // Return renderer to compose our slider.
        return (props, state) => {
            const minValue = props.minValue;
            const span = props.maxValue - minValue;
            const relVal = span ? (state.value - minValue) / span : 0;
            // The CSS class rules should build the layout accordingly.
            // .. We just set "left" position for the point, here.
            return (
                <div class="number-slider">
                    <div class="slider-input" _ref={comp.mouseRef}>
                        <div class="slider-line" />
                        <div class="slider-point" style={{ left: (relVal * 100) + "%" }} />
                    </div>
                    <div class="slider-value" _disable={props.showValue === false}>
                        {state.value}
                    </div>
                </div>
            );
        }
    },
    null as any as NumberSliderOwnInfo
);
// Go get the typing.
export type NumberSliderInfo = ReadComponentInfo<typeof NumberSlider>;
// export type NumberSliderInfo = typeof NumberSlider["_Info"] & {}; // Alternative.