import { fileType, musicMetaType } from "./AWSUtill";

export type songCacheType =  {
    albumName: string;
    artist: string;
    album: musicMetaType[];
}

class SongCache {
    static readonly saveValue ="songs"
    static loStorage: songCacheType[] | [];
    saveStorage: songCacheType | undefined

    constructor() {
        const storage = localStorage.getItem(SongCache.saveValue);
        if (storage) {
            SongCache.loStorage = JSON.parse(storage) as songCacheType[];
        } else {
            SongCache.loStorage = [];
        }
    }

    /** 해당 곡에 저장된 케시 데이터를 불러옵니다. */
    static getSongCache(newFils: fileType[], album: string, artist: string) {
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
            return { album: thisAlbum.album };
        }

        //무결성한 파일들만 리턴
        const noMissing = thisAlbum.album.filter((itme) => {
            return newFils.find((it) => it.ETag === itme.ETag);
        });

        //추가된 항목들 리턴
        const addEelment = newFils.filter((item) => {
            return !thisAlbum.album.find((it) => it.ETag === item.ETag);
        });

        this.loStorage[thisAlbumIndex].album = noMissing;

        if (addEelment.length) {
            return { album: noMissing, addEelment: addEelment};
        }

        return { album: noMissing };
    }

    /** 앨범을 처음로드 시키는경우 케싱합니다, */
    addSongCache(newValue: musicMetaType[], album: string, artist: string) {
        (this.saveStorage as songCacheType) = {
            album: newValue,
            albumName: album,
            artist: artist
        }
    }

    /** 해당 앨범에서 음악이 추가로 발견되는경우 추가합니다. */
    insertSongCache(newValue: musicMetaType[]) {
        if (this.saveStorage) {
            newValue.forEach((item) => {
                this.saveStorage!!.album.push(item);
            })
        }
    }

    /** 케싱된 사항들을 로컬스토리지에 최종 저장합니다 */
    static applySongCache(songCaches: songCacheType[]) {
        const addEelment = songCaches.filter((item) => item);
        
        if (addEelment.length) {
            if (this.loStorage.length) {
                localStorage.setItem(SongCache.saveValue, JSON.stringify([...this.loStorage, ...addEelment]));
            } else {
                localStorage.setItem(SongCache.saveValue, JSON.stringify([...addEelment]));
            }
        } else {
            if (this.loStorage.length) {
                localStorage.setItem(SongCache.saveValue, JSON.stringify(this.loStorage));
            }
        }
    }
}

export { SongCache };
