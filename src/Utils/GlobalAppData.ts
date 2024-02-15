import { AlbumCache, SongCache } from "./BrowserCache";

/* 전역으로 관리되는 데이터들 */
export class AlbumCacheManager {
    private albumConunt: number;
    private loadAlbum: AlbumCompType.album[];
    private LoadSong: AlbumCompType.songCache[];
    private Complete: boolean[];
    private completeCallback?: () => void;

    /** @param albumConunt 로드되야하는 앨범 개수를 알립니다. */
    constructor(albumConunt: number, completeCallback?: () => void) {
        this.albumConunt = albumConunt;
        this.loadAlbum = [];
        this.LoadSong = [];
        this.Complete = [];
        this.completeCallback = completeCallback;
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

    /** 모든 로드가 완료되었다는 이벤트를 보냅니다.
     * 만일 아티스트 전체의 엘범이 로드되었으면 completeCallback 함수를 실행합니다  */
    completeLoadEvent() {
        this.Complete.push(true);
        if (this.albumConunt === this.Complete.length && this.completeCallback) {
            this.completeCallback();
        }
    }
}
