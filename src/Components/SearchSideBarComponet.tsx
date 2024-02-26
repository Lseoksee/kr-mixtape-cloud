import { Component, ReactNode } from "react";
import "../Style/SearchSideBarComponet.css";
import constants from "../constants";
import albumList from "../albumList.json";
import { MUIComponet } from "../Style/StyleComponents/MUICustum";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import searchIcon from "../Assets/searchIcon.png";
import tempArtist from "../Assets/tempArtist.svg";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Utils from "../Utils/Utils";

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
                <div className="logoDiv">
                    <p>(로고 들어갈자리)</p>
                </div>
                <p className="title">한국 힙합 믹스테입 저장소</p>
                <div className="menu">
                    <MUIComponet.ListButton
                        color="primary"
                        onClick={() => router.navigate("/")}
                        className="navigateHome"
                    >
                        <HomeRoundedIcon className="menuIcons" />
                        <p className="menuTitle">홈 화면</p>
                    </MUIComponet.ListButton>
                </div>
                <div className="searchLayout">
                    <p className="categoryText">믹스테잎 탐색</p>
                    <hr className="categoryBar" />
                    <div className="searchBarDiv">
                        <img src={searchIcon} alt="검색아이콘" width="32px" />
                        <input type="text" className="searchBar" placeholder="앨범명, 아티스트 검색" />
                    </div>
                </div>
                <div className="artistList">
                {albumList.map((itme, index) => (
                    <MUIComponet.NestedListButton
                        key={index}
                        mode="close"
                        color="primary"
                        className="navigateArtist"
                        onClick={() => router.navigate(`${constants.ARTIST_PAGE}/${itme.artist}`)}
                    >
                        <div className="artist">
                            <img
                                src={Utils.getArtistImg(itme.artist)}
                                alt={itme.artist}
                                width="38px"
                                height="38px"
                                className="artistImg"
                                onError={(e) => (e.currentTarget.src = `${tempArtist}`)}
                            />
                            <p>{itme.artist}</p>
                        </div>
                        <ExpandMoreIcon className="icons" />
                    </MUIComponet.NestedListButton>
                ))}
                </div>

            </MUIComponet.ShadowDiv>
        );
    }
}

export default SearchSideBarComponet;
