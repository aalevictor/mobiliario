import type { NextConfig } from "next";

const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack: (config: any, { isServer, dev }: { isServer: boolean, dev: boolean }) => {
    // Apenas aplicar configurações webpack quando não estiver usando turbopack
    if (!dev) {
      if (isServer) {
        config.externals.push({
          'utf-8-validate': 'commonjs utf-8-validate',
          'bufferutil': 'commonjs bufferutil',
        });
      }
    }
    return config;
  },
  async headers () { 
    return [ 
      {
        source: "/api/:path*", 
        headers: [ 
          { 
            key: "Access-Control-Allow-Credentials",
            value: "true" 
          }, 
          { 
            key: "Access-Control-Allow-Origin",
            value: "*"
          },
          { 
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT"
          }, 
          { 
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" 
          }, 
        ] 
      } 
    ] 
  }
}

export default nextConfig;
