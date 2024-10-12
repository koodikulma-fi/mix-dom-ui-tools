
// - JSX - //

// Do this once, say, in the root script of your app.
import { JSX_camelCase } from "mix-dom"; // Alternatives: JSX_native and JSX_mixedCase.
declare global {
	namespace JSX {
		interface IntrinsicElements extends JSX_camelCase.IntrinsicElements { }
		interface IntrinsicAttributes extends JSX_camelCase.IntrinsicAttributes { }
	}
}

//
// <- -BTW.... DO WE FORCE JSX_camelCase ... ? .. WE'D LIKE TO JUST BE TRANSPARENT..! WE DON'T CARE FOR EXPORTS..!
// ... I think can work..... we just must exclude the global declaration from bundled code...  .. hopefully will work that way..
// ...... If doesn't.. Then just in typing and package json.... Try to somehow solve..?
// ........  --> Different package declarations, that actually use same folders..! And just the .d.ts is differnt..!! Yes..!


// - Export all - //

// Non-components.
export * from "./common";
// No internal dependencies.
export * from "./spreads";
export * from "./fitting";
// In order of inheritance.
export * from "./mixables";
export * from "./lists";
export * from "./popups";
export * from "./tocs";
export * from "./galleries";

//
// <-- Verify inheritance order.
