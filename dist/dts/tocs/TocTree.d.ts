import { ComponentFunc, ComponentTypeAny } from "mix-dom";
export interface TocDataItem<TocKey = string> {
    title: string;
    tocKey: TocKey;
    children?: TocDataItem[];
}
export interface TocTreeItemsProps<TocKey = string> {
    items: TocDataItem[];
    selectedTocKey?: TocKey;
    onSelect: (tocKey: any) => void;
    level?: number;
    treeHandler?: TocSubTreeType;
}
export declare const TocTreeItems: import("mix-dom").SpreadFunc<TocTreeItemsProps<string>>;
export interface TocTreeProps<TocKey = string> {
    items: TocDataItem[];
    onSelect: (dataItem: TocDataItem<TocKey>) => void;
    treeHandler?: TocSubTreeType;
    className?: string;
}
export declare const TocTree: ComponentFunc<{
    props: TocTreeProps;
}>;
export type TocSubTreeType = ComponentTypeAny<{
    props: Omit<TocSubTreeProps, "selectedTocKey">;
}>;
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
export declare const TocSubTree: ComponentFunc<{
    props: TocSubTreeProps;
}>;
export interface TocItemProps<TocKey = string> {
    dataItem: TocDataItem<TocKey>;
    /** For custom use. */
    index: number;
    onSelect: (tocKey: any) => void;
    selected?: boolean;
}
export declare const TocItem: ComponentFunc<{
    props: TocItemProps;
}>;
