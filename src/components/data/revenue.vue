<template>
  <div class="component">
    <div class="container">
      <!-- 日期選擇器 -->
      <div class="date-picker">
        <div class="block">
          <el-date-picker
            v-model="date_range"
            type="monthrange"
            unlink-panels
            range-separator="至"
            start-placeholder="起始月份"
            end-placeholder="結束月份"
            :shortcuts="shortcuts"
            :disabled-date="disable_date"
            popper-class="custom-datepicker"
          />
        </div>
      </div>

      <!-- 統計數據區塊 -->
      <div class="data_container">
        <div class="data_box">
          <el-card class="data_item">
            <span class="data_label">平均營業額</span>
            <span class="data_value">50 </span>
          </el-card>
          <el-card class="data_item">
            <span class="data_label">平均訂單數</span>
            <span class="data_value">5</span>
          </el-card>
          <el-card class="data_item">
            <span class="data_label">平均單價</span>
            <span class="data_value">5</span>
          </el-card>
        </div>
      </div>

      <!-- 圖表 -->
      <div class="chart_container">
        <VChart class="chart" :option="chart_options" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";

// 註冊 ECharts 組件
use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

const date_range = ref([]);

// 圖表數據
const chart_options = ref({
  title: {
    text: "每日營業額趨勢",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["營業額"],
  },
  xAxis: {
    type: "category",
    data: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "營業額",
      type: "line",
      data: [5000, 15000, 8000, 18000, 12000],
    },
  ],
});

// 監聽 date_range 變化，更新圖表
watch(date_range, (newRange) => {
  if (newRange && newRange.length === 2) {
    fetchRevenueData(newRange);
  }
});

// 模擬數據變化
const fetchRevenueData = (dateRange) => {
  const newData = [
    Math.random() * 20000,
    Math.random() * 20000,
    Math.random() * 20000,
    Math.random() * 20000,
    Math.random() * 20000,
  ];

  chart_options.value = {
    ...chart_options.value,
    series: [{ name: "營業額", type: "line", data: newData }],
  };
};

// 快速選擇
const shortcuts = [
  {
    text: "本月",
    value: () => {
      const end = new Date();
      const start = new Date(end.getFullYear(), end.getMonth(), 1);
      return [start, end];
    },
  },
  {
    text: "本年",
    value: () => {
      const end = new Date();
      const start = new Date(new Date().getFullYear(), 0);
      return [start, end];
    },
  },
  {
    text: "過去六個月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      return [start, end];
    },
  },
];

// 日期限制
const disable_date = (date) => {
  const today = new Date();
  return date > today;
};
</script>

<style lang="scss" scoped>
@import "../../assets/colors.scss";

// 日期選擇
.date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
  .block {
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
    :last-child {
      border-right: none;
    }
  }
}

// 卡片區塊
.data_container {
  width: 90%;
  margin: 20px;
  .data_box {
    display: flex;
    justify-content: center;
    gap: 50px;
    padding: 10px;
  }

  .data_item {
    min-width: 120px;
    text-align: center;
  }

  .data_label {
    display: block;
    color: $black6;
    margin-bottom: 5px;
    font-weight: bolder;
  }

  .data_value {
    font-size: 20px;
    font-weight: bolder;
    color: $primary;
  }
}

// 圖表
.chart_container {
  width: 100%;
  height: 400px;
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
