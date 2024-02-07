import { Component, ReactNode } from "react";
import "../Style/SearchSideBarComponet.css";
import { Button } from "@mui/material";
import constants from "../constants";

type SearchSideBarProp = {
    router: RouterType.RouterHook;
};

class SearchSideBarComponet extends Component<SearchSideBarProp, any> {
    render(): ReactNode {
        const router = this.props.router;

        return (
            <div className="SearchSideBarDiv">
                <Button variant="contained" onClick={() => router.navigate(`${constants.MAIN_PAGE}`)}>홈 버튼</Button>
                <Button variant="contained" onClick={() => router.navigate(`${constants.ARTIST_PAGE}/E SENS`)}>
                    E SENS
                </Button>
                <Button variant="contained">San E</Button>
            </div>
        );
    }
}

export default SearchSideBarComponet;
