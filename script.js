// JavaScript 邏輯

document.addEventListener("DOMContentLoaded", (event) => {
  const birthDateInput = document.getElementById("birthDate");
  const calculateButton = document.getElementById("calculateButton");
  const resultDiv = document.getElementById("result");
  const lastResultP = document.getElementById("lastResult");
  const localStorageKey = "dogAgeCalculatorResult";

  /**
   * 根據狗狗的出生日期計算其年齡和相對應的人類年齡。
   */
  function calculateDogAge() {
    const birthDateStr = birthDateInput.value;
    if (!birthDateStr) {
      alert("請選擇一個有效的出生日期！");
      return;
    }

    const birthDate = new Date(birthDateStr);
    const today = new Date();

    // 檢查日期是否有效且不超過今天
    if (isNaN(birthDate.getTime()) || birthDate > today) {
      alert("請輸入一個有效的且不超過今天的日期！");
      return;
    }

    // 計算狗狗的實際年齡（以年為單位）
    const ageInMilliseconds = today - birthDate;
    // 365.25 用來考慮閏年
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

    // 四捨五入到小數點後一位作為狗狗年齡顯示
    const dogAge = parseFloat(ageInYears.toFixed(1));

    // 使用文獻提供的公式計算人類年齡：
    // 人類年齡 = 16 * ln(狗狗年齡) + 31
    let humanAge;
    if (dogAge > 0) {
      // 使用 Math.log() 進行自然對數 (ln) 計算
      humanAge = 16 * Math.log(ageInYears) + 31; // 使用未四捨五入的精確年齡來計算
      // 四捨五入到小數點後一位
      humanAge = parseFloat(humanAge.toFixed(1));
    } else {
      // 處理出生日當天或日期極小的情況
      humanAge = 31;
    }

    // 組合輸出結果字串
    const resultText = `
            <p>現在大約 <strong>${dogAge}</strong> 歲的狗年齡</p>
            <p>換算成人類年齡大約是 <strong>${humanAge}</strong> 歲</p>
        `;

    // 顯示結果
    resultDiv.innerHTML = resultText;
    lastResultP.textContent = `出生日期: ${birthDateStr}`;

    // --- Local Storage 功能：儲存本次運算結果 ---
    const storageData = {
      birthDate: birthDateStr,
      dogAge: dogAge,
      humanAge: humanAge,
      timestamp: new Date().toLocaleString(),
    };
    localStorage.setItem(localStorageKey, JSON.stringify(storageData));
  }

  /**
   * 頁面載入時檢查並顯示 Local Storage 中的上次結果。
   */
  function loadLastResult() {
    const storedData = localStorage.getItem(localStorageKey);

    if (storedData) {
      const data = JSON.parse(storedData);

      // 設置上次的輸入日期
      birthDateInput.value = data.birthDate;

      // 顯示上次的運算結果
      const resultText = `
                <p>現在大約 <strong>${data.dogAge}</strong> 歲的狗年齡</p>
                <p>換算成人類年齡大約是 <strong>${data.humanAge}</strong> 歲</p>
            `;
      resultDiv.innerHTML = resultText;

      lastResultP.textContent = `上次計算於 ${data.timestamp}`;
    } else {
      lastResultP.textContent = ""; // 如果沒有上次的結果則清空
    }
  }

  // 監聽按鈕點擊事件
  calculateButton.addEventListener("click", calculateDogAge);

  // 頁面載入時執行：載入上次結果
  loadLastResult();
});
