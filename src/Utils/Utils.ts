/** 앱에 필요한 각종 유틸목록 */
class Utils {
    /** 해당 아티스트 이미지 경로반환 (이미지는 반드시 png여야함) */
    static getArtistImg(artist: string) {
        return `/artistimage/${artist}.png`;
    }

    /** 초단위를 [분:초] 로 */
    static secToMin(sec: number) {
        const min = Math.floor(sec / 60);

        // 정수 초만 구해서 단수(0~9) 까지는 01 이런식으로 바꿈
        const secString = Math.floor(sec - min * 60)
            .toString()
            .padStart(2, "0");

        return `${min}:${secString}`;
    }

    /** string바이트를 Blob URL 로 */
    static byteStringToBlob(byteString?: string) {
        if (!byteString) {
            return;
        }

        const buffer = Buffer.from(Array.from(byteString).map((line) => line.charCodeAt(0)));
        const blob = new Blob([buffer]);
        return URL.createObjectURL(blob);
    }

    /** 소수점 형태로 저장되어있는 볼륨값을 보기좋게 매핑 */
    static VolumeToInt(value: number) {
        return Number.parseInt((value * 100).toFixed(0));
    }

    /** 100단위 볼륨값을 0.0 단위로 바꾸기*/
    static VolumeToformatt(value: number) {
        return value / 100;
    }

    /** inputValue 는 standValue 의 몇 퍼센트 인지 리턴
     *  @param inputValue 기준값
     * @param standValue  구하려는 값 */
    static whatPercent(standValue: number, inputValue: number) {
        return (standValue / inputValue) * 100 || 0;
    }

    /** standValue의 percent가 어떤 값인지 리턴
     * @param standValue 기준값
     * @param percent 퍼센트
     */
    static whatPercentValue(standValue: number, percent: number) {
        return (standValue * percent) / 100 || 0;
    }
}

export default Utils;
