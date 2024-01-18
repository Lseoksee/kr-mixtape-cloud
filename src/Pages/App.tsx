import React, { useState } from "react";
import albumList from "../albumList.json";
import AWSUtiil from "../Utils/AWSUtill";
import AlbumView from "../Components/AlbumComponet";
import constants from "../constants";
import "./App.css";
import { SongCache } from "../Utils/BrowserCache";

function SetMusic(props: any): JSX.Element {
    const aws = new AWSUtiil(constants.ENV_DEVMODE);
    const songCache = new SongCache();

    const album = (
        <AlbumView
            albumSrc="E SENS - New Blood Rapper, Vol.1"
            albumName="New Blood Rapper, Vol.1"
            artist="E SENS"
            awsutill={aws}
            songCache={songCache}
        ></AlbumView>
    );

    return <div id="albumDiv">{album}</div>;
}

function App(): JSX.Element {
    return (
        <div>
            <SetMusic />
        </div>
    );
}

export default App;
