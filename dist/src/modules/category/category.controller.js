"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const category_service_1 = require("./category.service");
const paginationSortingHelper_1 = __importDefault(require("../../helpers/paginationSortingHelper"));
const getAllCategories = async (req, res, next) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === 'string' ? search : undefined;
        // true or false
        const isActive = req.query.isActive
            ? req.query.isActive === 'true'
                ? true
                : req.query.isActive === 'false'
                    ? false
                    : undefined
            : undefined;
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationSortingHelper_1.default)(req.query);
        const params = {
            page,
            limit,
            skip,
            sortBy,
            sortOrder
        };
        if (searchString) {
            params.search = searchString;
        }
        if (typeof isActive === 'boolean') {
            params.isActive = isActive;
        }
        const result = await category_service_1.categoryService.getAllCategories(params);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
exports.categoryController = {
    getAllCategories
};
//# sourceMappingURL=category.controller.js.map