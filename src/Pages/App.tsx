import React from "react";
import albumList from "../albumList.json";
import AWSUtiil from "../Utils/AWSUtill";
import AlbumView from "../Components/AlbumComponet";
import constants from "../constants";
import "./App.css";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { FunctionRedux } from "../Utils/ConfingRedux";

const constValue = {
    SetMusicMemo: React.memo(SetMusic),
};

function SetMusic(): JSX.Element {
    const dispatch = useDispatch<Dispatch<ReduxType.action>>();
    const aws = new AWSUtiil(constants.ENV_DEVMODE);

    const element = albumList.map((item, index) => {
        const album = item.albums[0];
        const art = item.artist;
        return (
            <AlbumView
                key={index}
                albumSrc={album.dirname}
                albumName={album.album}
                artist={art}
                awsutill={aws}
            ></AlbumView>
        );
    });

    dispatch(FunctionRedux.setAlbumConunt(element.length));

    return <div id="albumDiv">{element}</div>;
}

function App(): JSX.Element {
    return (
        <div id="albumDiv">
            <constValue.SetMusicMemo></constValue.SetMusicMemo>
        </div>
    );
}

export default App;
