/**
 * Google Apps Script Connector
 * 
 * คัดลอกโค้ดนี้ไปวางใน Google Apps Script (Extensions > Apps Script) 
 * ของ Google Sheets ของคุณ เพื่อเชื่อมต่อข้อมูลกับระบบนี้
 */

const API_URL = "https://ais-dev-y6spklxiyf4owh4mznqi3a-534631140113.asia-east1.run.app/api/sync";

function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const payload = {
    timestamp: data[0],
    teacher: data[1],
    department: data[2],
    score: data[3],
    observer: data[4],
    comments: data[5]
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(API_URL, options);
    Logger.log("Data synced successfully");
  } catch (err) {
    Logger.log("Error syncing data: " + err);
  }
}

function setupTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
}
