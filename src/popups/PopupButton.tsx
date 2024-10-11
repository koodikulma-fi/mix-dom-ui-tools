
// NOT INCLUDED CURRENTLY..


import { MixDOM, MixDOMRenderOutput, Component, ComponentFunc, ComponentTypeAny } from "mix-dom";
import { Button, ButtonProps } from "../spreads/Button";
export interface PopupButtonInfo { 
	props: ButtonProps & {
		// content: Component;
		ContentComponent?: string | ComponentTypeAny | null;
		container?: HTMLElement;
		fallbackToBody?: boolean;
		
		// OLD COMMENT:
		// 
		// <-- FOR UIDOM V3.0 ...!! MULTIPLE NAMED CONTENT FEEDS ...!
		// <-- BECAUSE THEY WORK SO SMARTLY, THEN WOULD BE NICE TO FEED MANY..!
		// ...... BUT..... IS IT VIA PROPS ACTUALLY..? BECAUSE THERE'S ONLY ONE WAY TO DEFINE CONTNETS...
		// ..... <-- Can CREATE ENVELOPE ..! and pass as a prop.. and it can be used similarly then..
		// <---- Tho.. probably needs a lot of meticulous refactoring work in the core.... to generalize that portion totally..
	
		// <-- Update.. Now it's v3.0.0 and we can do it..!
	
	};
	state: {
		opened: boolean;
	};
}
/**
 * - This uses props.content (= Component) to display the contents when toggled open.
 * - Define the Button using ButtonProps (including using MixDOM.Content for its content). */
export const PopupButton = MixDOM.component<PopupButtonInfo>(component => {
	// State.
	component.state = {
		opened: false
	};
	const togglePopup = () => component.setInState("opened", !component.state.opened);
	// Renderer.
	return (props) => {
		const { ContentComponent, ...passProps } = props;
		return (
			<Button {...passProps} onClick={togglePopup}>
				{MixDOM.Content}
				{component.state.opened && props.ContentComponent ?
					<MixDOM.Portal container={props.container || props.fallbackToBody !== false && document.body as HTMLElement || null}>
						{props.ContentComponent ? typeof props.ContentComponent === "string" ? <span>{props.ContentComponent}</span> : <props.ContentComponent /> : null}
					</MixDOM.Portal>
					: null}
			</Button>
		);
	}
});
