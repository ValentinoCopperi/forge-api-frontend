import 'dotenv/config'
import { defineConfig } from 'orval'

const serverUrl = process.env.VITE_SERVER_URL ?? "http://localhost:3001";

export default defineConfig({
    forgeApi: {
        input: `${serverUrl}/docs/openapi.json`,
        output: {
            target: './src/shared/api/generated/index.ts',
            client: 'react-query',
            httpClient: 'axios',
            baseUrl: {
                runtime: "API_BASE_URL",
                imports: [
                    { name: "API_BASE_URL", importPath: "../../config/envs/env" },
                ],
            },
            override: {
                mutator: {
                    path: './src/shared/api/axios/axios.mutator.ts',
                    name: 'customInstance',
                },
            },
        }
    }
})
