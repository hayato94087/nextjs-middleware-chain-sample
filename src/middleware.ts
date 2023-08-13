import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

function widthLogging(middleware: NextMiddleware) {
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

function widthIpRestriction(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // ##################################################
    // IP制限
    //
    // 全てのパスに対してIP制限を実行します。
    // ##################################################
    // ホワイトリストに登録されたIPリストを取得します。
    const ipWhiteList = new Set(
      process.env.IP_WHITE_LIST?.split(",").map((item: string) => {
        return item.trim();
      })
    );
    // ホワイトリストに登録されていないIPアドレスからのアクセスは拒否します。
    if (request.ip && !ipWhiteList.has(request.ip as string)) {
      const log = {
        message: `許可されていないIPアドレスからのアクセスのためアクセスを拒否しました`,
        ip: request.ip,
        url: request.nextUrl.pathname,
        method: request.method,
      };
      console.log(log);
      return new NextResponse(null, { status: 401 });
    }

    return middleware(request, event);
  };
}

export default widthLogging(widthIpRestriction(() => NextResponse.next()));
