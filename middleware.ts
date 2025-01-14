import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth } = req;
  const { pathname, origin } = nextUrl;
  const user = auth?.user;
  const role = user?.role;
  const isVerified = user?.isVerified;
  const hasData = user?.hasData;

  function getNewURL(url: string) {
    return new URL(url, origin);
  }

  if (req.auth && pathname === "/login") {
    const url = getNewURL("/");
    return Response.redirect(url);
  }

  if (!req.auth && pathname !== "/signup" && pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  //After authentication

  if (pathname === "/user/add" && hasData && !isVerified) {
    const url = getNewURL("/verification");
    return Response.redirect(url);
  }

  if (
    (pathname === "/user/add" && isVerified) ||
    (pathname === "/verification" && isVerified)
  ) {
    const url = getNewURL("/");
    return Response.redirect(url);
  }

  if (role !== "" && pathname === "/new") {
    const url = getNewURL("/");
    return Response.redirect(url);
  }

  if (req.auth?.user.role === "" && pathname !== "/new") {
    const newUrl = new URL("/new", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (role === "employer" && pathname.startsWith("/user")) {
    return NextResponse.redirect(getNewURL("/"));
  }

  if (role === "employee" && pathname.startsWith("/job")) {
    return NextResponse.redirect(getNewURL("/"));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
