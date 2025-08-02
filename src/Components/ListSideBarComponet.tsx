import { Component, type ReactNode } from "react";
import "../Style/ListSideBarComponet.css";
import { ShadowDiv } from "./StyleComponet";

class ListSideBarComponet extends Component {
	render(): ReactNode {
		return (
			<ShadowDiv shadowloc="left" className="ListSideBarDiv">
				<p>재생목록/가사 사이드 바</p>
			</ShadowDiv>
		);
	}
}

export default ListSideBarComponet;
