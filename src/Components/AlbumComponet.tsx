import React, { Component, Fragment } from "react";
import tempAlbumArt from "../Assets/tempAlbumArt.png";
import AWSUtiil from "../Utils/AWSUtill";
import "./AlbumComponet.css"

class AlbumView extends Component {
    state: Readonly<{
        playerElement?: Array<{
            title?: string;
        }>;
        albumInfo: {
            album?: string;
            albumArt?: Blob;
            albumyear?: number;
            tracklist: number
        };
    }> = {
        playerElement: [],
        albumInfo: {
            tracklist: 0
        },
    };

    // url 목록들
    urls: string[] = [];

    props: Readonly<{
        awsutill: AWSUtiil;
        album: string;
    }> = this.props;

    // 페이지 첫 로딩시 실행
    componentDidMount(): void {
        // 앨범 곡 리스트 불러오기
        const getAlbumList = this.props.awsutill.getFilelist(this.props.album);

        getAlbumList.then((item) => {
            //앨범 정보 불러오기
            this.getAlbumInfo(item[0]!!, item.length);

            for (const filename of item) {
                this.props.awsutill.getFileURL(filename!!).then((url) => {
                    this.urls.push(url);
                });

                this.state.playerElement?.push({ title: "" });
                this.putTitle(
                    filename!!,
                    this.state.playerElement?.length!! - 1
                );
            }
        });
    }

    // 앨범 정보 불러오기
    private async getAlbumInfo(filename: string, trackList: number) {
        const mataData = await this.props.awsutill.getID3Tag(filename, false);
        console.log(mataData);
        
        let albumArt;
        if (mataData.picture) {
            albumArt = new Blob([mataData.picture[0].data]);
        }

        const albumInfo: typeof this.state.albumInfo = {
            album: mataData.album,
            albumyear: mataData.year,
            albumArt: albumArt,
            tracklist: trackList
        };

        this.setState({ albumInfo: albumInfo });
    }

    // 모든 곡 제목을 배열에
    private async putTitle(filename: string, index: number) {
        const mataData = await this.props.awsutill.getID3Tag(filename);
        const temp = [...this.state.playerElement!!];
        temp[index].title = mataData.title;

        this.setState({ playerElement: temp });
    }

    render(): React.ReactNode {
        if (this.state.playerElement) {
            const stateData = this.state;

            let albumArt: string;
            if (stateData.albumInfo.albumArt) albumArt = URL.createObjectURL(stateData.albumInfo.albumArt);
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
                        <p id="albumName">{stateData.albumInfo.album || "앨범명"}</p>
                        <p>{stateData.albumInfo.albumyear || "발매일"}</p>
                        <p>트랙리스트: {stateData.albumInfo.tracklist}</p>
                    </div>
                </div>
            );
        } else {
            //로딩화면 구성
            return <div>로딩중</div>;
        }
    }
}

export default AlbumView;
