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
            @change="get_revenue_data"
          />
        </div>
      </div>

      <!-- 統計數據區塊 -->
      <div class="data_container">
        <div class="data_box">
          <!-- 總營業額 -->
          <el-tooltip
            effect="dark"
            :content="`總營業額 ` + formatted_total_revenue + ` 元`"
            placement="top"
          >
            <el-card class="data_item">
              <span class="data_label">總營業額</span>
              <span class="data_value">
                {{ total_revenue_wan }}
                <div>萬</div>
              </span>
            </el-card>
          </el-tooltip>

          <!-- 平均營業額 -->
          <el-tooltip
            effect="dark"
            :content="`平均營業額 ` + formatted_average_revenue + ` 元`"
            placement="top"
          >
            <el-card class="data_item">
              <span class="data_label">平均營業額</span>
              <span class="data_value">
                {{ average_revenue_wan }}
                <div>萬</div>
              </span>
            </el-card>
          </el-tooltip>

          <!-- 總單數 -->
          <el-card class="data_item">
            <span class="data_label">總單數</span>
            <span class="data_value">
              {{ total_order }}
              <div>張</div>
            </span>
          </el-card>

          <!-- 平均訂單數 -->
          <el-card class="data_item">
            <span class="data_label">平均訂單數</span>
            <span class="data_value">
              {{ average_order }}
              <div>張</div>
            </span>
          </el-card>

          <!-- 平均單價 -->
          <el-tooltip
            effect="dark"
            :content="`平均單價 ` + formatted_average_order_price + ` 元`"
            placement="top"
          >
            <el-card class="data_item">
              <span class="data_label">平均單價</span>
              <span class="data_value">
                {{ average_order_price_wan }}
                <div>萬</div>
              </span>
            </el-card>
          </el-tooltip>
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
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";

import {
  date_range,
  formatted_total_revenue,
  total_revenue_wan,
  total_order,
  formatted_average_revenue,
  average_revenue_wan,
  average_order,
  formatted_average_order_price,
  average_order_price_wan,
  chart_options,
  shortcuts,
  disable_date,
  get_revenue_data,
} from "../../controllers/data/revenue_controller";

// 註冊 ECharts 組件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);
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
    justify-content: space-around;
    gap: 10px;
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
  margin-top: 80px;
  width: 100%;
  height: 400px;
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
