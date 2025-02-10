const db = require("../models");
const { Op, fn, col, literal } = require("sequelize");

// 獲取營業額數據
exports.get_revenue_data = async (req, res) => {
  try {
    const { start_month, end_month } = req.query;

    if (!start_month || !end_month) {
      return res.status(400).json({ message: "缺少日期範圍" });
    }

    //  按月份分類數據
    const revenue_data = await db.orders.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("created_at"), "%Y-%m"), "month"], // 格式化月份
        [fn("SUM", col("total_price")), "total_revenue"], // 計算該月總營業額
        [fn("COUNT", col("order_id")), "total_order_count"], // 計算該月總訂單數
      ],
      where: {
        created_at: {
          [Op.between]: [start_month, end_month],
        },
      },
      group: [literal("month")], // 依月份分組
      order: [[literal("month"), "ASC"]], // 按月份排序
      raw: true,
    });

    // 統計整體數據
    const total_revenue = revenue_data.reduce(
      (sum, data) => sum + parseInt(data.total_revenue),
      0
    );
    const total_order_count = revenue_data.reduce(
      (sum, data) => sum + parseInt(data.total_order_count),
      0
    );

    //  計算有多少個月
    const unique_months = revenue_data.map((data) => data.month);
    const months_count = unique_months.length || 1; // 避免除以 0

    //  計算平均營業額 平均訂單數
    const average_revenue = Math.floor(total_revenue / months_count);
    const average_order = (total_order_count / months_count).toFixed(1);
    const average_order_price =
      total_order_count > 0 ? total_revenue / total_order_count : 0;

    // 整理圖表格式
    const chart_data = revenue_data.map((data) => ({
      month: data.month,
      revenue: parseInt(data.total_revenue),
      orders: parseInt(data.total_order_count),
      average_price:
        data.total_order_count > 0
          ? Math.floor(
              parseInt(data.total_revenue) / parseInt(data.total_order_count)
            )
          : 0,
    }));

    return res.json({
      total_revenue,
      total_order_count,
      average_revenue,
      average_order,
      average_order_price: Math.floor(average_order_price),
      chart_data,
    });
  } catch (error) {
    console.error("獲取營業額失敗!", error);
    res.status(500).json({ message: "獲取營業額失敗" });
  }
};
