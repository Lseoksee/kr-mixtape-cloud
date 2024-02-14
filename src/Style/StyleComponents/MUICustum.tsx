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

// 커스텀 컴포넌트
export const MUIComponet = {
    /** 플레이 아이콘 */
    PlayIcon(props: { defaultStyle?: SvgIconProps; size: string }): JSX.Element {
        const Icon = styled(PlayArrowOutlinedIcon)<SvgIconProps>(({ theme }) => ({
            width: "100%",
            height: props.size,
            fill: "#00E39F",
            fontSize: "inherit",
            boxSizing: "border-box",
        }));

        return <Icon {...props.defaultStyle} viewBox="6 5 14 14" />;
    },
};
