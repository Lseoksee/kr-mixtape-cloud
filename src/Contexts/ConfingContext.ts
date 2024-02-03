import React from "react";

export interface ContextType {
    setMusicState: (albumInfo: AlbumCompType.loadMusicInfo) => void;
}

const ContextStore = React.createContext({});

export default ContextStore;
