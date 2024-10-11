

// SYNTAX HIGHLIGHTING / PRISM ALTERNATIVES:
// https://react.libhunt.com/react-syntax-highlighter-alternatives
// https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/


import { MixDOM } from "mix-dom";


// - Display code - //

declare global { var Prism: any; }

const toDigits = (num: number, digits: number, empty: string = " ", allowOverflow: boolean = true) => {
	let str = num.toString();
	const nStr = str.length;
	if (nStr >= digits)
		return allowOverflow ? str : str.slice(0, digits);
	for (let i=nStr; i<digits; i++)
		str = empty + str;
	return str;
}

export interface CodeProps {
	code: string;
	lang?: string;
	numbering?: boolean | number;
}
export const Code = MixDOM.spread<CodeProps>((props) => {
	const lang = props.lang || "tsx";
	const lOffset = typeof props.numbering === "number" ? props.numbering : props.numbering ? 1 : null;
	let code = Prism.highlight(props.code, Prism.languages[lang], lang);
	if (lOffset !== null)
		code = code.split("\n").map((c: string, i: number) => "<span class='line'><span class='line-number'>" + toDigits(i + lOffset, 3) + ". </span>" + c + "</span>").join("\n");
	return <pre class="style-panel scrollable">{MixDOM.defHTML(code, "code", { class: lOffset !== null ? "show-numbering" : "" })}</pre>;
});
export const InlineCode = MixDOM.spread<CodeProps>((props) => {
	const lang = props.lang || "tsx";
	return MixDOM.defHTML(Prism.highlight(props.code, Prism.languages[lang], lang), "code", { class: "inline style-panel" });
});
export const Inline = InlineCode;


// - Small text - //

export interface SmallProps {
	/** Either define text as a prop or then as content to insert inside. */
	text?: string;
}
export const Small = MixDOM.spread<SmallProps>(function (props) {
	return <span class="small">{props.text}{MixDOM.Content}</span>;
});
export const VerySmall = MixDOM.spread<SmallProps>(function (props) {
	return <span class="very-small">{props.text}{MixDOM.Content}</span>;
});



// - Big text - //

export interface BigProps {
	/** Either define text as a prop or then as content to insert inside. */
	text?: string;
}
export const Big = MixDOM.spread<BigProps>(function (props) {
	return <span class="big">{props.text}{MixDOM.Content}</span>;
});
