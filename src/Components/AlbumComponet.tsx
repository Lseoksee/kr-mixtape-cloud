import React, { Component } from "react";
import AWSUtiil from "../Utils/AWSUtill";

class AlbumView extends Component {
    state: Readonly<{
        playerElement: JSX.Element[];
    }> = {
        playerElement: [],
    };
    props: Readonly<{
        awsutill: AWSUtiil;
        album: string;
    }> = this.props;

    componentDidMount(): void {
        this.getAlbumList().then((item) => {
            for (const filename of item) this.setPlayerComp(filename!!);
        });
    }

    private async setPlayerComp(filename: string) {
        const url = await this.props.awsutill.getFileURL(filename);
        const mataData = await this.props.awsutill.getID3Tag(filename);

        const playerElement = (
            <div>
                <h1>{mataData.title}</h1>
                <audio controls>
                    <source src={url}></source>
                </audio>
            </div>
        );

        this.state.playerElement.push(playerElement);
        this.setState({ ...this.state });
    }

    private async getAlbumList() {
        return await this.props.awsutill.getFilelist(this.props.album);
    }

    render(): React.ReactNode {
        return <div>{this.state.playerElement}</div>;
    }
}

export default AlbumView;
