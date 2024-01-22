import { Dispatch } from "redux";

/* 클래스 컴포넌트용 */
class ClassRedux {
    /** 클래스 컴포넌트 Reducer 응답 데이터 사용시 this.props.reduxResponce
     * 하면 Reducer 함수에 state 값이 나옴  */
    static mapStateToProps = (state: ReduxType.state) => ({
        reduxResponce: state,
    });

    /** 클래스 컴포넌트 Reducer 요청 데이터  this.props.albumArtLoadEvent() 이런식으로 요청*/
    static mapDispatchToProps = (dispatch: Dispatch<ReduxType.action>) => ({
        /** 앨범아트 로드를 Reducer에 알림 */
        albumArtLoadEvent: (album: AlbumCompType.album) => {
            dispatch({ type: "LoadAlbum", data: { LoadAlbum: album } });
        },
    });
}

/* 함수용 컴포넌트용 */
class FunctionRedux {
    /** 로드할 엘범 아트 개수를 Reducer에 알림 */
    static setAlbumCache(albumCount: number): ReduxType.action {
        return {type: "AlbumConunt", data: { AlbumConunt: albumCount}}}
    }


export { ClassRedux, FunctionRedux};
