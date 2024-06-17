import { ZAttendanceData } from "./types";
import { CSV, CSVRow } from "./buildCSV";
import { z } from "zod";

const exportCSV = z.function(
  z.tuple([ZAttendanceData, z.boolean()]),
  z.string()
).implement((pData, isTSV = false) => {
  const csv = new CSV(
    ["日付", "勤怠区分", "勤務パターン", "出勤時間", "退勤時間", "総労働時間", "所定労働時間"] as const,
    isTSV
  )
  type Row = CSVRow<typeof csv>
  const add_rows = pData.table_data.rows.map(row => (
    row.display_pattern.name &&
    row.clock_in_times[0] &&
    row.clock_out_times[0] &&
    row.total_working_time &&
    row.prescribed_working_time &&
    [
      row.date_string,
      row.day_type,
      row.display_pattern.name,
      row.clock_in_times[0],
      row.clock_out_times[0],
      row.total_working_time.replace(/h$/, ""),
      row.prescribed_working_time.replace(/h$/, ""),
    ] as Row)).filter(row => Array.isArray(row))
  
  csv.add(add_rows)
  return csv.toString()
})

function addLinkButton(href: string) {
  console.log("addLinkButton")

  const button = document.createElement("button")
  button.className = "att-button size-md color-secondary"
  button.textContent = "CSVエクスポート"
  button.setAttribute("data-v-02fdb069", "")
  const link = document.createElement("a")
  link.className = "tw-mr-8 tw-flex tw-items-center"
  link.href = href
  link.download = `${generateFilename()}.csv`
  link.appendChild(button)
  document.querySelector("div > div.att-pc")?.prepend(link)
}

function addButton(textContent: string): HTMLButtonElement {
  console.log("addButton")

  const button = document.createElement("button")
  button.className = "att-button size-md color-secondary tw-mr-8"
  button.setAttribute("data-v-02fdb069", "")
  button.textContent = textContent
  document.querySelector("div > div.att-pc")?.prepend(button)
  return button
}

function generateFilename() {
  const nameEl: HTMLPreElement | null = document.querySelector("div>div>p")
  if (!nameEl) return
  return `日時勤怠_${nameEl.textContent}`
}

function main() {
  console.log("main")

  const attendanceDataStr = document.querySelector("div[data-aggregation-tables-props]")?.getAttribute("data-daily-attendances-table-props")
  if (!attendanceDataStr) return
  const attendanceData = JSON.parse(attendanceDataStr)
  const csvStr = exportCSV(attendanceData, false)
  const tsvStr = exportCSV(attendanceData, true)

  const blob = new Blob([csvStr], {type: "text/csv"})
  const url = URL.createObjectURL(blob)
  addLinkButton(url)
  const csvBtn = addButton("CSVをクリップボードにコピー")
  csvBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(csvStr)
    csvBtn.innerText = "コピーしました"
  })
  const tsvBtn = addButton("TSVをクリップボードにコピー")
  tsvBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(tsvStr)
    tsvBtn.innerText = "コピーしました"
  })
}

window.addEventListener("load", main)
