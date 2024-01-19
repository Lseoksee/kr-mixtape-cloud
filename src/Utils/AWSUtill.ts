/* aws 관련 유틸 */
import {
    ListObjectsV2Command,
    S3Client,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import * as musicMetadata from "music-metadata-browser";

/* 앨범 타입 */
export type albumType = {
    album?: string;
    albumartist?: string;
    year?: number;
    count: number;
    albumart?: Blob;
};

//파일 타입
export type fileType = {
    ETag: string;
    fileName: string;
};

export type musicMetaType = musicMetadata.IAudioMetadata["common"] & { ETag: string };

class AWSUtiil {
    static Bytes = 500 * 1000;
    private clinet: S3Client;
    private devMode: boolean;

    /** @param devMode 임시 데이터 값을 사용해 디버깅시 불필요한 api요청 줄이기 */
    constructor(devMode = false) {
        this.devMode = devMode;

        this.clinet = new S3Client({
            region: process.env.REACT_APP_AWS_S3_REGION,
            credentials: fromCognitoIdentityPool({
                clientConfig: {
                    region: process.env.REACT_APP_AWS_S3_REGION,
                },
                identityPoolId: process.env.REACT_APP_AWS_IDENTITYPOOLLD!!,
            }),
        });
    }

    /** S3 에서 해당 폴더에 파일목록을 리턴합니다. */
    public async getFilelist(loc: string) {
        // 개발 모드 활성화 시
        if (this.devMode) {
            return [
                {
                    ETag: "1",
                    fileName:
                        "E SENS - New Blood Rapper, Vol.1/01. Still Rappin'.mp3",
                },
                {
                    ETag: "2",
                    fileName:
                        "E SENS - New Blood Rapper, Vol.1/02. M.C. (Feat. 개코 of Dynamic Duo).mp3",
                },
                {
                    ETag: "3",
                    fileName:
                        "E SENS - New Blood Rapper, Vol.1/03. 피똥 (Feat. Simon Dominic).mp3",
                },
                {
                    ETag: "4",
                    fileName:
                        "E SENS - New Blood Rapper, Vol.1/04. 꽐라 (Remix) (Feat. Swings & Verbal Jint).mp3",
                },
                {
                    ETag: "5",
                    fileName:
                        "E SENS - New Blood Rapper, Vol.1/05. Make Music (Feat. Absotyle).mp3",
                },
                {
                    ETag: "6",
                    fileName:
                        "E SENS - New Blood Rapper, Vol.1/06. Rhyme King (Feat. Dok2).mp3",
                },
            ];
        }

        // 파일 목록 얻기
        const getlist = new ListObjectsV2Command({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
            Prefix: loc,
        });

        const res = await this.clinet.send(getlist);
        const result = res.Contents?.map((item) => {
            return {
                ETag: item.ETag!!, //파일 무결성 식별용
                fileName: item.Key!!,
            };
        });

        return result!!;
    }

    /** 다운로드와 스트리밍이 가능한 url 주소를 리턴합니다. */
    public async getFileURL(file: fileType) {
        // 개발 모드 활성화 시
        if (this.devMode) {
            return "";
        }

        const getfile = new GetObjectCommand({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
            Key: file.fileName,
        });

        return await getSignedUrl(this.clinet, getfile, {
            expiresIn: 3600,
        });
    }

    /** 해당 파일들의 mp3ID3 태그를 파싱 합니다
     * 참고 @link https://github.com/Borewit/music-metadata-browser
     */
    public async getMusicID3Tag(files: fileType[]): Promise<musicMetaType[]> {
        const data = await Promise.all(
            files.map(async (file) => {
                const getfile = new GetObjectCommand({
                    Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
                    Key: file.fileName,
                    Range: `bytes=0-${AWSUtiil.Bytes}`,
                });

                const results = await this.clinet.send(getfile);
                const metadata = await musicMetadata.parseReadableStream(
                    results.Body?.transformToWebStream()!!,
                    {},
                    {
                        skipCovers: true,
                    }
                );

                return { ...metadata.common, ETag: file.ETag };
            })
        );
        return data;
    }

    /** 해당 앨범리스트에서 앨범 태그를 리턴합니다.
     * 참고 @link https://github.com/Borewit/music-metadata-browser
     */
    public async getAlbumTag(albumList: fileType[]) {
        const getfile = new GetObjectCommand({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
            Key: albumList[0].fileName,
            Range: `bytes=0-${AWSUtiil.Bytes}`,
        });

        const results = await this.clinet.send(getfile);
        const metadata = await musicMetadata.parseReadableStream(
            results.Body?.transformToWebStream()!!,
            {},
            {
                skipCovers: false,
            }
        );

        let albumart;
        if (metadata.common.picture) {
            albumart = new Blob([metadata.common.picture[0].data]);
        }

        return {
            album: metadata.common.album,
            albumartist: metadata.common.albumartist,
            year: metadata.common.year,
            count: albumList.length,
            albumart: albumart,
        } as albumType;
    }
}

export default AWSUtiil;
