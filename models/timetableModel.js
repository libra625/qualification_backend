const pool = require("../utils/db");

exports.getAll = async () => {
    const result = await pool.query(
        `
            SELECT t.*
            FROM timetable t
            WHERE t.psychologist_id = $1
              AND NOT EXISTS (
                SELECT 1
                FROM consultation c
                WHERE c.psychologist_id = t.psychologist_id
                  AND c.day_of_week = t.day_of_week::weekday
                  AND c.time = t.start_time
            )
        `,
        [1]
    );

    return result.rows;
};

exports.create = async ({
                            day_of_week,
                            start_time,
                            end_time,
                            is_online,
                            link
                        }) => {
    const result = await pool.query(
        `INSERT INTO timetable
             (day_of_week, start_time, end_time, is_online, link, psychologist_id)
         VALUES ($1, $2::time, $3::time, $4, $5, $6)
         RETURNING *`,
        [
            day_of_week.toLowerCase(),
            start_time,   // "09:00"
            end_time,     // "10:00"
            is_online,
            link,
            1
        ]
    );

    return result.rows[0];
};

exports.update = async (
    id,
    {
        day_of_week,
        start_time,
        end_time,
        is_online,
        link
    }
) => {
    const result = await pool.query(
        `UPDATE timetable
         SET day_of_week = $1,
             start_time = $2::time,
             end_time = $3::time,
             is_online = $4,
             link = $5
         WHERE timetable_id = $6 AND psychologist_id = $7
         RETURNING *`,
        [
            day_of_week.toLowerCase(),   // ensure ENUM match
            start_time,                 // format: "09:00" or "09:00:00"
            end_time,                   // format: "10:00"
            is_online,
            link,
            id,
            1
        ]
    );

    return result.rows[0];
};