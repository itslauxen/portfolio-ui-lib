/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // O ESLint não bloqueia o build (rode `npm run lint` à parte).
  // Os erros de TypeScript continuam bloqueando — sua rede de segurança.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
