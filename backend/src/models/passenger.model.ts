import { pool } from '../db/pool';

export type Passenger = {
  id: string; // ticket_no
  name: string; // passenger_name
  phone: string | null;
  email: string | null;
};

// ? запариться с пагинацией
export const PassengerModel = {
  async findAll(): Promise<Passenger[]> {
    const result = await pool.query(`
      SELECT 
        ticket_no AS id,
        passenger_name AS name,
        contact_data->>'phone' AS phone,
        contact_data->>'email' AS email
      FROM bookings.tickets
      ORDER BY ticket_no
      LIMIT 20
    `);

    return result.rows;
  },

  async findById(id: string): Promise<Passenger | null> {
    const result = await pool.query(
      `
      SELECT
        ticket_no AS id,
        passenger_name AS name,
        contact_data->>'phone' AS phone,
        contact_data->>'email' AS email
      FROM bookings.tickets
      WHERE ticket_no = $1
      `,
      [id],
    );

    return result.rows[0] || null;
  },

  async create(data: Passenger): Promise<Passenger> {
    const phone = data.phone ?? null;
    const email = data.email ?? null;

    const result = await pool.query(
      `
    INSERT INTO bookings.tickets 
      (ticket_no, book_ref, passenger_id, passenger_name, contact_data)
    VALUES 
      (
        $1,
        '00000F',
        'TEMP_ID',
        $2,
        jsonb_build_object(
          'phone', $3::text,
          'email', $4::text
        )
      )
    RETURNING 
      ticket_no AS id,
      passenger_name AS name,
      contact_data->>'phone' AS phone,
      contact_data->>'email' AS email
    `,
      [data.id, data.name, phone, email],
    );

    return result.rows[0];
  },

  // async create(data: Passenger): Promise<Passenger> {
  //   const result = await pool.query(
  //     `
  //     INSERT INTO bookings.tickets
  //       (ticket_no, book_ref, passenger_id, passenger_name, contact_data)
  //     VALUES
  //       ($1, '000000', 'TEMP_ID', $2, jsonb_build_object('phone', $3, 'email', $4))
  //     RETURNING
  //       ticket_no AS id,
  //       passenger_name AS name,
  //       contact_data->>'phone' AS phone,
  //       contact_data->>'email' AS email
  //     `,
  //     [data.id, data.name, data.phone, data.email],
  //   );

  //   return result.rows[0];
  // },

  async update(
    id: string,
    data: Partial<Passenger>,
  ): Promise<Passenger | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const name = data.name ?? existing.name;
    const phone = data.phone ?? existing.phone;
    const email = data.email ?? existing.email;

    const result = await pool.query(
      `
    UPDATE bookings.tickets
    SET 
      passenger_name = $2,
      contact_data = jsonb_build_object(
        'phone', $3::text,
        'email', $4::text
      )
    WHERE ticket_no = $1
    RETURNING 
      ticket_no AS id,
      passenger_name AS name,
      contact_data->>'phone' AS phone,
      contact_data->>'email' AS email
    `,
      [id, name, phone, email],
    );

    return result.rows[0] || null;
  },

  // async update(
  //   id: string,
  //   data: Partial<Passenger>,
  // ): Promise<Passenger | null> {
  //   const existing = await this.findById(id);
  //   if (!existing) return null;

  //   const name = data.name ?? existing.name;
  //   const phone = data.phone ?? existing.phone;
  //   const email = data.email ?? existing.email;

  //   const result = await pool.query(
  //     `
  //     UPDATE bookings.tickets
  //     SET
  //       passenger_name = $2,
  //       contact_data = jsonb_build_object('phone', $3, 'email', $4)
  //     WHERE ticket_no = $1
  //     RETURNING
  //       ticket_no AS id,
  //       passenger_name AS name,
  //       contact_data->>'phone' AS phone,
  //       contact_data->>'email' AS email
  //     `,
  //     [id, name, phone, email],
  //   );

  //   return result.rows[0] || null;
  // },

  async delete(id: string): Promise<Passenger | null> {
    const result = await pool.query(
      `
      DELETE FROM bookings.tickets
      WHERE ticket_no = $1
      RETURNING 
        ticket_no AS id,
        passenger_name AS name,
        contact_data->>'phone' AS phone,
        contact_data->>'email' AS email
      `,
      [id],
    );

    return result.rows[0] || null;
  },
};
