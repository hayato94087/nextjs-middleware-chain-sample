import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

export function widthIpRestriction(middleware: NextMiddleware) {
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
