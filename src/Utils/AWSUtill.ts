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

    constructor() {
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

        return result!!;
    }

    /** 다운로드와 스트리밍이 가능한 url 주소를 리턴합니다. */
    public async getFileURL(filename: string) {
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
        const bytes = 1000*500; //가져올 파일 바이트 수 (500kb)

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
