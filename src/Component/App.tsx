import React, { useState } from "react";
import * as musicMetadata from "music-metadata-browser";
import { getBlobToSize } from "../Utils/WebApi";
import albumList from "../albumList.json";
import { API_URL } from "../constants";

const GetMetadata = async (url: string,list: JSX.Element[]): Promise<JSX.Element[]> => {
    const blob = await getBlobToSize(url, 512);
    const metadata = await musicMetadata.parseBlob(blob);

    list.push(
        <div>
            <h1>{metadata.common.title}</h1>
            <audio controls>
                <source src={url}></source>
            </audio>
        </div>
    );

    return list;
};

function SetMusic(props: any): JSX.Element {
    const [data, setState] = useState<string | JSX.Element[]>("loading");
    const musicList: JSX.Element[] = [];

    if (data === "loading") {
        albumList[0].track.forEach(item => {
            GetMetadata(`${API_URL}${item}`, musicList).then((data) => {
                setState(data);
            });
        })

        return <></>;
    }

    return <div>{data}</div>;
}

function App(): JSX.Element {
    return (
        <div>
            <SetMusic />
        </div>
    );
}

export default App;
