import { NextResponse } from "next/server";
import { widthLogging } from "@/middlewares/withLogging";
import { widthIpRestriction } from "@//middlewares/widthIpRestriction";

export default widthLogging(widthIpRestriction(() => NextResponse.next()));
