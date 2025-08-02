import albumList from "../albumList.json";
import AlbumView, { type AlbumViewState } from "../Components/AlbumComponet";
import "../Style/ArtistPage.css";
import { AlbumCacheManager } from "../Utils/GlobalAppData";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Utils from "../Utils/Utils";
import tempArtist from "../Assets/tempArtist.svg";
import { useDispatch } from "react-redux";
import { ReduxActions } from "../Store/ConfingRedux";
import AWSUtiil from "../Utils/AWSUtill";
import { PlayIconFill } from "../Components/StyleComponet";

type ArtistPageState = {
	loadAlbums: AlbumViewState[];
	albums: AlbumCompType.file[];
};

const ConstUtills = {
	SetMusicMemo: React.memo(SetMusic),

	/* 전체 재생 하는거 loadMusicInfo 얻어오는 함수  */
	async playAllalbumArr(loadAlbums: AlbumViewState[]) {
		return await Promise.all(
			loadAlbums
				.map((album) =>
					album.playerElement.map(async (music) => {
						return {
							albumName: album.albumInfo.album,
							musicMeta: music,
							albumArtUrl: Utils.base64ToBlob(album.albumInfo.art),
							url: await new AWSUtiil().getFileURL(music.file),
						} as AlbumCompType.loadMusicInfo;
					})
				)
				.reduce((a, b) => [...a, ...b])
		);
	},
};

function SetMusic(props: {
	aritst: (typeof albumList)[0];
	albums: AlbumCompType.file[];
	pageState: React.Dispatch<React.SetStateAction<ArtistPageState>>;
}): React.JSX.Element {
	const albumCacheManager = new AlbumCacheManager(props.aritst.albums.length, (stateData) => {
		/* 아티스트 페이지 전체 로드 시 건네는 이벤트 */
		console.log("모든 앨범로드");
		props.pageState((prev) => {
			if (prev.loadAlbums !== stateData) {
				return { ...prev, loadAlbums: stateData };
			}
			return prev;
		});
	});

	const element = props.aritst.albums.map((item, index) => {
		// 해당 아티스트에 전체앨범 곡중 현재 로드중인 앨법에 곡만
		const songList = props.albums.filter((list) => list.fileName.includes(item.album));

		return (
			<AlbumView
				key={index}
				albumName={item.album}
				tableSize={"54vh"}
				songList={songList}
				artist={props.aritst.artist}
				albumCacheManager={albumCacheManager}
			></AlbumView>
		);
	});

	return <div className="albumDiv">{element}</div>;
}

function ArtistPage(): React.JSX.Element {
	const { artistName } = useParams<RouterType.RouterParams>();
	const [state, setState] = useState<ArtistPageState>({ loadAlbums: [], albums: [] });
	//loader로 받은거 얻기
	const dispatch = useDispatch();
	const aritstInfoRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setState({ albums: [], loadAlbums: [] });
		// 파일 리스트 구하기
		new AWSUtiil().getFilelist(artistName!!).then((item) => {
			setState((prev) => ({ ...prev, albums: item }));
		});

		aritstInfoRef.current?.scrollTo(0, 0);
	}, [artistName]);

	const dispatchMusic = (actions: any) => {
		dispatch(actions);
	};

	const artist = albumList.find((itme) => itme.artist === artistName)!!;
	return (
		<div className="aritstInfo" ref={aritstInfoRef}>
			<div className="aritstLayout">
				<div className="aritstFirst">
					<div className="aritstPlay">
						<img
							src={Utils.getArtistImg(artist.artist)}
							alt={artist.artist}
							width={"180px"}
							height={"180px"}
							className="infoArtistImg"
							onError={(e) => (e.currentTarget.src = `${tempArtist}`)}
						/>
						<div>
							<p className="artistName">{artist.artist}</p>
							<div className="playDiv">
								<PlayIconFill
									className="playIcon"
									sx={{ width: "2.1rem", height: "2.1rem" }}
									onClick={async () => {
										const dispatch = ReduxActions.setStartMusic({
											loadMusicInfo: await ConstUtills.playAllalbumArr(state.loadAlbums),
											startIndex: 0,
										});
										dispatchMusic(dispatch);
									}}
								></PlayIconFill>
								<p className="playText">재생하기</p>
							</div>
						</div>
					</div>
					<div className="artistAlbumlist">
						{state.loadAlbums.map((item, index) => (
							<div key={index} className="artistAlbumItem">
								<img
									src={Utils.base64ToBlob(item.albumInfo.art)}
									className="artistAlbumImg"
									alt={item.albumInfo.album}
									width={"36px"}
								/>
								<p>{item.albumInfo.album}</p>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="albumLayout">
				{state.albums.length ? (
					<ConstUtills.SetMusicMemo
						aritst={artist}
						key={state.albums[0]?.ETag}
						albums={state.albums}
						pageState={setState}
					></ConstUtills.SetMusicMemo>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}

export default ArtistPage;
