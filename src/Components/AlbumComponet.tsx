import React, { Component, Fragment } from "react";
import AWSUtiil from "../Utils/AWSUtill";

class AlbumView extends Component {
    state: Readonly<{
        playerElement?: Array<{
            url?: string;
            title?: string;
        }>;
    }> = {
        playerElement: [],
    };

    props: Readonly<{
        awsutill: AWSUtiil;
        album: string;
    }> = this.props;

    // 페이지 첫 로딩시 실행
    componentDidMount(): void {
        // 앨범 곡 리스트 불러오기
        const getAlbumList = this.props.awsutill.getFilelist(this.props.album);

        getAlbumList.then((item) => {
            item.forEach((filename) => {
                this.state.playerElement?.push({ url: "", title: "" });
                this.putUrls(
                    filename!!,
                    this.state.playerElement?.length!! - 1
                );
                this.putTitle(
                    filename!!,
                    this.state.playerElement?.length!! - 1
                );
            });
        });
    }

    // 모든 url 목록 배열에
    private async putUrls(filename: string, index: number) {
        const url = await this.props.awsutill.getFileURL(filename);
        const temp = [...this.state.playerElement!!];

        temp[index].url = url;
        this.setState({ ...this.state, playerElement: temp });
    }

    // 모든 곡 제목을 배열에
    private async putTitle(filename: string, index: number) {
        const mataData = await this.props.awsutill.getID3Tag(filename);
        const temp = [...this.state.playerElement!!];
        temp[index].title = mataData.title;

        this.setState({ ...this.state, playerElement: temp });
    }

    render(): React.ReactNode {
        if (this.state.playerElement) {
            const playList = this.state.playerElement.map((item, index) => {
                return (
                    <Fragment key={index}>
                        <h1>{item.title || "타이틀"}</h1>
                        <audio controls>
                            <source src={item.url}></source>
                        </audio>
                    </Fragment>
                );
            });

            return <div>{playList}</div>;
        } else {
            //로딩화면 구성
            return <div>로딩중</div>;
        }
    }
}

export default AlbumView;
