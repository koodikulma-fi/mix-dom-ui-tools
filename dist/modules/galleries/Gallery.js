// SYNTAX HIGHLIGHTING / PRISM ALTERNATIVES:
// https://react.libhunt.com/react-syntax-highlighter-alternatives
// https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/
import { createDataTrigger } from "data-memo";
import { classNames } from "dom-types";
import { MixDOM } from "mix-dom";
const Thumbnail = (_initProps, component) => {
    // Prepare state.
    component.state = { hovered: false, loadedSize: null };
    // Mouse event callbacks.
    const onMouseEnter = () => component.setInState("hovered", true);
    const onMouseLeave = () => component.setInState("hovered", false);
    // Loading effect.
    const onImageLoad = (img) => component.setInState("loadedSize", [img.naturalWidth, img.naturalHeight]);
    const runThumbLoader = createDataTrigger(([url, hovered, loaded]) => {
        if (hovered && url && !loaded) {
            const img = new Image();
            img.onload = onImageLoad.bind(null, img);
            img.src = component.props.thumb.urlFull;
        }
    });
    const runLoadedSize = createDataTrigger((url, lastUrl) => {
        if (url !== lastUrl)
            component.setInState("loadedSize", null);
    });
    // Return renderer.
    return (props, state) => {
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
        return (MixDOM.def("div", { class: classNames("thumbnail", props.class, state.hovered && "hovered"), onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
            MixDOM.def("div", { class: classNames("thumb-image", props.thumbClass), style: style })));
    };
};
const Selectable = (initProps, component) => {
    component.state = {
        selected: initProps.selected || false
    };
    const toggleSelect = () => component.setInState("selected", !component.state.selected);
    return (props, state) => (MixDOM.def("button", { onClick: toggleSelect, class: classNames(props.class, "selectable", state.selected && "selected") }, MixDOM.Content));
};
export const GalleryExample = (props) => (MixDOM.def("div", { class: "gallery" }, props.thumbs.map(thumb => (MixDOM.def(Selectable, { class: "gallery-item" },
    MixDOM.def(Thumbnail, { thumb: thumb, maxSize: 300, align: props.align }),
    MixDOM.def("span", null, thumb.title))))));
