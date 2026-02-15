export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginError {
  message: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
      expiresInMins: data.expiresInMins ?? 30,
    }),
  });

  if (!res.ok) {
    const error: LoginError = await res.json();
    throw new Error(error.message || "Ошибка авторизации");
  }

  return res.json();
}

export function saveSession(data: LoginResponse, remember: boolean) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("accessToken", data.accessToken);
  storage.setItem("refreshToken", data.refreshToken);
  storage.setItem("user", JSON.stringify(data));
}

export function getSession() {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");
  const user =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!token || !user) return null;
  return { token, user: JSON.parse(user) as LoginResponse };
}

export function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
}
