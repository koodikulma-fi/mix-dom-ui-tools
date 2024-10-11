

// SYNTAX HIGHLIGHTING / PRISM ALTERNATIVES:
// https://react.libhunt.com/react-syntax-highlighter-alternatives
// https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/


import { createDataTrigger } from "data-memo";
import { classNames } from "dom-types";
import { Component, MixDOM } from "mix-dom";

interface Thumb { urlThumb: string; urlFull: string; title: string; align?: "top" | "center" | "bottom"; }
interface ThumbnailProps { thumb: Thumb; thumbSize?: number; maxSize?: number; class?: string; thumbClass?: string; align?: "top" | "center" | "bottom"; }
interface ThumbnailState { hovered: boolean; loadedSize: [number, number] | null; }
const Thumbnail = (_initProps: ThumbnailProps, component: Component<{ props: ThumbnailProps; state: ThumbnailState }>) => {
	// Prepare state.
	component.state = { hovered: false, loadedSize: null };
	// Mouse event callbacks.
	const onMouseEnter = () => component.setInState("hovered", true);
	const onMouseLeave = () => component.setInState("hovered", false);
	// Loading effect.
	const onImageLoad = (img: HTMLImageElement) => component.setInState("loadedSize", [ img.naturalWidth, img.naturalHeight ]);
	const runThumbLoader = createDataTrigger<[string, boolean, boolean]>(([url, hovered, loaded]) => {
		if (hovered && url && !loaded) {
			const img = new Image();
			img.onload = onImageLoad.bind(null, img);
			img.src = component.props.thumb.urlFull;
		}
	});
	const runLoadedSize = createDataTrigger<string>((url, lastUrl) => {
		if (url !== lastUrl)
			component.setInState("loadedSize", null);
	});
	// Return renderer.
	return (props: ThumbnailProps, state: ThumbnailState) => {
		// Use effects.
		runLoadedSize(props.thumb.urlFull);
		runThumbLoader([props.thumb.urlFull, state.hovered, !!state.loadedSize]);
		// Prepare size.
		const ready = !!state.loadedSize && state.hovered;
		let width = ready && state.loadedSize ? state.loadedSize[0] : null;
		let height = ready && state.loadedSize ? state.loadedSize[1] : null;
		if (width && height && props.maxSize) {
			const bigger = Math.max(width, height);
			if (bigger > props.maxSize) {
				const rel = props.maxSize / bigger;
				width *= rel;
				height *= rel;
			}
		}
		// Render.
		const style = {
			backgroundImage: "url(" + (ready ? props.thumb.urlFull : props.thumb.urlThumb) + ")",
			backgroundSize: "cover",
			width: width ? width : "100%",
			height: height ? height : "100%",
		};
		if (props.align && props.align !== "center")
			style[props.align] = "0";
		return (
			<div
				class={classNames("thumbnail", props.class, state.hovered && "hovered")}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				<div
					class={classNames("thumb-image", props.thumbClass)}
					style={style}
				/>
			</div>
		);
	}
};


interface SelectableProps { selected?: boolean; class?: string; }
interface SelectableState { selected: boolean; }
const Selectable = (initProps: SelectableProps, component: Component<{props: SelectableProps; state: SelectableState}>) => {
	component.state = {
		selected: initProps.selected || false
	};
	const toggleSelect = () => component.setInState("selected", !component.state.selected);
	return (props: SelectableProps, state: SelectableState) => (
		<button onClick={toggleSelect} class={classNames(props.class, "selectable", state.selected && "selected" )}>
			{MixDOM.Content}
		</button>
	);
};

export interface GalleryExampleProps {
	thumbs: Thumb[];
	align?: "top" | "center" | "bottom";
}
export const GalleryExample = (props: GalleryExampleProps) => (
	<div class="gallery">
		{props.thumbs.map(thumb => (
			<Selectable class="gallery-item">
				<Thumbnail thumb={thumb} maxSize={300} align={props.align} />
				<span>{thumb.title}</span>
			</Selectable>
		))}
	</div>
);
