window.addEventListener('DOMContentLoaded', event => {
  const searchInput = document.querySelector('#search-input');
  const searchMenu = document.querySelector('#search-menu');
  const menuItems = searchMenu.querySelectorAll('tbody tr');
  const cartTable = document.querySelector('#cart');
  const phoneInput = document.querySelector('#phone');
  const addressInput = document.querySelector('#address');
  const nameInput = document.querySelector('#name');
  const totalInput = document.querySelector('#total');
  const receiveInput = document.querySelector('#receive');
  const remainInput = document.querySelector('#remain');

  for (const e of menuItems) {
    e.addEventListener('click', () => {
      const value = [...e.querySelectorAll('td')].map(e => e.textContent);
      const tr = document.createElement('tr');
      const barcodeTd = document.createElement('td');
      const nameTd = document.createElement('td');
      const priceTd = document.createElement('td');
      const amountTd = document.createElement('td');
      const inputAmount = document.createElement('input');

      barcodeTd.textContent = value[0];
      nameTd.textContent = value[1];
      priceTd.textContent = value[2];
      inputAmount.type = 'number';
      inputAmount.min = '1';
      inputAmount.value = '1';
      inputAmount.addEventListener('blur', updateTotal);

      amountTd.append(inputAmount);
      tr.append(barcodeTd);
      tr.append(nameTd);
      tr.append(priceTd);
      tr.append(amountTd);
      tr.insertAdjacentHTML('beforeend', `
        <td>
            <button class="btn btn-danger">Xóa</button>
        </td>
      `);

      cartTable.querySelector('tbody').append(tr);

      searchMenu.removeEventListener('click', searchMenuClickHandle);
      searchMenu.classList.remove('show');
      updateTotal();
    });
  }

  phoneInput.addEventListener('blur', async () => {
    try {
      const loadData = 'Đang lấy dữ liệu...'
      const emptyData = 'Chưa có dữ liệu trong hệ thông...';

      nameInput.placeholder = loadData;
      addressInput.placeholder = loadData;
      nameInput.disabled = true;
      addressInput.disabled = true;

      const res = await axios.get(`/customer/${phoneInput.value}/api`);

      if (!res?.data?.status) {
        nameInput.placeholder = emptyData;
        addressInput.placeholder = emptyData;
        return;
      }

      nameInput.placeholder = '';
      addressInput.placeholder = '';
      nameInput.value = res.data?.customer?.name;
      addressInput.value = res.data?.customer?.address;
    }
    catch (err) {
      nameInput.placeholder = emptyData;
      addressInput.placeholder = emptyData;
    }
    finally {
      nameInput.disabled = false;
      addressInput.disabled = false;
    }
  });

  searchInput.addEventListener('keyup', () => {
    if (!String(searchInput.value)) {
      for (const e of menuItems) {
        e.classList.remove('d-none');
      }
      return;
    }

    for (const e of menuItems) {
      e.classList[e.textContent.includes(searchInput.value) ? 'remove' : 'add']('d-none');
    }
  });

  searchMenu.addEventListener('mouseenter', () => {
    searchInput.removeEventListener('blur', searchInputBlurHandle);
  });

  searchMenu.addEventListener('mouseleave', () => {
    searchInput.addEventListener('blur', searchInputBlurHandle);
  });

  searchInput.addEventListener('focus', () => {
    searchMenu.classList.add('show');
  });

  totalInput.addEventListener('blur', updateRemain);
  receiveInput.addEventListener('blur', updateRemain);

  searchInput.addEventListener('focus', () => {
    searchMenu.addEventListener('click', searchMenuClickHandle);
  })
  searchInput.addEventListener('blur', searchInputBlurHandle);

  document.querySelector('#info').addEventListener('submit', async (event) => {
    event.preventDefault();

    const body = {
      receive: receiveInput.value,
      customer: {
        phone: phoneInput.value,
        name: nameInput.value,
        address: addressInput.value,
      },
      products: [...cartTable.querySelector('tbody')?.querySelectorAll('tr')]?.map(curr => {
        const tds = [...curr?.querySelectorAll('td')];
        return {
          barcode: tds[0].textContent,
          amount: Number(tds[3].querySelector('input')?.value),
        }
      }),
    };

    try {
      const res = await axios.post('/transaction', body, {
        responseType: 'blob',
      });

      window.open(URL.createObjectURL(res.data));
      location.reload();
    }
    catch (err) {
      alert('Lỗi hệ thống');
    }
  });

  function searchInputBlurHandle() {
    searchMenu.classList.remove('show');
    searchMenu.removeEventListener('click', searchMenuClickHandle);
  }

  function searchMenuClickHandle() {
    searchInput.focus();
  }

  function updateTotal() {
    totalInput.value = [...cartTable.querySelector('tbody')?.querySelectorAll('tr')]?.reduce((result, curr) => {
      const tds = [...curr?.querySelectorAll('td')];
      return result + (Number(tds[2].textContent) * Number(tds[3].querySelector('input')?.value));
    }, 0);

    updateRemain();
  }

  function updateRemain() {
    remainInput.value = Number(receiveInput.value) - Number(totalInput.value);
  }
});