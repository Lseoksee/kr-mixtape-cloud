import { SvgIconProps, SxProps, Theme, createTheme, styled } from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PlayArrowTwoToneIcon from "@mui/icons-material/PlayArrowTwoTone";
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
};
