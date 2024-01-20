/// <reference types="react-scripts" />

/* env 파일 타입 지정 */
declare namespace NodeJS {
    interface ProcessEnv {
        readonly REACT_APP_AWS_S3_REGION: string;
        readonly REACT_APP_AWS_S3_BUCKET: string;
        readonly REACT_APP_AWS_IDENTITYPOOLLD: string;
    }
}

/* AlbumComponet 타입 지정  */
declare namespace AlbumCompType {
    /** 앨범 로컬스토리지 저장 타입 */
    type album = {
        album?: string;
        albumartist?: string;
        year?: number;
        count: number;
        albumart?: Buffer;
    };

    /** 파일 타입 */
    type file = {
        ETag: string;
        fileName: string;
    };

    /** 음악 메타데이터 타입 */
    type musicMeta =
        import("music-metadata-browser").IAudioMetadata["common"] & {
            ETag: string;
        };

    /** 음악 로컬스토리지 저장 타입 */
    type songCache = {
        albumName: string;
        artist: string;
        album: musicMeta[];
    };
}
