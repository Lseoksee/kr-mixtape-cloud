class BrowserCache {
    /** 캐싱된 사항들을 로컬스토리지에 최종 저장합니다 */
    static applyCache(caches: any[], saveValue: string, loStorage: any[]) {
        const addEelment = caches.filter((item) => item);
        if (addEelment.length) {
            if (loStorage.length) {
                localStorage.setItem(saveValue, JSON.stringify([...loStorage, ...addEelment]));
            } else {
                localStorage.setItem(saveValue, JSON.stringify([...addEelment]));
            }
        } else {
            if (loStorage.length) {
                localStorage.setItem(saveValue, JSON.stringify(loStorage));
            }
        }
    }
}

class SongCache extends BrowserCache {
    private static readonly saveValue = "songs";
    private static loStorage: AlbumCompType.songCache[] | [];

    saveStorage: AlbumCompType.songCache | undefined;
    loadStorageIndex: number = -1;

    constructor() {
        super();
        const storage = localStorage.getItem(SongCache.saveValue);
        if (storage) {
            SongCache.loStorage = JSON.parse(storage) as AlbumCompType.songCache[];
        } else {
            SongCache.loStorage = [];
        }
    }

    /** 해당 곡에 저장된 케시 데이터를 불러옵니다. */
    getSongCache(newFils: AlbumCompType.file[], album: string, artist: string) {
        this.loadStorageIndex = SongCache.loStorage.findIndex(
            (item) => item.albumName === album && item.artist === artist
        );

        if (this.loadStorageIndex === -1 || !newFils) {
            return null;
        }
        const thisAlbum = SongCache.loStorage[this.loadStorageIndex];

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

        SongCache.loStorage[this.loadStorageIndex].album = noMissing;

        if (addEelment.length) {
            return { album: noMissing, addEelment: addEelment };
        }

        return { album: noMissing };
    }

    /** 앨범을 처음로드 시키는경우 캐싱합니다 */
    addSongCache(newValue: AlbumCompType.musicMeta[], album: string, artist: string) {
        newValue.sort((a, b) => {
            if (a.track.no!! > b.track.no!!) return 1;
            return -1;
        });

        (this.saveStorage as AlbumCompType.songCache) = {
            album: newValue,
            albumName: album,
            artist: artist,
        };
    }

    /** 해당 앨범에서 음악이 추가로 발견되는경우 추가합니다. */
    insertSongCache(newValue: AlbumCompType.musicMeta[]) {
        if (this.loadStorageIndex !== -1) {
            newValue.forEach((item) => {
                SongCache.loStorage[this.loadStorageIndex].album.push(item);
            });

            return SongCache.loStorage[this.loadStorageIndex].album.sort((a, b) => {
                if (a.track.no!! > b.track.no!!) return 1;
                return -1;
            });
        }
    }

    static applyCache(songCaches: AlbumCompType.songCache[]): void {
        BrowserCache.applyCache(songCaches, this.saveValue, this.loStorage);
    }
}

class AlbumCache extends BrowserCache {
    private static readonly saveValue = "album";
    private static loStorage: AlbumCompType.album[] | [];

    loadStorageIndex: number = -1;
    saveStorage: AlbumCompType.album | undefined;

    constructor() {
        super();
        const storage = localStorage.getItem(AlbumCache.saveValue);
        if (storage) {
            AlbumCache.loStorage = JSON.parse(storage) as AlbumCompType.album[];
        } else {
            AlbumCache.loStorage = [];
        }
    }

    /* 앨범 정보 캐시를 리턴합니다 */
    getAlbumCache(album: string, artist: string) {
        this.loadStorageIndex = AlbumCache.loStorage.findIndex(
            (item) => item.album === album && item.artist === artist
        );

        if (this.loadStorageIndex === -1) return null;

        return AlbumCache.loStorage[this.loadStorageIndex];
    }

    /** 앨범을 처음로드 시키는경우 캐싱합니다 */
    addAlbumCache(albumInfo: AlbumCompType.album) {
        this.saveStorage = albumInfo;
    }

    static applyCache(albumCaches: AlbumCompType.album[]): void {
        BrowserCache.applyCache(albumCaches, this.saveValue, this.loStorage);
    }
}

export { SongCache, AlbumCache };
