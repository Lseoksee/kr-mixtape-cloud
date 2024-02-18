import { Component, ReactNode } from "react";
import "../Style/MusicStateComponet.css";
import art from "../Assets/tempAlbumArt.png";
import { reduxConnect } from "../Store/ConfingRedux";
import { ConnectedProps } from "react-redux";
import { MUIComponet } from "../Style/StyleComponents/MUICustum";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

type MainPlayerProp = {} & ConnectedProps<typeof reduxConnect>;

class MainPlayerComponet extends Component<MainPlayerProp, any> {
    render(): ReactNode {
        return (
            <div className="playerLayout">
                <div className="playerDiv">
                    <div className="musicInfoDiv">
                        <img src={art} alt="앨범아트" height="100%" className="albumArt" /> {/* 바꿀부분 */}
                        <div className="infoText">
                            <p className="songName">제목</p> {/*  바꿀부분 */}
                            <p className="songArtist">아티스트</p> {/* 바꿀부분 */}
                        </div>
                    </div>
                    <div className="musicControlDiv">
                        <div className="musicControl">
                            <ShuffleIcon className="controlIcon" />
                            <SkipPreviousIcon className="controlIcon" />
                            <PlayArrowIcon className="controlIcon" />
                            <SkipNextIcon className="controlIcon" />
                            <RepeatIcon className="controlIcon" />
                        </div>
                        <div className="progressBar">
                            <p className="progressTime">1:00</p> {/* 바꿀부분 */}
                            <MUIComponet.ProgressBar />
                            <p className="progressTime">3:00</p> {/* 바꿀부분 */}
                        </div>
                    </div>
                    <div className="volumeControlDiv">
                        <div className="volumeControl">
                            <VolumeUpIcon />
                            <MUIComponet.VolumeSlider />
                            <p>0%</p>   {/* 바꿀 부분 */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// 클래스 컴포넌트에서 redux 재어를 위한
export default reduxConnect(MainPlayerComponet);
