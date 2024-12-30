document.addEventListener('DOMContentLoaded', function () {
  // 获取页面元素
  const homeScreen = document.getElementById('homeScreen');
  const foodScreen = document.getElementById('foodScreen');
  const bathScreen = document.getElementById('bathScreen');
  const settingsScreen = document.getElementById('settingsScreen');
  const initialSettingsScreen = document.getElementById('initialSettingsScreen');
  const subSettingsScreen = document.getElementById('subSettingsScreen');
  const addModal = document.getElementById('addModal');
  const closeModalBtn = document.querySelector('.closeBtn');
  const confirmAddBtn = document.getElementById('confirmAdd');
  const newChoiceNameInput = document.getElementById('newChoiceName');

  // 初始化数据
  let initialChoices = JSON.parse(localStorage.getItem('initialChoices')) || ['1楼', '2楼', '3楼', '4楼', '点外卖', '出去吃', '食全食美', '匠心源', '潮汕捞面'];
  let subChoices = JSON.parse(localStorage.getItem('subChoices')) || {
      '1楼': ['饺子', '老上海', '炒饭/面', '粥'],
      '2楼': ['潮汕汤面', '大众菜', '港式烧腊', '蒙自源', '麻辣烫'],
      '3楼': ['麻辣烫', '柳州螺蛳粉', '唐三酱铁板板&意面', '小锅猪肚鸡', '茶香鸡', '巴西烤肉饭', '朱家小馆', '大众菜', '烤盘饭', '小禾饭'],
      '4楼': ['煲仔饭', '汤粉', '自选菜', '蒸粉面', '手撕鸡猪脚饭'],
      '点外卖': ['烧腊', '麻辣烫冒菜', '饺子馄饨', '汉堡薯条', '意面披萨', '快餐便当', '米粉面馆', '炸鸡炸串', '能量西餐', '日料寿司', '韩式料理']
  };
  let bathOrder = JSON.parse(localStorage.getItem('bathOrder')) || [];
  let bathNames = JSON.parse(localStorage.getItem('bathNames')) || [];


  // 3秒后跳转到主页
  setTimeout(function() {
      overlay.style.display = 'none'; // 隐藏动画
      document.getElementById('homeScreen').classList.add('active'); // 显示主页
  }, 1500);
  

  // 页面导航函数
  function showScreen(screen) {
      // 隐藏所有页面
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      // 显示指定页面
      screen.classList.add('active');
  }

  // 返回主页功能
  function backToHome() {
      showScreen(homeScreen);
  }

  // 初始化页面显示
  showScreen(homeScreen);

  // 主页按钮事件
  document.getElementById('decideFoodBtn').addEventListener('click', function () {
      showScreen(foodScreen);
  });

  document.getElementById('decideBathOrderBtn').addEventListener('click', function () {
      showScreen(bathScreen);
      if (bathNames.length === 0) {
          document.getElementById('bathSetup').style.display = 'block';
          document.getElementById('peopleNames').style.display = 'none';
      } else {
          document.getElementById('bathSetup').style.display = 'none';
          document.getElementById('peopleNames').style.display = 'block';
          renderBathNames();
      }
  });

  // 确定人数按钮
  document.getElementById('setPeopleBtn').addEventListener('click', function () {
      const numPeople = parseInt(document.getElementById('numPeople').value);
      if (numPeople > 0) {
          bathNames = Array.from({ length: numPeople }, () => '');
          localStorage.setItem('bathNames', JSON.stringify(bathNames));
          document.getElementById('bathSetup').style.display = 'none';
          document.getElementById('peopleNames').style.display = 'block';
          renderBathNames();
      } else {
          alert('请输入有效人数');
      }
  });

  // 渲染洗澡顺序名字输入
  function renderBathNames() {
      const namesContainer = document.getElementById('namesInputContainer');
      namesContainer.innerHTML = '';
      bathNames.forEach((name, index) => {
          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = `序号 ${index + 1}`;
          input.value = name;
          input.addEventListener('input', function () {
              bathNames[index] = this.value.trim();
              localStorage.setItem('bathNames', JSON.stringify(bathNames));
          });
          namesContainer.appendChild(input);
      });
  }
  function updateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');  // 月份从0开始，+1调整
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    document.getElementById('time').textContent = timeString;
}
  // 保存名字按钮
  document.getElementById('saveNamesBtn').addEventListener('click', function () {
      showScreen(bathScreen);
      document.getElementById('peopleNames').style.display = 'block';
  });

  // 开始抽签决定吃什么
  document.getElementById('startFoodDrawBtn').addEventListener('click', function () {
      const selectedFloor = initialChoices[Math.floor(Math.random() * initialChoices.length)];
      let foodResult = selectedFloor;
      if (subChoices[selectedFloor] && Array.isArray(subChoices[selectedFloor]) && subChoices[selectedFloor].length > 0) {
          const selectedFood = subChoices[selectedFloor][Math.floor(Math.random() * subChoices[selectedFloor].length)];
          foodResult += ' - ' + selectedFood;
      }
      document.getElementById('foodResult').textContent = '结果: ' + foodResult;
  });

  // 开始抽签决定谁先洗澡
  document.getElementById('startBathDrawBtn').addEventListener('click', function () {
      if (bathNames.length === 0) {
          alert('请先设置洗澡人员信息');
          return;
      }
      bathOrder = bathNames.map((name, index) => name || `序号 ${index + 1}`);
      bathOrder = shuffleArray(bathOrder);
      localStorage.setItem('bathOrder', JSON.stringify(bathOrder));
      document.getElementById('bathResult').textContent = '洗澡顺序: ' + bathOrder.join(' -> ');
  });

  // 数组随机排序函数
  function shuffleArray(array) {
      let arr = array.slice();
      for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
  }

  // 设置按钮事件
  document.getElementById('goToSettingsBtn').addEventListener('click', function () {
      showScreen(settingsScreen);
  });

  document.getElementById('bathSettingsBtn').addEventListener('click', function () {
      showScreen(settingsScreen);
  });

  // 设置页面按钮事件
  document.getElementById('initialSettingsBtn').addEventListener('click', function () {
      showScreen(initialSettingsScreen);
      renderInitialChoices();
  });

  document.getElementById('subSettingsBtn').addEventListener('click', function () {
      showScreen(subSettingsScreen);
      renderSubChoicesSettings();
  });

  document.getElementById('resetBtn').addEventListener('click', function () {
      if (confirm('确定要重置所有选项为默认值吗？这包括吃饭和洗澡的哦')) {
          localStorage.removeItem('initialChoices');
          localStorage.removeItem('subChoices');
          localStorage.removeItem('bathOrder');
          localStorage.removeItem('bathNames');
          location.reload();
      }
  });

  // 返回主页按钮
  document.querySelectorAll('.centered-btn').forEach(btn => {
      btn.addEventListener('click', backToHome);
  });

  // 返回设置按钮
  document.querySelectorAll('.centered-btn').forEach(btn => {
      if (btn.textContent === '返回设置') {
          btn.addEventListener('click', function () {
              showScreen(settingsScreen);
          });
      }
  });

  // 渲染初始抽签选项
  function renderInitialChoices() {
      const initialChoicesList = document.getElementById('initialChoicesList');
      initialChoicesList.innerHTML = '';
      initialChoices.forEach((choice, index) => {
          const li = document.createElement('li');
          li.textContent = choice;
          const removeBtn = document.createElement('button');
          removeBtn.textContent = '移除';
          removeBtn.addEventListener('click', function () {
              initialChoices.splice(index, 1);
              localStorage.setItem('initialChoices', JSON.stringify(initialChoices));
              renderInitialChoices();
          });
          li.appendChild(removeBtn);
          initialChoicesList.appendChild(li);
      });
  }

  // 添加初始抽签选项按钮
  document.getElementById('addInitialChoiceBtn').addEventListener('click', function () {
      openModal();
      confirmAddBtn.onclick = function () {
          const newChoice = newChoiceNameInput.value.trim();
          if (newChoice) {
              initialChoices.push(newChoice);
              localStorage.setItem('initialChoices', JSON.stringify(initialChoices));
              renderInitialChoices();
              closeModal();
          } else {
              alert('选项名称不能为空');
          }
      };
  });
    // 点击时钟时切换全屏和恢复
document.getElementById('time').addEventListener('click', function () {
    this.classList.toggle('fullscreen');  // 切换 .fullscreen 类

    // 切换背景和时钟文字颜色
    document.body.classList.toggle('hidden');
});
  // 渲染二次抽签选项
  function renderSubChoicesSettings() {
      const subChoicesDiv = document.getElementById('subChoicesSettings');
      subChoicesDiv.innerHTML = '';
      for (const floor in subChoices) {
          const floorDiv = document.createElement('div');
          floorDiv.classList.add('floor-section');
          const h3 = document.createElement('h3');
          h3.textContent = floor;
          floorDiv.appendChild(h3);

          subChoices[floor].forEach((food, index) => {
              const foodItem = document.createElement('div');
              foodItem.classList.add('food-item');
              const span = document.createElement('span');
              span.textContent = food;
              const removeBtn = document.createElement('button');
              removeBtn.textContent = '移除';
              removeBtn.addEventListener('click', function () {
                  subChoices[floor].splice(index, 1);
                  localStorage.setItem('subChoices', JSON.stringify(subChoices));
                  renderSubChoicesSettings();
              });
              foodItem.appendChild(span);
              foodItem.appendChild(removeBtn);
              floorDiv.appendChild(foodItem);
          });

          const addBtn = document.createElement('button');
          addBtn.textContent = '添加选项';
          addBtn.classList.add('add-btn');
          addBtn.addEventListener('click', function () {
              openModal();
              confirmAddBtn.onclick = function () {
                  const newFood = newChoiceNameInput.value.trim();
                  if (newFood) {
                      subChoices[floor].push(newFood);
                      localStorage.setItem('subChoices', JSON.stringify(subChoices));
                      renderSubChoicesSettings();
                      closeModal();
                  } else {
                      alert('选项名称不能为空');
                  }
              };
          });
          floorDiv.appendChild(addBtn);
          subChoicesDiv.appendChild(floorDiv);
      }
  }

  // 模态框打开函数
  function openModal() {
      addModal.style.display = 'flex';
      newChoiceNameInput.value = '';
  }

  // 模态框关闭函数
  function closeModal() {
      addModal.style.display = 'none';
  }

  // 点击关闭按钮关闭模态框
  closeModalBtn.addEventListener('click', closeModal);

  // 点击模态框外部区域关闭模态框
  window.addEventListener('click', function (event) {
      if (event.target === addModal) {
          closeModal();
      }
  });

  // 渲染二次抽签选项（初始化时）
  renderSubChoicesSettings();
  setInterval(updateTime, 1000);
  updateTime();
});
