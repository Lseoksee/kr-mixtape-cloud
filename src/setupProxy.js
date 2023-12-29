/* 로컬에서 테스트 할시 CORS 애러 방지, 패키지 변경 및 이름 변경하면 안됨 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
    app.use(
        createProxyMiddleware("/media", {
            target: "https://drive.google.com",
            pathRewrite: {
                "^/media": "",
            },
            changeOrigin: true,
        })
    );
};
