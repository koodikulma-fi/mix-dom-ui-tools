import { ComponentFunc } from "mix-dom";
import { TocDataItem, TocSubTreeProps } from "./TocTree";
export interface TocMainDataItem<MainKeys extends string = string> extends TocDataItem<string> {
    main: MainKeys;
}
interface TocMainTreeInfo<MainKeys extends string = string> {
    props: TocSubTreeProps & {
        item: TocMainDataItem<MainKeys>;
        selectedMain: MainKeys | "";
        selectedTocKey: string;
    };
    state: {
        /** The main setting for collapsed. */
        uncollapsed: boolean | null;
    };
}
export declare const TocMainTree: ComponentFunc<TocMainTreeInfo>;
export {};
