import { AlbumCache, SongCache } from "./Utils/BrowserCache";

/* 전역으로 관리되는 데이터들 */
export class AlbumCacheManager{
    private albumConunt: number;
    private loadAlbum: AlbumCompType.album[];
    private LoadSong: AlbumCompType.songCache[];

    /** @param albumConunt 로드되야하는 앨범 개수를 알립니다. */
    constructor(albumConunt: number) {
        this.albumConunt = albumConunt;
        this.loadAlbum = [];
        this.LoadSong = [];
    }

    /** 앨범 로드를 알립니다 만약 albumConunt 값과 같다면 앨범정보를 캐싱합니다.   */
    albumLoadEvent(album: AlbumCompType.album) {
        this.loadAlbum.push(album);

        if (this.albumConunt === this.loadAlbum.length) {
            AlbumCache.applyCache(this.loadAlbum);
        }
    }

    /** 곡 로드를 알립니다 만약 albumConunt 값과 같다면 곡 정보를 캐싱합니다.    */
    songLoadEvent(song: AlbumCompType.songCache) {
        this.LoadSong.push(song);

        if (this.albumConunt === this.LoadSong.length) {
            SongCache.applyCache(this.LoadSong);
        }
    }
}
