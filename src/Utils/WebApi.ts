/** 웹 API 에서 Blob 콘텐츠를 정해진 바이트 만큼만 가져옵니다.
 * @param url 가져올  api 주소
 * @param size 킬로바이트 */
export async function getBlobToSize(url: string, kb: number): Promise<Blob> {
    const res = await fetch(url);
    const reader = res.body?.getReader();
    const bytes = [];
    let size = 0;

    while (true) {
        const line = await reader?.read();

        if (line?.done) {
            break;
        }

        bytes.push(line?.value);
        size += line?.value?.length!!;

        if (size >= 1024 * kb) {
            reader?.cancel();
            break;
        }
    }

    let result = new Uint8Array(size);
    let position = 0;

    bytes.forEach((line) => {
        result.set(line!!, position);
        position += line?.length!!;
    });

    return new Blob([result]);
}
