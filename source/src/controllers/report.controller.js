import {Customer, Product, Transaction} from '#root/models/index.js';
import {chartConfig, timeLineOpts, timeTypeOpts} from "#root/configs/report.config.js";
import {datetimeUtil} from "#root/utils/datetime.util.js";

export const getReportView = async (req, res) => {
  const {
    timeLine = timeLineOpts[0]?.value,
    timeType = timeTypeOpts[0]?.value,
    from = '',
    to = '',
  } = req.query;

  return res.render('pages/report', {
    timeLineOpts: timeLineOpts.map(e => ({
      ...e,
      selected: e.value === timeLine,
    })),
    timeTypeOpts: timeTypeOpts.map(e => ({
      ...e,
      selected: e.value === timeType,
    })),
    timeLine,
    from,
    to,
    isAdmin: req?.cookies?.account === 'admin',
  });
};

export const getReportApi = async (req, res) => {
  const {
    timeLine = timeLineOpts[0]?.value,
    timeType = timeTypeOpts[0]?.value,
    from = '',
    to = '',
  } = req.query;

  const range = getDateRange(timeLine, new Date(from), new Date(to));

  const timeRange = getTimeRange(timeType, range.from, range.to);

  const transactions = await Transaction.find({
    createdAt: {
      $gt: range.from,
      $lt: range.to,
    }
  }).lean();

  const xAxisData = timeRange.map(e => e.label);
  const chartData = timeRange.reduce((pre, curr) => {
    const trans = transactions.filter(e => e.createdAt >= curr.from.getTime() && e.createdAt < curr.to.getTime());

    return {
      transaction: [...pre.transaction, trans.length],
      product: [...pre.product, trans.reduce((pre, curr) => pre + curr.products?.length, 0)],
    };
  }, {
    transaction: [],
    product: [],
  });

  const customers = await Customer.find({}).lean();

  const chart = {
    transaction: { ...chartConfig },
    product: { ...chartConfig }
  };
  chart.transaction.series[0].data = chartData.transaction;
  chart.product.series[0].data = chartData.product;
  chart.transaction.xAxis.data = xAxisData;
  chart.product.xAxis.data = xAxisData;

  return res.json({
    chart,
    transactions: transactions?.map(e => ({
      ...e,
      customer: customers?.find(e1 => e1?.phone === e?.customer ),
    })),
  });
};

function getDateRange(timeLine, from, to) {
  switch (timeLine) {
    default:
    case 'TODAY': {
      const now = new Date();

      return {
        from: datetimeUtil.getStartDate(now),
        to: now,
      };
    }
    case 'YESTERDAY': {
      const now = new Date();
      const yesterday = now.setDate(now.getDate() - 1);

      return {
        from: datetimeUtil.getStartDate(yesterday),
        to: datetimeUtil.getEndDate(yesterday),
      };
    }
    case 'LAST_7_DAYS': {
      const now = new Date();

      return {
        from: datetimeUtil.getStartDate(now.setDate(now.getDate() - 8)),
        to: datetimeUtil.getEndDate(now.setDate(now.getDate() - 1)),
      };
    }
    case 'THIS_MONTH': {
      const now = new Date();
      const from = datetimeUtil.getStartMonth(now);
      const to = now;

      return {
        from,
        to,
      };
    }
    case 'SPECIFIC': {
      return {
        from: datetimeUtil.getStartDate(from),
        to: datetimeUtil.getEndDate(to),
      };
    }
  }
}

function getTimeRange(timeType, from, to) {
  const timeRange = [];

  const funcName = ((name) => ({
    set: `set${name}`,
    get: `get${name}`,
  }))(timeTypeOpts.find(e => e.value === timeType).name);
  const toTime = new Date(to).getTime();
  const curr = new Date(from)
  while (curr.getTime() < toTime) {
    const from = new Date(curr);
    curr[funcName.set](curr[funcName.get]() + 1)
    timeRange.push({
      label: getLabel(timeType, from),
      from,
      to: new Date(curr.getTime() - 1000),
    });
  }

  return timeRange;
}

function getLabel(timeType, date) {
  const dateFormat = new Date(date);
  let result = ''
  switch (timeType) {
    default:
    case 'HOUR': result += `${String(dateFormat.getHours()).padStart(2, '0')}:00 `;
    case 'DATE': result += `${String(dateFormat.getDate()).padStart(2, '0')}/`;
    case 'MONTH': result += `${String(dateFormat.getMonth() + 1).padStart(2, '0')}/`;
    case 'YEAR': result += dateFormat.getFullYear();
  }
  return result;
}