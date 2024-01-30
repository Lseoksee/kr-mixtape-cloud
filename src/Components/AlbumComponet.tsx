import React, { Component, Fragment } from "react";
import tempAlbumArt from "../Assets/tempAlbumArt.png";
import AWSUtiil from "../Utils/AWSUtill";
import "../Style/AlbumComponet.css";
import { AlbumCache, SongCache } from "../Utils/BrowserCache";
import { ConnectedProps } from "react-redux";
import { ReduxActions, reduxConnect } from "../Utils/ConfingRedux";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
    Paper,
    StyledEngineProvider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { Utils } from "../Utils/Utils";

type AlbumViewProp = {
    albumSrc: string; //앨범경로
    albumName: string; //앨범명
    artist: string; //아티스트명
    awsutill: AWSUtiil;
} & ConnectedProps<typeof reduxConnect>;

type AlbumViewState = {
    playerElement: Array<AlbumCompType.musicMeta>;
    albumInfo: AlbumCompType.album;
};

class AlbumView extends Component<AlbumViewProp, AlbumViewState> {
    state: Readonly<AlbumViewState> = {
        playerElement: [],
        albumInfo: {
            count: 0,
        },
    };

    appData: { urls: string[]; albumArt: string } = {
        urls: [],
        albumArt: tempAlbumArt,
    };

    songCache = new SongCache();
    albumCache = new AlbumCache();

    //state 값 업데이트 시 실행
    componentDidUpdate(prevProps: Readonly<AlbumViewProp>, prevState: Readonly<AlbumViewState>, snapshot?: any): void {
        if (this.state.playerElement?.length && this.state.albumInfo.album) {
            const redux = ReduxActions.SongLoadEvent({
                LoadSong: this.songCache.saveStorage!!,
            });
            this.props.dispatch(redux);
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
                this.setState({ albumInfo: albumCached });
            } else {
                this.props.awsutill.getAlbumTag(item, this.props.albumName, this.props.artist).then((res) => {
                    this.setState({ albumInfo: res });
                    const redux = ReduxActions.albumArtLoadEvent({
                        LoadAlbum: res,
                    });
                    this.props.dispatch(redux);
                });
            }

            // 곡정보 불러오기
            this.getSongInfo(item);

            for (const file of item) {
                this.props.awsutill.getFileURL(file!!).then((url) => {
                    this.appData.urls.push(url);
                });
            }
        });
    }

    // 곡 정보 불러오기
    private getSongInfo(item: AlbumCompType.file[]) {
        const songCached = this.songCache.getSongCache(item, this.props.albumName, this.props.artist);

        if (songCached) {
            // 캐싱된 데이터에서 추가된 값이 있는지
            if (songCached.addEelment) {
                this.props.awsutill.getMusicID3Tag(songCached.addEelment).then((item) => {
                    const cachedSort = this.songCache.insertSongCache(item);
                    this.setState({ playerElement: cachedSort!! });
                });
            }

            // 없으면 그냥 setState
            else {
                this.setState({ playerElement: songCached.album });
            }
        } else {
            // 최초 로드시 앨범 전체 요청
            this.props.awsutill.getMusicID3Tag(item).then((item) => {
                this.songCache.addSongCache(item, this.props.albumName, this.props.artist);
                this.setState({ playerElement: item });
            });
        }
    }

    private songHoverEvent(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) {

    }

    render(): React.ReactNode {
        if (this.state.playerElement?.length) {
            const stateData = this.state;

            if (stateData.albumInfo.album) {
                const buffer = Buffer.from(Array.from(stateData.albumInfo.art!!).map((line) => line.charCodeAt(0)));
                const blob = new Blob([buffer]);
                this.appData.albumArt = URL.createObjectURL(blob);
            }

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
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <colgroup>
                                    <col width="5%" />
                                    <col width="55%" />
                                    <col width="25%" />
                                    <col width="5%" />
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>제목</TableCell>
                                        <TableCell>아티스트</TableCell>
                                        <TableCell>길이</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.playerElement.map((item, index) => (
                                        <TableRow key={index} hover onMouseOver={this.songHoverEvent}>
                                            <TableCell>{item.track.no}</TableCell>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{this.props.artist}</TableCell>
                                            <TableCell>{Utils.secToMin(item.duration)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
