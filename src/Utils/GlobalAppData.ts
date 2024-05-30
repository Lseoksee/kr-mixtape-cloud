import { S3Client } from "@aws-sdk/client-s3";
import { AlbumViewState } from "../Components/AlbumComponet";
import { AlbumCache, SongCache } from "./BrowserCache";

/* 전역으로 관리되는 데이터들 */
export class AlbumCacheManager {
    private albumConunt: number;
    private complete: Array<{
        song: SongCache;
        album: AlbumCache;
        stateData: AlbumViewState;
    }>;
    private completeCallback?: (stateData: AlbumViewState[]) => void;

    /** @param albumConunt 로드되야하는 앨범 개수를 알립니다. 
     * @param completeCallback saveLoadData 함수를 실행할때 콜백 함수로 받습니다.  */
    constructor(albumConunt: number, completeCallback?: (stateData: AlbumViewState[]) => void) {
        this.albumConunt = albumConunt;
        this.complete = [];
        this.completeCallback = completeCallback;
    }

    /** 모든 로드가 완료되었다는 이벤트를 보냅니다.
     * 만일 아티스트 전체의 엘범이 로드되었으면 completeCallback 함수를 실행합니다  */
    saveLoadData(song: SongCache, album: AlbumCache, stateData: AlbumViewState) {
        this.complete.push({ song: song, album: album, stateData: stateData });
        if (this.albumConunt === this.complete.length) {
            SongCache.applyCache(this.complete.map((itme) => itme.song.saveStorage!!));
            AlbumCache.applyCache(this.complete.map((itme) => itme.album.saveStorage!!));

            if (this.completeCallback) {
                this.completeCallback(this.complete.map((itme) => itme.stateData));
            }
        }
    }
}
