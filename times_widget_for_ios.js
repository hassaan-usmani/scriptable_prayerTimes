// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: moon;
async function updateCode(hasGoodInternet) {

  if (!hasGoodInternet) {
    return "No Internet"
  }

  let files = FileManager.local()
  const iCloudInUse = files.isFileStoredIniCloud(module.filename)
  files = iCloudInUse ? FileManager.iCloud() : files

  try {

    // Fetch the latest code from GitHub and overwrite the current file, also fetch the guide file to display for user reference
    const url = "https://raw.githubusercontent.com/hassaan-usmani/scriptable_prayerTimes/main/times_widget_for_ios.js"
    const guideUrl = "https://raw.githubusercontent.com/hassaan-usmani/scriptable_prayerTimes/main/guide.html"
    const req = new Request(url)
    const guideReq = new Request(guideUrl)
    const guideString = await guideReq.loadString()
    const guidePath = files.joinPath(files.documentsDirectory(), "prayer_times_guide.html")
    files.writeString(guidePath, guideString)
    const codeString = await req.loadString()
    files.writeString(module.filename, codeString)
    return "The code has been updated."

  } catch (err) {

    console.log("Failed to update code:", err)
    return "Failed to update code."
  }
}

// Create a function that would run a menu if not running in widget
async function runMenu() {

  const alert = new Alert()
  alert.title = "Prayer Times Widget"
  alert.message = "This script creates a widget displaying daily prayer times based on your location. You can add the widget to your home screen or lock screen.\n\nChoose an option below:"
  alert.addAction("View Guide")
  alert.addAction("Check for Updates")
  alert.addCancelAction("Close")
  const response = await alert.present()

  if (response === 0) {

    // Retrieve the guide file, check if its stored in iCloud

    let fm = FileManager.local()
    const iCloudInUse = fm.isFileStoredIniCloud(module.filename)
    fm = iCloudInUse ? FileManager.iCloud() : fm

    const dir = fm.documentsDirectory()
    const guidePath = fm.joinPath(dir, "prayer_times_guide.html")

    // Web view loads the file, not the path string, it requires the html string
    const webView = new WebView()
    const guideString = fm.readString(guidePath)
    await webView.loadHTML(guideString, null)
    webView.present()

  } else if (response === 1) {

    const isInternetOk = await hasGoodInternet(2)
    const updateMessage = await updateCode(isInternetOk)

    const updateAlert = new Alert()
    updateAlert.title = "Update Status"
    updateAlert.message = updateMessage
    updateAlert.addAction("OK")
    await updateAlert.present()
  }

  return
}


function createSmallWidget(timings) {

  const widget = new ListWidget()
  widget.backgroundColor = new Color("#1A1A1A")
  const titleRow = widget.addStack()

  titleRow.layoutHorizontally()
  titleRow.centerAlignContent()
  let title = titleRow.addText("Times")
  title.font = Font.boldSystemFont(13)
  title.textColor = Color.white()
  title.leftAlignText()

  titleRow.addSpacer()
  const next = timings["Next"]
  if (next) {

    const nextText = titleRow.addText(`Next: ${next.prayer}`)
    nextText.font = Font.systemFont(11)
    nextText.textColor = Color.orange()
    nextText.rightAlignText()
  }

  widget.addSpacer(2)

  for (const [prayer, time] of Object.entries(timings)) {

    if (prayer === "Next") continue

    const row = widget.addStack()
    row.layoutHorizontally()
    row.centerAlignContent()

    const prayerText = row.addText(prayer)
    prayerText.font = Font.systemFont(12)
    prayerText.textColor = Color.white()
    prayerText.leftAlignText()

    row.addSpacer()

    const timeText = row.addText(time)
    timeText.font = Font.systemFont(12)
    timeText.textColor = Color.white()
    timeText.rightAlignText()

    widget.addSpacer(1)
  }

  return widget
}

function createMediumWidget(timings) {

  const widget = new ListWidget()
  widget.backgroundColor = new Color("#1A1A1A")
  const titleRow = widget.addStack()

  titleRow.layoutHorizontally()
  titleRow.centerAlignContent()
  let title = titleRow.addText("Prayer Times")
  title.font = Font.boldSystemFont(15)
  title.textColor = Color.white()
  title.leftAlignText()

  titleRow.addSpacer()
  const next = timings["Next"]
  if (next) {

    if (next.hours === 0) {

      const nextText = titleRow.addText(`Next: ${next.prayer} in ${next.minutes}m`)
      nextText.font = Font.systemFont(13)
      nextText.textColor = Color.orange()
      nextText.rightAlignText()

    } else {

      const nextText = titleRow.addText(`Next: ${next.prayer} in ${next.hours}h ${next.minutes}m`)
      nextText.font = Font.systemFont(13)
      nextText.textColor = Color.orange()
      nextText.rightAlignText()
    }
  }

  widget.addSpacer(4)

  for (const [prayer, time] of Object.entries(timings)) {

    if (prayer === "Next") continue

    const row = widget.addStack()
    row.layoutHorizontally()
    row.centerAlignContent()

    const prayerText = row.addText(prayer)
    prayerText.font = Font.systemFont(13)
    prayerText.textColor = Color.white()
    prayerText.leftAlignText()

    row.addSpacer()

    const timeText = row.addText(time)
    timeText.font = Font.systemFont(13)
    timeText.textColor = Color.white()
    timeText.rightAlignText()

    widget.addSpacer(1)
  }

  return widget
}

function createLockscreenWidget(timings) {

  const widget = new ListWidget()
  widget.backgroundColor = new Color("#1a1a1aff")

  const next = timings["Next"]

  if (next) {
    
    let prayerNameText = ""
    
    switch (next.prayer) {
      case "Dhuhr":
        prayerNameText = "Duhr"
        break
      case "Maghreb":
        prayerNameText = "Mghrb"
        break
      case "Midnight":
        prayerNameText = "Night"
        break
      default:
        prayerNameText = next.prayer
    }
    
    let prayerName = widget.addText(`${prayerNameText}`)

    switch (next.prayer) {
      case "Fajr":
        prayerName.font = Font.boldSystemFont(15)
        break
      case "Dhuhr":
        prayerName.font = Font.boldSystemFont(14)
        break
      case "Asr":
        prayerName.font = Font.boldSystemFont(16)
        break
      case "Maghreb":
        prayerName.font = Font.boldSystemFont(12)
        break
      case "Isha":
        prayerName.font = Font.boldSystemFont(15)
        break
      case "Midnight":
        prayerName.font = Font.boldSystemFont(13)
        break
      default:
        prayerName.font = Font.boldSystemFont(16)
    }

    prayerName.textColor = Color.white()
    prayerName.centerAlignText()
    widget.addSpacer(4)
    let prayerTime = widget.addText(`${timings[next.prayer].split(" ")[0]}`)
    prayerTime.font = Font.systemFont(14)
    prayerTime.textColor = Color.white()
    prayerTime.centerAlignText()

  } else {

    let noData = widget.addText("No Data")
    noData.font = Font.systemFont(14)
    noData.textColor = Color.white()
    noData.centerAlignText()
  }

  return widget
}

function createWidget(timings) {

  if (config.widgetFamily === "medium") {

    return createMediumWidget(timings)

  } else if (config.widgetFamily === "small") {

    return createSmallWidget(timings)

  } else {

    return createLockscreenWidget(timings)
  }
}

function formatPrayerTimes(timings) {

  const rows = [
    ["Fajr", "Fajr"],
    ["Sunrise", "Sunrise"],
    ["Dhuhr", "Dhuhr"],
    ["Asr", "Asr"],
    ["Maghrib", "Maghreb"],
    ["Isha", "Isha"],
    ["Midnight", "Midnight"],
  ]

  function to12h(time24) {

    if (!time24) return "--:--"

    const match = String(time24).match(/(\d{1,2}):(\d{2})/)
    if (!match) return "--:--"

    let h = parseInt(match[1], 10)
    const m = match[2]

    const suffix = h >= 12 ? "PM" : "AM"
    h = h % 12
    if (h === 0) h = 12

    return `${h}:${m} ${suffix}`
  }

  const formattedTimings = {}

  for (const [key, label] of rows) {

    formattedTimings[label] = to12h(timings[key])
  }

  return formattedTimings

}

function getTimeUntilNextPrayer(timings) {

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghreb", "Isha", "Midnight"]
  let nextPrayer = null
  let nextPrayerTime = null

  for (const prayer of prayerOrder) {

    const timeStr = timings[prayer]
    const [time, meridiem] = timeStr.split(" ")
    let [hours, minutes] = time.split(":").map(Number)

    if (meridiem === "PM" && hours !== 12) {

      hours += 12

    } else if (meridiem === "AM" && hours === 12) {

      hours = 0
    }

    const prayerMinutes = hours * 60 + minutes

    if (prayerMinutes > currentMinutes) {

      nextPrayer = prayer
      nextPrayerTime = prayerMinutes
      break
    }
  }

  if (!nextPrayer) {

    nextPrayer = "Fajr"
    const timeStr = timings[nextPrayer]
    const [time, meridiem] = timeStr.split(" ")
    let [hours, minutes] = time.split(":").map(Number)

    if (meridiem === "PM" && hours !== 12) {

      hours += 12

    } else if (meridiem === "AM" && hours === 12) {

      hours = 0
    }

    nextPrayerTime = hours * 60 + minutes + 24 * 60 
  }

  const minutesUntilNext = nextPrayerTime - currentMinutes
  const hoursUntilNext = Math.floor(minutesUntilNext / 60)
  const minsUntilNext = minutesUntilNext % 60

  return {
    prayer: nextPrayer,
    hours: hoursUntilNext,
    minutes: minsUntilNext
  }
}

async function hasGoodInternet(timeoutSeconds = 2) {

  try {

    const testReq = new Request("https://clients3.google.com/generate_204")
    testReq.method = "GET"
    testReq.timeoutInterval = timeoutSeconds
    await testReq.load()
    return true
  } catch (err) {
    return false
  }
}

async function checkLocationPermission() {

  try {

    Location.setAccuracyToHundredMeters()
    await Location.current()
    return true

  } catch (err) {

    return false
  }
}

async function retrieveLocation() {

  if (await checkLocationPermission()) {

    Location.setAccuracyToHundredMeters()
    const loc = await Location.current()
    const latitude = loc.latitude
    const longitude = loc.longitude

    return {

      latitude: latitude,
      longitude: longitude
    }

  } else {

    const fm = FileManager.local()
    const dir = fm.documentsDirectory()
    const filePath = fm.joinPath(dir, "prayer_timings.json")

    if (fm.fileExists(filePath)) {

      const jsonString = fm.readString(filePath)
      const data = JSON.parse(jsonString)
      const latitude = data.data.meta.latitude
      const longitude = data.data.meta.longitude

      return {

        latitude: latitude,
        longitude: longitude
      }

    } else {

      return null
    }
  }
}

const isInternetOk = await hasGoodInternet(2)
const output = {}

if (isInternetOk) {

  const location = await retrieveLocation()

  if (!location) {

    output["Error"] = "Location Permission Denied and No Cached Data Available"
    const widget = createWidget(output["timings"] || {})
    Script.setWidget(widget)
    Script.complete()
  }

  const latitude = location.latitude
  const longitude = location.longitude

  function formatDateDDMMYYYY(date) {

    const dd = String(date.getDate()).padStart(2, "0")
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const yyyy = date.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  const formattedDate = formatDateDDMMYYYY(new Date())

  const url = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}`

  const req = new Request(url)
  req.method = "GET"
  const data = await req.loadJSON()
  const timings = data.data.timings

  const fm = FileManager.local()
  const dir = fm.documentsDirectory()
  const filePath = fm.joinPath(dir, "prayer_timings.json")
  fm.writeString(filePath, JSON.stringify(data, null, 2))

  const formattedTimes = formatPrayerTimes(timings)
  const remaining = getTimeUntilNextPrayer(formattedTimes)

  formattedTimes["Next"] = {
    prayer: remaining.prayer,
    hours: remaining.hours,
    minutes: remaining.minutes
  }

  output["timings"] = formattedTimes

} else {
  
  const fm = FileManager.local()
  const dir = fm.documentsDirectory()
  const filePath = fm.joinPath(dir, "prayer_timings.json")

  if (fm.fileExists(filePath)) {

    const jsonString = fm.readString(filePath)
    const data = JSON.parse(jsonString)
    const timings = data.data.timings
    const formattedTimes = formatPrayerTimes(timings)

    const remaining = getTimeUntilNextPrayer(formattedTimes)

    formattedTimes["Next"] = {
      prayer: remaining.prayer,
      hours: remaining.hours,
      minutes: remaining.minutes
    }
    
    output["timings"] = formattedTimes

  } else {

    output["Error"] = "No Internet Connection and No Cached Data Available"
  }
}

if (output["Error"]) {

  const widget = new ListWidget()
  widget.backgroundColor = new Color("#1A1A1A")
  let errorText = widget.addText("Error:")
  errorText.font = Font.boldSystemFont(14)
  errorText.textColor = Color.red()
  widget.addSpacer(4)
  let messageText = widget.addText(output["Error"])
  messageText.font = Font.systemFont(13)
  messageText.textColor = Color.white()
  messageText.leftAlignText()

  Script.setWidget(widget)
  Script.complete()

} else {

  const widget = createWidget(output["timings"] || {})
  Script.setWidget(widget)
}

if (!config.runsInWidget) {

  await runMenu()
}

Script.complete()

