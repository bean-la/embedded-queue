"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Priority = void 0;
exports.toString = toString;
var Priority;
(function (Priority) {
    Priority[Priority["LOW"] = 1] = "LOW";
    Priority[Priority["NORMAL"] = 2] = "NORMAL";
    Priority[Priority["MEDIUM"] = 3] = "MEDIUM";
    Priority[Priority["HIGH"] = 4] = "HIGH";
    Priority[Priority["CRITICAL"] = 5] = "CRITICAL";
})(Priority || (exports.Priority = Priority = {}));
function toString(priority) {
    switch (priority) {
        case Priority.LOW:
            return "LOW";
        case Priority.NORMAL:
            return "NORMAL";
        case Priority.MEDIUM:
            return "MEDIUM";
        case Priority.HIGH:
            return "HIGH";
        case Priority.CRITICAL:
            return "CRITICAL";
    }
}
