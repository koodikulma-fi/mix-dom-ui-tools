import { ComponentTypeAny } from "mix-dom";
export interface ItemListProps<Name extends string = string> {
    names: Name[];
    onSelect?: (name: Name) => void;
    renderItem?: ComponentTypeAny<{
        props: {
            text: string;
            onClick: (...args: any[]) => void;
        };
    }>;
}
export declare const ItemList: import("mix-dom").ComponentFunc<{
    props: ItemListProps;
}>;
