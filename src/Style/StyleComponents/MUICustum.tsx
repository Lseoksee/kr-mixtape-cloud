import { Button, type ButtonProps, type SvgIconProps, createTheme, styled } from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PlayArrowTwoToneIcon from "@mui/icons-material/PlayArrowTwoTone";
import { type CSSProperties } from "react";

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
export const MUICustumStyle = {
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
