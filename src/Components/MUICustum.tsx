import { Theme } from "@emotion/react";
import { SxProps, createTheme } from "@mui/material";

// 테마
export const MUITheme = {
   defaultTheme: createTheme({
        typography: {
            fontFamily: "Inter, sans-serif",
        }
    })
};

// 커스텀 컴포넌트
export const MUIComponet = {

}

// 커스텀 스타일
export const MUIStyle = {
    songNum: {
        padding: 0,
        textAlign: "center",
    } as SxProps<Theme>,
}