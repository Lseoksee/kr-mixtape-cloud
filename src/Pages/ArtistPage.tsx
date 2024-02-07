import React from "react";
import albumList from "../albumList.json";
import AlbumView from "../Components/AlbumComponet";
import "../Style/ArtistPage.css";
import { AlbumCacheManager } from "../GlobalAppData";

const constValue = {
    SetMusicMemo: React.memo(SetMusic),
};

function SetMusic(): JSX.Element {
    const albumCacheManager = new AlbumCacheManager(albumList.length);

    const element = albumList.map((item, index) => {
        const album = item.albums[0];
        const art = item.artist;
        return (
            <div className="albumItem" key={index}>
                <AlbumView
                    albumSrc={album.dirname}
                    albumName={album.album}
                    artist={art}
                    albumCacheManager={albumCacheManager}
                ></AlbumView>
            </div>
        );
    });

    return <div id="albumDiv">{element}</div>;
}

function ArtistPage(): JSX.Element {
    return (
        <div className="aritstInfo">
            <constValue.SetMusicMemo></constValue.SetMusicMemo>
        </div>
    );
}

export default ArtistPage;
