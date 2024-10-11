
import { classNames } from "dom-types";
import { MixDOM, MixDOMDOMProps, SpreadFunc } from "mix-dom";

export interface ButtonProps extends MixDOMDOMProps<"button"> {
	text?: string;
	look?: "transparent" | "inline" | "";
	size?: "small" | "medium" | "large";
	className?: string;
}
// Let's create it as a spread - it's just a simple composition.
export const Button: SpreadFunc<ButtonProps> = (props) => {
	// Parse.
	const { text, look, size, className, ...passProps} = props;
	const finalClass = classNames("app-button", size, className, look, look === "inline" && "transparent");
	// We use a wrapper only if there is content with MixDOM.WithContent.
	return (
		<button {...passProps} className={finalClass} >
			{text ? <span class="text">{text}</span> : null}
			<MixDOM.WithContent><span class="content">{MixDOM.Content}</span></MixDOM.WithContent>
		</button>
	);
}
