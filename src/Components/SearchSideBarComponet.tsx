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

type SearchSideBarState = {
    openObj: {
        [key: string]: any;
    };
};

class SearchSideBarComponet extends Component<SearchSideBarProp, SearchSideBarState> {
    state: Readonly<SearchSideBarState> = {
        openObj: {},
    };

    componentDidUpdate(
        prevProps: Readonly<SearchSideBarProp>,
        prevState: Readonly<SearchSideBarState>,
        snapshot?: any
    ): void {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            // 페이지가 바뀔때 아티스트 앨범 목록을 반드시 활성화 하도록 하기 위한 작업
            const router = this.props.router;
            const location = decodeURI(router.location.pathname);

            // 아티스트 페이지
            if (location.startsWith(constants.ARTIST_PAGE)) {
                this.setState((prev) => {
                    prev.openObj[location] = true;
                    return prev;
                });
            }

            // 홈 페이지 (시작 값 비교라 "/" 로 두면 모든 값을 허용하는 거라)
            else {
                this.setState({ openObj: {} });
            }
        }
    }

    componentDidMount(): void {
        // 처음 컴포넌트가 마운트 된경우 componentDidUpdate가 작동하지 않아 처음로드 된경우 처리
        const router = this.props.router;
        const location = decodeURI(router.location.pathname);

        // 아티스트 페이지
        if (location.startsWith(constants.ARTIST_PAGE)) {
            this.setState((prev) => {
                prev.openObj[location] = true;
                return prev;
            });
        }
    }

    shouldComponentUpdate(nextProps: Readonly<SearchSideBarProp>, nextState: Readonly<any>, nextContext: any) {
        if (this.state !== nextState) return true;
        if (this.props.router.location.pathname !== nextProps.router.location.pathname) return true;

        return false;
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
                        //현제 패이지인지 여부
                        const isView = location === `${constants.ARTIST_PAGE}/${itme.artist}`;
                        // 아티스트 앨범 목록 펼쳐진 여부
                        let open = this.state.openObj[`${constants.ARTIST_PAGE}/${itme.artist}`];

                        return (
                            <div key={index} className="navigateArtistLayout">
                                <MUIComponet.ListButton
                                    color={isView ? "primary" : "secondary"}
                                    className="navigateArtist"
                                    onClick={() => {
                                        router.navigate(`${constants.ARTIST_PAGE}/${itme.artist}`);
                                    }}
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
                                    {open ? (
                                        <ExpandLessIcon
                                            className="icons"
                                            onClick={(e) => {
                                                this.setState((prev) => {
                                                    prev.openObj[`${constants.ARTIST_PAGE}/${itme.artist}`] = false;
                                                    return prev;
                                                });
                                                // 이벤트 버블링 막기
                                                e.stopPropagation();
                                            }}
                                        />
                                    ) : (
                                        <ExpandMoreIcon
                                            className="icons"
                                            onClick={(e) => {
                                                this.setState((prev) => {
                                                    prev.openObj[`${constants.ARTIST_PAGE}/${itme.artist}`] = true;
                                                    return prev;
                                                });
                                                // 이벤트 버블링 막기
                                                e.stopPropagation();
                                            }}
                                        />
                                    )}
                                </MUIComponet.ListButton>
                                <Collapse in={open} unmountOnExit>
                                    {itme.albums.map((album, index) => (
                                        <div className="nestedListDiv" key={index}>
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
