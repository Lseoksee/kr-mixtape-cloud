import React, { Component } from "react";
import tempAlbumArt from "../Assets/tempAlbumArt.png";
import AWSUtiil from "../Utils/AWSUtill";
import "../Style/AlbumComponet.css";
import { AlbumCache, SongCache } from "../Utils/BrowserCache";
import { ConnectedProps } from "react-redux";
import { ReduxActions, reduxConnect } from "../Store/ConfingRedux";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import {
    Paper,
    StyledEngineProvider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ThemeProvider,
} from "@mui/material";
import Utils from "../Utils/Utils";
import { MUITheme } from "../Style/StyleComponents/MUICustum";
import { AlbumCacheManager } from "../GlobalAppData";
import GlobalStyle from "../Style/StyleComponents/GlobalStyle";

type AlbumViewProp = {
    albumName: string; //앨범명
    artist: string; //아티스트명
    songList: AlbumCompType.file[];
    albumCacheManager: AlbumCacheManager;
} & ConnectedProps<typeof reduxConnect>;

type AlbumViewState = {
    playerElement: Array<AlbumCompType.musicMeta>;
    albumInfo: AlbumCompType.album;
    songHover: number;
    key: string;
};

class AlbumView extends Component<AlbumViewProp, AlbumViewState> {
    state: Readonly<AlbumViewState> = {
        playerElement: [],
        albumInfo: {
            count: 0,
        },
        songHover: -1,
        key: "",
    };

    appData: { albumArt: string } = {
        albumArt: tempAlbumArt,
    };

    songCache = new SongCache();
    albumCache = new AlbumCache();

    // state 값 업데이트 시 실행
    componentDidUpdate(prevProps: Readonly<AlbumViewProp>, prevState: Readonly<AlbumViewState>, snapshot?: any): void {
        const key = this.state.key;

        if (key === "albumart" || key === "song") {
            if (this.state.playerElement?.length && this.state.albumInfo.album) {
                // 음악 케싱
                this.props.albumCacheManager.songLoadEvent(this.songCache.saveStorage!!);
            }
        }
    }

    // 페이지 첫 로딩시 실행
    componentDidMount(): void {
        //앨범 정보 불러오기
        const albumCached = this.albumCache.getAlbumCache(this.props.albumName, this.props.artist);
        if (albumCached) {
            // 앨범 아트 설정
            this.appData.albumArt = Utils.byteStringToBlob(albumCached.art)!!;
            this.setState({ albumInfo: albumCached, key: "albumart" });
        } else {
            AWSUtiil.getAWSUtiil()
                .getAlbumTag(this.props.songList, this.props.albumName, this.props.artist)
                .then((res) => {
                    // 앨범 아트 설정
                    this.appData.albumArt = Utils.byteStringToBlob(res.art) || this.appData.albumArt;

                    this.setState({ albumInfo: res, key: "albumart" });
                    // 앨범 케싱
                    this.props.albumCacheManager.albumLoadEvent(res);
                });
        }

        // 곡정보 불러오기
        const songCached = this.songCache.getSongCache(this.props.songList, this.props.albumName, this.props.artist);

        if (songCached) {
            // 캐싱된 데이터에서 추가된 값이 있는지
            if (songCached.addEelment) {
                AWSUtiil.getAWSUtiil()
                    .getMusicID3Tag(songCached.addEelment)
                    .then((item) => {
                        const cachedSort = this.songCache.insertSongCache(item);
                        this.setState({ playerElement: cachedSort!!, key: "song" });
                    });
            }

            // 없으면 그냥 setState
            else this.setState({ playerElement: songCached.album, key: "song" });
        } else {
            // 최초 로드시 앨범 전체 요청
            AWSUtiil.getAWSUtiil()
                .getMusicID3Tag(this.props.songList)
                .then((item) => {
                    this.songCache.addSongCache(item, this.props.albumName, this.props.artist);
                    this.setState({ playerElement: item, key: "song" });
                });
        }
    }

    // 클릭시 url로드하여 들을 수 있게
    private async loadUrl(musicList: AlbumCompType.musicMeta[], myIndex: number) {
        const loadMusicInfo = Promise.all(
            musicList.map(async (itme) => {
                return {
                    musicMeta: itme,
                    albumArtUrl: this.appData.albumArt,
                    albumName: this.props.albumName,
                    url: await AWSUtiil.getAWSUtiil().getFileURL(itme.file),
                } as AlbumCompType.loadMusicInfo;
            })
        );

        /** 결과를 Redux로 넘겨 MusicPlayerComponet가 갱신되도록 */
        const setStartMusic = ReduxActions.setStartMusic({
            loadMusicInfo: await loadMusicInfo,
            startIndex: myIndex,
        });
        this.props.dispatch(setStartMusic);
    }

    /* 각행 표시 퍼센트 */
    tdStyle: Array<React.CSSProperties> = [{ width: "5%" }, { width: "55%" }, { width: "30%" }, { width: "10%" }];

    render(): React.ReactNode {
        if (this.state.playerElement?.length) {
            const stateData = this.state;

            return (
                <div className="trackView">
                    <div className="albuminfoDiv">
                        <img src={this.appData.albumArt} alt="앨범 아트" className="albumArt" width="180px" />
                        <div className="albumTextDiv">
                            <p className="albumName">{stateData.albumInfo.album || "앨범명"}</p>
                            <div className="artistDiv">
                                <img
                                    src={`/artistimage/${this.props.artist}.png`}
                                    alt={this.props.artist}
                                    className="artistImage InfoIcon"
                                    width="36px"
                                    height="36px"
                                />
                                <p>{this.props.artist}</p>
                            </div>
                            <div className="albumData">
                                <AccessTimeIcon sx={{ fontSize: "36px" }} className="InfoIcon"></AccessTimeIcon>
                                <p>
                                    {stateData.albumInfo.year || ""}년 · {stateData.albumInfo.count}곡
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* 사용자 스타일시트 우선순위 올리기 */}
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={MUITheme.defaultTheme}>
                            <TableContainer component={Paper} className="tableDiv">
                                <Table stickyHeader>
                                    <TableHead className="thead">
                                        <TableRow className="tableHeadRow">
                                            <TableCell className="songNum" style={this.tdStyle[0]}>
                                                #
                                            </TableCell>
                                            <TableCell style={this.tdStyle[1]}>제목</TableCell>
                                            <TableCell style={this.tdStyle[2]}>아티스트</TableCell>
                                            <TableCell style={this.tdStyle[3]} className="timeRow">
                                                길이
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="tbody">
                                        {this.state.playerElement.map((item, index) => (
                                            <TableRow
                                                className="tableBodyRow"
                                                key={index}
                                                hover
                                                onMouseOver={() => {
                                                    this.setState({ songHover: index, key: "hover" });
                                                }}
                                                onDoubleClick={() => {
                                                    this.loadUrl(this.state.playerElement, index);
                                                }}
                                            >
                                                <TableCell
                                                    className="songNum"
                                                    style={{
                                                        ...GlobalStyle.hintText,
                                                        ...this.tdStyle[0],
                                                    }}
                                                    onClick={() => {
                                                        this.loadUrl(this.state.playerElement, index);
                                                    }}
                                                >
                                                    {index === stateData.songHover ? (
                                                        <PlayArrowOutlinedIcon />
                                                    ) : (
                                                        item.track.no
                                                    )}
                                                </TableCell>
                                                <TableCell style={this.tdStyle[1]}>{item.title}</TableCell>
                                                <TableCell style={this.tdStyle[2]}>{item.artist}</TableCell>
                                                <TableCell
                                                    style={{
                                                        ...GlobalStyle.hintText,
                                                        ...this.tdStyle[3],
                                                    }}
                                                    className="timeRow"
                                                >
                                                    {Utils.secToMin(item.duration)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </ThemeProvider>
                    </StyledEngineProvider>
                </div>
            );
        } else {
            //로딩화면 구성
            return <></>;
        }
    }
}

// 클래스 컴포넌트에서 redux 재어를 위한
export default reduxConnect(AlbumView);
