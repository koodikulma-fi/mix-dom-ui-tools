
// From libraries.
import { createDataTrigger } from "data-memo";
import { ContextsAllType, Context } from "data-signals";
import { MixDOM, Ref, MixDOMRenderOutput, ComponentFuncCtx } from "mix-dom";
// From our local examples.
import { Button } from "../spreads/Button";


// - SlideShow context - //
//
// To use the scrolling and get values, let's allow to use an optional context.

// export interface SlideShowData {}
export type SlideShowSignals = {
	prevSlide: () => void;
	nextSlide: () => void;
	firstSlide: () => void;
	lastSlide: () => void;
	goToSlide: (iSlide: number) => void;
	getSlideScroll: () => number;
}
export const createSlideShowContext = () => new Context<{}, SlideShowSignals>();
export type SlideShowContextType = Context<{}, SlideShowSignals>;
export type WithSlideShowContext<AllContexts extends ContextsAllType = {}> = AllContexts & {
	slideShow: SlideShowContextType;
}


// - SlideShow wrapper - //
//
// This is used just to separate the compositional part from the functional part.

interface SlideShowWiredProps {
	slides: SlideShowProps["slides"];
	onScroll?: (e: MouseEvent) => void;
	scrollRef?: Ref;
	slidesRef?: Ref;
}

// Let's use a component function (not spread), because presumably our props won't change.
// .. So, our structure here won't be re-evaluated when the parent re-renders our content.
const SlideShowWired = MixDOM.component<{props: SlideShowWiredProps; }>((_component) => {
	return (props) => (
		<div class="ui-slide-show flex-col scrollable" onScroll={props.onScroll} _ref={props.scrollRef} >
			<div class="blog flex-col">
				<div class="layout-overlay fit-size no-pointer">
					<div class="intro-slide-buttons">
						{MixDOM.Content}
					</div>
				</div>
				<div class="contents fit-width" onScroll={props.onScroll} >
					{props.slides.map(slide => (
						<div _ref={props.slidesRef} class="full-view flex-col flex-center fit-width flex-justify-content-center">
							{slide}
						</div>
					))}
				</div>
			</div>
		</div>
	);
});


// - SlideShow - //

export interface SlideShowProps { // extends MixDOMComponentProps { // <-- This is not needed if uses global typing.
	slides: MixDOMRenderOutput[];
	handleResizing?: boolean;
	/** You can also give the context by a prop to SlideShow directly.
	 * If used, will override it locally. */
	context?: SlideShowContextType;
}
interface SlideShowState {
	showUp: boolean;
	showDown: boolean;
}
// export const SlideShow = MixDOM.component<{ props: SlideShowProps; state: SlideShowState; contexts: WithSlideShowContext; timers: "sizeObserver"; }>((component, cApi) => {
export const SlideShow: ComponentFuncCtx<{ props: SlideShowProps; state: SlideShowState; contexts: WithSlideShowContext; timers: "sizeObserver"; }> = (_initProps, component, cApi) => {


	// - Initialize - //

	// Initialize state.
	component.state = {
		showUp: false,
		showDown: true
	};
	// Initialize local state-like values (that shouldn't firing re-rendering).
	let slideOffset = 0; 	// Integer part tells the slide, decimal part relative scroll in it.
	let isResizing = false; // Flag to prevent onScroll from firing further.

	// Refs - one for scroll container, other for collecting slides.
	const scrollRef = new Ref<HTMLDivElement>();
	const slidesRef = new Ref<HTMLDivElement>();


	// - Helper methods - //

	// Compute scroll.
	const getPrevSlide = (): number => Math.floor(slideOffset - .1);
	const getNextSlide = (): number => Math.floor(slideOffset + 1.1);
	const computeSlide = (): number => {
		// Verify.
		const domSlides = slidesRef.getElements();
		const el = scrollRef.getElement();
		if (!el || !domSlides[0])
			return 0;
		// Get index of the slide.
		const top = el.scrollTop;
		let i = 0;
		let cum = 0;
		for (let domSlide: HTMLElement | undefined; domSlide=domSlides[i]; i++) {
			// No more.
			if (!domSlide)
				break;
			const kidTop = domSlide.offsetTop;
			// Has crossed.
			if (kidTop > top) {
				const span = kidTop - cum;
				const factor = span ? 1 - Math.min(1, (kidTop - top) / span) : 1;
				return i - 1 + factor;
			}
			// Store.
			cum = kidTop;
		}
		return i - 1;
	}

	// Get index by action.
	const getIndexByAction = (type: "first" | "last" | "prev" | "next") => {
		// No slides.
		if (!component.props.slides.length)
			return -1;
		// Get index by action type.
		switch (type) {
			case "first":
		 		return 0;
			case "last":
				return Math.max(0, component.props.slides.length - 1);
			case "prev":
				return Math.max(0, getPrevSlide());
			case "next":
				return getNextSlide();
			default:
				return -1;
		}
	}
	// Scroll to slide by the action type.
	const scrollByAction = (type: "first" | "last" | "prev" | "next") => {
		const domSlides = slidesRef.getElements();
		const index = getIndexByAction(type);
		const element = domSlides[index] as HTMLElement | undefined;
		if (element)
			element.scrollIntoView({behavior: "smooth"});
	}
	// Scroll to slide by given number, including decimal part support.
	const scrollToSlide = (rScroll: number) => {
		const iScroll = Math.floor(rScroll);
		const domSlides = slidesRef.getElements();
		const element = domSlides[iScroll] as HTMLElement | undefined;
		const scrollContainer = scrollRef.getElement();
		if (element && scrollContainer) {
			const elNext = element.nextElementSibling as HTMLElement | null;
			const relOffset = element.offsetTop + (elNext && elNext.offsetTop ? elNext.offsetTop - element.offsetTop : element.offsetHeight) * (rScroll - iScroll);
			scrollContainer.scrollTo({ top: relOffset });
		}
	}


	// - Use createDataTrigger to override a context locally - //

	// This is extra support in case the parent wants to feed us the context directly.
	// .. Note that we don't need to run the unmount part. (It's okay if the context is left on).
	const runContextChange = createDataTrigger<SlideShowContextType | undefined>((context) => {
		cApi.setContext("slideShow", context);
	});


	// - Use createDataTrigger upon resizing - //

	// Handle resizing - we want the anchor the scrolling during resizing.
	// .. Otherwise it feels like we're scrolling all over the place.
	// .. Let's implement this as a toggleable feature by using createDataTrigger.
	const runResizeModeChange = createDataTrigger<boolean>(() => {

		// Create observer and attach to onDOMMount.
		let observer: ResizeObserver | null = null;
		const mountResizer = (domNode => {
			observer = new ResizeObserver((_entries) => {
				// We must get the new scrollHeight by our iSlide + slideOffset.
				const domSlides = slidesRef.getElements();
				if (!domSlides[0])
					return;
				// Disable scrolling detection for 100ms. (With 25ms, sometimes gets through.)
				isResizing = true;
				component.setTimer("sizeObserver", () => isResizing = false, 100);
				// Get height.
				const nOffset = Math.floor(slideOffset);
				const prevKid = domSlides[nOffset] as HTMLElement | undefined;
				const thisKid = domSlides[nOffset + 1] as HTMLElement | undefined;
				let height = 0;
				if (prevKid)
					height += prevKid.offsetTop;
				if (thisKid)
					height += Math.round((thisKid.offsetTop - height) * (slideOffset - nOffset));
				// Set scroll.
				domNode.scrollTop = height;
			});
			observer.observe(domNode);
		});
		scrollRef.listenTo("domDidMount", mountResizer);

		// On unmount.
		const unmountResizer = () => {
			// Remove callbacks.
			scrollRef.unlistenTo("domDidMount", mountResizer);
			scrollRef.unlistenTo("domWillUnmount", unmountResizer);
			// Disconnect observer.
			if (observer)
				observer.disconnect();
			// Clear flags.
			observer = null;
			isResizing = false;
		};
		scrollRef.listenTo("domWillUnmount", unmountResizer);

		// Return unmountResizer - will be run if removed.
		return unmountResizer;
	});


	// - Use signals - //

	// Handle signals.
	cApi.listenTo("slideShow.goToSlide", (iSlide) => scrollToSlide(iSlide || 0));
	cApi.listenTo("slideShow.prevSlide", () => scrollByAction("prev"));
	cApi.listenTo("slideShow.nextSlide", () => scrollByAction("next"));
	cApi.listenTo("slideShow.firstSlide", () => scrollByAction("first"));
	cApi.listenTo("slideShow.lastSlide", () => scrollByAction("last"));
	cApi.listenTo("slideShow.getSlideScroll", () => slideOffset);


	// - Callbacks - //

	// We must listen to the scroll.
	const onScroll = () => {
		// Not while resizing.
		if (isResizing)
			return;
		// Get offset.
		slideOffset = computeSlide();
		// Show/Hide up & down buttons.
		if ((getPrevSlide() >= 0) !== component.state.showUp)
			component.setInState("showUp", !component.state.showUp);
		if ((getNextSlide() < component.props.slides.length) !== component.state.showDown)
			component.setInState("showDown", !component.state.showDown);
	}
	// When clicks the buttons.
	const onGoUp = (e: MouseEvent) => {
		e.button === 2 && e.preventDefault();
		scrollByAction(e.button === 2 ? "first" : "prev");
	}
	const onGoDown = (e: MouseEvent) => {
		e.button === 2 && e.preventDefault();
		scrollByAction(e.button === 2 ? "last" : "next");
	}


	// - Rendering - //

	// Return renderer.
	return (props) => {
		// Run the effect to override context locally.
		runContextChange(props.context);
		// Run the effect to enable / disable resizing.
		runResizeModeChange(props.handleResizing !== false);
		// Render.
		return (
			<SlideShowWired slides={props.slides} onScroll={onScroll} scrollRef={scrollRef} slidesRef={slidesRef} >
				{component.state.showUp ?
					<Button onClick={onGoUp} onContextMenu={onGoUp} onDblClick={onGoUp} look="transparent" className="intro-slide-button use-pointer" >
						<svg viewBox="0 0 8 5"><path d="M 1,4 4,1 7,4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" /></svg>
					</Button>
				: <span style="visibility: hidden"/>}
				{component.state.showDown ?
					<Button onClick={onGoDown} onContextMenu={onGoDown} onDblClick={onGoDown} look="transparent" className="intro-slide-button use-pointer" >
						<svg viewBox="0 0 8 5"><path d="M 1,1 4,4 7,1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" /></svg>
					</Button>
				: null}
			</SlideShowWired>
		);
	}
}
