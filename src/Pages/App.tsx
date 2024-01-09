import React, { useState } from "react";
import * as musicMetadata from "music-metadata-browser";
import albumList from "../albumList.json";
import AWSUtiil from "../Utils/AWSUtill";
import AlbumView from "../Components/AlbumComponet";

function SetMusic(props: any): JSX.Element {
    const aws = new AWSUtiil();

    return (
        <div>
            <AlbumView
                album="E SENS - New Blood Rapper, Vol.1"
                awsutill={aws}
            ></AlbumView>
        </div>
    );
}

function App(): JSX.Element {
    return (
        <div>
            <SetMusic />
        </div>
    );
}

export default App;
