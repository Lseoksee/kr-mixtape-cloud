import React, { Component, Fragment } from "react";
import tempAlbumArt from "../Assets/tempAlbumArt.png";
import AWSUtiil from "../Utils/AWSUtill";
import "./AlbumComponet.css";
import { SongCache } from "../Utils/BrowserCache";

class AlbumView extends Component {
    state: Readonly<{
        playerElement: Array<AlbumCompType.musicMeta>;
        albumInfo: AlbumCompType.album;
    }> = {
        playerElement: [],
        albumInfo: {
            count: 0,
        },
    };

    ch = new SongCache();

    // url 목록들
    urls: string[] = [];

    props: Readonly<{
        albumSrc: string; //앨범경로
        albumName: string; //앨범명
        artist: string; //아티스트명
        awsutill: AWSUtiil;
        renew: (albumData: AlbumCompType.songCache) => void
    }> = this.props;

    //state 값 업데이트 시 실행
    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
        if (this.state.playerElement?.length && this.state.albumInfo.album) {
            this.props.renew(this.ch.saveStorage!!);
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
            this.props.awsutill.getAlbumTag(item).then((res) => {
                this.setState({ albumInfo: res });
            });

            const cached =  this.ch.getSongCache(item, this.props.albumName, this.props.artist);
            
            if (cached) {
                // 캐싱된 데이터에서 추가된 값이 있는지
                if (cached.addEelment) {
                    this.props.awsutill.getMusicID3Tag(cached.addEelment).then((item) => {
                        const cachedSort = this.ch.insertSongCache(item);
                        this.setState({ playerElement: cachedSort });
                    }); 
                }
                
                // 없으면 그냥 setState
                else {
                    this.setState({ playerElement: cached.album });
                }
            } else {
                // 최초 로드시 앨범 전체 요청
                this.props.awsutill.getMusicID3Tag(item).then((item) => {
                    this.ch.addSongCache(item, this.props.albumName, this.props.artist);
                    this.setState({ playerElement: item });
                });
            }

            for (const file of item) {
                this.props.awsutill.getFileURL(file!!).then((url) => {
                    this.urls.push(url);
                });
            }
        });
    }

    render(): React.ReactNode {
        if (this.state.playerElement?.length) {
            const stateData = this.state;

            let albumArt: string;
            if (stateData.albumInfo.albumart) albumArt = URL.createObjectURL(stateData.albumInfo.albumart);
            else albumArt = tempAlbumArt;

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

export default AlbumView;
