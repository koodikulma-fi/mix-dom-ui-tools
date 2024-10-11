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
import { createDataTrigger } from "data-memo";
import { classNames } from "dom-types";
import { MixDOM, Ref } from "mix-dom";
import { PopupContainer } from "./PopupContainer";
;
/** PopupTip allows to add hover tip functionality to any dom element / component by "tag" prop (defaults to "div").
 * Note that when using components, they must pass the props (or otherwise catch and implement) for onMouseEnter and onMouseLeave. */
export const PopupTip = MixDOM.component(component => {
    // Prepare.
    const fadeInDelay = 20;
    const buttonRef = new Ref();
    const tipRef = new Ref();
    const getElement = buttonRef.getElement.bind(buttonRef);
    // State.
    let renderedTip = null;
    component.state = {
        showTip: false
    };
    // ... something abotu first render.... component is undedinfed her..
    // Mounting the tip ref- for performing a fade in (needs a tiny technical delay).
    tipRef.listenTo("domDidMount", (elTip) => {
        // Clear all timers.
        component.clearTimers();
        // Check if needs fade in.
        const fadeIn = component.props.tipFadeIn;
        if (!fadeIn || fadeIn < fadeInDelay || !elTip)
            return;
        // Apply fade in.
        elTip.style.opacity = "0";
        elTip.style.transition = "opacity " + fadeIn.toString() + "ms ease-out";
        component.setTimer("fade-delay", () => {
            elTip.style.opacity = "1";
        }, fadeInDelay);
        component.setTimer("fade-in", () => {
            elTip.style.transition = "";
        }, fadeIn);
    });
    const updateTip = () => {
        const RenderTip = component.props.renderTip;
        const tipContent = RenderTip ? typeof RenderTip === "string" ? RenderTip : MixDOM.def(RenderTip, null) : null;
        renderedTip = tipContent ? (MixDOM.def(PopupContainer, { getElement: getElement, margin: component.props.margin, elementMargin: component.props.elementMargin },
            MixDOM.def("div", { class: classNames("popup-tip-container", component.props.tipClass), _ref: tipRef }, tipContent))) : null;
    };
    const showTip = (forced) => {
        updateTip();
        if (renderedTip)
            component.setInState("showTip", forced ? "forced" : true);
    };
    const hideTip = () => {
        component.clearTimers("fade-delay");
        component.clearTimers("fade-in");
        const fadeOut = component.props.tipFadeOut;
        if (!fadeOut || component.hasTimer("fade-out")) {
            component.setInState("showTip", false);
            renderedTip = null;
        }
        else {
            const elTip = tipRef.getElement();
            if (elTip) {
                elTip.style.transition = "opacity " + fadeOut.toString() + "ms ease-out";
                elTip.style.opacity = "0";
                component.setTimer("fade-out", () => {
                    component.setInState("showTip", false);
                    renderedTip = null;
                }, fadeOut);
            }
        }
    };
    const onClick = () => component.state.showTip ? hideTip() : showTip(true);
    const onMouseEnter = () => {
        component.setTimer("waiting", showTip, component.props.tipTimeout != null ? component.props.tipTimeout : 500);
    };
    const onMouseLeave = () => {
        component.clearTimers("waiting");
        if (component.state.showTip === true)
            hideTip();
    };
    const runTipChange = createDataTrigger(() => {
        if (component.state.showTip)
            updateTip();
    });
    // Renderer.
    return (_a, state) => {
        var { tag, tipTimeout, tipContainer, TipRemote, tipFadeIn, tipFadeOut, renderTip, tipClickToggle, tipDisableHover, tipClass, className, margin, elementMargin } = _a, passProps = __rest(_a, ["tag", "tipTimeout", "tipContainer", "TipRemote", "tipFadeIn", "tipFadeOut", "renderTip", "tipClickToggle", "tipDisableHover", "tipClass", "className", "margin", "elementMargin"]);
        runTipChange(renderTip);
        const thruProps = Object.assign(Object.assign({}, passProps), { _ref: buttonRef, className: classNames("ui-popup-tip", className) });
        if (tipClickToggle)
            thruProps.onClick = onClick;
        if (!tipDisableHover) {
            thruProps.onMouseEnter = onMouseEnter;
            thruProps.onMouseLeave = onMouseLeave;
        }
        return (MixDOM.def(tag || "div", thruProps, MixDOM.Content, state.showTip ?
            TipRemote ? (MixDOM.def(TipRemote, null, renderedTip)) : (MixDOM.def(MixDOM.Portal, { container: tipContainer || document.body }, renderedTip)) : null));
    };
});
