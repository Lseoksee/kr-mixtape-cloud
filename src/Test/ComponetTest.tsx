import {
    ListObjectsV2Command,
    S3Client,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
// aws-sdk 라이브러리

import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
// aws 자격증명 라이브러리

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// aws 요청을 url로 파싱해주는 라이브러리

async function task() {
    // Amazon Cognito 자격증명 받기
    const client = new S3Client({
        region: process.env.REACT_APP_AWS_S3_REGION,
        credentials: fromCognitoIdentityPool({
            clientConfig: { region: process.env.REACT_APP_AWS_S3_REGION},
            identityPoolId:
                process.env.REACT_APP_AWS_IDENTITYPOOLLD!!,
        }),
    });

    // 파일 목록 얻기
    const getlist = new ListObjectsV2Command({
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        Prefix: "E SENS - New Blood Rapper, Vol.1/",
    });

    //파일 얻기
    const getfile = new GetObjectCommand({
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        Key: "E SENS - New Blood Rapper, Vol.1/01. Still Rappin'.mp3",
    });

    // 스트리밍 가능한 서명된 url 리턴
    const url = await getSignedUrl(client, getfile, {
        expiresIn: 3600,
    });

    console.log(url);
    
    try {
        const res = await client.send(getlist);
        console.log(res);
    } catch (e) {
        console.log(e);
    }
}

export function Test(): JSX.Element {
    task();

    return <></>;
}
