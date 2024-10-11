
// - Imports - //

import { classNames } from "dom-types";
import { MixDOM, ComponentFunc, ComponentTypeAny } from "mix-dom";
import { Button } from "../spreads/Button";


// - Types - //

export interface TocDataItem<TocKey = string> {
	title: string;
	tocKey: TocKey;
	children?: TocDataItem[];
}


// - Helpers - //

export interface TocTreeItemsProps<TocKey = string> {
	items: TocDataItem[];
	selectedTocKey?: TocKey;
	onSelect: (tocKey: any) => void;
	level?: number;
	treeHandler?: TocSubTreeType;
}
export const TocTreeItems = MixDOM.spread<TocTreeItemsProps>(props =>
	props.items.map((dataItem, index) => {
		if (dataItem.children) {
			const TreeClass = props.treeHandler || TocSubTree;
			const passProps: TocSubTreeProps = { item: dataItem, level: props.level || 1, index, onSelect: props.onSelect, treeHandler: props.treeHandler };
			if (!props.treeHandler)
				passProps.selectedTocKey = props.selectedTocKey;
			return <TreeClass {...passProps} />
		}
		return (
			<TocItem
				dataItem={dataItem}
				selected={dataItem.tocKey === props.selectedTocKey}
				onSelect={props.onSelect}
				index={index}
			/>
		);
	})
);


// - Toc Tree - //

export interface TocTreeProps<TocKey = string> {
	items: TocDataItem[];
	onSelect: (dataItem: TocDataItem<TocKey>) => void;
	treeHandler?: TocSubTreeType;
	className?: string;
	// selectedTocKey?: TocKey; // Let's not incldue this for now. The point is to use treeHandler.
	// .. Tho... Flow not fully there.
}
// Let's use a full component to cut extra updates.
// .. With just a spread, we'd flow down all, but instead the point is to use the treeHandler with a wrapper component.
// .. This way, our data also stays clean. The handler can receive extra props.
export const TocTree: ComponentFunc<{ props: TocTreeProps; }> = (props, _comp) => {
	const { className, ...passProps } = props;
	return (
		<div class={classNames("ui-toc-tree", "wrapper", className)}>
			<ul>
				<TocTreeItems {...passProps} />
			</ul>
		</div>
	);
}


// - Toc Sub Tree - //

export type TocSubTreeType = ComponentTypeAny<{ props: Omit<TocSubTreeProps, "selectedTocKey">; }>;
export interface TocSubTreeProps<TocKey = string> {
	item: TocDataItem<TocKey>;
	level: number;
	/** For custom use. */
	index: number;
	selectedTocKey?: TocKey;
	onSelect: (dataItem: TocDataItem) => void;
	treeHandler?: TocSubTreeType;
	className?: string;
}

export const TocSubTree = MixDOM.component<{ props: TocSubTreeProps }>(component => {
	const onItemClick = (_e: MouseEvent) => component.props.onSelect(component.props.item);
	return (props: TocSubTreeProps) => {
		return (
			<li class={classNames("ui-toc-sub-tree", "level-" + props.level.toString(), props.className)}>
				<div class={classNames("sub-tree-title", props.selectedTocKey === props.item.tocKey && "selected")}>
					<Button
						look="transparent"
						text={props.item.title}
						onClick={onItemClick}
					/>
				</div>
				{ props.item.children ? (
					<ul>
						<TocTreeItems
							items={props.item.children}
							onSelect={props.onSelect}
							level={props.level + 1}
							selectedTocKey={props.selectedTocKey}
						/>
					</ul>
				) : null }
			</li>
		);
	}
});


// - Toc Item - //

export interface TocItemProps<TocKey = string> {
	dataItem: TocDataItem<TocKey>;
	/** For custom use. */
	index: number;
	onSelect: (tocKey: any) => void;
	selected?: boolean;
}
export const TocItem: ComponentFunc<{props: TocItemProps; }> = function (_initProps, component) {
	const onItemClick = (_e: MouseEvent) =>	component.props.onSelect(component.props.dataItem);
	return (props: TocItemProps) => (
		<li class={classNames("ui-toc-item", this.props.selected && "selected")}>
			<Button
				look="transparent"
				text={props.dataItem.title}
				onClick={onItemClick}
			/>
		</li>
	);
}
