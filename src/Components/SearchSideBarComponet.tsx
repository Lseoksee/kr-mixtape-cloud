import { Component, ReactNode } from "react";
import "../Style/SearchSideBarComponet.css";
import { Button } from "@mui/material";
import constants from "../constants";
import albumList from "../albumList.json";

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
            <aside className="SearchSideBarDiv">
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
            </aside>
        );
    }
}


export default SearchSideBarComponet;
