import { CSSProperties } from "react";

const GlobalStyleComponet = {
    /** 그림자있는 div */
    ShadowDiv(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
        const style: CSSProperties = {
            filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
        };

        return <div {...props} style={style}></div>;
    },
};

export default GlobalStyleComponet;
