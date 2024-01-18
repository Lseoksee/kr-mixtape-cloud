import { fileType, musicMetaType } from "./AWSUtill";

type songCacheType = [
    {
        albumName: string;
        artist: string;
        album: musicMetaType[];
    }
];

class SongCache {
    constructor() {
        if (!localStorage.getItem("songs")) {
            localStorage.setItem("songs", JSON.stringify([]));
        }
    }

    getSongCache(newFils: fileType[], album: string, artist: string) {
        const saved: songCacheType = JSON.parse(
            localStorage.getItem("songs")!!
        );
        const thisAlbumIndex = saved.findIndex(
            (item) => item.albumName === album && item.artist === artist
        );

        if (thisAlbumIndex === -1) {
            return null;
        }

        // 앨범 폴더가 완전히 삭제된 경우
        if (!newFils) {
            const reSave = saved.filter((item, index) => {
                if (thisAlbumIndex === index) {
                    return false;
                }
                return true;
            }) as songCacheType;

            localStorage.setItem("songs", JSON.stringify(reSave));

            return null;
        }

        const thisAlbum = saved[thisAlbumIndex];

        const newData = newFils.map((item) => item.ETag);
        const curData = thisAlbum.album.map((item) => item.ETag);

        if (newData.toString() === curData.toString()) {
            console.log("같아서 잘 리턴함");
            return thisAlbum.album;
        }

        const missing = thisAlbum.album.filter((itme) => {
            return newData.find((it) => it === itme.ETag);
        });

        const reSave = saved.map((item, index) => {
            if (thisAlbumIndex === index) {
                item.album = missing;
            }

            return item;
        }) as songCacheType;

        localStorage.setItem("songs", JSON.stringify(reSave));
        return thisAlbum.album;
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
