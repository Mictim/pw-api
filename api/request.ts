import { JsonRequest } from "http-req-builder";
import { ResponseValidator } from "response-openapi-validator";
import { CONFIG } from "../config/env";
import { request } from "@playwright/test";

const responseValidator = new ResponseValidator({
    openApiSpecPath: CONFIG.PETSTORE_SWAGGER_URL,
    apiPathPrefix: CONFIG.PETSTORE_API_PREFIX_PATH,
    ajvOptions: {
        allErrors: true,
        verbose: true,
        jsonPointers: true,
        formats: {
            double: "[+-]?\\d*\\.?\\d+",
            int32: /^\d+$/,
            int64: /^\d+$/,
        },
    },
})


export class PWRequest {
    protected options: Partial<{
        prifixUrl: string,
        url: string,
        method: string,
        headers: Record<string, string>,
        params: { [key: string]: string | number | boolean },
        body: any
    }> = {}

    prefixUrl(prefixUrl: string | URL): this {
        this.options.prifixUrl = prefixUrl.toString();
        return this;
    }

    url(url: string | URL): this {
        this.options.url = url.toString();
        return this;
    }
    method(method: string): this {
        this.options.method = method;
        return this;
    }
    headers(headers: Record<string, string>): this {
        this.options.headers = this.options.headers ?? {};
        this.options.headers = { ...this.options.headers, ...headers };
        return this;
    }
    searchParams(searchParams: { [key: string]: string | number | boolean }): this {
        this.options.params = searchParams;
        return this;
    }

    body(body: any): this {
        this.options.body = body;
        return this;
    }

    async send<T = never>() {
        if (this.options.url) {
            const reqContext = await request.newContext({
                baseURL: this.options.prifixUrl
            });

            const response = await reqContext.fetch(this.options.url, {
                ...this.options
            })

            await responseValidator.assertResponse({
                method: this.options.method ?? 'GET',
                requestUrl: response.url(),
                statusCode: response.status(),
                body: await response.json()
            })
            return {
                body: await response.json() as T,
                headers: response.headers()
            }
        }
        throw new Error('[PWRequst]URL is undefined');
    } 
}