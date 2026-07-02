import { NextResponse } from "next/server";

// Rotas que exigem login
const rotasProtegidas = ["/dashboard", "/cards"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const precisaLogin = rotasProtegidas.some((rota) =>
    pathname.startsWith(rota)
  );

  if (precisaLogin) {
    const token = request.cookies.get("token");

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cards/:path*"],
};
