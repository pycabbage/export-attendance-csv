import { z } from "zod"

const ZTimeString = z.string().regex(/^\d{2}:\d{2}$/).or(z.null())
const ZHourString = z.string().regex(/^\d{2}:\d{2}h$/).or(z.null())
const ZNullOrAny = z.null().or(z.any())
const ZAnyArray = z.any().array()

export const ZAttendanceData = z.object({
  table_data: z.object({
    header: z.object({
      can_open_detail: z.boolean(),
      can_edit: z.boolean(),
      can_request_work_flow: z.boolean(),
      enabled_inclusive_display_of_overtime: ZNullOrAny,
      custom_counter_pattern_names: ZAnyArray
    }),
    rows: z.array(z.object({
      detail_path: z.string(),
      edit_path: z.string(),
      request_paths: z.object({
        attendance_path: z.string(),
        arrival_later_path: z.string(),
        early_departure_path: z.string(),
        late_overtime_work_path: z.string(),
        early_overtime_work_path: z.string(),
        absence_path: z.string(),
        leave_path: z.string(),
        holiday_work_path: z.string(),
        show_menu_upper: z.boolean()
      }),
      /** 日付 */
      date_string: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      /** 勤怠区分 */
      day_type: z.union([
        z.literal("平日"),
        z.literal("所定休日"),
        z.string()
      ]),
      workflow_request_statuses: ZAnyArray,
      /** 勤務パターン */
      display_pattern: z.object({
        name: z.union([
          z.literal("フレックス通常"),
          z.string(),
          z.null()
        ]),
        substitution_leave_tooltip: ZNullOrAny
      }),
      clock_in_types: z.string().array(),
      /** 出勤時間 */
      clock_in_times: ZTimeString.array(),
      clock_out_types: z.string().array(),
      /** 退勤時間 */
      clock_out_times: ZTimeString.array(),
      start_break_times: ZAnyArray,
      end_break_times: ZAnyArray,
      /** 総労働時間 */
      total_working_time: ZHourString.describe("総労働時間"),
      /** 所定労働時間 */
      prescribed_working_time: ZHourString.describe("所定労働時間"),
      total_prescribed_working_time: ZHourString,
      overtime_working_time: ZNullOrAny,
      extra_allowance_working_time: ZNullOrAny,
      total_extra_allowance_working_time: ZNullOrAny,
      prescribed_midnight_working_time: ZNullOrAny,
      overtime_midnight_working_time: ZNullOrAny,
      extra_allowance_midnight_working_time: ZNullOrAny,
      total_midnight_working_time: ZNullOrAny,
      total_overtime_inclusive_display_working_time: ZHourString,
      arrival_later_time: ZNullOrAny,
      early_departure_time: ZNullOrAny,
      /** 休憩時間 */
      total_break_time: ZHourString.describe("休憩時間"),
      prescribed_de_facto_working_time_of_day_leave_time: ZNullOrAny,
      overtime_de_facto_working_time_of_day_leave_tdaily_attendance_item: ZNullOrAny,
      extra_allowance_de_facto_working_time_of_day_leave_time: ZNullOrAny,
      custom_counter_values: ZAnyArray,
      note: z.string(),
      alert_levels: z.object({
        all: ZNullOrAny,
        base: ZNullOrAny,
        clock_in: ZNullOrAny,
        clock_out: ZNullOrAny,
        start_break: ZNullOrAny,
        end_break: ZNullOrAny
      }),
      alerts: z.object({
        base: ZAnyArray,
        clock_in: ZAnyArray,
        clock_out: ZAnyArray,
        start_break: ZAnyArray,
        end_break: ZAnyArray
      })
    }))
  })
})
