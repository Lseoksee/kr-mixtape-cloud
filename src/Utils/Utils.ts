/** 앱에 필요한 각종 유틸목록 */
export class Utils {
    /** 초단위를 [분:초] 로 */
    static secToMin(sec: number) {
        const min = Math.floor(sec / 60);

        // 정수 초만 구해서 단수(0~9) 까지는 01 이런식으로 바꿈
        const secString = Math.floor(sec - min * 60)
            .toString()
            .padStart(2, "0");

        return `${min}:${secString}`;
    }
}
