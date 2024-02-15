import albumList from "../albumList.json";
import AlbumView from "../Components/AlbumComponet";
import "../Style/ArtistPage.css";
import { AlbumCacheManager } from "../Utils/GlobalAppData";
import { useLoaderData, useParams } from "react-router-dom";
import React from "react";

const ConstUtills = {
    SetMusicMemo: React.memo(SetMusic),
};

function SetMusic(props: { aritst: (typeof albumList)[0] }): JSX.Element {
    const albumCacheManager = new AlbumCacheManager(props.aritst.albums.length);

    //loader로 받은거 얻기
    const albums = useLoaderData() as AlbumCompType.file[];

    const element = props.aritst.albums.map((item, index) => {
        // 해당 아티스트에 전체앨범 곡중 현재 로드중인 앨법에 곡만
        const songList = albums.filter((list) => list.fileName.includes(item.album));

        return (
            <AlbumView
                key={index}
                albumName={item.album}
                tableSize={"54vh"}
                songList={songList}
                artist={props.aritst.artist}
                albumCacheManager={albumCacheManager}
            ></AlbumView>
        );
    });

    return <div className="albumDiv">{element}</div>;
}

function ArtistPage(): JSX.Element {
    const { artistName } = useParams<RouterType.RouterParams>();
    const artist = albumList.find((itme) => itme.artist === artistName)!!;

    return (
        <div className="aritstInfo" ref={(ref) => (ref?.scrollTo(0, 0))}>
            <div className="aritstFirst">
            </div>
            <ConstUtills.SetMusicMemo aritst={artist} key={artist.artist}></ConstUtills.SetMusicMemo>
        </div>
    );
}

export default ArtistPage;
