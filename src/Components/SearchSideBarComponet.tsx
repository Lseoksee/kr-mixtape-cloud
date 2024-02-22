import { Component, ReactNode } from "react";
import "../Style/SearchSideBarComponet.css";
import { Button } from "@mui/material";
import constants from "../constants";
import albumList from "../albumList.json";
import { MUIComponet } from "../Style/StyleComponents/MUICustum";

type SearchSideBarProp = {
    router: RouterType.RouterHook;
};

class SearchSideBarComponet extends Component<SearchSideBarProp, any> {
    /** redux 로 인한 갱신 막기 */
    shouldComponentUpdate(nextProps: Readonly<SearchSideBarProp>, nextState: Readonly<any>, nextContext: any) {
        if (this.state === nextState) {
            return false;
        }

        return true;
    }

    render(): ReactNode {
        const router = this.props.router;

        return (
            <MUIComponet.ShadowDiv className="SearchSideBarDiv" shadowloc="right">
                <div className="logoDiv"><p>(로고 들어갈자리)</p></div>
                <p className="title">한국 힙합 믹스테입 저장소</p>
                <Button variant="contained" onClick={() => router.navigate("/")}>
                    홈 버튼
                </Button>
                {albumList.map((itme, index) => (
                    <Button
                        variant="contained"
                        key={index}
                        onClick={() => router.navigate(`${constants.ARTIST_PAGE}/${itme.artist}`)}
                    >
                        {itme.artist}
                    </Button>
                ))}
            </MUIComponet.ShadowDiv>
        );
    }
}

export default SearchSideBarComponet;
