const addTicketBtn = document.querySelector('#jsAddTicketBtn');
const userSelectArea = document.querySelector('#jsUserSelect');
const selectAreaList = document.querySelector('#jsSpotList');
const searchItemNums = document.querySelector('#jsSearchItemNums');

const ticketName = document.querySelector('#ticketName');
const ticketImgUrl = document.querySelector('#ticketImgUrl');
const ticketSpotRegion = document.querySelector('#ticketSpotRegion');
const ticketPrice = document.querySelector('#ticketPrice');
const ticketStar = document.querySelector('#ticketStar');
const ticketAmount = document.querySelector('#ticketAmount');

const formCheck = document.querySelector('.needs-validation');

userSelectArea.addEventListener('change',updateArea);
addTicketBtn.addEventListener('click', addTicket);
ticketStar.addEventListener('input',limitAlert);
ticketPrice.addEventListener('input',limitAlert);
ticketAmount.addEventListener('input',limitAlert);

let dataArray = [];
let filterData = dataArray;

//#region axios
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
  .then(function (response) {
    console.log('資料有回傳了');  
    dataArray = response.data.data;
    init();
  })
  .catch(function (error) {
    console.log(error);
  });
//#endregion

//#region 網頁初始狀態
function init(){
  showTicket(dataArray);
  showDonutChart();
}
//#endregion

//#region 顯示套票資訊
function showTicket(spotData){
  spotList = "";
  spotData.forEach(function(item){
    let spotItem = `
      <div class="col-md-4 mb-5">
        <a class="spotListItem card h-100" href="#">
          <div class="spotRegionTag">${item.area}</div>
          <img src="${item.imgUrl}" class="card-img-top" alt="...">
          <div class="card-body mb-3">
            <div class="spotReginStar bgPrimary">${item.rate}</div>
            <h5 class="spotTitle card-title">${item.name}</h5>
            <p class="spotDescribe card-text">${item.description}</p>
          </div>
          <div class="card-footer textPrimary d-flex justify-content-between align-items-center">
            <p class="">
              <i class="fas fa-exclamation-circle"></i>
              剩下最後 ${item.group} 組
            </p>
            <p class="d-flex align-items-center">TWD<span class="fontSizeL ms-2">$${item.price}</span></p>
          </div>
        </a>
      </div>
    `;
    spotList += spotItem;
  });
  selectAreaList.innerHTML = spotList;
  searchItemNums.textContent = `${spotData.length}`;
}
//#endregion

//#region 搜尋篩選
function updateArea(){
  spotList = "";
  // 使用者選擇"全部區域""
  if(userSelectArea.value == "全部地區"){
    showTicket(dataArray);
    return;
  }else{
    // 根據使用者選擇的區域篩選資料[]
    filterData = dataArray.filter(item => item.area == userSelectArea.value);
    showTicket(filterData);
  }
}
//#endregion

//#region 新增套票
function addTicket(){
  let newTicket = {
    id: dataArray.length,
    name: document.querySelector('#ticketName').value,
    imgUrl: document.querySelector('#ticketImgUrl').value,
    area: document.querySelector('#ticketSpotRegion').value,
    description: document.querySelector('#ticketDescribe').value,
    group: document.querySelector('#ticketAmount').value,
    price: document.querySelector('#ticketPrice').value,
    rate: document.querySelector('#ticketStar').value
  };
  dataArray.unshift(newTicket);
  showTicket(dataArray);
  showDonutChart();
  document.querySelector('#ticketName').value = "";
  document.querySelector('#ticketImgUrl').value = "";
  document.querySelector('#ticketSpotRegion').value = "";
  document.querySelector('#ticketDescribe').value = "";
  document.querySelector('#ticketAmount').value = "";
  document.querySelector('#ticketPrice').value = "";
  document.querySelector('#ticketStar').value = "";
}
//#endregion

//#region 限制用鍵盤輸入套票星級
function limitAlert(e){
  if((e.target.id == 'ticketStar') && (e.target.value < 1 || e.target.value > 10)){
    alert(`${this.name}區間為 1 - 10 分，請重新輸入星級!`);
    e.target.value = "";  
  }
  else if(e.target.value < 1){
    alert(`${this.name}必須大於 0 ，請重新輸入!`);
    e.target.value = "";
  }
}
//#endregion

//#region 圖表 c3.js donut chart
function showDonutChart(){
  let keyList = {};
  dataArray.forEach(function(item,index){
    if(keyList[item.area] == undefined){
      keyList[item.area] = 1;
    }else{
      keyList[item.area] += 1;
    }
  });
  let keyItem = Object.keys(keyList);

  c3.generate({
    bindto: "#jsAreaDonut",
    data: {
        columns: [
            [`${keyItem[0]}`, `${keyList[keyItem[0]]}`],
            [`${keyItem[1]}`, `${keyList[keyItem[1]]}`],
            [`${keyItem[2]}`, `${keyList[keyItem[2]]}`],
        ],
        type : 'donut',
        colors:{
          "高雄":"#E68618",
          "台中":"#5151D3",
          "台北":"#26BFC7"
        },
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    donut: {
        title: "套票地區比重"
    }
  });
}
//#endregion
