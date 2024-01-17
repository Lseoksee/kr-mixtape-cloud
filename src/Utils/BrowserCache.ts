import { fileType, musicMetaType } from "./AWSUtill";

type songCacheType = [
    {
        albumName: string;
        artist: string;
        album: musicMetaType[];
    }
];

class BrowserCache {
    static getSongCache(newValue: fileType[], album: string, artist: string) {
        //TODO: 이거 다른앨범 값 처리 해야함
        const saved = localStorage.getItem("songs");
        if (!saved) {
            return null;
        }

        const storage = JSON.parse(saved) as songCacheType;
        return storage.find(
            (item) => item.albumName === album && item.artist === artist
        )?.album!!;
    }

    static saveSongCache( newValue: musicMetaType[], album: string, artist: string) {
        const data: songCacheType = [
            {
                albumName: album,
                artist: artist,
                album: newValue,
            },
        ];

        let temp = localStorage.getItem("songs");
        if (temp) {
            localStorage.setItem("songs",  JSON.stringify([temp ,...data]));
        } else {
            localStorage.setItem("songs",  JSON.stringify(data));
        }       
    }
}

export default BrowserCache;
