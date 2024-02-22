import { Slider, SliderProps, SvgIconProps, createTheme, styled } from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PlayArrowTwoToneIcon from "@mui/icons-material/PlayArrowTwoTone";
import React, { CSSProperties, forwardRef } from "react";

// 스타일 상수
export const styleConstants = { 

}

// 테마
export const MUITheme = {
    defaultTheme: createTheme({
        shape: {
            borderRadius: 15,
        },
        typography: {
            fontFamily: "Inter, sans-serif",
            fontWeightRegular: "600",
        },
        palette: {
            primary: {
                main: "#9C6DFF",
            },
            secondary: {
                main: "#000000",
            },
        },
    }),
};

// 커스텀 스타일
const MUICustumStyle = {
    PlayIcon: styled(PlayArrowOutlinedIcon)<SvgIconProps>(() => ({
        width: "100%",
        fill: "#00E39F",
        fontSize: "inherit",
        boxSizing: "border-box",
    })),

    PlayIconTwoTone: styled(PlayArrowTwoToneIcon)<SvgIconProps>(() => ({
        width: "100%",
        fill: "#44D400",
        fontSize: "inherit",
        boxSizing: "border-box",
    })),
};

// 커스텀 컴포넌트
export const MUIComponet = {
    /** 플레이 아이콘 */
    PlayIcon(props: SvgIconProps) {
        return <MUICustumStyle.PlayIcon {...props} viewBox="6 5 14 14" />;
    },

    /** 플레이 아이콘 내부 색 들어간거 */
    PlayIconFill(props: SvgIconProps) {
        return <MUICustumStyle.PlayIconTwoTone {...props} viewBox="6 5 14 14" />;
    },

    ProgressBar: forwardRef<HTMLSpanElement, SliderProps>((props, ref) => {
        //ref 사용
        return <Slider {...props} ref={ref} aria-label="Default" />;
    }),

    VolumeSlider: forwardRef<HTMLSpanElement, SliderProps>((props, ref) => {
        //ref 사용
        return <Slider {...props} ref={ref} aria-label="Default" valueLabelDisplay="auto" />;
    }),

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
            boxShadow: box!!,
        };

        return <div {...props} style={style}></div>;
    },
};
