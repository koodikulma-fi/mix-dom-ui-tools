
// Libraries.
import { createDataTrigger } from "data-memo";
import { MixDOM, ComponentTypeAny } from "mix-dom";
// From our local examples.
import { Button } from "../spreads/Button";

// Interface for props.
export interface ItemListProps<Name extends string = string> {
	names: Name[];
	onSelect?: (name: Name) => void;
	renderItem?: ComponentTypeAny<{props: { text: string; onClick: (...args: any[]) => void; }}>;
}
// The actual rendering source.
export const ItemList = MixDOM.component<{ props: ItemListProps }>((component) => {

	// To reuse callbacks we can use a trigger with a named dictionary.
	// .. Whenever the names have changed, we create new callbacks, reusing old ones if found.
	let callbacks: Record<string, (e: MouseEvent) => void> = {};
	const rebuildCallbacks = createDataTrigger<string[]>(() => {
		callbacks = component.props.names.reduce((cum, name) => (
			cum[name] = callbacks[name] || (() => component.props.onSelect && component.props.onSelect(name))
		, cum), {})
	});

	// Return renderer.
	return (props) => {
		// Run the callbacks trigger.
		rebuildCallbacks(props.names);
		// Render.
		const Item = props.renderItem || Button;
		return (
			<div class="ui-item-list">
				{props.names.map(name => <Item text={name} onClick={callbacks[name]} /> )}
			</div>
		);
	}
});
