import { fileType, musicMetaType } from "./AWSUtill";

type songCacheType = [
    {
        albumName: string;
        artist: string;
        album: musicMetaType[];
    }
];

class SongCache {
    private loStorage: songCacheType | [];

    constructor() {
        const storage = localStorage.getItem("songs");
        if (storage) {
            this.loStorage = JSON.parse(storage) as songCacheType;
        } else {
            this.loStorage = [];
        }
    }

    getSongCache(newFils: fileType[], album: string, artist: string) {
        const thisAlbumIndex = this.loStorage.findIndex(
            (item) => item.albumName === album && item.artist === artist
        );

        if (thisAlbumIndex === -1 || !newFils) {
            return null;
        }
        const thisAlbum = this.loStorage[thisAlbumIndex];

        const newData = newFils.map((item) => item.ETag);
        const curData = thisAlbum.album.map((item) => item.ETag);

        if (newData.toString() === curData.toString()) {
            console.log("같아서 잘 리턴함");
            return thisAlbum.album;
        }

        //무결성한 파일들만 리턴
        const noMissing = thisAlbum.album.filter((itme) => {
            return newFils.find((it) => it.ETag === itme.ETag);
        });

        //추가된 항목들 리턴
        const addEelment = newFils.filter((item) => {
            return thisAlbum.album.find((it) => it.ETag !== item.ETag);
        });

        this.loStorage[thisAlbumIndex].album = noMissing;

        if (addEelment.length) {
            return noMissing && {addEelment: addEelment};
        }

        return noMissing;
    }

    saveSongCache(newValue: musicMetaType[], album: string, artist: string) {
        const data: songCacheType = [
            {
                albumName: album,
                artist: artist,
                album: newValue,
            },
        ];

        let temp: songCacheType = JSON.parse(localStorage.getItem("songs")!!);
        if (temp.length) {
            localStorage.setItem("songs", JSON.stringify([...temp, ...data]));
        } else {
            localStorage.setItem("songs", JSON.stringify(data));
        }
    }
}

export { SongCache };
