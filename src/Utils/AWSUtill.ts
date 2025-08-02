/* aws 관련 유틸 */
import { ListObjectsV2Command, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { parseReadableStream } from "music-metadata-browser";
import { BrowserCache } from "./BrowserCache";
import Utils from "./Utils";

class AWSUtiil {
	private static Bytes = 500 * 1000;
	private static clinet: S3Client;
	private static isListner = false; //자동 갱신 등록되었느냐
	private static listAlbum: Array<{
		artist: string;
		albums: AlbumCompType.file[];
	}> = [];

	/** AWS S3 객체의 접근 토큰을 발급합니다. */
	public static async getCredentials() {
		const getIdentity = await fetch(import.meta.env.VITE_AWS_IDENTITY_URL);
		const res = await getIdentity.json();

		// 토큰 만료 기간 설정 (1시간인데 오차 생각해서 59분으로)
		const expDate = new Date();
		expDate.setSeconds(expDate.getSeconds() + 3540);
		const exp = expDate.getTime();

		const credentials = {
			...res,
			exp: exp,
		} as ConstValType.credentials;

		BrowserCache.saveCredentials(credentials);
		return credentials;
	}

	/** AWSUtiil 객체를 생성할 수 있게 S3Client 객체를 초기화 합니다.
	 * @param credentials getCredentials() 정적 메소드에서 발급받은 토큰
	 */
	public static async setS3Client(credentials: ConstValType.credentials) {
		this.clinet = new S3Client({
			region: import.meta.env.VITE_AWS_S3_REGION,
			credentials: {
				accessKeyId: credentials.AccessKeyId,
				secretAccessKey: credentials.SecretKey,
				sessionToken: credentials.SessionToken,
			},
		});
	}

	/** 토큰 만료 1분전에 자동으로 S3객체를 초기화 해줍니다.
	 * @param credentials getCredentials() 정적 메소드에서 발급받은 토큰
	 */
	public static async autoRefreshS3(credentials: ConstValType.credentials) {
		if (!this.isListner) {
			this.isListner = true;
			const now = new Date();

			let outTime = credentials.exp - now.getTime();

			while (true) {
				await Utils.sleep(outTime);
				const reCredentials = await this.getCredentials();

				this.clinet = new S3Client({
					region: import.meta.env.VITE_AWS_S3_REGION,
					credentials: {
						accessKeyId: reCredentials.AccessKeyId,
						secretAccessKey: reCredentials.SecretKey,
						sessionToken: reCredentials.SessionToken,
					},
				});

				outTime = reCredentials.exp - now.getTime();
			}
		}
	}

	/** AWSUtiil 객체를 생성합니다.
	 * @throws AWSUtiil.clinet 객체가 초기화 되어 있지 않음
	 */
	public constructor() {
		if (!AWSUtiil.clinet) {
			console.log("AWSUtiil.clinet가 초기화 되어있지 않습니다 setS3Client를 통해 초기화 되어있는지 확인하시오");
			throw new Error("undefined_AWSUtiil.clinet");
		}
	}

	/** S3 에서 해당 아티스트와 앨범에대한 파일들을 리턴합니다. */
	public async getFilelist(artist: string): Promise<AlbumCompType.file[]> {
		const memoryLoad = AWSUtiil.listAlbum.find((itme) => itme.artist === artist);
		if (memoryLoad) {
			return memoryLoad.albums;
		}

		// 파일 목록 얻기 (S3에 앨범을 저장할때 [아티스트명] - [앨범명] 이렇게 저장되야함)
		const getlist = new ListObjectsV2Command({
			Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
			Prefix: artist,
		});

		const res = await AWSUtiil.clinet.send(getlist);

		const results = res.Contents?.filter((item) => item.Key?.split("/").slice(-1)[0]).map((item) => {
			return {
				ETag: item.ETag!!, //파일 무결성 식별용
				fileName: item.Key!!,
			};
		})!!;

		AWSUtiil.listAlbum.push({ artist: artist, albums: results });
		return results;
	}

	/** 다운로드와 스트리밍이 가능한 url 주소를 리턴합니다. */
	public async getFileURL(file: AlbumCompType.file) {
		const getfile = new GetObjectCommand({
			Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
			Key: file.fileName,
			ResponseContentDisposition: "attachment", // 다운로드 모드로 로드시키기
		});

		return await getSignedUrl(AWSUtiil.clinet, getfile, {
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
					Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
					Key: file.fileName,
					Range: `bytes=0-${AWSUtiil.Bytes}`,
				});

				const results = await AWSUtiil.clinet.send(getfile);

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
	public async getAlbumTag(albumList: AlbumCompType.file[], album: string, artist: string): Promise<AlbumCompType.album> {
		const getfile = new GetObjectCommand({
			Bucket: import.meta.env.VITE_AWS_S3_BUCKET,
			Key: albumList[0].fileName,
			Range: `bytes=0-${AWSUtiil.Bytes}`,
		});

		const results = await AWSUtiil.clinet.send(getfile);

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
