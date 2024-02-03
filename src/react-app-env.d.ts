/// <reference types="react-scripts" />

/* env 파일 타입 지정 */
declare namespace NodeJS {
    interface ProcessEnv {
        readonly REACT_APP_AWS_S3_REGION: string;
        readonly REACT_APP_AWS_S3_BUCKET: string;
        readonly REACT_APP_AWS_IDENTITYPOOLLD: string;
    }
}

// AlbumComponet 타입 지정
declare namespace AlbumCompType {
    /** 앨범 로컬스토리지 저장 타입 */
    type album = {
        album?: string;
        artist?: string;
        year?: number;
        count: number;
        art?: string;
    };

    /** 파일 타입 */
    type file = {
        ETag: string;
        fileName: string;
    };

    /** 음악 메타데이터 타입 */
    type musicMeta = import("music-metadata-browser").IAudioMetadata["common"] & {
        file: file;
        duration: number;
    };

    /** 음악 로컬스토리지 저장 타입 */
    type songCache = {
        albumName: string;
        artist: string;
        album: musicMeta[];
    };

    /** 음악 재생 타입 */
    type loadMusicInfo = {
        musicMeta: AlbumCompType.musicMeta;
        albumArtist: string;
        albumName: string;
        url: string;
    };
}

// Redux 관리용 타입
declare namespace ReduxType {
    /** Redux 결과값 타입 */
    type state = {
        /** 로드해야 하는 앨범 개수 */
        AlbumConunt?: number;
    };

    /** Redux 요청 데이터들 */
    type action = {
        AlbumConunt?: any;
        LoadAlbum?: AlbumCompType.album;
        LoadSong?: AlbumCompType.songCache;
    };
}
