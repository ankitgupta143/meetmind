import { searchWorkspace } from "../services/search.service.js";

export async function searchController(req, res, next) {
  try {
    const { q = "", filter = "all", limit = 50 } = req.query;

    const data = await searchWorkspace({
      userId: req.user.id,
      query: q,
      filter,
      limit: parseInt(limit, 10) || 50,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
