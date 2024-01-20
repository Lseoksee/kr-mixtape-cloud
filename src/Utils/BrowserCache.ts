class SongCache  {
    private static readonly saveValue = "songs";
    private static loStorage: AlbumCompType.songCache[] | [];

    saveStorage: AlbumCompType.songCache | undefined;
    loadStorageIndex: number = -1;

    constructor() {
        const storage = localStorage.getItem(SongCache.saveValue);
        if (storage) {
            SongCache.loStorage = JSON.parse(
                storage
            ) as AlbumCompType.songCache[];
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

    /** 앨범을 처음로드 시키는경우 케싱합니다, */
    addSongCache(
        newValue: AlbumCompType.musicMeta[],
        album: string,
        artist: string
    ) {
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

            return SongCache.loStorage[this.loadStorageIndex].album.sort(
                (a, b) => {
                    if (a.track.no!! > b.track.no!!) return 1;
                    return -1;
                }
            );
        }
    }

    /** 케싱된 사항들을 로컬스토리지에 최종 저장합니다 */
    static applySongCache(songCaches: AlbumCompType.songCache[]) {
        const addEelment = songCaches.filter((item) => item);
        if (addEelment.length) {
            if (this.loStorage.length) {
                localStorage.setItem(
                    SongCache.saveValue,
                    JSON.stringify([...this.loStorage, ...addEelment])
                );
            } else {
                localStorage.setItem(
                    SongCache.saveValue,
                    JSON.stringify([...addEelment])
                );
            }
        } else {
            if (this.loStorage.length) {
                localStorage.setItem(
                    SongCache.saveValue,
                    JSON.stringify(this.loStorage)
                );
            }
        }
    }
}

class AlbumCache {
    private static readonly saveValue = "album";
    private static loStorage: AlbumCompType.album[] | [];

    loadStorageIndex: number = -1;
    saveStorage: AlbumCompType.album | undefined;

    constructor() {
        const storage = localStorage.getItem(AlbumCache.saveValue);
        if (storage) {
            AlbumCache.loStorage = JSON.parse(storage) as AlbumCompType.album[];
        } else {
            AlbumCache.loStorage = [];
        }
    }

    getAlbumCache(album: string, artist: string) {
        this.loadStorageIndex = AlbumCache.loStorage.findIndex(
            (item) => item.album === album && item.albumartist === artist
        );

        if (this.loadStorageIndex === -1) return null;

        return AlbumCache.loStorage[this.loadStorageIndex];
    }

    addAlbumCache(albumInfo: AlbumCompType.album) {
        this.saveStorage = albumInfo;
    }

    static applySongCache(albumCache: AlbumCompType.album[]) {
        const addEelment = albumCache.filter((item) => item);
        if (addEelment.length) {
            if (this.loStorage.length) {
                localStorage.setItem(
                    AlbumCache.saveValue,
                    JSON.stringify([...this.loStorage, ...addEelment])
                );
            } else {
                localStorage.setItem(
                    AlbumCache.saveValue,
                    JSON.stringify([...addEelment])
                );
            }
        } else {
            if (this.loStorage.length) {
                localStorage.setItem(
                    AlbumCache.saveValue,
                    JSON.stringify(this.loStorage)
                );
            }
        }
    }
}

export { SongCache, AlbumCache };
