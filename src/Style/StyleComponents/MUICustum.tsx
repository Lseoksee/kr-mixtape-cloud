import { Button, ButtonProps, Slider, SliderProps, SvgIconProps, createTheme, styled } from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PlayArrowTwoToneIcon from "@mui/icons-material/PlayArrowTwoTone";
import React, { forwardRef } from "react";
import { CSSProperties } from "@mui/material/styles/createMixins";

// 스타일 상수
export const styleConstants = {};

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
                main: "#f3f3f3",
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

    ListButton: styled(Button)<ButtonProps>(() => ({
        border: "1px solid #C6C6C6",
        borderRadius: "10px",
        color: "black",
        textTransform: "inherit",
        fontSize: "1rem",
        justifyContent: "flex-start",
        whiteSpace: "nowrap",
        fontWeight: "600",
        boxShadow: "initial",
    })),

    NestedListItem: styled(Button)<ButtonProps>(() => ({
        borderRadius: "15px",
        color: "black",
        width: "100%",
        textTransform: "initial",
        fontSize: "1rem",
        whiteSpace: "nowrap",
        fontWeight: "600",
        boxShadow: "initial",
        justifyContent: "space-between",
        ":hover": {
            boxShadow: "initial",
        } as CSSProperties,
    })),

    ShadowDiv: styled("div", {
        shouldForwardProp: (props) => props !== "shadowloc",
    })<{ shadowloc: "left" | "right" | "bottom" }>(({ shadowloc }) => {
        let filter: string;
        let box: string;
        switch (shadowloc) {
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

        return {
            filter: filter!!,
            boxShadow: box!!,
        };
    }),
};

// 커스텀 컴포넌트
export const MUIComponet = {
    /** 플레이 아이콘 */
    PlayIcon: forwardRef<HTMLOrSVGElement, SvgIconProps>((props, ref) => {
        // ref 사용
        return <MUICustumStyle.PlayIcon {...props} viewBox="6 5 14 14" />;
    }),

    /** 플레이 아이콘 내부 색 들어간거 */
    PlayIconFill: forwardRef<HTMLOrSVGElement, SvgIconProps>((props, ref) => {
        // ref 사용
        return <MUICustumStyle.PlayIconTwoTone {...props} viewBox="6 5 14 14" />;
    }),

    /** 진행바  */
    ProgressBar: forwardRef<HTMLSpanElement, SliderProps>((props, ref) => {
        //ref 사용
        return <Slider {...props} ref={ref} aria-label="Default" />;
    }),

    /** 볼륨바 */
    VolumeSlider: forwardRef<HTMLSpanElement, SliderProps>((props, ref) => {
        //ref 사용
        return <Slider {...props} ref={ref} aria-label="Default" valueLabelDisplay="auto" />;
    }),

    /** 리스트 버튼 */
    ListButton: forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
        //ref 사용
        return <MUICustumStyle.ListButton {...props} ref={ref} variant="contained" />;
    }),

    /** ListButton과 쓸수있는 슬라이드형 중첩 List */
    NestedListItem: forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
        //ref 사용
        return <MUICustumStyle.NestedListItem {...props} ref={ref} variant="contained" />;
    }),

    /** 그림자있는 div */
    ShadowDiv(
        props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
            shadowloc: "left" | "right" | "bottom";
        }
    ) {
        return <MUICustumStyle.ShadowDiv {...props}></MUICustumStyle.ShadowDiv>;
    },
};
