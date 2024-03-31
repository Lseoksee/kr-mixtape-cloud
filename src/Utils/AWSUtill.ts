/* aws 관련 유틸 */
import { ListObjectsV2Command, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { parseReadableStream } from "music-metadata-browser";
import constants from "../constants";
import { BrowserCache } from "./BrowserCache";

class AWSUtiil {
    private static thisObject?: AWSUtiil;
    private static Bytes = 500 * 1000;

    private clinet: S3Client;
    private devMode: boolean;
    private listAlbum: Array<{
        artist: string;
        albums: AlbumCompType.file[];
    }> = [];

    private async refreshCredentials() {
        const credentials = await AWSUtiil.newCredentials();
        this.clinet = new S3Client({
            region: process.env.REACT_APP_AWS_S3_REGION,
            credentials: {
                accessKeyId: credentials.AccessKeyId,
                secretAccessKey: credentials.SecretKey,
                sessionToken: credentials.SessionToken,
            },
        });
    }

    private static async newCredentials() {
        const getIdentity = await fetch(process.env.REACT_APP_AWS_IDENTITY_URL);
        const credentials = (await getIdentity.json()) as ConstValType.credentials;
        BrowserCache.saveCredentials(credentials);
        return credentials;
    }

    /** AWSUtiil 객체를 획득 합니다. 해당 메소들를 통해 AWSUtiil 객체에 접근하시오.  */
    public static async getAWSUtiil() {
        if (!this.thisObject) {
            let credentials = BrowserCache.getCredentials();
            if (!credentials) {
                credentials = await AWSUtiil.newCredentials();
            }

            this.thisObject = new this(constants.ENV_DEVMODE, credentials);
        }
        return this.thisObject;
    }

    // 생성자는 getAWSUtiil를 통해 접근하도록 제한
    private constructor(devMode: boolean, credentials: ConstValType.credentials) {
        this.devMode = devMode;

        this.clinet = new S3Client({
            region: process.env.REACT_APP_AWS_S3_REGION,
            credentials: {
                accessKeyId: credentials.AccessKeyId,
                secretAccessKey: credentials.SecretKey,
                sessionToken: credentials.SessionToken,
            },
        });
    }

    /** S3 에서 해당 아티스트와 앨범에대한 파일들을 리턴합니다. */
    public async getFilelist(artist: string): Promise<AlbumCompType.file[]> {
        // 개발 모드 활성화 시
        if (this.devMode) {
            return [
                {
                    ETag: "1",
                    fileName: "E SENS - New Blood Rapper, Vol.1/01. Still Rappin'.mp3",
                },
                {
                    ETag: "2",
                    fileName: "E SENS - New Blood Rapper, Vol.1/02. M.C. (Feat. 개코 of Dynamic Duo).mp3",
                },
                {
                    ETag: "3",
                    fileName: "E SENS - New Blood Rapper, Vol.1/03. 피똥 (Feat. Simon Dominic).mp3",
                },
                {
                    ETag: "4",
                    fileName: "E SENS - New Blood Rapper, Vol.1/04. 꽐라 (Remix) (Feat. Swings & Verbal Jint).mp3",
                },
                {
                    ETag: "5",
                    fileName: "E SENS - New Blood Rapper, Vol.1/05. Make Music (Feat. Absotyle).mp3",
                },
                {
                    ETag: "6",
                    fileName: "E SENS - New Blood Rapper, Vol.1/06. Rhyme King (Feat. Dok2).mp3",
                },
            ];
        }

        const memoryLoad = this.listAlbum.find((itme) => itme.artist === artist);
        if (memoryLoad) {
            return memoryLoad.albums;
        }

        // 파일 목록 얻기 (S3에 앨범을 저장할때 [아티스트명] - [앨범명] 이렇게 저장되야함)
        const getlist = new ListObjectsV2Command({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
            Prefix: artist,
        });

        let res;
        try {
            res = await this.clinet.send(getlist);
        } catch (e) {
            console.log(e);
            await this.refreshCredentials();
            res = await this.clinet.send(getlist);
        }

        const results = res.Contents?.filter((item) => item.Key?.split("/").slice(-1)[0]).map((item) => {
            return {
                ETag: item.ETag!!, //파일 무결성 식별용
                fileName: item.Key!!,
            };
        })!!;

        this.listAlbum.push({ artist: artist, albums: results });
        return results;
    }

    /** 다운로드와 스트리밍이 가능한 url 주소를 리턴합니다. */
    public async getFileURL(file: AlbumCompType.file) {
        // 개발 모드 활성화 시
        if (this.devMode) {
            return "";
        }

        const getfile = new GetObjectCommand({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
            Key: file.fileName,
            ResponseContentDisposition: "attachment", // 다운로드 모드로 로드시키기
        });

        return await getSignedUrl(this.clinet, getfile, {
            expiresIn: 3600,
        });
    }

    /** 해당 파일들의 mp3ID3 태그를 파싱 합니다
     * 참고 @link https://github.com/Borewit/music-metadata-browser
     */
    public async getMusicID3Tag(files: AlbumCompType.file[]): Promise<AlbumCompType.musicMeta[]> {
        const data = await Promise.all(
            files.map(async (file) => {
                const getfile = new GetObjectCommand({
                    Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
                    Key: file.fileName,
                    Range: `bytes=0-${AWSUtiil.Bytes}`,
                });

                let results;
                try {
                    results = await this.clinet.send(getfile);
                } catch (e) {
                    console.log(e);
                    await this.refreshCredentials();
                    results = await this.clinet.send(getfile);
                }

                const metadata = await parseReadableStream(
                    results.Body?.transformToWebStream()!!,
                    {
                        mimeType: "audio/mpeg",
                    },
                    {
                        skipCovers: true,
                    }
                );

                return {
                    ...metadata.common,
                    file: file,
                    duration: metadata.format.duration || 0,
                } as AlbumCompType.musicMeta;
            })
        );
        return data;
    }

    /** 해당 앨범리스트에서 앨범 태그를 리턴합니다.
     * 참고 @link https://github.com/Borewit/music-metadata-browser
     */
    public async getAlbumTag(
        albumList: AlbumCompType.file[],
        album: string,
        artist: string
    ): Promise<AlbumCompType.album> {
        const getfile = new GetObjectCommand({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
            Key: albumList[0].fileName,
            Range: `bytes=0-${AWSUtiil.Bytes}`,
        });

        let results;
        try {
            results = await this.clinet.send(getfile);
        } catch (e) {
            console.log(e);
            await this.refreshCredentials();
            results = await this.clinet.send(getfile);
        }

        const metadata = await parseReadableStream(
            results.Body?.transformToWebStream()!!,
            {
                mimeType: "audio/mpeg",
            },
            {
                skipCovers: false,
            }
        );

        let albumart;
        if (metadata.common.picture) {
            albumart = metadata.common.picture[0].data;
        }

        return {
            album: album,
            artist: artist,
            year: metadata.common.year,
            count: albumList.length,
            art: albumart?.toString("binary"),
        };
    }
}

export default AWSUtiil;
