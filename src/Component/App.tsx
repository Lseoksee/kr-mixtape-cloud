import React, { useState } from "react";
import * as musicMetadata from "music-metadata-browser";

const mediaParms = "uc?export=download&id=1Y6IvAa_57y3i-184Nuf0h5NbZDyEQE6z";

type AppProps = {
    data: string;
    setState: React.Dispatch<React.SetStateAction<string | JSX.Element[]>>;
};

const GetMetadata = async (): Promise<JSX.Element[]> => {
    const res = await fetch(`media/${mediaParms}`);
    const resblob = await res.blob();

    const url = window.URL.createObjectURL(resblob);
    const metadata = await musicMetadata.parseBlob(resblob);
    const resArr: JSX.Element[] = [];

    resArr.push(
        <div>
            <h1>{metadata.common.title}</h1>
            <audio controls>
                <source src={url}></source>
            </audio>
        </div>
    );

    return resArr;
};

function SetMusic(props: AppProps): JSX.Element {
    if (props.data === "avg") {
        GetMetadata().then((data) => {
            props.setState(data);
        });
    }

    return <div>{props.data}</div>;
}

function App(): JSX.Element {
    const [data, setState] = useState<string | JSX.Element[]>("avg");

    return (
        <div>
            <SetMusic setState={setState} data={data as string} />
        </div>
    );
}

export default App;
