
import { createDataTrigger } from "data-memo";
import { classNames, DOMTags } from "dom-types";
import { MixDOM, MixDOMDOMProps, MixDOMRenderOutput, ComponentTypeAny, ComponentRemoteType, Ref } from "mix-dom";
import { PopupContainer } from "./PopupContainer";
import { Margin } from "../fitting/FitBoxAlgoritms";

export interface PopupTipInfo {
	props: MixDOMDOMProps & {
		/** Define the dom tag or a component to render at the root - it should accept onMouseEnter and onMouseLeave props (or onClick alternatively). */
		tag?: DOMTags | ComponentTypeAny;
		renderTip?: string | ComponentTypeAny; // (component: Component<PopupTipProps, PopupTipState>) => MixDOMRenderOutput;
		/** Defaults to 500ms. */
		tipTimeout?: number;
		tipFadeIn?: number;
		tipFadeOut?: number;
		tipContainer?: Element | null;
		/** Alternative to using tipContainer (or its document.body default), can use a Remote component. */
		TipRemote?: ComponentRemoteType;
		/** Extra class to put the positioned tip container (inside the popup). */
		tipClass?: string;
		/** Whether toggles the tip by click event (using onClick prop). */
		tipClickToggle?: boolean;
		/** Whether disables using onMouseEnter and onMouseLeave. */
		tipDisableHover?: boolean;
		margin?: Margin;
		elementMargin?: Margin;
	};
	state: {
		showTip: boolean | "forced";
	};
	timers: "waiting" | "fade-delay" | "fade-in" | "fade-out";
};

/** PopupTip allows to add hover tip functionality to any dom element / component by "tag" prop (defaults to "div").
 * Note that when using components, they must pass the props (or otherwise catch and implement) for onMouseEnter and onMouseLeave. */
export const PopupTip = MixDOM.component<PopupTipInfo>(component => {

	// Prepare.
	const fadeInDelay = 20;
	const buttonRef = new Ref<HTMLButtonElement>();
	const tipRef = new Ref<HTMLDivElement>();
	const getElement = buttonRef.getElement.bind(buttonRef);

	// State.
	let renderedTip: MixDOMRenderOutput = null;
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
		const tipContent = RenderTip ? typeof RenderTip === "string" ? RenderTip : <RenderTip/> : null;
		renderedTip = tipContent ? (
			<PopupContainer getElement={getElement} margin={component.props.margin} elementMargin={component.props.elementMargin} >
				<div class={classNames("popup-tip-container", component.props.tipClass)} _ref={tipRef}>{tipContent}</div>
			</PopupContainer>
		) : null;
	}
	const showTip = (forced?: boolean) => {
		updateTip();
		if (renderedTip)
			component.setInState("showTip", forced ? "forced" : true);
	}
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
	}
	const onClick = () => component.state.showTip ? hideTip() : showTip(true);
	const onMouseEnter = () => {
		component.setTimer("waiting", showTip, component.props.tipTimeout != null ? component.props.tipTimeout : 500);
	}
	const onMouseLeave = () => {
		component.clearTimers("waiting");
		if (component.state.showTip === true)
			hideTip();
	}

	const runTipChange = createDataTrigger<PopupTipInfo["props"]["renderTip"]>(() => {
		if (component.state.showTip)
			updateTip();
	});

	// Renderer.
	return ({
			tag,
			tipTimeout,
			tipContainer,
			TipRemote,
			tipFadeIn,
			tipFadeOut,
			renderTip,
			tipClickToggle,
			tipDisableHover,
			tipClass,
			className,
			margin,
			elementMargin,
			...passProps
		},
		state
	) => {
		runTipChange(renderTip);
		const thruProps = { ...passProps, _ref: buttonRef, className: classNames("ui-popup-tip", className) };
		if (tipClickToggle)
			thruProps.onClick = onClick;
		if (!tipDisableHover) {
			thruProps.onMouseEnter = onMouseEnter;
			thruProps.onMouseLeave = onMouseLeave;
		}
		return (
			MixDOM.def(tag as DOMTags || "div", thruProps,
				MixDOM.Content,
				state.showTip ? 
					TipRemote ? (
						<TipRemote>
							{renderedTip}
						</TipRemote>
					) :	(
					<MixDOM.Portal container={tipContainer || document.body} >
						{renderedTip}
					</MixDOM.Portal>
				) : null
			)
		);
	}
});
