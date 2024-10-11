
// - Imports - //

import { MixDOM, ComponentFunc } from "mix-dom";
import { TocDataItem, TocSubTreeProps, TocTreeItems } from "./TocTree";
import { Button } from "../spreads/Button";
import { classNames } from "dom-types";



// - Toc data building - //

// export interface TocDocDataItem extends TocDataItem<string> {
// 	doc: TocDocKeys;
// }
//
// export const collectTocKeys = (origItem: TocDataItem) => {
// 	// Loop all.
// 	const tocKeys: Set<string> = new Set();
// 	let nextItems: TocDataItem[] = [ origItem ];
// 	let nextItem: TocDataItem | undefined;
// 	while (nextItem = nextItems.splice(0,1)[0]) {
// 		tocKeys.add(nextItem.tocKey);
// 		if (nextItem.children)
// 			nextItems = nextItem.children.concat(nextItems);
// 	}
// 	// Return info.
// 	return tocKeys;
// }
//
// function prepareTocTrees(rootItems: TocDataItem[]): TocDocDataItem[] {
// 	// Loop each root.
// 	const finalItems: TocDocDataItem[] = [];
// 	for (const rootItem of rootItems) {
// 		// Add to roots.
// 		const doc = rootItem.tocKey as TocDocKeys;
// 		const newRoot: TocDocDataItem = { ...rootItem, doc };
// 		finalItems.push(newRoot);
// 		// Loop recursively all under root.
// 		let nextGens: [TocDocDataItem, TocDataItem[]][] = [ [ newRoot, rootItem.children || [] ] ];
// 		let thisGen: [TocDocDataItem, TocDataItem[]] | undefined;
// 		while (thisGen = nextGens.splice(0,1)[0]) {
// 			const parent = thisGen[0];
// 			const children: TocDocDataItem[] = [];
// 			for (const kid of thisGen[1]) {
// 				const newKid: TocDocDataItem = { ...kid, doc };
// 				children.push(newKid);
// 				if (kid.children)
// 					nextGens = [ [newKid, kid.children], ...nextGens ];
// 			}
// 			children[0] ? parent.children = children : delete parent.children;
// 		}
// 	}
// 	// Return new items.
// 	return finalItems;
// }



//
// export function prepareTocTrees<Keys extends string = string>(rootItems: TocDataItem[]): TocMainDataItem[] {
// 	// Loop each root.
// 	const finalItems: TocMainDataItem[] = [];
// 	for (const rootItem of rootItems) {
// 		// Add to roots.
// 		const main = rootItem.tocKey as Keys;
// 		const newRoot: TocMainDataItem = { ...rootItem, main };
// 		finalItems.push(newRoot);
// 		// Loop recursively all under root.
// 		let nextGens: [TocMainDataItem, TocDataItem[]][] = [ [ newRoot, rootItem.children || [] ] ];
// 		let thisGen: [TocMainDataItem, TocDataItem[]] | undefined;
// 		while (thisGen = nextGens.splice(0,1)[0]) {
// 			const parent = thisGen[0];
// 			const children: TocMainDataItem[] = [];
// 			for (const kid of thisGen[1]) {
// 				const newKid: TocMainDataItem = { ...kid, main };
// 				children.push(newKid);
// 				if (kid.children)
// 					nextGens = [ [newKid, kid.children], ...nextGens ];
// 			}
// 			children[0] ? parent.children = children : delete parent.children;
// 		}
// 	}
// 	// Return new items.
// 	return finalItems;
// }


// - Tree Handler - //

export interface TocMainDataItem<MainKeys extends string = string> extends TocDataItem<string> {
	main: MainKeys;
}

interface TocMainTreeInfo<MainKeys extends string = string> { 
	props: TocSubTreeProps & {
		// Redefine.
		item: TocMainDataItem<MainKeys>;
		// Add.
		selectedMain: MainKeys | "";
		selectedTocKey: string;
	};
	state: {
		/** The main setting for collapsed. */
		uncollapsed: boolean | null;
	};
};
export const TocMainTree: ComponentFunc<TocMainTreeInfo> = (_props, component) => {

	// Local state and callback.
	component.state = {
		uncollapsed: null,
	};
	const onCollapseToggle = () => {
		// If selected, toggle between false and null (= will be shown).
		const item = component.props.item;
		if (component.props.selectedMain === (item.main === undefined ? item.tocKey : item.main))
			component.setInState("uncollapsed", component.state.uncollapsed !== false ? false : null);
		// If unselected, toggle between true and null (= won't be shown).
		else
			component.setInState("uncollapsed", !component.state.uncollapsed || null);
	}

	// Renderer.
	return () => {

		// Parse.
		const { selectedMain, selectedTocKey, item, index, className, level } = component.props;

		// Special states.
		const isSelected = selectedMain === (item.main === undefined ? item.tocKey : item.main);
		const isCollapsed = component.state.uncollapsed ? false : component.state.uncollapsed === false || !isSelected;

		// Correct the state immediately.
		// .. In MixDOM this is perfectly fine: it will simply set the state and immedialy call the render method again.
		// .. You can control it in settings.maxReRenders, default is to allow 1 re-render.
		if (!isSelected && component.state.uncollapsed === false)
			component.setInState("uncollapsed", null);

		// <-- Another approach would be to use a local variable (and then force update on the special occasion).
		// ... But this looks like much better coding practice than hacky extra stuff.

		// Prepare.
		const path = isCollapsed ? "M 6.5,2 3.5,5 6.5,8" : "M 2,3.5 5,6.5 8,3.5";

		// Render.
		// .. Note that we don't pass treeHandler or useNumbering any further.
		const onItemClick = (_e: MouseEvent) => component.props.onSelect(component.props.item);
		return (
			<li class={classNames("ui-toc-sub-tree", "level-" + level.toString(), "toc-main-level", "style-panel", isSelected && "selected", className)}>
				<div class={classNames("main-tree-title flex-row flex-align-items-stretch flex-justify-content-start", isSelected && (!selectedTocKey || item.tocKey === selectedTocKey) && "selected")} >
					<Button look="transparent" onClick={onItemClick} className="flex-grow" >
						<span class="index">{(index + 1).toString() + ". "}</span><span class="title">{item.title}</span>
					</Button>
					<Button class="tree-collapse" look="transparent" onClick={onCollapseToggle} >
						<svg viewBox="0 0 10 10"><path d={path} fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" /></svg>
					</Button>
				</div>
				{ !isCollapsed && item.children ? (
					<ul>
						<TocTreeItems
							items={item.children}
							onSelect={component.props.onSelect}
							level={level + 1}
							selectedTocKey={isSelected ? component.props.selectedTocKey : undefined}
						/>
					</ul>
				) : null }
			</li>
		);
	}
}
