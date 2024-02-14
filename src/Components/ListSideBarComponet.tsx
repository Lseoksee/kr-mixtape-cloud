import { Component, ReactNode } from "react";
import Gs from "../Style/StyleComponents/GlobalStyleComponet";
import "../Style/ListSideBarComponet.css"

class ListSideBarComponet extends Component {
    render(): ReactNode {
        return (
            <Gs.ShadowDiv shadowloc="left" className="ListSideBarDiv">
                <p>재생목록/가사 사이드 바</p>
            </Gs.ShadowDiv>
        );
    }
}

export default ListSideBarComponet;