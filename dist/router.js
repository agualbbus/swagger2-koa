// router.ts
"use strict";
/*
 * Koa2 router implementation for validating against a Swagger document
 */
/*
 The MIT License

 Copyright (c) 2014-2016 Carl Ansley

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
const Koa = require('koa');
const koaCors = require('koa-cors');
const koaRouter = require('koa-router');
const koaConvert = require('koa-convert');
const koaError = require('koa-onerror');
const body = require('koa-body');
const swagger = require('swagger2');
const validate_1 = require('./validate');
const log_1 = require('./log');
function default_1(swaggerDocument) {
    let router = koaRouter();
    let app = new Koa();
    // automatically convert legacy middleware to new middleware
    const _use = app.use;
    app.use = x => _use.call(app, koaConvert(x));
    let document;
    if (typeof swaggerDocument === 'string') {
        document = swagger.loadDocumentSync(swaggerDocument);
    }
    else {
        document = swaggerDocument;
    }
    if (!swagger.validateDocument(document)) {
        throw Error(`Document does not conform to the Swagger 2.0 schema`);
    }
    koaError(app);
    app.use(log_1.logger);
    app.use(koaCors());
    app.use(body());
    app.use(validate_1.default(document));
    app.use(router.routes());
    app.use(router.allowedMethods());
    return {
        get: (path, middleware) => router.get(document.basePath + path, middleware),
        head: (path, middleware) => router.head(document.basePath + path, middleware),
        put: (path, middleware) => router.put(document.basePath + path, middleware),
        post: (path, middleware) => router.post(document.basePath + path, middleware),
        del: (path, middleware) => router.del(document.basePath + path, middleware),
        app: () => app
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=router.js.map