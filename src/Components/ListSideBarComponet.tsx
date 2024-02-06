import { Component, ReactNode } from "react";
import "../Style/ListSideBarComponet.css"

class ListSideBarComponet extends Component {
    render(): ReactNode {
        return (
            <div className="ListSideBarDiv">
                <p>재생목록/가사 사이드 바</p>
            </div>
        );
    }
}

export default ListSideBarComponet;