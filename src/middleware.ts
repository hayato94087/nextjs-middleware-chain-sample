import { widthLogging } from "@/middlewares/withLogging";
import { widthIpRestriction } from "@//middlewares/widthIpRestriction";
import { chainMiddlewares } from "@/middlewares/chain";

// 関数は配列の順番に実行されます。
// ・全てのアクセスに対してログを出力します。
// ・IP制限を実行します。
export default chainMiddlewares([widthLogging, widthIpRestriction]);
