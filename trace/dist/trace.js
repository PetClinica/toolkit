"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTrace = setTrace;
exports.trace = trace;
const cls = __importStar(require("cls-hooked"));
const logger_1 = require("../../logger/src/logger");
const namespace = cls.createNamespace('trace');
let traceFactory = (name, parent) => new NoopTrace(name, parent);
function setTrace(fn) {
    traceFactory = fn;
}
async function trace(name, fn) {
    (0, logger_1.getLogger)().debug("[%s] Starting trace", name);
    let trace;
    const parent = namespace.get('trace');
    (0, logger_1.getLogger)().debug("[%s] Parent: %s", name, parent?.getName());
    trace = traceFactory(name, parent);
    return namespace.runAndReturn(async () => {
        namespace.set('trace', trace);
        trace.start();
        try {
            return await fn();
        }
        finally {
            trace.end();
            namespace.set('trace', trace.getParent()); // Set back to parent segment
        }
    });
}
class NoopTrace {
    name;
    parent;
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
    }
    start() {
        (0, logger_1.getLogger)().info("starting trace", this.name);
    }
    end() {
        (0, logger_1.getLogger)().info("ending trace", this.name);
    }
    getParent() {
        return this.parent;
    }
    getName() {
        return this.name;
    }
}
