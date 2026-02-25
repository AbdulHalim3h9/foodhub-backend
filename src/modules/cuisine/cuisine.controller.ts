import type { NextFunction, Request, Response } from "express";
import { cuisineService } from "./cuisine.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getAllCuisines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const params: any = {
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    };

    if (searchString) {
      params.search = searchString;
    }

    const result = await cuisineService.getAllCuisines(params);

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const cuisineController = {
  getAllCuisines,
};
