window.addEventListener('DOMContentLoaded', async () => {
  const filterForm = document.querySelector('#getReport');
  const timeLineSelect = filterForm.querySelector('select[name="timeLine"]');
  const specificTimeLine = filterForm.querySelector('#specificTimeLine');
  const transactionChartDiv = document.querySelector('#transaction-chart');
  const productChartDiv = document.querySelector('#product-chart');
  const transactionTable = document.querySelector('#transaction');

  const data = new FormData(filterForm);
  const params = Object.fromEntries(data.entries());

  const res = await axios.get('http://localhost:3000/report/data', {
    headers: {
      "Content-Type": "application/json",
    },
    params
  });

  const transactionChart = echarts.init(transactionChartDiv);
  const productChart = echarts.init(productChartDiv);
  transactionChart.setOption(res?.data?.chart?.transaction);
  productChart.setOption(res?.data?.chart?.product);
  window.addEventListener('resize', () => transactionChart?.resize());
  window.addEventListener('resize', () => productChart?.resize());

  timeLineSelect.addEventListener('change', () => {
    specificTimeLine.style.display = timeLineSelect.value === 'SPECIFIC' ? 'flex' : 'none';
  });

  res?.data?.transactions.forEach((e, i) => {
    transactionTable.querySelector('tbody')?.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${i + 1}</td>
        <td>${e?.customer?.phone}</td>
        <td>${e?.customer?.name}</td>
        <td>${e?.total}</td>
        <td>${e?.createdAt}</td>
        <td>
          <a
            href="/transaction/${e._id}"
            class="btn btn-primary btn-sm"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Xem chi tiết"
          ><i class="bi bi-search"></i></a>
        </td>
      </tr>
    `);
  });

  new DataTable('#transaction');
});