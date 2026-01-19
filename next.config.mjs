import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config, { webpack, isServer }) => {
        if (!isServer) {
            config.plugins.push(
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: path.join(__dirname, 'node_modules/cesium/Build/Cesium'),
                            to: 'cesium',
                        },
                    ],
                })
            );
        }
        config.resolve.alias = {
            ...config.resolve.alias,
            cesium: path.resolve(__dirname, 'node_modules/cesium'),
        };
        return config;
    },
};

export default nextConfig;
