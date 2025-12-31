import { Component, type JSX, type ReactNode } from "react";
import "../Style/ListSideBarComponet.css";
import tempAlbumArt from "../Assets/tempAlbumArt.png";
import { ListButton, ShadowDiv, VolumeSlider } from "./StyleComponet";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import type { ConnectedProps } from "react-redux";
import { ReduxActions, reduxConnect } from "../Store/ConfingRedux";
import Utils from "../Utils/Utils";
import { BrowserCache } from "../Utils/BrowserCache";

type ListSideBarProp = {} & ConnectedProps<typeof reduxConnect>;

type ListSideBarState = {
	contentType: "playlist" | "lyric";
};

class ListSideBarComponet extends Component<ListSideBarProp, ListSideBarState> {
	state: Readonly<ListSideBarState> = {
		contentType: "playlist",
	};

	reduxState = this.props.reduxResponce.musicPlayState;
	currIndex = this.reduxState.startIndex;
	reduxStateRecv = this.reduxState.send;
	currItem = this.reduxState.queue[this.currIndex]?.loadAlbum;

	playlistContentComp(): JSX.Element[] {
		let prevAlbumName = "";

		//TODO: 정렬 잘 바꿔야함
		const cpyQueue = this.reduxState.queue.slice().sort((a, b) => {
			if (a.index === this.currIndex) return -1;
			if (a.index < this.currIndex) return 1;
			return 0;
		});

		return cpyQueue.map((item) => {
			const comp = (
				<>
				{prevAlbumName !== item.loadAlbum.albumName ? <p className="PlaylistAlbumName">{item.loadAlbum.albumName}</p> : <></>}
				<div className="PlaylistItem" key={item.index}>
					<div
						className={"PlaylistItemInfoDiv " + (this.currIndex === item.index ? "PlaylistActive" : "")}
						onClick={() => {
							const action = ReduxActions.selectIndexMusic({ index: item.index });
							this.props.dispatch(action);
						}}
					>
						<div className="PlaylistAlbumArtDiv">
							<img src={item.loadAlbum.albumArtUrl || tempAlbumArt} alt="앨범아트" height="100%" className="albumArt" />
						</div>
						<div className="PlaylistDesDiv">
							<p className="PlaylistTrackName">{item.loadAlbum.musicMeta.title}</p>
							<p className="PlaylistArtistName">{item.loadAlbum.musicMeta.artist}</p>
						</div>
					</div>
				</div>
				</>
			);

			prevAlbumName = item.loadAlbum.albumName;

			return comp;
		});
	}

	lyricContentComp(): JSX.Element {
		return <></>;
	}

	componentDidMount(): void {}

	// 플레어어 제어 아이콘 클릭 이벤트 처리
	playerIconClickEvent = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
		let action: any;

		if (e.currentTarget.id === "play") {
			// 재생버튼
			action = ReduxActions.reqUpdatePlayState({ isPlay: "play" });
		} else if (e.currentTarget.id === "pause") {
			// 일시정지 버튼
			action = ReduxActions.reqUpdatePlayState({ isPlay: "pause" });
		} else if (e.currentTarget.id === "prev") {
			// 이전곡 버튼
			action = ReduxActions.selectIndexMusic({ index: this.currIndex - 1 });
		} else if (e.currentTarget.id === "next") {
			// 다음곡 버튼
			action = ReduxActions.selectIndexMusic({ index: this.currIndex + 1 });
		}

		this.props.dispatch(action);
	};

	shouldComponentUpdate(nextProps: Readonly<ListSideBarProp>, nextState: Readonly<any>, nextContext: any): boolean {
		const before = this.props.reduxResponce.musicPlayState;
		const next = nextProps.reduxResponce.musicPlayState;

		// recv 데이터만 바뀐경우 갱신안함
		if (before.recv !== next.recv && before.send === next.send) return false;

		return true;
	}

	render(): ReactNode {
		console.log(this.reduxState.queue);
		this.reduxState = this.props.reduxResponce.musicPlayState;
		this.reduxStateRecv = this.reduxState.send;
		this.currIndex = this.reduxState.startIndex;
		this.currItem = this.reduxState.queue[this.currIndex]?.loadAlbum;

		let playIcon = <PlayArrowIcon id="play" className="controlIcon" onClick={this.playerIconClickEvent} />;
		if (this.reduxStateRecv.isPlay === "play") {
			playIcon = <PauseIcon className="controlIcon" id="pause" onClick={this.playerIconClickEvent} />;
		}

		const contentType = this.state.contentType;

		return (
			<ShadowDiv shadowloc="left" className="ListSideBarDiv">
				<ShadowDiv shadowloc="bottom" className="SubPlayViewDiv">
					<div className="albumArtDiv">
						<img src={this.currItem?.albumArtUrl || tempAlbumArt} alt="앨범아트" height="100%" className="albumArt" />
					</div>
					<div className="albumInfoControlDiv">
						<div className="subInfo">
							<p className="trackName">{this.currItem?.musicMeta.title}</p>
							<p className="subArtistName">{this.currItem?.musicMeta.artist}</p>
						</div>
						<div className="mediaControl">
							<div className="subvolumeControlDiv">
								<VolumeUpIcon />
								<div className="subvolumeControl">
									<VolumeSlider
										value={Utils.VolumeToInt(this.reduxState.volume)}
										onChange={(_, value) => {
											const setVolume = ReduxActions.setVolume({ value: value as number });
											this.props.dispatch(setVolume);
										}}
										onChangeCommitted={(_, value) => {
											BrowserCache.saveVolume(Utils.VolumeToformatt(value as number));
										}}
									></VolumeSlider>
								</div>
							</div>
							<div className="subPlayControlDiv">
								<SkipPreviousIcon className="controlIcon" onClick={this.playerIconClickEvent} id="prev" />
								{playIcon}
								<SkipNextIcon className="controlIcon" onClick={this.playerIconClickEvent} id="next" />
							</div>
						</div>
					</div>
				</ShadowDiv>
				<div className="ContentChangeButtonDiv">
					<ListButton
						className="ContentChangeButton"
						color={contentType === "playlist" ? "primary" : "secondary"}
						onClick={() => this.setState({ contentType: "playlist" })}
					>
						재생목록
					</ListButton>
					<ListButton
						className="ContentChangeButton"
						color={contentType === "lyric" ? "primary" : "secondary"}
						onClick={() => this.setState({ contentType: "lyric" })}
					>
						가사보기
					</ListButton>
				</div>
				<ShadowDiv shadowloc="bottom" className="ContentDiv">
					{contentType === "playlist" ? <div className="PlaylistContentDiv">{this.playlistContentComp()}</div> : <></>}
					{contentType === "lyric" ? <div className="LyricContentDiv">{this.lyricContentComp()}</div> : <></>}
				</ShadowDiv>
			</ShadowDiv>
		);
	}
}

export default reduxConnect(ListSideBarComponet);
