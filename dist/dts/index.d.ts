import { JSX_camelCase } from "mix-dom";
declare global {
    namespace JSX {
        interface IntrinsicElements extends JSX_camelCase.IntrinsicElements {
        }
        interface IntrinsicAttributes extends JSX_camelCase.IntrinsicAttributes {
        }
    }
}
export * from "./spreads";
export * from "./fitting";
export * from "./lists";
export * from "./popups";
export * from "./tocs";
export * from "./galleries";
