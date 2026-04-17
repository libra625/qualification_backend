const pool = require("../utils/db");

exports.getAll = async () => {
    const result = await pool.query(
        "SELECT * FROM timetable WHERE psychologist_id = $1",
        [1]
    );
    return result.rows;
};

exports.create = async ({
                            day_of_week,
                            start_time,
                            end_time,
                            frequency,
                            is_online,
                            link
                        }) => {
    const result = await pool.query(
        `INSERT INTO timetable
         (day_of_week, start_time, end_time, frequency, is_online, link, psychologist_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [day_of_week, start_time, end_time, frequency, is_online, link, 1]
    );

    return result.rows[0];
};

exports.update = async (
    id,
    {
        day_of_week,
        start_time,
        end_time,
        frequency,
        is_online,
        link
    }
) => {
    const result = await pool.query(
        `UPDATE timetable
         SET day_of_week = $1,
             start_time = $2,
             end_time = $3,
             frequency = $4,
             is_online = $5,
             link = $6
         WHERE timetable_id = $7 AND psychologist_id = $8
         RETURNING *`,
        [day_of_week, start_time, end_time, frequency, is_online, link, id, 1]
    );

    return result.rows[0];
};