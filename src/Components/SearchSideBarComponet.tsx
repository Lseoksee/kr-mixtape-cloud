import { Component, ReactNode } from "react";
import "../Style/SearchSideBarComponet.css";
import { Button } from "@mui/material";

class SearchSideBarComponet extends Component {
    render(): ReactNode {
        return (
            <div className="SearchSideBarDiv">
                <Button variant="contained">홈 버튼</Button>
                <Button variant="contained">E SENS</Button>
                <Button variant="contained">San E</Button>
            </div>
        );
    }
}

export default SearchSideBarComponet;
