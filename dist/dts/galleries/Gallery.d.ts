interface Thumb {
    urlThumb: string;
    urlFull: string;
    title: string;
    align?: "top" | "center" | "bottom";
}
export interface GalleryExampleProps {
    thumbs: Thumb[];
    align?: "top" | "center" | "bottom";
}
export declare const GalleryExample: (props: GalleryExampleProps) => any;
export {};
