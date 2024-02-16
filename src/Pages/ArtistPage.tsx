import albumList from "../albumList.json";
import AlbumView, { AlbumViewState } from "../Components/AlbumComponet";
import "../Style/ArtistPage.css";
import { AlbumCacheManager } from "../Utils/GlobalAppData";
import { useLoaderData, useParams } from "react-router-dom";
import React from "react";
import Utils from "../Utils/Utils";
import tempArtist from "../Assets/tempArtist.svg";
import { MUIComponet } from "../Style/StyleComponents/MUICustum";
import { useDispatch } from "react-redux";

const ConstUtills = {
    SetMusicMemo: React.memo(SetMusic),
    /* 아티스트 페이지 전체 로드 시 건네는 이벤트 */
    albumComplete(stateData: AlbumViewState[]) {
        console.log("모든앨범 로드완료");
        console.log(stateData);        
    },
};

function SetMusic(props: { aritst: (typeof albumList)[0]; albums: AlbumCompType.file[] }): JSX.Element {
    const albumCacheManager = new AlbumCacheManager(props.aritst.albums.length, ConstUtills.albumComplete);

    const element = props.aritst.albums.map((item, index) => {
        // 해당 아티스트에 전체앨범 곡중 현재 로드중인 앨법에 곡만
        const songList = props.albums.filter((list) => list.fileName.includes(item.album));

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
    //loader로 받은거 얻기
    const albums = useLoaderData() as AlbumCompType.file[];
    const dispatch = useDispatch();

    const artist = albumList.find((itme) => itme.artist === artistName)!!;

    return (
        <div className="aritstInfo" ref={(ref) => ref?.scrollTo(0, 0)}>
            <div className="aritstFirst">
                <div className="aritstPlay">
                    <img
                        src={Utils.getArtistImg(artist.artist)}
                        alt={artist.artist}
                        width={"180px"}
                        height={"180px"}
                        className="infoArtistImg"
                        onError={(e) => (e.currentTarget.src = `${tempArtist}`)}
                    />
                    <div>
                        <p className="artistName">{artist.artist}</p>
                        <div className="playDiv">
                            <MUIComponet.PlayIconFill
                                sx={{ width: "initial", height: "2rem" }}
                            ></MUIComponet.PlayIconFill>
                            <p> 재생하기</p>
                        </div>
                    </div>
                </div>
                <div className="artistAlbumlist"></div>
            </div>
            <ConstUtills.SetMusicMemo aritst={artist} key={artist.artist} albums={albums}></ConstUtills.SetMusicMemo>
        </div>
    );
}

export default ArtistPage;
