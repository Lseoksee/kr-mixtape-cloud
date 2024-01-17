import React, { useState } from "react";
import albumList from "../albumList.json";
import AWSUtiil from "../Utils/AWSUtill";
import AlbumView from "../Components/AlbumComponet";
import constants from "../constants";
import "./App.css";

function SetMusic(props: any): JSX.Element {
    const aws = new AWSUtiil(constants.ENV_DEVMODE);

    return (
        <div id="albumDiv">
            <AlbumView
                albumSrc="E SENS - New Blood Rapper, Vol.1"
                albumName="New Blood Rapper, Vol.1"
                awsutill={aws}
                artist="E SENS"
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
