import React, { Component, Fragment } from "react";
import tempAlbumArt from "../Assets/tempAlbumArt.png";
import AWSUtiil from "../Utils/AWSUtill";
import "./AlbumComponet.css";
import { AlbumCache, SongCache } from "../Utils/BrowserCache";
import { ConnectedProps } from "react-redux";
import { ReduxActions, reduxConnect } from "../Utils/ConfingRedux";

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

    props: Readonly<AlbumViewProp> = this.props;

    songCache = new SongCache();
    albumCache = new AlbumCache();

    // url 목록들
    urls: string[] = [];

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
        const getAlbumList = this.props.awsutill.getFilelist(
            this.props.albumSrc
        );

        getAlbumList.then((item) => {
            //앨범 정보 불러오기
            const albumCached = this.albumCache.getAlbumCache(
                this.props.albumName,
                this.props.artist
            );
            if (albumCached) {
                this.setState({ albumInfo: albumCached });
            } else {
                this.props.awsutill.getAlbumTag(item, this.props.albumName, this.props.artist).then((res) => {
                        this.setState({ albumInfo: res });
                        const redux = ReduxActions.albumArtLoadEvent({LoadAlbum: res,});
                        this.props.dispatch(redux);
                    });
            }

            // 곡정보 불러오기
            this.getSongInfo(item);

            for (const file of item) {
                this.props.awsutill.getFileURL(file!!).then((url) => {
                    this.urls.push(url);
                });
            }
        });
    }

    // 곡 정보 불러오기
    getSongInfo(item: AlbumCompType.file[]) {
        const songCached = this.songCache.getSongCache(item, this.props.albumName, this.props.artist);

        if (songCached) {
            // 캐싱된 데이터에서 추가된 값이 있는지
            if (songCached.addEelment) {
                this.props.awsutill
                    .getMusicID3Tag(songCached.addEelment)
                    .then((item) => {
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

    render(): React.ReactNode {
        if (this.state.playerElement?.length) {
            const stateData = this.state;

            let albumArt = tempAlbumArt;

            if (stateData.albumInfo.album) {
                const buffer = Buffer.from(
                    Array.from(stateData.albumInfo.art!!).map((line) =>
                        line.charCodeAt(0)
                    )
                );
                const blob = new Blob([buffer]);
                albumArt = URL.createObjectURL(blob);
            }

            const playList = this.state.playerElement.map((item, index) => {
                return (
                    <Fragment key={index}>
                        <h1>{item.title || "타이틀"}</h1>
                        <audio controls>
                            <source src=""></source>
                        </audio>
                    </Fragment>
                );
            });

            return (
                <div id="trackView">
                    <div id="albuminfoDiv">
                        <img src={albumArt} alt="앨범 아트" width="160px"></img>
                        <p id="albumName">
                            {stateData.albumInfo.album || "앨범명"}
                        </p>
                        <p>{stateData.albumInfo.year || "발매일"}</p>
                        <p>트랙리스트: {stateData.albumInfo.count}</p>
                    </div>
                    {playList}
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
