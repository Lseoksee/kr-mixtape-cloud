import React, { Component } from "react";
import tempAlbumArt from "../Assets/tempAlbumArt.png";
import AWSUtiil from "../Utils/AWSUtill";
import "../Style/AlbumComponet.css";
import { AlbumCache, SongCache } from "../Utils/BrowserCache";
import { ConnectedProps } from "react-redux";
import { ReduxActions, reduxConnect } from "../Contexts/ConfingRedux";
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
import { Utils } from "../Utils/Utils";
import { MUITheme, MUIStyle } from "./MUICustum";
import ContextStore, { ContextType } from "../Contexts/ConfingContext";

type AlbumViewProp = {
    albumSrc: string; //앨범경로
    albumName: string; //앨범명
    artist: string; //아티스트명
    awsutill: AWSUtiil;
} & ConnectedProps<typeof reduxConnect>;

type AlbumViewState = {
    playerElement: Array<AlbumCompType.musicMeta>;
    albumInfo: AlbumCompType.album;
    songHover: number;
    key: string;
};

class AlbumView extends Component<AlbumViewProp, AlbumViewState> {
    // context 사용을 위한
    static contextType = ContextStore;

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
                const songLoadredux = ReduxActions.SongLoadEvent({
                    LoadSong: this.songCache.saveStorage!!,
                });
                this.props.dispatch(songLoadredux);

                // 전역으로 앨범아트 저장
                const saveAlbumredux = ReduxActions.SaveAlbumInfo({
                    SaveAlbumArt: {
                        ...this.state.albumInfo,
                        art: this.appData.albumArt,
                    },
                });
                this.props.dispatch(saveAlbumredux);
            }
        }
    }

    // 페이지 첫 로딩시 실행
    componentDidMount(): void {
        // 앨범 곡 리스트 불러오기
        const getAlbumList = this.props.awsutill.getFilelist(this.props.albumSrc);

        getAlbumList.then((item) => {
            //앨범 정보 불러오기
            const albumCached = this.albumCache.getAlbumCache(this.props.albumName, this.props.artist);
            if (albumCached) {
                // 앨범 아트 설정
                this.appData.albumArt = Utils.byteStringToBlob(albumCached.art)!!;
                this.setState({ albumInfo: albumCached, key: "albumart" });
            } else {
                this.props.awsutill.getAlbumTag(item, this.props.albumName, this.props.artist).then((res) => {
                    // 앨범 아트 설정
                    this.appData.albumArt = Utils.byteStringToBlob(res.art) || this.appData.albumArt;

                    this.setState({ albumInfo: res, key: "albumart" });
                    const redux = ReduxActions.albumArtLoadEvent({
                        LoadAlbum: res,
                    });
                    this.props.dispatch(redux);
                });
            }

            // 곡정보 불러오기
            const songCached = this.songCache.getSongCache(item, this.props.albumName, this.props.artist);

            if (songCached) {
                // 캐싱된 데이터에서 추가된 값이 있는지
                if (songCached.addEelment) {
                    this.props.awsutill.getMusicID3Tag(songCached.addEelment).then((item) => {
                        const cachedSort = this.songCache.insertSongCache(item);
                        this.setState({ playerElement: cachedSort!!, key: "song" });
                    });
                }

                // 없으면 그냥 setState
                else this.setState({ playerElement: songCached.album, key: "song" });
            } else {
                // 최초 로드시 앨범 전체 요청
                this.props.awsutill.getMusicID3Tag(item).then((item) => {
                    this.songCache.addSongCache(item, this.props.albumName, this.props.artist);
                    this.setState({ playerElement: item, key: "song" });
                });
            }
        });
    }

    // 클릭시 url로드하여 들을 수 있게
    private async loadUrl(musicMeta: AlbumCompType.musicMeta) {
        const context = this.context as ContextType;
        const url = await this.props.awsutill.getFileURL(musicMeta.file);

        context.setMusicState({
            musicMeta: musicMeta,
            albumArtist: this.props.artist,
            albumName: this.props.albumName,
            url: url,
        });
    }

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
                            <TableContainer component={Paper}>
                                <Table stickyHeader>
                                    <colgroup>
                                        <col width="1%" />
                                        <col width="55%" />
                                        <col width="25%" />
                                        <col width="1%" />
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={MUIStyle.songNum}>#</TableCell>
                                            <TableCell>제목</TableCell>
                                            <TableCell>아티스트</TableCell>
                                            <TableCell>길이</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.playerElement.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                hover
                                                onMouseOver={() => {
                                                    this.setState({ songHover: index, key: "hover" });
                                                }}
                                                onDoubleClick={() => {
                                                    this.loadUrl(item);
                                                }}
                                            >
                                                <TableCell sx={MUIStyle.songNum}>
                                                    {index === stateData.songHover ? (
                                                        <PlayArrowOutlinedIcon />
                                                    ) : (
                                                        item.track.no
                                                    )}
                                                </TableCell>
                                                <TableCell>{item.title}</TableCell>
                                                <TableCell>{item.artist}</TableCell>
                                                <TableCell>{Utils.secToMin(item.duration)}</TableCell>
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
const useClassRedux = reduxConnect(AlbumView);

export default useClassRedux;
