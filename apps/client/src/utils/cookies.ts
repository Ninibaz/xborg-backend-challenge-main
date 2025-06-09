export const parseCookies = (cookies?: string) =>
  cookies?.split(';').reduce((acc, curr) => {
    const [key, val] = curr.split('=');

    acc[key.trim()] = val.trim();

    return acc;
  }, {} as Record<string, any>);
