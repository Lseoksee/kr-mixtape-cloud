import albumList from "../albumList.json";
import AlbumView, { AlbumViewState } from "../Components/AlbumComponet";
import "../Style/ArtistPage.css";
import { AlbumCacheManager } from "../Utils/GlobalAppData";
import { useLoaderData, useParams } from "react-router-dom";
import React, { useState } from "react";
import Utils from "../Utils/Utils";
import tempArtist from "../Assets/tempArtist.svg";
import { MUIComponet } from "../Style/StyleComponents/MUICustum";
import { useDispatch } from "react-redux";
import { ReduxActions } from "../Store/ConfingRedux";
import AWSUtiil from "../Utils/AWSUtill";

const ConstUtills = {
    SetMusicMemo: React.memo(SetMusic),

    /* 전체 재생 하는거 loadMusicInfo 얻어오는 함수  */
    async playAllalbumArr(loadAlbums: AlbumViewState[]) {
        return await Promise.all(
            loadAlbums
                .map((album) =>
                    album.playerElement.map(async (music) => {
                        return {
                            albumName: album.albumInfo.album,
                            musicMeta: music,
                            albumArtUrl: Utils.byteStringToBlob(album.albumInfo.art),
                            url: await AWSUtiil.getAWSUtiil().getFileURL(music.file),
                        } as AlbumCompType.loadMusicInfo;
                    })
                )
                .reduce((a, b) => [...a, ...b])
        );
    },
};

function SetMusic(props: {
    aritst: (typeof albumList)[0];
    albums: AlbumCompType.file[];
    pageState: React.Dispatch<
        React.SetStateAction<{
            loadAlbums: AlbumViewState[];
        }>
    >;
}): JSX.Element {
    const albumCacheManager = new AlbumCacheManager(props.aritst.albums.length, (stateData) => {
        /* 아티스트 페이지 전체 로드 시 건네는 이벤트 */
        console.log("모든 앨범로드");
        props.pageState((prev) => {
            if (prev.loadAlbums !== stateData) {
                return { loadAlbums: stateData };
            }
            return prev;
        });
    });

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
    const [state, setState] = useState<{
        loadAlbums: AlbumViewState[];
    }>({ loadAlbums: [] });
    //loader로 받은거 얻기
    const albums = useLoaderData() as AlbumCompType.file[];
    const dispatch = useDispatch();

    const dispatchMusic = (actions: any) => {
        dispatch(actions);
    };

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
                                sx={{ width: "2rem", height: "2rem" }}
                                onClick={async () => {
                                    const dispatch = ReduxActions.setStartMusic({
                                        loadMusicInfo: await ConstUtills.playAllalbumArr(state.loadAlbums),
                                        startIndex: 0,
                                    });
                                    dispatchMusic(dispatch);
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.padding = "5px";
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.padding = "inherit";
                                }}
                            ></MUIComponet.PlayIconFill>
                            <p className="playText">재생하기</p>
                        </div>
                    </div>
                </div>
                <div className="artistAlbumlist">
                    {state.loadAlbums.map((item, index) => (
                        <div key={index} className="artistAlbumItem">
                            <img
                                src={Utils.byteStringToBlob(item.albumInfo.art)}
                                className="artistAlbumImg"
                                alt={item.albumInfo.album}
                                width={"36px"}
                            />
                            <p>{item.albumInfo.album}</p>
                        </div>
                    ))}
                </div>
            </div>
            <ConstUtills.SetMusicMemo
                aritst={artist}
                key={artist.artist}
                albums={albums}
                pageState={setState}
            ></ConstUtills.SetMusicMemo>
        </div>
    );
}

export default ArtistPage;
