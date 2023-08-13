import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
function loggingMiddleware(request: NextRequest) {
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
    };
    console.log(JSON.stringify(log, (k, v) => (v === undefined ? null : v)));
  }
}

// This function can be marked `async` if using `await` inside
function ipRestrictionMiddleware(request: NextRequest) {
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
  console.log(request.ip);
  // ホワイトリストに登録されていないIPアドレスからのアクセスは拒否します。
  if (request.ip && !ipWhiteList.has(request.ip as string)) {
    return new NextResponse(null, { status: 401 });
  }
}

export function middleware(request: NextRequest) {
  // This function can be marked `await` if function is `async`
  loggingMiddleware(request);
  // This function can be marked `await` if function is `async`
  ipRestrictionMiddleware(request);

  return NextResponse.next();
}
