/// <reference types="react-scripts" />

/* env 파일 타입 지정 */
declare namespace NodeJS {
    interface ProcessEnv {
        readonly REACT_APP_AWS_IDENTITY_URL: string;
        readonly REACT_APP_AWS_S3_BUCKET: string;
        readonly REACT_APP_AWS_S3_REGION: string;
    }
}

declare namespace ConstValType {
    type credentials = {
        AccessKeyId: string,
        SecretKey: string;
        SessionToken: string;
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
        albumArtUrl: string;
        albumName: string;
        url: string;
    };
}

// Redux 관리용 타입
declare namespace ReduxType {
    /** Redux 결과값 타입 */
    type state = {
        musicPlayState: {
            /** 대기열에서 현재 재생중인 곡 인덱스 */
            startIndex: number;
            /** 재생대기열 */
            queue: AlbumCompType.loadMusicInfo[];
            /** 볼륨 값 */
            volume: number;
            /** MusicStateComponet 쪽에서 보내는 데이터 */
            send: {
                /** 재생여부 */
                isPlay: "play" | "pause" | "";
                /** 길이 (초) */
                duration: number;
                /** 현재 재생길이 (초) */
                nowProgress: number;
            };
            /** MusicStateComponet 쪽에서 받는 데이터 */
            recv: {
                /** 재생여부 */
                isPlay: "play" | "pause" | "";
                /** 업데이트 해야하는 재생길이 */
                progress: number;
            };
        };
        forceUpdate: number;
    };

    /** Redux 요청 데이터들 */
    type action = {
        AlbumConunt?: any;
        LoadAlbum?: AlbumCompType.album;
        LoadSong?: AlbumCompType.songCache;
    };
}

// react-router 타입
declare namespace RouterType {
    /** URL 파라미터 */
    type RouterParams = {
        artistName: string;
    };

    /** Class 컴포넌트용 props 타입  */
    type RouterHook = {
        params: Readonly<Params<RouterParams>>;
        navigate: NavigateFunction;
        location: import("react-router-dom").Location;
    };
}
