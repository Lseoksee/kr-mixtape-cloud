/// <reference types="vite/client" />

/* env 파일 타입 지정 */
interface ImportMetaEnv {
	readonly VITE_AWS_IDENTITY_URL: string;
	readonly VITE_AWS_S3_BUCKET: string;
	readonly VITE_AWS_S3_REGION: string;
	readonly VITE_LOCAL_PUBLIC_URL: string;
	readonly VITE_DEPLOY_PUBLIC_URL: string;
}
