/* aws 관련 유틸 */
import {
    ListObjectsV2Command,
    S3Client,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import * as musicMetadata from "music-metadata-browser";

class AWSUtiil {
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
                "E SENS - New Blood Rapper, Vol.1/01. Still Rappin'.mp3",
                "E SENS - New Blood Rapper, Vol.1/02. M.C. (Feat. 개코 of Dynamic Duo).mp3",
                "E SENS - New Blood Rapper, Vol.1/03. 피똥 (Feat. Simon Dominic).mp3",
                "E SENS - New Blood Rapper, Vol.1/04. 꽐라 (Remix) (Feat. Swings & Verbal Jint).mp3",
                "E SENS - New Blood Rapper, Vol.1/05. Make Music (Feat. Absotyle).mp3",
                "E SENS - New Blood Rapper, Vol.1/06. Rhyme King (Feat. Dok2).mp3",
            ];
        }

        // 파일 목록 얻기
        const getlist = new ListObjectsV2Command({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
            Prefix: loc,
        });

        const res = await this.clinet.send(getlist);
        console.log(res);

        const result = res.Contents?.map((item) => {
            return item.Key;
        });

        console.log(result);

        return result!!;
    }

    /** 다운로드와 스트리밍이 가능한 url 주소를 리턴합니다. */
    public async getFileURL(filename: string) {
        // 개발 모드 활성화 시
        if (this.devMode) {
            return "";
        }

        const getfile = new GetObjectCommand({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
            Key: filename,
        });

        return await getSignedUrl(this.clinet, getfile, {
            expiresIn: 3600,
        });
    }


    /** 해당 파일에 mp3ID3 태그를 파싱 합니다
     * 참고 @link https://github.com/Borewit/music-metadata-browser
     */
    public async getID3Tag(filename: string) {
        // 개발 모드 활성화 시
        if (this.devMode) {
            // 개발용 임시 타이틀 (캐쉬 구현하면 제거)
            return {
                title: "곡 제목"
            }
        }

        const bytes = 1000 * 500; //가져올 파일 바이트 수 (500kb)

        const getfile = new GetObjectCommand({
            Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
            Key: filename,
            Range: `bytes=0-${bytes}`,
        });

        const results = await this.clinet.send(getfile);
        const metadata = await musicMetadata.parseReadableStream(
            results.Body?.transformToWebStream()!!,
            {},
            {
                skipCovers: true,
            }
        );

        return metadata.common;
    }
}

export default AWSUtiil;
