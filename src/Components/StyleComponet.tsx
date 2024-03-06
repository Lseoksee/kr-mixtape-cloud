import { SvgIconProps, SliderProps, Slider, ButtonProps } from "@mui/material";
import { forwardRef } from "react";
import { MUICustumStyle } from "../Style/StyleComponents/MUICustum";

/** 플레이 아이콘 */
export const PlayIcon = forwardRef<HTMLOrSVGElement, SvgIconProps>((props, ref) => {
    // ref 사용
    return <MUICustumStyle.PlayIcon {...props} viewBox="6 5 14 14" />;
});

/** 플레이 아이콘 내부 색 들어간거 */
export const PlayIconFill = forwardRef<HTMLOrSVGElement, SvgIconProps>((props, ref) => {
    // ref 사용
    return <MUICustumStyle.PlayIconTwoTone {...props} viewBox="6 5 14 14" />;
});

/** 진행바  */
export const ProgressBar = forwardRef<HTMLSpanElement, SliderProps>((props, ref) => {
    //ref 사용
    return <Slider {...props} ref={ref} aria-label="Default" />;
});

/** 볼륨바 */
export const VolumeSlider = forwardRef<HTMLSpanElement, SliderProps>((props, ref) => {
    //ref 사용
    return <Slider {...props} ref={ref} aria-label="Default" valueLabelDisplay="auto" />;
});

/** 리스트 버튼 */
export const ListButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    //ref 사용
    return <MUICustumStyle.ListButton {...props} ref={ref} variant="contained" />;
});

/** ListButton과 쓸수있는 슬라이드형 중첩 List */
export const NestedListItem = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    //ref 사용
    return <MUICustumStyle.NestedListItem {...props} ref={ref} variant="contained" />;
});

/** 그림자있는 div */
export function ShadowDiv(
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        shadowloc: "left" | "right" | "bottom";
    }
) {
    return <MUICustumStyle.ShadowDiv {...props}></MUICustumStyle.ShadowDiv>;
}
