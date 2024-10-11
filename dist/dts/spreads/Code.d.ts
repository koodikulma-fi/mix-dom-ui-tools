declare global {
    var Prism: any;
}
export interface CodeProps {
    code: string;
    lang?: string;
    numbering?: boolean | number;
}
export declare const Code: import("mix-dom").SpreadFunc<CodeProps>;
export declare const InlineCode: import("mix-dom").SpreadFunc<CodeProps>;
export declare const Inline: import("mix-dom").SpreadFunc<CodeProps>;
export interface SmallProps {
    /** Either define text as a prop or then as content to insert inside. */
    text?: string;
}
export declare const Small: import("mix-dom").SpreadFunc<SmallProps>;
export declare const VerySmall: import("mix-dom").SpreadFunc<SmallProps>;
export interface BigProps {
    /** Either define text as a prop or then as content to insert inside. */
    text?: string;
}
export declare const Big: import("mix-dom").SpreadFunc<BigProps>;
