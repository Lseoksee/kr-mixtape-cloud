import React, { useEffect, useState } from "react";
import albumList from "../albumList.json";
import AWSUtiil from "../Utils/AWSUtill";
import AlbumView from "../Components/AlbumComponet";
import constants from "../constants";
import "./App.css";
import { SongCache } from "../Utils/BrowserCache";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { FunctionRedux } from "../Utils/ConfingRedux";

const constValue = {
    SetMusicMemo: React.memo(SetMusic),
};

function SetMusic(): JSX.Element {
    const [state, setState] = useState<{
        element: JSX.Element[];
        loadAlbum: AlbumCompType.songCache[];
    }>({ element: [], loadAlbum: [] });

    const dispatch  = useDispatch<Dispatch<ReduxType.action>>();

    const readyEvent = (albumData: AlbumCompType.songCache) => {
        state.loadAlbum.push(albumData);
        setState((ref) => ({ ...ref }));
    };
    
    useEffect(() => { 
        if (state.element.length === state.loadAlbum.length) {
            SongCache.applySongCache(state.loadAlbum);
        }
    }, [state.element.length, state.loadAlbum, state.loadAlbum.length]);

    if (!state.element.length) {
        const aws = new AWSUtiil(constants.ENV_DEVMODE);

        state.element = albumList.map((item, index) => {
            const album = item.albums[0];
            const art = item.artist;
            return (
                <AlbumView
                    key={index}
                    albumSrc={album.dirname}
                    albumName={album.album}
                    artist={art}
                    readyEvent={readyEvent}
                    awsutill={aws}
                ></AlbumView>
            );
        });

        dispatch(FunctionRedux.setAlbumCache(state.element.length));
    }
    return <div id="albumDiv">{state.element}</div>;
}

function App(): JSX.Element {
    return (
        <div id="albumDiv">
            <constValue.SetMusicMemo></constValue.SetMusicMemo>
        </div>
    );
}

export default App;
