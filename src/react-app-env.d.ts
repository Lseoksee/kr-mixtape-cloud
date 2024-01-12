/// <reference types="react-scripts" />

/* env 파일 타입 지정 */
declare namespace NodeJS {
    interface ProcessEnv {
        readonly REACT_APP_AWS_S3_REGION: string;
        readonly REACT_APP_AWS_S3_BUCKET: string;
        readonly REACT_APP_AWS_IDENTITYPOOLLD: string;
    }
}
