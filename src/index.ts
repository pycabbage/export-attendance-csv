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

function main() {
  
}
