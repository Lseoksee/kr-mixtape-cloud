import { Component, ReactNode } from "react";
import "../Style/ListSideBarComponet.css"
import { MUIComponet } from "../Style/StyleComponents/MUICustum";

class ListSideBarComponet extends Component {
    render(): ReactNode {
        return (
            <MUIComponet.ShadowDiv shadowloc="left" className="ListSideBarDiv">
                <p>재생목록/가사 사이드 바</p>
            </MUIComponet.ShadowDiv>
        );
    }
}

export default ListSideBarComponet;