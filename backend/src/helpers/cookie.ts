export function getCook(cookiename: string, cookie: string) {
  // Get name followed by anything except a semicolon
  const cookiestring = RegExp(cookiename + '=[^;]+').exec(cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : '',
  );
}
