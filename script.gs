/**** CONFIG ****/
var EMAIL_TO = 'anastasiyaanastasiya510@gmail.com'; // Email for notifications
var SHEET_NAME = 'clicks'; // Name of the sheet to store data
var DEDUPE_SECONDS = 10; // Don't send more than 1 email per user within N seconds
/*****************/

/**
 * Ensure the clicks sheet exists with all necessary columns
 */
function ensureSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    
    // Create header row with all data fields
    var headers = [
      'Timestamp',
      'Date/Time',
      'User Agent',
      'Language',
      'Languages',
      'Platform',
      'Vendor',
      'Screen Width',
      'Screen Height',
      'Screen Color Depth',
      'Screen Pixel Depth',
      'Window Width',
      'Window Height',
      'Device Pixel Ratio',
      'Touch Points',
      'Cookies Enabled',
      'Do Not Track',
      'Online',
      'Timezone',
      'Timezone Offset',
      'Referrer',
      'Current URL',
      'Hardware Concurrency',
      'Device Memory',
      'Connection',
      'Is Mobile',
      'OS',
      'Browser',
      'Custom Params (JSON)'
    ];
    
    sheet.appendRow(headers);
    
    // Format header row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#667eea');
    headerRange.setFontColor('#ffffff');
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  
  return sheet;
}

/**
 * Main function to handle GET requests
 */
function doGet(e) {
  try {
    var sheet = ensureSheet();
    var timestamp = new Date();
    
    // Extract all parameters from the request
    var params = e.parameter || {};
    
    // Prepare row data in the same order as headers
    var rowData = [
      timestamp.getTime(), // Timestamp (numeric for sorting)
      timestamp.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }), // Formatted date/time
      params.userAgent || '',
      params.language || '',
      params.languages || '',
      params.platform || '',
      params.vendor || '',
      params.screenWidth || '',
      params.screenHeight || '',
      params.screenColorDepth || '',
      params.screenPixelDepth || '',
      params.windowWidth || '',
      params.windowHeight || '',
      params.devicePixelRatio || '',
      params.touchPoints || '',
      params.cookiesEnabled || '',
      params.doNotTrack || '',
      params.onLine || '',
      params.timezone || '',
      params.timezoneOffset || '',
      params.referrer || '',
      params.currentUrl || '',
      params.hardwareConcurrency || '',
      params.deviceMemory || '',
      params.connection || '',
      params.isMobile || '',
      params.os || '',
      params.browser || '',
      params.customParams || ''
    ];
    
    // Append data to sheet
    sheet.appendRow(rowData);
    
    // Send email notification (with deduplication)
    sendEmailNotification(params, timestamp);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data recorded successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error and return error response
    Logger.log('Error in doGet: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Send email notification with deduplication
 */
function sendEmailNotification(params, timestamp) {
  try {
    // Anti-duplicate mechanism
    var props = PropertiesService.getScriptProperties();
    var userKey = params.userAgent + '_' + params.timezone;
    var dedupeKey = 'last_mail_' + Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, userKey).join('');
    
    var lastEmailTime = Number(props.getProperty(dedupeKey) || 0);
    var currentTime = Math.floor(timestamp.getTime() / 1000);
    
    // Send email only if enough time has passed
    if ((currentTime - lastEmailTime) >= DEDUPE_SECONDS) {
      
      // Prepare email body
      var htmlBody = '<div style="font-family: Arial, sans-serif; max-width: 600px;">';
      htmlBody += '<h2 style="color: #667eea;">🔔 Новый переход по ссылке</h2>';
      htmlBody += '<p><strong>Время:</strong> ' + timestamp.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + '</p>';
      htmlBody += '<hr style="border: 1px solid #eee;">';
      
      // Device info
      htmlBody += '<h3 style="color: #764ba2;">📱 Информация об устройстве</h3>';
      htmlBody += '<table style="width: 100%; border-collapse: collapse;">';
      htmlBody += addTableRow('Устройство', params.os || 'Unknown');
      htmlBody += addTableRow('Браузер', params.browser || 'Unknown');
      htmlBody += addTableRow('Мобильное', params.isMobile || 'No');
      htmlBody += addTableRow('Платформа', params.platform || '—');
      htmlBody += addTableRow('User Agent', params.userAgent || '—');
      htmlBody += '</table>';
      
      // Screen info
      htmlBody += '<h3 style="color: #764ba2;">🖥 Экран</h3>';
      htmlBody += '<table style="width: 100%; border-collapse: collapse;">';
      htmlBody += addTableRow('Разрешение', (params.screenWidth || '—') + ' x ' + (params.screenHeight || '—'));
      htmlBody += addTableRow('Окно', (params.windowWidth || '—') + ' x ' + (params.windowHeight || '—'));
      htmlBody += addTableRow('Pixel Ratio', params.devicePixelRatio || '—');
      htmlBody += addTableRow('Сенсорный экран', (params.touchPoints > 0 ? 'Да' : 'Нет'));
      htmlBody += '</table>';
      
      // Location & Language
      htmlBody += '<h3 style="color: #764ba2;">🌍 Местоположение и язык</h3>';
      htmlBody += '<table style="width: 100%; border-collapse: collapse;">';
      htmlBody += addTableRow('Timezone', params.timezone || '—');
      htmlBody += addTableRow('Язык', params.language || '—');
      htmlBody += addTableRow('Языки', params.languages || '—');
      htmlBody += '</table>';
      
      // Traffic source
      htmlBody += '<h3 style="color: #764ba2;">🔗 Источник трафика</h3>';
      htmlBody += '<table style="width: 100%; border-collapse: collapse;">';
      htmlBody += addTableRow('Referrer', params.referrer || 'Прямой переход');
      htmlBody += addTableRow('URL', params.currentUrl || '—');
      htmlBody += '</table>';
      
      // Custom parameters if present
      if (params.customParams && params.customParams !== '{}') {
        htmlBody += '<h3 style="color: #764ba2;">🏷 Кастомные параметры</h3>';
        htmlBody += '<table style="width: 100%; border-collapse: collapse;">';
        try {
          var customParamsObj = JSON.parse(params.customParams);
          for (var key in customParamsObj) {
            if (customParamsObj.hasOwnProperty(key)) {
              htmlBody += addTableRow(key, customParamsObj[key]);
            }
          }
        } catch (e) {
          htmlBody += addTableRow('Raw', params.customParams);
        }
        htmlBody += '</table>';
      }
      
      // Technical info
      if (params.connection || params.hardwareConcurrency || params.deviceMemory) {
        htmlBody += '<h3 style="color: #764ba2;">⚙️ Техническая информация</h3>';
        htmlBody += '<table style="width: 100%; border-collapse: collapse;">';
        if (params.connection) htmlBody += addTableRow('Соединение', params.connection);
        if (params.hardwareConcurrency) htmlBody += addTableRow('Ядер процессора', params.hardwareConcurrency);
        if (params.deviceMemory) htmlBody += addTableRow('Память', params.deviceMemory + ' GB');
        htmlBody += addTableRow('Cookies', params.cookiesEnabled || '—');
        htmlBody += addTableRow('Online', params.onLine || '—');
        htmlBody += '</table>';
      }
      
      htmlBody += '<hr style="border: 1px solid #eee; margin-top: 20px;">';
      htmlBody += '<p style="color: #999; font-size: 12px;">Это автоматическое уведомление из Google Apps Script</p>';
      htmlBody += '</div>';
      
      // Send email
      MailApp.sendEmail({
        to: EMAIL_TO,
        subject: '🔔 Новый переход: ' + (params.browser || 'Unknown') + ' на ' + (params.os || 'Unknown'),
        htmlBody: htmlBody
      });
      
      // Update last email time
      props.setProperty(dedupeKey, String(currentTime));
      
      Logger.log('Email sent successfully');
    } else {
      Logger.log('Email skipped due to deduplication (within ' + DEDUPE_SECONDS + ' seconds)');
    }
    
  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
  }
}

/**
 * Helper function to create table rows for email
 */
function addTableRow(label, value) {
  return '<tr>' +
    '<td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 200px;">' + label + ':</td>' +
    '<td style="padding: 8px; border-bottom: 1px solid #eee;">' + value + '</td>' +
    '</tr>';
}

/**
 * Test function to verify sheet creation
 */
function testSheetCreation() {
  var sheet = ensureSheet();
  Logger.log('Sheet created/verified: ' + sheet.getName());
}

/**
 * Test function to simulate a click with custom parameters
 */
function testClick() {
  var testParams = {
    userAgent: 'Mozilla/5.0 (Test)',
    language: 'ru-RU',
    languages: 'ru-RU, en-US',
    platform: 'MacIntel',
    vendor: 'Google Inc.',
    screenWidth: '1920',
    screenHeight: '1080',
    windowWidth: '1366',
    windowHeight: '768',
    devicePixelRatio: '2',
    touchPoints: '0',
    cookiesEnabled: 'Yes',
    doNotTrack: '',
    onLine: 'Yes',
    timezone: 'Europe/Moscow',
    timezoneOffset: '-180',
    referrer: '',
    currentUrl: 'https://andreysafar.github.io/kliber/?source=test&campaign=demo',
    hardwareConcurrency: '8',
    deviceMemory: '8',
    connection: '4g (10Mbps)',
    isMobile: 'No',
    os: 'MacOS',
    browser: 'Chrome',
    customParams: '{"source":"test","campaign":"demo","location":"office"}'
  };
  
  var mockEvent = {
    parameter: testParams
  };
  
  var result = doGet(mockEvent);
  Logger.log('Test result: ' + result.getContent());
}

/**
 * Function to add headers to existing sheet
 * Run this once if your sheet doesn't have headers
 */
function addHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    Logger.log('Sheet not found. Creating new sheet with headers...');
    ensureSheet();
    return;
  }
  
  // Create header row with all data fields
  var headers = [
    'Timestamp',
    'Date/Time',
    'User Agent',
    'Language',
    'Languages',
    'Platform',
    'Vendor',
    'Screen Width',
    'Screen Height',
    'Screen Color Depth',
    'Screen Pixel Depth',
    'Window Width',
    'Window Height',
    'Device Pixel Ratio',
    'Touch Points',
    'Cookies Enabled',
    'Do Not Track',
    'Online',
    'Timezone',
    'Timezone Offset',
    'Referrer',
    'Current URL',
    'Hardware Concurrency',
    'Device Memory',
    'Connection',
    'Is Mobile',
    'OS',
    'Browser',
    'Custom Params (JSON)'
  ];
  
  // Insert new row at the top
  sheet.insertRowBefore(1);
  
  // Set headers
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  
  // Format header row
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('#ffffff');
  headerRange.setWrap(true);
  headerRange.setVerticalAlignment('middle');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  Logger.log('Headers added successfully!');
  SpreadsheetApp.getUi().alert('✅ Заголовки успешно добавлены!');
}

