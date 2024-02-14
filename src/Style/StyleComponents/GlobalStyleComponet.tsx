import { CSSProperties } from "react";

const GlobalStyleComponet = {
    /** 그림자있는 div */
    ShadowDiv(
        props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
            shadowloc: "left" | "right" | "bottom";
        }
    ) {
        let filter: string;
        let box: string;
        switch (props.shadowloc) {
            case "left":
                box = "-4px 0px 4px rgba(0, 0, 0, 0.25)";
                break;
            case "right":
                box = "4px 0px 4px rgba(0, 0, 0, 0.25)";
                break;
            case "bottom":
                filter = "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))";
                break;
        }

        const style: CSSProperties = {
            filter: filter!!,
            boxShadow: box!!
        };

        return <div {...props} style={style}></div>;
    },
};

export default GlobalStyleComponet;
