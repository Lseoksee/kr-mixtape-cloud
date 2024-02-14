import {  SvgIconProps, createTheme, styled } from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
// 테마
export const MUITheme = {
    defaultTheme: createTheme({
        shape: {
            borderRadius: 15,
        },
        typography: {
            fontFamily: "Inter, sans-serif",
            fontWeightRegular: "600"
        },
    }),
};

// 커스텀 컴포넌트
export const MUIComponet = {
    PlayIcon: styled(PlayArrowOutlinedIcon)<SvgIconProps>(({theme}) => ({
        fill: "#00E39F",
        fontSize: "40px",
    }))
};