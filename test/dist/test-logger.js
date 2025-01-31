"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestLogger = void 0;
class TestLogger {
    calls = [];
    debug(msg, ...args) {
        this.log(msg, ...args);
    }
    info(msg, ...args) {
        this.log(msg, ...args);
    }
    warn(msg, ...args) {
        this.log(msg, ...args);
    }
    error(msg, ...args) {
        this.log(msg, ...args);
    }
    log(msg, ...args) {
        this.calls.push({ msg, args });
        console.log(msg, ...args);
    }
    getCalls() {
        return Array.from(this.calls);
    }
    reset() {
        this.calls = [];
    }
}
exports.TestLogger = TestLogger;
