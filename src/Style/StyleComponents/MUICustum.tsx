import { SvgIconProps, createTheme, styled } from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
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
        height: "50%",
        fill: "#00E39F",
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
};
