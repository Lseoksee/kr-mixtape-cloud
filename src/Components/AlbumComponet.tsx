import React, { Component } from "react";
import AWSUtiil from "../Utils/AWSUtill";

class AlbumView extends Component {
    state: Readonly<{
        song: JSX.Element[];
    }> = {
        song: [],
    };
    props: Readonly<{
        awsutill: AWSUtiil;
        album: string;
    }> = this.props;

    componentDidMount(): void {
        this.setAlbumList();
    }

    private async setAlbumList() {
        const list = await this.props.awsutill.getFilelist(this.props.album);
        const urls: string[] = [];

        for (const filename of list) {
            const url = await this.props.awsutill.getFileURL(filename!!);
            urls.push(url);
        }
        
        const results = urls.map((item) => {
            return (
                <audio controls>
                    <source src={item}></source>
                </audio>
            );
        });

        this.setState({ song: results });
    }

    render(): React.ReactNode {
        return <div>{this.state.song}</div>;
    }
}

export default AlbumView;
