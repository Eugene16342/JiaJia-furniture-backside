import { ref, computed } from "vue";
import api from "../../utils/api";
import { ElNotification } from "element-plus";

// 千分位格式化
const format_num = (value) => {
  const number = Number(value) || 0;
  return number === 0 ? "-" : number.toLocaleString();
};
// 除以一萬病加上千分位
const format_wan = (value) => {
  const number = Number(value) || 0;
  return number === 0
    ? "-"
    : Number((number / 10000).toFixed(1)).toLocaleString();
};

// 註冊 ref
export const date_range = ref([]);

const total_revenue = ref("");

export const formatted_total_revenue = computed(() =>
  format_num(total_revenue.value)
);
export const total_revenue_wan = computed(() =>
  format_wan(total_revenue.value)
);

export const total_order = ref("-");

const average_revenue = ref("-");
export const formatted_average_revenue = computed(() =>
  format_num(average_revenue.value)
);
export const average_revenue_wan = computed(() =>
  format_wan(average_revenue.value)
);

export const average_order = ref("-");

const average_order_price = ref("-");
export const formatted_average_order_price = computed(() =>
  format_num(average_order_price.value)
);
export const average_order_price_wan = computed(() =>
  format_wan(average_order_price.value)
);

const first_day = new Date("2023-01-01");

const today = new Date();

export // 日期限制
const disable_date = (date) => {
  return date < first_day || date > today;
};

// 快速選擇
export const shortcuts = [
  {
    text: "本月",
    value: () => {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return [start, today];
    },
  },
  {
    text: "本年",
    value: () => {
      const start = new Date(new Date().getFullYear(), 0);
      return [start, today];
    },
  },
  {
    text: "過去六個月",
    value: () => {
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      return [start, today];
    },
  },
  {
    text: "迄今",
    value: () => {
      return [first_day, today];
    },
  },
];

// 圖表基礎設定
export const chart_options = ref({
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["營業額", "平均單價", "單數"],
  },
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: [
    {
      type: "value",
      name: "營業額",
      position: "left",
    },
    { type: "value", name: "單數", position: "right" },
  ],
  series: [
    {
      name: "營業額",
      type: "line",
      smooth: true,
      data: [],
      itemStyle: { color: "#5470c6" },
    },
    {
      name: "平均單價",
      type: "line",
      smooth: true,
      data: [],
      itemStyle: { color: "#ee6666" },
    },
    {
      name: "單數",
      type: "bar",
      yAxisIndex: 1,
      data: [],
      itemStyle: { color: "#fac858" },
    },
  ],
});

// 獲取營業額資訊
export const get_revenue_data = async (selected_range) => {
  try {
    if (!date_range.value || date_range.value.length < 2) {
      return;
    }
    console.log("看我!", selected_range[0]);

    const start_month = selected_range[0];
    const end_month = selected_range[1];

    const res = await api.get("/revenue/get_revenue_data", {
      params: { start_month, end_month },
    });

    // 統計數據
    total_revenue.value = res.data.total_revenue;
    total_order.value = res.data.total_order_count;
    average_revenue.value = res.data.average_revenue;
    average_order.value = res.data.average_order;
    average_order_price.value = res.data.average_order_price;

    // 圖表
    chart_options.value.xAxis.data = res.data.chart_data.map(
      (item) => item.month
    );

    chart_options.value.series[0].data = res.data.chart_data.map(
      (item) => item.revenue
    );

    chart_options.value.series[1].data = res.data.chart_data.map(
      (item) => item.average_price
    );

    chart_options.value.series[2].data = res.data.chart_data.map(
      (item) => item.orders
    );
  } catch (error) {
    console.error("獲取營業額資訊失敗!", error);

    ElNotification({
      title: "錯誤",
      message: "獲取營業額失敗!",
      type: "error",
    });
  }
};
