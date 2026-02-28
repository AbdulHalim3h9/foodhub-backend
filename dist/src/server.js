"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
async function main() {
    try {
        app_1.default.listen(PORT, () => {
            console.log(`🍱 FoodHub Backend is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("An error occurred:", error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map