import {  TableContainer, TableContainerProps, createTheme } from "@mui/material";
import styled from "styled-components";

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

};