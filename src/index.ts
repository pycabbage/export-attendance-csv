import { ZAttendanceData } from "./types";
import { CSV, CSVRow } from "./buildCSV";
import { z } from "zod";

const exportCSV = z.function(
  z.tuple([ZAttendanceData]),
  z.string()
).implement(pData => {
  const csv = new CSV(["日付", "勤怠区分", "勤務パターン", "出勤時間", "退勤時間", "総労働時間", "所定労働時間"] as const)
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
      row.total_working_time,
      row.prescribed_working_time
    ] as Row)).filter(row => Array.isArray(row))
  
  csv.add(add_rows)
  return csv.toString()
})

function addLinkButton(href: string) {
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

function generateFilename() {
  const nameEl: HTMLPreElement | null = document.querySelector("div>div>p")
  if (!nameEl) return
  return `日時勤怠_${nameEl.textContent}`
}

function createBlobURL() {
  const attendanceDataStr = document.querySelector("div[data-aggregation-tables-props]")?.getAttribute("data-daily-attendances-table-props")
  if (!attendanceDataStr) return
  const attendanceData = JSON.parse(attendanceDataStr)
  const csvStr = exportCSV(attendanceData)

  const blob = new Blob([csvStr], {type: "text/csv"})
  const url = URL.createObjectURL(blob)
  return url
}

function main() {
  const blobURL = createBlobURL()
  if (!blobURL) return
  addLinkButton(blobURL)
}

// declare global {
//   interface Window { exportCSV(): void }
// }

// window.exportCSV = main
window.addEventListener("load", main)
