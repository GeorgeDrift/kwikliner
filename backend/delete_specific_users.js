const pool = require('./db');

async function deleteSpecificUsers() {
    const emailsToDelete = ['georgechivalo01@gmail.com', 'yuyuy4297@gmail.com'];

    try {
        console.log('Attempting to delete specific users...');

        for (const email of emailsToDelete) {
            const result = await pool.query('DELETE FROM users WHERE email = $1', [email]);
            if (result.rowCount > 0) {
                console.log(`Successfully deleted user: ${email}`);
            } else {
                console.log(`User not found: ${email}`);
            }
        }

    } catch (err) {
        console.error('Error during deletion:', err);
    } finally {
        pool.end();
    }
}

deleteSpecificUsers();
