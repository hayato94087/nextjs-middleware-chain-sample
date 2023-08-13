import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

export function widthLogging(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // ##################################################
    // ログ出力
    //
    // パスが以下の場合にログを出力します。
    // ・"/"から始まり、"."を含まない任意のパス
    // ・"/_nextから始まらない任意のパス
    // ・"/"のルートパス。
    // ・"/api"から始まる任意のパス
    // ・"/trpc"から始まる任意のパス
    // ##################################################
    if (
      request.nextUrl.pathname.match(/\/(?!.*\..*|_next).*/) ||
      request.nextUrl.pathname.match(/\/(api|trpc)(.*)/) ||
      request.nextUrl.pathname === "/"
    ) {
      // リクエストの情報をJSON形式で出力します。
      const log = {
        ip: request.ip,
        geo: request.geo,
        url: request.nextUrl.pathname,
        method: request.method,
      };
      console.log(JSON.stringify(log, (k, v) => (v === undefined ? null : v)));
    }

    return middleware(request, event);
  };
}
