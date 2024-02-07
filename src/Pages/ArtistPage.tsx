import albumList from "../albumList.json";
import AlbumView from "../Components/AlbumComponet";
import "../Style/ArtistPage.css";
import { AlbumCacheManager } from "../GlobalAppData";
import { useParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";


function SetMusic(props: { aritst: typeof albumList[0] }): JSX.Element {
    const albumCacheManager = new AlbumCacheManager(props.aritst.albums.length);
    const element = props.aritst.albums.map((item, index) => {
        return (
            <div className="albumItem" key={index}>
                <AlbumView
                    albumSrc={item.dirname}
                    albumName={item.album}
                    artist={props.aritst.artist}
                    albumCacheManager={albumCacheManager}
                ></AlbumView>
            </div>
        );
    });

    return <div id="albumDiv">{element}</div>;
}

function ArtistPage(): JSX.Element {
    const { artistName } = useParams<RouterType.RouterParams>();
    const artist = albumList.find((itme) => itme.artist === artistName);

    if (!artist) {
        return <ErrorPage />
    }

    return (
        <div className="aritstInfo">
            <SetMusic aritst={artist} key={artist.artist}></SetMusic>
        </div>
    );
}

export default ArtistPage;
