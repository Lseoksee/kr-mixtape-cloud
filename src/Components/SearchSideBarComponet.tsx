import { Component, ReactNode } from "react";
import "../Style/SearchSideBarComponet.css";
import constants from "../constants";
import albumList from "../albumList.json";
import { MUIComponet } from "../Style/StyleComponents/MUICustum";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import searchIcon from "../Assets/searchIcon.png";
import tempArtist from "../Assets/tempArtist.svg";
import tempAlbumArt from "../Assets/tempAlbumArt.png";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Utils from "../Utils/Utils";
import { Collapse } from "@mui/material";

type SearchSideBarProp = {
    router: RouterType.RouterHook;
};

class SearchSideBarComponet extends Component<SearchSideBarProp> {
    shouldComponentUpdate(nextProps: Readonly<SearchSideBarProp>, nextState: Readonly<any>, nextContext: any) {
        if (this.props.router.location.pathname === nextProps.router.location.pathname) return false;

        return true;
    }

    render(): ReactNode {
        const router = this.props.router;
        const location = decodeURI(router.location.pathname);

        return (
            <MUIComponet.ShadowDiv className="SearchSideBarDiv" shadowloc="right">
                <div className="logoDiv">
                    <p>(로고 들어갈자리)</p>
                </div>
                <p className="title">한국 힙합 믹스테입 저장소</p>
                <div className="menu">
                    <MUIComponet.ListButton
                        color={location === "/" ? "primary" : "secondary"}
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
                    {albumList.map((itme, index) => {
                        const isView = location === `${constants.ARTIST_PAGE}/${itme.artist}`;

                        return (
                            <div key={index} className="navigateArtistLayout">
                                <MUIComponet.ListButton
                                    color={isView ? "primary" : "secondary"}
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
                                    {isView ? (
                                        <ExpandLessIcon className="icons" />
                                    ) : (
                                        <ExpandMoreIcon className="icons" />
                                    )}
                                </MUIComponet.ListButton>
                                <Collapse in={isView} unmountOnExit>
                                    {itme.albums.map((album, index) => (
                                        <div className="nestedListDiv">
                                            <MUIComponet.NestedListItem
                                                key={index}
                                                color="secondary"
                                                className="nestedListItem"
                                            >
                                                <div className="albumInfo">
                                                    <img
                                                        src={tempAlbumArt}
                                                        alt={album.album}
                                                        width={"32px"}
                                                        className="albumArt"
                                                    />
                                                    <p>{album.album}</p>
                                                </div>
                                                <p className="year">2008</p>
                                            </MUIComponet.NestedListItem>
                                        </div>
                                    ))}
                                </Collapse>
                            </div>
                        );
                    })}
                </div>
            </MUIComponet.ShadowDiv>
        );
    }
}

export default SearchSideBarComponet;
