import React, { useEffect, useState } from "react";
import albumList from "../albumList.json";
import AWSUtiil from "../Utils/AWSUtill";
import AlbumView from "../Components/AlbumComponet";
import constants from "../constants";
import "./App.css";
import { SongCache, songCacheType } from "../Utils/BrowserCache";

const constValue = {
    SetMusicMemo: React.memo(SetMusic),
};

function SetMusic(): JSX.Element {
    const [state, setState] = useState<{
        element: JSX.Element[];
        loadAlbum: songCacheType[];
    }>({ element: [], loadAlbum: [] });

    const readyEvent = (albumData: songCacheType) => {
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

        state.element = albumList.map((item) => {
            const album = item.albums[0];
            const art = item.artist;
            return (
                <AlbumView
                    albumSrc={album.dirname}
                    albumName={album.dirname}
                    artist={art}
                    renew={readyEvent}
                    awsutill={aws}
                ></AlbumView>
            );
        });
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
