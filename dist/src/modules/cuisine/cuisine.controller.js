"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuisineController = void 0;
const cuisine_service_1 = require("./cuisine.service");
const paginationSortingHelper_1 = __importDefault(require("../../helpers/paginationSortingHelper"));
const getAllCuisines = async (req, res, next) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === "string" ? search : undefined;
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationSortingHelper_1.default)(req.query);
        const params = {
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
        };
        if (searchString) {
            params.search = searchString;
        }
        const result = await cuisine_service_1.cuisineService.getAllCuisines(params);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
exports.cuisineController = {
    getAllCuisines,
};
//# sourceMappingURL=cuisine.controller.js.map