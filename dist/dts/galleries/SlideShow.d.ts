import { ContextsAllType, Context } from "data-signals";
import { MixDOMRenderOutput, ComponentFuncCtx } from "mix-dom";
export type SlideShowSignals = {
    prevSlide: () => void;
    nextSlide: () => void;
    firstSlide: () => void;
    lastSlide: () => void;
    goToSlide: (iSlide: number) => void;
    getSlideScroll: () => number;
};
export declare const createSlideShowContext: () => Context<{}, SlideShowSignals>;
export type SlideShowContextType = Context<{}, SlideShowSignals>;
export type WithSlideShowContext<AllContexts extends ContextsAllType = {}> = AllContexts & {
    slideShow: SlideShowContextType;
};
export interface SlideShowProps {
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
export declare const SlideShow: ComponentFuncCtx<{
    props: SlideShowProps;
    state: SlideShowState;
    contexts: WithSlideShowContext;
    timers: "sizeObserver";
}>;
export {};
