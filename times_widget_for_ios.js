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

  // Add next prayer and time remaining to title row
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

function createLargeWidget(timings) {

  const widget = new ListWidget()
  widget.backgroundColor = new Color("#1A1A1A")
  let title = widget.addText("Prayer Times")
  title.font = Font.boldSystemFont(16)
  title.textColor = Color.white()
  title.leftAlignText()
  widget.addSpacer(8)

  for (const [prayer, time] of Object.entries(timings)) {

    if (prayer === "Next") continue

    const row = widget.addStack()
    row.layoutHorizontally()
    row.centerAlignContent()

    const prayerText = row.addText(prayer)
    prayerText.font = Font.systemFont(14)
    prayerText.textColor = Color.white()
    prayerText.leftAlignText()

    row.addSpacer()

    const timeText = row.addText(time)
    timeText.font = Font.systemFont(14)
    timeText.textColor = Color.white()
    timeText.rightAlignText()

    widget.addSpacer(4)
  }

  widget.addSpacer(12)

  const next = timings["Next"]

  if (next) {

    const nextRow = widget.addStack()
    nextRow.layoutHorizontally()
    nextRow.centerAlignContent()

    const nextText = nextRow.addText(`Next: ${next.prayer} in ${next.hours}h ${next.minutes}m`)
    nextText.font = Font.systemFont(14)
    nextText.textColor = Color.orange()
    nextText.leftAlignText()
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

  } else if (config.widgetFamily === "large") {

    return createLargeWidget(timings)

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
    console.log(testReq)
    return true
  } catch (err) {
    return false
  }
}

const isInternetOk = await hasGoodInternet(2)
const output = {}

if (isInternetOk) {

  Location.setAccuracyToHundredMeters()
  const loc = await Location.current()
  const latitude = loc.latitude
  const longitude = loc.longitude

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
  console.log(timings)

  const fm = FileManager.local()
  const dir = fm.documentsDirectory()
  const filePath = fm.joinPath(dir, "prayer_timings.json")
  console.log(filePath)
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
  console.log(filePath)

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

    console.log("No Connection")
    output["Error"] = "No Internet Connection and No Cached Data Available"
  }
}

const widget = createWidget(output["timings"] || {})

if (!config.runsInWidget) {

  await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

